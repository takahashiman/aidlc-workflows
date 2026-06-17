# U4 Migration — Functional Design Plan

> 対象 Unit: **U4 Migration（既存取り込み）**（repo: 各既存製品 → `fig-ext-<category>-<product>` / 含む: EX-1〜4, SV-4, 移行チェックリスト）
> 対象ストーリー: US-3.5 既存プロジェクトの取り込み / US-3.6 段階移行と完了判定 / US-4.5 マイグレーション方針（エイリアス/ラッパー・MAJOR移行ガイド）
> 技術非依存の詳細設計（取り込みフロー・段階移行ロジック・完了判定の機械化・後方互換ラッパー・Core 整合化マッピング）。
> 下部 `[Answer]:` にご記入ください。A=推奨。

## 前提認識（既存資産のグラウンディング）
- **移行対象の実体 = busapp**（RE 棚卸し）: `FIG-UDS.git main(6f36074)/extensions/busapp/`。
  - `components/`: `Card.jsx` `Button.jsx` `FAB.jsx` `TextField.jsx` `index.js`（**JSX 実装**）
  - `tokens/`: `primitives.css` `semantic.css`（製品具体化された三層トークン）
  - `preview/`: `button.html` `card.html` `textfield.html`
  - `project-settings.json` / `README.md`
- **Core(U1) の現実態**: Core は **CSS クラス方式（`.fig-*`）採用、JSX を持たない**（NRQ2 確定・aidlc-state）。⇒ busapp の JSX 実装と Core の CSS クラス方式に**実装パラダイムの差**がある（移行設計の核心論点）。
- **U3 で確立済みの導線**（流用前提）: `fig-ext-template`（GitHub Template）/ `project-settings.json` 単一入力契約 / `scripts/init.mjs`（冪等セットアップ: derive→duplicate→apply→pin→wire-ci→register→verify）/ `CorePin`（submodule + `CORE-DS-VERSION` 二重）/ `ScopeManifest`（SKILL/AGENTS）/ `RegistryPR`（CI-5 + Maintainer）。
- **確定済み移行基準**（Inception Decisions）: 1画面内の新旧混在=**不可** / 画面間=期限付き許容 / 完了=**主要フロー100%＋全体≧80%** の定量チェックリスト。
- **US-4.5（マイグレーション方針）**: Core 側の普遍化（改名等）には旧名→新名のエイリアス/ラッパーを一定期間提供。破壊的変更は MAJOR＋移行ガイド。
- 関連 Unit: U1(Core 正典/`.fig-*`/registry-taxonomy/共有Lint)・U3(template/init/ScopeManifest/RegistryPR)・U5(三層Lint/VRT/version収集=移行ゲートの実行基盤)・U6(Showcase=Core未満の独自パーツ展示)。

## 生成する成果物（チェックリスト）
- [x] `business-logic-model.md` — 取り込みフロー（既存→repo化→template整合→Core pin→段階移行→完了判定）／JSX→`.fig-*` 整合化ロジック／段階移行の状態機械／完了判定アルゴリズム／後方互換ラッパーの生成・寿命ロジック
- [x] `business-rules.md` — 取り込み規約・画面内混在禁止規則・移行チェックリスト規則・完了判定閾値規則・エイリアス/ラッパー寿命規則・Core未満パーツの Extensions層/Showcase 規則・MAJOR移行ガイド規則
- [x] `domain-entities.md` — MigrationProject, LegacyAsset, ComponentMapping, ScreenMigrationState, MigrationChecklist, CompatibilityWrapper, ExtensionPart(Core未満), MigrationGuide
- [x] `frontend-components.md` — 移行対象 UI の扱い（busapp の Card/Button/FAB/TextField を Core `.fig-*` へ写像する対応表の契約）・移行進捗の可視化（ポータル/Showcase 連携の入力契約）

## 確認質問

### FDQ1. 取り込みの物理形態（既存 busapp → 拡張 repo 化）
US-3.5。既存 `extensions/busapp/` を拡張枠の独立 repo にする方式。
- A) **`fig-ext-<category>-busapp` を U3 の `fig-ext-template` から派生（GitHub Template）して作成し、busapp の既存資産を移植**（init.mjs で project-settings 駆動セットアップ→Core pin→registry PR）。マルチレポ/スコープ分離に整合（推奨：U3 導線を再利用・ADQ5/ADQ6）
- B) busapp の既存履歴を保持したまま `git filter-repo`/subtree で新 repo へ抽出し、後から template 資産を被せる（履歴重視）
- C) 両対応（既定は A、履歴が重要な製品のみ B）
- X) Other

[Answer]: A

