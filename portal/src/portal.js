/**
 * App Shell（PT-1）— データロード・ルーティング・レイアウト合成・フォーカス管理。
 * 静的 SPA（ADQ1=A）。data/ の静的 JSON を読み、ハッシュルートに応じてビューを描画する。
 *
 * シェル/描画は Core 自前サイト（vendor/core/portal.css）の DOM 規約に準拠（F-6 方針A）:
 *   - プロファイル切替 = radiogroup（.portal-profile）。availability/コード/a11y/端末幅は
 *     body.fig-profile-* による CSS 駆動（再描画不要）。
 *   - ドキュメント検索オーバーレイ（Ctrl/⌘+K）。
 *   - サイドバーは独立スクロール（.portal-sidebar sticky + overflow）。
 *   - 概要のコンポーネント項目は data-avail-* + N/A/注意 バッジ（CSS 連動）。
 */
import { ui } from './state.js';
import { buildNav } from './nav.js';
import { createRouter, parseRoute, DEFAULT_ROUTE } from './router.js';
import { renderHome, renderOverview, renderDeveloper, renderProjects, renderOps, renderUsage, notFound } from './views.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ───────────── アイコン（Core index.html 準拠） ───────────── */
const ICON = {
  admin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="14" height="14"><rect x="2" y="4" width="20" height="14" rx="2"/><line x1="8" y1="20" x2="16" y2="20"/><line x1="12" y1="18" x2="12" y2="20"/></svg>',
  consumer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="14" height="14"><rect x="6" y="2" width="12" height="20" rx="2"/><line x1="11" y1="18" x2="13" y2="18"/></svg>',
  terminal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="14" height="14"><rect x="3" y="5" width="18" height="14" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  search: '<svg class="portal-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  searchPanel: '<svg class="search-panel__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  chevron: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
};
const PROFILE_META = {
  admin: { label: 'Admin', title: 'Web-Admin（PCメイン・情報密度優先）' },
  consumer: { label: 'Consumer', title: 'Mobile-Consumer（一般ユーザー向け・操作性優先）' },
  terminal: { label: 'Terminal', title: 'Mobile-Terminal（業務端末・固定視認性）' },
};

async function loadJson(path, fallback) {
  try { const r = await fetch(path, { cache: 'no-cache' }); if (!r.ok) throw 0; return await r.json(); }
  catch { return fallback; }
}

async function loadData() {
  const [taxonomy, registry, versionMatrix, showcase, buildInfo, coreContent] = await Promise.all([
    loadJson('data/taxonomy.json', { categories: [] }),
    loadJson('data/registry.json', { projects: [] }),
    loadJson('data/version-matrix.json', { entries: [] }),
    loadJson('data/showcase-index.json', { items: [] }),
    loadJson('data/build-info.json', { coreVersionLabel: 'core@local' }),
    loadJson('data/core-content.json', null), // F-6: 無ければ静的 OVERVIEW へフォールバック
  ]);
  return { taxonomy, registry, versionMatrix, showcase, buildInfo, coreContent };
}

/* ───────────── ヘッダ（profile radiogroup + 検索 + 版） ───────────── */
function renderProfileSwitcher() {
  return `<div class="portal-profile" role="radiogroup" aria-label="デバイスプロファイル">${
    ui.profiles.map(p => {
      const m = PROFILE_META[p];
      return `<button type="button" class="portal-profile__btn" data-profile="${p}" role="radio" aria-checked="${p === ui.profile ? 'true' : 'false'}" title="${esc(m.title)}" data-testid="profile-${p}">${ICON[p]}<span>${esc(m.label)}</span></button>`;
    }).join('')
  }</div>`;
}

function renderHeader() {
  return `<header class="portal-header" role="banner">
    <a class="portal-brand" href="${DEFAULT_ROUTE}" aria-label="FIG Core Design System ホーム">
      <span class="portal-brand__mark" aria-hidden="true">FIG</span>
      <span><span class="portal-brand__title">FIG Core DS</span><span class="portal-brand__subtitle">Design System</span></span>
    </a>
    <div class="portal-search">
      ${ICON.search}
      <input type="search" class="portal-search__input" placeholder="ドキュメント検索…" aria-label="ドキュメント検索（Ctrl+K）" data-testid="search-input">
      <span class="portal-search__hint" aria-hidden="true">Ctrl K</span>
    </div>
    <div class="portal-controls" role="group" aria-label="表示設定">
      <span class="fig-version-badge" data-testid="core-version" title="rolling で取り込んだ Core 版（表示専用）">Core: ${esc(ui.coreVersionLabel)}</span>
      ${renderProfileSwitcher()}
    </div>
    <button type="button" class="portal-menu-toggle" aria-label="メニューを開く" data-testid="menu-toggle">${ICON.menu}</button>
  </header>`;
}

