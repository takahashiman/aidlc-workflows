# U5 CI/CD Automation — Code Generation Summary（Step 1–16）

> 確定 FDQ/NRQ/IDQ 全A。U5 は「各 repo に配線済みのスタブ」を **Core 共有 CI 正典への `uses:` 参照で実体化**。新概念は足さず、二重実装しない（BR-CI-NODUP）。

## 生成物の所在
### ① Core DS repo（共有 CI 正典）= `aidlc-projects/FIG-Universal-Design-System/`
```
.github/
  workflows/_shared-guardrail.yml        # CI-1 reusable
  workflows/_shared-vrt.yml              # CI-2 reusable（default + core-to-portal）
  workflows/_shared-registry-check.yml   # CI-5 reusable
  actions/three-layer-lint/action.yml    # CI-1 composite
ci/
  lint/three-layer-lint.mjs + lint-rules.json + README + __fixtures__/{good,bad}
  vrt/vrt-runner.mjs + package.json + README
  registry/check-registry.mjs + registry-entry.schema.json + README + __fixtures__/
  README.md                              # 共有正典の参照ガイド
```
### ② portal（CI-3 収集）
- `portal/scripts/collect-versions.mjs` — registry 駆動の単一クローラ。`version-matrix.json`＋`migration-index.json` を同一走査生成（fail-soft）。
- `portal/scripts/build.mjs` — `collectAndStub()` で収集器を配線（version-matrix スタブを実収集へ。showcase-index は U6 までスタブ維持）。

### ③ 既存テンプレのスタブ実体化（`uses:`）
- `fig-ext-template/.github/workflows/ci.yml` — guardrail/vrt を `_shared-*.yml@<pin>` 参照へ。setup ジョブ（pin/verify）は維持。
- `fig-ext-business-busapp/.github/workflows/migrate-checks.yml` — guardrail/vrt を共有参照へ。migration-status（U4）は維持。
- `fig-ext-template/.github/workflows/register.yml` — CI-5 検査先（_shared-registry-check）を明記。

## CI 番号 → 実体
| CI | Story | 実体 | ゲート |
|---|---|---|---|
| CI-1 三層 Lint | US-4.1 | `ci/lint/three-layer-lint.mjs`（color トークン化を error 化・px は warn・色 primitive 直参照=層逆流） | error 1 件で exit 1 |
| CI-2 VRT | US-4.2 | `ci/vrt/vrt-runner.mjs`（Playwright→pixelmatch・baseline=repo 内・Core→portal rolling 巻込） | 差分>閾値で exit 1 |
| CI-3 収集 | US-4.3 | `portal/scripts/collect-versions.mjs`（GitHub API・registry 駆動・並列・fail-soft） | — (portal build に統合) |
| CI-5 registry 検査 | US-3.2 | `ci/registry/check-registry.mjs`（C1 schema/C2 taxonomy/C3 naming/C4 dup/C5 tag） | 不合格 exit 1・自動マージ禁止 |

## 設計上の重要判断
1. **Lint は色のトークン化を本質と捉え error 化**、寸法（px）は段階導入のため warn。`signature.css` 再テーマの前提（色の semantic 経由）を守る。spacing/type 等のスケール primitive 直接利用は設計上許容（V3 対象外＝color primitive のみ層逆流判定）。
2. **Lint は軽量 Node 単体**（stylelint 常駐に依存しない）。ローカル/CI 同一・再現性（REL-1）・最小依存（PERF-3）。stylelint ラップは将来任意。
3. **VRT は依存未導入で graceful skip**（exit 0・notice）。段階導入を阻害しない。CI では `npm ci`＋`playwright install` で本実行、`--require` で必須化。
4. **収集は fail-soft**：個別 repo 失敗=unknown/skip、全体失敗=直近据え置き（portal build を止めない／版ダッシュボード可用性優先・REL-3/4）。
5. **Core 自身の既存 CSS 負債（866 error）を可視化**したが、Core 自体への error 適用は段階導入。本 Lint の主対象は拡張製品 repo の新規コード。

## 検証（実行済み・REL-1）
| 項目 | 結果 |
|---|---|
| Lint fixture | good=clean / bad=error3+warn1（意図通り）・color primitive 57/242 識別 |
| registry fixture | 空=合格 / bad=C2(unknown cat)・C3(命名)・C4(dup) 検出・自動マージ禁止メッセージ |
| VRT | preview 無し/依存無し→ exit0 skip（notice） |
| portal build | 収集器配線で version-matrix/migration-index を schema 準拠生成・ビルド成功 |
| portal test | `node --test` 16 pass（回帰なし） |

## 要ユーザー操作（GitHub 側・user-actions-checklist フェーズ E）
1. Core repo に `.github/workflows/_shared-*.yml`・`.github/actions/`・`ci/` をマージ→参照用 SemVer タグ発行。
2. 各 repo の `uses:` を実 `<org>/FIG-Core-DS`・`@<ref>`（拡張=pin / portal=main）へ差替え。
3. branch protection で guardrail/vrt/registry-check を required status checks 化。
4. registry PR 用 最小権限トークン/GitHub App。
5. portal 収集トリガ（push / `repository_dispatch(core-released)` / nightly）＋ `GH_OWNER`/`CORE_DS_REPO`/`GITHUB_TOKEN`（read）設定。
6. Core release→portal `repository_dispatch(core-released)`（rolling）。
7. （任意）Core 自身の既存 CSS 負債の段階解消（新規/変更分から error 化）。
