# FIG Core DS ポータル（U2）

FIG デザインシステムの単一エントリポイント。**最新の Core DS を rolling 反映**し、3区分IA＋使い方で公開する vanilla JS 静的 SPA。

- 設計: `../aidlc-docs/construction/u2-portal/`（Functional / NFR / Infra Design）
- 確定方針: FDQ/NRQ/IDQ すべて A

## 構成
```
portal/
├─ index.html              # エントリ（CSP メタ・vendor/core + assets/* 読込・module script）
├─ src/
│   ├─ portal.js           # App Shell（PT-1）データロード/レイアウト/フォーカス管理
│   ├─ router.js           # Hash Router（parseRoute は純粋関数）
│   ├─ nav.js              # buildNav（taxonomy 駆動・純粋関数 / PT-2）
│   ├─ content.js          # 概要/運用 静的 IA（4区分 / FDQ2=A）
│   ├─ views.js            # Project/Ops/Usage ビュー（PT-3〜6,8）
│   ├─ usage.js            # 使い方ガイド（目的→前提→手順→確認 / PT-8）
│   ├─ state.js            # UiState（profile/version: URL+localStorage / FDQ9=A）
│   ├─ ai-co-creation.js   # U3(TM-2) 管轄・現状維持（FDQ10=A）
│   ├─ feedback.js         # 昇格提案/仮パーツ導線の母体（再評価）
│   └─ legacy/             # 旧 portal 資産の保全アーカイブ
├─ assets/                 # portal.css（移設）/ portal-app.css（SPA レイアウト）
├─ vendor/core/            # ★ビルド時に Core から無改変取込（gitignore）
├─ data/                   # registry/taxonomy（Core 取込）＋ version-matrix/showcase（契約スタブ）
├─ schema/                 # version-matrix / showcase-index の JSON Schema（U2 定義）
├─ usage/                  # （予約）使い方の追加コンテンツ
├─ scripts/                # build.mjs（rolling 取込・検証・バンドル）/ dev-serve.mjs
├─ tests/                  # routing / buildNav ユニット
└─ .github/ISSUE_TEMPLATE/ # temp-part / core-promotion（製品/template が採用）
```

## 開発
```bash
cd portal
npm install            # devDeps: ajv（スキーマ検証）
npm run build          # Core を rolling 取込 → 検証 → site/ 出力
npm run dev            # http://localhost:5173 で静的配信（事前に build 推奨）
npm test               # routing / buildNav / schema のユニットテスト
npm run validate       # 取込＋検証のみ（CI 早期失敗用）
```
Core の所在は自動解決（既定: `../aidlc-projects/FIG-Universal-Design-System`）。別所の場合は `CORE_DS_PATH=/path node scripts/build.mjs`。

## rolling（最新 Core 反映 / US-2.3）
- Core を **pin しない**。`build.mjs` が最新 Core からトークン/コンポーネント CSS を `vendor/core/` へ**無改変**取込（BR-ROLL-3）。
- 反映単位は**再ビルド**。CI（`.github/workflows/portal-deploy.yml`）が push / Core からの `repository_dispatch` / nightly / 手動で再ビルド→Pages デプロイ。
- 表示する「Core 版ラベル」は取込時の実版（表示専用・pin ではない / BR-ROLL-4）。

## IA（FDQ2=A）
- 上位4区分: **概要 / プロジェクト集 / 運用 / 使い方**。
- 「プロジェクト集」のみ `taxonomy.json` 駆動（FDQ3=A）。製品追加はコード改修不要。

## データ契約（FDQ6=A）
- `schema/version-matrix.schema.json`（→ U5/CI-3 が充足）/ `schema/showcase-index.schema.json`（→ U6/CI-4 が充足）。
- ビューは契約消費前提で実装済み。データはスタブ（空状態表示）。

## セキュリティ（NRQ6/7=A）
- CDN 実行時依存なし（自己ホスト）。iframe は `sandbox`+`referrerpolicy`。CSP メタ（best-effort）。機密を URL/localStorage に置かない。
