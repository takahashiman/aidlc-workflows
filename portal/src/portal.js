/**
 * App Shell（PT-1）— データロード・ルーティング・レイアウト合成・フォーカス管理。
 * 静的 SPA（ADQ1=A）。data/ の静的 JSON を読み、ハッシュルートに応じてビューを描画する。
 */
import { ui } from './state.js';
import { buildNav } from './nav.js';
import { createRouter, parseRoute, DEFAULT_ROUTE } from './router.js';
import { renderOverview, renderProjects, renderOps, renderUsage, notFound } from './views.js';

const $ = (sel, root = document) => root.querySelector(sel);

async function loadJson(path, fallback) {
  try { const r = await fetch(path, { cache: 'no-cache' }); if (!r.ok) throw 0; return await r.json(); }
  catch { return fallback; }
}

async function loadData() {
  const [taxonomy, registry, versionMatrix, showcase, buildInfo] = await Promise.all([
    loadJson('data/taxonomy.json', { categories: [] }),
    loadJson('data/registry.json', { projects: [] }),
    loadJson('data/version-matrix.json', { entries: [] }),
    loadJson('data/showcase-index.json', { items: [] }),
    loadJson('data/build-info.json', { coreVersionLabel: 'core@local' }),
  ]);
  return { taxonomy, registry, versionMatrix, showcase, buildInfo };
}

/** サイドナビ描画（PT-2）。葉=直接リンク（即時到達 / BR-NAV-1） */
function renderNav(tree, currentRaw) {
  const renderNode = (n, depth) => {
    const hasChildren = n.children && n.children.length;
    const isCurrent = n.route && ('#/' + currentRaw).startsWith(n.route.split('?')[0]);
    const statusCls = n.status === 'pending' ? ' fig-nav__item--pending' : '';
    const badge = n.badge === 'temp-part' ? ' <span class="fig-badge fig-badge--temp">仮</span>' : '';
    const label = n.route
      ? `<a class="fig-nav__link${isCurrent ? ' is-current' : ''}" href="${n.route}" data-testid="nav-${n.id}"${isCurrent ? ' aria-current="page"' : ''}>${esc(n.label)}${badge}</a>`
      : `<span class="fig-nav__group">${esc(n.label)}</span>`;
    return `<li class="fig-nav__item fig-nav__item--d${depth}${statusCls}">${label}${
      hasChildren ? `<ul class="fig-nav__children">${n.children.map(c => renderNode(c, depth + 1)).join('')}</ul>` : ''
    }</li>`;
  };
  return `<ul class="fig-nav__root" role="tree">${tree.map(n => renderNode(n, 0)).join('')}</ul>`;
}

function renderView(route, ctx) {
  if (!route) return notFound();
  switch (route.kind) {
    case 'overview': return renderOverview(route, ctx);
    case 'projects': return renderProjects(route, ctx);
    case 'ops': return renderOps(route, ctx);
    case 'usage': return renderUsage(route, ctx);
    default: return notFound();
  }
}

function renderProfileControl() {
  const opts = ui.profiles.map(p => {
    const label = { admin: 'Web-Admin', consumer: 'Consumer', terminal: 'Terminal' }[p];
    return `<option value="${p}"${p === ui.profile ? ' selected' : ''}>${label}</option>`;
  }).join('');
  return `<label class="fig-profile-ctl">プロファイル
    <select id="fig-profile-select" data-testid="profile-select">${opts}</select></label>`;
}

async function main() {
  ui.init();
  const data = await loadData();
  ui.setVersionLabel(data.buildInfo?.coreVersionLabel);
  const ctx = { data, ui };

  const app = document.getElementById('app');
  app.innerHTML = `
    <a class="fig-skip-link" href="#main">本文へスキップ</a>
    <header class="portal-header" role="banner">
      <a class="portal-brand" href="${DEFAULT_ROUTE}" aria-label="FIG Core Design System ホーム">
        <span class="portal-brand__mark" aria-hidden="true">FIG</span>
        <span class="portal-brand__title">FIG Core DS</span>
      </a>
      <div class="portal-controls" role="group" aria-label="表示設定">
        <span class="fig-version-badge" data-testid="core-version" title="rolling で取り込んだ Core 版（表示専用）">Core: ${esc(ui.coreVersionLabel)}</span>
        ${renderProfileControl()}
      </div>
    </header>
    <div class="portal-body">
      <nav class="portal-nav" id="sidenav" aria-label="サイドナビゲーション"></nav>
      <main class="portal-main" id="main" tabindex="-1" role="main"></main>
    </div>`;

  const navTree = buildNav(data.taxonomy, data.registry);
  const sidenav = $('#sidenav');
  const mainEl = $('#main');

  function paint(route) {
    sidenav.innerHTML = renderNav(navTree, route ? route.raw : '');
    mainEl.innerHTML = renderView(route, ctx);
    document.title = titleFor(route);
    // route 変更時のフォーカス移動（A11Y-3）
    mainEl.focus({ preventScroll: false });
    // 通知（live region）
    announce(document.title);
  }

  const router = createRouter(paint);
  const currentRoute = () => parseRoute(location.hash) || parseRoute(DEFAULT_ROUTE);

  // プロファイル切替（FDQ9=A）
  app.addEventListener('change', (e) => {
    if (e.target && e.target.id === 'fig-profile-select') ui.setProfile(e.target.value);
  });
  // プロファイル変更時は iframe デモへ context 再伝播のため現在ビューを再描画
  window.addEventListener('ui:profile-changed', () => paint(currentRoute()));

  router.start();
}

function titleFor(route) {
  const base = 'FIG Core DS';
  if (!route) return base;
  const map = { overview: '概要', projects: 'プロジェクト集', ops: '運用', usage: '使い方' };
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

const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

document.addEventListener('DOMContentLoaded', main);
