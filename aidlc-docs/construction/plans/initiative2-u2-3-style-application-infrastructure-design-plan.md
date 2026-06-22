# Infrastructure Design Plan — U2-3 スタイル適用

> 対象: BusDelayAlerts（`feature/figuds-adoption`）。NFR Design 承認済（SP1〜SP7・LC-*）。
> U2-2 の配置（vendor/core・prebuild 生成・figuds-build.yml・GitHub-hosted runner）を前提継承。

## 設計ステップ（チェックボックス）
- [x] FD/NFR Design の LC-* を分析（配置が必要な要素を特定）
- [x] U2-2 既存配置（figuds-build.yml 等）を確認
- [ ] 文脈質問（IDQ1-3）にユーザー回答
- [ ] `infrastructure-design.md` / `deployment-architecture.md` 生成
- [ ] 承認ゲート

## カテゴリ別該当性（事前判定）
| カテゴリ | 該当 | 所見 |
|---|---|---|
| Deployment Environment | ○ | 既存 GitHub-hosted runner（ubuntu+Node LTS）。VRT 用ブラウザ追加が新規 |
| Compute/Storage/Messaging/Networking | N/A | 静的フロント・ビルド時生成・ランタイム無し |
| Monitoring | △ | CI 合否＋gzip 記録で十分（専用 observability 不要） |
| Shared Infrastructure | N/A | 製品 repo 内に閉じる（Core は submodule 継承） |

## 主要な未確定論点（→ 質問）
1. **LC-VRT の tool / CI 実行モデル**（NQ1=B・TSD3-4）— Playwright スクショの CI 実行・ベースライン OS 整合。
2. **LC-RawHexGuard の実装手段**（NQ2=A・TSD3-3）— 既存 CI への軽量スコープ step か ESLint ルールか。
3. **LC-VRT の対象粒度** — 主要ルートのページ単位か、主要コンポーネント単位か。

## 文脈質問（[Answer]: タグ）

### IDQ1 — VRT の tool / CI 実行・ベースライン整合
スクショ VRT はベースライン画像が OS 依存（ローカル Win/Mac と CI Linux で差分）。整合の取り方。
- A（推奨）: **Playwright を CI（Linux）で実行し、ベースラインは Linux で生成・repo 管理**（CI を真実源に）。ローカルは差分確認のみ。既存 `figuds-build.yml` に VRT job を追加。
- B: Playwright をローカル実行のみ（CI 非実行）。ベースラインはローカル生成・手動運用（CI 負荷増を回避）。
- C: Storybook + Chromatic（外部 SaaS）。

[Answer]: **A**（Playwright を CI[Linux] 実行・Linux ベースライン repo 管理・figuds-build.yml に VRT job 追加）。

### IDQ2 — 生 HEX ガードの実装手段
主要導線限定の `#RRGGBB`/`[#...]` 検出（fail）の実装。
- A（推奨）: 既存 `figuds-build.yml` に**スコープ付き検出 step を追加**（主要導線 glob に対する軽量スクリプト/grep ベース）。最小 CI 哲学（U2-2）を踏襲。
- B: ESLint ルール（arbitrary value 検出 plugin）を導入し lint 工程に組込む（設定増・IDE 即時フィードバック）。

[Answer]: **A**（figuds-build.yml にスコープ付き検出 step 追加・軽量 script/grep）。

### IDQ3 — VRT の対象粒度
- A（推奨）: **主要ルートのページ単位**（Home/RouteDetail 等の画面遷移先）。導線全体の見た目を担保。
- B: 主要コンポーネント単位（StatusBadge/RouteCard 等）。粒度細かく差分原因を特定しやすいが件数増。
- C: 両方（ページ＋主要コンポーネント）。

[Answer]: **C**（主要ルートのページ＋主要コンポーネント両方）。

## 完了後アクション
- 回答確定 → `infrastructure-design.md`＋`deployment-architecture.md` 生成 → 承認ゲート → Code Generation。
