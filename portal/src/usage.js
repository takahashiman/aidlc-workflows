/**
 * 使い方ページ（PT-8 / US-2.7 操作随伴ガイド / FDQ8=A）
 * 定型テンプレ「目的 → 前提 → 手順 → 確認」。ツール非依存（各チーム標準の Git/AI に読み替え可能 / BR-USE-2）。
 * 操作を要する全場面はここへ導線を持つ（BR-USE-1）。
 */
/* ───────── シナリオ①：AI 指示テンプレ（汎用・固有色なし） ───────── */
const T2_TEXT =
`【スタイル整理の完了条件】

A. 必達（どの構成でも）
□ 主要箇所の生 hex 直書きが 0（Core トークンの var(--...) 参照に置換し、残存をコード検索で確認）
□ 状態色（正常/警告/危険 等）が Core の status トークンを参照している
□ ブランド色が Core の signature を参照している（直書きの主色が残っていない）
□ 整理後も画面表示が崩れていない（ビルド/VRT が無い構成では目視で確認）

B. 任意（モダンビルド構成がある場合のみ）
□ npm run build（または同等）が成功する
□ 生 hex 自動ガード（check:rawhex 等）が緑
□ VRT がベースライン一致、または意図した差分のみ

【完了報告のしかた】
- A 全項目 ✓ が完了条件。B は構成に無ければ「不適用」と明記してよい（未完了扱いにしない）。
- 各項目に ✓ / ✗ / 不適用 と根拠を添える。✗ が残れば「未完了」とし残作業を箇条書きに。`;

const T1_TEXT =
`あなたは既存リポジトリのスタイル現状を診断するアシスタントです。
実際にコードを検索して（grep / ripgrep 等を使い）、推測ではなく実数で報告してください。
修正はまだ行わないでください。

【集計する項目】
1. 生 hex 直書き（例 #1A2B3C）の出現数と、最頻出の色・出現箇所トップ5
2. インラインの arbitrary 色（Tailwind の [#...] 記法等）を含むファイル数と一覧
3. 状態色（正常/遅延/運休 など製品の意味的な色）のトークン化状況（直接色かトークン参照か）
4. 採用しているビルド/スタイル基盤（例 Vite / Tailwind v4 / shadcn 等）
5. 既に独自のデザインシステム（トークン/spec/preview）を内蔵しているか。あれば所在

【出力形式】
- 1〜5を表で。数値は実数で（検索できなかった項目は「未取得」と明記）。
- 最後に「整理の主戦場」を3行で要約（どこに生 hex が集中し、何を semantic 化すべきか）。`;

const T3_AI_TEXT =
`あなたは取り込まれた Core ファイルが正しく配置・参照されているか確認します。

【確認する項目】（ターミナル + DevTools で自動チェック）
1. vendor/core/primitives.css と semantic.css が存在するか
   → ls vendor/core/
2. エントリ CSS に Core の @import が記載されているか
   → grep "@import.*vendor/core" （入口CSSのパス）
   → 以下が記載されていること：
      @import "../../vendor/core/primitives.css";
      @import "../../vendor/core/semantic.css";
3. ブラウザコンソールで構文エラー（赤 ×）がないか
   → DevTools Console を確認
4. CSS 変数が定義されているか
   → DevTools → Elements → :root セクションで以下が見えること：
      --color-signature-base, --color-signature-light
      --color-semantic-brand-primary, --color-semantic-bg-canvas
      等

【出力形式】
✅ / ❌ / 不適用 で各項目を報告し、項目ごとに簡潔に根拠を添える。
すべて ✅ なら「Core import 完了」と判定。
❌ があれば③ 入口 CSS に取り込む（前ステップ）を再確認。`;

const T4_AI_TEXT =
`置換が完了したファイルで、「生hex がすべて 0 になったか」と「置換の完全性」を確認します。

【確認する項目】（ターミナル + 検索で自動チェック）
1. 対象ファイル群に「生の hex 色コード」が残っていないか
   → grep -r “#[0-9a-fA-F]\{3,6\}” <対象ファイル群> | grep -v “vendor/core\|node_modules\|生成物の出力先”
   → 結果にカラーコード（#FFF・#123ABC 等）が出ていないこと（CSS コメント内の例示は除く）

2. var(--signature-*) / var(--status-*) への置換が完了しているか
   → grep -r “var(--signature-\|var(--status-” <対象ファイル群> | wc -l
   → 置換前（T1）に得た「生hex の出現数」に対応する var(...) が同数以上見える（すべて寄せ先が当たったか）

3. 製品ローカルトークン（--brand-accent 等）は正しく定義されているか
   → grep -r “--brand-\|--btn-” <対象ファイル群> | grep -E “:\s*#[0-9a-fA-F]”
   → 製品ローカル色が存在する場合、定義（色値を記載）が存在すること。使用側と定義側の両方が見える。

4. グレー・白・中立色は Core semantic.css のトークン経由か
   → grep -r “#[89a-fA-F]{3}\|#[89a-fA-F]{6}\|#fff\|#000\|#gray\|#grey” <対象ファイル群>
   → グレー/白/黒がベタ書き（生hex）でなく、var(--color-neutral-* 等）経由になっているか（gray 値によっては Core で定義済み）

【出力形式】
✅ / ❌ / ⚠ で各項目を報告。
- ✅＝置換完全（その項目は完了）
- ❌＝失敗・手動修正が必要（理由と対象ファイル・行番号を示す）
- ⚠＝確認が要る（例：製品ローカル色の定義位置を確認・人間が最終判定）

「生hex 0」達成で「Core トークンへの寄せ完了」と判定。`;

const T4_CHECK_TEXT =
`置換コード（ターミナルで git diff や build 出力）と、実装画面（ブラウザ表示）の両面で確認します。

【ビジュアル確認項目】
1. 背景色・テキスト色・ボーダー色が表示されているか（置換後も色が効いているか）
2. 色が意図通りに見えているか（誤った色には寄せていないか・例：エラーが緑になっていないか）
3. コンポーネント境界（ボタン・カード等）が正常に見えているか、色が崩れていないか
4. グレーアウト・無効化（opacity・disabled）状態の表現が保持されているか
5. Console タブで新しいエラー（赤 ×）がないか

【ビルド確認項目（構成によって）】
- npm run build / yarn build 等で成功しているか（CSS シンタックスエラーなし）
- ビルド後の CSS ファイルで --signature-* / --status-* が確認できるか（gzip 前）

【承認判定】
上記すべてが ✓ なら「置換完了」。異なる色に見える・崩れている等があれば AI に修正指示（例：「このボタンは warning なのに danger の赤になっているから修正」）。`;

const T5_DEVICE_CONTEXT_CHECK =
`デバイスコンテキストを明確にします。
形態最適化は「デバイスタイプ」により適用する Core スケールが異なります。
下記から対象を判定してください。

【デバイスコンテキスト判定】

1. Web/Mobile アプリケーション
    対象：モダンビルド構成（Vite/webpack）またはレガシー（素 HTML/CSS）の Web アプリ・スマートフォンアプリ
    視認距離：30〜70cm（手持ち・デスク）
    適用スケール：Core DS 標準（--font-size-xs～lg、最大 32px）
    形態最適化：色置換（T4）後の形態を Core 標準に寄せるフロー

2. Large Display サイネージ
    対象：立位・遠距離視認が前提の大型ディスプレイ（駅・空港・施設案内）
    視認距離：3〜5m（遠距離）
    適用スケール：Large Display 拡張（--font-size-ld-sm～2xl、36〜72px）
    形態最適化：Web/Mobile スケールは適用不可。コンテキスト別スケール採用

3. Hybrid（レスポンシブ対応）
    対象：Web/Mobile と Large Display の両コンテキストに対応するコンポーネント
    視認距離：ビューポート幅・メディアクエリで切り替え
    適用スケール：両スケールセットを並存（@media (min-width: ...) で条件分岐）
    形態最適化：ビューポート別（mobile / tablet / large-display）の修正スコープを明確化`;

const T5_FORM_AI_TEXT =
`あなたは既存リポジトリのコンポーネント形態を診断するアシスタントです。
Core DS の標準トークン（spacing・typography・radius）に照らし、現状の形態を計測・列挙してください。
修正はまだ行わないでください（診断のみ）。

【前提】T5_DEVICE_CONTEXT_CHECK で「Web/Mobile」と判定されたコンテキストの診断を行う。
Large Display または Hybrid の場合は別途「T5_FORM_AI_TEXT_LD」を参照。

【計測する項目】（既存コンポーネント群を対象）
1. ボタン形態
   - 実装済みのボタンサイズ一覧（例 small/medium/large、またはピクセル値で列挙）
   - 現在の height・padding・font-size・border-radius
   - 各サイズが何個使われているか（重複集約）

2. カード・コンテナ形態
   - 実装済みのカード padding・margin・border-radius
   - 背景色・境界線の指定方式（hex/トークン参照か）
   - 複数の padding パターンがあればすべて列挙

3. テキスト・タイポグラフィ
   - 実装済みの見出し（h1-h6 等）の font-size・font-weight・line-height
   - 本文・ラベル・キャプションの font-size・font-weight
   - 全パターンを表で（重複削除後）

4. 状態表現（hover・disabled 等）
   - opacity / scale / background-color の変更パターン
   - 一貫性があるか（ボタンと入力フィールドで異なっているか等）

【出力形式】
1〜4 をそれぞれ表で出力。実装ファイルと行番号を含める。
最後に「形態の主課題」を3行で要約（何が Core 標準と大きく外れているか）。`;

