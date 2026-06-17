# U4 Migration — Frontend Components / 契約

> 確定回答: FDQ1-8 = すべて A。U4 は新規 UI を多くは作らず、**既存 UI（busapp）を Core `.fig-*` へ写像**し、移行進捗を可視化する契約を定義する。
> 本書は「移行対象 UI の扱い（写像対応表の契約）」と「進捗可視化（ポータル/Showcase 連携の入力契約）」の2部構成。

---

## Part A. 移行対象 UI の扱い — busapp → Core `.fig-*` 写像契約

### A-1. 写像の基本契約（FDQ2=A / BR-CONV-*）
移行後の各コンポーネントは「薄い presentational ラッパー（旧 props 維持）＋ Core クラス委譲」で構成する。

```
旧: <Button variant="primary" size="lg" onClick={f}>保存</Button>   （独自CSS）
新: <Button variant="primary" size="lg" onClick={f}>保存</Button>   （内部は↓）
        └─ <button className="fig-button fig-button--primary fig-button--lg" onClick={f}>
```
- **公開 API（props）は不変**（BR-CONV-3）→ 呼び出し側（画面）の改修を最小化。
- **内部**は Core クラスへ委譲、生 CSS/独自トークン撤去（BR-CONV-1/2）。
- ルートに `.fig-profile-*`（busapp 既定 profile）を付与（BR-CONV-4）。

### A-2. busapp コンポーネント写像対応表（ComponentMapping の具体契約）
| 旧コンポーネント | 旧 props（保存対象） | Core 写像 | props → クラス/属性マッピング | 備考 |
|---|---|---|---|---|
| **Button.jsx** | `variant, size, disabled, onClick, children` | `.fig-button` | variant→`--primary/--secondary/...`, size→`--sm/--md/--lg`, disabled→`[disabled]` | Core 正典に button あり |
| **Card.jsx** | `title, children, elevation?` | `.fig-card` | elevation→影トークン（semantic 経由）、title→ヘッダ slot | 生トークン→semantic 置換 |
| **TextField.jsx** | `label, value, onChange, error, help, disabled` | `.fig-input` | error→`--error`/`aria-invalid`, help→`.fig-input__help`, label→`<label for>` | a11y 属性維持（WCAG AA） |
| **FAB.jsx** | `icon, onClick, position?` | `.fig-fab`（要 Core 照合）/ ExtensionPart | icon→アイコン slot, position→配置クラス | **Core 採否を registry で照合**（BR-CONV-5）。不在なら Extensions 層（BR-EXT-1） |

> この対応表は MigrationProject の成果物（`ComponentMapping`）として機械可読化し、Code Generation 段階で実際の写像実装の入力となる。

### A-3. 写像の検証契約（BR-SCR-4）
各 ComponentMapping は次を満たして `verified=true`:
- 三層 Lint 緑（生 hex/px なし・`--fig-*` 経由・層逆流なし）
- VRT 緑（旧 preview との視覚差分が許容内）
- props 互換テスト（旧 props で同等描画）

### A-4. 画面合成の契約（FDQ3=A / BR-SCR-*）
- 画面（route）は写像済みコンポーネントのみで合成して初めて `MIGRATED`。
- 画面内に `legacy/` 由来の旧実装が1つでも残ると `IN_PROGRESS`（混在 NG・移行率非カウント）。

---

## Part B. 移行進捗の可視化 — ポータル/Showcase 連携の入力契約

U4 は専用 UI を新規作成せず、**U2 ポータル運用ビュー**と **U6 Showcase** へデータを供給する。U4 の責務は「機械可読データ（移行マニフェスト）の生成契約」。

### B-1. 移行マニフェスト出力契約（FDQ8=A / BR-VIS-*）
製品 repo が出力する `migration-manifest.json`（U5 収集 → U2 運用ビューが描画）。
```jsonc
{
  "project": "fig-ext-<cat>-busapp",
  "coreVersion": "x.y.z",            // registry 紐付け
  "screens": [
    { "screenId": "...", "state": "MIGRATED|IN_PROGRESS|NOT_STARTED",
      "flows": ["checkout"], "legacyRemaining": 0, "vrt": "green" }
  ],
  "criticalFlows": [ { "flowId": "checkout", "screens": ["..."], "done": true } ],
  "overallRatio": 0.83,
  "criticalDone": true,
  "completed": true,                 // BR-DONE-1 ゲート結果
  "wrappers": [
    { "kind": "product-wrapper", "from": "OldButton", "to": ".fig-button",
      "deprecatedSince": "2026-06-09", "removeBy": "2026-09-09", "overdue": false }
  ],
  "extensionParts": [
    { "name": "ProductBadge", "promotionState": "proposed", "showcaseCollected": true }
  ]
}
```
- **生成のみ・手動編集不可**（状態から再生成・BR-VIS-1）。
- ポータルは version-matrix と同じ収集経路で取得し「製品 × Core版 × 移行率 × 完了」を運用ビューに一覧表示。

### B-2. ポータル運用ビューでの表示要素（U2 既存スキーマへの追加入力）
| 表示 | ソース | 備考 |
|---|---|---|
| 移行率バー（overallRatio） | manifest | 80% 閾値ラインを表示 |
| 主要フロー完了バッジ（criticalDone） | manifest | 100% で緑 |
| 移行完了バッジ（completed） | manifest | 二指標ゲート結果 |
| 期限超過ラッパー警告 | manifest.wrappers[].overdue | removeBy 超過を強調（BR-WRAP-3） |
| Core 版 | manifest.coreVersion | version-matrix と統合 |

### B-3. Showcase 連携（FDQ5=A / BR-EXT-2）
- ExtensionPart は `core-promotion` ラベル/所定ディレクトリで U6 Showcase が自動収集。
- 表示: 「どの製品の何か」＋ 昇格状態（local/proposed/promoted）＋ 再利用/昇格提案導線（US-5.2）。

### B-4. Interactive Prompt Generator 連携（取り込み入口・U3 継承）
- 既存製品取り込み時、U3 の Prompt Generator は「新規」だけでなく「既存取り込み（migrate-in）」モードの入力（source repo・既存 project-settings・宣言する critical flows）を受け、取り込みプロンプトを生成（U3 PromptGenerator の入力拡張・FDQ8/BLM-1 と整合）。

---

## 既存資産の尊重（グラウンディング）
- busapp `preview/{button,card,textfield}.html` は **VRT のベースライン候補**（写像前後の視覚差分検証に流用）。
- busapp `tokens/{primitives,semantic}.css` の独自値は Core semantic への `tokenMap`（A-2）の入力。Core に無い意味的トークンは ExtensionPart 側で保持し昇格検討。

## ストーリー網羅
| Story | 反映箇所 |
|---|---|
| US-3.5 | Part A（写像）・B-4（取り込み入口） |
| US-3.6 | A-4（画面合成）・B-1/B-2（進捗・完了可視化） |
| US-4.5 | B-2（期限超過ラッパー警告） |
| US-2.5 / US-5.2 | B-3（Showcase 連携） |
| US-4.3 | B-1（version 収集と同基盤） |
