# U5 CI/CD Automation — Functional Design Plan

> 対象 Unit: **U5 CI/CD Automation**（repo: 共有設定 ＋ 各 repo の workflow / 含む: CI-1, CI-2, CI-3, CI-5）
> 対象ストーリー: US-4.1 三層アーキガードレール / US-4.2 VRT をマージ条件に / US-4.3 バージョン参照の自動収集 ／ 関連 CI-5 registry 登録検査（US-3.2 連動）
> 技術非依存の詳細設計（共有 CI 資産の正典・三層 Lint ルール・VRT ゲート・version 収集クローラ・registry 登録検査・移行マニフェスト集約の統合）。
> 下部 `[Answer]: A` にご記入ください。A=推奨。**前 Unit 同様、全 A で進める場合は「全A」とだけご返信いただければ確定します。**

## 前提認識（U2/U3/U4 が残した「U5 参照」配線点のグラウンディング）
U5 は新規概念を足すのではなく、既に各 repo に**配線（呼び出し口）だけ用意済みのスタブ**を**実体化**する Unit。回収すべき具体スタブ:
- **`fig-ext-template/.github/workflows/ci.yml`**: 「Three-layer guardrail lint (U5 共有設定)」「Visual Regression Test hook (U5)」が `echo` のみ（実体未配線）。
- **`fig-ext-template/.github/workflows/register.yml`**: registry PR 起票はするが、検査（CI-5）は「CI(U5/CI-5)＋Maintainer」と委譲。
- **`fig-ext-business-busapp/.github/workflows/migrate-checks.yml`**: 三層 Lint・VRT・「migration-manifest を U5 収集で集約」が `echo`/`notice` のみ。
- **`portal/scripts/build.mjs`**: `version-matrix.json` / `showcase-index.json` を**スタブ生成**（`_note: "U5(CI-3) が自動収集に差替える"`）。
- **`portal/schema/version-matrix.schema.json`**: 収集結果の**契約は確定済み**（entries[]＝projectId/coreVersionPinned/coreVersionLatest/status/source）。U5 はこの契約を充足する生成器を作る。
- **Core(U1)**: registry.json / taxonomy.json が正典。**共有 Lint の「設定」は未実装**（U1 责务に名はあるがファイル無し）→ U5 が実体を作る。
- 確定方針（state Decisions）: **CI/CD 自動化クラスタ＝層 Lint（三層ガードレール）＋バージョン収集＋VRT**。Actions は **SHA pin（SEC-4）**、registry は **自動マージ禁止（SEC-2）**。マルチレポでスコープ分離。
- 関連 Unit: U1(Core 正典/registry-taxonomy/`.fig-*`三層)・U2(portal ビルド/version-matrix・showcase 契約/rolling)・U3(template/init/register)・U4(migration-status.mjs/manifest)・U6(Showcase 収集=同一クローリング基盤を共有)。

## U5 の責務マッピング（CI 番号 → ストーリー → スタブ回収先）
| CI | 責務 | Story | 実体化するスタブ |
|---|---|---|---|
| CI-1 | 三層ガードレール Lint（生 hex/px・`--fig-*` 非経由・層逆流） | US-4.1 | template/busapp ci の「U5 共有 Lint」echo |
| CI-2 | VRT をマージ条件（Core 変更で portal 巻込） | US-4.2 | template/busapp ci の「VRT hook」echo |
| CI-3 | バージョン参照の自動収集 → version-matrix.json | US-4.3 | portal build の version-matrix スタブ |
| CI-5 | registry 登録 PR 検査（スキーマ/taxonomy/命名/重複） | US-3.2 連動 | register.yml の検査委譲・Core 側ゲート |