const T5_FORM_AI_TEXT_LD =
`Large Display サイネージのコンポーネント形態を診断します。
Core DS Large Display スケール（--font-size-ld-sm～2xl、36～72px）に照らし、現状の形態を計測・列挙してください。
修正はまだ行わないでください（診断のみ）。

【計測する項目】（Large Display 視認距離 3-5m）
1. ボタン形態
   - 現在の height・padding・font-size・border-radius
   - 視認距離を踏まえた相対サイズ（ビューポート幅に対する %、または最小文字高 mm 単位）
   - サイズパターン一覧（重複集約）

2. テキスト・タイポグラフィ
   - 見出し：現在の font-size・font-weight・line-height
   - 本文・ラベル：同上
   - Web/Mobile スケール（--font-size-* 11〜32px）を使用している部分と、カスタム値の混在を確認
   - 全パターンを表で（重複削除後）

3. コンテナ・カード形態
   - padding・margin・border-radius
   - 視認距離を踏まえた相対値（em / vw 等）が含まれているか

4. 状態表現
   - Large Display に適した状態表現（opacity・色・サイズ変更）

【出力形式】
1～4 をそれぞれ表で出力。実装ファイルと行番号を含める。
最後に「Large Display 形態の主課題」を 3 行で要約。
Web/Mobile スケール混在の有無が特に重要です。`;

const T5_FORM_CHECK_TEXT =
`形態診断結果と Core DS 標準を見比べ、以下を確認します。

【確認項目】— AI 出力 vs Core 標準
1. ボタンサイズの統一度
   - AI 出力：実装済みサイズパターン数
   - Core 標準：--space-* と --font-size-* の組み合わせ。「small/medium/large」のような標準サイズセットがあるか
   - 判定：実装パターンが多すぎないか？（3〜4 種程度が目安）

2. カード余白（padding/margin）の統一度
   - AI 出力：実装済み padding パターン一覧
   - Core 標準：--space-2/3/4/5/6 の組み合わせ（8px/12px/16px/20px/24px）
   - 判定：実装が Core spacing スケールに沿っているか？（例：padding 18px は非標準）

3. タイポグラフィの統一度
   - AI 出力：実装済み font-size パターン一覧
   - Core 標準：--font-size-sm(13px)～lg(18px) のセット + --lh-jp-body(1.75)
   - 判定：font-size が Core スケール（11/13/14/15/18/22/28/32px）に乗っているか？line-height が日本語標準（1.75/1.85）か？

4. Radius の統一度
   - AI 出力：実装済み border-radius 値一覧
   - Core 標準：--radius-sm(6px)～2xl(28px)
   - 判定：独自の radius 値（例 10px）を使っていないか？

5. 状態表現の一貫性
   - AI 出力：hover・disabled・active の表現方式一覧
   - Core 標準：--state-hover-overlay / --state-pressed-overlay 等
   - 判定：コンポーネント間で異なる表現をしていないか？

【承認判定】
上記 1〜5 について：
- ✓ Core 標準に揃っている（大きな修正不要）
- △ 一部外れているが、修正スコープは明確（具体例列挙）
- ✗ 多くが非標準（大規模最適化が必要・別途スケジュール検討）

を判定し、修正スコープを決定。`;

const FORM_OPTIMIZATION_RULES_WEB_MOBILE =
`形態最適化は「現状を計測 → Core 標準と比較 → 書き換え」の機械的フロー。
（カラーは意味的・文脈依存の判定対象であり、UI要素の役割や状態を考慮した解釈が必要となるが、
　形態は定量的・決定論的な判定対象であり、数値比較による自動判定が可能なため。）

【Web/Mobile コンテキスト】
- 適用スケール：Core DS 標準（--font-size-xs～lg 最大 32px、--space-1～16 4px ステップ、--radius-sm～2xl）
- 視認距離：30-70cm（通常の Web・Mobile デバイス）

【判定フロー（3 つの観点）】

❶「Core 標準サイズに統一できるか」
  - ボタン size="small/medium/large" → Core spacing + font-size 標準の組み合わせか
    例：--font-size-sm(13px) + --space-2(8px) / --space-3(12px)
  - カード padding --space-4(16px) / --space-5(20px) 等か
  - タイポグラフィ font-size が --font-size-xs(11px)～lg(18px) スケールか
  - line-height が --lh-jp-body(1.75) / --lh-jp-headline(1.4) か
  - 判定：YES → Core トークン参照に置換。NO → 次の ❷ へ。

❷「複数パターンが存在するが、うち標準寄りの形態があるか」
  - 例：ボタンが「14px/16px/18px」3 種類。うち「14px・16px」は Core 標準か
  - 判定：YES → 標準寄りのサイズへ統一。NO → 次の ❸ へ。

❸「製品固有の形態として保持する必要があるか」
  - 例：「大型アラートは 24px の見出し」など、製品の要件・UI の理由がはっきりしているか
  - 判定：YES → 製品ローカル CSS 変数化（--alert-heading-size など）。NO → Core 標準値で代用。

【修正例（Web/Mobile 版）】

修正前：\`.btn-small { font-size: 14px; padding: 8px 12px; }\`
修正後：\`.btn-small { font-size: var(--font-size-sm); padding: var(--space-2) var(--space-3); }\`
判定：❶ に該当・Core トークン参照に統一。

修正前：\`.card { padding: 20px; margin-bottom: 18px; line-height: 1.5; }\`
修正後：\`.card { padding: var(--space-5); margin-bottom: var(--space-4); line-height: var(--lh-jp-body); }\`
判定：❶ に該当・padding 20px(--space-5) / margin 18px(非標準)→16px(--space-4) に調整。line-height を日本語標準に統一。

修正前：\`.title { font-size: 20px; font-weight: bold; }\`
修正後：\`.title { font-size: var(--font-size-base); font-weight: 600; line-height: var(--lh-jp-headline); }\`
判定：❶ に該当・タイポグラフィを標準化。font-size 20px は製品固有の見出しなら --headline-md へ変数化検討。`;

const FORM_OPTIMIZATION_RULES_LD =
`形態最適化は「現状を計測 → Core 標準と比較 → 書き換え」の機械的フロー。
（カラーは意味的・文脈依存の判定対象であり、UI要素の役割や状態を考慮した解釈が必要となるが、
　形態は定量的・決定論的な判定対象であり、数値比較による自動判定が可能なため。）

【Large Display コンテキスト】
- 適用スケール：Large Display 拡張（--font-size-ld-sm～2xl 36～72px）
- 視認距離：3-5m（駅・空港・施設サイネージ・大型ディスプレイ）
- ⚠️ 注意：Web/Mobile スケール（32px 以下）は採用禁止。Large Display 視認距離に合わせた値を選択。

【判定フロー（3 つの観点・Large Display 版）】

❶「Large Display 標準サイズに統一できるか」
  - ボタン size="small/medium/large" → Large Display spacing + font-size 標準の組み合わせか
    例：--font-size-ld-sm(36px) + --space-ld-2(16px) / --space-ld-3(24px) 等
  - カード padding --space-ld-4(32px) / --space-ld-5(40px) 等か
  - タイポグラフィ font-size が --font-size-ld-sm(36px)～2xl(72px) スケールか
  - line-height が --lh-jp-body(1.75) か（Large Display でも 1.75 推奨）
  - 判定：YES → Large Display トークン参照に置換。NO → 次の ❷ へ。

❷「複数パターンが存在するが、うち標準寄りの形態があるか」
  - 例：見出しが「40px/48px/56px」3 種類。うち「48px・56px」は Large Display 標準か
  - 判定：YES → 標準寄りのサイズへ統一。NO → 次の ❌ へ。

❌「Web/Mobile スケール（32px 以下）が混在していないか【必須チェック】」
  - 現状で 18～30px の値が残っていないか（Web/Mobile スケール）
  - Large Display サイネージで 18px テキストは視認不可
  - 判定：YES（混在あり）→ 全て Large Display スケール（36px～）に置換が必須。

【修正例（Large Display 版）】

修正前：\`.title { font-size: 24px; padding: 10px 15px; }\`  ← Web/Mobile スケール
修正後：\`.title { font-size: var(--font-size-ld-md); padding: var(--space-ld-2) var(--space-ld-3); }\`  ← 36-72px スケール
判定：❌ に該当・Web/Mobile スケール除去・Large Display 統一。

修正前：\`.card { font-size: 18px; line-height: 1.4; }\`  ← 危険：18px は Large Display で視認不可
修正後：\`.card { font-size: var(--font-size-ld-sm); line-height: var(--lh-jp-body); }\`  ← 36px に上げる
判定：❌ に該当・スケール置換が必須。

修正前：\`h2 { font-size: 28px; margin: 8px 0; }\`  ← Web/Mobile スケール混在
修正後：\`h2 { font-size: var(--font-size-ld-lg); margin: var(--space-ld-1) 0; }\`  ← 56px + 8px→12px（最小スペーシング）
判定：❌ に該当・スケール統一・margin も Large Display スケール（--space-ld-*）に合わせ。

【本テンプレートの出力範囲（手順 3）】
本ルールは「各項目ごとの修正必要性と方針」を判定します。
複数項目にまたがる「修正計画」（フェーズ分類・優先度・時間見積・依存関係）は
手順 4 で人間が判断します。テンプレートには含まれません。
`;

