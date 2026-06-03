/**
 * FIG Core DS — Portal Content
 *
 * SITEMAP : サイドバーのカテゴリ構造（Core / Extensions × セクション）
 * PAGES   : ルート（`scope/section/item`）→ ページメタデータの辞書
 *
 * ページテンプレート種別:
 *   - 'principle'   : 散文ドキュメント（思想・規約）
 *   - 'foundation'  : トークン解説 + iframe スウォッチ
 *   - 'component'   : Overview / Live preview / Tokens & Code / Accessibility のタブ
 *   - 'pattern'     : Overview / Live preview / Spec / Accessibility のタブ
 *   - 'external'    : 別ページへリンク（iframe 不可なフルアプリ等）
 *
 * 配信形態: ES Module ではなく、グローバル `window.PortalContent` に格納する
 * 古典スクリプト。これにより file:// プロトコルでもダブルクリック起動で動く。
 */
(function () {
const SITEMAP = {
  core: {
    label: 'Core',
    description: '普遍的なガイドライン',
    sections: [
      {
        id: 'principles',
        label: 'Design Principles',
        hint: 'ビジョン・価値観',
        items: [
          { id: 'vision',     label: 'Vision' },
          { id: 'values',     label: 'Values（スピード・慈愛・俯瞰）' },
          { id: 'brand-dna',  label: 'Brand DNA' },
        ],
      },
      {
        id: 'foundations',
        label: 'Foundations',
        hint: 'トークン化された基盤',
        items: [
          { id: 'colors-brand',       label: 'Brand Colors' },
          { id: 'color-system',       label: 'Color System & Palette' },
          { id: 'device-profiles',    label: 'Device Profiles' },
          { id: 'typography-family',  label: 'Typography / Family' },
          { id: 'typography-scale',   label: 'Typography / Scale' },
          { id: 'colors-neutrals',    label: 'Colors / Neutrals' },
          { id: 'colors-status',      label: 'Colors / Status' },
          { id: 'spacing-radii',      label: 'Spacing & Radii' },
          { id: 'elevation',          label: 'Elevation' },
          { id: 'surface-layering',   label: 'Surface Layering' },
          { id: 'semantic-tokens',    label: 'Semantic Tokens' },
          { id: 'state-tokens',       label: 'State Tokens' },
          { id: 'z-index',            label: 'Z-index' },
          { id: 'brand-logo',         label: 'Brand Logo' },
          { id: 'brand-iconography',  label: 'Brand Iconography' },
        ],
      },
      {
        id: 'accessibility',
        label: 'Accessibility',
        hint: '日本語最適化と慈愛',
        items: [
          { id: 'japanese-text',      label: '日本語テキスト最適化' },
          { id: 'contrast-knockout',  label: 'コントラスト・白抜き' },
          { id: 'focus-touch',        label: 'フォーカス・タッチターゲット' },
          { id: 'reduced-motion',     label: 'Reduced Motion' },
        ],
      },
      {
        id: 'components-navigation',
        label: 'Navigation & Structure',
        hint: 'ナビゲーションと構造',
        items: [
          { id: 'fig-sense',          label: 'FIG Sense（総覧）' },
          { id: 'header',             label: 'Header / Footer' },
          { id: 'navigation-rail',    label: 'Navigation Rail' },
          { id: 'navigation-bar',     label: 'Navigation Bar' },
          { id: 'side-sheet',         label: 'Side Sheet' },
          { id: 'bottom-sheet',       label: 'Bottom Sheet' },
          { id: 'breadcrumb',         label: 'Breadcrumb' },
          { id: 'pagination',         label: 'Pagination' },
          { id: 'tabs',               label: 'Tabs' },
        ],
      },
      {
        id: 'components-actions',
        label: 'Actions & Buttons',
        hint: 'アクションとボタン',
        items: [
          { id: 'button',             label: 'Common Button' },
          { id: 'fab',                label: 'FAB（Floating Action Button）' },
          { id: 'segmented-button',   label: 'Segmented Button' },
          { id: 'icon-button',        label: 'Icon Button' },
        ],
      },
      {
        id: 'components-inputs',
        label: 'Inputs & Selection',
        hint: 'フォームと入力',
        items: [
          { id: 'text-field',         label: 'Text Field' },
          { id: 'toggle-switch',      label: 'Toggle Switch' },
          { id: 'checkbox',           label: 'Checkbox' },
          { id: 'radio-button',       label: 'Radio Button' },
          { id: 'picker',             label: 'Date / Time Picker' },
          { id: 'form-group',         label: 'Form Group' },
        ],
      },
      {
        id: 'components-data',
        label: 'Data Display & Communication',
        hint: 'データ表示とフィードバック',
        items: [
          { id: 'table',              label: 'Table' },
          { id: 'list',               label: 'List' },
          { id: 'card',               label: 'Card' },
          { id: 'accordion',          label: 'Accordion' },
          { id: 'alert',              label: 'Alert / Banner' },
          { id: 'toast',              label: 'Toast / Snackbar' },
          { id: 'modal',              label: 'Modal / Dialog' },
          { id: 'badge',              label: 'Badge' },
          { id: 'status-pill',        label: 'Status Pill' },
          { id: 'icon-bubble',        label: 'Icon Bubble' },
        ],
      },
      {
        id: 'patterns',
        label: 'Experience Patterns',
        hint: '操作の原則',
        items: [
          { id: 'transition-budget',  label: 'Transition Budget' },
          { id: 'feedback-contract',  label: 'Feedback Contract' },
          { id: 'page-transition',    label: 'Page Transition' },
          { id: 'arrival-card',       label: 'Arrival Card' },
          { id: 'delay-banner',       label: 'Delay Banner' },
          { id: 'notification-sheet', label: 'Notification Sheet' },
          { id: 'route-selector',     label: 'Route Selector' },
        ],
      },
    ],
  },
  extensions: {
    label: 'Extensions',
    description: '各プロダクト固有の拡張',
    sections: [
      {
        id: 'busapp',
        label: 'Busapp (Mobile-Consumer)',
        hint: 'バス運行情報・決済',
        items: [
          { id: 'overview',           label: 'Overview' },
          { id: 'transport-tokens',   label: 'Transport Domain Tokens' },
          { id: 'material-theme',     label: 'Material Theme Mapping' },
          { id: 'pass-card',          label: 'Pass Card' },
          { id: 'prototype',          label: 'Prototype（外部画面）' },
        ],
      },
      {
        id: 'template',
        label: '+ New Project',
        hint: 'プロジェクト複製ガイド',
        items: [
          { id: 'overview',           label: '新規プロジェクト雛形' },
        ],
      },
    ],
  },
  developer: {
    label: 'Developer Guide',
    description: 'エンジニア向け活用ガイド',
    sections: [
      {
        id: 'guide',
        label: 'Getting Started & Beyond',
        hint: '導入・運用・貢献',
        items: [
          { id: 'getting-started',     label: 'Getting Started（導入手順）' },
          { id: 'version-management',  label: 'Version Management（バージョン管理）' },
          { id: 'migration',           label: 'Migration Guide（移行ガイド）' },
          { id: 'project-duplication', label: 'Project Duplication（複製方法）' },
          { id: 'contribution',        label: 'Contribution（Core昇格フロー）' },
          { id: 'ai-co-creation',      label: 'AI Co-creation（AIとの共同開発）' },
        ],
      },
    ],
  },
};

/* ─────────────────────────────────────────────────────────────
   PAGES
   キーは "scope/section/item" 形式（ハッシュルートと一致）。
   ───────────────────────────────────────────────────────────── */

const PAGES = {
  /* ════════ Core / Design Principles ════════ */
  'core/principles/vision': {
    template: 'principle',
    title: 'Vision',
    description: '「スピード・慈愛・俯瞰」をUIに体現する。',
    body: `
      <p>バスアプリから抽出された個別最適なデザイン資産を、FIGブランドの理念へと昇華させた <strong>Core Design System</strong>。</p>
      <p>FIGの3つの価値 — <strong>スピード・慈愛・俯瞰</strong> — を、トークン・コンポーネント・パターンの各層に物理的に埋め込み、開発者がどの主題に立ち寄ってもブランドの語気と再会する状態を目指します。</p>
      <p>本ポータルは「ここを見れば全て解決する」単一のエントリポイントです。Core と Extensions の境界を意識的に分離し、普遍的なガイドラインがサービス固有の事情に侵食されないよう構成しています。</p>
    `,
  },
  'core/principles/values': {
    template: 'principle',
    title: 'Values',
    description: 'スピード／慈愛／俯瞰の三価値を、規約として持つ。',
    body: `
      <h3>スピード</h3>
      <p>体感速度を意味的トークン <code>--motion-experience-*</code> として規約化。主要な遷移はすべて 200ms 以内に収まる「Transition Budget」を Experience Patterns に内蔵。</p>
      <h3>慈愛</h3>
      <p>日本語の禁則・分断対策と DADS 準拠の行間（本文 1.75 / 長文 1.85）。コントラスト 4.5:1 を満たさない面では本文を一切置かない「白抜き規約」を Accessibility 層で物理的に強制。</p>
      <h3>俯瞰</h3>
      <p>すべてのトークン・部品・パターンを単一ポータルに集約。Core / Extensions の二層化で「普遍」と「拡張」の境界を明示し、変更の影響範囲が一目で読める情報設計。</p>
    `,
  },
  'core/principles/brand-dna': {
    template: 'principle',
    title: 'Brand DNA',
    description: 'FIGロゴマニュアル準拠の視覚DNAをトークン化。',
    body: `
      <h3>カラー</h3>
      <ul>
        <li>メイン1（ターコイズ）: <code>#26B7BC</code> — <code>--color-brand-primary</code></li>
        <li>メイン2（ブルー）: <code>#38A1DB</code> — <code>--color-brand-secondary</code></li>
        <li>サブ（中立色）: <code>#B5B5B6</code> / <code>#595757</code></li>
      </ul>
      <h3>タイポグラフィ</h3>
      <ul>
        <li>和文: <strong>Noto Sans JP</strong>（源ノ角ゴシック相当）</li>
        <li>英文・ブランドボイス: <strong>M PLUS Rounded 1c</strong>（Rounded-X M+ 近縁）</li>
        <li>数字: <code>tabular-nums</code> で桁揃え</li>
      </ul>
      <h3>アイソレーション</h3>
      <p>ロゴマニュアル準拠：上左右 0.3A / 下 0.25A。ブランド要素・主要 CTA の周囲を意味のある余白で守る。<code>--isolation-A</code> を上書きすると比率に従って自動再計算。</p>
    `,
  },

  /* ════════ Core / Foundations ════════ */
  'core/foundations/colors-brand':      { template: 'foundation', title: 'Brand Colors',        description: 'FIGコーポレートカラー（不変の定義）。ターコイズ・ブルーを軸とする意味的サーフェス。',     preview: 'preview/colors-brand.html' },
  'core/foundations/color-system': {
    template: 'principle',
    title: 'Color System & Palette',
    description: 'シグネチャー選択と機能色の調和（Harmonization）ルール。',
    body: `
      <h3>原則</h3>
      <p>各プロダクト（Extensions）は、Core で定義された <strong>FIG Brand Colors</strong> を「守るべき不変点」として持ちつつ、自プロダクトの個性を表す <strong>Signature Color</strong> を1色だけ選択します。</p>
      <p>機能色（Success / Warning / Error / Info）は Signature の色相に合わせて<strong>調和的（Harmonized）に</strong>派生させ、ブランド全体のトーン&マナーを保ったまま、サービスごとの識別性も両立させます。</p>
      <h3>1. Signature Color の選択</h3>
      <ul>
        <li><strong>Busapp (Mobile-Consumer)</strong>: <code>#26B7BC</code>（Turquoise）— 動と信頼</li>
        <li><strong>Admin Console (Web-Admin)</strong>: <code>#38A1DB</code>（Sky Blue）— 静と分析</li>
        <li><strong>Driver Terminal (Mobile-Terminal)</strong>: <code>#1A8589</code>（Deep Turquoise）— 業務の重厚さ</li>
      </ul>
      <h3>2. Harmonization ルール</h3>
      <p>機能色は Signature の HSL 値から ±15° 以内の色相ずらしを基本とし、彩度・明度は WCAG コントラストで決定します：</p>
      <ul>
        <li><code>--color-status-success</code>: 緑系。Signature の色相に近い側（Turquoise なら Teal 寄り）。</li>
        <li><code>--color-status-warning</code>: 黄系。色温度は Signature が暖色なら暖、寒色なら冷側。</li>
        <li><code>--color-status-error</code>: 赤系。色温度は彩度を Signature と揃える（くすませない／鮮やかすぎない）。</li>
        <li><code>--color-status-info</code>: 青系。Signature が青系ならコントラストで分離（明度を強く変える）。</li>
      </ul>
      <h3>3. 利用ルール</h3>
      <p>Signature と機能色は必ず <strong>semantic.css</strong> 経由でアクセスし、コンポーネントから生 hex を書かないこと。プロファイル（Device Profile）切替時に色の意味が壊れないよう、トークン名は「役割」を表現します。</p>
    `,
    preview: 'preview/colors-brand.html',
  },
  'core/foundations/device-profiles': {
    template: 'foundation',
    title: 'Device Profiles',
    description: 'Mobile-Terminal / Web-Admin / Mobile-Consumer 別のタイポ・余白・タップ領域・角丸の自動切替。',
    preview: 'preview/device-profiles.html',
    body: `
      <h3>戦略</h3>
      <p>同じセマンティックトークン（例: <code>var(--fig-size-body)</code>）の「値」だけを、デバイス文脈（Profile）に応じて切り替えます。エンジニアは「何を使うか」を変えずに済むため、コードの再利用性が最大化されます。</p>

      <h3>3つのプロファイル</h3>
      <table class="token-table">
        <thead>
          <tr><th>プロファイル</th><th>用途</th><th>最適化方向</th><th>理念連動</th></tr>
        </thead>
        <tbody>
          <tr><td><code>Mobile-Terminal</code></td><td>無線機・業務端末</td><td>固定視認性</td><td>俯瞰</td></tr>
          <tr><td><code>Web-Admin</code></td><td>BtoB管理画面</td><td>情報密度</td><td>スピード</td></tr>
          <tr><td><code>Mobile-Consumer</code></td><td>CtoCアプリ</td><td>操作性・アクセシビリティ</td><td>慈愛</td></tr>
        </tbody>
      </table>

      <h3>具体的なトークン値</h3>
      <table class="token-table">
        <thead>
          <tr><th>トークン</th><th>Admin</th><th>Consumer</th><th>Terminal</th></tr>
        </thead>
        <tbody>
          <tr><td><code>--fig-size-body</code></td><td>13px</td><td>15px</td><td>16px</td></tr>
          <tr><td><code>--fig-size-headline</code></td><td>20px</td><td>24px</td><td>26px</td></tr>
          <tr><td><code>--fig-spacing-s</code></td><td>8px</td><td>12px</td><td>10px</td></tr>
          <tr><td><code>--fig-spacing-m</code></td><td>12px</td><td>20px</td><td>16px</td></tr>
          <tr><td><code>--fig-spacing-l</code></td><td>16px</td><td>28px</td><td>24px</td></tr>
          <tr><td><code>--fig-target-min</code></td><td>32px</td><td>48px</td><td>56px</td></tr>
          <tr><td><code>--fig-radius-control</code></td><td>6px</td><td>12px</td><td>8px</td></tr>
          <tr><td><code>--fig-line-height-body</code></td><td>1.55</td><td>1.75</td><td>1.70</td></tr>
          <tr><td><code>--fig-max-content-width</code></td><td>1280px</td><td>640px</td><td>480px</td></tr>
        </tbody>
      </table>

      <h3>ディレクトリ構成</h3>
      <pre class="page-code"><code>/tokens
  ├── base.css              … --fig-* の既定値（Consumer 相当）
  ├── profile-admin.css     … .fig-profile-admin 上書き
  ├── profile-consumer.css  … .fig-profile-consumer 上書き
  ├── profile-terminal.css  … .fig-profile-terminal 上書き
  └── components.css        … --fig-* を消費する見本部品</code></pre>

      <h3>使い方（最短）</h3>
      <pre class="page-code"><code>&lt;body class="fig-profile-consumer"&gt;
  &lt;button class="fig-button"&gt;送信&lt;/button&gt;
&lt;/body&gt;</code></pre>
      <p><code>class</code> を <code>fig-profile-admin</code> / <code>fig-profile-terminal</code> に変えるだけで、フォントサイズ・余白・タップ領域・角丸がそのプロファイルに自動最適化されます。</p>

      <h3>ライブ切替</h3>
      <p>ポータル右上の <strong>Device Profile スイッチ</strong>（Admin / Consumer / Terminal）で、ポータル本体のコンポーネントを即座に切り替えられます。下のライブプレビューは 3 プロファイルを同時表示しています。</p>

      <h3>関連</h3>
      <p>導入手順は <a href="#/developer/guide/getting-started">Developer Guide / Getting Started</a> を参照。</p>
    `,
  },
  'core/foundations/colors-neutrals':   { template: 'foundation', title: 'Colors / Neutrals',   description: 'スレートスケールとロゴマニュアル準拠の中立色。',         preview: 'preview/colors-neutrals.html' },
  'core/foundations/colors-status':     { template: 'foundation', title: 'Colors / Status',     description: '運行状態（通常／遅延の可能性／遅延／運休／通過）配色。', preview: 'preview/colors-status.html' },
  'core/foundations/typography-family': { template: 'foundation', title: 'Typography / Family', description: '和文・英文・数字・モノスペースの4軸ファミリ。',          preview: 'preview/type-family.html' },
  'core/foundations/typography-scale':  { template: 'foundation', title: 'Typography / Scale',  description: '8 段階のサイズラダーと役割（display〜caption）。',       preview: 'preview/type-scale.html' },
  'core/foundations/spacing-radii':     { template: 'foundation', title: 'Spacing & Radii',     description: '4pxベースのスペーシングと意味的 radius ロール。',       preview: 'preview/spacing-radii.html' },
  'core/foundations/elevation':         { template: 'foundation', title: 'Elevation',           description: '影の5段ラダーと役割（card/raised/floating/modal）。',  preview: 'preview/elevation.html' },
  'core/foundations/surface-layering':  { template: 'foundation', title: 'Surface Layering',    description: 'canvas → surface → container の階層規約。',           preview: 'preview/surface-layering.html' },
  'core/foundations/semantic-tokens':   { template: 'foundation', title: 'Semantic Tokens',     description: 'primitive → semantic → component の三層トークン構造。', preview: 'preview/semantic-tokens.html' },
  'core/foundations/state-tokens':      { template: 'foundation', title: 'State Tokens',        description: 'hover / pressed / focused / disabled / selected。',      preview: 'preview/state-tokens.html' },
  'core/foundations/z-index':           { template: 'foundation', title: 'Z-index',             description: '100刻みのz-indexスケールとelevationの対応。',           preview: 'preview/z-index.html' },
  'core/foundations/brand-logo':        { template: 'foundation', title: 'Brand Logo',          description: 'ロゴマニュアル準拠のアイソレーション・最小サイズ規約。',   preview: 'preview/brand-logo.html' },
  'core/foundations/brand-iconography': { template: 'foundation', title: 'Brand Iconography',   description: 'lucide アイコンの利用方針とサイズ規約。',                 preview: 'preview/brand-iconography.html' },

  /* ════════ Core / Accessibility ════════ */
  'core/accessibility/japanese-text': {
    template: 'principle',
    title: '日本語テキスト最適化',
    description: 'DADS（デジタル庁デザインシステム）準拠の和文タイポ規約。',
    preview: 'preview/typography-japanese.html',
    body: `
      <h3>Why</h3>
      <p>日本語は欧文と「字面の懐」が異なり、行送り・字詰めの基準が独自である必要があります。デジタル庁デザインシステム（DADS）の知見を統合し、バスアプリ固有の定義から「日本人向けの普遍的なルール」へ昇格させました。</p>
      <h3>規約</h3>
      <ul>
        <li>行間（本文）: <strong>1.75</strong> — DADS 推奨値</li>
        <li>行間（長文・案内文）: <strong>1.85</strong> — 慈愛特化</li>
        <li>字詰め（本文）: <strong>0</strong>（負の値禁止）</li>
        <li>禁則: <code>line-break: strict</code></li>
        <li>英単語の途中改行禁止: <code>word-break: keep-all</code></li>
        <li>末尾孤立行回避: <code>text-wrap: pretty</code> / 見出しは <code>balance</code></li>
      </ul>
      <p>すべて <code>--lh-jp-*</code> / <code>--tracking-jp-*</code> / <code>--text-wrap-*</code> トークン経由で利用します。コンポーネントから生の値を直書きしないこと。</p>
    `,
  },
  'core/accessibility/contrast-knockout': {
    template: 'principle',
    title: 'コントラスト・白抜き',
    description: 'FIGロゴマニュアル準拠の白抜き規約をUI全体へ拡張。',
    preview: 'preview/contrast-knockout.html',
    body: `
      <h3>原則</h3>
      <ol>
        <li>白テキストは <strong>コントラスト 4.5:1 以上の濃色面</strong> だけに許容（大型テキストは 3.0:1）。</li>
        <li>ビビッドな明色面（primary, secondary）上の白テキストは原則禁止。例外は 18px 以上または 14px bold 以上の装飾的役割のみ。</li>
        <li>「読ませる UI」(CTA・本文・リンク) はコントラスト基準を満たす濃色面に限定。</li>
      </ol>
      <h3>許容される knockout 面（白テキスト 4.5:1 確保）</h3>
      <ul>
        <li><code>--color-surface-brand</code> (#1A8589): <strong>4.85:1</strong> ✓</li>
        <li><code>--color-surface-accent</code> (#2378A8): <strong>4.79:1</strong> ✓</li>
        <li><code>--color-surface-inverse</code> (#1E293B): <strong>14.94:1</strong> ✓</li>
      </ul>
      <h3>白テキスト不可（条件付き許容）</h3>
      <ul>
        <li><code>--color-surface-brand-vivid</code> (#26B7BC): 2.55:1 ✗ 本文不可</li>
        <li><code>--color-surface-accent-vivid</code> (#38A1DB): 3.21:1 ✗ 本文不可</li>
      </ul>
    `,
  },
  'core/accessibility/focus-touch': {
    template: 'principle',
    title: 'フォーカス・タッチターゲット',
    description: 'キーボード操作と物理タップの最低保証。',
    body: `
      <h3>Focus ring</h3>
      <ul>
        <li>幅: <code>--a11y-focus-ring-width</code> = 3px</li>
        <li>色: <code>--color-border-focus</code> = secondary-dark（背景コントラスト 3:1 確保）</li>
        <li>オフセット: <code>--a11y-focus-ring-offset</code> = 2px</li>
        <li>ブランド上は <code>--a11y-focus-ring-brand</code>、Error 上は <code>--a11y-focus-ring-error</code></li>
      </ul>
      <p><strong>禁止：</strong> <code>outline: none</code> でフォーカスリングを削除すること。視覚を消す場合は <code>:focus-visible</code> を使い、キーボード操作時のみ表示する制御に限定。</p>
      <h3>Touch target</h3>
      <ul>
        <li>物理下限: <strong>44×44</strong>（iOS HIG / Material 共通）</li>
        <li>Comfortable: <strong>48×48</strong></li>
        <li>視覚サイズが小さい場合は padding か <code>--a11y-hit-area-expand</code> で拡張</li>
      </ul>
    `,
  },
  'core/accessibility/reduced-motion': {
    template: 'principle',
    title: 'Reduced Motion',
    description: 'OS の動きを減らす設定への自動追従。',
    body: `
      <h3>契約</h3>
      <p><code>prefers-reduced-motion: reduce</code> が有効な場合、以下が <strong>トークン側で自動的に</strong> 上書きされます：</p>
      <ul>
        <li>すべての <code>--motion-*</code> / <code>--motion-experience-*</code> が <code>0.01ms linear</code> に変更</li>
        <li><code>--haptic-enabled</code> が <strong>0</strong> になり振動が停止</li>
        <li>アンビエントループは <code>animation-play-state: paused</code> 前提</li>
        <li><code>animation-duration</code> / <code>transition-duration</code> に対するグローバル上書きが <code>!important</code> で適用</li>
      </ul>
      <p>コンポーネント側で <code>if (prefersReducedMotion)</code> のような条件分岐コードを書く必要はありません。意味的トークン経由なら自動対応されます。</p>
    `,
  },

  /* ════════ Core / Components — Navigation & Structure ════════ */
  'core/components-navigation/fig-sense':       { template: 'component', title: 'FIG Sense（総覧）',  description: '角丸・アイソレーション・最小サイズの総合ショーケース。',                                                      preview: 'preview/components-fig-sense.html',                                                                   spec: null,                                  a11y: 'すべての構成部品は WCAG AA + 日本語禁則を満たすトークンを経由します。' },
  'core/components-navigation/header':          { template: 'component', title: 'Header / Footer',   description: 'ページ最上部のグローバル領域と、最下部の補助領域。ブランド・主要ナビ・補助情報の所在を固定。',                preview: 'preview/components-header.html',                  spec: null,                                  a11y: '<code>&lt;header&gt;</code> / <code>&lt;footer&gt;</code> ランドマーク。スキップリンクで本文へ即移動可能に。' },
  'core/components-navigation/navigation-rail': { template: 'component', title: 'Navigation Rail',   description: 'デスクトップ・タブレット向けの縦型ナビ。M3 準拠の中密度ナビゲーション。',                                     preview: 'preview/components-navigation-rail.html',             spec: null,                                  a11y: '<code>&lt;nav aria-label&gt;</code> + <code>aria-current="page"</code>。アイコン単独でも label を必須化。' },
  'core/components-navigation/navigation-bar':  { template: 'component', title: 'Navigation Bar',    description: '画面下端固定のグローバルナビ（旧 Bottom Navigation）。3–5 タブが原則。',                                  preview: 'preview/components-navigation-bar.html',            spec: 'components/bottom-navigation.spec.md', a11y: '<code>&lt;nav aria-label&gt;</code> + 各アイテムに <code>aria-current</code>。48×48 タッチターゲット確保。' },
  'core/components-navigation/side-sheet':      { template: 'component', title: 'Side Sheet',        description: '横からスライドインする補助領域。永続/モーダルの2形態。',                                                         preview: 'preview/components-side-sheet.html',                       spec: null,                                  a11y: 'modal 形態は <code>role="dialog"</code> + フォーカストラップ + Esc。スクリム必須。' },
  'core/components-navigation/bottom-sheet':    { template: 'component', title: 'Bottom Sheet',      description: '画面下端から立ち上がる一時領域。標準/モーダル/拡張可能の3形態。',                                                preview: 'preview/components-bottom-sheet.html',                   spec: null,                                  a11y: 'ドラッグハンドルに <code>role="button"</code>。modal 時はフォーカストラップ + Esc。' },
  'core/components-navigation/breadcrumb':      { template: 'component', title: 'Breadcrumb',        description: '階層構造内の現在地と上位への経路。3階層以上から検討。',                                                          preview: 'preview/components-breadcrumb.html',                         spec: null,                                  a11y: '<code>&lt;nav aria-label="現在地"&gt;</code> + 最終要素に <code>aria-current="page"</code>。' },
  'core/components-navigation/pagination':      { template: 'component', title: 'Pagination',        description: 'リスト・テーブルの分割ナビゲーション。前後ジャンプと番号指定を併設。',                                            preview: 'preview/components-pagination.html',                         spec: null,                                  a11y: '<code>&lt;nav aria-label="ページ送り"&gt;</code>。現在ページに <code>aria-current="page"</code>。' },
  'core/components-navigation/tabs':             { template: 'component', title: 'Tabs',              description: '並列で排他的なビューを切り替える。3タブ以上は再検討。',                                                          preview: 'preview/components-tabs.html',                                                                        spec: 'components/tab.spec.md',              a11y: '<code>role="tablist"</code> / <code>role="tab"</code> / <code>aria-selected</code> + ←→ キー。' },

  /* ════════ Core / Components — Actions & Buttons ════════ */
  'core/components-actions/button':           { template: 'component', title: 'Common Button',       description: '主要CTA は Pill（--radius-cta）、Secondary は 16px。Primary/Secondary/Tertiary/Destructive の4種。',          preview: 'preview/components-buttons.html',                                                                     spec: 'components/button.spec.md',           a11y: '<code>aria-disabled</code> 併記、icon-only は <code>ariaLabel</code> 必須、loading 時は <code>aria-busy</code>。' },
  'core/components-actions/fab':              { template: 'component', title: 'FAB',                 description: '画面内で最も突出した単一アクション（Floating Action Button）。1画面に1つが原則。',                                preview: 'preview/components-fab.html',                                       spec: null,                                  a11y: '<code>aria-label</code> 必須。48×48 px 以上。下端固定時は安全領域とインセットを考慮。' },
  'core/components-actions/segmented-button': { template: 'component', title: 'Segmented Button',    description: '2–5 個の選択肢から1つ（or 複数）を切替。Tabs より粒度の細かい操作切替。',                                       preview: 'preview/components-segmented-button.html',           spec: null,                                  a11y: '<code>role="radiogroup"</code> + 子に <code>role="radio"</code>。複数選択時は <code>role="group"</code> + checkbox。' },
  'core/components-actions/icon-button':      { template: 'component', title: 'Icon Button',         description: 'アイコンのみの圧縮されたボタン。ツールバー・密度の高い領域向け。',                                                  preview: 'preview/components-icon-button.html',                     spec: null,                                  a11y: '<code>aria-label</code> 必須（lucide 単独では意味伝達不可）。48×48 px 最小ヒット領域。' },

  /* ════════ Core / Components — Inputs & Selection ════════ */
  'core/components-inputs/text-field':    { template: 'component', title: 'Text Field',          description: 'テキスト・検索・数値入力。IME 配慮済み（旧 Input）。',                                                          preview: 'preview/components-inputs.html',                                                                      spec: 'components/input.spec.md',            a11y: 'label 必須、placeholder で代用しない。IME 入力中はフィルタ抑制。' },
  'core/components-inputs/toggle-switch': { template: 'component', title: 'Toggle Switch',       description: '即時反映の二値スイッチ。設定の ON/OFF など、適用に確認を要さない操作向け。',                                          preview: 'preview/components-toggle-switch.html',                 spec: null,                                  a11y: '<code>role="switch"</code> + <code>aria-checked</code>。色だけに依存せず、状態をラベルでも示す。' },
  'core/components-inputs/checkbox':      { template: 'component', title: 'Checkbox',            description: '複数選択可能な独立した選択肢。確定操作（Save / Apply）と組で用いる。',                                              preview: 'preview/components-checkbox.html',                             spec: null,                                  a11y: 'ネイティブ <code>&lt;input type="checkbox"&gt;</code> 推奨。<code>aria-checked="mixed"</code> で不確定状態。' },
  'core/components-inputs/radio-button':  { template: 'component', title: 'Radio Button',        description: '排他的な選択肢。2–5 個程度。それ以上は Select / Picker を検討。',                                                  preview: 'preview/components-radio-button.html',                   spec: null,                                  a11y: 'ネイティブ <code>&lt;input type="radio"&gt;</code> + 共通 name。<code>&lt;fieldset&gt;</code> でグループ化。' },
  'core/components-inputs/picker':        { template: 'component', title: 'Date / Time Picker',  description: '日付・時刻の選択 UI。直接入力とポップオーバーの併用が原則。',                                                    preview: 'preview/components-picker.html',             spec: null,                                  a11y: 'キーボードのみで全選択操作可能に。<code>aria-haspopup="dialog"</code>。和暦/西暦の切替に配慮。' },
  'core/components-inputs/form-group':    { template: 'component', title: 'Form Group',          description: '関連する入力をまとめる構造体。ラベル・補助文・エラー文の規約。',                                                  preview: 'preview/components-form-group.html',                       spec: null,                                  a11y: '<code>&lt;fieldset&gt;</code> + <code>&lt;legend&gt;</code>。エラーは <code>aria-describedby</code> で関連付け。' },

  /* ════════ Core / Components — Data Display & Communication ════════ */
  'core/components-data/table':       { template: 'component', title: 'Table',           description: '構造化データの一覧表示。ソート・絞り込み・ページネーションを併設。',                                            preview: 'preview/components-table.html',                                   spec: null,                                  a11y: '<code>&lt;th scope&gt;</code> 必須。並べ替え状態は <code>aria-sort</code>。レスポンシブで横スクロール許容。' },
  'core/components-data/list':        { template: 'component', title: 'List',            description: '垂直スタックの1行原子（List Item）。Navigation / Selection / Action / Info の4用途。',                          preview: 'preview/components-list-rows.html',                                                                   spec: 'components/list-item.spec.md',        a11y: '必ず <code>&lt;button&gt;</code> か <code>&lt;a&gt;</code> で実装。<code>&lt;div onClick&gt;</code> 禁止。' },
  'core/components-data/card':        { template: 'component', title: 'Card',            description: '慈愛のやわらかさを 16px 角丸で表現。Hero は 28px。',                                                              preview: 'preview/components-bus-card.html',                                                                    spec: 'components/card.spec.md',             a11y: 'interactive 時は <code>&lt;button&gt;</code>/<code>&lt;a&gt;</code> で実装。<code>&lt;div onClick&gt;</code> は禁止。' },
  'core/components-data/accordion':   { template: 'component', title: 'Accordion',       description: '見出しと折り畳まれた本文の集合。FAQ・補助情報の段階的開示。',                                                    preview: 'preview/components-accordion.html',                           spec: null,                                  a11y: '<code>&lt;button aria-expanded&gt;</code> + <code>aria-controls</code>。展開部に <code>region</code> ロール。' },
  'core/components-data/alert':       { template: 'component', title: 'Alert / Banner',  description: '画面内に永続的に表示する重要メッセージ。Toast と異なり自動消失しない。',                                          preview: 'preview/components-alert.html',                    spec: null,                                  a11y: '重要度に応じて <code>role="alert"</code> または <code>role="status"</code>。閉じるは Esc 対応。' },
  'core/components-data/toast':       { template: 'component', title: 'Toast / Snackbar', description: '操作中断なしの一時的通知。重大エラーは Modal を使う。',                                                          preview: 'preview/components-toast.html',                  spec: 'components/toast.spec.md',            a11y: '<code>role="status"</code> / <code>"alert"</code>、<code>aria-live</code> の使い分け。' },
  'core/components-data/modal':       { template: 'component', title: 'Modal / Dialog',  description: '注意を画面全体から奪う、取消困難な操作の確認。',                                                                 preview: 'preview/components-modal.html',                    spec: 'components/modal.spec.md',            a11y: '<code>role="dialog"</code> + フォーカストラップ + Escape ハンドラ。' },
  'core/components-data/badge':       { template: 'component', title: 'Badge',           description: '数値・状態を伴う小さな付箋。他要素にアンカーして注意を喚起。',                                                    preview: 'preview/components-badge.html',                                   spec: null,                                  a11y: '数値のみのバッジは <code>aria-label="未読 3 件"</code> 等で意味を補う。色だけに依存しない。' },
  'core/components-data/status-pill': { template: 'component', title: 'Status Pill',     description: '運行状態を一目で伝えるアイコン + ラベル（FIG 独自）。Badge の意味的特化形。',                                            preview: 'preview/components-status-pills.html',                                                                spec: 'components/status-pill.spec.md',      a11y: '色だけで意味を伝えない。<code>role="status"</code> + <code>aria-live</code>。' },
  'core/components-data/icon-bubble': { template: 'component', title: 'Icon Bubble',     description: '装飾的アイコンコンテナ。インタラクティブにしない。',                                                            preview: 'preview/components-icon-bubble.html',                     spec: 'components/icon-bubble.spec.md',      a11y: '既定で <code>aria-hidden="true"</code>。意味は親要素で集約表現。' },

  /* ════════ Core / Experience Patterns ════════ */
  'core/patterns/transition-budget':  { template: 'pattern', title: 'Transition Budget',  description: '体感速度バジェット（200ms 以内）の規約。',           preview: 'preview/motion-budget.html',    spec: 'patterns/transition-budget.md',  a11y: 'reduced-motion で全モーション 0.01ms に自動停止。' },
  'core/patterns/feedback-contract':  { template: 'pattern', title: 'Feedback Contract',  description: '視覚・触覚・聴覚の三位一体規約。',                    preview: 'preview/feedback-patterns.html', spec: 'patterns/feedback-contract.md',  a11y: '視覚/触覚/聴覚いずれかが no-op でも等価情報量を担保。' },
  'core/patterns/page-transition':    { template: 'pattern', title: 'Page Transition',    description: 'forward / back / tab-switch / modal-rise の標準。',     preview: null,                              spec: 'patterns/page-transition.md',    a11y: 'reduced-motion 自動追従、フォーカス管理を遷移後に復元。' },
  'core/patterns/arrival-card':       { template: 'pattern', title: 'Arrival Card',       description: '到着時刻カードのアンビエント呼吸と差分更新。',         preview: null,                              spec: 'patterns/arrival-card.md',       a11y: '到着時刻の動的更新は <code>aria-live="polite"</code> で読み上げ。' },
  'core/patterns/delay-banner':       { template: 'pattern', title: 'Delay Banner',       description: '広域の運行状況通知。Toast / Modal とは責務分離。',     preview: null,                              spec: 'patterns/delay-banner.md',       a11y: '重要度に応じて <code>role="alert"</code>、自動消失しない。' },
  'core/patterns/notification-sheet': { template: 'pattern', title: 'Notification Sheet', description: '永続的な通知履歴を保つボトムシート。',                 preview: null,                              spec: 'patterns/notification-sheet.md', a11y: '<code>role="dialog"</code> + フォーカストラップ + Esc。' },
  'core/patterns/route-selector':     { template: 'pattern', title: 'Route Selector',     description: '出発・到着停留所の選択フロー。',                       preview: null,                              spec: 'patterns/route-selector.md',     a11y: 'field-as-button: <code>aria-haspopup="listbox"</code>。' },

  /* ════════ Extensions / Busapp ════════ */
  'extensions/busapp/overview': {
    template: 'principle',
    title: 'Busapp — Overview',
    description: 'バス運行情報と決済を備えたモバイルWebアプリ。',
    body: `
      <p>京都府・兵庫県・大分県・沖縄県の通勤者向けに、バス到着時刻・遅延状況の確認と、（京都府のみ）デジタル定期券による NFC タッチ決済を提供する、モバイルファーストの日本語 Web アプリです。</p>
      <h3>主要画面</h3>
      <ol>
        <li><strong>運行情報</strong>（既定タブ）— ルートカードのリスト。最大 6 枚、出発時刻順に自動ソート。</li>
        <li><strong>乗車・決済</strong>（京都府のみ）— デジタル定期券、NFC シミュレーション、運賃サマリー。</li>
      </ol>
      <h3>Core への昇格</h3>
      <p>本アプリから抽出されたトークン・部品・パターンの大半は、Core 層へ昇格済みです。Busapp 拡張は <strong>交通ドメイン固有のセマンティクス</strong>（路線種別配色・車両種別・運行状態など）と、UI 固有の合成（定期券カード・路線リスト）のみを保持します。</p>
    `,
  },
  'extensions/busapp/transport-tokens': { template: 'foundation', title: 'Transport Domain Tokens', description: '路線・車両・運行状態の意味的配色。',   preview: 'preview/transport-domain-tokens.html' },
  'extensions/busapp/material-theme':   { template: 'foundation', title: 'Material Theme Mapping',  description: 'FIGトークンと Material 3 の対応表。',   preview: 'preview/material-theme-mapping.html' },
  'extensions/busapp/pass-card':        { template: 'foundation', title: 'Pass Card',               description: '定期券のHero カード組成。',              preview: 'preview/components-pass-card.html' },
  'extensions/busapp/prototype': {
    template: 'external',
    title: 'Prototype（外部画面で開く）',
    description: 'バスアプリの高忠実度クリックスループロトタイプ。',
    href: 'extensions/busapp/index.html',
    body: `
      <p>Busapp の対話プロトタイプ。地域選択 → ホーム → 路線詳細 → 決済のフルフローを React コンポーネントで構成。Core で定義されたトークン・部品・パターンの統合事例として参照できます。</p>
      <p><strong>※</strong> 本ポータルとはレイアウトが異なるため、iframe ではなく <em>別タブで開く</em> 構成です。</p>
    `,
  },

  /* ════════ Extensions / Template (+ New Project) ════════ */
  'extensions/template/overview': {
    template: 'principle',
    title: '+ New Project（プロジェクト複製ガイド）',
    description: 'Extensions層に新規プロジェクトを追加するためのテンプレート。',
    body: `
      <h3>このページの位置づけ</h3>
      <p>本ページは「<strong>新しいプロダクトの Extensions を立ち上げたいエンジニア・デザイナー</strong>」のためのガイドです。Core 層の不変ルールを守りつつ、プロダクト固有のセマンティクスを最短で展開できる手順を提示します。</p>
      <h3>3ステップで雛形を作る</h3>
      <ol>
        <li><strong>テンプレート複製</strong>: <code>extensions/template/</code> ディレクトリを <code>extensions/{project-name}/</code> にコピー。</li>
        <li><strong>Device Profile 選択</strong>: 自プロダクトの主要ユースケースに沿って <code>Mobile-Terminal</code> / <code>Web-Admin</code> / <code>Mobile-Consumer</code> から1つを宣言。</li>
        <li><strong>Signature Color の登録</strong>: <a href="#/core/foundations/color-system">Color System & Palette</a> の調和ルールに沿って Signature を1色決定。</li>
      </ol>
      <p>詳しい手順は、<a href="#/developer/guide/project-duplication">Developer Guide / Project Duplication</a> を参照してください。</p>
      <h3>Core昇格の道</h3>
      <p>Extensions で生まれた優れたパターンは、3プロダクト以上で利用された段階で <strong>Core への昇格レビュー</strong> の対象になります（<a href="#/developer/guide/contribution">Contribution</a> 参照）。</p>
    `,
  },

  /* ════════ Developer Guide ════════ */
  'developer/guide/getting-started': {
    template: 'principle',
    title: 'Getting Started',
    description: 'プロジェクトに FIG Universal Design System を導入する最短手順。',
    body: `
      <p>本ガイドはエンジニアが FIG Universal Design System を自プロジェクトに導入するための完全手順です。所要時間: 約 10 分。</p>

      <h3>前提条件</h3>
      <ul>
        <li>HTML/CSS の基本知識</li>
        <li>静的ホスティングまたは Vite / Next.js / Webpack 等のバンドラ（任意）</li>
        <li>モダンブラウザ（CSS Custom Properties、color-mix() 対応）</li>
      </ul>

      <h3>STEP 1 — ファイルの読み込み</h3>
      <p>プロジェクトの目的（Device Profile）に合わせて、必要な CSS を読み込みます。<strong>順序は厳守</strong>：primitive → semantic → tokens/base → profile → components。</p>
      <pre class="page-code"><code>&lt;!-- 1. 原子トークン（不変） --&gt;
&lt;link rel="stylesheet" href="/design-system/primitives.css"&gt;

&lt;!-- 2. 役割トークン（不変） --&gt;
&lt;link rel="stylesheet" href="/design-system/semantic.css"&gt;

&lt;!-- 3. プロファイル可変層 --&gt;
&lt;link rel="stylesheet" href="/design-system/tokens/base.css"&gt;
&lt;link rel="stylesheet" href="/design-system/tokens/profile-consumer.css"&gt;
&lt;!-- ↑ プロファイルは必要なものだけでよい。複数読み込んでも .fig-profile-* クラスで分離 --&gt;

&lt;!-- 4. 見本部品（任意。独自部品で代替可） --&gt;
&lt;link rel="stylesheet" href="/design-system/tokens/components.css"&gt;</code></pre>

      <h4>Vite / Next.js / Webpack で使う場合</h4>
      <pre class="page-code"><code>// app.tsx / main.ts 等のエントリで
import '@fig/design-system/primitives.css';
import '@fig/design-system/semantic.css';
import '@fig/design-system/tokens/base.css';
import '@fig/design-system/tokens/profile-consumer.css';
import '@fig/design-system/tokens/components.css';</code></pre>

      <h3>STEP 2 — プロファイルの適用</h3>
      <p><code>&lt;body&gt;</code> または最上位コンテナに、選択したプロファイル名のクラスを付与します。<strong>1ページに1プロファイル</strong>が原則。</p>
      <pre class="page-code"><code>&lt;body class="fig-profile-consumer"&gt;
  &lt;button class="fig-button"&gt;送信&lt;/button&gt;
&lt;/body&gt;</code></pre>

      <h4>React の場合</h4>
      <pre class="page-code"><code>export default function App() {
  return (
    &lt;div className="fig-profile-consumer"&gt;
      &lt;button className="fig-button"&gt;送信&lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>

      <h4>動的切替（プレビュー用途のみ推奨）</h4>
      <pre class="page-code"><code>document.body.classList.remove('fig-profile-admin', 'fig-profile-consumer', 'fig-profile-terminal');
document.body.classList.add('fig-profile-' + selected);</code></pre>

      <h3>STEP 3 — セマンティックトークンで実装</h3>
      <p>コンポーネントは <code>16px</code> 等の生値ではなく、<strong>必ず</strong> セマンティックトークン経由で参照すること。プロファイル切替時に値が自動で適切になります。</p>

      <h4>✅ 正解</h4>
      <pre class="page-code"><code>.my-button {
  font-size: var(--fig-size-body);
  padding: var(--fig-control-padding-y) var(--fig-control-padding-x);
  min-height: var(--fig-target-min);
  border-radius: var(--fig-radius-control);
  color: var(--color-text-onBrand);
  background: var(--color-surface-brand);
}</code></pre>

      <h4>❌ 不正解（プロファイル切替が効かない）</h4>
      <pre class="page-code"><code>.my-button {
  font-size: 16px;          /* ← 生値はNG */
  padding: 12px 20px;        /* ← 生値はNG */
  min-height: 48px;          /* ← 生値はNG */
  background: #1A8589;       /* ← 色も生値NG。--color-surface-brand を使う */
}</code></pre>

      <h3>STEP 4 — 部品を組み立てる</h3>
      <p>見本部品（<a href="#/core/components/button">Button</a>・<a href="#/core/components/card">Card</a>・<a href="#/core/components/input">Input</a> 等）を Core から参照、または <code>tokens/components.css</code> の <code>.fig-*</code> クラスを利用します。</p>
      <pre class="page-code"><code>&lt;article class="fig-card"&gt;
  &lt;h2 class="fig-card__title"&gt;運行状況&lt;/h2&gt;
  &lt;p class="fig-card__body"&gt;京都駅前 行 — 約4分後に到着&lt;/p&gt;
  &lt;button class="fig-button"&gt;詳細を見る&lt;/button&gt;
&lt;/article&gt;</code></pre>

      <h3>STEP 5 — バージョンを宣言</h3>
      <p>プロジェクトの <code>package.json</code> または <code>project-settings.json</code> に、依存している Core システムのバージョンを明記します。詳細は <a href="#/developer/guide/version-management">Version Management</a> 参照。</p>
      <pre class="page-code"><code>{
  "designSystem": {
    "coreVersion": "v1.2.0",
    "profile": "Mobile-Consumer"
  }
}</code></pre>

      <h3>Troubleshooting</h3>
      <table class="token-table">
        <thead><tr><th>症状</th><th>原因</th><th>対処</th></tr></thead>
        <tbody>
          <tr><td>フォントサイズが変わらない</td><td>プロファイルクラスが <code>&lt;body&gt;</code> に付与されていない</td><td>DevTools で body class を確認</td></tr>
          <tr><td>色が反映されない</td><td>primitives.css / semantic.css 未読込</td><td>読み込み順を STEP 1 通りに</td></tr>
          <tr><td>iframe 内だけ反映されない</td><td>iframe の <code>&lt;body&gt;</code> 側にもクラス付与が必要</td><td>postMessage または親で body.classList を同期</td></tr>
          <tr><td>本文行間が狭い</td><td>個別 CSS が <code>line-height</code> を上書き</td><td><code>var(--fig-line-height-body)</code> を使う</td></tr>
          <tr><td>ボタンが小さくタップしにくい</td><td>Admin プロファイル誤適用</td><td>Consumer / Terminal に切替</td></tr>
        </tbody>
      </table>

      <h3>次のステップ</h3>
      <ul>
        <li><a href="#/core/foundations/device-profiles">Device Profiles</a> — プロファイルごとの値定義一覧</li>
        <li><a href="#/developer/guide/version-management">Version Management</a> — バージョン管理ルール</li>
        <li><a href="#/developer/guide/project-duplication">Project Duplication</a> — 新規プロジェクト立ち上げ</li>
        <li><a href="#/developer/guide/contribution">Contribution</a> — Core 昇格と PR ルール</li>
      </ul>
    `,
  },
  'developer/guide/version-management': {
    template: 'principle',
    title: 'Version Management',
    description: 'セマンティックバージョニング規約と移行プロセス。',
    body: `
      <p>Core システムは <strong>セマンティックバージョニング (semver)</strong> <code>v{MAJOR}.{MINOR}.{PATCH}</code> で管理します。本ページは「スピード」と「俯瞰」の両立を実装に落とすための運用ルールです。</p>

      <h3>1. バージョン番号の意味</h3>
      <table class="token-table">
        <thead>
          <tr><th>種類</th><th>条件</th><th>移行コスト</th><th>例</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>PATCH</strong> (v1.2.<u>3</u>)</td><td>バグ修正のみ。トークン値・API 変更なし</td><td>0（即時追従）</td><td>focus ring の Z-fighting 修正</td></tr>
          <tr><td><strong>MINOR</strong> (v1.<u>3</u>.0)</td><td>後方互換あり。新トークン・新コンポーネント・新プロファイル追加</td><td>小（任意で利用）</td><td>新コンポーネント <code>fig-segment</code> 追加</td></tr>
          <tr><td><strong>MAJOR</strong> (v<u>2</u>.0.0)</td><td>破壊的変更を含む。トークン名変更・削除・型変更</td><td>大（要 Migration Guide 参照）</td><td><code>--fig-spacing-m</code> の値を 20px → 16px に統一</td></tr>
        </tbody>
      </table>

      <h3>2. 何が「破壊的変更（MAJOR）」か</h3>
      <ul>
        <li><strong>トークン名の変更・削除</strong>（<code>--fig-spacing-m</code> を <code>--fig-gap-m</code> に改名等）</li>
        <li><strong>トークン値の意味的変更</strong>（数値が同じでも役割が変わる）</li>
        <li><strong>コンポーネントクラス名の変更・削除</strong>（<code>.fig-button</code> → <code>.fig-cta</code> 等）</li>
        <li><strong>必須属性の追加</strong>（コンポーネントが新たに <code>aria-*</code> を要求する等）</li>
        <li><strong>ファイル構造の変更</strong>（<code>tokens/</code> ディレクトリの再編等）</li>
      </ul>
      <p>逆に、トークン値の微調整（例: spacing-m 19px → 20px）は通常 MINOR 扱い。<strong>判断に迷う場合は MAJOR に倒す</strong>（安全側）。</p>

      <h3>3. プロジェクト内での宣言</h3>
      <p>各プロジェクトの設定ファイルに、使用している Core バージョンと Device Profile を明記します：</p>
      <pre class="page-code"><code>// project-settings.json
{
  "projectName": "shuttle-ops",
  "designSystem": {
    "coreVersion": "v1.2.0",
    "profile": "Mobile-Consumer",
    "lockedAt": "2026-05-15"
  }
}</code></pre>
      <p>または <code>package.json</code> の <code>dependencies</code> に semver 範囲で指定（npm/yarn/pnpm 経由配信の場合）：</p>
      <pre class="page-code"><code>{
  "dependencies": {
    "@fig/design-system": "^1.2.0"
  }
}</code></pre>

      <h3>4. アップデート手順</h3>
      <h4>PATCH / MINOR の場合</h4>
      <ol>
        <li>パッケージマネージャで更新（<code>npm update @fig/design-system</code> 等）</li>
        <li>視覚回帰テスト（Chromatic / Percy / 手動）を実行</li>
        <li>差分が無いことを確認してマージ</li>
      </ol>
      <h4>MAJOR の場合</h4>
      <ol>
        <li><strong>Migration Guide を読む</strong>: <a href="#/developer/guide/migration">Migration Guide</a> で v1 → v2 の差分を把握</li>
        <li>ブランチを切って依存を更新</li>
        <li>Migration Guide の codemod / 手動修正を順に適用</li>
        <li>各プロファイル（Admin/Consumer/Terminal）でビジュアル回帰確認</li>
        <li><code>project-settings.json</code> の <code>coreVersion</code> を更新してマージ</li>
      </ol>

      <h3>5. Breaking Change の通知フロー</h3>
      <p>Core Maintainer は MAJOR リリースに先立ち、以下を実施します：</p>
      <ul>
        <li><strong>D-30</strong>: Pre-release タグで RC 公開、各 Extensions Lead に通知</li>
        <li><strong>D-14</strong>: Migration Guide を本ポータルに公開</li>
        <li><strong>D-7</strong>: 旧バージョンに <code>@deprecated</code> コメント追加（コード内に警告）</li>
        <li><strong>D-0</strong>: 正式リリース。旧バージョンは 90 日間サポート継続</li>
        <li><strong>D+90</strong>: 旧バージョンの保守終了</li>
      </ul>

      <h3>6. なぜ宣言が必要か</h3>
      <p>「スピード」と「俯瞰」の両立のためです。各プロダクトのバージョン状態が一覧できれば、Core の破壊的変更が <strong>誰に・いつ・どのコストで</strong> 波及するかを設計時に判断できます。逆に、宣言なしで運用すると、PATCH 修正の影響範囲を確認するためだけに「全プロジェクトの実装を読む」という負債が発生します。</p>

      <h3>関連</h3>
      <ul>
        <li><a href="#/developer/guide/migration">Migration Guide</a> — バージョン別の移行手順</li>
        <li><a href="#/developer/guide/contribution">Contribution</a> — Breaking Change を含む PR の作成手順</li>
      </ul>
    `,
  },
  'developer/guide/migration': {
    template: 'principle',
    title: 'Migration Guide',
    description: 'バージョン別の移行手順と codemod。',
    body: `
      <p>本ページは MAJOR バージョン間の移行ガイドを集約します。各 MAJOR 切替の <strong>before/after</strong> と <strong>codemod / 手動修正</strong> を提示します。</p>

      <h3>共通プロセス</h3>
      <ol>
        <li>ブランチを切る: <code>git checkout -b migrate/ds-v2</code></li>
        <li>当該バージョンの移行手順を順に適用</li>
        <li>3プロファイル全てで視覚検証（スクリーンショット差分）</li>
        <li><code>project-settings.json</code> の <code>coreVersion</code> を更新</li>
        <li>レビュー → マージ</li>
      </ol>

      <h3>v1.x → v2.0 (Planned)</h3>
      <p>v2.0 は未リリース。下記は <strong>計画中の破壊的変更</strong> です。実施前に必ず最新の Pre-release Notes を確認してください。</p>

      <h4>① トークン命名統一</h4>
      <p><code>--fig-spacing-*</code> を <code>--fig-gap-*</code> に統一予定。理由: Spacing と Gap の意味的衝突を解消。</p>
      <pre class="page-code"><code>/* before (v1.x) */
.my-stack { gap: var(--fig-spacing-m); }

/* after  (v2.0) */
.my-stack { gap: var(--fig-gap-m); }</code></pre>

      <h5>codemod（sed）</h5>
      <pre class="page-code"><code># 全 CSS の --fig-spacing-* を --fig-gap-* に置換
find . -name "*.css" -exec sed -i 's/--fig-spacing-/--fig-gap-/g' {} +
find . -name "*.css" -exec sed -i 's/--fig-spacing-/--fig-gap-/g' {} +</code></pre>

      <h4>② プロファイル既定値の見直し</h4>
      <p>Consumer の <code>--fig-spacing-m</code> を 20px → 16px に変更予定。理由: 業界標準（Material 3 / iOS HIG）との整合。</p>
      <p><strong>影響範囲</strong>: 既存の Consumer 画面で「やや詰まる」見え方になる。<strong>対策</strong>: 個別画面で広めに必要なら <code>--fig-spacing-l</code> へ昇格。</p>

      <h4>③ <code>.fig-button--ghost</code> 削除</h4>
      <p>使用率が 1% 未満のため削除予定。<strong>移行先</strong>: <code>.fig-button--secondary</code> に置換。</p>
      <pre class="page-code"><code>&lt;!-- before --&gt;
&lt;button class="fig-button fig-button--ghost"&gt;キャンセル&lt;/button&gt;
&lt;!-- after --&gt;
&lt;button class="fig-button fig-button--secondary"&gt;キャンセル&lt;/button&gt;</code></pre>

      <h3>v1.1 → v1.2 (Released 2026-05-15)</h3>
      <p>MINOR リリース。後方互換あり、強制移行不要。</p>
      <ul>
        <li><strong>追加</strong>: <code>Mobile-Terminal</code> プロファイル（業務端末向け）</li>
        <li><strong>追加</strong>: <code>Color System & Palette</code> ガイドライン（Signature 選択と Harmonization）</li>
        <li><strong>追加</strong>: <code>Version Selector</code> をポータルヘッダーに搭載</li>
        <li><strong>非破壊</strong>: 既存 v1.1 コードはそのまま動作</li>
      </ul>

      <h3>v1.0 → v1.1 (Released 2026-02-01)</h3>
      <p>MINOR リリース。後方互換あり。</p>
      <ul>
        <li><strong>追加</strong>: Device Profiles（Web-Admin / Mobile-Consumer の2プロファイル）</li>
        <li><strong>追加</strong>: <code>tokens/</code> ディレクトリ（base.css + profile-*.css）</li>
        <li><strong>非破壊</strong>: <code>tokens/</code> を読み込まないコードは v1.0 と同等</li>
      </ul>

      <h3>各リリースの Pre-release ノート</h3>
      <p>Pre-release タグ（v2.0.0-rc.1 等）は <a href="https://github.com/mci/fig-ds/releases" target="_blank" rel="noopener">GitHub Releases</a> に公開されます。本番反映前に必ず確認してください。</p>

      <h3>移行を支援するツール</h3>
      <ul>
        <li><strong>codemod</strong>: 上記 sed コマンド、または jscodeshift / postcss プラグイン</li>
        <li><strong>視覚回帰</strong>: Chromatic / Percy で 3プロファイル × 全コンポーネントの差分検出</li>
        <li><strong>型補完</strong>: <code>@fig/design-system-types</code>（TypeScript 用、未公開）で削除トークンを型エラー検出</li>
      </ul>

      <h3>関連</h3>
      <ul>
        <li><a href="#/developer/guide/version-management">Version Management</a> — semver 判定基準</li>
        <li><a href="#/developer/guide/contribution">Contribution</a> — Breaking Change を含む PR の作成手順</li>
      </ul>
    `,
  },
  'developer/guide/project-duplication': {
    template: 'principle',
    title: 'Project Duplication',
    description: 'Extensions層に新規プロジェクトを立ち上げるための完全手順。',
    body: `
      <p>新しいプロダクトを Extensions層に追加するためのスキャフォルディング手順です。所要時間: 約 20 分。</p>

      <h3>事前チェックリスト</h3>
      <ul>
        <li>☐ プロジェクト名（ケバブケース、英小文字のみ）が決まっている</li>
        <li>☐ 主要ユーザー像が明確で、Device Profile が決定できる</li>
        <li>☐ Signature Color（プロダクト識別色）の候補がある</li>
        <li>☐ Core システムの現行バージョンを確認した</li>
      </ul>

      <h3>STEP 1 — テンプレートのコピー</h3>
      <p>ポータルの <code>extensions/template/</code> ディレクトリをコピーし、新規プロジェクト用ディレクトリを作成します。</p>
      <pre class="page-code"><code># Bash / WSL
cp -r extensions/template extensions/{your-project-name}

# Windows PowerShell
Copy-Item -Recurse extensions/template extensions/{your-project-name}</code></pre>

      <h3>STEP 2 — project-settings.json の更新</h3>
      <p>テンプレートの <code>project-settings.json</code> を編集します。<strong>必須3項目</strong>:</p>
      <pre class="page-code"><code>{
  "projectName": "shuttle-ops",
  "displayName": "Shuttle Operations",
  "description": "シャトルバス運行管理者向け管理画面",
  "designSystem": {
    "coreVersion": "v1.2.0",
    "profile": "Web-Admin",
    "lockedAt": "2026-05-15"
  },
  "signatureColor": {
    "value": "#2378A8",
    "name": "Operations Blue",
    "harmonization": "Sky-Blue (Brand secondary-dark)"
  },
  "owners": ["@takahashi", "@hayaki"],
  "createdAt": "2026-05-15"
}</code></pre>

      <h4>スキーマ詳細</h4>
      <table class="token-table">
        <thead>
          <tr><th>フィールド</th><th>型</th><th>必須</th><th>説明</th></tr>
        </thead>
        <tbody>
          <tr><td><code>projectName</code></td><td>string (kebab-case)</td><td>✓</td><td>URL・パス・クラス名の元。英小文字とハイフンのみ</td></tr>
          <tr><td><code>displayName</code></td><td>string</td><td>✓</td><td>ポータル表示名（日英可）</td></tr>
          <tr><td><code>description</code></td><td>string</td><td>✓</td><td>サイドバーのヒント表示用</td></tr>
          <tr><td><code>designSystem.coreVersion</code></td><td>semver</td><td>✓</td><td>例: <code>v1.2.0</code>。<a href="#/developer/guide/version-management">VM</a> 参照</td></tr>
          <tr><td><code>designSystem.profile</code></td><td>enum</td><td>✓</td><td><code>Web-Admin</code> / <code>Mobile-Consumer</code> / <code>Mobile-Terminal</code></td></tr>
          <tr><td><code>signatureColor.value</code></td><td>hex</td><td>✓</td><td>プロダクト識別色</td></tr>
          <tr><td><code>signatureColor.harmonization</code></td><td>string</td><td>推奨</td><td>Core ブランドとの関係（説明文）</td></tr>
          <tr><td><code>owners</code></td><td>string[]</td><td>推奨</td><td>変更レビュー担当者（GitHub ID）</td></tr>
        </tbody>
      </table>

      <h3>STEP 3 — Device Profile の選択</h3>
      <p>プロダクトの主要ユースケースから1つを選択（複数選択不可）:</p>
      <table class="token-table">
        <thead>
          <tr><th>選択肢</th><th>採用ガイドライン</th></tr>
        </thead>
        <tbody>
          <tr><td><code>Web-Admin</code></td><td>PC + マウス前提。テーブル・ダッシュボード中心の業務画面。情報密度を優先。</td></tr>
          <tr><td><code>Mobile-Consumer</code></td><td>一般ユーザー向けスマホアプリ。親指操作・歩行中利用を想定。慈愛優先。</td></tr>
          <tr><td><code>Mobile-Terminal</code></td><td>業務端末（無線機・配送タブレット）。手袋着用・揺れる現場を想定。視認性最優先。</td></tr>
        </tbody>
      </table>

      <h3>STEP 4 — Signature Color の決定</h3>
      <p><a href="#/core/foundations/color-system">Color System & Palette</a> の Harmonization ルールに沿って、プロダクト独自の Signature Color を1色決定します。</p>
      <ol>
        <li>FIG Brand Primary（Turquoise）/ Secondary（Sky Blue）との関係を <strong>±15°（HSL）以内</strong> に保つ</li>
        <li>白テキスト 4.5:1 以上のコントラストを確保（CTA 背景として利用可能にする）</li>
        <li>機能色（Success/Warning/Error/Info）は Core 既定を継承（Signature だけ独自）</li>
      </ol>

      <h3>STEP 5 — 個別拡張（Extensions）の記述</h3>
      <p>共通コンポーネントで不足する UI のみ <code>extensions/{project-name}/components/</code> に独自スタイルを記述します。<strong>必須ルール</strong>:</p>
      <ul>
        <li>✅ <code>--fig-*</code> / <code>--color-*</code> 等の <strong>トークン経由</strong>で値を参照</li>
        <li>❌ 生 px / 生 hex を直書きしない</li>
        <li>✅ クラス名は <code>.{project-name}-{component}</code> 形式（衝突回避）</li>
        <li>❌ <code>.fig-*</code> クラスを上書きしない（Core 部品はそのまま使う）</li>
      </ul>

      <h3>STEP 6 — ポータルへの登録</h3>
      <p>新規プロジェクトのページを <code>assets/js/portal-content.js</code> の <code>SITEMAP.extensions.sections</code> に追加：</p>
      <pre class="page-code"><code>// SITEMAP.extensions.sections に追加
{
  id: 'shuttle-ops',
  label: 'Shuttle Operations (Web-Admin)',
  hint: 'シャトルバス運行管理',
  items: [
    { id: 'overview',     label: 'Overview' },
    { id: 'dashboards',   label: 'Dashboards' },
    { id: 'driver-list',  label: 'Driver List' },
  ],
},

// PAGES に追加（ルートは extensions/{projectName}/{itemId}）
'extensions/shuttle-ops/overview': {
  template: 'principle',
  title: 'Shuttle Operations — Overview',
  description: '管理者向け運行ダッシュボード',
  body: ` + '`' + `&lt;p&gt;...プロジェクトの紹介...&lt;/p&gt;` + '`' + `,
},</code></pre>

      <h3>STEP 7 — PR の作成</h3>
      <ol>
        <li>ブランチ名: <code>extensions/{project-name}/scaffold</code></li>
        <li>PR タイトル: <code>[Extensions] Add {DisplayName} project</code></li>
        <li>レビュアー: Core Maintainer 1名 + 自プロダクトの Owners</li>
        <li>マージ条件: ポータルへの登録、Lint 通過、3プロファイルでスクリーンショット添付</li>
      </ol>

      <h3>完了チェックリスト</h3>
      <ul>
        <li>☐ <code>extensions/{project-name}/</code> ディレクトリが作成された</li>
        <li>☐ <code>project-settings.json</code> の必須3項目が埋まっている</li>
        <li>☐ <code>portal-content.js</code> の SITEMAP に追加されている</li>
        <li>☐ ポータルから <code>#/extensions/{project-name}/overview</code> が開ける</li>
        <li>☐ Profile Switcher を切り替えても表示が壊れない</li>
        <li>☐ README.md にプロジェクト概要が記載されている</li>
      </ul>

      <h3>関連</h3>
      <ul>
        <li><a href="#/extensions/template/overview">+ New Project</a> — 簡易チュートリアル</li>
        <li><a href="#/core/foundations/color-system">Color System & Palette</a> — Signature 選択基準</li>
        <li><a href="#/developer/guide/contribution">Contribution</a> — Core 昇格を視野に入れた設計指針</li>
      </ul>
    `,
  },
  'developer/guide/contribution': {
    template: 'principle',
    title: 'Contribution',
    description: 'Extensions → Core 昇格フローと PR 作法。',
    body: `
      <p>本ページは FIG Universal Design System への貢献ガイドです。Extensions層での実装が Core 層へ昇格する経路と、その品質基準を定義します。</p>

      <h3>開発における3つの理念</h3>
      <ul>
        <li><strong>スピード (Speed)</strong>: トークンとコンポーネントを活用し、UI構築ではなく「価値提供」に時間を割く。</li>
        <li><strong>慈愛 (Empathy)</strong>: Device Profile が提供するアクセシビリティ基準を遵守し、使いやすさを追求する。</li>
        <li><strong>俯瞰 (Perspective)</strong>: 自プロダクトが FIG グループ全体のトーン&マナーに合致しているか、常にポータルで比較確認する。</li>
      </ul>

      <h3>Core 昇格フロー</h3>
      <p>Extensions で生まれた優れた部品・パターンは、以下のフローで Core に昇格します：</p>
      <ol>
        <li><strong>提案 (Propose)</strong>: GitHub Issue を作成し、<code>core-promotion</code> ラベルを付与。「どのプロダクトで、どんな課題に、どう使われているか」を3行で記述。</li>
        <li><strong>3プロダクト基準 (3-Product Rule)</strong>: 異なる3プロダクト以上での利用実績、または明示的な需要があること。</li>
        <li><strong>普遍化 (Generalize)</strong>: ドメイン固有の語彙を取り除き、Device Profile 非依存に書き直す（例: 「定期券カード」→「Hero Card」、「路線色」→「Domain Color Slot」）。</li>
        <li><strong>レビュー (Review)</strong>: Core Maintainer 1名 + 関連 Extensions Lead 2名以上でデザインレビュー。</li>
        <li><strong>リリース (Release)</strong>: Core の次 MINOR バージョン（v1.x+1）に含めて公開。</li>
      </ol>

      <h3>Core 昇格判定チェックリスト</h3>
      <p>レビュー時に以下を確認します。<strong>すべて ✓ で昇格対象</strong>：</p>
      <ul>
        <li>☐ 3プロダクト以上で利用実績または明示需要がある</li>
        <li>☐ ドメイン固有語彙が抽象化されている</li>
        <li>☐ <code>--fig-*</code> / <code>--color-*</code> トークン経由のみで実装</li>
        <li>☐ 3プロファイル（Admin/Consumer/Terminal）で視覚的に成立</li>
        <li>☐ WCAG AA を満たす（コントラスト・タップ領域・フォーカス）</li>
        <li>☐ <code>prefers-reduced-motion</code> に追従する</li>
        <li>☐ Spec ドキュメントが存在する（<code>components/*.spec.md</code>）</li>
        <li>☐ ライブプレビュー（<code>preview/*.html</code>）が存在する</li>
        <li>☐ a11y 注意点が記載されている</li>
      </ul>

      <h3>Pull Request の作法</h3>

      <h4>ブランチ命名</h4>
      <pre class="page-code"><code>feat/core/{component-name}        # 新コンポーネント (MINOR)
fix/core/{component-name}         # バグ修正 (PATCH)
feat/extensions/{project}/{name}  # 自プロダクト機能追加
refactor/tokens/{token-group}     # トークン再編 (MAJOR の可能性)
docs/portal/{page}                # ポータルドキュメント更新</code></pre>

      <h4>コミットメッセージ規約（Conventional Commits）</h4>
      <pre class="page-code"><code>feat(button): add --fig-button-icon-only variant
fix(modal): focus trap leaks when esc is pressed twice
refactor(tokens)!: rename --fig-spacing-* to --fig-gap-*  ← ! = Breaking
docs(portal): add Migration Guide for v2.0
chore(deps): bump postcss to 8.4.31</code></pre>
      <p><strong>!</strong> マーカー付きは Breaking Change の宣言。Body に <code>BREAKING CHANGE:</code> 行を必ず追加してください。</p>

      <h4>PR テンプレート</h4>
      <pre class="page-code"><code>## 概要
- 1〜3行で「何をしたか」

## 動機
- なぜこの変更が必要か（リンクするIssue, 利用プロダクト）

## 影響範囲
- [ ] Core トークン変更（影響: 全Extensions）
- [ ] Core コンポーネント変更（影響: 利用Extensions）
- [ ] 自プロダクトのみ
- [ ] ポータルドキュメントのみ

## 検証
- [ ] Admin プロファイルでスクリーンショット
- [ ] Consumer プロファイルでスクリーンショット
- [ ] Terminal プロファイルでスクリーンショット
- [ ] WCAG AA コントラストチェック（必要時）
- [ ] キーボード操作確認（タブ順、フォーカス可視性）
- [ ] reduced-motion 確認（動きを含む場合）

## Breaking Change
- なし / あり（あれば移行手順を記載）</code></pre>

      <h4>PR の粒度ルール</h4>
      <ul>
        <li>✅ 1 PR = 1 トピック（複数コンポーネント変更を1 PR にまとめない）</li>
        <li>✅ Token 変更と Component 実装は別 PR（影響範囲の分離）</li>
        <li>✅ 100行を超える PR は要 Summary 記述</li>
        <li>❌ 「ついでに」リファクタリングを混ぜない</li>
      </ul>

      <h3>レビュー基準</h3>
      <p>レビュアーは以下を確認します：</p>
      <ul>
        <li><strong>トークン経由実装</strong>: 生 px / 生 hex がないこと</li>
        <li><strong>命名整合</strong>: <code>--fig-*</code> プレフィクス、ケバブケース、意味的命名</li>
        <li><strong>3プロファイル検証</strong>: スクリーンショット 3 枚または GIF</li>
        <li><strong>後方互換</strong>: 既存コードを壊していないか（MINOR/PATCH の場合）</li>
        <li><strong>Spec 整合</strong>: <code>components/*.spec.md</code> が更新されているか</li>
        <li><strong>Accessibility</strong>: aria 属性、フォーカス管理、コントラスト</li>
      </ul>

      <h3>Issue の作法</h3>
      <h4>テンプレート</h4>
      <pre class="page-code"><code>## 種類
[ ] バグ報告
[ ] 機能要望
[ ] Core 昇格提案 (label: core-promotion)
[ ] ドキュメント改善

## 概要
1〜2行で何が起きているか、何が欲しいか

## 再現/詳細
- 環境（プロファイル、ブラウザ）
- 期待する動作
- 実際の動作
- スクリーンショット

## 関連
- 関連 PR / Issue / Slack スレッド</code></pre>

      <h3>マージ後</h3>
      <ul>
        <li>関連 Extensions の Owners に Teams やガルーンで通知</li>
        <li>MAJOR 変更の場合は <a href="#/developer/guide/migration">Migration Guide</a> に追記</li>
        <li>次回リリース時に Release Notes に記載</li>
      </ul>

      <h3>関連</h3>
      <ul>
        <li><a href="#/developer/guide/version-management">Version Management</a> — semver 判定基準</li>
        <li><a href="#/developer/guide/migration">Migration Guide</a> — Breaking Change の記録先</li>
      </ul>
    `,
  },
  'developer/guide/ai-co-creation': {
    template: 'principle',
    title: 'AI Co-creation',
    description: 'AIとの共同開発ガイド — デザインシステムを「AI出力のブースター」にする。',
    body: `
      <style>
        .fig-ai-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--fig-spacing-m, 16px);
          padding: var(--fig-spacing-l, 24px);
          background: var(--color-surface-subtle, #f7f8f9);
          border: 1px solid var(--color-border-subtle, #e1e3e6);
          border-radius: var(--fig-radius-card, 12px);
          margin: var(--fig-spacing-m, 16px) 0;
        }
        .fig-ai-form__field { display: flex; flex-direction: column; gap: 6px; }
        .fig-ai-form__field--full { grid-column: 1 / -1; }
        .fig-ai-form__label {
          font-size: var(--fig-size-caption, 13px);
          font-weight: 600;
          color: var(--color-text-strong, #1a1a1a);
        }
        .fig-ai-form__hint {
          font-size: 12px;
          color: var(--color-text-subtle, #6b7280);
          font-weight: 400;
        }
        .fig-ai-form__input,
        .fig-ai-form__select {
          width: 100%;
          padding: 8px 12px;
          font-size: var(--fig-size-body, 14px);
          font-family: inherit;
          color: var(--color-text-default, #1a1a1a);
          background: var(--color-surface-base, #ffffff);
          border: 1px solid var(--color-border-default, #cbd0d6);
          border-radius: var(--fig-radius-input, 6px);
          box-sizing: border-box;
        }
        .fig-ai-form__input:focus,
        .fig-ai-form__select:focus {
          outline: 2px solid var(--color-border-brand, #1A8589);
          outline-offset: 1px;
          border-color: var(--color-border-brand, #1A8589);
        }
        .fig-ai-form__color-row {
          display: flex; align-items: center; gap: 8px;
        }
        .fig-ai-form__color {
          width: 44px; height: 38px; padding: 2px;
          border: 1px solid var(--color-border-default, #cbd0d6);
          border-radius: var(--fig-radius-input, 6px);
          background: var(--color-surface-base, #ffffff);
          cursor: pointer; flex-shrink: 0;
        }
        .fig-ai-output {
          position: relative;
          margin: var(--fig-spacing-m, 16px) 0;
        }
        .fig-ai-output__textarea {
          width: 100%;
          min-height: 360px;
          padding: var(--fig-spacing-m, 16px);
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 12.5px;
          line-height: 1.65;
          color: var(--color-text-default, #1a1a1a);
          background: var(--color-surface-code, #0f172a);
          color: #e6edf3;
          border: 1px solid var(--color-border-strong, #1e293b);
          border-radius: var(--fig-radius-card, 12px);
          box-sizing: border-box;
          resize: vertical;
          white-space: pre;
          overflow: auto;
        }
        .fig-ai-output__actions {
          display: flex; justify-content: flex-end; gap: 8px;
          margin-top: 8px;
        }
        .fig-ai-copy-btn {
          padding: 8px 16px;
          font-size: var(--fig-size-body, 14px);
          font-weight: 600;
          color: #ffffff;
          background: var(--color-surface-brand, #1A8589);
          border: none;
          border-radius: var(--fig-radius-input, 6px);
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .fig-ai-copy-btn:hover { background: var(--color-brand-primary-dark, #146e72); }
        .fig-ai-copy-btn:focus-visible {
          outline: 2px solid var(--color-border-brand, #1A8589);
          outline-offset: 2px;
        }
        .fig-ai-copy-btn[data-copied="true"] {
          background: #16a34a;
        }
        @media (max-width: 720px) {
          .fig-ai-form { grid-template-columns: 1fr; }
        }
      </style>

      <p>本ページは <strong>FIG Universal Design System × AI</strong> の活用ガイドです。「守るべきルールブック」だったデザインシステムを、<strong>AI出力を爆速にするためのブースター</strong>へと進化させます。</p>

      <h3 id="ai-overview">1. Overview — なぜ「デザインシステム × AI」なのか</h3>
      <p>デザインシステムは AI と組み合わせることで、最大の真価を発揮します。トークン・コンポーネント・規約という<strong>「制約」を AI に与える</strong>ことで、以下の3つの効果が同時に得られます：</p>
      <ul>
        <li><strong>スピード</strong>: ボイラープレートの記述を AI に任せ、エンジニアは価値提供のロジックに集中できる。</li>
        <li><strong>慈愛</strong>: トークン経由の実装が強制されるため、Device Profile のアクセシビリティ基準が自動的に担保される。</li>
        <li><strong>俯瞰</strong>: AI が「ハルシネーション」で生 hex / 生 px をハードコードする事故を、規約と Strict Mode プロンプトで抑制できる。</li>
      </ul>
      <p>本ページでは、VS Code 上の Claude / Cursor / Copilot 等の AI ツールで本デザインシステムを「常時コンテキスト」として活用するための、<strong>テンプレートプロンプト</strong>と<strong>環境設定</strong>を提供します。</p>

      <h3 id="ai-generator">2. Interactive Prompt Generator — 新規プロジェクト生成プロンプト</h3>
      <p>下記フォームに入力すると、<a href="#/developer/guide/project-duplication">Project Duplication</a> の手順を AI に正確に実行させるためのプロンプトがリアルタイム生成されます。「コピー」ボタンを押して Cursor の Chat / Composer や VS Code の Claude にそのまま貼り付けてください。</p>

      <form id="fig-ai-prompt-form" class="fig-ai-form" autocomplete="off" oninput="window.figAICoCreation && window.figAICoCreation.update(this)">
        <div class="fig-ai-form__field">
          <label class="fig-ai-form__label" for="fig-ai-projectName">プロジェクト名 <span class="fig-ai-form__hint">（kebab-case / 英小文字）</span></label>
          <input class="fig-ai-form__input" type="text" id="fig-ai-projectName" name="projectName" placeholder="busapp" value="busapp">
        </div>
        <div class="fig-ai-form__field">
          <label class="fig-ai-form__label" for="fig-ai-displayName">表示名</label>
          <input class="fig-ai-form__input" type="text" id="fig-ai-displayName" name="displayName" placeholder="Bus 運行情報・決済" value="Bus 運行情報・決済">
        </div>
        <div class="fig-ai-form__field fig-ai-form__field--full">
          <label class="fig-ai-form__label" for="fig-ai-description">概要 <span class="fig-ai-form__hint">（サイドバーのヒントに表示）</span></label>
          <input class="fig-ai-form__input" type="text" id="fig-ai-description" name="description" placeholder="バス運行情報と決済を備えたモバイルWebアプリ" value="バス運行情報と決済を備えたモバイルWebアプリ">
        </div>
        <div class="fig-ai-form__field">
          <label class="fig-ai-form__label" for="fig-ai-profile">デバイスプロファイル</label>
          <select class="fig-ai-form__select" id="fig-ai-profile" name="profile">
            <option value="Mobile-Consumer" selected>Mobile-Consumer（スマホ向け）</option>
            <option value="Web-Admin">Web-Admin（PC管理画面）</option>
            <option value="Mobile-Terminal">Mobile-Terminal（業務端末）</option>
          </select>
        </div>
        <div class="fig-ai-form__field">
          <label class="fig-ai-form__label" for="fig-ai-coreVersion">参照する Core バージョン</label>
          <select class="fig-ai-form__select" id="fig-ai-coreVersion" name="coreVersion">
            <option value="v1.2.0" selected>v1.2.0 (Latest)</option>
            <option value="v1.1.0">v1.1.0</option>
            <option value="v1.0.0">v1.0.0</option>
          </select>
        </div>
        <div class="fig-ai-form__field">
          <label class="fig-ai-form__label" for="fig-ai-signatureValue">シグネチャーカラー</label>
          <div class="fig-ai-form__color-row">
            <input class="fig-ai-form__color" type="color" id="fig-ai-signatureValue" name="signatureValue" value="#26B7BC" oninput="document.getElementById('fig-ai-signatureValueText').value = this.value.toUpperCase()">
            <input class="fig-ai-form__input" type="text" id="fig-ai-signatureValueText" value="#26B7BC" readonly tabindex="-1" aria-label="シグネチャーカラーの Hex 値（表示）">
          </div>
        </div>
        <div class="fig-ai-form__field">
          <label class="fig-ai-form__label" for="fig-ai-signatureName">カラー名</label>
          <input class="fig-ai-form__input" type="text" id="fig-ai-signatureName" name="signatureName" placeholder="Turquoise" value="Turquoise">
        </div>
        <div class="fig-ai-form__field fig-ai-form__field--full">
          <label class="fig-ai-form__label" for="fig-ai-harmonization">調和ルール説明 <span class="fig-ai-form__hint">（Core ブランドとの関係を1行で）</span></label>
          <input class="fig-ai-form__input" type="text" id="fig-ai-harmonization" name="harmonization" placeholder="FIG Brand Primary 同色（差別化のため将来固有色へ変更）" value="FIG Brand Primary 同色（差別化のため将来固有色へ変更）">
        </div>
        <div class="fig-ai-form__field fig-ai-form__field--full">
          <label class="fig-ai-form__label" for="fig-ai-owners">オーナー <span class="fig-ai-form__hint">（カンマ区切り、GitHub ハンドル推奨）</span></label>
          <input class="fig-ai-form__input" type="text" id="fig-ai-owners" name="owners" placeholder="@takahashi, @hayaki" value="@takahashi, @hayaki">
        </div>
      </form>

      <div class="fig-ai-output">
        <label class="fig-ai-form__label" for="fig-ai-prompt-output" style="display:block; margin-bottom:6px;">生成プロンプト（読み取り専用）</label>
        <textarea id="fig-ai-prompt-output" class="fig-ai-output__textarea" readonly aria-label="生成された AI プロンプト"></textarea>
        <div class="fig-ai-output__actions">
          <button id="fig-ai-copy-btn" type="button" class="fig-ai-copy-btn" onclick="window.figAICoCreation && window.figAICoCreation.copy()">📋 クリップボードにコピー</button>
        </div>
      </div>

      <p><strong>使い方</strong>: 上記の内容をコピーした後、Cursor の Chat / Composer、または VS Code 上の Claude / Copilot Chat に貼り付けてください。AI はリポジトリの実態（<code>extensions/template/</code> の構造、<code>project-settings.json</code> のスキーマ、トークン規約）に厳密に従ったコードを生成します。</p>

      <h3 id="ai-tools-setup">3. AI Tools Setup — 各 AI ツールの環境設定ガイド</h3>
      <p>本デザインシステムを「常時コンテキスト」として AI に読ませるための設定です。プロンプトの先頭で毎回 Core 規約を説明する手間を省き、生成品質を安定させます。</p>

      <h4>Cursor 向け: <code>.cursorrules</code> の記述例</h4>
      <p>プロジェクトのリポジトリルートに <code>.cursorrules</code> ファイルを配置してください。Cursor は全 AI 出力でこれを参照します。</p>
      <pre class="page-code"><code># FIG Universal Design System — Cursor Rules

あなたは FIG Universal Design System に厳格に従うフロントエンドエンジニアです。
UI を生成する際は、以下の規約を必ず守ってください：

## トークンの使用
- 色・余白・タイポは必ず CSS 変数経由で参照する
  - 例: var(--color-surface-brand), var(--fig-spacing-m), var(--fig-size-body)
- 生 hex（#xxxxxx）・生 px・生 rem の直書きは禁止
- トークン定義の場所: /tokens/, primitives.css, semantic.css

## ディレクトリ規約
- 新規プロジェクトは extensions/{project-name}/ 配下に配置
- /design-system/ などの架空親フォルダは作成しない
- プロジェクト設定: extensions/{project-name}/project-settings.json
  （スキーマは extensions/template/project-settings.json に準拠）

## クラス命名
- Core 部品（.fig-*）は上書き禁止
- プロジェクト固有スタイルは .{project-name}-{component} 形式
- 配置先: extensions/{project-name}/styles/extensions.css

## デバイスプロファイル
- &lt;body&gt; に fig-profile-{admin|consumer|terminal} を必ず付与
- 対応する tokens/profile-*.css を1つだけ読み込む

## 機能色
- Success / Warning / Error / Info は Core 既定を継承
- シグネチャーカラーのみプロジェクト固有として定義可

## 詳細仕様の参照先
- README.md          ... システム全体像
- design-system.md   ... 設計思想
- primitives.css     ... 不変トークン定義
- semantic.css       ... 意味的役割マッピング
</code></pre>

      <h4>VS Code (Claude / Copilot) 向け: ドキュメントマップ</h4>
      <p>VS Code 上の Claude 拡張または Copilot Chat では、セッション開始時に以下のファイルを「コンテキスト」として明示的に開いておくと、出力が安定します：</p>
      <ol>
        <li><strong>必須</strong> — <code>README.md</code>（システム全体像）</li>
        <li><strong>必須</strong> — <code>design-system.md</code>（設計思想・3層構造）</li>
        <li><strong>必須</strong> — <code>extensions/template/project-settings.json</code>（プロジェクト設定スキーマ）</li>
        <li><strong>必須</strong> — <code>extensions/template/index.html</code>（プロファイル CSS 読み込み順の正解例）</li>
        <li>状況に応じて — <code>primitives.css</code> / <code>semantic.css</code>（CSS 変数を直接確認する場合）</li>
        <li>状況に応じて — <a href="#/developer/guide/project-duplication">Project Duplication</a> ページ（複製手順の完全版）</li>
      </ol>
      <p>プロンプト冒頭で「これらのファイル内容に従って」と明示すると、AI は規約を超えた創造を避けます。</p>

      <h3>関連</h3>
      <ul>
        <li><a href="#/developer/guide/project-duplication">Project Duplication</a> — 本プロンプトが自動化する手順書の完全版</li>
        <li><a href="#/core/foundations/color-system">Color System & Palette</a> — シグネチャーカラー選択時の Harmonization ルール</li>
        <li><a href="#/core/foundations/device-profiles">Device Profiles</a> — Admin / Consumer / Terminal の選択基準</li>
        <li><a href="#/developer/guide/contribution">Contribution</a> — AI 生成コードを Core へ昇格させる流れ</li>
      </ul>
    `,
  },
};

/* ─────────────────────────────────────────────────────────────
   既定ルート（最初のページ）
   ───────────────────────────────────────────────────────────── */
const DEFAULT_ROUTE = 'core/principles/vision';

/* グローバル公開 */
window.PortalContent = { SITEMAP, PAGES, DEFAULT_ROUTE };
})();
