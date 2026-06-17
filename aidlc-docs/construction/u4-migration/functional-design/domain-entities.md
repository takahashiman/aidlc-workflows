# U4 Migration — Domain Entities

> 確定回答: FDQ1-8 = すべて A。U3 のエンティティ（ProjectSettings/CorePin/RegistryPR/ScopeManifest/ExtensionRepo）を**継承・再利用**し、U4 固有の移行エンティティを追加する。

## エンティティ関係（概観）
```
LegacyProduct (busapp)
      │ BLM-1 取り込み（U3 template 派生 + migrate-in）
      ▼
MigrationProject ──owns──▶ ExtensionRepo (fig-ext-<cat>-busapp)  [U3 継承]
   │   │   │                      │
   │   │   │                CorePin / RegistryPR / ScopeManifest  [U3 継承]
   │   │   │
   │   │   └─ LegacyAsset[] ──(ComponentMapping)──▶ Core `.fig-*` / ExtensionPart
   │   │
   │   └─ ScreenMigrationState[] ──(集計)──▶ MigrationChecklist ──gate──▶ completed
   │
   └─ MigrationManifest (機械可読・単一真実源) ──collect──▶ Portal 運用ビュー
            └─ CompatibilityWrapper[] / MigrationGuide(ref)
```

## 1. LegacyProduct（移行元・US-3.5）
取り込み対象の既存製品。代表 = busapp。
| 属性 | 型 | 説明 |
|---|---|---|
| `source` | repo path | `FIG-UDS main/extensions/busapp` |
| `assets` | LegacyAsset[] | components(JSX)/tokens/preview/README |
| `stack` | string | 旧実装スタック（busapp=JSX/React 系） |
| `preCoreSettings` | project-settings.json | 既存（不足項目を derive で補完） |

## 2. MigrationProject（移行の集約ルート）
1 取り込み = 1 MigrationProject。ExtensionRepo を所有。
| 属性 | 型 | 説明 |
|---|---|---|
| `name` | string | fig-ext-<category>-<product>（BR-MIG-1） |
| `extensionRepo` | ExtensionRepo | U3 継承（CorePin/RegistryPR/ScopeManifest を内包） |
| `screens` | ScreenMigrationState[] | 全画面の移行状態 |
| `criticalFlows` | CriticalFlow[] | 主要フロー宣言（BR-DONE-2） |
| `migrationDeadline` | date | 画面間混在の許容期限（BR-SCR-3） |
| `manifest` | MigrationManifest | 単一真実源（§9） |
| `completed` | bool | 完了ゲート結果（BR-DONE-1） |

## 3. LegacyAsset（移行元の個々の資産）
| 属性 | 型 | 説明 |
|---|---|---|
| `kind` | enum(component/token/preview/doc) | 種別 |
| `path` | path | `legacy/` 隔離領域内（BR-MIG-3） |
| `hash` | sha | 二重取り込み防止（BR-MIG-4） |
| `status` | enum(isolated/mapped/retired) | 取り込み→写像→撤去 |

## 4. ComponentMapping（旧 → Core 写像）— FDQ2 / BLM-2
旧コンポーネントを Core `.fig-*` または ExtensionPart へ写像する単位。
| 属性 | 型 | 説明 |
|---|---|---|
| `legacy` | ref(LegacyAsset) | 旧 JSX コンポーネント |
| `target` | enum(core-class/extension-part) | 写像先種別（BR-CONV-5） |
| `coreClass` | string? | 例 `.fig-button`（target=core-class 時） |
| `propsMap` | map | 旧 props → Core クラス修飾子の対応（BR-CONV-3 で props 維持） |
| `tokenMap` | map | 旧独自トークン → Core semantic（BR-CONV-2） |
| `verified` | bool | 三層 Lint 緑 ∧ VRT 緑（BR-SCR-4） |

### busapp 既知マッピング（初期）
| legacy | target | coreClass |
|---|---|---|
| Button.jsx | core-class | `.fig-button`(+variant/size) |
| Card.jsx | core-class | `.fig-card` |
| TextField.jsx | core-class | `.fig-input`(+state) |
| FAB.jsx | core-class または extension-part | `.fig-fab`（Core 採否を要照合・BR-CONV-5） |

## 5. ScreenMigrationState（画面＝移行の原子単位）— FDQ3 / BLM-3
| 属性 | 型 | 説明 |
|---|---|---|
| `screenId` | string | route/page 識別子 |
| `state` | enum(NOT_STARTED/IN_PROGRESS/MIGRATED) | 状態機械（BLM-3） |
| `flows` | string[] | 所属フロー（criticalFlows 参照） |
| `legacyRemaining` | int | 画面内に残る旧部品数（0 が MIGRATED の必要条件・BR-SCR-2） |
| `vrt` | enum(green/red/none) | 視覚回帰（BR-SCR-4） |
- **不変条件**: `state==MIGRATED ⇔ legacyRemaining==0 ∧ lint==green ∧ vrt==green`（混在禁止 BR-SCR-1/2）。