const FORM_OPTIMIZATION_RULES_HYBRID =
`形態最適化は「現状を計測 → Core 標準と比較 → 書き換え」の機械的フロー。
（カラーは意味的・文脈依存の判定対象であり、UI要素の役割や状態を考慮した解釈が必要となるが、
　形態は定量的・決定論的な判定対象であり、数値比較による自動判定が可能なため。）

【Hybrid コンテキスト】
- 適用スケール：両スケールセット（Web/Mobile と Large Display 両対応）
- 実装方法：@media (min-width: ...) で条件分岐
- 視認距離別対応：30-70cm（Web/Mobile）と 3-5m（Large Display）の両立

【判定フロー（Hybrid 専用）】

🔀 「両コンテキストの修正スコープを並べて比較」
  1. Web/Mobile スケール（11～32px）と Large Display スケール（36～72px）の両方が存在するか
  2. 各デバイスタイプで Core 標準への準拠度を判定（Web/Mobile 版・Large Display 版のフロー参照）
  3. ビューポート別に修正方針を決定
     - Small（～768px）：Web/Mobile スケール（--font-size-xs～lg 等）
     - Large（768px～）：Large Display スケール（--font-size-ld-sm～2xl 等）
  4. @media ブレークポイントはデザイン仕様書で確認

【修正例（Hybrid 版）】

修正前（全サイズ共通）：
\`\`\`css
.title { font-size: 20px; padding: 12px 16px; }
.label { font-size: 14px; margin: 4px 0; }
\`\`\`

修正後（Hybrid 対応）：
\`\`\`css
/* Web/Mobile: 小画面（～768px） */
.title {
  font-size: var(--font-size-base);  /* 15px */
  padding: var(--space-3) var(--space-4);  /* 12px 16px */
  line-height: var(--lh-jp-headline);
}
.label {
  font-size: var(--font-size-sm);  /* 13px */
  margin: var(--space-1) 0;  /* 4px 0 */
}

/* Large Display: 大画面（768px～） */
@media (min-width: 768px) {
  .title {
    font-size: var(--font-size-ld-md);  /* 44px */
    padding: var(--space-ld-3) var(--space-ld-4);  /* 24px 32px */
  }
  .label {
    font-size: var(--font-size-ld-sm);  /* 36px */
    margin: var(--space-ld-1) 0;  /* 12px 0 */
  }
}
\`\`\`

判定：両フロー適用・ブレークポイント 768px で切り替え・スケール混在なし。

【修正順序】
1️⃣ Web/Mobile スケール側を先に統一（小画面は通常の使用頻度が高い）
2️⃣ Large Display スケール側を追加（@media で条件分岐）
3️⃣ ビューポート別の状態表現・トークン参照を確認`;

const T5_FORM_INSTRUCTION_EXAMPLE =
`【修正対象】上記「人間による最適化設計」で確定したスコープを AI に伝える。例：

修正対象コンポーネント：
1. .btn-small / .btn-medium / .btn-large
   修正内容：Core の spacing + typography トークンで統一
   修正前：.btn-small { font-size: 14px; padding: 8px 12px; }
   修正後：.btn-small { font-size: var(--font-size-sm); padding: var(--space-2) var(--space-3); }

2. .card { padding: 20px; margin-bottom: 18px; }
   修正内容：padding を Core --space-5 に統一・margin を --space-4(16px) に調整

3. h2 { font-size: 20px; line-height: 1.4; }
   修正内容：line-height を日本語標準 --lh-jp-headline に統一

以降、既存ファイルの生の px 値を var(--...) に置換し、VRT ベースライン再生成・a11y 確認を行ってください。`;

const CH5_AI_TEXT =
`値は手で決めません。章5 ② で生成した Core のトークンを「使って」置換に徹します（再生成しない）。

前提（ここを先に固定する）：
- 章5 ② で palette-gen 実行済み（seed=主ブランド色）。③ で入口 CSS に @import 済み。以降は --signature-* / --status-* を参照するだけ。
- 入口 CSS は③で @import を追加した「既存のファイル」。新しい入口 CSS は作らない・アプリ構成（フォルダ移動等）も変えない。
- 置換対象は章4 診断(T1)で生 hex が挙がった既存ファイル群（例：style.css など）。
- 生成物の置き場（例 src/styles/generated）は palette の出力先であって、入口 CSS でも新しいソースでもない。

1) ブランド（signature）
   - seed の見極め：章4 診断(T1)の最頻出色のうち、ロゴ/ヘッダ/主要ボタンなど”ブランドの意図”で
     使われている色＝主ブランド色（②でこの色を seed に生成済み）。
   - 生成された --signature-base/light/dark/... を使う（light/dark を手で選ばない・AA 保証）。

2) status（success/warning/danger）
   - 自分で選ばない。生成された status.css の --status-* を使う（AA 保証）。

3) 使い方（モダン/レガシーで異なる・生成物は同じ）
   - モダン構成（Vite/Tailwind 等）＝ブリッジ（@theme）経由でユーティリティ（bg-primary 等）に反映。
   - レガシー構成（素の CSS）＝CSS に直接 var(--signature-base) / var(--status-danger) と書く。

4) 意味分化（重要・最終判定ルール）

   【palette-gen が生成する色】
   - signature（seed=主ブランド色から自動生成）：--signature-base / light / dark / tint / shadow / on + 色相 ramp（50-900）
   - status（WCAG AA保証・3種）：--status-success / warning / danger（各 surface / tint / on）
   - これ以外の色は palette-gen では生成されない。

   【生hex → 寄せ先の判定フロー】

   ❶ 「本来ブランド色のはずだが、seed以外の色」（例：第二ブランド、CTA黄）
      → 製品ローカルトークン化（例：--brand-accent、--brand-secondary）
      ※ Core palette-gen は seed 1色からしか作らないので「寄せる」ではなく「新規定義」

   ❷ 「状態的な意味がある色」（エラー/赤、警告/黄、成功/緑 等）
      → status-danger / warning / success へ寄せてOK
      ※ 実色が異なっても「エラー＝危険」の意味なら status-danger で統一

   ❸ 「設計時の用途が不明確な色」（例：「何かのボタン」だけで用途分類なし）
      → 将来デザイン負債（廃止候補）。暫定で製品ローカル化（例：--btn-legacy-map）
        か、その色をもう使わないなら削除。置換ではなく「整理」が本来の対応。

   【具体例（Haiku テスト結果から）】
   - #ffdd00(黄CTA) → ❶。palette-gen は黄を生成しない。status-warning に寄せない → 製品ローカル --brand-accent
   - #f00(赤エラー) → ❷。「エラー表示」=状態的意味 → --status-danger へ寄せてOK
   - #91c455(緑ボタン) → ❸。「フロアマップボタン」の固有色・実際の用途が不明確 → 暫定で --btn-floormap（製品ローカル）
   - #FD7E33(オレンジリンク) → ❷。「テキストリンク」=視覚的強調・警告的 → --status-warning へ寄せてOK
   - #4C79FF・#3187D0・#87ceeb(青) → ❸。用途が「モーダル内リンク/ボタン」で状態的意味なし → 製品ローカル --link-modal / --btn-modal-close

5) 進め方（値は決めない・確認して置換）

   1️⃣ 生hex抽出：「生hex → 現在の役割 → 推定用途」の写像表を提示（自分で作成）
   2️⃣ 判定：上の ❶❷❸ フローで、各色の寄せ先を決める（人が判断＝デザイン意思確認）
   3️⃣ 承認：エンジニア/デザイナーに「これで寄せていいか」確認
   4️⃣ 置換：承認後、既存ファイルの生hex を var(--...) に置換（主要ファイルから）

   - 目的は既存ファイルの色をトークンへ置換すること（このガイドを CLAUDE.md に転記するのが目的ではない）。
   - ブリッジ（figuds-bridge.css 等）は人が作成（②で生成済みトークン値を参照するだけ・AI の再生成なし）。`;

