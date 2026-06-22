/**
 * View Renderers（PT-3/4/5/6/8 + Empty/Error Presenter）
 * 各 render は HTML 文字列を返す純粋関数（ctx = { data, ui }）。
 * data = { taxonomy, registry, versionMatrix, showcase, buildInfo }
 */
import { OVERVIEW, OPS, coreScopeSections, corePage, ROLE_ENTRIES, READING_ORDER, HOME_QUICK_LINKS } from './content.js';
import { VIEWS } from './router.js';
import { renderGuide, usageIndex } from './usage.js';

const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ───────────── Home ランディング（PT-Home / US-P1/P5 / SP1/SP2） ───────────── */
/** 役割別入口・はじめに読む順番・シナリオ入口・主要4操作クイックリンク。 */
export function renderHome() {
  const roleCard = (r) => `<li class="fig-role-card" data-testid="role-card-${esc(r.id)}">
    <h3 class="fig-role-card__title"><span class="fig-role-card__icon" aria-hidden="true">${esc(r.icon)}</span> ${esc(r.label)}</h3>
    <p class="fig-doc-muted">${esc(r.desc)}</p>
    <ul class="fig-doc-list">${r.links.map(l => `<li><a href="${esc(l.route)}" data-testid="role-link-${esc(r.id)}">${esc(l.label)} →</a></li>`).join('')}</ul>
    ${r.note ? `<p class="fig-doc-note">${esc(r.note)}</p>` : ''}
  </li>`;
  const order = READING_ORDER.map(o => `<li><a href="${esc(o.route)}">${esc(o.label)}</a></li>`).join('');
  const quick = HOME_QUICK_LINKS.map(q => `<li><a class="fig-btn-link" href="${esc(q.route)}" data-testid="home-quicklink">${esc(q.label)} →</a></li>`).join('');
  return `<div class="fig-home" data-testid="home">
    <header class="fig-home__hero">
      <h1>FIG Core Design System ポータル</h1>
      <p class="fig-doc-lead">あなたは開発者 / 利用者 / 管理者のどれですか？まずどこを読めばよいかを下から選べます。</p>
    </header>
    <section aria-labelledby="home-roles"><h2 id="home-roles">役割で選ぶ</h2>
      <ul class="fig-role-cards">${ROLE_ENTRIES.map(roleCard).join('')}</ul></section>
    <section aria-labelledby="home-scenarios"><h2 id="home-scenarios">シナリオで始める</h2>
      <ul class="fig-doc-list">
        <li><span class="fig-badge fig-badge--featured">★最優先</span> <a href="#/usage/scenario-existing" data-testid="home-scenario-existing">シナリオA：既存アプリを整える →</a></li>
        <li><a href="#/usage/scenario-new" data-testid="home-scenario-new">シナリオ②：新規開発で使う →</a></li>
      </ul></section>
    <section aria-labelledby="home-order"><h2 id="home-order">はじめに読む順番</h2>
      <ol class="fig-doc-list">${order}</ol></section>
    <section aria-labelledby="home-quick"><h2 id="home-quick">主要操作</h2>
      <ul class="fig-doc-list fig-home__quick">${quick}</ul></section>
    <p class="fig-doc-muted"><a href="#/overview/components/coverage" data-testid="home-coverage-link">コンポーネント整備状況（余白）を見る →</a></p>
  </div>`;
}

