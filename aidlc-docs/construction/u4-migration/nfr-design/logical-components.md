# U4 Migration — Logical Components

> U4 = 取り込み（migrate-in）＋整合化（写像）＋段階移行判定＋後方互換＋進捗収集。従来型ランタイム基盤（queue/cache/CB/LB/DB）は N/A。
> 論理要素＝取り込み / 写像 / 移行判定 / 後方互換 / マニフェスト / ガードレール（多くは U3/U5 を継承・参照）。

## A. 取り込み / 隔離（Ingest）
| 論理要素 | 責務 | 実現 NFR |
|---|---|---|
| LC-I1 Migrate-In Step | U3 init.mjs に追加。既存資産を `legacy/` へ冪等取り込み（ハッシュ突合） | REL-1, BR-MIG-3/4 |
| LC-I2 Legacy Quarantine | 旧実装の隔離領域。新規追加禁止・移行で減らす | REL-4, BR-MIG-3 |
| LC-I3 Settings Derive | 既存 project-settings 不足項目（category/coreVersion）を補完 | BR-MIG-2 |
| LC-I4 Baseline Init | 移行マニフェスト初期化（全画面棚卸し・critical flows 宣言） | BR-VIS-1, REL-5 |

## B. 整合化 / 写像（Convert）
| 論理要素 | 責務 | 実現 NFR |
|---|---|---|
| LC-C1 ComponentMapping (machine-readable) | 旧→Core 写像（coreClass/propsMap/tokenMap）。Code Gen 入力 | MAINT-2, BR-CONV-5 |
| LC-C2 Class-Delegation Wrapper | JSX 薄ラッパー＋Core `.fig-*` クラス委譲（props 維持） | MIG-Q2, BR-CONV-1/3 |
| LC-C3 Token Remap | 旧独自トークン→Core semantic 置換 | MIG-Q3, BR-CONV-2 |
| LC-C4 Profile Binder | ルートに `.fig-profile-*` 付与 | BR-CONV-4 |

## C. 段階移行判定（Gate）
| 論理要素 | 責務 | 実現 NFR |
|---|---|---|
| LC-G1 Screen State Tracker | 画面状態（NOT_STARTED/IN_PROGRESS/MIGRATED）と残存旧部品数 | MIG-Q5, BR-SCR-1/2 |
| LC-G2 Mix Detector | 画面内新旧混在検出（混在＝移行率非カウント） | MIG-Q5, BR-SCR-2 |
| LC-G3 Completion Calculator | 主要フロー100%∧全体≧80% を自動算出 | MIG-Q4, BR-DONE-1 |
| LC-G4 VRT/Lint Gate | 画面 MIGRATED 条件（三層 Lint 緑∧VRT 緑） | MIG-Q1/Q3, BR-SCR-4 |

## D. 後方互換（Compat）
| 論理要素 | 責務 | 実現 NFR |
|---|---|---|
| LC-W1 Compatibility Wrapper | 製品移行ラッパー（旧 API→Core）。`deprecatedSince`/`removeBy` | COMPAT-1/3, BR-WRAP |
| LC-W2 Core Alias (参照) | Core 改名追従エイリアス（U1 既存 alias 機構） | COMPAT-1, BR-WRAP-1 |
| LC-W3 Deprecation Linter | 期限超過ラッパーを CI 警告・マニフェストフラグ | COMPAT-2, BR-WRAP-3 |
| LC-W4 Migration Guide (参照) | Core MAJOR の構造化ガイド・参照消化チェック | COMPAT-4, BR-GUIDE |

## E. 進捗 / 収集（Manifest）
| 論理要素 | 責務 | 実現 NFR |
|---|---|---|
| LC-M1 migration-manifest.json | 機械可読・状態から再生成（screens/flows/比率/完了/wrappers/extensionParts） | BR-VIS-1/3 |
| LC-M2 Crawler (U5 参照) | version 収集と同一クローリングでマニフェスト集約 | MAINT-4, BR-VIS-2 |
| LC-M3 Portal Operations View (U2 参照) | 移行率/完了/期限超過を運用ビューに表示 | BR-VIS-2 |
| LC-M4 Showcase Collector (U6 参照) | ExtensionPart を `core-promotion` で収集 | BR-EXT-2 |

## F. ガードレール / 統制（U3 継承）
| 論理要素 | 責務 | 実現 NFR |
|---|---|---|
| LC-R1 Core Pin | submodule pin＋CORE-DS-VERSION 整合 | SEC-3 |
| LC-R2 Registry PR Flow | 最小権限・PR・CI(CI-5)＋Maintainer | SEC-1/2 |
| LC-R3 ScopeManifest | Core＋対象製品のみ参照 | SEC-6 |
| LC-R4 SCA on Legacy | 取り込む旧依存の脆弱性監査 | SEC-5 |

## G. 適用判定（従来型基盤）
| 基盤要素 | 判定 | 根拠 |
|---|---|---|
| Message Queue / Cache / Circuit Breaker / Load Balancer / Database / Auth | **N/A** | 拡張製品 repo＋静的資産＋ローカル/CI スクリプト。実行時サーバ無し |

## H. Unit 横断の責務分界
| 関心事 | U4 | 委譲先/参照元 |
|---|---|---|
| `.fig-*` クラス・semantic トークン・alias 機構 | 写像先として参照 | U1 Core DS |
| template / init.mjs / project-settings / ScopeManifest / RegistryPR | 取り込みで再利用・拡張 | U3 Template & Setup |
| 三層 Lint / VRT / version 収集（CI-3）/ registry 検査（CI-5） | ロジック参照・移行ゲートに活用 | U5 CI/CD（実体） |
| 移行率/完了/期限超過の表示 | マニフェスト提供 | U2 Portal 運用ビュー |
| ExtensionPart の展示・昇格導線 | 収集対象提供 | U6 Showcase / US-4.4 昇格 |
