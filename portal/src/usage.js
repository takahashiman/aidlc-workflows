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
};

/** 使い方インデックス（トップ） */
export function usageIndex() {
  const items = Object.entries(GUIDES)
    .map(([id, g]) => `<li><a href="#/usage/${id}" data-testid="usage-link-${id}">${esc(g.title)}</a><span class="fig-doc-muted"> — ${esc(g.purpose)}</span></li>`)
    .join('');
  return `<h1>使い方</h1><p class="fig-doc-lead">操作を要する場面ごとに、ツールに依存しない再現手順を用意しています。</p><ul class="fig-doc-list">${items}</ul>`;
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
