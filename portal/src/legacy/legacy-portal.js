/**
 * FIG Core DS — Portal Controller
 *
 * Responsibilities:
 *   - ハッシュルーター（#/scope/section/item）
 *   - サイドバー描画（SITEMAP から）
 *   - ページ描画（PAGES から、template に応じてレイアウト切替）
 *   - スコープ切替（Core / Extensions）
 *   - タブ切替（Component / Pattern ページ内）
 *   - 検索オーバーレイ（Ctrl/Cmd + K）
 *   - キーボード操作（↑/↓/Enter/Esc）
 *   - iframe の遅延ロード
 *   - 「コードをコピー」
 *
 * 配信形態: 古典スクリプト（ES Module ではない）。
 * portal-content.js を先に読み込み、`window.PortalContent` から取り出す。
 * これにより file:// 起動でも CORS で弾かれずに動く。
 */
(function () {
const { SITEMAP, PAGES, DEFAULT_ROUTE } = window.PortalContent || {};
if (!SITEMAP || !PAGES) {
  console.error('[FIG Portal] PortalContent not found. Ensure portal-content.js loads before portal.js.');
  return;
}

/* ─────────────────────────────────────────────────────────────
   小さなDOMヘルパ
   ───────────────────────────────────────────────────────────── */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const h  = (tag, attrs = {}, ...children) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class')      el.className = v;
    else if (k === 'html')  el.innerHTML = v;
    else if (k === 'text')  el.textContent = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k.startsWith('data-')) el.setAttribute(k, v);
    else if (k.startsWith('aria-')) el.setAttribute(k, v);
    else                    el[k] = v;
  }
  for (const child of children.flat()) {
    if (child == null || child === false) continue;
    el.append(child.nodeType ? child : document.createTextNode(String(child)));
  }
  return el;
};

/* ─────────────────────────────────────────────────────────────
   ルーティング
   ───────────────────────────────────────────────────────────── */
/**
 * ルートセグメントの正規化。
 *   - URL バー上ではブラウザがスペース・日本語などを encode するため、
 *     parseRoute は decodeURIComponent を通して PAGES のキーと一致させる。
 *   - 逆向き（buildHref / setRoute）では明示的に encodeURIComponent し、
 *     ブラウザによる二重エンコードを防ぐ。
 */
function encodeFull(full) {
  return full.split('/').map(encodeURIComponent).join('/');
}

function safeDecode(s) {
  try { return decodeURIComponent(s); } catch (_) { return s; }
}

