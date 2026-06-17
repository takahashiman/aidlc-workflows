import { test } from 'node:test';
import assert from 'node:assert/strict';
import { coreOverviewSections, corePage } from '../src/content.js';
import { buildNav } from '../src/nav.js';
import { renderOverview, renderCorePage } from '../src/views.js';

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
  },
  PAGES: {
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
});

test('buildNav: coreContent 無しは従来通り静的 OVERVIEW（source=static / 後方互換）', () => {
  const tree = buildNav({ categories: [] }, { projects: [] });
  const overview = tree.find(n => n.id === 'overview');
  assert.equal(overview.children[0].children[0].source, 'static');
});

test('renderCorePage: principle は本文 HTML を信頼描画', () => {
  const html = renderCorePage(coreContent.PAGES['core/principles/vision']);
  assert.match(html, /<h1>Vision<\/h1>/);
  assert.match(html, /本文 <a href="#\/overview\/foundations\/colors-brand">/); // body は raw
});

test('renderCorePage: foundation は vendor/core/preview の sandbox iframe を埋め込む', () => {
  const html = renderCorePage(coreContent.PAGES['core/foundations/colors-brand']);
  assert.match(html, /src="vendor\/core\/preview\/colors-brand\.html"/);
  assert.match(html, /sandbox="allow-scripts allow-same-origin"/);
});

test('renderCorePage: component は推奨度バッジ・コード・a11y・spec を構成', () => {
  const html = renderCorePage(coreContent.PAGES['core/components-actions/fab'], { profile: 'consumer' });
  assert.match(html, /fig-avail--recommended[^>]*>Consumer: recommended/);
  assert.match(html, /fig-avail--caution[^>]*>Admin: caution/);
  assert.match(html, /<pre class="fig-code"><code>&lt;button class=&quot;fab&quot;&gt;\+&lt;\/button&gt;<\/code><\/pre>/);
  assert.match(html, /components\/fab\.spec\.md/);
});

test('renderCorePage: code/a11y はプロファイル別バリアントを選択（terminal）', () => {
  const html = renderCorePage(coreContent.PAGES['core/components-actions/fab'], { profile: 'terminal' });
  assert.match(html, /<strong>56px<\/strong> 以上。/); // a11y.terminal
});

test('renderOverview: coreContent ありで Core ページを描画、無指定 item は先頭へフォールバック', () => {
  const ctx = { data: { coreContent }, ui: { profile: 'admin' } };
  const html = renderOverview({ path: ['foundations', 'colors-brand'] }, ctx);
  assert.match(html, /Brand Colors/);
  // 不明 item → セクション先頭へ
  const fallback = renderOverview({ path: ['foundations', 'does-not-exist'] }, ctx);
  assert.match(fallback, /Brand Colors/);
});
