import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coreOverviewSections, coreScopeSections, corePage } from '../src/content.js';
import { buildNav } from '../src/nav.js';
import { renderOverview, renderDeveloper, renderCorePage } from '../src/views.js';

/** Core 本文（extractCoreContent 相当）の最小モック */
const coreContent = {
  SITEMAP: {
    core: {
      label: 'Core',
      sections: [
        { id: 'principles', label: 'Design Principles', items: [{ id: 'vision', label: 'Vision' }] },
        { id: 'foundations', label: 'Foundations', items: [{ id: 'colors-brand', label: 'Brand Colors' }, { id: 'empty-section-marker', label: 'x' }] },
        { id: 'components-actions', label: 'Actions & Buttons', items: [{ id: 'fab', label: 'FAB' }] },
        { id: 'empty', label: '空', items: [] }, // items 無しは除外される
      ],
    },
    extensions: { sections: [] },
    developer: {
      label: 'Developer Guide',
      sections: [
        { id: 'guide', label: 'Getting Started & Beyond', hint: '導入・運用・貢献', items: [
          { id: 'getting-started', label: 'Getting Started（導入手順）' },
          { id: 'integration', label: 'Integration Guide' },
        ] },
      ],
    },
  },
  PAGES: {
    'developer/guide/getting-started': { template: 'principle', title: 'Getting Started', description: '導入手順', body: '<p>まず CSS を読み込みます。</p>' },
    'developer/guide/integration': { template: 'principle', title: 'Integration Guide', description: '外部リポへの導入', body: '<p>3 つの導入経路があります。</p>' },
    'core/principles/vision': { template: 'principle', title: 'Vision', description: 'ビジョン', body: '<p>本文 <a href="#/overview/foundations/colors-brand">色</a></p>' },
    'core/foundations/colors-brand': { template: 'foundation', title: 'Brand Colors', description: '色', preview: 'preview/colors-brand.html' },
    'core/foundations/empty-section-marker': { template: 'principle', title: 'x' },
    'core/components-actions/fab': {
      template: 'component', title: 'FAB', description: 'FAB です', preview: 'preview/components-fab.html',
      spec: 'components/fab.spec.md',
      availability: { admin: 'caution', consumer: 'recommended', terminal: 'recommended' },
      a11y: { default: '<code>aria-label</code> 必須。', terminal: '<strong>56px</strong> 以上。' },
      code: { default: '<button class="fab">+</button>' },
    },
  },
};

test('coreOverviewSections: coreContent 無しは null（静的フォールバック）', () => {
  assert.equal(coreOverviewSections(null), null);
  assert.equal(coreOverviewSections({}), null);
  assert.equal(coreOverviewSections({ SITEMAP: {} }), null);
});

test('coreOverviewSections: SITEMAP.core を概要セクション木へ写像（items 空セクションは除外）', () => {
  const secs = coreOverviewSections(coreContent);
  assert.deepEqual(secs.map(s => s.id), ['principles', 'foundations', 'components-actions']);
  assert.equal(secs.find(s => s.id === 'foundations').items[0].id, 'colors-brand');
  // component は availability を items に持ち、foundation は持たない（サイドバー data-avail 用）
  assert.equal(secs.find(s => s.id === 'foundations').items[0].avail, null);
  assert.deepEqual(secs.find(s => s.id === 'components-actions').items[0].avail, { admin: 'caution', consumer: 'recommended', terminal: 'recommended' });
});

test('corePage: route セグメントから PAGES キーを解決', () => {
  assert.equal(corePage(coreContent, 'principles', 'vision').template, 'principle');
  assert.equal(corePage(coreContent, 'foundations', 'colors-brand').preview, 'preview/colors-brand.html');
  assert.equal(corePage(coreContent, 'nope', 'nope'), null);
});