function parseRoute() {
  const raw = location.hash.replace(/^#\/?/, '');
  if (!raw) return null;
  const parts = raw.split('/').filter(Boolean).map(safeDecode);
  if (parts.length < 3) return null;
  return {
    scope:   parts[0],
    section: parts[1],
    item:    parts[2],
    full:    `${parts[0]}/${parts[1]}/${parts[2]}`,
  };
}

function setRoute(full) {
  const encoded = encodeFull(full);
  if (location.hash.replace(/^#\/?/, '') === encoded) {
    render();
  } else {
    location.hash = `#/${encoded}`;
  }
}

function buildHref(full) {
  return `#/${encodeFull(full)}`;
}

/* ─────────────────────────────────────────────────────────────
   サイドバー
   ───────────────────────────────────────────────────────────── */
function renderSidebar(scope, currentRoute) {
  const sidebar = $('.portal-sidebar');
  if (!sidebar) return;
  sidebar.innerHTML = '';

  const scopeData = SITEMAP[scope];
  if (!scopeData) return;

  sidebar.append(
    h('div', { class: 'portal-sidebar__scope-meta' },
      h('div', { class: 'portal-sidebar__scope-label', text: scopeData.label }),
      h('div', { class: 'portal-sidebar__scope-desc',  text: scopeData.description }),
    ),
  );

  for (const section of scopeData.sections) {
    const sectionContainsCurrent =
      currentRoute && currentRoute.scope === scope && currentRoute.section === section.id;

    const items = h('ul', { class: 'sidebar-section__items', role: 'list' });
    for (const item of section.items) {
      const full = `${scope}/${section.id}/${item.id}`;
      const page = PAGES[full];
      const avail = (page && page.availability) || {};
      const aAdmin    = avail.admin    || 'recommended';
      const aConsumer = avail.consumer || 'recommended';
      const aTerminal = avail.terminal || 'recommended';
      const a = h('a', {
        class: 'sidebar-item',
        href: buildHref(full),
        'data-route': full,
        'data-avail-admin':    aAdmin,
        'data-avail-consumer': aConsumer,
        'data-avail-terminal': aTerminal,
      });
      a.append(h('span', { class: 'sidebar-item__label', text: item.label }));
      // availability badge — visibility controlled by CSS (body.fig-profile-* selectors)
      a.append(h('span', { class: 'sidebar-item__badge sidebar-item__badge--avoid',  'aria-hidden': 'true', text: 'N/A' }));
      a.append(h('span', { class: 'sidebar-item__badge sidebar-item__badge--caution','aria-hidden': 'true', text: '注意' }));
      if (currentRoute && currentRoute.full === full) {
        a.setAttribute('aria-current', 'page');
      }
      items.append(h('li', {}, a));
    }

    const chevron = h('span', {
      class: 'sidebar-section__chevron',
      'aria-hidden': 'true',
      html: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
    });

    const header = h('button', {
      type: 'button',
      class: 'sidebar-section__header',
      'aria-expanded': sectionContainsCurrent ? 'true' : 'true',
      onClick: (e) => {
        const sec = e.currentTarget.closest('.sidebar-section');
        const open = sec.getAttribute('data-open') !== 'false';
        sec.setAttribute('data-open', open ? 'false' : 'true');
        e.currentTarget.setAttribute('aria-expanded', open ? 'false' : 'true');
      },
    },
      h('span', {},
        h('span', { text: section.label }),
        h('span', { class: 'sidebar-section__hint', text: section.hint, style: 'display:block;' }),
      ),
      chevron,
    );

    const sec = h('section', { class: 'sidebar-section', 'data-open': 'true' },
      header, items,
    );
    sidebar.append(sec);
  }
}

/* ─────────────────────────────────────────────────────────────
   ページ描画 — テンプレート別
   ───────────────────────────────────────────────────────────── */
function renderBreadcrumbs(route) {
  const scopeData = SITEMAP[route.scope];
  const section   = scopeData?.sections.find(s => s.id === route.section);
  const item      = section?.items.find(i => i.id === route.item);
  const wrap = h('nav', { class: 'portal-breadcrumbs', 'aria-label': '現在地' });
  wrap.append(
    h('span', { text: scopeData?.label || route.scope }),
    h('span', { class: 'portal-breadcrumbs__sep', text: '/' }),
    h('span', { text: section?.label || route.section }),
    h('span', { class: 'portal-breadcrumbs__sep', text: '/' }),
    h('span', { text: item?.label || route.item }),
  );
  return wrap;
}

function renderPageHeader(page) {
  return h('header', { class: 'page-header' },
    h('h1', { class: 'page-header__title jp-headline', text: page.title }),
    page.description && h('p', { class: 'page-header__desc jp-prose', text: page.description }),
  );
}

function renderPrincipleTemplate(page) {
  const root = h('div');
  if (page.body) {
    root.append(h('div', { class: 'page-prose jp-prose', html: page.body }));
  }
  if (page.preview) {
    root.append(
      h('h3', { class: 'page-prose', text: 'ライブプレビュー' }),
      renderIframe(page.preview),
    );
  }
  return root;
}

function renderFoundationTemplate(page) {
  const root = h('div');
  if (page.body) {
    root.append(h('div', { class: 'page-prose jp-prose', html: page.body }));
  }
  root.append(renderIframe(page.preview));
  return root;
}

function renderComponentTemplate(page) {
  return renderTabsTemplate(page, [
    { id: 'overview',   label: 'Overview',     render: () => renderOverviewPanel(page) },
    { id: 'preview',    label: 'Live preview', render: () => renderPreviewPanel(page) },
    { id: 'tokens',     label: 'Tokens & Code',render: () => renderTokensPanel(page) },
    { id: 'a11y',       label: 'Accessibility',render: () => renderA11yPanel(page) },
  ]);
}

function renderPatternTemplate(page) {
  return renderTabsTemplate(page, [
    { id: 'overview',   label: 'Overview',     render: () => renderOverviewPanel(page) },
    { id: 'preview',    label: 'Live preview', render: () => renderPreviewPanel(page) },
    { id: 'spec',       label: 'Spec',         render: () => renderSpecPanel(page) },
    { id: 'a11y',       label: 'Accessibility',render: () => renderA11yPanel(page) },
  ]);
}

function renderExternalTemplate(page) {
  const root = h('div');
  if (page.body) {
    root.append(h('div', { class: 'page-prose jp-prose', html: page.body }));
  }
  root.append(
    h('div', { class: 'external-cta' },
      h('a', {
        class: 'btn btn--primary',
        href: page.href,
        target: '_blank',
        rel: 'noopener',
        text: '別タブで開く →',
      }),
    ),
  );
  return root;
}

/* ── タブ共通 ── */
// ページ遷移をまたいで最後にアクティブだったタブIDを記憶（メモリのみ／リロードでクリア）。
let lastActiveTabId = null;

function renderTabsTemplate(page, tabs) {
  const root  = h('div');
  const tabList = h('div', { class: 'page-tabs', role: 'tablist', 'aria-label': `${page.title} ビュー切替` });
  const panels  = h('div', { class: 'page-panels' });

  const initialTabId = tabs.some(t => t.id === lastActiveTabId) ? lastActiveTabId : tabs[0].id;

  tabs.forEach((t) => {
    const isActive = t.id === initialTabId;
    const btn = h('button', {
      type: 'button',
      class: 'page-tab',
      role: 'tab',
      id: `tab-${t.id}`,
      'aria-controls': `panel-${t.id}`,
      'aria-selected': isActive ? 'true' : 'false',
      tabindex: isActive ? '0' : '-1',
      'data-tab': t.id,
      text: t.label,
      onClick: () => activateTab(t.id),
    });
    tabList.append(btn);

    const panel = h('section', {
      class: 'tab-panel',
      role: 'tabpanel',
      id: `panel-${t.id}`,
      'aria-labelledby': `tab-${t.id}`,
      'data-active': isActive ? 'true' : 'false',
    });
    panel.append(t.render());
    panels.append(panel);
  });

  // Keyboard: ← / → / Home / End
  tabList.addEventListener('keydown', (e) => {
    const btns = $$('.page-tab', tabList);
    const idx  = btns.findIndex(b => b.getAttribute('aria-selected') === 'true');
    let next   = idx;
    if (e.key === 'ArrowRight') next = (idx + 1) % btns.length;
    else if (e.key === 'ArrowLeft')  next = (idx - 1 + btns.length) % btns.length;
    else if (e.key === 'Home')       next = 0;
    else if (e.key === 'End')        next = btns.length - 1;
    else return;
    e.preventDefault();
    activateTab(btns[next].getAttribute('data-tab'));
    btns[next].focus();
  });

  function activateTab(id) {
    lastActiveTabId = id;
    $$('.page-tab', tabList).forEach(b => {
      const active = b.getAttribute('data-tab') === id;
      b.setAttribute('aria-selected', active ? 'true' : 'false');
      b.setAttribute('tabindex', active ? '0' : '-1');
    });
    $$('.tab-panel', panels).forEach(p => {
      p.setAttribute('data-active', p.id === `panel-${id}` ? 'true' : 'false');
    });
  }

  root.append(tabList, panels);
  return root;
}

function renderOverviewPanel(page) {
  const root = h('div');
  if (page.body) {
    root.append(h('div', { class: 'page-prose jp-prose', html: page.body }));
  } else {
    root.append(
      h('div', { class: 'page-prose jp-prose' },
        h('p', { text: page.description || 'このページの概要は spec ファイルを参照してください。' }),
      ),
    );
  }
  if (page.spec) {
    root.append(
      h('p', { class: 'page-prose' },
        h('a', { href: page.spec, target: '_blank', rel: 'noopener', text: `Spec を開く: ${page.spec} →` }),
      ),
    );
  }
  return root;
}

function renderPreviewPanel(page) {
  if (!page.preview) {
    return h('div', { class: 'page-empty-preview', text: 'このコンポーネントのライブプレビューは未収録です。Spec タブを参照してください。' });
  }
  return renderIframe(page.preview);
}

/* Resolve a profile-aware value. Accepts:
 *  - string                 → universal
 *  - { default, admin?, consumer?, terminal? } → per-profile with default fallback
 *  - null/undefined         → null
 * Returns the resolved string for the given profile, or null. */
function resolveProfileValue(value, profile) {
  if (value == null) return null;
  if (typeof value === 'string') return value;
  return value[profile] || value.default || null;
}

function renderTokensPanel(page) {
  const root = h('div');
  root.append(
    h('div', { class: 'page-prose jp-prose' },
      h('p', { text: 'このコンポーネントが参照する意味的トークン、およびプロファイル別の実装例です。' }),
    ),
  );

  // ── Code block (profile-aware) ──
  if (page.code) {
    const codeWrap = h('div', { class: 'code-blocks' });
    ['admin', 'consumer', 'terminal'].forEach(p => {
      const body = resolveProfileValue(page.code, p);
      if (!body) return;
      codeWrap.append(
        h('pre', { class: 'page-code', 'data-code-profile': p },
          h('code', { class: 'language-html', text: body }),
        ),
      );
    });
    root.append(
      h('h3', { class: 'page-prose', text: 'Code（プロファイル連動）' }),
      codeWrap,
    );
    // Trigger Prism syntax highlighting once Prism is loaded.
    if (window.Prism && window.Prism.highlightAllUnder) {
      window.Prism.highlightAllUnder(codeWrap);
    } else {
      window.addEventListener('load', () => {
        if (window.Prism && window.Prism.highlightAllUnder) window.Prism.highlightAllUnder(codeWrap);
      }, { once: true });
    }
  }

  if (page.spec) {
    root.append(
      h('p', { class: 'page-prose' },
        h('a', { href: page.spec, target: '_blank', rel: 'noopener', text: `Spec を開く: ${page.spec} →` }),
      ),
    );
  }
  // 簡易：page.tokens があれば表示。なければ spec への誘導のみ。
  if (Array.isArray(page.tokens) && page.tokens.length) {
    const table = h('table', { class: 'token-table' },
      h('thead', {},
        h('tr', {},
          h('th', { text: '役割' }),
          h('th', { text: 'トークン' }),
        ),
      ),
      h('tbody', {},
        ...page.tokens.map(t =>
          h('tr', {},
            h('td', { text: t.role }),
            h('td', {}, h('code', { text: t.token })),
          ),
        ),
      ),
    );
    root.append(table);
  }
  return root;
}

function renderSpecPanel(page) {
  const root = h('div', { class: 'page-prose jp-prose' });
  if (page.spec) {
    root.append(
      h('p', {},
        '詳細仕様は ',
        h('a', { href: page.spec, target: '_blank', rel: 'noopener', text: page.spec }),
        ' を参照してください。Spec を Single Source of Truth として、本ポータルは抜粋と参照に徹します。',
      ),
    );
  } else {
    root.append(h('p', { text: 'このパターンの spec はまだ準備中です。' }));
  }
  return root;
}

function renderA11yPanel(page) {
  const fallback = 'このページの a11y 注意点は spec を参照してください。';
  // If a11y is a string (legacy) or absent — emit 3 identical blocks so CSS show/hide always finds one.
  // If a11y is an object — resolve per profile with default fallback.
  const wrap = h('div', { class: 'a11y-blocks' });
  ['admin', 'consumer', 'terminal'].forEach(p => {
    const body = resolveProfileValue(page.a11y, p) || fallback;
    wrap.append(
      h('div', { class: 'a11y-callout', 'data-a11y-profile': p },
        h('strong', { text: 'Accessibility' }),
        h('div', { class: 'jp-text', html: body }),
      ),
    );
  });
  return wrap;
}

function renderIframe(src) {
  const wrap = h('div');
  // Device frame: max-width / aspect hint is driven by body.fig-profile-* via CSS
  const frame = h('div', { class: 'preview-frame', 'data-preview-frame': 'true' });
  const iframe = h('iframe', {
    class: 'page-iframe',
    src,
    loading: 'lazy',
    title: 'ライブプレビュー',
  });
  frame.append(iframe);
  wrap.append(
    frame,
    h('div', { class: 'page-iframe-meta' },
      h('a', { href: src, target: '_blank', rel: 'noopener', text: '新しいタブで開く ↗' }),
    ),
  );
  return wrap;
}

/* ─────────────────────────────────────────────────────────────
   メインレンダリング
   ───────────────────────────────────────────────────────────── */
function render() {
  let route = parseRoute();
  if (!route || !PAGES[route.full]) {
    location.hash = `#/${DEFAULT_ROUTE}`;
    return;
  }

  // Scope toggle 反映
  $$('.portal-scope__btn').forEach(b => {
    const active = b.getAttribute('data-scope') === route.scope;
    b.setAttribute('aria-current', active ? 'page' : 'false');
  });

  renderSidebar(route.scope, route);

  const main = $('.portal-main');
  main.innerHTML = '';
  main.append(renderBreadcrumbs(route));

  const page = PAGES[route.full];
  main.append(renderPageHeader(page));

  // Profile-aware availability warning banner (CSS-driven: shows only when current profile = avoid/caution)
  if (page.availability) {
    const a = page.availability;
    main.append(
      h('div', {
        class: 'page-avail-banner',
        'data-avail-admin':    a.admin    || 'recommended',
        'data-avail-consumer': a.consumer || 'recommended',
        'data-avail-terminal': a.terminal || 'recommended',
      },
        h('span', { class: 'page-avail-banner__icon', 'aria-hidden': 'true', text: '⚠' }),
        h('span', { class: 'page-avail-banner__text' },
          h('strong', { class: 'page-avail-banner__head' }),
          h('span', { class: 'page-avail-banner__desc', text: 'このコンポーネントは選択中のプロファイルでの利用に注意が必要です。プロファイル別の利用指針を Accessibility タブで確認してください。' }),
        ),
      ),
    );
  }

  let body;
  switch (page.template) {
    case 'principle':  body = renderPrincipleTemplate(page);  break;
    case 'foundation': body = renderFoundationTemplate(page); break;
    case 'component':  body = renderComponentTemplate(page);  break;
    case 'pattern':    body = renderPatternTemplate(page);    break;
    case 'external':   body = renderExternalTemplate(page);   break;
    default:           body = h('div', { text: '未知のテンプレートです。' });
  }
  main.append(body);

  // Sidebar drawer を閉じる（モバイル）
  $('.portal-sidebar')?.setAttribute('data-open', 'false');
  $('.portal-sidebar-scrim')?.setAttribute('data-open', 'false');

  // ページトップへ
  main.scrollTo?.({ top: 0 });
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'auto' : 'auto' });

  // タイトル更新
  document.title = `${page.title} — FIG Core DS`;
}