/** シナリオ①：章立て（フロー）データ。各 block は {k:種別,...}。固有カラーコードは置かない。 */
const CH_EXISTING = [
  { n: 0, title: '全体の流れ（まず俯瞰）', locs: [],
    blocks: [
      { k: 'p', t: '既存アプリを壊さず FIG Core DS のスタイルへ寄せ、最低でも自社デザイン資産化を達成する。玄人はこの俯瞰で足り、各章は下へスクロールするほど詳細になる。' },
      { k: 'ol', items: [
        '章1 AI-DLC をクローン（環境整備）',
        '章2 既存リポジトリの取り込み・配置（＋Git 整備チェック）',
        '章3 FIG-UDS（最新の正解）を確認できるようにする',
        '章4 既存スタイルの現状診断（AI 指示テンプレ＋完了条件）',
        '章5 Core を取り込み、トークンの正典に従う（signature/status を生成）',
        '章6 Core トークンへ寄せる（→ 移行ガイド・整備中）',
      ] },
      { k: 'note', t: '新規開発（既存コードが少ない）の場合は章2を飛ばしシナリオ②へ。章4以降は構成（モダン／レガシー）に応じて読み替える。' },
    ] },
  { n: 1, title: 'AI-DLC をクローン（環境整備）', locs: ['terminal', 'github'],
    blocks: [
      { k: 'h', t: '目的' },
      { k: 'p', t: 'AI-DLC のワークフロー規約を AI アシスタントに読み込ませ、以降を AI-DLC の作法で進められるようにする。' },
      { k: 'h', t: '前提' },
      { k: 'ul', items: ['git が使える。', 'AI コーディングアシスタント（Claude Code・Kiro・Amazon Q・Cursor・Cline・Copilot 等）が手元にある。'] },
      { k: 'h', t: '手順' },
      { k: 'cmd', loc: 'terminal', label: '製品リポジトリの外の作業フォルダで取得', body: 'git clone https://github.com/awslabs/aidlc-workflows.git' },
      { k: 'ul', items: ['取得物の aidlc-rules/ に aws-aidlc-rules/（core 規約）と aws-aidlc-rule-details/（詳細）があることを確認する。', '※公式手順は Releases の ai-dlc-rules-v<版>.zip を DL→展開でも可。'] },
      { k: 'cmd', loc: 'terminal', label: '製品リポジトリのルートで規約を配置（Claude Code 例・PowerShell）', body:
'Copy-Item "<クローン先>\\aidlc-rules\\aws-aidlc-rules\\core-workflow.md" ".\\CLAUDE.md"\n' +
'New-Item -ItemType Directory -Force -Path ".aidlc-rule-details"\n' +
'Copy-Item "<クローン先>\\aidlc-rules\\aws-aidlc-rule-details\\*" ".aidlc-rule-details\\" -Recurse' },
      { k: 'note', t: 'Kiro=.kiro/steering/、Amazon Q=.amazonq/rules/ など置き場はアシスタント別（AI-DLC README 参照）。' },
      { k: 'h', t: '確認' },
      { k: 'ul', items: ['アシスタントのルール／コンテキスト一覧に core-workflow が現れる。'] },
    ] },
  { n: 2, title: '既存リポジトリの取り込み・配置', locs: ['github', 'terminal'],
    blocks: [
      { k: 'h', t: '目的' },
      { k: 'p', t: '整える対象の既存アプリを、AI に渡せる形で手元に用意する。（新規開発なら本章は不要→シナリオ②）' },
      { k: 'h', t: '前提（Git 整備チェック）' },
      { k: 'check', items: [
        '対象アプリが GitHub 上にリポジトリとして存在する（無ければ先に作成）。',
        '対象リポジトリの閲覧・変更権限がある。',
        '「修正前」の基準ブランチを確認した（default＝最新とは限らない）。',
        '作業ブランチを切って before を温存する。',
      ] },
      { k: 'h', t: '手順' },
      { k: 'cmd', loc: 'terminal', label: '章1の AI-DLC とは別フォルダにクローン（マルチレポ＝AI には Core＋対象製品のみ）', body: 'git clone <あなたの既存アプリのリポジトリURL>' },
      { k: 'cmd', loc: 'terminal', label: '作業ブランチを切る（現状を before として温存）', body: 'git switch -c figuds-adoption' },
      { k: 'note', t: '「修正前」がどのブランチか不明なら、git branch -a と各 git log で“濃い”最新を確認する。' },
      { k: 'links', items: [{ label: 'GitHub 操作ガイド（clone / ブランチ / PR の再現手順）', route: '#/usage/github-operations' }] },
      { k: 'h', t: '確認' },
      { k: 'ul', items: ['対象アプリに .git があり、作業ブランチ上にいる（git status）。'] },
    ] },
  { n: 3, title: 'FIG-UDS（最新の正解）を確認できるようにする', locs: ['portal', 'github'],
    blocks: [
      { k: 'h', t: '目的' },
      { k: 'p', t: '整える“目標＝最新の正解”を、評価者（人）が視覚的に確認できるようにする。あわせて章5で取り込む Core の所在を控える。' },
      { k: 'note', t: '生成AI が従う厳密な根拠（トークンの数値・spec・lint ルール）は、章5で Core を取り込んだ実体ファイルから与える。本章は人の視覚確認用。' },
      { k: 'h', t: '手順' },
      { k: 'cmd', loc: 'portal', label: 'ポータル（公開サイト）を開き、最新の正解の見た目をざっと眺める', body: 'https://takahashiman.github.io/aidlc-workflows/' },
      { k: 'cmd', loc: 'github', label: '章5で取り込む Core（FIG-UDS）の所在を控える', body: 'GitHub: https://github.com/takahashiman/FIG-Universal-Design-System\n（ローカルに既にある場合のパス例: ../FIG-Universal-Design-System）' },
      { k: 'note', t: 'これらの URL は現状の公開（暫定）参照。将来、社内 Git／社内サイトへ移設予定。' },
      { k: 'h', t: '確認' },
      { k: 'ul', items: ['ポータルで“正解”の雰囲気を掴め、章5で取り込む Core の所在（URL かパス）を控えてある。'] },
    ] },
  { n: 4, title: '既存スタイルの現状診断', locs: ['ai'],
    blocks: [
      { k: 'h', t: '目的' },
      { k: 'p', t: '整備前に既存スタイルを棚卸しして“整理の主戦場”を数値で把握。あわせて完了条件を先に共有し、AI が勝手に完了扱いしないようにする。' },
      { k: 'h', t: '手順' },
      { k: 'p', t: '① まず完了条件（下記）を AI に伝える。' },
      { k: 'ai', label: '完了条件（T2）— 先に共有', body: T2_TEXT },
      { k: 'p', t: '② 続けて診断指示（下記）を貼り、現状診断を依頼する（この段階では修正させない）。' },
      { k: 'ai', label: '現状診断（T1）', body: T1_TEXT },
      { k: 'h', t: '確認' },
      { k: 'ul', items: ['「整理の主戦場」3行サマリと生 hex 実数・対象ファイル一覧が得られている。', '完了条件の各項目について現状の達成/未達（✓/✗/不適用）が見えている。'] },
    ] },
  { n: 5, title: 'Core を取り込み、トークンの正典に従う', locs: ['terminal', 'github', 'ai'],
    blocks: [
      { k: 'h', t: '目的' },
      { k: 'p', t: 'Core(FIG-UDS) を取り込み、ブランド(signature)・状態色(status) を“手で決めず”生成器に出させる。AI はこの章で入る実体ファイルの数値・ルールを正典に作業する。' },
      { k: 'note', t: 'この章は ①Core を取り込む → ②パレットを生成 → ③入口 CSS に取り込む、の3手順。①②は構成共通、③の「CSS への書き方」だけがモダン/レガシーで分かれる（最後にタブで選ぶ）。' },
      { k: 'h', t: '① Core を取り込む（構成共通）' },
      { k: 'hint', summary: 'ヒント：このコマンドはどこで実行する？', blocks: [
        { k: 'ul', items: [
          '章2でクローンした「作業対象アプリ」の repo root（.git がある階層）で実行する。AI-DLC のクローンや Core 本体の中では実行しない。',
          'vendor/ は事前作成不要（submodule add が作る）。',
        ] },
      ] },
      { k: 'cmd', loc: 'terminal', label: 'Core を submodule で pin', body:
'git submodule add https://github.com/takahashiman/FIG-Universal-Design-System.git vendor/core\n' +
'git -C vendor/core checkout <参照する Core リリースタグ>\n' +
'git submodule update --init --recursive' },
      { k: 'hint', summary: 'ヒント：タグ pin は必須？（最新を使う場合）', blocks: [
        { k: 'p', t: 'submodule add した時点で Core デフォルトブランチの最新コミットが取得され、親はその SHA を記録する。checkout <タグ> を省いても“追加時点の最新”に pin されるだけで、自動追従にはならない（サブモジュールに「常に最新」はなく、更新は毎回手動で pin し直す）。' },
        { k: 'ul', items: [
          'タグ pin あり＝どの版か明確・再現性◎（CORE-DS-VERSION／版ダッシュボード／CI 検査と整合＝本システム標準）。',
          'checkout 省略＝追加時点の先端コミットに固定（これも pin）。最新を追うなら更新時に vendor/core で fetch→checkout→親で commit が要る。',
        ] },
        { k: 'note', t: 'ポータル自身は rolling（ビルドで core 追従）だが、製品アプリは submodule タグ pin が標準。' },
      ] },
      { k: 'hint', summary: 'ヒント：サブモジュールを消したいときは？', blocks: [
        { k: 'cmd', loc: 'terminal', label: '', body: 'rm -Recurse -Force .git/modules/vendor/core'},
      ] },
      { k: 'h', t: '② パレット（signature/status）を生成（構成共通）' },
      { k: 'cmd', loc: 'terminal', label: 'signature/status を生成（seed=主ブランド色／章4 T1 で特定）', body:
'node vendor/core/tools/palette-gen/generate.mjs --seed=<#主ブランド色のカラーコード> --out src/styles/generated' },
      { k: 'hint', summary: 'ヒント：palette-gen はビルドに必要？（ビルドの無いサイトでも使える）', blocks: [
        { k: 'ul', items: [
          'palette-gen は node の“一回限りの生成ツール”。サイトの常時ビルドに組み込む必要はない。',
          'ビルドがある構成（Vite 等）は prebuild に入れて自動生成も可。',
          'ビルドが無い構成（素の HTML）は開発機で1度実行→生成 CSS をコミット。node が無ければ別マシン/CI で生成して CSS を受け取る。',
          '--out は出力先。次の③の @import パスはこの出力先を指すように合わせる。',
        ] },
      ] },
      { k: 'h', t: '③ 入口 CSS に取り込む（ここだけ構成で分かれる）' },
      { k: 'hint', summary: 'ヒント：入口 CSS ってどのファイル？（探し方・両構成共通）', blocks: [
        { k: 'p', t: '入口 CSS＝アプリが最初に読み込む“大元の CSS ファイル”。ここに @import を足すとサイト全体に効く。「最後に（後勝ち）」＝既存の読み込みより後ろに置くと、あなたのブリッジが優先される（CSS は後に書いた方が勝つ）。' },
        { k: 'h', t: '探し方' },
        { k: 'ul', items: [
          'アプリの入口スクリプト（src/main.tsx・src/index.js 等）が import している .css を探す（例 import "./index.css"）。それが入口 CSS。',
          '素の HTML サイトなら、index.html の <link rel="stylesheet"> で読み込んでいる CSS（例 style.css・css/main.css）。',
          'ファイル名の目安：index.css / main.css / globals.css / style.css / app.css。',
        ] },
        { k: 'aitip', t: '迷ったら生成AI に「このプロジェクトでグローバルに読み込まれる入口 CSS はどれ？」と聞けば特定できる（最短）。' },
        { k: 'h', t: '構成別の例' },
        { k: 'ul', items: [
          'Vite + React/Tailwind → src/index.css（src/main.tsx が import）',
          'Create React App → src/index.css（src/index.js が import）',
          'Vue → src/assets/main.css（src/main.js が import）',
          'Next.js → app/globals.css（layout で import）',
          '素の HTML/CSS（レガシー）→ index.html が <link> で読む CSS（例 style.css）',
        ] },
        { k: 'note', t: '@import は CSS ファイルの先頭（他の規則より前）に書く決まり。既存変数を上書きするブリッジ等で「後勝ち」させたい時は、それを import 群の最後に置く。新しい Core トークンを足すだけなら順序は気にしなくてよい。' },
      ] },
      { k: 'note', t: 'ここから先（入口 CSS への書き方）だけ構成で分かれる。タブで選ぶ（両方はやらない・切り替えると中身が変わる）。' },
      { k: 'tabs', label: '入口 CSS への書き方', items: [
        { id: 'modern', label: 'モダン構成（Vite / Tailwind 等）', blocks: [
          { k: 'note', t: 'Tailwind/shadcn 等は、Core トークンを @theme でフレームワークのテーマ変数へ橋渡し（ブリッジ）する。これでユーティリティ（bg-primary 等）が Core 由来になる。↓は入口 CSS ファイルに書く内容（ターミナルではない）。' },
          { k: 'cmd', loc: 'file', label: '入口 CSS に追記（最後にブリッジを後勝ちで）', body:
'/* パスは「入口 CSS から見た相対」。下は入口CSSが src/ 配下の例。配置が違えば ../ の数を直す（上のヒント参照） */\n' +
'@import "../../vendor/core/primitives.css";\n' +
'@import "../../vendor/core/semantic.css";\n' +
'@import "../styles/generated/signature.css";   /* ②の --out で出した場所 */\n' +
'@import "../styles/generated/status.css";\n' +
'/* ...既存テーマ/Tailwind 読込... */\n' +
'@import "./figuds-bridge.css";   /* ← 必ず最後・@theme で var() 写像 */' },
        ] },
        { id: 'legacy', label: 'レガシー構成（素の HTML / CSS）', blocks: [
          { k: 'note', t: '素の CSS はブリッジ不要。Core と生成パレットを取り込み、以降は生 hex を直接 var(--...) に置換する。↓は入口 CSS ファイルに書く内容（ターミナルではない）。' },
          { k: 'cmd', loc: 'file', label: 'サイトの入口 CSS に追記（素の @import・var() 直参照）', body:
'/* パスは「入口 CSS から見た相対」。下は入口CSSが css/style.css の例。配置が違えば ../ の数を直す（上のヒント参照） */\n' +
'@import "../vendor/core/primitives.css";\n' +
'@import "../vendor/core/semantic.css";\n' +
'@import "../src/styles/generated/signature.css";   /* ②の --out で出した #自社色 パレット（Core の tokens/ ではない） */\n' +
'@import "../src/styles/generated/status.css";\n' +
'/* 以降、生 hex を var(--signature-*) / var(--status-*) に置換していく */' },
        ] },
      ] },
      { k: 'hint', summary: 'ヒント：@import のパスが解決しない時（相対パスの数え方・両構成共通）', blocks: [
        { k: 'p', t: '@import のパスは「入口 CSS ファイルの場所」を基準にした相対パス。repo root や、コマンドを打ったフォルダが基準ではない。ここを取り違えると解決しない（最頻出の失敗）。下のコード例のパスは特定の配置を前提にした例なので、必ず自分の入口 CSS の位置に合わせて直す。' },
        { k: 'h', t: '数え方' },
        { k: 'ul', items: [
          '入口 CSS から repo root まで ../ で上がり、そこから目的ファイルへ下る。',
          '例：入口 CSS が css/style.css（root 直下の css/）なら root へは ../ 一つ → vendor/core/semantic.css は ../vendor/core/semantic.css。',
          '例：入口 CSS が src/styles/index.css（2 階層）なら root へは ../../ → vendor/core は ../../vendor/core/...。',
          '生成ファイル（signature.css/status.css）は palette-gen の --out で出した場所を指す。Core 同梱の vendor/core/tokens/signature.css（既定の teal）とは別物なので混同しない。',
        ] },
        { k: 'aitip', t: '入口 CSS と各ファイルの絶対パスを生成AI に渡し「入口 CSS から見た正しい相対 @import にして」と頼むのが最短・確実。' },
        { k: 'note', t: 'VS Code 等なら、解決できない @import は警告（赤波線）で分かる。生成ファイルをエディタで右クリック→「相対パスをコピー」も有効。ターミナル出力の .\\signature.css を Ctrl+クリックすると別の同名ファイルに飛ぶことがあるので、--out で出した実体のパスを使う。' },
      ] },
      { k: 'h', t: 'T3: Core import 準備確認チェック（構成共通）' },
      { k: 'ai', label: 'Core import 準備確認（AI が自動チェック）', body: T3_AI_TEXT },
      { k: 'h', t: '✎ 人間による確認（ビジュアル確認）' },
      { k: 'check', items: [
        'ブラウザでアプリを開く（実装 URL：例 file:/// や localhost）',
        'DevTools（F12）→ Elements → :root で CSS 変数が表示されているか',
        '背景色・テキスト色・ボーダー色が表示されているか（Core トークンが効いているか）',
        'Console タブで赤いエラー（×）がないか',
        '全体的に色が崩れていないか、期待通りに表示されているか',
      ] },
      { k: 'h', t: 'AI への指示（値は手で決めず Core に従う）' },
      { k: 'ai', label: 'Core トークンに寄せる指示（生成済みトークンを使う・テンプレ）', body: CH5_AI_TEXT },
      { k: 'h', t: '✎ 人間による確認・判定（AI の写像表を承認する）' },
      { k: 'p', t: 'AI から「生hex → 寄せ先トークン」の写像表が返ってきたら、以下を確認してから承認します。' },
      { k: 'check', items: [
        '【色の役割が正しいか】実装画面で各色がどの要素に使われているか目視確認。AI の「推定用途」が実装意図と合っているか。',
        '【寄せ先が適切か】❶❷❸フロー（テンプレ「4)意味分化」参照）に沿った判定か。特に ❸「用途不明確」の色は、デザイン意図を確認してから判定。',
        '【グレー・白・中立色】Core semantic.css で既に定義済みのトークンでカバーできるか。確認が要る場合は AI に質問。',
        '【製品ローカル色】palette-gen で生成されない色（CTA黄など）を製品ローカルトークンで新規定義する場合、命名が「将来の用途拡張」を想定しているか。',
        '【状態色の一意性】同じ意味の色が複数の hex で表現されていないか。例：「エラー」が #f00 と #DC2626 で二重定義されていないか。',
      ] },
      { k: 'p', t: '上記を確認したら「承認」を AI に返す。異なる判定が必要な場合は「理由」を添えて修正指示（例：「#87ceeb はモーダル固有色のため --modal-link で製品ローカル化」）。' },
      { k: 'table', t: 'core-ref' },
      { k: 'h', t: '確認' },
      { k: 'ul', items: [
        '生成された signature.css / status.css が取り込まれ、--signature-* / --status-* が参照できる。',
        'ブランド色・状態色を AI が手で決めず、生成器の出力（AA 保証）に従っている。',
      ] },
    ] },
  { n: 6, title: 'Core トークンへ寄せる（置換完了判定）', locs: ['ai', 'terminal'],
    blocks: [
      { k: 'h', t: '目的' },
      { k: 'p', t: '置換作業が完了したら、「生hex が本当に 0 になったか」「色の意味が保持されているか」を二段で確認し、「自社デザイン資産化」完了と判定する。' },
      { k: 'h', t: '前提' },
      { k: 'ul', items: [
        '章5 で Core 取込・パレット生成・入口 CSS @import 完了。',
        'T4 置換：既存ファイルの生 hex を var(--signature-*) / var(--status-*) へ置換済み（AI 実行）。',
      ] },
      { k: 'h', t: 'T4: 置換完了判定（AI が自動チェック）' },
      { k: 'ai', label: '置換完了判定（AI が自動チェック）', body: T4_AI_TEXT },
      { k: 'h', t: '✎ 人間による確認・判定（ビジュアル確認）' },
      { k: 'p', t: 'AI が「生hex 0」と判定したら、実装画面と git diff で以下を確認します。' },
      { k: 'check', items: [
        '【色の表示】背景色・テキスト・ボーダーが正しく表示されているか（置換後も色が効いているか）',
        '【色の意味】色が意図通りに見えているか（誤った寄せ先になっていないか・例：エラーが緑になっていないか）',
        '【レイアウト】コンポーネント・ボタン・カード等の要素が正常に見えているか、UI が崩れていないか',
        '【状態表現】グレーアウト・無効化（opacity・disabled）の表現が失われていないか',
        '【コンソール】DevTools Console に新しいエラー（赤 ×）がないか',
      ] },
      { k: 'h', t: '完了の判定' },
      { k: 'check', items: [
        'AI の T4 チェック結果がすべて ✅',
        '人間の目視確認 5 項目がすべて確認（✓）',
        '章4 T2 の完了条件 A「必達」を全て満たす（生hex 0・表示崩れなし）',
      ] },
      { k: 'p', t: '上記すべてが ✓ なら「自社デザイン資産化完了」と判定。修正が必要な場合は AI に理由を添えて指示（例：「このエラーメッセージが緑なのは間違い、--status-danger に修正」）。' },
      { k: 'h', t: '確認' },
      { k: 'ul', items: [
        '既存アプリの色が全て Core トークンに置換された（生hex 0）。',
        'ブラウザでの見た目・操作感が期待通り。',
        'コンソール・ビルドエラーなし。',
      ] },
    ] },
  { n: 6.5, title: 'コンポーネント形態の最適化', locs: ['ai', 'terminal'],
    blocks: [
      { k: 'p', t: '章6 で色の置換が完了しました。次は「コンポーネント形態（ボタンサイズ・カード余白・タイポグラフィ）を Core DS の標準に統一する」ステップです。色だけでなく形態も含めて「FIG-UDS 準拠」にすることで、初めて「自社デザイン資産化」が完全になります。' },
      { k: 'h', t: '目的' },
      { k: 'p', t: 'コンポーネント形態（ボタンサイズ・カード余白・タイポグラフィ）を Core DS の標準トークン（spacing・typography・radius）に統一し、見た目の完全準拠を達成する。' },
      { k: 'h', t: '前提' },
      { k: 'ul', items: [
        '章6「Core トークンへ寄せる（置換完了判定）」が完了（生 hex 0・T4 / T4_CHECK_TEXT 全項目 ✓）。',
        'これからのステップは、形態の最適化（色ではなく、サイズ・余白・フォント）に集中する。',
      ] },
      { k: 'note', t: 'このステップ全体を「シナリオ①-補遺」と呼びます。シナリオ①（既存アプリを整える）と「自社デザイン資産化」の間に挟まる、形態最適化のための導線です。' },
      { k: 'h', t: '✨ 重要：デバイスコンテキスト判定（新規）' },
      { k: 'p', t: '形態最適化は「デバイスタイプ」により適用する Core スケールが異なります。以下を確認してから、手順 1 に進んでください。' },
      { k: 'human', label: 'デバイスコンテキスト判定（T5_DEVICE_CONTEXT_CHECK）', body: T5_DEVICE_CONTEXT_CHECK },
      { k: 'h', t: '手順 1: コンポーネント形態の現状診断（AI 診断）' },
      { k: 'p', t: '① デバイスコンテキスト判定結果に基づき、以下のタブから該当するコンテキストを選択し、テンプレを AI に貼り付けてください。' },
      { k: 'tabs', label: 'コンテキスト別診断テンプレの選択', items: [
        { id: 'web-mobile', label: 'Web/Mobile', blocks: [
          { k: 'p', t: 'Web アプリ・スマートフォン・タブレットなど、デスク・手持ち視認（30-70cm）の対象。' },
          { k: 'ai', label: '形態診断（Web/Mobile 版：T5_FORM_AI_TEXT）', body: T5_FORM_AI_TEXT },
        ] },
        { id: 'large-display', label: 'Large Display', blocks: [
          { k: 'p', t: '駅・空港・施設サイネージ・大型ディスプレイなど、遠距離視認（3-5m）の対象。' },
          { k: 'ai', label: '形態診断（Large Display 版：T5_FORM_AI_TEXT_LD）', body: T5_FORM_AI_TEXT_LD },
        ] },
        { id: 'hybrid', label: 'Hybrid', blocks: [
          { k: 'p', t: 'Web/Mobile と Large Display の両方に対応する場合。両テンプレを実行し、修正スコープを比較します。' },
          { k: 'ai', label: '形態診断（Web/Mobile 版：T5_FORM_AI_TEXT）', body: T5_FORM_AI_TEXT },
          { k: 'p', t: '' },
          { k: 'ai', label: '形態診断（Large Display 版：T5_FORM_AI_TEXT_LD）', body: T5_FORM_AI_TEXT_LD },
          { k: 'p', t: 'AI が診断結果を出力したら、Web/Mobile と Large Display の修正スコープの差分を整理し、ビューポート別の修正方針を決めます。' },
        ] },
      ] },
      { k: 'p', t: 'AI が診断結果を出力するまで待ちます（修正はまだ）。' },
      { k: 'h', t: '手順 2: 形態確認・Core 標準との比較（AI 診断）' },
      { k: 'p', t: 'AI 出力と Core DS 標準を見比べ、以下のチェックリストで「何を修正すべきか」を判定します。' },
      { k: 'ai', label: '形態確認チェック（T5_FORM_CHECK_TEXT）', body: T5_FORM_CHECK_TEXT },
      { k: 'h', t: '手順 3: 形態最適化の判定ルール（設計・人間決定）' },
      { k: 'p', t: '形態の修正は「数値比較」なので、デザイン判定の幅が少ないです。以下のルール（❶❷❸フロー）で、コンポーネントごとに「Core 標準に統一するか・製品ローカルとするか・スコープから外すか」を決めます。' },
      { k: 'p', t: '色の置換テンプレ（CH5_AI_TEXT）の ❶❷❸ と同様のパターンですが、形態は「デザイン意図の確認」より「スケール値の確定性」が優先されます。' },
      { k: 'note', t: 'テンプレ強化セッション（CH5）の「4) 意味分化」と同じ方針＝「人間が判定ルールに基づいて決定 → AI が機械置換」のパターンです。' },
      { k: 'p', t: '以下はコンテキスト別の判定ルール（❶❷❌フロー）です。ステップ 1 で判定したデバイスコンテキストに応じて、該当するルールタブを選択し、AI 診断結果と照らし合わせてください。' },
      { k: 'tabs', label: 'コンテキスト別・形態最適化の判定ルール', items: [
        { id: 'web-mobile', label: 'Web/Mobile', blocks: [
          { k: 'ai', label: '判定ルール（Web/Mobile 版）', body: FORM_OPTIMIZATION_RULES_WEB_MOBILE },
        ] },
        { id: 'large-display', label: 'Large Display', blocks: [
          { k: 'ai', label: '判定ルール（Large Display 版）', body: FORM_OPTIMIZATION_RULES_LD },
        ] },
        { id: 'hybrid', label: 'Hybrid', blocks: [
          { k: 'ai', label: '判定ルール（Hybrid 版）', body: FORM_OPTIMIZATION_RULES_HYBRID },
        ] },
      ] },
      /*{ k: 'h', t: '✎ 人間による最適化設計（ルール適用）' },
      { k: 'p', t: '上のルール（該当コンテキストの ❶❷❌ ）を、AI 診断結果（T5_FORM_AI_TEXT / T5_FORM_AI_TEXT_LD）に適用し、コンポーネントごとに「修正内容」を決めます。' },
      { k: 'check', items: [
        'AI 診断結果のボタン・カード・テキストパターンを見て、該当コンテキストのルール ❶「Core 標準に統一できるか」を適用',
        '当てはまらない場合は ❷「複数パターンがあるが標準寄りがあるか」を適用',
        'Web/Mobile か Large Display の場合は ❌「スケール混在がないか」を確認（Hybrid の場合は両フロー併用）',
        'スコープ（修正対象）を確定。例：「ボタンは Core 標準に統一・カード padding は 3 パターン→1 に統一・見出しは font-size は現状維持・line-height は標準化」のようにリスト化',
      ] },*/
      { k: 'h', t: '手順 4: 実装＋テスト（AI 実装 + 人間テスト）' },
      { k: 'p', t: 'スコープが確定したら、AI に CSS 修正を指示し、VRT・a11y で非回帰を確認します。' },
      { k: 'h', t: '① 修正指示（AI への指示内容の例）' },
      { k: 'ai', label: '修正指示の例（AI へ渡す内容）', body: T5_FORM_INSTRUCTION_EXAMPLE },
      { k: 'h', t: '② 人間による目視確認' },
      { k: 'check', items: [
        'CSS が正しく修正されたか（git diff で視認）',
        'ビルド成功（npm run build / yarn build 等）',
        'ブラウザで見た目が期待通りか（「大きく」見えた・「小さく」見えた等の副作用がないか）',
        'VRT：修正前後の差分が「意図した形態変更」のみか（色が変わった・レイアウトが崩れた等の副作用がないか）',
        'a11y（axe）：serious / critical が 0 のまま（新しい違反が出ていないか）',
      ] },
      { k: 'h', t: '完了の判定' },
      { k: 'check', items: [
        'スコープの修正がすべて完了（ファイル・行番号を確認）',
        '修正前後で CSS ファイルサイズに大きな変化がないか（トークン化で若干増減の可能性）',
        'VRT ベースライン再生成済・axe serious/critical 0',
        'ブラウザ Console にエラーなし',
      ] },
      { k: 'p', t: '上記すべてが ✓ なら「コンポーネント形態の最適化完了」と判定。' },
      { k: 'h', t: '次のステップ' },
      { k: 'p', t: '形態の最適化が完了すれば、「色 + 形態」の両面で「FIG-UDS Core DS に完全準拠」が実現します。これで初めて「自社デザイン資産化完了」として、他プロジェクトでの参照・再利用価値が出ます。' },
      { k: 'note', t: 'このステップで「形態が Core に準拠」した既存コンポーネント（ボタン・カード等）は、今後「Core 昇格候補」として aidlc-workflows ポータルの「未整備プレビュー」セクションに掲載し、他製品での再利用を促進できます。詳細は `portal-scenario1-redesign` / `future-work-portal` を参照。' },
    ] },
];

