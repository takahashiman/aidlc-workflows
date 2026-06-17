# U2 Portal — Infrastructure Design Plan

> U2 = vanilla JS 静的 SPA。実行時バックエンド無し。基盤は **GitHub（repo＋Actions＋Pages）** が中心。
> NFR/FD 確定: Pages 一本化(NRQ5=A)・軽量 Node ビルド(NRQ1=A)・ローカル Core 参照 rolling(NRQ2=A)・自己ホスト+SRI(NRQ7=A)。
> 下部 `[Answer]:` にご記入ください。A=推奨。

## 生成する成果物（チェックリスト）
- [x] `infrastructure-design.md` — repo/CI/Pages 基盤、ビルドパイプラインの基盤マッピング、rolling 追従機構、シークレット/権限
- [x] `deployment-architecture.md` — デプロイ・アーキ（GitHub Actions → Pages）と環境・トリガ

## カテゴリ評価（MANDATORY・根拠付き）
| カテゴリ | 評価 | 根拠 |
|---|---|---|
| Deployment Environment | **適用（GitHub Pages）** | 静的ホスティング。クラウド計算環境なし（NRQ5=A） |
| Compute Infrastructure | **代替（CI runner のみ）** | 実行時 compute なし。ビルド時のみ GitHub Actions runner |
| Storage Infrastructure | **N/A** | DB/永続化なし。状態は静的 JSON＋localStorage |
| Messaging Infrastructure | **N/A（一部 dispatch）** | キュー無し。Core 追従は repository_dispatch を任意検討（IDQ2） |
| Networking Infrastructure | **代替（Pages/CDN）** | LB/API GW 無し。配信は Pages の CDN |
| Monitoring Infrastructure | **代替（CI＋Lighthouse/VRT）** | サービス監視なし。代替＝CI チェック・Lighthouse・VRT(U5) |
| Shared Infrastructure | **適用** | Core DS（registry/taxonomy/トークン）を共有参照・共有 Lint(U1/U5) |

## 確認質問

### IDQ1. GitHub Pages デプロイ機構
- A) **GitHub Actions で artifact を直接 Pages へデプロイ**（公式 `actions/upload-pages-artifact`＋`actions/deploy-pages`。`gh-pages` ブランチを汚さない・履歴クリーン）（推奨）
- B) ビルド出力を `gh-pages` ブランチへコミットして公開（従来方式）
- C) `docs/` ディレクトリ公開（main の `/docs` を Pages ソースに）
- X) Other

[Answer]: A

### IDQ2. rolling 追従の再ビルド・トリガ（Core 更新の反映）
ポータルは Core を pin しない（rolling）。Core が別 repo のため、Core 更新時の再ビルド契機を決める。
- A) **多重トリガ**: ①`aidlc-workflows` への push（ポータル変更）②Core repo からの `repository_dispatch`（Core リリース時に通知）③定期（nightly schedule）④手動（`workflow_dispatch`）（推奨：自動追従＋取りこぼし防止）
- B) push ＋ 手動のみ（Core 追従は人が再実行）
- C) 定期（nightly）＋ 手動のみ
- X) Other

[Answer]: A

### IDQ3. 公開ドメイン
- A) **デフォルト `*.github.io`（プロジェクトページ）**: 社内 URL 共有に十分・設定不要（推奨）
- B) カスタムドメイン（CNAME 設定・DNS 管理が必要）
- X) Other

[Answer]: A

### IDQ4. ビルド/デプロイ実行環境（runner）
- A) **GitHub-hosted runner（`ubuntu-latest`＋Node LTS）**: 管理不要・無料枠（public/社内）（推奨）
- B) self-hosted runner（社内ネット/専用環境が必要な場合）
- X) Other

[Answer]: A

### IDQ5. リポジトリ確立（既存ポータル資産の移設・FDQ1=A 整合）
FDQ1=A で「ポータルは `aidlc-workflows` を正式 repo とし既存資産を移設」と確定済み。移設の進め方。
- A) **本 `aidlc-workflows` repo にポータル資産（portal*.js / portal.css / index.html / data / vendor）を配置**し、`aidlc-docs/`（設計）と共存。Pages はポータル成果物を公開（推奨：現 repo を活用・追加 repo 不要）
- B) ポータル専用 repo を別途新設し、`aidlc-workflows` はワークフロー/設計専用に戻す
- X) Other

[Answer]: A
