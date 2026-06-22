/**
 * 使い方ページ（PT-8 / US-2.7 操作随伴ガイド / FDQ8=A）
 * 定型テンプレ「目的 → 前提 → 手順 → 確認」。ツール非依存（各チーム標準の Git/AI に読み替え可能 / BR-USE-2）。
 * 操作を要する全場面はここへ導線を持つ（BR-USE-1）。
 */
export const GUIDES = {
  'portal-basics': {
    title: 'ポータルの歩き方',
    purpose: 'このポータルで「最新の正解（Core DS）」と各製品の実装を最小クリックで確認する。',
    preconditions: ['閲覧用 URL（GitHub Pages）にアクセスできること。'],
    steps: [
      '左サイドナビ上位の4区分（概要 / プロジェクト集 / 運用 / 使い方）から目的の情報種別を選ぶ。',
      '「プロジェクト集」はカテゴリ＞サブカテゴリ＞製品の順に辿り、末端の製品リンクで直接到達する。',
      '右上のプロファイル切替（Web-Admin / Consumer / Terminal）で各デバイスの見え方を確認する。',
      '共有したい表示は、その時の URL をそのまま渡す（プロファイル等が URL に反映される）。',
    ],
    verification: ['目的の製品ページに数クリックで到達でき、URL を共有すると相手も同じ表示になる。'],
  },
  'view-modes': {
    title: '閲覧3形態の使い分け',
    purpose: '製品の見え方と動きを「コンポーネント単体 / ページ遷移 / デモ」で確認する（US-2.2）。',
    preconditions: ['プロジェクト集から対象製品ページを開いていること。'],
    steps: [
      'ページ上部のタブで「コンポーネント単体」「ページ遷移」「デモ」を切り替える。',
      'デモは iframe で実際の動作を表示する（現在のプロファイル/Core 版が引き継がれる）。',
      'デモ未整備の製品は、コンポーネント単体／ページ遷移、または Core リファレンスで代替確認する。',
    ],
    verification: ['3形態のいずれかで対象の見た目・挙動を確認できる。'],
  },
  'core-version': {
    title: '参照 Core バージョンの確認',
    purpose: '各製品が参照する Core 版と最新版の追従状況を把握する（US-4.3）。',
    preconditions: ['「運用 › 版ダッシュボード」を開けること。'],
    steps: [
      '「運用 › 版ダッシュボード」を開く。',
      '製品ごとの pin 版（coreVersionPinned）と最新版（coreVersionLatest）、追従状況（up-to-date / behind）を確認する。',
      '収集前（空表示）の場合は、CI のバージョン収集（U5）が有効化されるまで待つ。',
    ],
    verification: ['製品の参照版と追従状況が一覧で分かる。'],
  },
  'promotion': {
    title: 'Core 昇格を提案する',
    purpose: '製品の独自/仮パーツを Core DS に昇格させる提案を、低ハードルで起票する（US-4.4 / US-5.2）。',
    preconditions: ['対象パーツが製品の Extensions 層にあること。', '製品 repo に Issue を作成できること。'],
    steps: [
      '「運用 › Showcase」または製品ページで対象パーツを見つける。',
      '「昇格提案」導線から、core-promotion ラベルで3行（何を/なぜ/どこで使うか）を起票する。',
      '普遍化・a11y 仕上げは Core Maintainer が伴走するため、提案者が完璧に整える必要はない。',
      '二段レビュー（軽微=1名/重大=2名）を経て MINOR のリリース列車に乗る。',
    ],
    verification: ['core-promotion ラベルの Issue が起票され、Maintainer のレビュー対象になる。'],
  },
  'temp-part': {
    title: '仮パーツを作って開発を止めない（鶏卵回避）',
    purpose: 'Core に無い部品が必要でも開発を止めず、後から Core へ還元する（US-2.5）。',
    preconditions: ['製品の Extensions 層にコードを追加できること。'],
    steps: [
      'Core に無い部品は、製品の Extensions 層に「仮パーツ」として実装し開発を継続する。',
      'temp-part ラベルの Issue を起票し「仮パーツ作成」「Core 還元検討」を記録する。',
      'ポータル上では仮パーツに「仮」バッジが付く。Core 昇格後は rolling で最新 Core を取得し、仮コードを撤去する。',
    ],
    verification: ['仮パーツで画面が動き、temp-part Issue が残り、昇格後に撤去できる。'],
  },
  'feedback': {
    title: 'フィードバックを送る',
    purpose: 'ポータルやコンポーネントへの気づき・改善要望を記録する。',
    preconditions: ['該当画面を開いていること。'],
    steps: [
      '画面のフィードバック導線から内容を記述する。',
      '対象（ポータル / 特定コンポーネント / 製品）を選び送信する。',
    ],
    verification: ['フィードバックが起票・記録される。'],
  },

  /* ───────── シナリオ別ガイド（US-P2/P3 / BR-PIA-4/5/6） ───────── */
  'scenario-existing': {
    title: 'シナリオA：既存アプリを整える',
    group: 'scenario', featured: true, // ★最優先（BR-PIA-5）
    purpose: '既存コードのある製品を、機能を壊さず FIG Core DS のスタイルへ整える（最低でも自社デザイン資産化を達成）。LLocana/BusDelayAlerts が実例（AC②-3）。',
    preconditions: ['対象製品の repo にアクセスできること。', 'Core DS（FIG-UDS）の閲覧 URL を知っていること。'],
    steps: [
      '公開サイト / 本ポータルを閲覧し、最新の正解（Core DS）と Developer ガイドを確認する（「Developer ガイド（はじめに）」）。',
      '必要な repo を clone し、既存コードを配置する（→「GitHub 操作ガイド」）。',
      '配布を入れる：Core を submodule で pin し Core CSS を import する（→「新製品セットアップ」の配布手順、または「移行」）。',
      'スタイル修正を開始する：ブリッジ CSS で @theme へ写像し、状態色を semantic 化・生 HEX を解消する（→「移行」）。',
      '「最低でも自社デザイン資産化」達成を確認して開発を終える。',
    ],
    verification: [
      '主要画面の生 HEX が 0・vite build 成功・状態色が Core status / ブランドが signature を参照している。',
      '（あわよくば）既存機能を壊さず画面操作感も改善＝UX 改修フロー（画面遷移図の確認 / VSCode×Pencil）へ進める。',
    ],
  },
  'scenario-new': {
    title: 'シナリオ②：新規開発で FIG-UDS を使う',
    group: 'scenario',
    purpose: '既存資産が少ない新規開発で、Construction から FIG Core DS のスタイル＋UI を実装する。',
    preconditions: ['新規製品を作成できる権限があること。'],
    steps: [
      'template から新製品を複製し signature seed を注入する（→「新製品セットアップ」）。',
      'Core を submodule pin＋CSS import で配布する。',
      'Construction で FIG-UDS のトークン／コンポーネントを使って実装する。',
      'プロジェクト集へ登録する（registry 登録 PR は AI セットアップが自動起票）。',
    ],
    verification: ['build 成功・プロジェクト集に製品が現れる（準備中→公開）。'],
  },

  /* ───────── 主要操作ガイド（US-P7 / US-X3 / BR-PIA-10/11） ───────── */
  'new-product-setup': {
    title: '新製品セットアップ',
    group: 'operation',
    purpose: '新規製品を template から複製し、signature seed を注入して開発を開始する（シナリオ②の起点 / US-P7）。',
    preconditions: ['GitHub Template から repo を作成できること。', '製品のメインカラー（signature seed）が決まっていること。'],
    steps: [
      'template を複製して新しい製品 repo を作成する（→「GitHub 操作ガイド」）。',
      'project-settings.json に 製品名 / signature seed / カテゴリ を記入する。',
      'init を実行し、変数置換と初期設定を反映する。',
      'Core DS を submodule で pin（CORE-DS-VERSION）する。',
      'registry 登録 PR（AI セットアップが自動起票）をマージし、プロジェクト集に出現することを確認する。',
    ],
    verification: ['build が成功し、プロジェクト集に製品が「準備中→公開」で現れる。'],
  },
  'migration': {
    title: '既存コードを Core 採用へ移行',
    group: 'operation',
    purpose: '既存コードを Core DS 採用へ移行し、スタイルを統一する（シナリオA の中核 / US-P7）。',
    preconditions: ['対象 repo を clone 済みであること。'],
    steps: [
      'Core を submodule で追加し pin する。Core CSS（primitives/semantic/tokens）を import する。',
      'ブリッジ CSS 1枚で Core semantic → アプリ Tailwind @theme を写像する。',
      '状態色を semantic 化（success/warning/danger）し、ブランド色を signature ユーティリティへ機械置換する。',
      '主要画面の生 HEX を 0 にする（周辺画面は段階対応）。',
      'migration-status で定量確認する（主要フロー 100% / 全体 ≧ 80%）。',
    ],
    verification: ['主要画面 生 HEX 0・vite build 成功・migration-status PASS。'],
  },
  'github-operations': {
    title: 'GitHub 操作ガイド（ツール非依存）',
    group: 'operation',
    purpose: '主要4操作で必要になる GitHub 操作を、ツールに依存しない再現手順としてまとめる（US-X3 / BR-PIA-11）。各チーム標準の Git / AI アシスタントに読み替え可能。',
    preconditions: ['対象 repo の閲覧・変更権限があること。'],
    steps: [
      'repo を clone する（または Template から新規作成する）。',
      '作業ブランチを作成する（修正前後比較が要るなら before ブランチを先に用意する）。',
      'Core submodule の pin（参照バージョン）を更新する。',
      'Issue を起票する：仮パーツは temp-part ラベル、Core 昇格提案は core-promotion ラベル。',
      '変更を PR にまとめてレビュー・マージする。',
    ],
    verification: ['必要な clone / ブランチ / submodule pin / Issue / PR が作成できる。'],
  },
  'ux-refine': {
    title: 'UX 改修フロー（VSCode×Pencil・あわよくば）',
    group: 'operation',
    purpose: 'スタイル整理に加え操作感まで改善する「あわよくば」フロー（US-X2 / 画像02-A）。Core の UX 契約（体感バジェット / 画面遷移 / フィードバック）を基準に、Pencil（設計参照）で評価者へ修正項目を提案→承認し、最小改善を実コードへ反映する。実装が正典・既存機能は非回帰（壊さない）が大前提。スタイルと同じく UX 知見も Core へ蓄積・還元する。',
    preconditions: [
      'シナリオA でスタイル整理（生 HEX 0・build 成功）まで到達していること。',
      'Core の UX 契約を参照できること（patterns の transition-budget / page-transition / feedback-contract・accessibility-guidelines）＝改修の判断基準。',
      'VSCode の Pencil 拡張が使えること（.pen は MCP 経由のみ・暗号化）。',
    ],
    steps: [
      '① 評価：Core の UX 契約に照らして現状を点検する（例：画面遷移が体感バジェット 200ms に収まっているか／生の motion 値が Core トークンを参照しているか）。',
      '② 提案：主要フローを Pencil（.pen）で as-is/to-be 表現し、契約違反・改善余地を「修正項目」として評価者に提案→承認を得る（書き出し画像を設計参照として共有）。',
      '③ 反映：承認された最小 UX 改善を実コードへ反映する（実装が正典）。生の motion 値は Core トークン（例 --motion-duration-budget-nav）へ寄せ、判定ロジックは純粋関数に切り出して単体テスト可能にする。',
      '④ 検証：単体（vitest）＋機能 e2e（Playwright・到達先アサート）＋既存 VRT の3つが緑であることを反映の合格条件とする（非回帰）。',
      '⑤ 還元：製品で得た UX 知見（例：履歴なし時の戻り先規約）は Core の pattern / 画面遷移規約へ昇格提案する（→「Core 昇格を提案する」）。',
      '⑥ 活用・確認：確立した画面遷移など最終 UX は次回開発で再利用し、dev-flow-journal とこのポータルで確認できるよう残す（US-X4）。',
    ],
    verification: [
      '改修後の画面遷移が Core の体感バジェット内で、生の motion 値ではなく Core トークンを参照している。',
      '既存機能が非回帰（通常フローの挙動・遷移・状態表示が不変）であることをテストで確認できる。',
      'Pencil の as-is/to-be で改善差分が説明でき、UX 知見が Core 昇格 or バックログとして循環に乗っている。',
    ],
  },
};