/* ─────────────────────────────────────────────────────────────
   スコープ切替
   ───────────────────────────────────────────────────────────── */
function switchScope(scope) {
  // そのスコープの最初のページへ遷移
  const scopeData = SITEMAP[scope];
  if (!scopeData) return;
  const firstSection = scopeData.sections[0];
  if (!firstSection || !firstSection.items.length) return;
  const firstItem = firstSection.items[0];
  setRoute(`${scope}/${firstSection.id}/${firstItem.id}`);
}

/* ─────────────────────────────────────────────────────────────
   検索
   ───────────────────────────────────────────────────────────── */
function buildSearchIndex() {
  const idx = [];
  for (const [scopeId, scope] of Object.entries(SITEMAP)) {
    for (const section of scope.sections) {
      for (const item of section.items) {
        const full = `${scopeId}/${section.id}/${item.id}`;
        idx.push({
          full,
          label: item.label,
          path:  `${scope.label} / ${section.label}`,
          haystack: `${item.label} ${section.label} ${scope.label} ${section.hint || ''}`.toLowerCase(),
        });
      }
    }
  }
  return idx;
}
const SEARCH_INDEX = buildSearchIndex();

function searchQuery(q) {
  const needle = q.trim().toLowerCase();
  if (!needle) return SEARCH_INDEX.slice(0, 12);
  return SEARCH_INDEX
    .map(e => ({ e, score: e.haystack.includes(needle) ? 1 : (fuzzyScore(e.haystack, needle)) }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map(x => x.e);
}
function fuzzyScore(hay, needle) {
  let i = 0;
  let matches = 0;
  for (const ch of needle) {
    const found = hay.indexOf(ch, i);
    if (found < 0) return 0;
    matches++;
    i = found + 1;
  }
  return matches / needle.length;
}

function openSearchOverlay() {
  const overlay = $('.search-overlay');
  if (!overlay) return;
  overlay.setAttribute('data-open', 'true');
  const input = $('.search-panel__input', overlay);
  input.value = '';
  renderSearchResults('');
  input.focus();
}
function closeSearchOverlay() {
  $('.search-overlay')?.setAttribute('data-open', 'false');
}
function renderSearchResults(q) {
  const list = $('.search-results');
  list.innerHTML = '';
  const results = searchQuery(q);
  if (!results.length) {
    list.append(h('li', { class: 'search-empty', text: '一致する項目はありません。' }));
    return;
  }
  results.forEach((r, i) => {
    const li = h('li');
    const a = h('a', {
      class: 'search-result',
      href: buildHref(r.full),
      'data-route': r.full,
      'aria-selected': i === 0 ? 'true' : 'false',
      onClick: (e) => {
        e.preventDefault();
        setRoute(r.full);
        closeSearchOverlay();
      },
    },
      h('span', { class: 'search-result__label', text: r.label }),
      h('span', { class: 'search-result__path',  text: r.path }),
    );
    li.append(a);
    list.append(li);
  });
}

function setupSearch() {
  const overlay = $('.search-overlay');
  if (!overlay) return;
  const input   = $('.search-panel__input', overlay);

  // ヘッダー検索フィールド → クリックで overlay 起動
  $('.portal-search__input')?.addEventListener('focus', (e) => {
    e.preventDefault();
    e.currentTarget.blur();
    openSearchOverlay();
  });

  // Ctrl/Cmd + K
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearchOverlay();
    } else if (e.key === 'Escape') {
      closeSearchOverlay();
    }
  });

  // Overlay 自体クリック（外側）で閉じる
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeSearchOverlay();
  });

  input.addEventListener('input', (e) => renderSearchResults(e.target.value));

  // 結果ナビ（↑/↓/Enter）
  input.addEventListener('keydown', (e) => {
    const items = $$('.search-result');
    if (!items.length) return;
    const idx = items.findIndex(r => r.getAttribute('aria-selected') === 'true');
    let next = idx;
    if (e.key === 'ArrowDown') next = Math.min(idx + 1, items.length - 1);
    else if (e.key === 'ArrowUp') next = Math.max(idx - 1, 0);
    else if (e.key === 'Enter') {
      e.preventDefault();
      const target = items[idx >= 0 ? idx : 0];
      target?.click();
      return;
    } else return;
    e.preventDefault();
    items.forEach(r => r.setAttribute('aria-selected', 'false'));
    items[next].setAttribute('aria-selected', 'true');
    items[next].scrollIntoView({ block: 'nearest' });
  });
}