function renderSearchOverlay() {
  return `<div class="search-overlay" data-open="false" role="dialog" aria-modal="true" aria-label="ドキュメント検索">
    <div class="search-panel">
      <div class="search-panel__input-wrap">
        ${ICON.searchPanel}
        <input type="search" class="search-panel__input" placeholder="トピック・コンポーネント・トークンを検索…" aria-label="検索クエリ">
      </div>
      <ul class="search-results" role="listbox" aria-label="検索結果"></ul>
    </div>
  </div>`;
}

/* ───────────── サイドバー（Core .sidebar-section / .sidebar-item 規約） ───────────── */
function renderSidebar(tree, currentRaw) {
  const meta = `<div class="portal-sidebar__scope-meta">
    <div class="portal-sidebar__scope-head">
      <div class="portal-sidebar__scope-label">ナビゲーション</div>
      <button type="button" class="portal-sidebar__collapse-all" data-testid="nav-collapse-all" title="ナビゲーションをすべて閉じる（Alt+Q）" aria-label="ナビゲーションをすべて閉じる（ショートカット Alt+Q）">すべて閉じる<span class="portal-sidebar__collapse-all-hint" aria-hidden="true">Alt Q</span></button>
    </div>
    <div class="portal-sidebar__scope-desc">概要・プロジェクト集・運用・使い方</div>
  </div>`;
  return meta + tree.map(top => renderSection(top, currentRaw)).join('');
}

function renderSection(node, currentRaw) {
  const kids = node.children || [];
  if (!kids.length) {
    // 末端のトップ項目（使い方など）は1項目だけのセクションとして描画
    return `<section class="sidebar-section" data-open="true"><ul class="sidebar-section__items">${renderItem(node, currentRaw)}</ul></section>`;
  }
  const items = kids.map(c => (c.children && c.children.length)
    ? `<li>${renderSection(c, currentRaw)}</li>`
    : renderItem(c, currentRaw)
  ).join('');
  const hint = node.hint ? `<span class="sidebar-section__hint">${esc(node.hint)}</span>` : '';
  return `<section class="sidebar-section" data-open="true">
    <button type="button" class="sidebar-section__header" aria-expanded="true">
      <span><span>${esc(node.label)}</span>${hint}</span>
      <span class="sidebar-section__chevron" aria-hidden="true">${ICON.chevron}</span>
    </button>
    <ul class="sidebar-section__items">${items}</ul>
  </section>`;
}

function renderItem(node, currentRaw) {
  const route = node.route || '';
  const isCurrent = ('#/' + currentRaw).split('?')[0] === route.split('?')[0];
  const av = node.avail;
  const availAttrs = av
    ? ` data-avail-admin="${esc(av.admin || 'recommended')}" data-avail-consumer="${esc(av.consumer || 'recommended')}" data-avail-terminal="${esc(av.terminal || 'recommended')}"`
    : '';
  const badges = av
    ? `<span class="sidebar-item__badge sidebar-item__badge--avoid" aria-hidden="true">N/A</span><span class="sidebar-item__badge sidebar-item__badge--caution" aria-hidden="true">注意</span>`
    : '';
  const tempBadge = node.badge === 'temp-part' ? ` <span class="fig-tag fig-tag--temp">仮</span>` : '';
  const pendingCls = node.status === 'pending' ? ' is-pending' : '';
  return `<li><a class="sidebar-item${pendingCls}" href="${route}" data-route="${esc(route)}"${isCurrent ? ' aria-current="page"' : ''}${availAttrs} data-testid="nav-${esc(node.id)}"><span class="sidebar-item__label">${esc(node.label)}${tempBadge}</span>${badges}</a></li>`;
}

/* ───────────── ビュー dispatch ───────────── */
function renderView(route, ctx) {
  if (!route) return notFound();
  switch (route.kind) {
    case 'home': return renderHome(ctx);
    case 'overview': return renderOverview(route, ctx);
    case 'developer': return renderDeveloper(route, ctx);
    case 'projects': return renderProjects(route, ctx);
    case 'ops': return renderOps(route, ctx);
    case 'usage': return renderUsage(route, ctx);
    default: return notFound();
  }
}