/* ───────────── 未整備可視化「余白」（US-P6 / SP4 / BR-PIA-8/9） ───────────── */
/** Core カタログの整備済/未整備（preview 未収録）を一覧・バッジ・整備率で提示。22件 preview は作らない（スコープ尊重）。 */
export function renderBrowseMargin(ctx) {
  const cc = ctx && ctx.data && ctx.data.coreContent;
  const pages = cc && cc.PAGES;
  if (!pages) return emptyOps('コンポーネント整備状況（余白）', 'Core 本文がまだ取り込まれていません（rolling 取込前）。');
  const rows = Object.entries(pages)
    .filter(([, p]) => p && (p.template === 'component' || p.template === 'pattern'))
    .map(([key, p]) => ({ key, title: p.title || key, ready: !!p.preview }))
    .sort((a, b) => a.title.localeCompare(b.title, 'ja'));
  const ready = rows.filter(r => r.ready).length;
  const total = rows.length;
  const items = rows.map(r => `<li class="fig-coverage-item" data-testid="coverage-item">
    <span>${esc(r.title)}</span>
    ${r.ready
      ? '<span class="fig-badge fig-badge--ready" data-testid="coverage-ready">整備済</span>'
      : '<span class="fig-badge fig-badge--pending" data-testid="coverage-pending">未整備</span>'}
  </li>`).join('');
  return `<div class="fig-doc"><h1>コンポーネント整備状況（余白）</h1>
    <p class="fig-doc-lead">整備率 <strong data-testid="coverage-rate">${ready}/${total}</strong>。未整備＝ライブプレビュー未収録です。Core リポジトリ側で preview を足せば、ポータル改修なしに自動で「整備済」へ切り替わります。</p>
    <ul class="fig-coverage">${items}</ul></div>`;
}

/* ───────────── 概要 / Developer（PT-3 IA Section View / Core 自前サイト準拠） ───────────── */
export function renderOverview(route, ctx) {
  // 未整備可視化「余白」ビュー（US-P6 / BR-PIA-8）。#/overview/components/coverage
  if (route.path[0] === 'components' && route.path[1] === 'coverage') return renderBrowseMargin(ctx);
  return renderScopeView('core', '概要', route, ctx);
}

/** Developer ガイド（Core developer スコープ・§4-1）。renderCorePage は scope 非依存なので流用。 */
export function renderDeveloper(route, ctx) {
  return renderScopeView('developer', 'Developer', route, ctx) + opsCrosslinkNote();
}

/** 導入↔運用 責務分離（US-P4 / SP5 / BR-PIA-7）。Developer ガイドに運用ビューへの相互リンク注記を IA レベルで添える（本文は不変）。 */
function opsCrosslinkNote() {
  return `<aside class="fig-doc-note" data-testid="ops-crosslink"><strong>運用について</strong>：
    Core 昇格・バージョン管理・配布などの運用作業は
    <a href="#/ops/promotion">運用 › Core 昇格フロー</a>・<a href="#/ops/versions">運用 › 版ダッシュボード</a>、
    手順は <a href="#/usage/promotion">使い方 › Core 昇格を提案</a> を参照してください。</aside>`;
}

/**
 * Core 本文の指定スコープの1ページを Core の DOM 規約で描画。
 * @param {string} scope     SITEMAP スコープ（core / developer）
 * @param {string} crumbRoot パンくず先頭ラベル
 */
function renderScopeView(scope, crumbRoot, route, ctx) {
  const [sectionId, itemId] = route.path;
  const coreContent = ctx && ctx.data && ctx.data.coreContent;
  const sections = coreScopeSections(coreContent, scope);
  // F-6: Core 本文が取込まれていれば Core 自前サイト相当のページを Core の DOM 規約で描画。
  if (sections) {
    const section = sections.find(s => s.id === sectionId) || sections[0];
    const item = section.items.find(i => i.id === itemId) || section.items[0];
    const page = corePage(coreContent, section.id, item.id, scope);
    if (page) return breadcrumbs([crumbRoot, section.label, item.label]) + renderCorePage(page, ctx && ctx.ui);
  }
  // フォールバック: core は静的 OVERVIEW（content.js）。developer は Core 本文必須のため not-found。
  if (scope === 'core') {
    const section = OVERVIEW.find(s => s.id === sectionId) || OVERVIEW[0];
    const item = section.items.find(i => i.id === itemId) || section.items[0];
    return `<div class="page-prose jp-prose">${item.body}</div>`;
  }
  return notFound(`Developer ガイド「${sectionId || ''}/${itemId || ''}」`);
}

/**
 * Core PAGES の1ページを Core 自前サイトと同じ DOM 規約で描画（F-6 / 方針A）。
 * profile 連動（availability バナー・code・a11y・preview の端末幅）はすべて CSS 駆動
 * （body.fig-profile-* セレクタ）。よって全 profile 分を DOM に出し、表示は CSS が切替える。
 * body / a11y / code は Core リポジトリ由来の信頼 HTML。title/description/code はエスケープ。
 */
