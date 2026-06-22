# PR ドラフト — arrival-card preview ＋ a11y ゲート

> 対象 repo: FIG-UDS Core（`takahashiman/FIG-Universal-Design-System`・ベース `core`）
> ⚠ 実 push / PR 作成 / タグ発行はユーザー承認後（FDQ6-3=A）。本書はドラフト（LC-PromotionDraft）。

---

**Title**: feat(patterns): arrival-card ライブプレビュー整備 ＋ a11y ゲート新設 (#<issue>)

Closes #<issue>

## 追加 / 変更

- **新規** `preview/arrival-card.html` — arrival-card パターンのライブプレビュー（card-fig + status-pill + route-badge + arrival-time の合成・6 状態・生 HEX ゼロ）。
- **変更** `assets/js/portal-content.js` — `core/patterns/arrival-card` の `preview: null` → `preview: 'preview/arrival-card.html'`（未整備→整備済）。
- **新規** `ci/a11y/{a11y-runner.mjs,package.json,README.md}` — preview の axe 検査ランナー（serious/critical 0・playwright は ci/vrt と同版 1.47.2 共有）。
- **新規** `.github/workflows/_shared-a11y.yml` — a11y 共有正典 reusable（SHA pin・preview_dir）。
- **新規** `.github/workflows/component-check.yml` — Core 自己ゲート（lint + VRT + a11y 集約）。

## 不変（後方互換・加算のみ）

- `patterns/arrival-card.md`（既存 spec）は無改変。
- 既存 component spec / preview / workflow は無改変。

## 検証

- 三層 lint: 生 HEX / 層違反 0（新規 preview）。
- VRT: `preview/arrival-card.html` のベースラインを CI(Linux) で初回生成しコミット。
- a11y: `arrival-card.html` の axe（wcag2a/2aa/21a/21aa）serious・critical 0。
- ポータル: coverage ビューで arrival-card が「整備済」に遷移。

## SemVer

MINOR（パターンのライブプレビュー追加 ＋ CI ゲート追加・後方互換）。

## レビュー / マージ

全 CI 通過でも自動マージ禁止＝Core Maintainer 承認でマージ（SEC-3）。
