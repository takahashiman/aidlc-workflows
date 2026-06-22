/**
 * Hash Router（PT-1 / business-logic §1.2-1.3）
 * route 文法:
 *   #/home                                  ランディング（役割別入口・はじめに読む順番・U2-4 / BR-PIA-1）
 *   #/overview/<section>/<item>
 *   #/overview/components/coverage          未整備可視化「余白」ビュー（U2-4 / BR-PIA-8）
 *   #/developer/<section>/<item>            Developer ガイド（Core developer スコープ・§4-1）
 *   #/projects[/<category>[/<subcategory>[/<product>[/<view>]]]]   view=component|page|demo
 *   #/ops/<versions|showcase|promotion|governance>
 *   #/usage/<topic>
 *
 * parseRoute は副作用のない純粋関数（テスト対象 / MAINT-2）。
 */
export const KINDS = ['home', 'overview', 'projects', 'ops', 'usage', 'developer'];
export const VIEWS = ['component', 'page', 'demo'];
export const DEFAULT_ROUTE = '#/home';

/** @returns {{kind:string, path:string[], view?:string, query:URLSearchParams, raw:string}|null} */
export function parseRoute(hash) {
  const raw = (hash || '').replace(/^#\/?/, '');
  const [pathStr, qs] = raw.split('?');
  const query = new URLSearchParams(qs || '');
  const segs = pathStr.split('/').filter(Boolean).map(decodeURIComponent);
  if (segs.length === 0) return null;
  const kind = segs[0];
  if (!KINDS.includes(kind)) return null;

  if (kind === 'projects') {
    const [, category, subcategory, product, view] = segs;
    return { kind, path: segs.slice(1), category, subcategory, product,
             view: VIEWS.includes(view) ? view : (product ? 'component' : undefined), query, raw };
  }
  return { kind, path: segs.slice(1), query, raw };
}

/** ルーター: hashchange を監視し dispatch する。 */
export function createRouter(onRoute) {
  function handle() {
    const route = parseRoute(location.hash) || parseRoute(DEFAULT_ROUTE);
    onRoute(route);
  }
  window.addEventListener('hashchange', handle);
  return {
    start() { if (!location.hash) location.replace(DEFAULT_ROUTE); else handle(); },
    navigate(to) { location.hash = to; },
  };
}
