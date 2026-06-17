# AI-DLC State Tracking

## Project Information
- **Project Type**: Brownfield
- **Start Date**: 2026-06-05T00:00:00Z
- **Current Stage**: INCEPTION - Workspace Detection (complete) → Reverse Engineering (in progress)
- **Initiative**: FIG Core DS ブラッシュアップ＋自社デザイン資産の蓄積循環システムの設計（Inception再実行）

## Workspace State
- **Existing Code**: Yes
- **Reverse Engineering Needed**: Yes
- **Workspace Root**: c:\work\AI-DLC\Design System\aidlc-workflows
- **Programming Languages**: JavaScript/JSX (React), CSS (design tokens), HTML, Markdown
- **Build System**: npm (React / CRACO in ProductA)
- **Project Structure**: マルチリポジトリ（ポータル大元 + FIG-UDS[Core DS/拡張] + ProductA[サンドボックス]）

## Code Location Rules
- **Application Code**: Workspace root (NEVER in aidlc-docs/)
- **Documentation**: aidlc-docs/ only
- **Structure patterns**: See code-generation.md Critical Rules

## Key Existing Assets (pre-analysis)
- **FIG Core DS（中核）**: FIG-UDS.git `master`(9ee445a) — 24コンポーネント、三層アーキテクチャ（primitives/semantic/components）。★第一のブラッシュアップ対象、全拡張の親
- **拡張プロジェクト busapp**: FIG-UDS.git `main`(6f36074) の `extensions/busapp` — Card/Button/FAB/TextField 等
- **ポータル大元**: aidlc-workflows.git（awslabs AI-DLC framework fork）
- **ProductA**: ProductA.git — Core DS submodule 検証用サンドボックス（検証後削除予定）

## Confirmed Direction (Inception goals)
- 3層: ① FIG Core DS（恒久・SemVer） / ② 拡張プロジェクト（製品単位・独立repo・スコープ分離） / ③ ポータル（集約・HTML・GitHub共有）
- バージョニング: Core DS に SemVer タグ採用（旧方針=コミットハッシュ/SemVer不採用から**転換**）。各プロジェクトは参照Coreバージョンを pin＋明示
- 既存プロジェクト取り込みフロー（Core導入前の資産）を設計に含める
- 保留解除（Inceptionで固定）: 各拡張プロジェクト自体のバージョン管理方針 / HTML差分可視化環境の要否・方式

## Reverse Engineering Status
- [x] Reverse Engineering - Completed on 2026-06-05
- **Artifacts Location**: aidlc-docs/inception/reverse-engineering/
- **Key findings**: コンポーネント spec の散在(10/28/4)、main/master 2系列同居、自己参照submodule二重ネスト、SemVer/バージョン管理の不在、スコープ分離・既存取り込み導線の不在

## Extension Configuration
| Extension | Enabled | Decided At |
|---|---|---|
| Security Baseline | Yes | Requirements Analysis |
| Property-Based Testing | No | Requirements Analysis |

## Requirements Analysis Decisions (Q1-Q10)
- Q1=A: Core DS 正典24は `main/existing-code`(約28)を重複排除・取捨選択して24に整理
- Q2=A: 段階構築（①Core DS→②ポータル→③template＋既存取り込み→④CI/CD自動化→⑤showcase）
- Q3=B: 移行完了＝主要フロー100%＋全体≧80%（レガシー画面に引きずられない）
- Q4=B: Core Maintainer＝デザイナー＋エンジニア2名体制
- Q5=Other: 既存 Interactive Prompt Generator（assets/js/ai-co-creation.js）を拡張し、複製・変数置換・初期設定をAIエージェントが自律実行
- Q6=A: showcase は自動クローリングで一覧化
- Q7=A: ポータルは GitHub Pages でホスティング
- Q8=A: WCAG 2.1 AA を正式目標
- Q9=A: Security Baseline 有効（適用ルールを enforce、非該当は N/A）
- Q10=C: PBT 無効（UI中心のため skip）
- 既存資産発見: `extensions/template/`(master, 雛形), `assets/js/ai-co-creation.js`(Interactive Prompt Generator), `assets/js/portal-content.js`(ポータルIA/Contribution)