/** 使い方ガイドの表示順グループ（usageIndex の並び）。 */
const USAGE_GROUPS = [
  { id: 'scenario', label: 'シナリオ別ガイド' },
  { id: 'operation', label: '主要操作' },
  { id: 'basics', label: 'その他' },
];

/** 使い方インデックス（トップ）。グループ別・シナリオA は★最優先で先頭（BR-PIA-5）。 */
export function usageIndex() {
  const li = ([id, g]) => {
    const star = g.featured ? '<span class="fig-badge fig-badge--featured" data-testid="usage-featured">★最優先</span> ' : '';
    return `<li>${star}<a href="#/usage/${id}" data-testid="usage-link-${id}">${esc(g.title)}</a><span class="fig-doc-muted"> — ${esc(g.purpose)}</span></li>`;
  };
  const entries = Object.entries(GUIDES);
  const groupOf = (g) => (g.group || 'basics');
  // 各グループ内は featured を先頭に（安定）。
  const inGroup = (gid) => entries
    .filter(([, g]) => groupOf(g) === gid)
    .sort((a, b) => (b[1].featured ? 1 : 0) - (a[1].featured ? 1 : 0));
  const sections = USAGE_GROUPS.map(grp => {
    const rows = inGroup(grp.id).map(li).join('');
    return rows ? `<section data-testid="usage-group-${grp.id}"><h2>${esc(grp.label)}</h2><ul class="fig-doc-list">${rows}</ul></section>` : '';
  }).join('');
  return `<h1>使い方</h1><p class="fig-doc-lead">操作を要する場面ごとに、ツールに依存しない再現手順を用意しています。</p>${sections}`;
}

/** 1ガイドの描画（テンプレ: 目的→前提→手順→確認） */
export function renderGuide(topic) {
  const g = GUIDES[topic];
  if (!g) return null;
  const block = (title, arr, ordered) => {
    if (!arr || !arr.length) return '';
    const tag = ordered ? 'ol' : 'ul';
    return `<h2>${esc(title)}</h2><${tag} class="fig-doc-list">${arr.map(s => `<li>${esc(s)}</li>`).join('')}</${tag}>`;
  };
  return `<article class="fig-usage" data-testid="usage-guide-${topic}">
    <h1>${esc(g.title)}</h1>
    <p class="fig-doc-lead">${esc(g.purpose)}</p>
    ${block('前提', g.preconditions)}
    ${block('手順', g.steps, true)}
    ${block('確認', g.verification)}
    <p class="fig-doc-muted"><a href="#/usage/portal-basics">← 使い方インデックス</a></p>
  </article>`;
}

function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
