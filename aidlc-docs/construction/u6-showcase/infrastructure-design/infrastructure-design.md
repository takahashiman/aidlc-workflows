# U6 Showcase — Infrastructure Design

> 確定: FDQ1-7 全A。新規インフラ無し。U2 portal（Pages・Actions）＋ U5 収集基盤に showcase 収集を相乗り。

## 実行基盤
- **収集**: `portal/scripts/collect-versions.mjs` 拡張（`collectShowcase()`）を **portal build（`build.mjs`）の一部**として実行。U5 version 収集と同一プロセス・同一 runner。
- **runner**: GitHub-hosted `ubuntu-latest`・Node LTS（U2 IDQ4 / U5 継承）。追加依存ゼロ志向（標準 `fetch`・`node:fs`）。
- **ビュー**: portal の静的 SPA（vanilla JS）。`renderShowcase()` がクライアントで `data/showcase-index.json` を描画。

## 環境変数（U5 と共有・追加なし）
| 変数 | 用途 | 必須 | 備考 |
|---|---|---|---|
| `GH_OWNER` | 各 repo の owner | 推奨 | 無いと収集 skip（空一覧・fail-soft） |
| `GITHUB_TOKEN`（read-only） | GitHub API（contents+issues）read | 推奨 | 無くても public は試行・レート緩和に推奨 |
| `CORE_DS_REPO` | Core 正典（昇格照合） | 任意 | 無いと `promotedToCore` 判定 skip |
| `CORE_DS_PATH` | ローカル Core（フォールバック） | 任意 | U5 と共有 |

## GitHub API 権限（最小権限 / SEC-1）
- **必要**: `contents:read`（`extensions/` 列挙・部品ヘッダ取得）＋ `issues:read`（`temp-part` ラベル Issue）。
- **不要**: 書込権限一切（register/promotion の起票はユーザー/別 workflow の責務）。
- public repo は token 無しでも可（レート制限・推奨はトークン併用）。

## トリガ（U5 collect と同一・相乗り）
- `push`（portal）/ `repository_dispatch(core-released)`（Core 昇格→rolling 反映）/ nightly cron / 手動 `workflow_dispatch`。
- いずれも portal build を起動 → version+migration+**showcase** を1走査収集。

## 成果物配置（FDQ7=A / aidlc-docs 外）
| 成果物 | 配置 |
|---|---|
| 収集 | `portal/scripts/collect-versions.mjs`（`collectShowcase()` 追加） |
| 配線 | `portal/scripts/build.mjs`（showcase スタブ→収集差替え） |
| ビュー | `portal/src/views.js`（`renderShowcase()` 実体化）＋必要なら `portal/assets/*.css` |
| 契約 | `portal/schema/showcase-index.schema.json`（**不変**） |
| 出力 | `portal/data/showcase-index.json`（収集生成） |

## セキュリティ配備（Security Baseline サブセット・U2 継承）
- 最小権限 read-only token。収集データはビュー描画時 `esc()`。iframe sandbox / SRI / CSP（U2）配下。サーバ系（WAF/認証/DB）は N/A（静的サイト）。

## N/A（静的サイト・U2 踏襲）
- ロードバランサ / DB / キュー / キャッシュ層 / オートスケール。収集はビルド時バッチ、配信は Pages 静的。