test('buildNav: coreContent ありで概要は Core 駆動（source=core・Core セクションを反映）', () => {
  const tree = buildNav({ categories: [] }, { projects: [] }, coreContent);
  const overview = tree.find(n => n.id === 'overview');
  assert.equal(overview.children[0].source, 'core');
  assert.deepEqual(overview.children.map(c => c.id), ['principles', 'foundations', 'components-actions']);
  const colorsLeaf = overview.children.find(c => c.id === 'foundations').children.find(i => i.id === 'colors-brand');
  assert.match(colorsLeaf.route, /^#\/overview\/foundations\/colors-brand$/);
  // component リーフは avail を持ち、サイドバーの data-avail バッジ/減衰に使える
  const fabLeaf = overview.children.find(c => c.id === 'components-actions').children.find(i => i.id === 'fab');
  assert.deepEqual(fabLeaf.avail, { admin: 'caution', consumer: 'recommended', terminal: 'recommended' });
});

test('buildNav: coreContent 無しは従来通り静的 OVERVIEW（source=static / 後方互換）', () => {
  const tree = buildNav({ categories: [] }, { projects: [] });
  const overview = tree.find(n => n.id === 'overview');
  assert.equal(overview.children[0].children[0].source, 'static');
});

test('renderCorePage: principle は page-header + 本文 HTML（raw）を描画', () => {
  const html = renderCorePage(coreContent.PAGES['core/principles/vision']);
  assert.match(html, /class="page-header__title[^"]*">Vision</);
  assert.match(html, /class="page-prose jp-prose">/);
  assert.match(html, /本文 <a href="#\/overview\/foundations\/colors-brand">/); // body は raw
});

test('renderCorePage: foundation は preview-frame の page-iframe を埋め込む（sandbox 無し=profile 伝播可能）', () => {
  const html = renderCorePage(coreContent.PAGES['core/foundations/colors-brand']);
  assert.match(html, /class="preview-frame"/);
  assert.match(html, /class="page-iframe" src="vendor\/core\/preview\/colors-brand\.html"/);
  assert.doesNotMatch(html, /sandbox=/); // same-origin で contentDocument を触れるよう sandbox を付けない
});

test('renderCorePage: component は タブ + profile 連動バナー/コード/a11y を CSS 駆動で構成', () => {
  const html = renderCorePage(coreContent.PAGES['core/components-actions/fab'], { profile: 'consumer' });
  // 推奨度は静的バッジではなく data-avail-* バナー（CSS が現 profile で表示）
  assert.match(html, /class="page-avail-banner"[\s\S]*data-avail-consumer="recommended"/);
  assert.match(html, /data-avail-admin="caution"/);
  // タブ構成
  assert.match(html, /class="page-tabs"/);
  assert.match(html, /data-tab="tokens"/);
  // コードは全 profile 分を data-code-profile で出力（CSS が現 profile を表示）
  assert.match(html, /<pre class="page-code" data-code-profile="consumer"><code class="language-html">&lt;button class=&quot;fab&quot;&gt;\+&lt;\/button&gt;<\/code><\/pre>/);
  // a11y は全 profile 分を data-a11y-profile で出力
  assert.match(html, /class="a11y-callout" data-a11y-profile="terminal"/);
  // spec リンク
  assert.match(html, /vendor\/core\/components\/fab\.spec\.md/);
});

test('renderCorePage: a11y は profile 別ブロックを全出力し terminal バリアントを含む', () => {
  const html = renderCorePage(coreContent.PAGES['core/components-actions/fab'], { profile: 'terminal' });
  assert.match(html, /<strong>56px<\/strong> 以上。/); // a11y.terminal（raw）
  assert.match(html, /aria-label<\/code> 必須。/); // a11y.default（admin/consumer へフォールバック）
});

test('renderOverview: coreContent ありで Core ページ + パンくずを描画、無指定 item は先頭へフォールバック', () => {
  const ctx = { data: { coreContent }, ui: { profile: 'admin' } };
  const html = renderOverview({ path: ['foundations', 'colors-brand'] }, ctx);
  assert.match(html, /class="portal-breadcrumbs"/);
  assert.match(html, /Brand Colors/);
  // 不明 item → セクション先頭へ
  const fallback = renderOverview({ path: ['foundations', 'does-not-exist'] }, ctx);
  assert.match(fallback, /Brand Colors/);
});

/* ───────────── Developer ガイド画面化（§4-1） ───────────── */
test('coreScopeSections: developer スコープを写像（hint 保持）', () => {
  const secs = coreScopeSections(coreContent, 'developer');
  assert.deepEqual(secs.map(s => s.id), ['guide']);
  assert.equal(secs[0].hint, '導入・運用・貢献');
  assert.deepEqual(secs[0].items.map(i => i.id), ['getting-started', 'integration']);
});

test('corePage: scope 引数で developer ページを解決（既定は core）', () => {
  assert.equal(corePage(coreContent, 'guide', 'getting-started', 'developer').title, 'Getting Started');
  assert.equal(corePage(coreContent, 'guide', 'getting-started'), null); // 既定 core では引けない
});

test('buildNav: developer スコープがあれば Developer セクションを追加（route=#/developer/...）', () => {
  const tree = buildNav({ categories: [] }, { projects: [] }, coreContent);
  const dev = tree.find(n => n.id === 'developer');
  assert.ok(dev, 'Developer セクションが現れる');
  assert.equal(dev.children[0].children[0].route, '#/developer/guide/getting-started');
});

test('buildNav: coreContent 無し（developer スコープ無し）では Developer セクションを出さない', () => {
  const tree = buildNav({ categories: [] }, { projects: [] });
  assert.equal(tree.find(n => n.id === 'developer'), undefined);
  assert.deepEqual(tree.map(n => n.id), ['overview', 'projects', 'ops', 'usage']);
});

test('renderDeveloper: developer ページ + Developer パンくずを描画', () => {
  const ctx = { data: { coreContent }, ui: { profile: 'admin' } };
  const html = renderDeveloper({ path: ['guide', 'getting-started'] }, ctx);
  assert.match(html, /class="portal-breadcrumbs"/);
  assert.match(html, /<span>Developer<\/span>/);
  assert.match(html, /Getting Started/);
});

test('renderDeveloper: Core 本文が無ければ not-found（静的フォールバック無し）', () => {
  const html = renderDeveloper({ path: ['guide', 'getting-started'] }, { data: {}, ui: {} });
  assert.match(html, /ページが見つかりません/);
});
