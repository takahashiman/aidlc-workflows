/**
 * View Renderers（PT-3/4/5/6/8 + Empty/Error Presenter）
 * 各 render は HTML 文字列を返す純粋関数（ctx = { data, ui }）。
 * data = { taxonomy, registry, versionMatrix, showcase, buildInfo }
 */
import { OVERVIEW, OPS } from './content.js';
import { VIEWS } from './router.js';
import { renderGuide, usageIndex } from './usage.js';

const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ───────────── 概要（PT-3 IA Section View） ───────────── */
export function renderOverview(route) {
  const [sectionId, itemId] = route.path;
  const section = OVERVIEW.find(s => s.id === sectionId) || OVERVIEW[0];
  const item = section.items.find(i => i.id === itemId) || section.items[0];
  return `<div class="fig-doc">${item.body}</div>`;
}

/* ───────────── プロジェクト集（PT-4 Project View / US-2.2） ───────────── */
export function renderProjects(route, ctx) {
  const { registry } = ctx.data;
  if (!route.product) return projectsLanding(ctx);

  const project = (registry.projects || []).find(p => p.repo === route.product);
  if (!project) return pending(route.product); // registry 未登録 = 準備中（BR-DATA-2）

  const view = VIEWS.includes(route.view) ? route.view : 'component';
  const tabs = VIEWS.map(v => {
    const cur = v === view ? ' aria-current="page"' : '';
    const label = { component: 'コンポーネント単体', page: 'ページ遷移', demo: 'デモ' }[v];
    const href = `#/projects/${route.category}/${route.subcategory}/${encodeURIComponent(project.repo)}/${v}`;
    return `<a role="tab" class="fig-tab"${cur} href="${href}" data-testid="project-tab-${v}">${label}</a>`;
  }).join('');

  return `<div class="fig-project">
    <header class="fig-project__head">
      <h1>${esc(project.name || project.repo)} ${badge(project)}</h1>
      <p class="fig-doc-muted">${esc(project.repo)}${project.coreVersion ? ' · Core ' + esc(project.coreVersion) : ''}</p>
    </header>
    <div role="tablist" class="fig-tablist" aria-label="閲覧形態">${tabs}</div>
    <div class="fig-project__view">${renderProjectViewBody(project, view, ctx)}</div>
  </div>`;
}

function renderProjectViewBody(project, view, ctx) {
  const src = view === 'demo' ? project.demoUrl
    : view === 'page' ? (project.pagePreviewPath || project.previewPath)
    : project.previewPath;
  if (view === 'demo') {
    if (!project.demoUrl) return fallback('デモは準備中です。', project);
    return iframeEmbed(withContext(project.demoUrl, ctx), `${project.name} デモ`);
  }
  if (!src) return fallback('プレビューは準備中です。', project);
  return iframeEmbed(withContext(src, ctx), `${project.name} ${view}`);
}

/** プロファイル/Core 版を query 伝播（BR-VIEW-2） */
function withContext(url, ctx) {
  try {
    const u = new URL(url, location.href);
    u.searchParams.set('profile', ctx.ui.profile);
    if (ctx.data.buildInfo?.coreVersionLabel) u.searchParams.set('coreVersion', ctx.data.buildInfo.coreVersionLabel);
    return u.pathname.startsWith('/') && !/^https?:/.test(url) ? u.pathname + u.search : u.toString();
  } catch { return url; }
}

/** sandbox 化 iframe（SEC-2 / BR-VIEW-2） */
function iframeEmbed(src, title) {
  return `<iframe class="fig-demo-frame" src="${esc(src)}" title="${esc(title)}"
    sandbox="allow-scripts allow-same-origin" referrerpolicy="no-referrer"
    loading="lazy" data-testid="project-demo-frame"></iframe>`;
}

function projectsLanding(ctx) {
  const { taxonomy, registry } = ctx.data;
  const n = (registry.projects || []).length;
  const cats = (taxonomy.categories || []).map(c => `<li><strong>${esc(c.label)}</strong>（${(c.subcategories || []).length} サブカテゴリ）</li>`).join('');
  const note = n === 0
    ? `<p class="fig-empty">登録済みの拡張製品はまだありません。新規製品は AI 自律セットアップ（U3）が registry へ登録 PR を自動起票します。Core 自身の見え方は「概要 › Components」を参照してください。</p>`
    : `<p class="fig-doc-lead">${n} 件の製品が登録されています。左ナビから選択してください。</p>`;
  return `<div class="fig-doc"><h1>プロジェクト集</h1>${note}<ul class="fig-doc-list">${cats}</ul></div>`;
}

/* ───────────── 運用（PT-5 版ダッシュボード / PT-6 Showcase） ───────────── */
export function renderOps(route, ctx) {
  const viewId = route.path[0] || 'versions';
  const def = OPS.find(o => o.id === viewId) || OPS[0];
  if (def.kind === 'version-dashboard') return renderVersionDashboard(ctx);
  if (def.kind === 'showcase') return renderShowcase(ctx);
  return `<div class="fig-doc">${def.body || ('<h1>' + esc(def.label) + '</h1>')}</div>`;
}

