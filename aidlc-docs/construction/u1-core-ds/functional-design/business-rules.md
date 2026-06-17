# U1 Core DS — Business Rules

> 検証可能な規則（U5 CI で機械検査される項目を含む）。

## BR-1 三層依存規則
- Component は **Semantic トークンのみ**参照可（Primitive・生値 hex/px の直参照は禁止）
- Semantic は **Primitive のみ**参照可
- 逆流・同層横断・生値直書きは**違反**（fail）

## BR-2 命名規約（既存実態に整合・2026-06-05 修正）
CSS 変数は**多接頭辞規約**（既存 Core の意図的設計を踏襲。大規模リネームはしない）：
- **`--color-*`**: セマンティックな色役割（例 `--color-text-primary`, `--color-surface-brand`）。semantic.css が正典
- **`--fig-*`**: サイズ/余白/タイポ等のプロファイル変動トークン（例 `--fig-size-body`, `--fig-spacing-m`）
- **`--fg-*`**: スレート系プリミティブ（前景スケール）
- いずれもケバブケース・意味的命名。コンポーネント spec/ファイルもケバブケース（例 `status-pill`）
- **層規約**: Component は `--color-*`/`--fig-*`（セマンティック層）のみ参照。primitives.css の生プリミティブ・生 hex/px の直参照は禁止

## BR-3 プロファイル上書き規則
- 上書きは **Semantic 層**で行う（Component は不変）
- `.fig-profile-*` セレクタで全トークン種を上書き可（FDQ2=A）
- どのプロファイルでも視覚的に成立すること（3プロファイル成立）

## BR-4 Core 昇格判定規則（全✓で昇格対象）
- 異なる3プロダクト以上の利用実績/明示需要
- ドメイン固有語彙を除去し普遍化済み
- Core トークン階層遵守（Primitive/Semantic 直ハードコード禁止）
- `--fig-*` トークン経由実装
- 3プロファイル（Admin/Consumer/Terminal）で成立
- WCAG 2.1 AA 充足／`prefers-reduced-motion` 追従
- `components/*.spec.md` と `preview/*.html` 完備

## BR-5 SemVer 規則
- 追加・昇格＝MINOR／破壊的＝MAJOR（移行ガイド必須）／修正＝PATCH
- リリースは git タグ＋CHANGELOG を伴う

## BR-6 メタデータ整合規則
- `registry.entry.category/subcategory` ∈ `taxonomy`（存在しないカテゴリは違反）
- registry の repo 名は命名規約 `fig-ext-<category>-<product>` に従う
- taxonomy 変更は Core Maintainer 承認必須

## BR-7 後方互換規則
- コンポーネント/トークンの改名は、旧名エイリアス/ラッパーを一定期間提供（非破壊）
- 破壊的変更は MAJOR＋移行ガイドなしにリリースしない

## BR-8 コンポーネント契約必須項目（FDQ3=A フル）
各コンポーネントは以下を必須とする：
- Props 定義 ／ States（Default/Hover/Active/Disabled/Error 等 5状態以上）
- a11y 注意点（aria/フォーカス/コントラスト）
- 3プロファイル成立の確認
- `preview/*.html`（5状態以上を可視化）
- 参照する Semantic トークン一覧（生値ゼロ）

## Security Compliance（Security Baseline 有効・本ステージ判定）
本ステージは技術非依存の業務設計のため、コード/インフラ系 SECURITY ルールは原則 **N/A**（Code Generation 時に評価）。
- SECURITY-04/09/10/13/15: **後続（Code Generation / Infra Design）で評価** — 本設計に違反要素なし
- その他（01/02/03/05/06/07/08/11/12/14）: **N/A**（データストア/API/認証/インフラが本 Unit に存在しない）
- 設計上の前提: 生値直書き禁止・トークン経由（BR-1）が、将来のスタイル注入リスク低減にも寄与