## Confirmed Decisions (through RE review, CR1-12 + approval)
- **template**: 雛形は汎用 `template`（busapp は実製品）。GitHub Template Repository 機能で複製、初回セットアップで製品名/signature色/カテゴリ/CI-CD/`.fig-profile-*` を注入
- **ポータル閲覧**: ①コンポーネント単体 ②ページ遷移 ③デモ画面。cloudscape.design 風・左サイドナビ
- **ポータル IA**: サイドメニュー上位3区分=概要/プロジェクト集/運用 ＋ 使い方(操作随伴ガイド)
- **rolling vs pin**: ポータル=最新Core常時反映(pinしない) / 拡張=特定バージョンpin
- **デバイス3プロファイル**: Web-Admin(PC/情報密度) / Mobile-Consumer(スマホ/操作性) / Mobile-Terminal(業務端末/固定視認性)。ポータルはWeb-Admin
- **taxonomy**: カテゴリ>サブカテゴリ>プロジェクトの多階層。Core Maintainer がガバナンス(命名/構造/追加再編承認)
- **Core昇格フロー**: 既存正典(Contributionページ)準拠5ステップ。低ハードル提案+Maintainer伴走、ショーケース、二段レビュー/リリース列車、VRT、後方互換/ラッパー
- **操作随伴ガイド原則**: 操作依頼の全場面に再現可能な使い方ページ必須。表現はツール非依存(各チーム標準のGit/AIアシスタント)
- **情報設計**: 玄人最適化(最小クリック・一面完結)、詳細how-toは別ページ遷移
- **スコープ分離手段**: ★**マルチレポ**確定（AIにはCore＋対象製品repoのみ渡す）
- **バージョン参照確認**: 自動収集(ポータルビルド時に各repoのpin情報をクローリングし一覧化)
- **CI/CD自動化クラスタ**: 層Lint(三層ガードレール)＋バージョン収集＋VRT
- **段階移行基準**: 1画面内の新旧混在=不可 / 画面間=期限付き許容 / 完了=定量チェックリスト

## Execution Plan Summary
- **Total Stages（残）**: Inception 2（AD/UG）＋ Construction 6
- **Stages to Execute**: Application Design, Units Generation, Functional Design, NFR Requirements, NFR Design, Infrastructure Design, Code Generation, Build and Test（全 EXECUTE）
- **Stages to Skip**: なし
- **Unit 順序**: ①Core DS → ②ポータル → ③template/既存取り込み → ④CI/CD → ⑤showcase（横断: サンドボックス）

## Stage Progress

### 🔵 INCEPTION PHASE
- [x] Workspace Detection — Completed 2026-06-05
- [x] Reverse Engineering — Approved 2026-06-05（CR1-12 反映済み）
- [x] Requirements Analysis — Approved 2026-06-05 / requirements.md 生成
- [x] User Stories — Approved 2026-06-05 / personas.md(5) + stories.md(epic①〜⑤+横断) 生成
- [x] Workflow Planning — Approved 2026-06-05 / execution-plan.md 生成
- [x] Application Design — Approved 2026-06-05 / components/methods/services/dependency/application-design 生成
- [x] Units Generation — Approved 2026-06-05 / unit-of-work + dependency + story-map 生成（7 Unit）→ **INCEPTION 完了**

### 🟢 CONSTRUCTION PHASE（per-unit loop）
- [x] **U1 Core DS — 全ステージ完了** Approved 2026-06-05（Functional/NFR Req/NFR Design/Infra/Code Gen）/ origin/core=d336715
- [x] **U2 Portal — 全ステージ完了** Approved 2026-06-09（Functional/NFR Req/NFR Design/Infra/Code Gen）/ `portal/` 生成・test 16 pass・build 成功
- [x] **U3 Template & Setup — 全ステージ完了** Approved 2026-06-09（Functional/NFR Req/NFR Design/Infra/Code Gen）/ `fig-ext-template/` 生成・init dry-run 成功
- [x] **U4 Migration — 全ステージ完了** 2026-06-09（Functional/NFR Req/NFR Design/Infra/Code Gen）/ `fig-ext-business-busapp/` 生成・`fig-ext-template/scripts/{migrate-in,migration-status}.mjs` 追補・migration-status PASS(4/5=80%・critical100%・completed・gate exit0)
- [x] **U5 CI/CD — 全ステージ完了** 2026-06-10（Functional/NFR Req/NFR Design/Infra/Code Gen）/ Core 共有 CI 正典（`_shared-{guardrail,vrt,registry-check}.yml`＋`ci/{lint,vrt,registry}`）＋ portal `collect-versions.mjs` 生成・既存テンプレ ci スタブを `uses:` 実体参照へ差替え・検証 PASS（lint fixture good/bad・registry empty/bad・portal build＋test16 pass）
- [x] **U6 Showcase — 全ステージ完了** 2026-06-10（Functional/NFR Req/NFR Design/Infra/Code Gen）/ `portal/scripts/collect-versions.mjs` に `collectShowcase()` 追加（単一クローラ拡張・CI-4）・`build.mjs` 配線・`views.js renderShowcase()` 実体化・`portal-app.css` バッジ追補・検証 PASS（build 成功・npm test 16 pass・collectShowcase モック10アサーション・view 分岐スモーク）
- [x] **U7 Sandbox — 検証完了** 2026-06-10 / `aidlc-projects/ProductA` を現行 Core（`core`@d9919f9・CSSクラス`.fig-*`）へ再配線・submodule取込→`craco build`成功→bundleにCoreクラス64種確認。本番pin検証/削除は checklist E-9/F-5 へ委譲
- [ ] Build and Test — EXECUTE（全 Unit 後）