/* ─────────────────────────────────────────────────────────────
   モバイルメニュー
   ───────────────────────────────────────────────────────────── */
function setupMobileMenu() {
  const toggle = $('.portal-menu-toggle');
  const sidebar = $('.portal-sidebar');
  const scrim   = $('.portal-sidebar-scrim');
  toggle?.addEventListener('click', () => {
    const open = sidebar.getAttribute('data-open') === 'true';
    sidebar.setAttribute('data-open', open ? 'false' : 'true');
    scrim?.setAttribute('data-open', open ? 'false' : 'true');
  });
  scrim?.addEventListener('click', () => {
    sidebar.setAttribute('data-open', 'false');
    scrim.setAttribute('data-open', 'false');
  });
}

/* ─────────────────────────────────────────────────────────────
   イベントバインド
   ───────────────────────────────────────────────────────────── */
function setupScopeToggle() {
  $$('.portal-scope__btn').forEach(b => {
    b.addEventListener('click', () => switchScope(b.getAttribute('data-scope')));
  });
}

/* ─────────────────────────────────────────────────────────────
   Device Profile スイッチ
   <body class="fig-profile-{admin|consumer|terminal}">
   localStorage に保存し、次回起動時に復元する。
   ───────────────────────────────────────────────────────────── */
const PROFILE_STORAGE_KEY = 'fig.portal.deviceProfile';
const PROFILES = ['admin', 'consumer', 'terminal'];
const PROFILE_CLASSES = PROFILES.map(p => `fig-profile-${p}`);

