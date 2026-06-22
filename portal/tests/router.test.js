import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseRoute, KINDS, VIEWS } from '../src/router.js';

test('未知/空ルートは null', () => {
  assert.equal(parseRoute(''), null);
  assert.equal(parseRoute('#/'), null);
  assert.equal(parseRoute('#/unknown'), null);
});

test('overview を分解', () => {
  const r = parseRoute('#/overview/foundations/tokens');
  assert.equal(r.kind, 'overview');
  assert.deepEqual(r.path, ['foundations', 'tokens']);
});

test('projects: product 指定で view 既定は component', () => {
  const r = parseRoute('#/projects/bus/bus-location/fig-ext-bus-loc');
  assert.equal(r.kind, 'projects');
  assert.equal(r.category, 'bus');
  assert.equal(r.subcategory, 'bus-location');
  assert.equal(r.product, 'fig-ext-bus-loc');
  assert.equal(r.view, 'component');
});

test('projects: view 明示（demo）', () => {
  const r = parseRoute('#/projects/bus/bus-location/p/demo');
  assert.equal(r.view, 'demo');
});

test('projects: 不正 view は component にフォールバック', () => {
  const r = parseRoute('#/projects/bus/sub/p/bogus');
  assert.equal(r.view, 'component');
});

test('projects: ランディング（product 無し）は view undefined', () => {
  const r = parseRoute('#/projects');
  assert.equal(r.kind, 'projects');
  assert.equal(r.view, undefined);
});

test('クエリを分離して保持（profile 共有 / BR-STATE-1）', () => {
  const r = parseRoute('#/overview/principles/vision?profile=terminal');
  assert.equal(r.query.get('profile'), 'terminal');
  assert.deepEqual(r.path, ['principles', 'vision']);
});

test('ops / usage を分解', () => {
  assert.equal(parseRoute('#/ops/versions').kind, 'ops');
  assert.equal(parseRoute('#/usage/promotion').path[0], 'promotion');
});

test('developer ガイドを分解（§4-1）', () => {
  const r = parseRoute('#/developer/guide/getting-started');
  assert.equal(r.kind, 'developer');
  assert.deepEqual(r.path, ['guide', 'getting-started']);
});

test('定数', () => {
  assert.deepEqual(KINDS, ['home', 'overview', 'projects', 'ops', 'usage', 'developer']);
  assert.deepEqual(VIEWS, ['component', 'page', 'demo']);
});