### 🟡 OPERATIONS PHASE
- [ ] Operations — PLACEHOLDER

## Current Status
- **Lifecycle Phase**: CONSTRUCTION（INCEPTION 完了済み）
- **Current Stage**: U1 Core DS 承認・完了 → **U2 Portal 着手前**
- **Code Gen 進捗**: [x]S1 repo整理 [x]S2 トークン [x]S3 プロファイル [x]S4 基盤3部品 [x]S6 メタデータ [x]S7 エイリアス [x]S8 リリース基盤 [x]Phase1b push(core) / 残 [ ]S5 残コンポーネント拡充 [ ]S9 CIフック(U5整合) [ ]S10 docs
- **要ユーザー操作**: GitHub で FIG-UDS のデフォルトブランチを `core` に変更（busapp 移設後に main/master 整理）
- **コミット(core)**: dc9cd69(整理) → 6b5a6fc(メタデータ/リリース基盤) → 2ffee42(feedback部品)。remote: origin/core(2ffee42は未push)
- **U1 Code Gen**: ✅ Step1-8,10 完了。CSS30クラス=28部品全カバー、28 spec 完備、README刷新、メタデータ/リリース基盤。Step9 CI=U5委譲。preview 5状態追補=任意継続
- **origin/core 最新**: d9919f9（全 push 済み）。…→5521351(gallery)→d9919f9(signature.css+states)
- **検証用**: `preview/_core-gallery.html`（全30部品）/ `preview/_states.html`（主要部品の状態5+）
- **U1 仕上げ**: ✅ signature.css(再テーマ機構, index.htmlの404解消)、状態プレビュー追補。残: fig-sense契約(デザイナー精査)、全28部品の個別preview(任意/U2 Portalで正規整備)
- **要ユーザー操作(再掲)**: GitHub で FIG-UDS デフォルトブランチを core に変更
- **NRQ2 更新**: Core=CSSクラス方式（.fig-*）採用、JSXは持たない
- **要ユーザー操作の統合チェックリスト**: `aidlc-docs/user-actions-checklist.md`（非エンジニア向け・順序付き・全GitHub操作を集約）。方針=全GitHub操作はBuild & Test直前に一括実施（ユーザー決定）。U5/U6/U7 完了時に各操作を本シート フェーズE/F へ追記すること。
- **U5 Code Gen 成果**: Core repo（`aidlc-projects/FIG-Universal-Design-System/`）に共有 CI 正典＝`.github/workflows/_shared-{guardrail,vrt,registry-check}.yml`・`.github/actions/three-layer-lint/`・`ci/{lint[three-layer-lint.mjs+lint-rules.json+__fixtures__],vrt[vrt-runner.mjs+package.json],registry[check-registry.mjs+schema+__fixtures__]}`＋各 README。portal に `scripts/collect-versions.mjs`（CI-3 単一クローラ・version-matrix＋migration-index・fail-soft）を生成し build.mjs へ配線（version-matrix スタブ→実収集／showcase は U6 までスタブ維持）。既存テンプレ `fig-ext-template/ci.yml`・`fig-ext-business-busapp/migrate-checks.yml` の Lint/VRT echo を `uses: _shared-*.yml@<pin>` へ差替え・register.yml に CI-5 検査先明記。設計判断: Lint は色トークン化を error 化（px は warn）・色 primitive 直参照のみ層逆流判定・軽量 Node 単体（stylelint 非依存）・VRT は依存無しで graceful skip・収集 fail-soft。検証: lint fixture(good clean/bad error3+warn1・color primitive57/242)・registry(empty pass/bad C2-4)・VRT(skip exit0)・portal build(収集+schema OK)・portal test 16 pass。Core 自身は既存 CSS 負債866 error 可視化（段階導入・主対象は拡張製品）。US-4.1/4.2/4.3・CI-5 実装。
- **U5 要ユーザー操作**: Core に共有CIマージ→参照タグ発行／各 repo の `uses:` を実org・@ref(拡張pin/portal main)へ差替え／branch protection で guardrail・vrt・registry-check を required 化／portal 収集変数(GH_OWNER/CORE_DS_REPO/read token)＋トリガ(push/repository_dispatch/nightly)／（任意）Core 既存CSS負債の段階解消。詳細は `user-actions-checklist.md` フェーズ E（E-1〜E-5 追記済み）。
- **Construction 進捗**: [x]U1 Core DS [x]U2 Portal [x]U3 Template&Setup [x]U4 Migration [x]U5 CI/CD [x]U6 Showcase [x]U7 Sandbox → **全 Unit 完了**・次は全 Unit 後 Build & Test
- **U7 Code Gen 成果**: `aidlc-projects/ProductA`（React18+CRACO サンドボックス）を**現行正典 Core へ再配線して配布機構を検証**。旧配線（submodule=`main`@6f36074・`extensions/busapp` JSX import）は U1 の CSSクラス化前のモデルだったため、submodule を `core`@d9919f9 へ更新し `src/App.jsx` を **CSSクラス方式（`.fig-*`）消費**へ書換（`primitives/semantic/tokens{signature,base,profile-terminal,components}.css` import＋`.fig-profile-terminal`/`fig-card`/`fig-form-group`/`fig-input`/`fig-button`/`fig-fab`）。`craco.config.js`（ModuleScopePlugin除去+`@design-system`alias）は無改修でCSS submodule importを解決。検証 PASS（V1–V5）: `craco build`=Compiled successfully（js46.31kB/css10.56kB gzip）・bundle CSS に Core `.fig-*` **64種**確認・`.fig-profile-terminal`適用確認。ローカル Core 実体に対する検証で、**本番（実GitHub URL＋SemVerタグpin）での再検証＋ProductA削除は checklist E-9/F-5 へ委譲**（Core タグ未発行・GitHub操作はBuild&Test直前一括の方針）。成果物 docs=`aidlc-docs/construction/u7-sandbox/{verification-design,verification-report}.md`。US-X.1 AC1 充足。
- **U6 Code Gen 成果**: portal 配下に完結（aidlc-docs 外）。`portal/scripts/collect-versions.mjs` に `collectShowcase()` を追加＝U5 単一クローラ基盤を拡張し showcase-index を**同一走査**で収集（BR-CI-1CRAWL）。収集源2系統＝各 repo `extensions/`（kind=extension・compat/index/README/隠し除外・ヘッダ `// EXTENSION PART — <name>` から name 抽出）＋`temp-part` ラベル Issue（kind=temp-part・PR 除外）。registry 駆動・`ownerProjectId`=projectId。`promotable` 既定 true（US-5.2 AC1）／`promotedToCore`=Core `components/*.spec.md` 同名/同義照合（正規化＋別名表＋製品プレフィックス endsWith 吸収・照合不能は false 据置）。fail-soft（個別 skip／GH_OWNER 未設定は据え置き）。`build.mjs` は version 収集と同じ箇所で `collectShowcase()` を呼出（スタブ生成を実体へ差替え）。`views.js renderShowcase()` を実体化＝空状態を**未収集/収集済み0件で文言区別**（BR-SC-EMPTY）・拡張バッジ（`.fig-badge--ext`）・preview 導線・`promotedToCore`→「Core昇格済み・撤去推奨」・`promotable && !promotedToCore`→「昇格を提案する →」(`#/usage/promotion`)・`esc()` で XSS 防止。契約 `showcase-index.schema.json` は**不変で充足**。US-5.1/5.2 実装。検証: build 成功（schema OK）・npm test 16 pass・collectShowcase モック機能テスト10アサーション PASS（Fab→Core(fab) promotedToCore=true 含む）・renderShowcase 分岐スモーク全 ✓
- **U6 要ユーザー操作**: 収集トークンに `issues:read` 追加（`contents:read`/`GH_OWNER`/`CORE_DS_REPO` は U5 E-4 と共有）／各製品 repo に `temp-part`・`core-promotion` ラベル作成／Core 昇格時の「撤去推奨」表示確認・仮コード撤去。詳細は `user-actions-checklist.md` フェーズ E（E-6〜E-8 追記済み）
- **Next Stage**: **U7 完了 → 全 Construction Unit 完了**。次は全 Unit 後の **Build & Test**（＋ checklist フェーズ A〜F の要ユーザー操作を一括実施）
- **Status**: U1/U2/U3/U4/U5/U6/U7 完了（全 Unit 完了）。残=Build & Test
- **U4 Code Gen 成果**: `fig-ext-business-busapp/`（project-settings[business/Mobile-Terminal/pin v1.0.0]・legacy/busapp[代表スナップショット]・migration/{component-mapping,migration-manifest}.json・src/{Button,Card,TextField}.jsx+compat.js・extensions/Fab.jsx・styles/extensions.css・preview/pass-issue.html・.github/workflows/migrate-checks.yml・AGENTS/SKILL/README）＋`fig-ext-template/scripts/{migrate-in,migration-status}.mjs`・schema/migration-manifest.schema.json。検証: migration-status PASS(4/5=80%・critical pass-issue 100%・completed)、gate exit0、migrate-in dry-run動作。US-3.5/3.6/4.5実装。
- **U4 要ユーザー操作**: GitHub repo化(Template派生)／Core submodule配線・pin／実migrate-in(FIG-UDS main/extensions/busapp)／registry PR最小権限トークン／U5 Lint/VRT/収集SHA配線／taxonomy category=business承認
- **Construction 進捗**: [x]U1 Core DS [x]U2 Portal [x]U3 Template&Setup / 残 U4,U5,U6,U7 → 全 Unit 後 Build & Test
- **U3 Code Gen 成果**: `fig-ext-template/`（project-settings.json+schema・index.html[core/ submodule参照]・styles・CORE-DS-VERSION・scripts/init.mjs[冪等/dry-run/verify/pin整合]・tools/prompt-generator/[正典移管vanilla]・AGENTS.md[Runbook]・SKILL.md[ScopeManifest]・.github/workflows/{ci,register}.yml[SHA pin・U5参照]・README）。検証: init.mjs --dry-run 成功。US-3.1〜3.4 全実装。
- **U3 要ユーザー操作**: GitHub Template Repository 化／REGISTRY_PR_TOKEN(最小権限)／Actions SHA 更新・U5 Lint/VRT 配線
- **U3 Infra 確定(IDQ1-5=全A)**: ①新規standalone fig-ext-template GitHub Template化(GitHub化は要ユーザー操作) ②registry PR=製品Actions+最小権限/App cross-repo ③Generator/init/runbookはテンプレ同梱 ④本Code Gen配置=`aidlc-workflows/fig-ext-template/`サブツリー ⑤CI雛形同梱(U5参照・Actions SHA pin)
- **U3 FD 確定(FDQ1-8=全A)**: ①standalone fig-ext-template(GitHub Template) ②project-settings.json単一入力契約 ③project-settings駆動変数置換 ④submodule pin+CORE-DS-VERSION二重 ⑤registry自動PRガードレール(AI起票+CI-5+Maintainer) ⑥CI雛形同梱(ロジックU5参照) ⑦マルチレポ物理分離+ScopeManifest ⑧Prompt Generator正典U3・ポータル導線
- **Construction 進捗**: [x]U1 Core DS [x]U2 Portal / 残 U3,U4,U5,U6,U7 → 全 Unit 後 Build & Test
- **U2 Code Gen Part2 成果**: `portal/`（src/{portal,router,nav,content,views,usage,state,ai-co-creation,feedback}.js・index.html・assets/{portal,portal-app}.css・vendor/core[取込]・data/[registry/taxonomy/契約stub]・schema/[2 JSON Schema]・scripts/{build,dev-serve}.mjs・tests/[16 pass]・.github/ISSUE_TEMPLATE/[temp-part,core-promotion]）＋ root `.github/workflows/portal-deploy.yml`。検証: npm test=16 pass / build.mjs=成功。US-2.1〜2.7 全実装。
- **U2 要ユーザー操作**: GitHub Pages 設定を「GitHub Actions」ソースへ／`CORE_DS_REPO`/`CORE_DS_REF` variables 設定／Core release から `repository_dispatch(core-released)` 配線（rolling 自動追従）
- **U2 Code Gen 方針**: アプリコード生成先=`aidlc-workflows/portal/`(workspace root直下サブツリー・フレームワーク衝突回避)。ポータル固有のみ移設、Core資産はビルド時取込(vendor/core+data)。15ステップ: ①scaffold ②移設 ③ビルドpipeline ④契約schema+stub ⑤IA再編+router ⑥taxonomy駆動nav ⑦Project View(3形態/iframe) ⑧運用ビュー(版/showcase) ⑨使い方 ⑩ドッグフーディング ⑪UiState ⑫security ⑬test ⑭CI/CD(Actions→Pages) ⑮docs
- **U2 Infra 確定事項(IDQ1-5=全A)**: ①Pages=Actions artifact直接デプロイ(gh-pages不要) ②rolling再ビルド=多重トリガ(push/Core repository_dispatch/nightly/手動) ③ドメイン=デフォルトgithub.io ④runner=GitHub-hosted(ubuntu+Node LTS) ⑤repo=aidlc-workflowsにポータル資産配置(Core実体は移設せずビルド時取込)。移設チェックリストはCode Genで実施
- **U2 NFR Design 要点**: Resilience=build fail-fast+空状態/fallback / Scalability=taxonomy駆動+契約取込 / Performance=最小依存+自己ホストSRI+遅延描画 / Security=iframe sandbox+SRI+CSP+SCA(サーバ系N/A) / 論理要素=ビルドパイプライン(LC-B1-7)+データ層(LC-D1-4)+SPA層(LC-R1-5)+境界(LC-X1-3)、従来型基盤(queue/cache/CB/LB/DB)はN/A
- **U2 NFR 確定事項(NRQ1-9=全A)**: 軽量Nodeビルド/ローカルCore参照(rolling)/性能(初回≦2.5s・遷移即時・LH≧90)/エバーグリーン/Pages一本化/Security Baseline静的サブセット(SCA・iframe sandbox・SRI・CSP・機密非保持、サーバ系N/A)/CDN自己ホスト+SRI/契約はJSON Schema検証+VRT
- **U2 FD 確定事項(FDQ1-10=全A)**: ①repo=aidlc-workflowsへ移設 ②IA4区分再編(概要/プロジェクト集/運用/使い方) ③プロジェクト集のみtaxonomy駆動 ④閲覧3形態=registry+iframe(Core preview暫定) ⑤rolling=ビルド時取込 ⑥version-matrix/showcaseはU2でスキーマ確定+ビュー先行(収集U5/U6) ⑦ドッグフーディング業務規則化(temp-part/core-promotion) ⑧使い方ページ独立エンティティ(目的→前提→手順→確認) ⑨状態=URL+localStorage ⑩ai-co-creation.jsはU3管轄/feedback.js再評価
- **Units**: U1 Core DS / U2 Portal / U3 Template&Setup / U4 Migration / U5 CI-CD / U6 Showcase / U7 Sandbox
- **Unit 進行順**: ①U1 → ②U2/③U3(並行可) → ④U4 → ⑤U5 → ⑥U6（横断U7随時）

## Application Design Decisions (ADQ1-6 + FQ1)
- ADQ1=A: ポータル＝vanilla JS SPA踏襲（既存portal-content.js拡張）
- ADQ2=A: デモ＝iframe埋め込み
- ADQ3=A+: 中央registry.json＋新規セットアップ時にAIが登録PRを自動起票
- ADQ4=A/FQ1=A: taxonomy.json も registry.json も Core DS に集約（単一正典・Core Maintainer管理）
- ADQ5=A: 命名 fig-ext-<category>-<product>
- ADQ6=A: git submodule配布（pin+CORE-DS-VERSION / ポータルrolling）
- [ ] User Stories
- [ ] Workflow Planning
- [ ] Application Design
- [ ] Units Generation
