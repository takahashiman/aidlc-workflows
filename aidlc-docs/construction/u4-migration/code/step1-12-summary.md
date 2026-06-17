# U4 Migration — Code Generation 成果サマリ（Step1-12）

> 生成先: ① `fig-ext-template/`（汎用移行ロジック追補・テンプレ正典） ② `fig-ext-business-busapp/`（busapp 移行 repo の scaffold）。
> 検証: `migration-status.mjs` PASS（4/5=80%・critical 100%・completed）、`--gate` exit 0、`migrate-in.mjs --dry-run` 動作。

## A. fig-ext-template への汎用ロジック追補（IDQ5=A）
| ファイル | 役割 | 検証 |
|---|---|---|
| `scripts/migrate-in.mjs` | 取り込み元(path / git URL+ref)→`legacy/<name>/` 冪等コピー・ハッシュ突合・`.migrate-in.json` 出所記録・dry-run。対象は cwd（製品 repo）or `--repo` | dry-run 動作確認 |
| `scripts/migration-status.mjs` | manifest から 混在検出・移行率・完了ゲート(主要100%∧全体≧80%∧混在0)・ラッパー期限 を**再生成**。`--write`/`--gate`。対象は cwd | PASS / gate exit 0 |
| `schema/migration-manifest.schema.json` | 移行マニフェストの JSON Schema（screens/criticalFlows/wrappers/extensionParts） | — |

## B. fig-ext-business-busapp/（busapp 移行 repo scaffold）
| 領域 | ファイル | 要点 |
|---|---|---|
| 設定 | `project-settings.json` `CORE-DS-VERSION` `core/.gitkeep` | category=business / profile=Mobile-Terminal / pin v1.0.0 / migration.source・deadline |
| 隔離 | `legacy/busapp/` (Button/Card/TextField/FAB.jsx・tokens/semantic.css・.migrate-in.json) | 取り込みスナップショット（撤去対象・BR-MIG-3） |
| 写像 | `migration/component-mapping.json` | 4部品→Core: Button→`.fig-button`, Card→`.fig-card`, TextField→`.fig-input`(core-class)、FAB→`extensions/`(extension-part・Core不在) |
| 移行後 | `src/{Button,Card,TextField}.jsx` `src/compat.js` | 薄ラッパー(props維持・Core委譲・BR-CONV)＋後方互換ラッパー(期限メタ) |
| 拡張層 | `extensions/Fab.jsx` `styles/extensions.css`(.busapp-fab) | Core 未満・Showcase 候補(@core-promotion・BR-EXT-1)・Coreトークン経由 |
| 進捗 | `migration/migration-manifest.json` | 5画面/critical=pass-issue/80%/completed=true/wrappers3/extensionParts(Fab) |
| VRT | `preview/pass-issue.html` | 移行後スナップショット(profile-terminal・Core `.fig-*` のみ・混在0) |
| CI | `.github/workflows/migrate-checks.yml` | pin整合+三層Lint+VRT+migration-status --gate+manifest公開(U5参照・SHA pin) |
| Runbook | `AGENTS.md` `SKILL.md` `README.md` | 取り込み→初期化→写像→完了判定→後方互換・ScopeManifest(Core＋本製品のみ) |

## C. ストーリー網羅
| Story | 実装 |
|---|---|
| US-3.5 取り込み | migrate-in.mjs・legacy/隔離・project-settings.migration.source |
| US-3.6 段階移行/完了判定 | 画面=原子(manifest screens)・混在検出・migration-status ゲート(80%∧critical100%) |
| US-4.5 マイグレーション方針 | src/compat.js＋manifest wrappers(deprecatedSince/removeBy)・期限 Lint |
| US-2.5/US-5.2 横断 | extensions/Fab.jsx(@core-promotion)・manifest extensionParts |

## D. 要ユーザー操作（GitHub）
1. `fig-ext-business-busapp` を `fig-ext-template` から Template 派生で独立 repo 化
2. Core submodule 配線・pin（CORE-DS-VERSION 整合）
3. 実 migrate-in 実行（取り込み元 FIG-UDS main/extensions/busapp）→ 本 scaffold の legacy は代表スナップショット
4. registry PR 用最小権限トークン/GitHub App
5. U5 共有 Lint/VRT/収集の SHA 配線
6. taxonomy category `business` を Maintainer 承認

> 注: 本 scaffold の `legacy/busapp/` は実 busapp が未チェックアウトのため**代表スナップショット**。GitHub 化後に migrate-in で実資産へ置換する。
