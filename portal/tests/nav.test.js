import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildNav } from '../src/nav.js';

const taxonomy = {
  categories: [
    { id: 'bus', label: 'バス', subcategories: [{ id: 'bus-location', label: 'バスロケ' }] },
    { id: 'taxi', label: 'タクシー', subcategories: [] },
  ],
};

test('上位は4区分（概要/プロジェクト集/運用/使い方・BR-IA-1）', () => {
  const tree = buildNav(taxonomy, { projects: [] });
  assert.deepEqual(tree.map(n => n.id), ['overview', 'projects', 'ops', 'usage']);
});

const projectsOf = (tree) => tree.find(n => n.id === 'projects');
const catOf = (tree, id) => projectsOf(tree).children.find(c => c.id === id);
const leafOf = (tree, cat, sub, repo) =>
  catOf(tree, cat).children.find(s => s.id === sub).children.find(l => l.id === repo);

test('プロジェクト集は taxonomy 駆動・名称昇順ソート（FDQ3=A / BR-NAV-4）', () => {
  const tree = buildNav(taxonomy, { projects: [] });
  const projects = projectsOf(tree);
  // taxonomy の全カテゴリが現れる（id 集合一致）
  assert.deepEqual(new Set(projects.children.map(c => c.id)), new Set(['bus', 'taxi']));
  // 日本語名称昇順: タクシー < バス
  assert.deepEqual(projects.children.map(c => c.id), ['taxi', 'bus']);
  assert.equal(catOf(tree, 'bus').source, 'taxonomy');
  assert.equal(catOf(tree, 'bus').children[0].id, 'bus-location');
});

test('registry 製品が葉に直接リンクで現れる（即時到達 / BR-NAV-1）', () => {
  const registry = { projects: [{ repo: 'fig-ext-bus-loc', name: 'バスロケ App', category: 'bus', subcategory: 'bus-location' }] };
  const tree = buildNav(taxonomy, registry);
  const leaf = leafOf(tree, 'bus', 'bus-location', 'fig-ext-bus-loc');
  assert.equal(leaf.status, 'published');
  assert.match(leaf.route, /^#\/projects\/bus\/bus-location\/fig-ext-bus-loc\/component$/);
});

test('必須キー欠落の製品は pending（BR-DATA-2/3）', () => {
  const registry = { projects: [{ repo: 'x', category: 'bus', subcategory: 'bus-location' }] }; // name 欠落
  const tree = buildNav(taxonomy, registry);
  assert.equal(leafOf(tree, 'bus', 'bus-location', 'x').status, 'pending');
});

test('temp-part は badge 付与（BR-DOG-3）', () => {
  const registry = { projects: [{ repo: 'tp', name: '仮', category: 'bus', subcategory: 'bus-location', kind: 'temp-part' }] };
  const tree = buildNav(taxonomy, registry);
  assert.equal(leafOf(tree, 'bus', 'bus-location', 'tp').badge, 'temp-part');
});

test('概要は静的セクションを持つ', () => {
  const tree = buildNav(taxonomy, { projects: [] });
  const overview = tree.find(n => n.id === 'overview');
  assert.ok(overview.children.length >= 1);
  assert.equal(overview.children[0].children[0].source, 'static');
});

test('サブカテゴリ無しのカテゴリも空配列で安全（taxi）', () => {
  const tree = buildNav(taxonomy, { projects: [] });
  assert.deepEqual(catOf(tree, 'taxi').children, []);
});