/* ───────────── 検索 ───────────── */
function buildSearchIndex(tree) {
  const out = [];
  const walk = (nodes, trail) => {
    for (const n of nodes || []) {
      const leaf = n.route && (!n.children || !n.children.length);
      if (leaf) out.push({ label: n.label, route: n.route, path: trail.join(' / '), haystack: `${n.label} ${trail.join(' ')}`.toLowerCase() });
      if (n.children && n.children.length) walk(n.children, [...trail, n.label]);
    }
  };
  walk(tree, []);
  return out;
}
function fuzzyScore(hay, needle) {
  let i = 0, matches = 0;
  for (const ch of needle) { const f = hay.indexOf(ch, i); if (f < 0) return 0; matches++; i = f + 1; }
  return matches / needle.length;
}
function searchQuery(index, q) {
  const needle = q.trim().toLowerCase();
  if (!needle) return index.slice(0, 12);
  return index
    .map(e => ({ e, score: e.haystack.includes(needle) ? 1 : fuzzyScore(e.haystack, needle) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map(x => x.e);
}
function setupSearch(index, navigate) {
  const overlay = $('.search-overlay');
  const panelInput = $('.search-panel__input', overlay);
  const list = $('.search-results', overlay);

  const renderResults = (q) => {
    list.innerHTML = '';
    const results = searchQuery(index, q);
    if (!results.length) { list.innerHTML = `<li class="search-empty">一致する項目はありません。</li>`; return; }
    list.innerHTML = results.map((r, i) =>
      `<li><a class="search-result" href="${esc(r.route)}" data-route="${esc(r.route)}" aria-selected="${i === 0 ? 'true' : 'false'}"><span class="search-result__label">${esc(r.label)}</span><span class="search-result__path">${esc(r.path)}</span></a></li>`
    ).join('');
  };
  const open = () => { overlay.setAttribute('data-open', 'true'); panelInput.value = ''; renderResults(''); panelInput.focus(); };
  const close = () => overlay.setAttribute('data-open', 'false');

  $('.portal-search__input')?.addEventListener('focus', (e) => { e.currentTarget.blur(); open(); });
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); }
    else if (e.key === 'Escape') close();
  });
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  panelInput.addEventListener('input', (e) => renderResults(e.target.value));
  list.addEventListener('click', (e) => {
    const a = e.target.closest('.search-result'); if (!a) return;
    e.preventDefault(); navigate(a.getAttribute('data-route')); close();
  });
  panelInput.addEventListener('keydown', (e) => {
    const items = $$('.search-result', list);
    if (!items.length) return;
    const idx = items.findIndex(r => r.getAttribute('aria-selected') === 'true');
    if (e.key === 'Enter') { e.preventDefault(); (items[idx >= 0 ? idx : 0])?.click(); return; }
    let next = idx;
    if (e.key === 'ArrowDown') next = Math.min(idx + 1, items.length - 1);
    else if (e.key === 'ArrowUp') next = Math.max(idx - 1, 0);
    else return;
    e.preventDefault();
    items.forEach(r => r.setAttribute('aria-selected', 'false'));
    items[next].setAttribute('aria-selected', 'true');
    items[next].scrollIntoView({ block: 'nearest' });
  });
}

/* ───────────── プロファイル → iframe へ伝播 ───────────── */
function applyProfileToFrames(profile) {
  // Core プレビュー（same-origin / vendor/core/preview）→ body クラスを書換え
  $$('.page-iframe').forEach(f => {
    try {
      const doc = f.contentDocument;
      if (doc && doc.body) {
        ui.profiles.forEach(p => doc.body.classList.remove('fig-profile-' + p));
        doc.body.classList.add('fig-profile-' + profile);
      }
    } catch { /* not yet loaded */ }
  });
  // プロジェクトデモ（sandbox / ?profile= クエリで伝播）→ src を更新
  $$('.fig-demo-frame[data-testid="project-demo-frame"]').forEach(f => {
    const cur = f.getAttribute('src') || '';
    try {
      const u = new URL(cur, location.href);
      u.searchParams.set('profile', profile);
      const next = (u.pathname.startsWith('/') && !/^https?:/.test(cur)) ? u.pathname + u.search : u.toString();
      if (next !== cur) f.setAttribute('src', next);
    } catch { /* noop */ }
  });
}

