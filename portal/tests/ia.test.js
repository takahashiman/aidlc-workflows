import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseRoute, DEFAULT_ROUTE, KINDS } from '../src/router.js';
import { GUIDES, renderGuide, usageIndex } from '../src/usage.js';
import { renderHome, renderBrowseMargin } from '../src/views.js';
import { HOME_SCENARIOS, HOME_OPERATIONS } from '../src/content.js';

/* ───────── ルーティング（Home / 余白）───────── */
test('home が kind に追加され DEFAULT_ROUTE=#/home（BR-PIA-1）', () => {
  assert.ok(KINDS.includes('home'));
  assert.equal(DEFAULT_ROUTE, '#/home');
  const r = parseRoute('#/home');
  assert.equal(r.kind, 'home');
});

test('既存の深いルートは後方互換で解決（NRD45-REL-1）', () => {
  assert.equal(parseRoute('#/overview/principles/vision').kind, 'overview');
  assert.equal(parseRoute('#/usage/portal-basics').kind, 'usage');
  const cov = parseRoute('#/overview/components/coverage');
  assert.equal(cov.kind, 'overview');
  assert.deepEqual(cov.path, ['components', 'coverage']);
});

/* ───────── 使い方ガイド 5新規（SP3 / BR-PIA-4/10/11）───────── */
const NEW_GUIDE_KEYS = ['scenario-existing', 'scenario-new', 'new-product-setup', 'migration', 'github-operations'];

test('5新規 GUIDES が存在し renderGuide が4節で描画する', () => {
  for (const k of NEW_GUIDE_KEYS) {
    assert.ok(GUIDES[k], `GUIDES.${k} 不在`);
    const html = renderGuide(k);
    assert.ok(html, `renderGuide(${k}) null`);
    assert.match(html, /<h1>/);
    assert.match(html, /前提/);
    assert.match(html, /手順/);
    assert.match(html, /確認/);
  }
});

test('シナリオ① は★最優先で使い方インデックス先頭グループに出る（BR-PIA-5）', () => {
  assert.equal(GUIDES['scenario-existing'].featured, true);
  const idx = usageIndex();
  assert.match(idx, /usage-featured/);
  // シナリオグループがその他より前に出る
  assert.ok(idx.indexOf('usage-group-scenario') < idx.indexOf('usage-group-operation'));
  // featured 行が scenario-new より前
  assert.ok(idx.indexOf('usage-link-scenario-existing') < idx.indexOf('usage-link-scenario-new'));
});

/* ───────── Home（US-P1改 developer-first / AC②-1）───────── */
test('renderHome（developer-first）がシナリオ/主要操作/整備状況カードを含む', () => {
  const html = renderHome();
  // シナリオ・カード
  for (const s of HOME_SCENARIOS) assert.match(html, new RegExp(`home-scenario-${s.id}`));
  assert.match(html, /home-scenario-existing/);
  // 主要操作カード（quickstart を先頭に含む）
  for (const o of HOME_OPERATIONS) assert.match(html, new RegExp(`home-op-${o.id}`));
  assert.match(html, /home-op-quickstart/);
  // 整備状況
  assert.match(html, /home-coverage-link/);
  // 役割選択カードは撤去（developer 前提・フッターへ退避）
  assert.doesNotMatch(html, /data-testid="role-card-/);
  assert.match(html, /fig-home-foot/);
});

/* ───────── 余白（US-P6 / BR-PIA-8/9）───────── */
test('renderBrowseMargin が整備済/未整備を区別し整備率を出す', () => {
  const ctx = { data: { coreContent: { PAGES: {
    'core/components-actions/fab': { template: 'component', title: 'FAB', preview: 'preview/components-fab.html' },
    'core/components-data/table': { template: 'component', title: 'Table' }, // preview 無し=未整備
    'core/patterns/layering': { template: 'pattern', title: 'Surface Layering' }, // 未整備
    'core/principles/vision': { template: 'principle', title: 'Vision' }, // 対象外
  } } } };
  const html = renderBrowseMargin(ctx);
  assert.match(html, /coverage-rate">1\/3/);     // 3件中 preview あり 1
  assert.match(html, /coverage-ready/);
  assert.match(html, /coverage-pending/);
});

test('renderBrowseMargin は coreContent 未取込で縮退（NRD45-REL-2）', () => {
  const html = renderBrowseMargin({ data: {} });
  assert.match(html, /取り込まれていません/);
});

/* ───────── 4操作セルフ検証 結線テスト（AC②-2 / SP6）───────── */
test('主要操作カードが Home→使い方ガイド→4節 まで到達できる', () => {
  // 主要操作カードの usage トピック（HOME_OPERATIONS の route から抽出）
  const topics = HOME_OPERATIONS.map(o => o.route.replace('#/usage/', ''));
  assert.deepEqual(new Set(topics), new Set(['quickstart', 'migration', 'new-product-setup', 'promotion']));
  const home = renderHome();
  for (const t of topics) {
    // Home からリンクされている
    assert.match(home, new RegExp(`#/usage/${t}`), `Home に ${t} リンク無し`);
    // 対応ガイドが存在し4節で描画
    const g = renderGuide(t);
    assert.ok(g, `${t} ガイド不在`);
    assert.match(g, /前提/);
    assert.match(g, /手順/);
    assert.match(g, /確認/);
  }
});

test('シナリオ① から移行/新製品セットアップ/GitHub 操作へ導線がある', () => {
  const s = renderGuide('scenario-existing');
  assert.match(s, /GitHub 操作/);
  assert.match(s, /移行|新製品セットアップ/);
});