## 6. CriticalFlow（主要フロー）— FDQ4
| 属性 | 型 | 説明 |
|---|---|---|
| `flowId` | string | フロー識別 |
| `screens` | string[] | 構成画面 |
| `done` | bool | 全画面が MIGRATED（BR-DONE-1 の criticalDone 要素） |

## 7. MigrationChecklist（完了判定の生成物）— FDQ4 / BLM-4
| 属性 | 型 | 説明 |
|---|---|---|
| `criticalDone` | bool | 全 critical flows が done |
| `overallRatio` | float | MIGRATED 画面 / 全画面 |
| `gate` | bool | `criticalDone ∧ overallRatio>=0.80`（BR-DONE-1） |
| `generatedFrom` | derived | 状態から導出（手動編集不可・BR-DONE-3） |

## 8. CompatibilityWrapper（後方互換）— FDQ6 / BLM-5a
| 属性 | 型 | 説明 |
|---|---|---|
| `kind` | enum(core-alias/product-wrapper) | 種別（BR-WRAP-1） |
| `from` / `to` | string | 旧名/旧API → 新（Core）対応 |
| `location` | enum(core-repo/product-repo) | 所在 |
| `deprecatedSince` | date | 導入日（必須・BR-WRAP-2） |
| `removeBy` | date | 撤去期限（必須・BR-WRAP-2） |
| `overdue` | bool | 期限超過（CI 警告・BR-WRAP-3） |

## 9. MigrationManifest（単一真実源）— FDQ8 / BLM-6
`migration-manifest.json`（製品 repo・機械可読）。
| 属性 | 型 | 説明 |
|---|---|---|
| `screens` | ScreenMigrationState[] | §5 |
| `criticalFlows` | CriticalFlow[] | §6 |
| `overallRatio`/`criticalDone`/`completed` | 算出値 | BR-DONE-1 |
| `wrappers` | CompatibilityWrapper[] | §8（期限超過含む） |
| `extensionParts` | ExtensionPart[] | §10 |
| `coreVersion` | SemVer | registry 紐付け（BR-VIS-2） |
| `regeneratedFrom` | derived | 状態から再生成（BR-VIS-1） |

## 10. ExtensionPart（Core 未満の独自/仮パーツ）— FDQ5 / BLM-5b
| 属性 | 型 | 説明 |
|---|---|---|
| `name` | string | 独自部品名 |
| `location` | `extensions/` | 製品内正規層（BR-EXT-1） |
| `promotionLabel` | `core-promotion` | Showcase 収集トリガ（BR-EXT-2） |
| `showcaseCollected` | bool | U6 収集済み |
| `promotionState` | enum(local/proposed/promoted) | 昇格状況（BR-EXT-3/4） |

## 11. MigrationGuide（MAJOR 追従）— FDQ7 / BLM-7
| 属性 | 型 | 説明 |
|---|---|---|
| `coreMajor` | SemVer(MAJOR) | 対象 Core MAJOR |
| `changes` | list | 変更点 |
| `renameMap` | map | 旧→新マッピング |
| `steps` | ordered[] | 移行手順 |
| `deadline` | date | 追従期限 |
| `referencedBy` | MigrationProject[] | 参照消化が完了の必須項目（BR-GUIDE-2/BR-DONE-5） |

## U3 から継承するエンティティ（再掲・再定義しない）
| Entity | 出典 | U4 での役割 |
|---|---|---|
| ProjectSettings | U3 | derive で既存設定を補完し再利用 |
| ExtensionRepo | U3 | MigrationProject が所有する生成 repo |
| CorePin | U3 | submodule + CORE-DS-VERSION（BR-MIG-5） |
| RegistryPR | U3 | 取り込み時に登録 PR（BR-MIG-5） |
| ScopeManifest | U3 | 移行時のスコープ分離（BR-SCOPE-1） |
| SetupRunbook | U3 | migrate-in/baseline を追加した拡張版（BLM-1） |

## エンティティ別 担当ストーリー
| Entity | Story |
|---|---|
| LegacyProduct / LegacyAsset / ComponentMapping | US-3.5 |
| ScreenMigrationState / CriticalFlow / MigrationChecklist | US-3.6 |
| CompatibilityWrapper / MigrationGuide | US-4.5 |
| ExtensionPart | US-2.5（横断） |
| MigrationManifest | US-4.3（version 収集連携）/ ADQ |