export function renderCorePage(page, ui) {
  const parts = [pageHeader(page.title, page.description)];
  if (page.availability) parts.push(availBanner(page.availability));
  switch (page.template) {
    case 'foundation': parts.push(foundationBody(page)); break;
    case 'component':  parts.push(tabsBody(page, 'component')); break;
    case 'pattern':    parts.push(tabsBody(page, 'pattern')); break;
    case 'external':   parts.push(externalBody(page)); break;
    case 'principle':
    default:           parts.push(principleBody(page)); break;
  }
  return parts.join('\n');
}

/* ── Core ページ部品 ── */
function pageHeader(title, desc) {
  return `<header class="page-header">
    <h1 class="page-header__title jp-headline">${esc(title || '')}</h1>
    ${desc ? `<p class="page-header__desc jp-prose">${esc(desc)}</p>` : ''}
  </header>`;
}

/** profile 連動の推奨度バナー（CSS が現 profile=caution/avoid のときだけ表示・文言注入） */
function availBanner(a) {
  return `<div class="page-avail-banner" data-testid="page-avail-banner"
    data-avail-admin="${esc(a.admin || 'recommended')}"
    data-avail-consumer="${esc(a.consumer || 'recommended')}"
    data-avail-terminal="${esc(a.terminal || 'recommended')}">
    <span class="page-avail-banner__icon" aria-hidden="true">⚠</span>
    <span class="page-avail-banner__text">
      <strong class="page-avail-banner__head"></strong>
      <span class="page-avail-banner__desc">このコンポーネントは選択中のプロファイルでの利用に注意が必要です。プロファイル別の利用指針を Accessibility タブで確認してください。</span>
    </span></div>`;
}

function principleBody(page) {
  let html = page.body ? `<div class="page-prose jp-prose">${page.body}</div>` : '';
  if (page.preview) html += `<h3 class="page-prose">ライブプレビュー</h3>` + previewFrame(page.preview);
  return html;
}

function foundationBody(page) {
  const body = page.body ? `<div class="page-prose jp-prose">${page.body}</div>` : '';
  return body + previewFrame(page.preview);
}

function externalBody(page) {
  const body = page.body ? `<div class="page-prose jp-prose">${page.body}</div>` : '';
  const cta = page.href ? `<div class="external-cta"><a class="btn btn--primary" href="${esc(page.href)}" target="_blank" rel="noopener noreferrer">別タブで開く →</a></div>` : '';
  return body + cta;
}

/** component / pattern の4タブ（Overview / Live preview / Tokens&Code or Spec / Accessibility） */
function tabsBody(page, kind) {
  const tabs = kind === 'pattern'
    ? [['overview', 'Overview'], ['preview', 'Live preview'], ['spec', 'Spec'], ['a11y', 'Accessibility']]
    : [['overview', 'Overview'], ['preview', 'Live preview'], ['tokens', 'Tokens & Code'], ['a11y', 'Accessibility']];
  const tablist = tabs.map(([id, label], i) =>
    `<button type="button" class="page-tab" role="tab" id="tab-${id}" aria-controls="panel-${id}" aria-selected="${i === 0 ? 'true' : 'false'}" tabindex="${i === 0 ? '0' : '-1'}" data-tab="${id}">${esc(label)}</button>`
  ).join('');
  const panelHtml = (id) =>
    id === 'overview' ? overviewPanel(page)
    : id === 'preview' ? previewPanel(page)
    : id === 'tokens' ? tokensPanel(page)
    : id === 'spec' ? specPanel(page)
    : a11yPanel(page);
  const panels = tabs.map(([id], i) =>
    `<section class="tab-panel" role="tabpanel" id="panel-${id}" aria-labelledby="tab-${id}" data-active="${i === 0 ? 'true' : 'false'}">${panelHtml(id)}</section>`
  ).join('');
  return `<div class="page-tabs" role="tablist" aria-label="${esc(page.title)} ビュー切替" data-testid="page-tabs">${tablist}</div><div class="page-panels">${panels}</div>`;
}

