# U5 CI/CD Automation — Domain Entities

> 確定: FDQ1-8 全 A。U5 のドメインは「共有 CI 資産」「Lint」「VRT」「収集」「registry 検査」。
> ロジックは [business-logic-model.md](business-logic-model.md)、規則は [business-rules.md](business-rules.md)。既契約（VersionMatrixEntry, MigrationManifest）は再掲し U5 が充足する。

---

## SharedCIAsset（共有 CI 資産・FDQ1）
Core DS repo に置く CI の正典単位。`uses:` で各 repo から参照される。
| 属性 | 説明 |
|---|---|
| id | 例 `_shared-guardrail` / `_shared-vrt` / `_shared-registry-check` |
| kind | `reusable-workflow` \| `composite-action` \| `config-package` |
| path | Core 内パス（`.github/workflows/…` / `.github/actions/…` / `ci/…`） |
| consumedBy[] | 参照する repo（拡張＝pin、portal＝rolling） |
| versionRef | 参照される際の `@<ref>`（拡張＝SemVer タグ、portal＝main） |
- **不変条件**: ロジック実体はここに 1 つ（BR-CI-NODUP-1）。

---

## LintRuleSet（三層 Lint ルール・FDQ2）
Core `ci/lint/` の単一正典。CSS/JSX/HTML 全スキャナが共有。
| 属性 | 説明 |
|---|---|
| layerGraph | 一方向 `primitives(L1) ← semantic(L2) ← components/製品(L3)` |
| rawValuePolicy | 生 `#hex`/`px` の禁止と許可リスト（0, 1px ボーダー, 100% 等を明示宣言） |
| viaSemantic | 値は `var(--fig-<semantic>-*)` 経由必須の判定設定 |
| vrtThreshold | VRT 差分許容しきい値（VRT 設定と共有） |
| scope[] | 検査対象パス（`styles/`,`src/`,`extensions/`,`preview/`） |

## LintViolation（Lint 違反・CI-1 出力）
| 属性 | 説明 |
|---|---|
| file / line | 位置 |
| rule | `V1-raw-value` \| `V2-not-via-semantic` \| `V3-layer-leak` |
| layer | 検出された層（L1/L2/L3） |
| message | 説明 |
- **ゲート**: `count(LintViolation) > 0` → ジョブ失敗（BR-CI-LINT-3）。

---

## VRTBaseline（VRT 基準画像・FDQ3）
| 属性 | 説明 |
|---|---|
| repo | 所属 repo（baseline は repo 内 `preview/__baseline__/`） |
| screen | 画面 id（preview/*.html 対応） |
| imageRef | コミット済み基準画像 |
| updatedBy | 更新コミット（意図的差分の承認痕跡・BR-CI-VRT-2） |

## VRTRun / VRTDiff（VRT 実行と差分・CI-2）
| 属性（VRTRun） | 説明 |
|---|---|
| trigger | `pr` \| `core-pr-portal`（Core 変更で portal 巻込・FDQ4） |
| scope | 変更画面に限定（PERF-2 / BR-CI-VRT-4） |
| result | `PASS` \| `FAIL` |
| 属性（VRTDiff） | 説明 |
| screen / diffRatio | 画面と差分率 |
| verdict | `diffRatio ≤ threshold ? pass : fail`（required check・BR-CI-VRT-1/3） |
| artifactRef | 差分画像（PR コメント添付） |

---

## VersionCollector（収集クローラ・FDQ5/FDQ6）
portal `scripts/collect-versions.mjs`。portal ビルドの一部。
| 属性 | 説明 |
|---|---|
| source | `registry.json`（探索対象＝登録製品・BR-CI-CRAWL-2） |
| latestCore | Core 最新 SemVer タグ（rolling 基準） |
| fetchStrategy | GitHub API contents（チェックアウト不要） |
| outputs | `version-matrix.json` ＋ `migration-index.json`（同一走査・BR-CI-1CRAWL-1） |
| failureMode | fail-soft（個別失敗は `unknown`/skip・BR-CI-CRAWL-5） |

## VersionMatrixEntry（既契約・U2 確定 / U5 が充足）
`portal/schema/version-matrix.schema.json` 準拠。
| 属性 | 説明 |
|---|---|
| projectId / projectName | registry と紐付け |
| coreVersionPinned | 製品が pin する Core 版 |
| coreVersionLatest | 現行最新 Core 版（rolling 基準） |
| status | `up-to-date` \| `behind` \| `unknown` |
| source | `submodule` \| `CORE-DS-VERSION` \| `package.json` \| `unknown`（取得優先順・BR-CI-CRAWL-3） |
| collectedAt | 収集時刻 |

## MigrationManifest（既/U4 産・U5 が集約）
製品 repo `migration/migration-manifest.json`（U4 schema）。U5 は projectId で registry と紐付け、portal 運用ビューへ要約集約（画面比率/critical/完了/wrapper 期限）。U5 は**読み取り専用**で、生成は U4 の `migration-status.mjs` が担う。

---

## RegistryCheck（registry 登録検査・FDQ7）
Core 側 `_shared-registry-check.yml` の検査単位。
| 属性 | 説明 |
|---|---|
| target | registry PR が追加/変更する entry |
| checks[] | `C1 schema` / `C2 taxonomy` / `C3 naming` / `C4 dup` / `C5 coreVersion-exists` |
| verdict | 全 pass→required ✅（ただし自動マージ禁止・BR-CI-REG-2）／1 件 fail→❌＋注記 |

---

## エンティティ関係図
```
SharedCIAsset ──uses──> 各 repo workflow
   ├ _shared-guardrail ─> LintRuleSet ─produces─> LintViolation ─gate─> CI-1
   ├ _shared-vrt       ─> VRTBaseline + VRTRun ─produces─> VRTDiff ─gate─> CI-2
   └ _shared-registry-check ─> RegistryCheck ─gate─> CI-5

VersionCollector ─reads─> registry.json + 各 repo pin
   ├ produces ─> VersionMatrixEntry[]   (version-matrix.json)   → portal 版ダッシュボード (PT-5)
   └ aggregates ─> MigrationManifest[]  (migration-index.json)  → portal 移行進捗
```