### FDQ2. 実装パラダイムの整合（busapp JSX → Core `.fig-*` CSS クラス方式）
busapp は JSX 実装、Core は CSS クラス方式（JSX なし）。移行の本質的ギャップ。
- A) **Core `.fig-*` クラスへ全面的に置換（JSX は薄い presentational ラッパーに留め、見た目・トークンは Core クラスに委譲）**。製品固有の生 CSS/独自トークンは廃し、Core semantic トークン経由に統一（推奨：三層ガードレール=US-4.1 に適合・「画面内 100% Core 適応」を満たせる）
- B) JSX 実装を維持しつつ内部で Core トークン（CSS 変数）のみ参照（クラスは使わず変数参照に置換）
- C) 製品の技術スタック（React 等）を尊重し、Core を CSS として読み込み JSX 側でクラス付与（A の漸進版）
- X) Other

[Answer]: A

### FDQ3. 段階移行の単位と「画面内混在禁止」の判定境界（US-3.6 / AC1）
「1画面内の新旧混在=不可、画面間=期限付き許容」をどの粒度で機械判定するか。
- A) **画面（route/page）を移行の原子単位**とし、1画面=「全コンポーネントが Core `.fig-*`/Core由来 で構成」を満たして初めて『移行済み画面』。画面内に旧実装が1つでも残れば未移行（混在 NG）。画面間の新旧併存は移行期限内で許容（推奨：US-3.6 AC1 に直接対応・判定が明確）
- B) コンポーネント単位で移行率を測り、画面の混在は警告に留める（緩い）
- C) フロー（複数画面の連なり）単位で判定
- X) Other

[Answer]: A

### FDQ4. 完了判定の機械化（US-3.6 / AC2「主要フロー100%＋全体≧80%」）
定量チェックリストの算出方法。
- A) **二指標ゲート: ①主要フロー（critical flows）に属する画面が 100% 移行済み ②全画面の移行済み比率 ≧ 80%。両立で『移行完了』。critical flows は MigrationProject のメタデータで宣言**し、移行済み画面の集合から自動算出（U5/version収集と同基盤でクローリング）。チェックリストは生成物（推奨：客観・自動・US-3.6 AC2 準拠）
- B) 全体比率のみ（≧80%）でゲート、主要フローは手動確認
- C) 全画面 100%（完全移行のみ完了。猶予なし）
- X) Other

[Answer]: A

### FDQ5. Core 未満の独自/仮パーツの扱い（busapp 固有で Core に無い部品）
busapp に Core 正典24 に無い独自部品がある場合の置き場。
- A) **製品 repo の Extensions 層（`extensions/` 配下）に配置し、`core-promotion` 候補として Showcase(U6) に自動収集**。Core 還元は昇格フロー（US-4.4）に乗せる。移行完了判定では「Core 適応」として扱う（Extensions 層は製品内の正規層）（推奨：ドッグフーディング規則=US-2.5 と一貫・鶏卵回避）
- B) すべて Core 昇格を先に行い、Core 化されるまで移行を保留（厳格だがデッドロック懸念）
- C) 製品内にローカル実装し Showcase 対象外（隠す）
- X) Other

[Answer]: A

### FDQ6. 後方互換ラッパー／エイリアスの寿命と契約（US-4.5）
Core 側の普遍化（改名等）追従、および移行期の旧 API 維持。
- A) **二種を定義: ①Core 改名追従の旧名→新名エイリアス（Core 側 U1 が一定期間提供・既存 alias 機構を流用）②製品移行期の旧実装→新実装ラッパー（製品 repo 側・移行完了で削除）。各ラッパーに `deprecatedSince`/`removeBy`（期限）メタを必須化し、期限超過は CI 警告**（推奨：US-4.5 AC1 と移行の可逆性を両立・寿命の可視化）
- B) エイリアスのみ（製品側ラッパーは設けず一括置換）
- C) ラッパーのみ（Core エイリアスに依存しない）
- X) Other

[Answer]: A

### FDQ7. 破壊的変更（MAJOR）時の移行ガイド（US-4.5 / AC2）
Core の MAJOR 追従時の成果物。
- A) **Core MAJOR リリースに移行ガイド（変更点・旧→新マッピング・手順・期限）を必須添付し、製品 repo は CORE-DS-VERSION の MAJOR 更新時にガイド参照を移行チェックリストに組込む**。ガイドは MigrationGuide エンティティとして構造化（推奨：US-4.5 AC2 準拠・自動チェック可能）
- B) ガイドは散文 README のみ（構造化しない）
- X) Other

[Answer]: A

### FDQ8. 移行進捗の可視化と単一の真実源（ポータル/version-matrix 連携）
移行率・完了状態をどこで一元管理し、誰が読むか。
- A) **製品 repo に機械可読な移行マニフェスト（移行済み画面/全画面/critical flows/比率/ラッパー期限）を置き、U5 の version 収集と同じクローリングでポータル（U2 運用ビュー）に集約表示**。registry エントリと紐付け（推奨：自動収集=ADQ・既存 version-matrix 基盤の再利用・手動更新排除）
- B) 各 repo の README にバッジ表示のみ（集約しない）
- C) ポータルに手動入力
- X) Other

[Answer]: A
