# U2 Portal — Functional Design Plan

> 対象 Unit: **U2 Portal**（repo: `aidlc-workflows` / 含む: PT-1〜8）
> 対象ストーリー: US-2.1 サイドナビ即時到達 / US-2.2 閲覧3形態 / US-2.3 rolling / US-2.4 3区分IA＋使い方 / US-2.5 ドッグフーディング・鶏卵回避 / US-2.6 Pages 公開 / US-2.7 操作随伴ガイド
> 技術非依存の詳細設計（ルーティング/IA モデル・ナビ生成ロジック・閲覧3形態・rolling 参照・データソース契約・ドッグフーディング規則・使い方ページ構造）。
> 下部 `[Answer]:` にご記入ください。A=推奨。

## 前提認識（既存資産のグラウンディング）
- 既存ポータル SPA は `aidlc-projects/FIG-Universal-Design-System/`（FIG-UDS の `core` ブランチ）配下に存在:
  - `assets/js/portal-content.js`(1950行: PAGES 辞書 = `scope/section/item` ルーティング・現行IA), `portal.js`(826行: シェル/ルーター/レンダリング), `ai-co-creation.js`(371行), `feedback.js`(215行), `assets/portal.css`
  - 現行IAは **scope=Core/Extensions/Developer × section(Foundations/Accessibility/Components/Patterns…) × item** の3階層ハードコード
  - `registry.json` / `taxonomy.json` は Core DS 側に既存（U1 で正典化）
- 目標IA（US-2.4）は **概要 / プロジェクト集 / 運用 ＋ 使い方** の3区分。→ 現行IAとの整合が論点（FDQ2）。

## 生成する成果物（チェックリスト）
- [x] `business-logic-model.md` — ハッシュルーティング/IA モデル・ナビツリー生成（taxonomy 駆動）・閲覧3形態の描画ロジック・rolling 参照アルゴリズム・データソース契約（registry/taxonomy/version-matrix/showcase-index）・ドッグフーディング判定フロー
- [x] `business-rules.md` — IA 3区分の所属規則・即時到達/最小クリック規則・rolling 不変条件・玄人最適化（一面完結/詳細別ページ）規則・ドッグフーディング起票/撤去規則・使い方ページ必須規則・Pages 公開規則
- [x] `domain-entities.md` — Route, NavNode(TaxonomyNode 投影), Project(RegistryEntry 投影), DemoView, VersionMatrixEntry, ShowcaseItem, UsageGuidePage, TempPart(仮パーツ) とその関係
- [x] `frontend-components.md` — PT-1〜PT-8 の契約（責務・Props/State・ユーザー操作フロー・依存データソース・空状態/エラー時挙動）

---

## 確認質問

### FDQ1. U2 ポータルのコード所在（repo トポロジの確定）
unit-of-work.md は U2 の repo を `aidlc-workflows` と定義。一方、稼働中のポータル実体は `FIG-UDS(core)` 配下の `FIG-Universal-Design-System/` にあります。Functional Design 以降の実装先を確定します。
- A) **`aidlc-workflows` を正式なポータル repo とし、既存ポータル資産（portal*.js / portal.css / *.html）をこちらへ移設**して U2 を進める（設計の repo トポロジに整合・推奨）
- B) **当面 FIG-UDS(core) 配下のまま**ポータルを継続開発し、repo 分離は U2 完了後に実施（移設リスクを後ろ倒し）
- C) ポータルは恒久的に Core DS 同梱（`aidlc-workflows` はワークフロー/ドキュメント専用に留める）→ unit-of-work.md を改訂
- X) Other

[Answer]: A

### FDQ2. 目標IA（3区分）と既存IA（scope×section）の統合方式
US-2.4 の上位3区分「概要／プロジェクト集／運用」＋「使い方」へ、現行の Core/Extensions/Developer スコープ・Foundations/Components 等のセクション群をどう写像するか。
- A) **再編**: 上位を 概要／プロジェクト集／運用／使い方 の4ルートに刷新し、現行 Core 配下（Foundations/Accessibility/Components/Patterns）は「概要」配下に、Extensions 製品群は「プロジェクト集」(taxonomy 駆動)に、昇格/版/CI 等は「運用」に再配置（目標IAに忠実・推奨）
- B) **併存**: 現行 scope セレクタ（Core/Extensions/Developer）を残しつつ、サイドナビ上位ラベルのみ3区分へリネーム（移行コスト最小）
- C) デザイナー指定の独自マッピング（記載してください）
- X) Other

[Answer]: A

### FDQ3. サイドナビの生成ソース（taxonomy 駆動の範囲）
PT-2 Side Navigation は「taxonomy 駆動」と定義。現行は `portal-content.js` の PAGES 辞書にハードコード。
- A) **「プロジェクト集」配下のみ taxonomy.json 駆動**で動的生成し、「概要/運用/使い方」は静的定義（コンテンツIAと製品IAを分離・推奨）
- B) **全ナビを単一データ（taxonomy.json 拡張＋静的セクション定義のマージ）で駆動**（一元管理だが taxonomy のスキーマ拡張が必要）
- C) 現行ハードコード維持（taxonomy は参照のみ・自動生成しない）
- X) Other

[Answer]: A

