# U3 Template & Setup — Logical Components

> U3 = テンプレ repo＋静的 Generator＋AI セットアップ。従来型ランタイム基盤（queue/cache/CB/LB/DB）は N/A。
> 論理要素＝テンプレ / Generator / 初期化スクリプト / runbook / registry-PR / ScopeManifest。

## A. テンプレ / 配布
| 論理要素 | 責務 | 実現 NFR |
|---|---|---|
| LC-T1 Template Repository | standalone `fig-ext-template`（GitHub Template）。三層/CI 雛形/`.fig-profile-*`/Core submodule 枠 | TSD-1, BR-TPL-2 |
| LC-T2 Core Submodule | Core を pin して取込（無改変） | SEC-3, BR-PIN-1 |
| LC-T3 CORE-DS-VERSION | 参照 SemVer 明記（version-matrix 入力） | BR-PIN-2, SEC-3 |

## B. 入力 / Generator
| 論理要素 | 責務 | 実現 NFR |
|---|---|---|
| LC-G1 Prompt Generator (vanilla) | フォーム→project-settings.json＋セットアッププロンプト | TSD-2, A11Y-1 |
| LC-G2 ProjectSettings Schema | Core 正典で入力検証 | MAINT-2 |
| LC-G3 Signature Presets Reader | Core signature-presets を参照（rolling） | MAINT-4 |

## C. セットアップ実行
| 論理要素 | 責務 | 実現 NFR |
|---|---|---|
| LC-S1 Init Script (Node) | project-settings 駆動で変数適用（signature/profile/版/表示名）・冪等・dry-run | REL-1/3/5 |
| LC-S2 SetupRunbook | AI 手順契約（derive→duplicate→apply→pin→wire-ci→register→verify） | REL-2, BR-IDEM |
| LC-S3 Verification Checklist | 完了検証（必須値/pin/CI/registry PR） | REL-2 |

## D. ガードレール / 統制
| 論理要素 | 責務 | 実現 NFR |
|---|---|---|
| LC-R1 Registry PR Bot/Flow | 最小権限・ブランチ経由 PR・CI＋Maintainer レビュー | SEC-1/2, BR-REG |
| LC-R2 ScopeManifest | Core＋対象製品のみ参照（SKILL/AGENTS） | SEC-7, SCOPE |
| LC-R3 CI 雛形（U5 参照） | 三層 Lint/VRT/version チェック配線・Actions SHA pin | SEC-4, MAINT-3 |

## E. 適用判定（従来型基盤）
| 基盤要素 | 判定 | 根拠 |
|---|---|---|
| Message Queue / Cache / Circuit Breaker / Load Balancer / Database / Auth | **N/A** | テンプレ＋静的 Generator＋ローカル/CI スクリプト。実行時サーバ無し |

## F. Unit 横断の責務分界
| 関心事 | U3 | 委譲先 |
|---|---|---|
| project-settings.schema / signature-presets / registry / taxonomy 正典 | 参照・PR 起票 | U1 Core DS（正典・承認） |
| 三層 Lint / VRT / registry 登録検査(CI-5) ロジック | 配線（雛形） | U5 CI/CD（実体） |
| version-matrix 収集 | CORE-DS-VERSION/submodule を入力提供 | U5(CI-3) |
| Generator のポータル導線 | 正典提供 | U2（使い方リンク参照） |
| 既存製品の取込（migration） | テンプレ提供 | U4 Migration |
