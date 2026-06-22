/**
 * IA コンテンツ定義（FDQ2=A: 概要 / プロジェクト集 / 運用 / 使い方 の4区分）
 * - 概要 / 運用 / 使い方 = 静的定義（このファイル）
 * - プロジェクト集 = taxonomy.json 駆動（nav.js が動的生成 / FDQ3=A）
 *
 * 旧 IA（scope=Core/Extensions/Developer × section）の充実コンテンツは
 * src/legacy/legacy-content.js に保全。概要セクションは段階的にそこから取り込む。
 */

/** 上位区分（サイドナビ最上位 / BR-IA-1）。developer は Core 本文に developer スコープがある時のみ nav に出る（nav.js が空なら省略）。 */
export const SECTIONS = [
  { id: 'overview', label: '概要', icon: '◎', route: '#/overview/principles/vision' },
  { id: 'projects', label: 'プロジェクト集', icon: '▤', route: '#/projects', dynamic: true },
  { id: 'ops', label: '運用', icon: '⚙', route: '#/ops/versions' },
  { id: 'usage', label: '使い方', icon: '?', route: '#/usage/portal-basics' },
  { id: 'developer', label: 'Developer', icon: '⚒', route: '#/developer/guide/getting-started' },
];

/**
 * Home ランディングの役割別入口（US-P1 / BR-PIA-2 / SP2）。役割→誘導先を単一定義。
 * 管理者カードの権利者向け詳細 GitHub 操作は **ポータルに載せない**＝aidlc-docs 側にある旨を注記（§4-2 / NRD45-SEC-2）。
 */
export const ROLE_ENTRIES = [
  {
    id: 'developer', label: '開発者', icon: '⚒',
    desc: '実装に使う — 既存を整える / 新規を作る。',
    links: [
      { label: 'シナリオA：既存アプリを整える（最優先）', route: '#/usage/scenario-existing' },
      { label: 'シナリオ②：新規開発で使う', route: '#/usage/scenario-new' },
      { label: 'Developer ガイド（はじめに）', route: '#/developer/guide/getting-started' },
    ],
  },
  {
    id: 'user', label: '利用者', icon: '◎',
    desc: '見て確認する — 最新の正解と各製品の実装。',
    links: [
      { label: 'ポータルの歩き方', route: '#/usage/portal-basics' },
      { label: '閲覧3形態の使い分け', route: '#/usage/view-modes' },
      { label: 'プロジェクト集', route: '#/projects' },
    ],
  },
  {
    id: 'admin', label: '管理者', icon: '⚙',
    desc: '配布・昇格・版を運用する。',
    links: [
      { label: '版ダッシュボード', route: '#/ops/versions' },
      { label: 'Showcase（横断一覧）', route: '#/ops/showcase' },
      { label: 'Core 昇格フロー', route: '#/ops/promotion' },
    ],
    note: '非エンジニア向けの詳細な GitHub 操作（権利者向け）は、公開ポータルではなくリポジトリ内ドキュメント（aidlc-docs/）に分離しています。',
  },
];

/** はじめに読む順番（オンボーディング・US-P5 / BR-PIA-3 / SP1）。本文は複製せずリンク順序のみ。 */
export const READING_ORDER = [
  { label: '① ビジョン（何のための基盤か）', route: '#/overview/principles/vision' },
  { label: '② 三層トークン / デバイスプロファイル', route: '#/overview/foundations/tokens' },
  { label: '③ シナリオ別ガイド（既存 / 新規）', route: '#/usage/scenario-existing' },
  { label: '④ 主要操作の使い方', route: '#/usage/portal-basics' },
];

/** Home の主要4操作クイックリンク（US-P7 / AC②-1）。 */
export const HOME_QUICK_LINKS = [
  { label: '新製品セットアップ', route: '#/usage/new-product-setup' },
  { label: '既存コードを移行', route: '#/usage/migration' },
  { label: 'Core 昇格を提案', route: '#/usage/promotion' },
  { label: '参照 Core バージョン確認', route: '#/usage/core-version' },
];

