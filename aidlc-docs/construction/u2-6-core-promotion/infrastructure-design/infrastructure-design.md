# Infrastructure Design — U2-6 Core 昇格実行（ドメインパターン）

> 代表昇格 `arrival-card` の実配置。確定回答 IDQ6-1=A / IDQ6-2=A（＋ベースライン CI Linux 真実源）。
> repo: **FIG-UDS Core（`../FIG-Universal-Design-System`@core）**。実 push/PR/タグはユーザー承認後（FDQ6-3=A）。

## 回答確定（2026-06-22・Infra 質問ゲート）

- **IDQ6-1=A**: 新設 a11y 検査は **独立 `ci/a11y/`（a11y-runner.mjs＋package.json＋README）＋ `_shared-a11y.yml` reusable workflow**。
  Core 既存「1 concern = 1 subdir + reusable」パターン（ci/lint・ci/vrt・ci/registry）に完全準拠。拡張/portal からも再利用可能。
- **IDQ6-2=A**: Core 自己ゲートとして **新規 `component-check.yml`** を追加し、三層 lint＋VRT（`_shared-vrt` 自己呼び）＋a11y（`_shared-a11y`）を集約（fail-fast）。
- **ベースライン**: VRT/a11y とも **CI Linux 初回生成**が真実源（IDQ1=A/IDQ45-2=A と一貫）。`preview/__baseline__/` をコミット。

## LC → 実配置

| 論理コンポーネント | 実配置（Core repo） | 種別 |
|---|---|---|
| LC-ArrivalSpec | `components/arrival-card.spec.md` | 新規ファイル |
| LC-ArrivalPreview | `preview/components-arrival-card.html` | 新規ファイル |
| LC-StatusMapping | spec 内 写像表＋preview 状態サンプル | spec/preview に内包 |
| LC-PromotionDraft | `aidlc-docs/construction/u2-6-core-promotion/promotion/{issue-draft,pr-draft}.md`（本 repo・ドラフト） | 新規ファイル |
| LC-CICheck（lint） | 既存 `ci/lint/three-layer-lint.mjs`（再利用）＝`_shared-guardrail` | 既存・無改変 |
| LC-CICheck（VRT） | 既存 `ci/vrt/vrt-runner.mjs`（再利用）＝`_shared-vrt`（`preview/` 対象） | 既存・無改変 |
| LC-A11yCheck | **新規 `ci/a11y/{a11y-runner.mjs,package.json,README.md}`＋`.github/workflows/_shared-a11y.yml`** | 新規 |
| （ゲート統合） | **新規 `.github/workflows/component-check.yml`** | 新規 |
| LC-Confirm | 昇格確認チェックリスト（promotion/ ＋ dev-flow-journal） | ドキュメント |
| LC-Record | `aidlc-docs/dev-flow-journal.md` Step 7 | 追記 |

## 新規 a11y 機構（IDQ6-1=A）

### `ci/a11y/`（Core 同梱・共有正典）
- `a11y-runner.mjs`: 指定 `--dir`（preview）配下の HTML を Playwright/chromium で開き、`@axe-core/playwright` で
  WCAG 2a/2aa/21a/21aa を検査。**serious / critical 0** 以外は非ゼロ終了（マージブロック）。`--changed` 限定・
  `--format github`・違反 artifact 出力に対応（vrt-runner.mjs に倣う）。
- `package.json`: `@axe-core/playwright` ＋ `playwright`（**ci/vrt と同版 1.47.2** で固定）。`bin: { "fig-a11y": "a11y-runner.mjs" }`。
- `README.md`: 目的・使い方・しきい値（serious/critical 0）・ベースライン不要（a11y は基準値でなく規則違反検出）。

### `.github/workflows/_shared-a11y.yml`（reusable）
- `_shared-vrt.yml` と同構造: caller repo checkout → Core CI 正典 checkout（`.fig-core-ci`）→ Node →
  `ci/a11y` の deps install＋`npx playwright install --with-deps chromium` → `a11y-runner.mjs --dir <preview>` 実行 → 違反 artifact upload（always）。
- inputs: `core_repo`/`core_ref`/`preview_dir`(default `preview`)/`changed`。permissions: `contents: read`。Actions は SHA pin。

## Core 自己ゲート（IDQ6-2=A）

### `.github/workflows/component-check.yml`（新規）
- トリガ: `pull_request` ＋ `push: [core]`、`paths: [components/**, preview/**, semantic.css, primitives.css, tokens/**]`。
  `workflow_dispatch` も付与。
- jobs（fail-fast）:
  1. `lint` → `uses: ./.github/workflows/_shared-guardrail.yml`（root `.`・strict 任意）。
  2. `vrt` → `uses: ./.github/workflows/_shared-vrt.yml`（`preview_dir: preview`・threshold 既定）。
  3. `a11y` → `uses: ./.github/workflows/_shared-a11y.yml`（`preview_dir: preview`）。
- 全通過でも自動マージ禁止＝Core Maintainer 承認（SEC-3）。`palette-check.yml`/`registry-check.yml` と並ぶ Core 自己ゲート群に追加。

## ベースライン・配布
- VRT ベースライン `preview/__baseline__/components-arrival-card.*` は **CI Linux 初回生成**（OS 依存差排除）。a11y はベースライン不要。
- 追加依存（playwright/@axe-core/playwright）は **CI devtool のみ**＝Core 配布物（tokens/components/preview）に非影響（NRD6-PERF-1/SEC-1）。
- `registry.json`/`taxonomy.json` 変更なし（component は拡張プロジェクト登録でない）。SemVer **MINOR**。

## 従来型・N/A
- Compute/Storage/Network/DB/スケーリング/可用性：CI 上の検査追加のみ＝該当なし。
