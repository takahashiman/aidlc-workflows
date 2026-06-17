# U1 Core DS — Functional Design Plan

> 対象 Unit: **U1 Core DS**（stories: US-1.1〜1.4, US-4.4, US-4.5 提供側）。
> 技術非依存の詳細設計（トークン階層・コンポーネント契約・プロファイル・メタデータ・バージョニング/昇格ロジック）。
> 下部 `[Answer]:` にご記入ください。

## 生成する成果物（チェックリスト）
- [x] `business-logic-model.md` — トークン三層モデル・プロファイル上書きロジック・SemVer/昇格ルール
- [x] `business-rules.md` — 三層依存規則・昇格判定・命名/トークン規約・registry/taxonomy 整合規則
- [x] `domain-entities.md` — エンティティ（Token, Component, Profile, RegistryEntry, TaxonomyNode, Release）
- [x] `frontend-components.md` — 正典コンポーネント群の契約（階層・Props/States・a11y・プロファイル可否・preview）

## 確認質問

### FDQ1. 正典コンポーネント集合の確定（US-1.1）
RE で抽出した既存 spec は**28種（ユニーク）**。Q1=A で「24に整理」と決定済み。最終確定が必要です。
> 28種: alert, badge, bottom-navigation, bottom-sheet, breadcrumb, button, card, checkbox, fab, fig-sense, form-group, header, icon-bubble, icon-button, input, list-item, modal, navigation-rail, pagination, picker, radio-button, segmented-button, side-sheet, status-pill, tab, table, toast, toggle-switch

A) **28種すべてを正典採用**（「24」は概数とみなす）
B) **正確に24へ整理**：以下の私の統合/除外案（要・デザイナー判断）で確定
  - 統合候補: `status-pill`→`badge` の variant ／ `segmented-button`→`tab` の variant
  - 保留/除外候補（Web-Admin 中心で優先度低い可能性）: `fig-sense`, `fab` ほか2件をデザイナー指定
C) **デザイナーが最終24を直接指定**（除外/統合するコンポーネント名を記載）
X) Other

[Answer]: A

### FDQ2. プロファイル別に上書きするトークン範囲（US-1.3）
`.fig-profile-*`（Web-Admin/Mobile-Consumer/Mobile-Terminal）で値が変わるトークン種別。

A) **全種**（color / spacing / typography / radius / motion / touch-target すべてプロファイルで上書き可能）（推奨：将来の最適化余地を確保）
B) **限定**（touch-target / spacing / typography のみ。color はブランド共通）
X) Other

[Answer]: A

### FDQ3. コンポーネント契約（spec.md）の必須項目
各コンポーネントの正典契約に含める必須項目。

A) **フル**（Props / States(5状態以上) / a11y注意 / 3プロファイル成立 / preview.html / Semantic トークン参照一覧）（推奨）
B) **最小**（Props / preview.html のみ。a11y/プロファイルは任意）
X) Other

[Answer]: A