/* ───────── 章立て（フロー）レンダラ＋操作場所タグ・参照元テーブル ───────── */
const LOC_META = {
  github:   { icon: '😸', label: 'GitHub' },
  terminal: { icon: '💻', label: 'ターミナル' },
  ai:       { icon: '✨', label: '生成AI' },
  human:    { icon: '👀', label: '人間による判定' },
  portal:   { icon: '🎨', label: 'ポータル' },
  file:     { icon: '📄', label: 'ファイルに記述' },
};
function locTag(loc) {
  const m = LOC_META[loc]; if (!m) return '';
  return `<span class="fig-loc fig-loc--${loc}" data-testid="loc-${loc}">${m.icon} ${esc(m.label)}</span>`;
}
function coreRefTable() {
  const rows = [
    ['数値（トークン値）', 'tokens/signature.css・status.css・components.css／semantic.css／primitives.css', 'ブランド・状態色・部品の確定値（AA/AAA 別）'],
    ['決定的生成', 'tools/palette-gen/（seed→signature/status を WCAG AA 保証で生成）', '自社色1点から数値を機械生成'],
    ['ルール（仕様）', 'component-contract.md／accessibility-guidelines.md／components/*.spec.md／patterns/*', '各部品の構成規則・a11y 要件'],
    ['強制（CI）', 'ci/lint（三層トークン単方向）／ci/a11y（axe）／check-raw-hex（生 HEX 0）', '契約違反を機械阻止'],
  ];
  return `<table class="fig-table fig-coreref" data-testid="core-ref-table">
    <caption>AI が従う正典（手で値を決めない）＝取り込んだ <code>vendor/core/</code> の数値とルール</caption>
    <thead><tr><th>種別</th><th>実体（vendor/core 内）</th><th>何を縛るか</th></tr></thead>
    <tbody>${rows.map(r => `<tr><td>${esc(r[0])}</td><td><code>${esc(r[1])}</code></td><td>${esc(r[2])}</td></tr>`).join('')}</tbody>
  </table>`;
}
function renderFlowBlock(b) {
  switch (b.k) {
    case 'p':     return `<p class="fig-doc-lead">${esc(b.t)}</p>`;
    case 'h':     return `<h3 class="fig-flow-h">${esc(b.t)}</h3>`;
    case 'ol':    return `<ol class="fig-doc-list">${b.items.map(i => `<li>${esc(i)}</li>`).join('')}</ol>`;
    case 'ul':    return `<ul class="fig-doc-list">${b.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>`;
    case 'check': return `<ul class="fig-checklist" data-testid="flow-checklist">${b.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>`;
    case 'cmd':   return `<div class="fig-cmd fig-cmd--${b.loc}"><div class="fig-cmd__head">${locTag(b.loc)}${b.label ? `<span class="fig-cmd__label">${esc(b.label)}</span>` : ''}</div><pre class="fig-cmd__pre" tabindex="0"><code>${esc(b.body)}</code></pre></div>`;
    case 'ai':    return `<div class="fig-ai-tmpl" data-testid="ai-tmpl"><div class="fig-ai-tmpl__head">${locTag('ai')}<span class="fig-ai-tmpl__label">${esc(b.label)}</span></div><pre class="fig-ai-tmpl__pre"><code>${esc(b.body)}</code></pre></div>`;
    case 'human': return `<div class="fig-human-tmpl" data-testid="human-tmpl"><div class="fig-human-tmpl__head">${locTag('human')}<span class="fig-human-tmpl__label">${esc(b.label)}</span></div><pre class="fig-human-tmpl__pre"><code>${esc(b.body)}</code></pre></div>`;
    case 'table': return b.t === 'core-ref' ? coreRefTable() : '';
    case 'tabs': {
      // Core のタブ部品（.page-tabs/.tab-panel）を再利用。切替は portal.js の activateTab（mainEl 委譲）が処理。
      const items = b.items || [];
      const tablist = items.map((it, i) =>
        `<button type="button" class="page-tab" role="tab" id="tab-${esc(it.id)}" aria-controls="panel-${esc(it.id)}" aria-selected="${i === 0 ? 'true' : 'false'}" tabindex="${i === 0 ? '0' : '-1'}" data-tab="${esc(it.id)}">${esc(it.label)}</button>`
      ).join('');
      const panels = items.map((it, i) =>
        `<section class="tab-panel" role="tabpanel" id="panel-${esc(it.id)}" aria-labelledby="tab-${esc(it.id)}" data-active="${i === 0 ? 'true' : 'false'}">${(it.blocks || []).map(renderFlowBlock).join('')}</section>`
      ).join('');
      return `<div class="page-tabs" role="tablist" aria-label="${esc(b.label || '構成を選択')}" data-testid="flow-tabs">${tablist}</div><div class="page-panels">${panels}</div>`;
    }
    case 'hint':  return `<details class="fig-hint" data-testid="flow-hint"><summary class="fig-hint__sum">${esc(b.summary)}</summary><div class="fig-hint__body">${(b.blocks || []).map(renderFlowBlock).join('')}</div></details>`;
    case 'aitip': return `<p class="fig-aitip" data-testid="ai-tip"><span class="fig-aitip__icon" aria-hidden="true">${LOC_META.ai.icon}</span><span>${esc(b.t)}</span></p>`;
    case 'note':  return `<p class="fig-doc-note">${esc(b.t)}</p>`;
    case 'links': return `<ul class="fig-doc-list">${b.items.map(i => `<li><a href="${esc(i.route)}">${esc(i.label)}</a></li>`).join('')}</ul>`;
    default:      return '';
  }
}
function renderFlowChapter(ch) {
  const locs = (ch.locs || []).map(locTag).join('');
  return `<section class="fig-flow-ch" id="ch-${ch.n}" data-testid="flow-ch-${ch.n}">
    <h2 class="fig-flow-ch__title"><span class="fig-flow-ch__num" aria-hidden="true">${ch.n}</span><span>${esc(ch.title)}</span><span class="fig-flow-ch__locs">${locs}</span></h2>
    ${(ch.blocks || []).map(renderFlowBlock).join('')}
  </section>`;
}
function renderChapterGuide(g, topic) {
  return `<article class="fig-flow" data-testid="usage-guide-${topic}">
    <h1>${esc(g.title)}</h1>
    <p class="fig-doc-lead">${esc(g.purpose)}</p>
    ${g.chapters.map(renderFlowChapter).join('')}
    <p class="fig-doc-muted"><a href="#/usage/portal-basics">← 使い方インデックス</a></p>
  </article>`;
}

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
    notes: [
      '命名の予約：Core のコンポーネント／ユーティリティのクラス名は予約語として扱う。昇格時は、既存 Core 名（例 .fig-badge＝数値バッジ）と意味の異なるものに同名を当てない（別コンポーネントなら別名）。',
      '昇格レビュー時に「製品やポータルが同名クラスを別用途で使っていないか」を確認する。衝突していると rolling 取込後に固定 height や box-sizing で表示が崩れる（本ポータルでも .fig-badge 衝突を .fig-tag へ改名して解消した実例あり）。',
      'リンク色など本文スタイルも Core を正典に：製品ローカルで重複定義せず、Core の portal.css / トークン（例 --color-text-link は本文 AA 安全な値）を参照し、不足なら本フローで Core 側に足す。',
    ],
    verification: ['core-promotion ラベルの Issue が起票され、Maintainer のレビュー対象になる。', '昇格物のクラス名が既存 Core 名と衝突していない。'],
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
    title: 'シナリオ①：既存アプリを整える',
    group: 'scenario', featured: true, // ★最優先（BR-PIA-5）
    purpose: '既存コードのある製品を、機能を壊さず FIG Core DS のスタイルへ整える（最低でも自社デザイン資産化を達成）。下へスクロールするほど各章の詳細が分かる。',
    chapters: CH_EXISTING,
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
  'quickstart': {
    title: 'クイックスタート（最短でCore採用）',
    group: 'operation', featured: true,
    purpose: '既存 repo に FIG-UDS Core を最短で入れ、スタイル統一に着手するためのコピペ起点。BusDelayAlerts の実証レシピをそのまま下敷きにしている（シナリオ① の具体手順 / US-P7）。',
    preconditions: [
      '対象 repo を clone 済みで、作業ブランチを切っていること（→「GitHub 操作ガイド」）。',
      'Vite + Tailwind（または CSS 変数でテーマを持つ構成）であること。別構成でも「Core semantic → アプリのテーマ変数」を1枚で写像する考え方は同じ。',
    ],
    steps: [
      'Core を submodule で追加し、リリースタグ（例 v1.3.0）で pin する（下記コマンド①）。',
      'Core のトークン CSS をアプリの入口 CSS で import し、最後にブリッジ CSS を読む（後勝ちで上書き／下記②）。',
      'ブリッジ CSS を1枚置き、Core semantic → アプリのテーマ変数へ写像する（下記③＝BDA の src/styles/figuds-bridge.css がテンプレ。shadcn 例。自分のテーマ変数名に読み替える）。',
      'package.json に gen:tokens / check:rawhex / VRT スクリプトを足す（下記④。seed=自社メインカラー）。生 HEX ガードは scripts/check-raw-hex.mjs を BDA から流用。',
      'CI に build＋生HEXガード＋VRT を組む（BDA の .github/workflows/figuds-build.yml がテンプレ。VRT は初回 CI(Linux) でベースライン生成→コミット）。',
      '主要画面の生 HEX を 0 にし、状態色を status・ブランド色を signature 参照へ寄せる（詳細は→「移行」）。',
    ],
    snippets: [
      { label: '① Core を submodule で pin', body:
'git submodule add https://github.com/takahashiman/FIG-Universal-Design-System.git vendor/core\n' +
'git -C vendor/core checkout v1.3.0   # 参照する Core リリースに pin\n' +
'git submodule update --init --recursive' },
      { label: '② 入口 CSS で取込（最後にブリッジを後勝ちで）', body:
'@import "../../vendor/core/primitives.css";\n' +
'@import "../../vendor/core/semantic.css";\n' +
'/* ...既存のテーマ/Tailwind 読込... */\n' +
'@import "./styles/figuds-bridge.css";   /* ← 必ず最後 */' },
      { label: '③ ブリッジ CSS（figuds-bridge.css・shadcn 例・抜粋）', body:
':root {\n' +
'  /* ブランド主色: signature → primary */\n' +
'  --primary:            var(--signature-base);\n' +
'  --primary-foreground: var(--signature-on);\n' +
'  /* 面・線 */\n' +
'  --background: var(--color-surface-default);\n' +
'  --foreground: var(--color-text-primary);\n' +
'  --border:     var(--color-border-default);\n' +
'  --ring:       var(--signature-base);\n' +
'}\n' +
'@theme inline {\n' +
'  /* 状態色: status トークン → success/warning/danger ユーティリティ */\n' +
'  --color-success: var(--status-success-surface);\n' +
'  --color-warning: var(--status-warning-surface);\n' +
'  --color-danger:  var(--status-danger-surface);\n' +
'}' },
      { label: '④ package.json スクリプト（seed=自社メインカラー）', body:
'"gen:tokens":   "node vendor/core/tools/palette-gen/generate.mjs --seed=#2C6B5E --out src/styles/generated",\n' +
'"prebuild":     "npm run gen:tokens",\n' +
'"predev":       "npm run gen:tokens",\n' +
'"check:rawhex": "node scripts/check-raw-hex.mjs",\n' +
'"test:vrt":     "playwright test --project=chromium"' },
    ],
    verification: [
      'npm run build が成功し、check:rawhex（主要画面の生 HEX 0）が緑。',
      '状態色が Core status・ブランド色が signature を参照しており、見た目が FIG-UDS に揃っている。',
      '（次へ）周辺画面の生 HEX 解消は→「移行」、操作感の改善は→「UX 改修フロー」。',
    ],
  },
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
    purpose: '既存コードを Core DS 採用へ移行し、スタイルを統一する（シナリオ① の中核 / US-P7）。',
    preconditions: ['対象 repo を clone 済みであること。'],
    steps: [
      'Core を submodule で追加し pin する。Core CSS（primitives/semantic/tokens）を import する。',
      'ブリッジ CSS 1枚で Core semantic → アプリ Tailwind @theme を写像する。',
      '状態色を semantic 化（success/warning/danger）し、ブランド色を signature ユーティリティへ機械置換する。',
      '主要画面の生 HEX を 0 にする（周辺画面は段階対応）。',
      'migration-status で定量確認する（主要フロー 100% / 全体 ≧ 80%）。',
    ],
    notes: [
      '命名の衝突に注意：製品独自のスタイルは Core のコンポーネント名（例 .fig-badge / .fig-status-pill など Core が定義済みのクラス）を流用せず、自分の名前空間（例 .fig-tag / 製品プレフィックス）を使う。',
      '同名だと Core 側の固定値（height など）＋ box-sizing: border-box が効いて、自分で足した padding が枠内に押し込められ「文字が枠を貫通する／余白が効かない」など不可解な崩れが起きる（原因特定に時間を要する）。',
      '見分け方：意図した padding が効かない時は devtools で computed の height / box-sizing と、どの stylesheet の規則が当たっているか（Core の tokens/components.css 等）を確認する。',
    ],
    verification: ['主要画面 生 HEX 0・vite build 成功・migration-status PASS。', 'Core コンポーネント名と自製スタイルの名前空間が衝突していない。'],
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
      'シナリオ① でスタイル整理（生 HEX 0・build 成功）まで到達していること。',
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