## 生成する成果物（チェックリスト）
- [x] `business-logic-model.md` — 共有 CI 資産の配布モデル（正典→参照）／三層 Lint 判定アルゴリズム（層逆流・生値・非経由検出）／VRT ゲートの状態機械（baseline 比較・差分許容・Core→portal 連動トリガ）／version 収集クローラのフロー（registry 駆動探索→pin 抽出→matrix 生成→status 算出）／registry 登録検査アルゴリズム／移行マニフェスト集約の統合
- [x] `business-rules.md` — Lint ルール定義（BR-CI-Lint-*）・VRT マージ条件規則・収集の単一正典規則・registry 検査ゲート規則・SHA pin/最小権限/自動マージ禁止のセキュリティ規則・「二重実装しない（テンプレは配線・実体は U5 正典）」規則
- [x] `domain-entities.md` — SharedCIAsset(ReusableWorkflow/CompositeAction)・LintRuleSet・LintViolation・VRTBaseline・VRTRun/VRTDiff・VersionCollector・VersionMatrixEntry(既契約)・RegistryCheck・MigrationManifest(既/U4)
- [x] `frontend-components.md` — U5 は CI 基盤中心で UI は持たない。portal 運用ビュー（版ダッシュボード/PT-5）への**入力契約の充足**（version-matrix.json 生成）と、収集失敗時の空状態/fallback の入力契約のみ規定

## 確認質問

### FDQ1. 共有 CI 資産の配置と配布形態（U5 の物理アーキテクチャ・最重要）
各 repo の ci.yml が `uses:` で参照する「U5 共有設定」の実体をどこに置き、どう配布するか。
- A) **Core DS repo を共有 CI の正典**とし、`Reusable Workflows`（`.github/workflows/_shared-*.yml`）＋ `Composite Actions`＋ Lint 設定パッケージ（`ci/` 配下）を置く。各 repo は `uses: <org>/FIG-Core-DS/.github/workflows/_shared-guardrail.yml@<ref>` で参照。**ref は Core の SemVer タグに pin**（拡張）／ portal は rolling 追従（推奨：Core が既に registry/taxonomy/`.fig-*`/共有 Lint の正典＝単一正典で一貫・既存テンプレ配線が `org/FIG-Core-DS/...@ref` 前提・新規 repo 不要）
- B) 独立した共有 CI repo（`fig-ci`）を新設し全 repo が参照（CI 専用の関心分離・ただし repo 増・Core との二重統治）
- C) 各 repo にロジックを同梱コピー（参照なし・分散重複でドリフト）
- X) Other

[Answer]: A

### FDQ2. 三層ガードレール Lint の判定方式（CI-1 / US-4.1 AC1）
検出対象＝①生 hex/px ②`--fig-*` 非経由（semantic 変数を介さない値直書き）③層逆流（components から primitives 直参照）。実装の論理設計。
- A) **Core 正典の `LintRuleSet` を単一ソースに、CSS は stylelint（カスタムプラグイン）＋ 軽量スキャナ、JSX/HTML は静的スキャナで検査**。ルールは三層の参照グラフ（primitives←semantic←components の一方向）と「値は必ず `var(--fig-*)` 経由」を機械化。違反は `LintViolation`（file/line/rule/layer）で出力し**1件でも失敗**（推奨：US-4.1 AC1 直結・Core の三層定義に忠実・stylelint 資産流用）
- B) 正規表現ベースの軽量 grep 検査のみ（層逆流の構造解析は省略・取りこぼし）
- C) 既存 OSS stylelint ルールの組合せのみ（独自三層規則は表現できず不足）
- X) Other

[Answer]: A

