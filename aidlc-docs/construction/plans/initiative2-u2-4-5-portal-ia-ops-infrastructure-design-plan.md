# Infrastructure Design Plan — U2-4/U2-5 ポータル IA・操作完結（Part 1）

> 対象: U2-4/U2-5 統合（ポータル IA・操作完結）。repo: `aidlc-workflows/portal/`。
> 前提継承: 既存 `portal-deploy.yml`（ubuntu・1 workflow で validate→npm test→build→Pages deploy・build 出力
> `portal/site`）。本ユニットで **Playwright（VRT＋axe a11y）をポータルに新設**（NQ1=B/NQ2=B）。
> Compute/Storage/Messaging/Networking N/A（静的 SPA・Pages）。Monitoring は CI 合否＋LH で十分。

## 確定済（前段）
- PQ1-4／NQ1-3。論点は配置粒度のみ＝VRT 対象範囲・Playwright webServer 起動・CI 集約先。

## 回答確定（2026-06-22）
- **IDQ45-1=B**: VRT 対象＝**Home＋未整備可視化「余白」＋使い方インデックス（シナリオA★最優先表示）**。
- **IDQ45-2=A**: Playwright webServer＝**build 出力 `portal/site` を静的配信**（Pages artifact と同一出力＝本番同等）。
- **IDQ45-3=A**: **既存 portal-deploy.yml に品質 job 追加**（build 後・deploy 前ゲート・1 workflow 集約）。

## 生成する成果物（Part 2）
- [x] `construction/u2-4-5-portal-ia-ops/infrastructure-design/infrastructure-design.md`
- [x] `construction/u2-4-5-portal-ia-ops/infrastructure-design/deployment-architecture.md`

---

## 質問（Part 1）

## Question IDQ45-1 — VRT 対象粒度
Home/ランディング以外にどこまで VRT を撮りますか？

A) **Home 必須のみ** — 最小。新設ランディングの見た目だけ固定。

B) **Home＋未整備可視化「余白」＋使い方インデックス（シナリオA★最優先表示）（推奨）** — 本ユニットで新設/変更した
   主要視覚面を網羅。回帰検出と撮影コストのバランス良。

C) **主要ビュー全部（overview/projects/ops も）** — 既存ビューは本ユニット非変更のため過剰。

[Answer]: **B**

## Question IDQ45-2 — Playwright webServer 起動方式
VRT/a11y 実行時にポータルをどう配信しますか？

A) **build 出力 `portal/site` を静的配信（推奨）** — `npm run build` 後に静的サーバで site を配信し Playwright が
   叩く。CI の Pages artifact と同一出力＝本番に最も近い検査。

B) **dev-serve.mjs（開発サーバ）を webServer に** — 手軽だが build 出力との差異リスク。

[Answer]: **A**

## Question IDQ45-3 — CI workflow 集約先
VRT＋a11y を CI のどこに置きますか？

A) **既存 portal-deploy.yml に品質 job 追加（推奨）** — build job の後・deploy の前にゲート（VRT＋a11y 失敗時は
   deploy しない＝fail-fast）。1 workflow 集約（U2-3 figuds-build.yml 集約と同方針）。

B) **新規 portal-quality.yml に分離** — 関心分離だが workflow 増・トリガ二重管理。

[Answer]: **A**