/** 使い方インデックス（トップ）。グループ別・シナリオ① は★最優先で先頭（BR-PIA-5）。 */
export function usageIndex() {
  const li = ([id, g]) => {
    const star = g.featured ? '<span class="fig-tag fig-tag--featured" data-testid="usage-featured">★最優先</span> ' : '';
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
  if (g.chapters) return renderChapterGuide(g, topic);
  const block = (title, arr, ordered) => {
    if (!arr || !arr.length) return '';
    const tag = ordered ? 'ol' : 'ul';
    return `<h2>${esc(title)}</h2><${tag} class="fig-doc-list">${arr.map(s => `<li>${esc(s)}</li>`).join('')}</${tag}>`;
  };
  // 任意: コピペ用スニペット（quickstart 等）。各 { label, body } を <pre><code> で提示。
  const snippets = (arr) => {
    if (!arr || !arr.length) return '';
    return `<h2>コピペ</h2>${arr.map(s => `<section class="fig-usage-snippet">
      <h3 class="fig-usage-snippet__label">${esc(s.label)}</h3>
      <pre class="fig-usage-pre"><code>${esc(s.body)}</code></pre></section>`).join('')}`;
  };
  // 任意: 注意（落とし穴）。失敗しやすい点を明示する。
  const notes = (arr) => {
    if (!arr || !arr.length) return '';
    return `<h2>注意（落とし穴）</h2><ul class="fig-doc-list fig-usage-notes">${arr.map(s => `<li>${esc(s)}</li>`).join('')}</ul>`;
  };
  return `<article class="fig-usage" data-testid="usage-guide-${topic}">
    <h1>${esc(g.title)}</h1>
    <p class="fig-doc-lead">${esc(g.purpose)}</p>
    ${block('前提', g.preconditions)}
    ${block('手順', g.steps, true)}
    ${snippets(g.snippets)}
    ${notes(g.notes)}
    ${block('確認', g.verification)}
    <p class="fig-doc-muted"><a href="#/usage/portal-basics">← 使い方インデックス</a></p>
  </article>`;
}

function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
