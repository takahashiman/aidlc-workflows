# U4 Migration — Code Generation Plan

> 確定: FDQ/NRQ/IDQ 全A。生成先: ① `fig-ext-template/`（汎用移行ロジック追補・テンプレ正典） ② `fig-ext-business-busapp/`（busapp 移行 repo の scaffold・workspace root 直下サブツリー）。
> Critical Rules: アプリコードは workspace root のサブツリー。aidlc-docs/ には置かない。生 hex/px 禁止・Core `.fig-*`/semantic 経由（三層ガードレール）。

## 生成ステップ
| # | 対象 | 内容 | Story/LC |
|---|---|---|---|
| 1 | `fig-ext-template/scripts/migrate-in.mjs` | 取り込み元(path / git URL+ref)→`legacy/` 冪等コピー・ハッシュ突合・dry-run | LC-I1, BR-MIG-3/4 |
| 2 | `fig-ext-template/scripts/migration-status.mjs` | manifest 再生成・混在検出・完了ゲート(主要100%∧全体≧80%)・ラッパー期限 Lint | LC-G/M, BR-DONE/WRAP |
| 3 | `fig-ext-template/schema/migration-manifest.schema.json` | manifest の JSON Schema | LC-M1, BR-VIS-3 |
| 4 | `fig-ext-business-busapp/` 雛形 | project-settings/CORE-DS-VERSION/core枠/README | IDQ1/5/6 |
| 5 | `…/legacy/busapp/` | 取り込んだ旧資産スナップショット(4部品 JSX+tokens+preview) | LC-I2 |
| 6 | `…/migration/component-mapping.json` | busapp 4部品→Core `.fig-*` 写像(propsMap/tokenMap) | LC-C1 |
| 7 | `…/src/` 移行後 | 薄ラッパー(Button/Card/TextField)+移行済み画面・FAB は extensions/ | LC-C2, BR-EXT-1 |
| 8 | `…/migration/migration-manifest.json` | 画面状態・critical flows・比率・完了・wrappers | LC-M1 |
| 9 | `…/preview/` | 移行後スナップショット(VRT baseline=legacy preview) | IDQ4 |
| 10 | `…/.github/workflows/migrate-checks.yml` | 三層Lint+VRT+混在検出+manifest+期限Lint(U5参照・SHA pin) | LC-G4, IDQ4 |
| 11 | `…/SKILL.md` `…/AGENTS.md` | 移行 Runbook＋ScopeManifest | LC-R3, BR-SCOPE |
| 12 ✅ | 検証 | migration-status.mjs 実行（manifest 再生成・ゲート算出） | REL-5 |

## 移行シナリオ（busapp・demonstrable baseline）
- 部品: Button/Card/TextField → Core `.fig-button`/`.fig-card`/`.fig-input`（写像）。FAB → Core 採否未確定のため `extensions/`（Showcase 候補）。
- 画面: 5画面。critical flow=`pass-issue`（2画面）。移行済み4/5=80%、critical 100% → **completed=true**（ゲート通過を実証）。
- ラッパー: `LegacyButton→fig-button` 等に `deprecatedSince`/`removeBy`。