function applyProfile(profile) {
  if (!PROFILES.includes(profile)) return;
  PROFILE_CLASSES.forEach(c => document.body.classList.remove(c));
  document.body.classList.add(`fig-profile-${profile}`);
  $$('.portal-profile__btn').forEach(b => {
    const active = b.getAttribute('data-profile') === profile;
    b.setAttribute('aria-checked', active ? 'true' : 'false');
  });
  try { localStorage.setItem(PROFILE_STORAGE_KEY, profile); } catch (_) { /* private mode */ }
  // 各プレビュー iframe にも適用
  $$('.page-iframe').forEach(iframe => {
    try {
      const doc = iframe.contentDocument;
      if (doc && doc.body) {
        PROFILE_CLASSES.forEach(c => doc.body.classList.remove(c));
        doc.body.classList.add(`fig-profile-${profile}`);
      }
    } catch (_) { /* cross-origin / not yet loaded */ }
  });
}

function setupProfileSwitcher() {
  let initial = 'consumer';
  try {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (saved && PROFILES.includes(saved)) initial = saved;
  } catch (_) { /* noop */ }
  applyProfile(initial);
  $$('.portal-profile__btn').forEach(b => {
    b.addEventListener('click', () => applyProfile(b.getAttribute('data-profile')));
  });
  // iframe ロード完了時に再適用
  document.addEventListener('load', (e) => {
    if (e.target && e.target.classList && e.target.classList.contains('page-iframe')) {
      applyProfile(currentProfile());
    }
  }, true);
}

