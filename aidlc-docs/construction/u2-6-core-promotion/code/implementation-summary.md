# Implementation Summary — U2-6 Core 昇格実行（arrival-card）

> Code Generation Part 2 実装結果。代表昇格 `arrival-card`。repo: Core（`../FIG-Universal-Design-System`@core）＋本 repo（导线ドラフト）。
> 実 push / Issue / PR / タグはユーザー承認後（FDQ6-3=A）。

## 実装（10 step）

| step | 内容 | 配置 |
|---|---|---|
| S1 | spec 確認（既存・充実＝無改変） | `patterns/arrival-card.md`（Core・参照のみ） |
| S2 | preview 新規作成（card-fig + status-pill + route-badge + arrival-time・6 状態・生 HEX 0） | `preview/arrival-card.html`（Core・新規） |
| S3 | portal 結線（`preview: null` → path） | `assets/js/portal-content.js`（Core・1 行変更） |
| S4 | a11y runner 新設（axe・serious/critical 0・playwright 1.47.2） | `ci/a11y/{a11y-runner.mjs,package.json,README.md}`（Core・新規） |
| S5 | a11y 共有 reusable | `.github/workflows/_shared-a11y.yml`（Core・新規） |
| S6 | Core 自己ゲート（lint+VRT+a11y 集約） | `.github/workflows/component-check.yml`（Core・新規） |
| S7 | Issue/PR ドラフト | 本 repo `construction/u2-6-core-promotion/promotion/{issue-draft,pr-draft}.md` |
| S8 | ローカル検証 | 下記 |
| S9 | docs | 本書＋dev-flow-journal Step 7＋confirmPromotion チェックリスト |
| S10 | state/audit | 更新 |

## 検証結果（S8）

- **生 HEX ゼロ**: `preview/arrival-card.html` に `#RRGGBB` 直書きなし（grep 0）。配色は `--color-status-*` トークン委譲。
- **結線**: `core/patterns/arrival-card` の `preview` が `preview/arrival-card.html` に。**整備率 9/36 → 10/36**。
- **残余白**: page-transition / delay-banner / notification-sheet / route-selector は `preview: null` 据置（スコープどおり）。
- **runner 健全性**: `node --check ci/a11y/a11y-runner.mjs` OK。三層 lint は HTML inline を対象外（CSS 層検査）＝新規 error 0。
- **VRT/a11y 実描画**: ローカルは Playwright 未導入のため **CI(Linux) で初回実行・ベースライン生成**（IDQ6 設計どおり）。a11y はベースライン不要。

## トークン使用（生 HEX ゼロの担保）

- コンテナ: `.card-fig` / `.card-fig--interactive`（semantic.css 既定）。
- 運行状態: `--color-status-{onTime|delayRisk|delayed|suspended|passed}-{bg|fg}`（status-pill へ委譲）。
- タイポ: `--typography-{route-number|title|caption|arrival-time|timetable-cell|status-pill}`＋`--font-variant-numeric`。
- 余白/境界/面: `--space-*` / `--color-border-subtle` / `--color-surface-accent-subtle` / `--color-text-*` / `--radius-*`。
- 注: spec 参照の `--color-text-strong` は Core 未定義のため到着数値は `--color-text-primary` を使用。

## スコープ境界（遵守）

- spec 本文（`patterns/arrival-card.md`）無改変。既存 preview/spec/workflow 無改変（加算のみ・後方互換）。
- 代表 1 パターンのみ（他パターン preview は余白据置）。22 件未収録 preview はイニシアチブ スコープ外。
- 実 push / Issue / PR / タグはユーザー承認後。

## 未了（承認後・後続）

- ① Core への実 push＋`core-promotion` Issue 起票＋PR 作成（ドラフト確定済）。
- ② PR の `component-check` で VRT ベースライン初回生成（CI Linux）＋ a11y serious/critical 0 確認。
- ③ マージ（Core Maintainer 承認）→ release.yml で MINOR タグ → confirmPromotion。