/* ───────────── 起動 ───────────── */
async function main() {
  ui.init();
  const data = await loadData();
  ui.setVersionLabel(data.buildInfo?.coreVersionLabel);
  const ctx = { data, ui };

  const app = document.getElementById('app');
  app.innerHTML = `
    <a class="fig-skip-link" href="#main">本文へスキップ</a>
    ${renderHeader()}
    <div class="portal-body">
      <nav class="portal-sidebar" id="sidenav" data-open="false" role="navigation" aria-label="主ナビゲーション"></nav>
      <div class="portal-sidebar-scrim" data-open="false" aria-hidden="true"></div>
      <main class="portal-main" id="main" tabindex="-1" role="main"></main>
    </div>
    ${renderSearchOverlay()}`;

  const navTree = buildNav(data.taxonomy, data.registry, data.coreContent);
  const searchIndex = buildSearchIndex(navTree);
  const sidenav = $('#sidenav');
  const mainEl = $('#main');
  const currentRoute = () => parseRoute(location.hash) || parseRoute(DEFAULT_ROUTE);

  // リロード時のスクロール位置維持。ページ全体（window）がスクロールするため、
  // route 別に window.scrollY を sessionStorage に保存し、初回描画（＝リロード）で復元する。
  // ブラウザ既定の復元はコンテンツ描画前に走り効かないので manual に切り替える。
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  let isInitialPaint = true;
  const scrollKey = () => 'fig-scroll:' + (location.hash || DEFAULT_ROUTE);
  let scrollSaveTimer = null;
  const saveScroll = () => { try { sessionStorage.setItem(scrollKey(), String(window.scrollY)); } catch { /* storage 不可は無視 */ } };
  window.addEventListener('scroll', () => {
    if (scrollSaveTimer) return;
    scrollSaveTimer = setTimeout(() => { scrollSaveTimer = null; saveScroll(); }, 150);
  }, { passive: true });
  window.addEventListener('beforeunload', saveScroll);

  // サイドバーは data 駆動で不変のため一度だけ描画する。以降の遷移では aria-current の
  // 付け替えのみ行い DOM を作り直さない（→ ユーザーが畳んだアコーディオンが遷移で復活しない）。
  sidenav.innerHTML = renderSidebar(navTree, currentRoute().raw);

  function updateActiveNav(route) {
    const target = ('#/' + (route ? route.raw : '')).split('?')[0];
    sidenav.querySelectorAll('.sidebar-item[aria-current]').forEach(a => a.removeAttribute('aria-current'));
    for (const a of sidenav.querySelectorAll('.sidebar-item')) {
      if ((a.getAttribute('data-route') || '').split('?')[0] === target) { a.setAttribute('aria-current', 'page'); break; }
    }
  }

  function paint(route) {
    updateActiveNav(route);
    mainEl.innerHTML = renderView(route, ctx);
    restoreActiveTab();
    applyProfileToFrames(ui.profile);
    document.title = titleFor(route);
    mainEl.focus({ preventScroll: true });
    if (isInitialPaint) {
      // 初回描画＝リロード/直アクセス。保存済みのスクロール位置を復元（無ければトップ）。
      isInitialPaint = false;
      const y = Number(sessionStorage.getItem(scrollKey()) || 0);
      requestAnimationFrame(() => window.scrollTo(0, y));
    } else {
      // アプリ内ナビゲーションは従来どおりトップへ。
      window.scrollTo(0, 0);
    }
    // モバイルドロワーを閉じる
    sidenav.setAttribute('data-open', 'false');
    $('.portal-sidebar-scrim')?.setAttribute('data-open', 'false');
    announce(document.title);
  }

  const router = createRouter(paint);

  // ナビをすべて畳む（検索の Ctrl+K に対をなす Alt+Q／「すべて閉じる」ボタン）。
  // ヘッダー（トグル）を持つ折りたたみセクションのみ畳む。単項目セクションは
  // トグルが無く、畳むと再展開できないため対象外とする。あわせてモバイルドロワーも閉じる。
  function closeAllNav() {
    sidenav.querySelectorAll('.sidebar-section').forEach(sec => {
      const header = sec.querySelector(':scope > .sidebar-section__header');
      if (!header) return;
      sec.setAttribute('data-open', 'false');
      header.setAttribute('aria-expanded', 'false');
    });
    sidenav.setAttribute('data-open', 'false');
    $('.portal-sidebar-scrim')?.setAttribute('data-open', 'false');
  }

  // プロファイル切替（radiogroup・CSS 駆動のため再描画しない）
  app.addEventListener('click', (e) => {
    const btn = e.target.closest('.portal-profile__btn');
    if (btn) { ui.setProfile(btn.getAttribute('data-profile')); return; }
    // ナビをすべて閉じる（「すべて閉じる」ボタン）
    if (e.target.closest('.portal-sidebar__collapse-all')) { closeAllNav(); return; }
    // サイドバーのセクション折りたたみ
    const secHeader = e.target.closest('.sidebar-section__header');
    if (secHeader) {
      const sec = secHeader.closest('.sidebar-section');
      const open = sec.getAttribute('data-open') !== 'false';
      sec.setAttribute('data-open', open ? 'false' : 'true');
      secHeader.setAttribute('aria-expanded', open ? 'false' : 'true');
      return;
    }
    // モバイルメニュー
    if (e.target.closest('.portal-menu-toggle')) {
      const open = sidenav.getAttribute('data-open') === 'true';
      sidenav.setAttribute('data-open', open ? 'false' : 'true');
      $('.portal-sidebar-scrim')?.setAttribute('data-open', open ? 'false' : 'true');
      return;
    }
    if (e.target.closest('.portal-sidebar-scrim')) {
      sidenav.setAttribute('data-open', 'false');
      $('.portal-sidebar-scrim')?.setAttribute('data-open', 'false');
    }
  });
  window.addEventListener('ui:profile-changed', (e) => {
    const profile = e.detail.profile;
    $$('.portal-profile__btn').forEach(b => b.setAttribute('aria-checked', b.getAttribute('data-profile') === profile ? 'true' : 'false'));
    applyProfileToFrames(profile);
  });

  // タブ切替（component / pattern ページ・event delegation）
  mainEl.addEventListener('click', (e) => {
    const tab = e.target.closest('.page-tab'); if (!tab) return;
    activateTab(tab.closest('.page-tabs'), tab.getAttribute('data-tab'));
  });
  mainEl.addEventListener('keydown', (e) => {
    const list = e.target.closest('.page-tabs'); if (!list) return;
    const btns = $$('.page-tab', list);
    const idx = btns.findIndex(b => b.getAttribute('aria-selected') === 'true');
    let next = idx;
    if (e.key === 'ArrowRight') next = (idx + 1) % btns.length;
    else if (e.key === 'ArrowLeft') next = (idx - 1 + btns.length) % btns.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = btns.length - 1;
    else return;
    e.preventDefault();
    activateTab(list, btns[next].getAttribute('data-tab'));
    btns[next].focus();
  });

  // iframe ロード完了時にプロファイルを再適用
  document.addEventListener('load', (e) => {
    if (e.target && e.target.classList && e.target.classList.contains('page-iframe')) applyProfileToFrames(ui.profile);
  }, true);

  setupSearch(searchIndex, (to) => router.navigate(to));

  // Alt+Q: ナビをすべて閉じる（検索の Ctrl+K と対をなすショートカット）。
  document.addEventListener('keydown', (e) => {
    if (e.altKey && !e.ctrlKey && !e.metaKey && e.key.toLowerCase() === 'q') {
      e.preventDefault();
      closeAllNav();
    }
  });

  router.start();
}