function currentProfile() {
  for (const p of PROFILES) {
    if (document.body.classList.contains(`fig-profile-${p}`)) return p;
  }
  return 'consumer';
}

/* ─────────────────────────────────────────────────────────────
   Version Selector
   ───────────────────────────────────────────────────────────── */
const VERSION_STORAGE_KEY = 'fig.portal.version';
function setupVersionSelector() {
  const select = $('[data-version-selector]');
  if (!select) return;
  try {
    const saved = localStorage.getItem(VERSION_STORAGE_KEY);
    if (saved && [...select.options].some(o => o.value === saved)) select.value = saved;
  } catch (_) { /* noop */ }
  select.addEventListener('change', () => {
    try { localStorage.setItem(VERSION_STORAGE_KEY, select.value); } catch (_) { /* noop */ }
    // 将来は assets/v{x}/portal-content.js を動的ロードする想定。現状はメタ情報のみ。
    document.documentElement.setAttribute('data-ds-version', select.value);
  });
  document.documentElement.setAttribute('data-ds-version', select.value);
}

function setupGlobalLinks() {
  // サイドバーリンクは <a href="#/..."> なのでブラウザ既定で hash 更新
  // popstate / hashchange で render を呼ぶ
  window.addEventListener('hashchange', render);
}

/* ─────────────────────────────────────────────────────────────
   起動
   ───────────────────────────────────────────────────────────── */
function init() {
  if (!location.hash) {
    location.hash = `#/${DEFAULT_ROUTE}`;
  }
  setupScopeToggle();
  setupGlobalLinks();
  setupSearch();
  setupMobileMenu();
  setupProfileSwitcher();
  setupVersionSelector();
  render();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
})();