function renderVersionDashboard(ctx) {
  const m = ctx.data.versionMatrix || {};
  const entries = m.entries || [];
  if (!entries.length) return emptyOps('版ダッシュボード', 'バージョン収集はまだ実行されていません（CI バージョン収集 = U5 で有効化）。');
  const rows = entries.map(e => `<tr>
    <th scope="row">${esc(e.projectName || e.projectId)}</th>
    <td>${esc(e.coreVersionPinned)}</td><td>${esc(e.coreVersionLatest)}</td>
    <td><span class="fig-status fig-status--${esc(e.status)}">${esc(e.status)}</span></td>
    <td class="fig-doc-muted">${esc(e.source || '')}</td></tr>`).join('');
  return `<div class="fig-doc"><h1>版ダッシュボード</h1>
    <table class="fig-table" data-testid="version-dashboard">
      <caption>各製品の参照 Core バージョンと追従状況</caption>
      <thead><tr><th scope="col">製品</th><th scope="col">pin 版</th><th scope="col">最新版</th><th scope="col">状況</th><th scope="col">収集元</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>`;
}

function renderShowcase(ctx) {
  const s = ctx.data.showcase || {};
  const items = s.items || [];
  // 空状態の区別（BR-SC-EMPTY）: 未収集（スタブ/未実行）と 収集済み0件 を文言で分ける
  const collected = !!s.collectedAt && !/stub/i.test(s._generatedBy || '');
  if (!items.length) {
    return collected
      ? emptyOps('Showcase', '自動クローリングは実行されましたが、登録製品に独自パーツ／仮パーツは見つかりませんでした。対象は各製品の <code>extensions/</code> ディレクトリ、または <code>temp-part</code> ラベルの Issue です。')
      : emptyOps('Showcase', '独自/仮パーツの自動クローリングはまだ実行されていません（CI-4 未設定/無効）。設定手順は「使い方」を参照してください。');
  }
  const cards = items.map(it => `<li class="fig-card fig-showcase-item" data-testid="showcase-item-${esc(it.id)}">
    <div class="fig-showcase-item__head"><strong>${esc(it.name)}</strong> ${it.kind === 'temp-part' ? tag('仮パーツ', 'temp') : tag('拡張', 'ext')} ${it.promotedToCore ? tag('Core昇格済み・撤去推奨', 'core') : ''}</div>
    <p class="fig-doc-muted">${esc(it.ownerProjectId)}</p>
    ${showcasePreview(it)}
    ${it.promotable && !it.promotedToCore ? `<a class="fig-btn-link" href="#/usage/promotion" data-testid="showcase-promote-${esc(it.id)}">昇格を提案する →</a>` : ''}
  </li>`).join('');
  return `<div class="fig-doc"><h1>Showcase</h1>
    <p class="fig-doc-lead">各製品の Core 未満パーツを横断一覧。再利用・昇格提案の起点です（US-5.2）。</p>
    <ul class="fig-showcase">${cards}</ul></div>`;
}

/** ショーケース項目のプレビュー導線（screenshotUrl=外部 / previewPath=repo 内・任意） */
function showcasePreview(it) {
  if (it.screenshotUrl) return `<a class="fig-doc-muted fig-showcase-item__preview" href="${esc(it.screenshotUrl)}" target="_blank" rel="noopener noreferrer" data-testid="showcase-preview-${esc(it.id)}">参照 ↗</a>`;
  if (it.previewPath) return `<span class="fig-doc-muted fig-showcase-item__preview" data-testid="showcase-preview-${esc(it.id)}">${esc(it.previewPath)}</span>`;
  return '';
}

/* ───────────── 使い方（PT-8） ───────────── */
export function renderUsage(route) {
  const topic = route.path[0];
  if (!topic || topic === 'index') return `<div class="fig-doc">${usageIndex()}</div>`;
  const html = renderGuide(topic);
  return html ? `<div class="fig-doc">${html}</div>` : notFound(`使い方「${topic}」`);
}

/* ───────────── 共通: 空状態 / フォールバック / pending / Not-Found ───────────── */
function badge(project) {
  if (project.kind === 'temp-part') return tag('仮パーツ', 'temp');
  return '';
}
function tag(label, kind) { return `<span class="fig-badge fig-badge--${kind}" data-testid="badge-${kind}">${esc(label)}</span>`; }
function fallback(msg, project) {
  return `<div class="fig-empty"><p>${esc(msg)}</p>${project.repoUrl ? `<p><a href="${esc(project.repoUrl)}" target="_blank" rel="noopener noreferrer">製品リポジトリを開く →</a></p>` : ''}</div>`;
}
function pending(name) {
  return `<div class="fig-doc"><h1>${esc(name)} <span class="fig-badge fig-badge--pending">準備中</span></h1>
    <p class="fig-empty">この製品は taxonomy に登録されていますが、registry 未登録のため内容がまだありません。鶏卵回避の方針により、開発は仮パーツで継続できます（<a href="#/usage/temp-part">使い方 › 仮パーツ</a>）。</p></div>`;
}
function emptyOps(title, msg) {
  return `<div class="fig-doc"><h1>${esc(title)}</h1><p class="fig-empty" data-testid="empty-state">${esc(msg)}</p></div>`;
}
export function notFound(what) {
  return `<div class="fig-doc"><h1>ページが見つかりません</h1>
    <p class="fig-empty">${esc(what || 'お探しのページ')}は存在しません。</p>
    <p><a href="#/overview/principles/vision">概要トップへ →</a></p></div>`;
}
