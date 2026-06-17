# U1 Code — Step 5: コンポーネント拡充（進行中）

CSS クラス方式（NRQ2 更新）。`tokens/components.css` に追記、spec/preview を整備。増分バッチ。

## 完了
- 既存採用: button(+secondary/ghost) / card / input / list / list-item
- **バッチ1（feedback, commit 2ffee42）**: alert(+success/warning/error) / badge(+dot) / status-pill(+status) / toast。`--fig-radius-pill` 追加。alert/badge spec 追加

## 完了（CSS クラス・commit e428405）
- **バッチ2 コンテナ**: `.fig-modal`(__scrim/__dialog) / bottom-sheet / side-sheet / header / form-group(__label/__help/__error)
- **バッチ3 アクション**: fab / icon-button / segmented(__item) / switch(__track/__thumb)
- **バッチ4 入力**: checkbox / radio / picker / table(th/td)
- **バッチ5 ナビ**: tabs/tab / breadcrumb(__sep) / pagination(__item) / nav-rail(__item) / bottom-nav(__item)
- **バッチ6 残**: icon-bubble / sense（契約はデザイナー精査）

## カバレッジ
**部品クラス 30種 = 設計28コンポーネントを全カバー**（CSS クラス方式）。

## トークン純度
- 色・余白・タイポ・radius・elevation・z-index は全てトークン経由
- 例外（最小raw）: `.fig-switch` の固有寸法（44/24/20/2px）、sheet の `min(90vw, …)`。→ U5 Lint で**コンポーネント固有寸法の allowlist**として扱う方針

## Step5 の残（ドキュメント整備）
- 不足 spec.md（16件: bottom-sheet/side-sheet/header/form-group/fab/icon-button/segmented-button/toggle-switch/checkbox/radio-button/picker/table/breadcrumb/pagination/navigation-rail/fig-sense）
- preview の各部品 5状態整備
→ 実装は完了。spec/preview の完備は継続タスク（Build&Test の a11y 検証前までに整備）

## 各バッチの手順（テンプレ）
1. 既存 spec/preview を確認（再利用）
2. `.fig-<name>` を tokens/components.css に追記（トークン経由・生値なし）
3. 不足 spec.md / preview を整備
4. コミット `feat(components): <category>系を追加`
