# Tech Stack Decisions — U2-6 Core 昇格実行（ドメインパターン）

> 代表昇格 `arrival-card` の技術選定。確定回答 FDQ6-1〜4 / NQ6-1=B / NQ6-2=A に基づく。
> 基本方針＝**Core 既存正典の継承・再利用**（BR-CI-NODUP-1）。採番＝TSD6-*。

## TSD6-1 — 成果物形式は Core 慣習（FDQ6-2=A）
- `components/arrival-card.spec.md`（契約）＋ `preview/components-arrival-card.html`（静的状態ギャラリー）。
- Core は spec 駆動でコンポーネント実体コードを持たないため、TS/React 実装は生成しない。

## TSD6-2 — arrival-card = card + status-pill 合成（混入禁止）
- コンテナは `card`（variant=interactive）トークン契約に委譲。運行状態は `status-pill` に委譲（配色を arrival-card が持たない）。
- 系統番号/ダイヤ種別は中立 `badge`。ドメインフィールド（到着まで/停留所先/行先）は Core text トークンで表現。
- 生 HEX・非 Core ユーティリティの持ち込み禁止（NRD6-MNT-2）。

## TSD6-3 — 検証は既存 CI 正典を再利用
- 生 HEX/層違反＝Core 既存 **三層 lint**（`_shared-guardrail` / `ci/lint/three-layer-lint.mjs`）。
- 視覚回帰＝Core 既存 **VRT**（`_shared-vrt` / `ci/vrt/vrt-runner.mjs`＝Playwright/chromium）。`preview/` 対象に arrival-card を含める。ベースラインは CI Linux 真実源。
- registry-check は対象外（component は registry.json 登録対象でない）。

## TSD6-4 — 自動 a11y 検査の新設（NQ6-1=B）
- **既存 Playwright/chromium VRT 基盤（`ci/vrt`）を再利用**し `@axe-core/playwright`（または axe-core）を追加して、arrival-card preview を実ブラウザで a11y 検査。**serious / critical 0** をゲート。
- 配置選択肢（Infra Design で確定）:
  - (a) `ci/a11y/a11y-runner.mjs` ＋ 共有 `_shared-a11y.yml` reusable workflow（lint/VRT と同じ「Core 正典 reusable」流儀・他 repo からも参照可能）。
  - (b) 既存 `ci/vrt` に a11y ステップを同居（最小変更だが責務混在）。
- **代替不採用**: jsdom+axe（CDN lucide/実描画の忠実性が落ちる）。新規 a11y SaaS（最小依存方針に反する）。
- 配布非影響＝axe/Playwright は CI devtool のみ（NRD6-PERF-1 / SEC-1）。

## TSD6-5 — Security 供給面は既存パターン継承（NQ6-2=A）
- preview は lucide CDN（unpkg pin）を踏襲＝新規ランタイム依存なし。秘密非保持。
- 追加 workflow の Actions は SHA pin・permissions 最小（NRD6-SEC-2）。マージは Core Maintainer 承認（NRD6-SEC-3）。

## TSD6-6 — バージョニング
- コンポーネント追加＝**SemVer MINOR**（後方互換）。release.yml がタグで CHANGELOG 自動更新（既存）。
- `registry.json`/`taxonomy.json` 変更不要。

## TSD6-7 — GitHub 导线は本文ドラフト（FDQ6-3=A）
- Issue（`core-promotion` ラベル）/ PR の本文ドラフトを成果物化。実 push・実起票・実 PR 作成・タグ発行はユーザー承認後。

## 継承（初代/前ユニット）
- BR-CI-NODUP-1（CI 正典を二重実装しない）/ BR-CI-SEC-1（Actions SHA pin）/ SEC-3（自動マージ禁止・Maintainer 承認）。
- U2-1 の a11y 思想（AA を Semantic/palette 層で事前検証）＝arrival-card は委譲で継承。
- U2-4/U2-5 の Playwright＋axe 導入知見＝Core 側 a11y 検査にも同系ツールを採用し一貫性を確保。