### FDQ4. 閲覧3形態（US-2.2: コンポーネント単体／ページ遷移／デモ）の供給源
Project View(PT-4) の3形態を、どのデータ/実体から描画するか。現状は拡張製品 repo がまだ存在せず、Core DS の preview（`preview/_core-gallery.html` 等）が実在します。
- A) **registry.json の各エントリが `demoUrl`/`previewPath` を持ち、デモは iframe 埋め込み**（ADQ2=A 準拠）。拡張未整備の現段階は Core DS の preview を暫定ソースとし、製品は U3/U4 で追加（契約先行・推奨）
- B) デモは当面リンク（別タブ）に留め、iframe 集約は CI/Pages 整備（U5/U6）後に有効化
- C) 3形態のうち「コンポーネント単体」「ページ遷移」のみ U2 で実装し、「デモ画面」は U4 製品出現まで保留
- X) Other

[Answer]: A

### FDQ5. rolling（US-2.3）で最新 Core を反映する実現方式
PT-7 Metadata Reader が Core の registry/taxonomy/トークン/コンポーネント CSS を「pin せず」読み込む具体機構。
- A) **ビルド時取り込み**: ポータルビルドで Core DS の最新タグ（または core ブランチ HEAD）からトークン/CSS/registry/taxonomy を取得しバンドル（Pages は静的・再ビルドで rolling・推奨）
- B) **実行時 fetch**: ブラウザ実行時に Core DS の公開 URL（raw/Pages）から fetch（再ビルド不要だが CORS/可用性に依存）
- C) **submodule(branch追従)**: ポータルが Core を branch 追従の submodule で取り込み、更新時に pull→再デプロイ
- X) Other

[Answer]: A

### FDQ6. version-matrix / showcase-index の契約（U5/U6 依存の扱い）
版ダッシュボード(PT-5)・Showcase(PT-6) はそれぞれ `version-matrix.json`(CI-3) と `showcase-index.json`(CI-4) を入力にしますが、その生成は U5/U6。U2 ではどこまで作るか。
- A) **U2 で JSON スキーマ（契約）を確定し、ビュー（PT-5/PT-6）を契約消費前提で実装**。データは当面スタブ/手動 JSON、自動収集は U5/U6 で差し替え（ビュー先行・契約安定化・推奨）
- B) ビューは枠（空状態）のみ用意し、スキーマ確定とビュー本実装は U5/U6 で実施
- C) PT-5/PT-6 は U2 スコープ外とし、U5/U6 に全面委譲（U2 は PT-1〜4,7,8 に集中）
- X) Other

[Answer]: A

### FDQ7. ドッグフーディング・鶏卵回避（US-2.5）の U2 への取り込み範囲
「Core 未満が必要でも開発を止めない」フロー（仮パーツを Extensions 層に置き、専用ラベル Issue 起票、Core 昇格後に rolling 取得＋仮コード撤去）。
- A) **業務規則として完全に設計**（仮パーツの所在規則・`temp-part`/`core-promotion` ラベルの Issue 自動起票トリガ・撤去判定条件）を business-rules に明文化し、ポータル側に「仮パーツ」明示マーキングと撤去チェックを含める（推奨）
- B) 規則は明文化するが Issue 自動起票/撤去検出は U5(CI) 委譲、U2 は仮パーツの表示マーキングのみ
- C) US-2.5 は U6 Showcase と統合して扱い、U2 では最小（仮パーツ＝Extensions層に置く方針記載のみ）
- X) Other

[Answer]: A

### FDQ8. 使い方ページ（US-2.7 操作随伴ガイド）の構造とツール非依存表現
「操作を要する全場面に再現可能な使い方ページ」「玄人最適化＝メインは一面完結、詳細 how-to は別ページ」。
- A) **使い方ページを独立エンティティ(UsageGuidePage)化**し、各操作箇所（セットアップ/昇格提案/版確認/フィードバック等）から `#/usage/<topic>` へ導線。表現は「目的→前提→手順(Gitツール/AIアシスタント非依存の抽象ステップ)→確認」の定型テンプレで統一（再現性・推奨）
- B) 使い方は単一「使い方」セクション内の項目群とし、操作箇所からは当該項目へアンカーリンク（軽量）
- C) デザイナー指定の構成（記載してください）
- X) Other

[Answer]: A

### FDQ9. クライアント状態の永続化（プロファイル/版/スコープ選択）
現行ヘッダはデバイスプロファイル切替・バージョン選択・scope 切替を持ちます。これら UI 状態の保持方針。
- A) **URL（ハッシュ/クエリ）＋localStorage 併用**: 共有可能性（URL）と再訪時復元（localStorage）を両立（推奨）
- B) URL のみ（ステートレス・共有優先、再訪時はデフォルト）
- C) localStorage のみ（再訪時復元優先）
- X) Other

[Answer]: A

### FDQ10. 既存 `ai-co-creation.js` / `feedback.js` の U2 での扱い
既存ポータルに同梱の Interactive Prompt Generator(`ai-co-creation.js`) と フィードバック機構(`feedback.js`)。
- A) **`ai-co-creation.js` は U3(TM-2) 管轄として U2 では現状維持（壊さない）/ `feedback.js` は U2 の使い方・運用導線として再評価**（責務分界に忠実・推奨）
- B) 両方とも U2 で Project/Usage 導線へ統合・刷新する
- C) 両方とも U2 スコープ外（触れない）
- X) Other

[Answer]: A
