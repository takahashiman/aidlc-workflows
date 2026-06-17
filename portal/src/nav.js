/**
 * Side Navigation 生成（PT-2 / US-2.1 即時到達 / FDQ3=A）
 * ナビツリー = 静的セクション（概要/運用/使い方）∪ 動的サブツリー（プロジェクト集 = taxonomy 駆動）。
 *
 * buildNav は副作用のない純粋関数（テスト対象 / MAINT-2）。
 */
import { SECTIONS, OVERVIEW, OPS, coreOverviewSections } from './content.js';

/**
 * @param {object} taxonomy  data/taxonomy.json
 * @param {object} registry  data/registry.json
 * @param {object} [coreContent]  data/core-content.json（F-6・あれば概要を Core 本文駆動）
 * @returns {Array} NavNode[]  { id,label,route,children,source,status,badge }
 */
export function buildNav(taxonomy, registry, coreContent) {
  const registryByRef = indexRegistry(registry);
  return SECTIONS.map(sec => {
    if (sec.id === 'overview') return node(sec, overviewChildren(coreContent));
    if (sec.id === 'ops') return node(sec, opsChildren());
    if (sec.id === 'usage') return node(sec, []); // 使い方は usage view 側でインデックス
    if (sec.id === 'projects') return node(sec, projectsChildren(taxonomy, registryByRef));
    return node(sec, []);
  });
}

function node(sec, children) {
  return { id: sec.id, label: sec.label, icon: sec.icon, route: sec.route, source: 'static', children };
}

function overviewChildren(coreContent) {
  // F-6: Core 本文があればそれを正典に。無ければ静的 OVERVIEW へフォールバック。
  const sections = coreOverviewSections(coreContent) || OVERVIEW;
  const source = coreOverviewSections(coreContent) ? 'core' : 'static';
  return sections.map(section => ({
    id: section.id, label: section.label, source,
    children: section.items.map(it => ({
      id: it.id, label: it.label, route: `#/overview/${section.id}/${it.id}`, source, children: [],
    })),
  }));
}

function opsChildren() {
  return OPS.map(v => ({ id: v.id, label: v.label, route: `#/ops/${v.id}`, source: 'static', children: [] }));
}

/** プロジェクト集: taxonomy を category>subcategory>product に写像（BR-NAV-2/3, 安定ソート BR-NAV-4） */
function projectsChildren(taxonomy, registryByRef) {
  const cats = [...(taxonomy?.categories || [])].sort(byOrderThenLabel);
  return cats.map(cat => ({
    id: cat.id, label: cat.label || cat.id, source: 'taxonomy',
    children: [...(cat.subcategories || [])].sort(byOrderThenLabel).map(sub => {
      const products = productsFor(cat.id, sub.id, registryByRef).sort(byOrderThenLabel);
      return {
        id: sub.id, label: sub.label || sub.id, source: 'taxonomy',
        children: products.map(p => ({
          id: p.repo, label: p.name || p.repo,
          route: `#/projects/${cat.id}/${sub.id}/${encodeURIComponent(p.repo)}/component`,
          source: 'taxonomy',
          status: isPublished(p) ? 'published' : 'pending',
          badge: p.kind === 'temp-part' ? 'temp-part' : undefined,
          children: [],
        })),
      };
    }),
  }));
}

function indexRegistry(registry) {
  const map = new Map();
  for (const p of registry?.projects || []) map.set(p.repo, p);
  return map;
}
function productsFor(catId, subId, registryByRef) {
  return [...registryByRef.values()].filter(p => p.category === catId && (p.subcategory || null) === (subId || null));
}
function isPublished(p) { return Boolean(p && p.repo && p.name && p.category); }
function byOrderThenLabel(a, b) {
  const oa = a.order ?? Number.MAX_SAFE_INTEGER, ob = b.order ?? Number.MAX_SAFE_INTEGER;
  if (oa !== ob) return oa - ob;
  return String(a.label || a.name || a.id).localeCompare(String(b.label || b.name || b.id), 'ja');
}