/** 概要（Core DS 自身）の静的ページツリー。route = #/overview/<section>/<item> */
export const OVERVIEW = [
  {
    id: 'principles', label: 'Design Principles', items: [
      { id: 'vision', label: 'Vision', body: page('Vision',
        'FIG Core Design System は「スピード・慈愛・俯瞰」を価値基準に、自社デザイン資産を恒久中核へ蓄積・循環させる単一の正解基盤です。',
        ['Core DS は全拡張プロジェクトの親（クリティカルパス）。',
         'ポータルは常に最新 Core を rolling 反映し、最新の正解を基準に比較できる。']) },
      { id: 'values', label: 'Values', body: page('Values',
        '三つの価値：スピード（玄人最適化・最小クリック）／慈愛（提案の低ハードル・伴走）／俯瞰（横断ショーケース・版ダッシュボード）。') },
      { id: 'brand-dna', label: 'Brand DNA', body: page('Brand DNA',
        'シグネチャ色とトークン階層でブランドを単一定義。再テーマは tokens/signature.css に集約。') },
    ],
  },
  {
    id: 'foundations', label: 'Foundations', items: [
      { id: 'tokens', label: '三層トークン', body: page('三層トークン',
        'Primitive（生値）→ Semantic（役割）→ Component の単方向参照。Component は Semantic のみ参照し、生値・Primitive を直接参照しない（US-1.2）。',
        ['依存方向は上位→下位の単方向（逆流禁止・CI Lint で強制 / U5）。']) },
      { id: 'device-profiles', label: 'Device Profiles', body: page('3デバイスプロファイル',
        '.fig-profile-admin / -consumer / -terminal で Semantic 値を上書きし、Web-Admin / Mobile-Consumer / Mobile-Terminal を単一コードで最適化（US-1.3）。ポータルは既定 admin。',
        ['右上のプロファイル切替で各デバイス表示を確認できる（状態は URL+localStorage で保持）。']) },
      { id: 'color-system', label: 'Color System', body: page('Color System',
        'Brand / Neutrals / Status のパレットを Semantic トークンへ写像。コントラストは WCAG 2.1 AA を満たす。') },
      { id: 'typography', label: 'Typography', body: page('Typography',
        '日本語テキスト最適化を前提にファミリ／スケールを定義。') },
    ],
  },
  {
    id: 'accessibility', label: 'Accessibility', items: [
      { id: 'wcag', label: 'WCAG 2.1 AA', body: page('アクセシビリティ方針',
        'ポータル・コンポーネントとも WCAG 2.1 AA を正式目標（Q8=A）。',
        ['キーボード操作・フォーカス可視・コントラスト・ランドマーク/見出し階層を満たす。',
         '3プロファイルいずれでも AA 成立。']) },
      { id: 'reduced-motion', label: 'Reduced Motion', body: page('Reduced Motion',
        'prefers-reduced-motion を尊重し、motion 予算を超えるアニメーションを行わない。') },
    ],
  },
  {
    id: 'components', label: 'Components', items: [
      { id: 'catalog', label: '正典カタログ', body: page('正典コンポーネント',
        'Core DS は CSS クラス方式（.fig-*）でコンポーネントを提供（JSX は持たない）。各部品に spec.md と preview を備える。',
        ['実物の見え方は「プロジェクト集」の Core リファレンスや各製品ページの閲覧3形態で確認できる。']) },
    ],
  },
  {
    id: 'patterns', label: 'Experience Patterns', items: [
      { id: 'layering', label: 'Surface Layering', body: page('Surface Layering',
        'エレベーション/サーフェスの重なりを Semantic トークンで一貫管理。') },
    ],
  },
];

/**
 * Core 本文（data/core-content.json）から指定スコープのセクション木を生成（F-6 / §4-1）。
 * build.mjs.extractCoreContent() が Core 自前サイトの SITEMAP+PAGES を JSON 化し、
 * その `scope`（core=概要 / developer=Developer ガイド）を IA に写像する（rolling 忠実）。
 * @param {object|null} coreContent { SITEMAP, PAGES }
 * @param {string} [scope='core'] SITEMAP のスコープキー
 * @returns {Array|null} [{id,label,hint,items:[{id,label,avail}]}] / 取得不能なら null
 */
export function coreScopeSections(coreContent, scope = 'core') {
  const node = coreContent && coreContent.SITEMAP && coreContent.SITEMAP[scope];
  if (!node || !Array.isArray(node.sections)) return null;
  const pages = coreContent.PAGES || {};
  const sections = node.sections.map(sec => ({
    id: sec.id,
    label: sec.label || sec.id,
    hint: sec.hint || '',
    items: (sec.items || []).map(it => ({
      id: it.id,
      label: it.label || it.id,
      // 推奨度（component/pattern のみ持つ）。サイドバーの data-avail バッジ/減衰に使う。
      avail: (pages[`${scope}/${sec.id}/${it.id}`] || {}).availability || null,
    })),
  })).filter(sec => sec.items.length);
  return sections.length ? sections : null;
}

/** 後方互換: 概要（core スコープ）セクション木。 */
export function coreOverviewSections(coreContent) {
  return coreScopeSections(coreContent, 'core');
}

/** Core PAGES から該当ページ定義を取得（key `<scope>/<section>/<item>`。scope 既定=core） */
export function corePage(coreContent, sectionId, itemId, scope = 'core') {
  const pages = coreContent && coreContent.PAGES;
  if (!pages) return null;
  return pages[`${scope}/${sectionId}/${itemId}`] || null;
}

/** 運用（ops）ビューの定義。route = #/ops/<view> */
export const OPS = [
  { id: 'versions', label: '版ダッシュボード', kind: 'version-dashboard' },
  { id: 'showcase', label: 'Showcase', kind: 'showcase' },
  { id: 'promotion', label: 'Core 昇格フロー', kind: 'static', body: page('Core 昇格フロー',
      '低ハードルな提案（core-promotion ラベルで3行起票）→ Maintainer 伴走 → 二段レビュー → リリース列車（MINOR）。',
      ['昇格判定: 3プロファイル成立・トークン階層遵守・WCAG AA・spec/preview 完備（US-4.4 AC3）。',
       '手順は「使い方 › 昇格提案」を参照。']) },
  { id: 'governance', label: 'ガバナンス', kind: 'static', body: page('ガバナンス',
      'taxonomy（カテゴリ>サブカテゴリ>プロジェクト）と registry は Core Maintainer が単一正典として統治。ポータルは読み取り専用。') },
];

/** 簡易ページ HTML 生成ヘルパ */
function page(title, lead, bullets) {
  const list = bullets && bullets.length
    ? `<ul class="fig-doc-list">${bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : '';
  return `<h1>${esc(title)}</h1><p class="fig-doc-lead">${esc(lead)}</p>${list}`;
}
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
