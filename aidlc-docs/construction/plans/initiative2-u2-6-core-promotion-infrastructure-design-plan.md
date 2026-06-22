# Infrastructure Design Plan — U2-6 Core 昇格実行（ドメインパターン）

> 対象: U2-6（代表昇格 `arrival-card`）。NFR Design 承認済（2026-06-22）。repo: Core（`../FIG-Universal-Design-System`@core）。
> NFR Design 申し送り（a11y runner 物理配置・ベースライン CI 生成）を実配置に確定。

## 現状調査（Core CI）
- `ci/` は 1 concern = 1 subdir + reusable（`ci/lint`・`ci/vrt`・`ci/registry`／各 README＋ツール）。`ci/a11y` 未存在。
- `ci/vrt/package.json` は playwright 1.47.2 同梱。
- **Core 自身の preview を lint/VRT する稼働ワークフローは現状なし**（`_shared-*` は reusable 定義のみ）。Core 自己ゲートは palette-check/registry-check。

## 回答確定（2026-06-22・Infra 質問ゲート）
- **IDQ6-1=A**: 新設 a11y 検査＝**独立 `ci/a11y/`（a11y-runner.mjs＋package.json＋README）＋ `_shared-a11y.yml` reusable**。既存パターン準拠・他 repo 再利用可。`@axe-core/playwright`＋playwright（ci/vrt と同版 1.47.2）。
- **IDQ6-2=A**: **新規 `component-check.yml`** に三層 lint＋VRT（`_shared-vrt` 自己呼び）＋a11y（`_shared-a11y`）を集約（fail-fast）。palette-check/registry-check と並ぶ Core 自己ゲート。
- ベースライン: VRT は **CI Linux 初回生成**（真実源）。a11y はベースライン不要。

## 生成する成果物
- [x] `construction/u2-6-core-promotion/infrastructure-design/infrastructure-design.md`（LC→実配置表・新規 ci/a11y＋_shared-a11y.yml＋component-check.yml・registry 不要・MINOR・従来型 N/A）
- [x] `construction/u2-6-core-promotion/infrastructure-design/deployment-architecture.md`（配備図・昇格フロー手順・品質ゲート一覧・ベースライン更新・ロールバック・N/A）

---

## 質問 — 回答済み

## Question IDQ6-1 — 新設 a11y 検査の物理配置
A) **独立 ci/a11y＋_shared-a11y.yml（推奨）** / B) 既存 ci/vrt に同居 → **[Answer]: A**

## Question IDQ6-2 — Core 自己ゲート ワークフローの追加方式
A) **新規 component-check.yml（lint＋VRT＋a11y 集約・推奨）** / B) a11y ワークフローのみ追加（最小） → **[Answer]: A**
