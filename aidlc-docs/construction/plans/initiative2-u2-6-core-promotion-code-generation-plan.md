# Code Generation Plan — U2-6 Core 昇格実行（ドメインパターン）

> 対象: U2-6（代表昇格 `arrival-card`）。Infrastructure Design 承認済（2026-06-22）。
> repo: **FIG-UDS Core（`../FIG-Universal-Design-System`@core）**＋ 本 repo（导线ドラフト）。
> 実 push/Issue/PR/タグはユーザー承認後（FDQ6-3=A）。

## ★Code Gen 着手時の重要発見（FD/設計の実態調整）

Core 実体調査で以下が判明し、成果物スコープを **正典尊重の方向に収束**する:

1. **spec は既存・充実**: `patterns/arrival-card.md` が既に存在（Pattern Layer＝Card+StatusPill 合成・構造/優先順位/8状態/振る舞い/モーション/a11y/Experience Contract 完備）。FD の promotion-target-spec.md が描いた契約は**この既存 spec が上位互換で充足**。
   → **spec は改変しない**（Core 正典尊重・BR-PROMO-5 加算原則）。FD で `components/arrival-card.spec.md` を新規想定したが、実体は `patterns/arrival-card.md`（Pattern Layer）。
2. **preview が未整備（＝余白）**: `assets/js/portal-content.js` の `core/patterns/arrival-card` は **`preview: null`**。これは U2-4/U2-5 の coverage ビューが「未整備」と可視化していた当の余白。
   → **U2-6 の真の昇格成果＝この preview を作成し `preview: null` を解消し 未整備→整備済 へ遷移**（dogfooding の測定可能成果）。
3. 同様に delay-banner / notification-sheet / route-selector / page-transition も `preview: null`＝**代表1（arrival-card）以外は余白として残す**（FDQ6-1=A）。

## 実体化先（確定・Infra 反映の微修正込み）

| 成果物 | パス | 操作 |
|---|---|---|
| arrival-card spec | `patterns/arrival-card.md`（Core・既存） | **無改変**（参照のみ） |
| arrival-card preview | `preview/arrival-card.html`（Core・新規） | 新規作成（余白解消の本体） |
| portal 結線 | `assets/js/portal-content.js` `core/patterns/arrival-card` | `preview: null` → `preview: 'preview/arrival-card.html'` |
| a11y 機構 | `ci/a11y/{a11y-runner.mjs,package.json,README.md}`（Core・新規） | 新規（IDQ6-1=A） |
| a11y reusable | `.github/workflows/_shared-a11y.yml`（Core・新規） | 新規（IDQ6-1=A） |
| Core 自己ゲート | `.github/workflows/component-check.yml`（Core・新規） | 新規（IDQ6-2=A） |
| 导线ドラフト | 本 repo `construction/u2-6-core-promotion/promotion/{issue-draft.md,pr-draft.md}` | 新規（FDQ6-3=A） |

## 実装 step（Part 2）

- **S1 spec 確認**: `patterns/arrival-card.md` を読み、preview が視覚化すべき Structure（§1）/ State（§3：normal/possible-delay/delayed/arriving/passed/suspended）/ Priority（§2）を確定。spec は無改変。
- **S2 preview 作成**: `preview/arrival-card.html` を新規作成。既存 preview 様式（`../primitives.css`＋`../semantic.css`＋`../tokens/*` 参照・lucide CDN・eyebrow/h1/lede/section 構成）を踏襲。**card + status-pill + route-number badge + arrival-time の合成**で状態サンプル（normal/possible-delay/delayed/arriving/passed/suspended）を並べる。**生 HEX ゼロ**（トークンのみ）。BR-PROMO-2/BR-ARR-3 遵守。
- **S3 portal 結線**: `portal-content.js` の `core/patterns/arrival-card` の `preview: null` → `preview: 'preview/arrival-card.html'`。arrival-card を coverage 上 整備済へ。
- **S4 ci/a11y 新設**: `ci/a11y/a11y-runner.mjs`（Playwright/chromium で preview を開き `@axe-core/playwright` 検査・serious/critical 0 で非ゼロ終了・`--dir`/`--changed`/`--format github`・違反 artifact）＋`package.json`（@axe-core/playwright＋playwright 1.47.2・bin fig-a11y）＋`README.md`。vrt-runner.mjs に倣う。
- **S5 _shared-a11y.yml**: `_shared-vrt.yml` 構造踏襲の reusable（caller checkout→Core CI 正典 checkout→Node→ci/a11y deps＋playwright install chromium→a11y-runner 実行→artifact upload always・SHA pin・permissions contents:read・inputs core_repo/core_ref/preview_dir/changed）。
- **S6 component-check.yml**: 新規 Core 自己ゲート。`pull_request`＋`push:[core]`＋`workflow_dispatch`・`paths:[patterns/**,components/**,preview/**,semantic.css,primitives.css,tokens/**]`。jobs（fail-fast）= lint（_shared-guardrail）/ vrt（_shared-vrt・preview_dir:preview）/ a11y（_shared-a11y・preview_dir:preview）。
- **S7 导线ドラフト**: 本 repo `construction/u2-6-core-promotion/promotion/issue-draft.md`（core-promotion ラベル・「arrival-card preview 余白解消」背景/対象/受け入れ観点）＋`pr-draft.md`（Closes #・追加 preview＋ci/a11y＋workflows・spec 無改変・MINOR・検証）。
- **S8 ローカル検証**: preview の生 HEX ゼロを grep 確認・spec 参照整合・preview がトークン参照で自己完結（ブラウザ確認は静的）。可能なら portal build/coverage で arrival-card が整備済に遷移することを確認。**VRT/a11y ベースラインは CI Linux 初回生成**（ローカル未生成・IDQ6 既定）。
- **S9 docs**: `construction/u2-6-core-promotion/code/implementation-summary.md`＋dev-flow-journal Step 7（運用→Core 昇格＝余白解消の実証）＋confirmPromotion チェックリスト。
- **S10 state/audit**: 更新。

## スコープ境界
- 他3パターン（delay-banner/notification-sheet/route-selector）と page-transition の preview は**作らない**（代表1・FDQ6-1=A・余白として残す）。
- **spec 本文（patterns/arrival-card.md）は改変しない**（Core 正典尊重）。
- 22 件未収録ライブプレビュー（イニシアチブ スコープ外）には触れない。
- 実 push・実 Issue/PR・タグ発行は**ユーザー承認後**。

---

## 承認ゲート
**本プラン承認後に Part 2（実装）着手**。
