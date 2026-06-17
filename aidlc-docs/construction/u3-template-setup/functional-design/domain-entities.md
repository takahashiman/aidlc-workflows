# U3 Template & Setup — Domain Entities

> 確定回答: FDQ1-8 = すべて A。正典（schema/presets/registry/taxonomy）は Core DS 由来。

## エンティティ関係（概観）
```
TemplateRepo (fig-ext-template)
      │ "Use this template"
      ▼
ProjectSettings ──(入力契約)── SetupRunbook ──→ ExtensionRepo (fig-ext-<cat>-<prod>)
      │                            │                    │
SetupVariable[]              steps[duplicate/apply/      ├─ CorePin (submodule + CORE-DS-VERSION)
(project-settings 由来)       pin/wire-ci/register]      ├─ CI 雛形 (U5 参照)
                                   │                     └─ ScopeManifest (SKILL/AGENTS)
                                   ▼
                              RegistryPR ──→ Core DS registry.json [+ taxonomy.json]
```

## 1. TemplateRepo（TM-1）
| 属性 | 型 | 説明 |
|---|---|---|
| `kind` | "github-template-repository" | standalone（FDQ1=A） |
| `seed` | path | `extensions/template/` 由来の雛形内容 |
| `structure` | 三層/`.fig-profile-*`/CI 雛形/Core submodule 枠 | 複製直後の保証構成（BR-TPL-2） |
| `scopeManifest` | SKILL.md/AGENTS.md | スコープ分離方針（BR-SCOPE-2） |

## 2. ProjectSettings（入力契約・FDQ2=A）
`project-settings.json`。Core 正典 `project-settings.schema.json` 準拠（BR-VAR-2）。
| 属性 | 型 | 必須 | 説明 |
|---|---|---|---|
| `projectName` | string | ● | repo 名の基（fig-ext-<cat>-<projectName>） |
| `displayName` | string | ● | 表示名（README/registry/ポータル） |
| `description` | string | | 1行概要 |
| `designSystem.coreVersion` | string(SemVer) | ● | 参照 Core 版（CORE-DS-VERSION） |
| `designSystem.profile` | enum(admin/consumer/terminal) | ● | 既定デバイスプロファイル |
| `designSystem.lockedAt` | date | | pin 日 |
| `signatureColor.value` | string(hex) | ● | シグネチャ色 |
| `signatureColor.harmonization` | {preset,hue,taste,relation,baseToken} | | Core signature-presets 整合 |
| `owners` | string[] | ● | CODEOWNERS/registry |
| `category` / `subcategory` | string | ●/– | taxonomy 参照（BR-NAME-1） |

## 3. SetupVariable（変数・FDQ3=A）
ProjectSettings の値を適用先へ写像する単位。
| 変数 | 適用先 |
|---|---|
| signature | signature.css（再テーマ） |
| profile | `.fig-profile-*` |
| coreVersion | CorePin |
| displayName/description | README/registry/ポータル |
| owners | CODEOWNERS/registry |

## 4. SetupRunbook（AI 手順契約・FDQ2=A）
| 属性 | 型 | 説明 |
|---|---|---|
| `steps` | ordered[] | derive→duplicate→apply→pin→wire-ci→register→verify |
| `idempotent` | bool=true | 再実行で壊れない（BR-IDEM-1） |
| `actor` | "AI agent (P4)" | 実行主体 |
| `verify` | checklist | 必須値/pin/CI/registry PR の存在（BR-IDEM-2） |

## 5. ExtensionRepo（生成物）
| 属性 | 型 | 説明 |
|---|---|---|
| `name` | string | fig-ext-<category>-<product>（BR-NAME-1） |
| `corePin` | CorePin | §6 |
| `ci` | refs(U5) | 三層 Lint/VRT/version チェック雛形（BR-CI-1/2） |
| `productUI` | files | 製品 UI（EX-1 相当） |
| `extensionsLayer` | dir | 独自/仮パーツ（EX-2・showcase 対象） |

## 6. CorePin（US-3.3 / ADQ6=A・FDQ4=A）
| 属性 | 型 | 説明 |
|---|---|---|
| `submoduleCommit` | sha | Core を特定コミットに pin（再現性） |
| `coreVersionFile` | `CORE-DS-VERSION`(SemVer) | 可視性（version-matrix 入力・U5/CI-3） |
| `consistency` | invariant | submoduleCommit ↔ coreVersionFile 一致（BR-PIN-3） |

## 7. RegistryPR（ADQ3=A+・FDQ5=A）
| 属性 | 型 | 説明 |
|---|---|---|
| `target` | Core DS registry.json [+ taxonomy.json] | 単一正典 |
| `entry` | {repo,category,subcategory?,name,coreVersion,demoUrl?} | 登録内容（BR-REG-2） |
| `taxonomyProposal` | optional | 未存在カテゴリの追記案（BR-REG-3） |
| `approval` | CI(CI-5)＋Maintainer | マージ条件（BR-REG-5） |

## 8. ScopeManifest（US-3.4・FDQ7=A）
| 属性 | 型 | 説明 |
|---|---|---|
| `allowedContext` | ["Core", "this-product"] | 参照可能 repo（BR-SCOPE-1） |
| `location` | SKILL.md/AGENTS.md | 明文化箇所（BR-SCOPE-2） |
| `prohibited` | other products | 不可視（BR-SCOPE-3） |

## 9. PromptGenerator（TM-2・FDQ8=A）
| 属性 | 型 | 説明 |
|---|---|---|
| `canonicalLocation` | U3（fig-ext-template / Core 配布物） | 正典（BR-GEN-1） |
| `inputs` | form fields | 製品名/カテゴリ/profile/signature(Hue×Taste)/coreVersion/owners/説明 |
| `validation` | 命名規約/必須/preset 整合 | BR-GEN-2 |
| `outputs` | project-settings.json ＋ setup prompt | BR-GEN-2 |
| `presetsSource` | Core signature-presets.json (rolling) | BR-GEN-3 |

## エンティティ別 担当ストーリー
| Entity | Story |
|---|---|
| TemplateRepo | US-3.1 |
| ProjectSettings/SetupVariable/SetupRunbook/PromptGenerator | US-3.2 |
| CorePin | US-3.3 |
| ScopeManifest | US-3.4 |
| RegistryPR | （横断・ADQ3） |
