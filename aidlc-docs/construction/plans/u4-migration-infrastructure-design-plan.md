# U4 Migration — Infrastructure Design Plan

> U4 = 既存製品（busapp）の取り込み＋画面単位 Core 化＋完了判定＋後方互換。基盤 = **GitHub（拡張製品 repo＋Actions＋submodule）**。実行時バックエンドなし。
> 確定（FD/NFR）: U3 template 派生＋migrate-in / Core `.fig-*` クラス委譲 / 画面=原子の自動算出 / migration-manifest 集約 / 後方互換ラッパー期限管理。
> 下部 `[Answer]:` にご記入ください。A=推奨。

## 生成する成果物（チェックリスト）
- [x] `infrastructure-design.md` — 拡張製品 repo 確立・既存 busapp の取り込み元配線・migration-manifest 収集基盤・VRT/Lint 実行環境・registry PR / Core pin（U3継承）・シークレット/権限・Unit横断依存
- [x] `deployment-architecture.md` — 取り込み〜画面移行〜完了判定〜進捗集約の全体フロー・環境・トリガ・冪等/ロールバック・要ユーザー操作

## カテゴリ評価（MANDATORY・根拠付き）
| カテゴリ | 評価 | 根拠 |
|---|---|---|
| Deployment Environment | **適用（GitHub）** | 拡張製品 repo（GitHub）＋Actions。クラウド計算なし |
| Compute | **代替（CI runner / ローカル）** | 実行時 compute なし。移行スクリプト・算出・VRT は CI/ローカルのみ |
| Storage / Messaging / Networking | **N/A** | 永続化/キュー/LB なし（静的資産＋manifest JSON） |
| Monitoring | **代替** | CI チェック（混在検出・移行率・pin 整合・ラッパー期限・登録検査 CI-5） |
| Shared Infrastructure | **適用** | Core 正典（`.fig-*`/semantic/alias/registry/taxonomy）参照・PR で書込・version 収集基盤(U5)共有 |

## 確認質問

### IDQ1. 移行対象 repo の確立方法と命名（US-3.5 / ADQ5）
busapp を拡張枠の独立 repo にする方式と命名。
- A) **U3 `fig-ext-template` から派生して `fig-ext-<category>-busapp` を作成**（GitHub Template）。category は taxonomy 参照で確定（busapp=業務アプリ系 → 例 `fig-ext-business-busapp`）。本 Code Gen ではワークスペース内に雛形を scaffold し、GitHub 上の repo 化・Template 派生は要ユーザー操作（推奨：U3 導線再利用・マルチレポ整合）
- B) busapp 既存履歴を `git filter-repo`/subtree で抽出して新 repo 化し、後から template 資産を被せる（履歴重視）
- X) Other

[Answer]: A

### IDQ2. 既存 busapp 資産の取り込み元配線（migrate-in の入力）
取り込み元 = `FIG-UDS.git main(6f36074)/extensions/busapp/`。これを新 repo の `legacy/` へ取り込む手段。
- A) **migrate-in が取り込み元パス/参照を引数に取り、`legacy/` へコピー取り込み（冪等・ハッシュ突合）**。取り込み元は ①ローカルパス ②git URL+ref のいずれも受ける。履歴は持ち込まず資産のみ（移行は `legacy/` から減らす方向）（推奨：BR-MIG-3/4・隔離とロールバックの単純化）
- B) busapp を submodule として取り込み履歴も保持（移行後も submodule 残置）
- X) Other

[Answer]: A

### IDQ3. migration-manifest の収集・集約基盤（FDQ8 / BR-VIS）
製品 repo の `migration-manifest.json` をポータル運用ビューへ集約する基盤。
- A) **U5 の version 収集と同一クローリング（GitHub Actions/ビルド時）でマニフェストも収集**し、registry エントリと結合してポータル(U2)運用ビューに集約。U4 はマニフェスト生成器（状態→JSON）と schema を提供、収集ロジックは U5 参照（推奨：二重実装回避・既存基盤再利用）
- B) U4 独自の収集スクリプトを持つ（U5 と別系統）
- X) Other

[Answer]: A

### IDQ4. VRT / 三層 Lint の実行環境（MIG-Q1/Q3 / BR-SCR-4）
移行ゲート（写像前後の視覚回帰・三層違反検出）の実行基盤。
- A) **製品 repo の GitHub Actions で実行。VRT ベースラインは busapp 既存 `preview/*.html`＋移行後スナップショット、三層 Lint/VRT の実体・閾値は U5 共有設定を参照（Actions SHA pin）**。差分画面に限定実行可（推奨：FDQ/PERF-2・U5 責務分界）
- B) VRT/Lint を U4 製品 repo に内蔵（U5 と二重管理）
- X) Other

[Answer]: A

### IDQ5. 本 Code Gen でのワークスペース配置先
マルチレポの実 repo は外部 GitHub。今回の生成物（移行 repo 雛形・migrate-in 拡張・ComponentMapping・manifest schema・移行 runbook）の置き場所。
- A) **`aidlc-workflows/fig-ext-business-busapp/`（workspace root 直下サブツリー）に scaffold**し、後で独立 repo 化（U2 `portal/`・U3 `fig-ext-template/` と同方針・フレームワーク非衝突）。migrate-in 等の汎用ロジックは `fig-ext-template/scripts/` に追補（推奨）
- B) `aidlc-projects/` 配下に新規ディレクトリ
- C) 既存 FIG-UDS の extensions/busapp に in-place
- X) Other

[Answer]: A

### IDQ6. registry 登録 / Core pin（U3 継承の再確認）
取り込み時の registry 登録と Core pin。
- A) **U3 と同一**: Core を submodule pin＋`CORE-DS-VERSION`、registry へ最小権限トークン/PR（CI-5＋Maintainer）。取り込み製品も同じガードレールに乗せる（推奨：一貫性）
- B) 移行製品は当面 registry 登録を保留（pin のみ）
- X) Other

[Answer]: A