/** タブ activate（ui.activeTab に記憶しページ遷移後も維持） */
function activateTab(list, id) {
  if (!list) return;
  ui.activeTab = id;
  $$('.page-tab', list).forEach(b => {
    const active = b.getAttribute('data-tab') === id;
    b.setAttribute('aria-selected', active ? 'true' : 'false');
    b.setAttribute('tabindex', active ? '0' : '-1');
  });
  const panels = list.nextElementSibling;
  if (panels) $$('.tab-panel', panels).forEach(p => p.setAttribute('data-active', p.id === `panel-${id}` ? 'true' : 'false'));
}
function restoreActiveTab() {
  if (!ui.activeTab) return;
  const list = $('.page-tabs');
  if (list && $(`.page-tab[data-tab="${ui.activeTab}"]`, list)) activateTab(list, ui.activeTab);
}

function titleFor(route) {
  const base = 'FIG Core DS';
  if (!route) return base;
  const map = { home: 'ホーム', overview: '概要', developer: 'Developer', projects: 'プロジェクト集', ops: '運用', usage: '使い方' };
  return `${map[route.kind] || ''} · ${base}`;
}

let liveRegion;
function announce(msg) {
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.className = 'fig-sr-only';
    document.body.appendChild(liveRegion);
  }
  liveRegion.textContent = msg;
}

document.addEventListener('DOMContentLoaded', main);
