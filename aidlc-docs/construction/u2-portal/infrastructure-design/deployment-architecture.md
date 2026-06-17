# U2 Portal — Deployment Architecture

> 確定回答: IDQ1-5 = すべて A。GitHub Actions → GitHub Pages の静的デプロイ。

## 1. デプロイ全体像
```
            ┌──────────────────────── triggers (IDQ2=A) ────────────────────────┐
            │ push(aidlc-workflows) │ repository_dispatch(Core release) │ nightly │ manual │
            └───────────────────────────────────┬───────────────────────────────┘
                                                 ▼
        GitHub Actions runner (ubuntu-latest / Node LTS, IDQ4=A)
        ┌──────────────────────────────────────────────────────────┐
        │ 1. checkout aidlc-workflows                                │
        │ 2. resolve & checkout Core (core HEAD/latest tag, no pin)  │
        │ 3. import: tokens/components css → vendor/core (無改変)     │
        │ 4. vendor: Prism 等 自己ホスト + SRI                         │
        │ 5. load data: registry/taxonomy(Core) + matrix/showcase    │
        │ 6. validate: JSON Schema + 孤児/必須キー  ── fail → 中断    │
        │ 7. test: routing / buildNav unit                           │
        │ 8. build: bundle/minify → site/                            │
        │ 9. (任意) Lighthouse CI 閾値チェック                         │
        └───────────────────────────┬──────────────────────────────┘
                                     ▼
        actions/upload-pages-artifact → actions/deploy-pages (IDQ1=A)
                                     ▼
                 GitHub Pages（*.github.io, HTTPS, CDN）(IDQ3=A)
                                     ▼
                         ポータル閲覧者（PC/Web-Admin）
```

## 2. 環境
| 環境 | 用途 | 公開 |
|---|---|---|
| **Production（Pages）** | 社内公開ポータル | `https://<org>.github.io/aidlc-workflows/`（IDQ3=A デフォルトドメイン） |
| **PR Preview（任意）** | レビュー用プレビュー | PR ごとの artifact / 任意（必須でない） |
| **Local** | 開発 | `scripts` でローカルビルド＋静的サーブ（オフライン可, BUILD-5） |

> 単一 Production を基本とする（静的・社内）。多段環境は持たない（過剰）。

## 3. デプロイ・パイプライン定義（論理）
- **Workflow**: `.github/workflows/portal-deploy.yml`（U2 が追加）。
- **Triggers**: `push`(paths: ポータル資産) / `repository_dispatch`(type: core-released) / `schedule`(nightly cron) / `workflow_dispatch`。
- **Permissions**: `pages: write`, `id-token: write`, `contents: read`。
- **Concurrency**: `group: pages` で同時デプロイを直列化（最新のみ反映）。
- **Jobs**: `build`（§1 ステップ）→ `deploy`（deploy-pages）。`build` 失敗時は `deploy` を実行しない（fail-fast, AVAIL-4）。

## 4. ロールバック / 履歴
- Pages デプロイは履歴を保持。問題時は前回成功デプロイへ再デプロイ（該当コミットで `workflow_dispatch` 再実行）。
- 成果物の決定性（同入力→同出力）により再現可能（VRT/MAINT-4 と整合）。

## 5. rolling の運用フロー（Core 更新 → 公開反映）
1. Core DS がリリース（SemVer タグ）。
2. Core release workflow が `aidlc-workflows` へ `repository_dispatch(core-released)`。
3. ポータルビルドが起動 → 最新 Core 取込 → 検証 → デプロイ。
4. 失敗（崩れ/契約違反）時はデプロイされず、前版が残る（fail-fast）。VRT は U5 で強化。
5. dispatch 取りこぼしは nightly が回収。緊急時は手動 `workflow_dispatch`。

## 6. コスト / 運用
- GitHub-hosted runner＋Pages（社内/public）で追加インフラコストなし（IDQ3/4=A）。
- 運用は「ビルド失敗通知の確認」と「Core 追従の自動化」に集約。常時稼働サービスの監視は不要（静的）。

## 7. 移設チェック（FDQ1=A / IDQ5=A）
- [ ] ポータル資産（index.html / assets / portal*.js / portal.css）を `aidlc-workflows` へ移設
- [ ] Core 実体は移設せずビルド時取込に切替（重複排除, BR-ROLL-3）
- [ ] CDN 参照（Prism 等）を自己ホスト＋SRI 化（NRQ7=A）
- [ ] `schema/` に version-matrix / showcase-index の JSON Schema を追加
- [ ] `.github/workflows/portal-deploy.yml` を追加
- [ ] Pages 設定を「GitHub Actions」ソースに切替
> これらの実体作業は **Code Generation** ステージで実施。