function overviewPanel(page) {
  const body = page.body
    ? `<div class="page-prose jp-prose">${page.body}</div>`
    : `<div class="page-prose jp-prose"><p>${esc(page.description || 'このページの概要は spec を参照してください。')}</p></div>`;
  return body + specLink(page);
}
function previewPanel(page) {
  if (!page.preview) return `<div class="page-empty-preview">このコンポーネントのライブプレビューは未収録です。Spec タブを参照してください。</div>`;
  return previewFrame(page.preview);
}
function tokensPanel(page) {
  const intro = `<div class="page-prose jp-prose"><p>このコンポーネントが参照する意味的トークン、およびプロファイル別の実装例です。</p></div>`;
  return intro + codeBlocks(page.code) + specLink(page);
}
function specPanel(page) {
  return page.spec
    ? `<div class="page-prose jp-prose"><p>詳細仕様は <a href="${esc(specHref(page.spec))}" target="_blank" rel="noopener noreferrer">${esc(page.spec)}</a> を参照してください。Spec を Single Source of Truth として、本ポータルは抜粋と参照に徹します。</p></div>`
    : `<div class="page-prose jp-prose"><p>このパターンの spec はまだ準備中です。</p></div>`;
}

/** code（プロファイル連動・全 profile を DOM 出力し CSS が現 profile を表示） */
function codeBlocks(code) {
  if (!code) return '';
  const blocks = ['admin', 'consumer', 'terminal'].map(p => {
    const body = resolveProfileValue(code, p);
    return body ? `<pre class="page-code" data-code-profile="${p}"><code class="language-html">${esc(body)}</code></pre>` : '';
  }).join('');
  if (!blocks) return '';
  return `<h3 class="page-prose">Code（プロファイル連動）</h3><div class="code-blocks">${blocks}</div>`;
}

/** a11y（プロファイル連動・3 ブロックを常時出力し CSS が現 profile を表示。a11y は信頼 HTML） */
function a11yPanel(page) {
  const fallback = 'このページの a11y 注意点は spec を参照してください。';
  const blocks = ['admin', 'consumer', 'terminal'].map(p => {
    const body = resolveProfileValue(page.a11y, p) || fallback;
    return `<div class="a11y-callout" data-a11y-profile="${p}"><strong>Accessibility</strong><div class="jp-text">${body}</div></div>`;
  }).join('');
  return `<div class="a11y-blocks">${blocks}</div>`;
}

function specLink(page) {
  return page.spec
    ? `<p class="page-prose"><a href="${esc(specHref(page.spec))}" target="_blank" rel="noopener noreferrer">Spec を開く: ${esc(page.spec)} →</a></p>`
    : '';
}
/** spec パス（components/x.spec.md）→ vendor 取込していないため Core repo を直接は開けない。表示は相対のまま。 */
function specHref(spec) { return 'vendor/core/' + String(spec).replace(/^\/+/, ''); }

/** Core プレビュー HTML を端末枠 iframe で埋め込む（vendor/core/preview/*・profile 連動は CSS+JS） */
function previewFrame(preview) {
  if (!preview) return `<div class="page-empty-preview">プレビューは未収録です。</div>`;
  const src = 'vendor/core/' + String(preview).replace(/^\/+/, '');
  return `<div class="preview-frame" data-preview-frame="true">
    <iframe class="page-iframe" src="${esc(src)}" loading="lazy" title="ライブプレビュー" data-testid="core-preview"></iframe>
  </div>
  <div class="page-iframe-meta"><a href="${esc(src)}" target="_blank" rel="noopener noreferrer">新しいタブで開く ↗</a></div>`;
}

/** code / a11y は文字列 or {default,admin,consumer,terminal}。指定 profile を解決（Core 準拠）。 */
function resolveProfileValue(value, profile) {
  if (value == null) return null;
  if (typeof value === 'string') return value;
  return value[profile] || value.default || null;
}

function breadcrumbs(parts) {
  const sep = `<span class="portal-breadcrumbs__sep" aria-hidden="true">/</span>`;
  return `<nav class="portal-breadcrumbs" aria-label="現在地">${parts.map(p => `<span>${esc(p)}</span>`).join(sep)}</nav>`;
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