### FDQ3. VRT の方式と baseline 管理（CI-2 / US-4.2）
preview/*.html を視覚回帰でゲートする手段と baseline の置き場。
- A) **ヘッドレスブラウザ（Playwright）で preview スナップショット→ baseline 比較**。baseline は**各 repo 内にコミット**（`preview/__baseline__/`）し、PR 差分はアーティファクト＋PR コメントで提示。差分許容（しきい値）超過で**マージブロック（required check）**。承認は baseline 更新コミットで明示（推奨：U4 で baseline=legacy preview を既に想定・差分の説明責任が PR に残る・PERF-2 の差分画面限定と両立）
- B) baseline を Core 集中管理（cross-repo 同期コスト大）
- C) 外部 VRT SaaS（Chromatic 等）に委譲（コスト/外部依存・自己ホスト方針と不整合）
- X) Other

[Answer]: A

### FDQ4. 「Core 変更でポータルを巻き込む VRT」の連動方式（US-4.2 AC1）
US-4.2 AC1＝Core 変更 PR で**ポータル VRT が走り**差分が許容外なら Core PR をマージ不可。cross-repo 連動の論理設計。
- A) **Core PR の CI が portal を rolling 取込でビルド→ portal preview を VRT**（Core 側 reusable workflow が portal を checkout し、当該 PR の Core を vendor 取込して描画差分を判定）。結果を Core PR の required check に反映（推奨：rolling の表示崩れを「Core をマージする前」に検出＝US-4.2 の意図そのもの・portal は U2 のビルドを再利用）
- B) Core マージ後に portal 側 nightly VRT で事後検出（事前ブロックにならず AC1 不充足）
- C) repository_dispatch で portal repo に投げ、結果待ち合わせ（非同期・PR ゲート化が複雑）
- X) Other

[Answer]: A

### FDQ5. バージョン自動収集クローラの実行場所とデータ源（CI-3 / US-4.3 AC1）
各 repo の pin（submodule / `CORE-DS-VERSION` / package.json）を集めて version-matrix.json を生成する仕組み。
- A) **portal ビルドの一部として収集クローラ（`scripts/collect-versions.mjs`）を実行**。探索対象は **registry.json 駆動**（登録済み全製品を列挙）、各 repo の pin を **GitHub API（contents）で取得**（チェックアウト不要・rolling 基準の最新 Core 版は Core の最新タグ）。出力は U2 確定の `version-matrix.schema.json` に準拠、`status` を pinned vs latest で算出（推奨：ADQ「自動収集」・既存 build.mjs スタブを実体化・契約済みスキーマ充足・手動更新排除）
- B) 各 repo が自身の pin を push 時に中央へ報告（分散・全 repo 改修必要）
- C) ローカル submodule の物理走査のみ（GitHub 上の最新を取れず status 不正確）
- X) Other

[Answer]: A

### FDQ6. 移行マニフェスト集約を version 収集に統合（U4 BR-VIS-2 の約束履行）
U4 は「migration-manifest.json は U5 version 収集と同一クローリングで集約」と明記。実装の統合方針。
- A) **collect-versions クローラを拡張し、同一パスで各 repo の `migration/migration-manifest.json` も収集**し portal 運用ビュー（移行進捗）へ供給。registry エントリと projectId で紐付け（推奨：U4 BR-VIS-2 履行・単一クローラで version/migration/（U6 で showcase）を一括＝走査の重複排除）
- B) 移行マニフェスト収集は U6 Showcase クローラに寄せる（version とは別系統・走査二重）
- C) portal に手動入力（自動化方針に反する）
- X) Other

[Answer]: A

### FDQ7. registry 登録 PR の検査ゲート（CI-5 / US-3.2・SEC-2 連動）
register.yml が起票する Core registry.json への PR を、Core 側で何を検査してマージ可否を決めるか。
- A) **Core repo の検査 workflow が registry PR に対し ①registry スキーマ検証 ②taxonomy 整合（category/subcategory 実在 or taxonomy 追記提案同梱）③命名規約 `fig-ext-<category>-<product>` ④重複（repo/name 衝突）⑤coreVersion 実在（タグ存在）を検査**。全通過でも**自動マージ禁止**、Core Maintainer 承認必須（SEC-2）。失敗は PR に注記（推奨：CI-5＝registry 登録検査の責務そのもの・Core 正典の健全性を機械保証・register.yml の委譲先を実体化）
- B) スキーマ検証のみ（taxonomy/命名/重複は人手・取りこぼし）
- C) 検査なしで Maintainer 目視（自動化価値なし）
- X) Other

[Answer]: A

### FDQ8. U5 成果物の物理配置（このワークスペース内での生成先）
Code Generation 時の配置（Critical Rules: アプリ/CI コードは workspace 配下、aidlc-docs/ には置かない）。
- A) **共有 CI 正典＝Core DS repo（`aidlc-projects/FIG-Universal-Design-System/`）の `.github/workflows/_shared-*.yml`・`.github/actions/`・`ci/`（lint 設定/ルール/VRT runner/検査スクリプト）／ version+migration 収集クローラ＝`portal/scripts/collect-versions.mjs`（build.mjs から呼出）／ 既存テンプレ（fig-ext-template・busapp）の ci スタブを実体参照（`uses:`）へ差替え／ register 検査 workflow＝Core 側に新設**（推奨：FDQ1/5/8 と一貫・各 Unit の所有境界を尊重・スタブを「配線済みの呼び出し口」として活かす）
- B) すべて Core repo に集約（portal クローラも Core 配下・portal ビルドとの結合が不自然）
- C) 新規 `ci/` トップ repo（FDQ1=B 採用時のみ）
- X) Other

[Answer]: A
