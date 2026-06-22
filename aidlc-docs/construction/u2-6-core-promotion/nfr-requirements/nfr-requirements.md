# NFR Requirements — U2-6 Core 昇格実行（ドメインパターン）

> 代表昇格 `arrival-card`（spec＋preview）の非機能要件。確定回答 NQ6-1=B / NQ6-2=A に基づく。
> Core 既存 CI 正典（三層 lint・`_shared-vrt`・Actions SHA pin・Maintainer 承認マージ）を継承（BR-CI-NODUP-1）。
> 採番＝NRD6-*。Scalability / Availability は **N/A**（静的 spec/preview の追加・サービス増設なし）。

## Reliability / 後方互換（◎）

### NRD6-REL-1 — 昇格は加算・既存無改変
- 新規 `components/arrival-card.spec.md`＋`preview/components-arrival-card.html` の追加のみ。既存 spec/preview を改変しない。

### NRD6-REL-2 — Core ビルド/索引の健全性維持
- ギャラリー（`_core-gallery`）/ components 索引に新規が載り、Core の既存 lint・VRT が緑であること。
- preview はブラウザで Core トークン（primitives/semantic）を参照して描画できること。

### NRD6-REL-3 — SemVer MINOR
- コンポーネント追加＝後方互換の機能追加＝MINOR。`registry.json`/`taxonomy.json` は変更不要（component は拡張プロジェクト登録ではない）。

## Maintainability（◎）

### NRD6-MNT-1 — Core 慣習準拠の spec 様式
- spec は既存コンポーネント spec と同一様式（目的/バリエーション/Props 契約/トークン参照/ルール/a11y/実装現況）。冒頭で `design-system.md` の Design System Rules 参照を必須注記。

### NRD6-MNT-2 — 生 HEX ゼロ・プリミティブ合成（他スタイル混入禁止）
- preview/spec は Core 三層トークンと既昇格プリミティブ（card / status-pill / badge）のみで構成。製品の生 HEX・非 Core ユーティリティを持ち込まない（BR-PROMO-2）。
- 運行状態の配色は arrival-card 自身が持たず status-pill に委譲。

### NRD6-MNT-3 — 既存 CI 正典の再利用（二重実装しない）
- 検証は Core 既存の三層 lint（`_shared-guardrail`）と preview VRT（`_shared-vrt`）に乗せる。新規 a11y 検査も**既存 Playwright/chromium VRT 基盤（`ci/vrt`）を再利用**して実装する（BR-CI-NODUP-1）。

## Accessibility（○→自動化を追加）

### NRD6-A11Y-1 — トークン委譲で AA 継承
- arrival-card は新規配色を導入せず、status-pill / card の AA 既検証トークンを利用する（fg/bg コントラスト ≥ 4.5）。

### NRD6-A11Y-2 — 自動 a11y 検査を Core CI に新設（NQ6-1=B）
- arrival-card preview を実ブラウザで a11y 自動検査し、**serious / critical 違反 0** をマージゲートにする。
- 実装は Core 既存 Playwright/chromium 基盤（`ci/vrt`）を再利用し `@axe-core/playwright`（または axe-core）を追加（配置/起動は Infra で確定）。

### NRD6-A11Y-3 — 色だけで意味を伝えない
- 運行状態はアイコン＋ラベル併記（status-pill 規約継承）。「まもなく」「通過済」は文言でも示す。

## VRT（Reliability の視覚回帰・既存基盤）

### NRD6-VRT-1 — preview を既存 VRT に組み込む
- `components-arrival-card.html` を `_shared-vrt`（`preview/` 対象）に含め、**ベースラインは CI Linux で初回生成**（真実源）。状態サンプル Default/Delayed/Approaching/Passed を網羅。

## Performance（N/A 寄り・継承）

### NRD6-PERF-1 — 厳密予算なし・配布非影響
- spec/preview は静的ドキュメント＝配布バンドル/ランタイムに非影響。a11y/VRT の依存（Playwright/axe）は CI devtool のみで配布物に含めない。性能予算は設けず Core 既存方針を継承。

## Security（供給面のみ・△）

### NRD6-SEC-1 — 供給面は最小・新規依存なし（NQ6-2=A）
- preview は既存 Core preview パターン（lucide CDN・unpkg pin）を踏襲し、新規ランタイム依存・秘密を持ち込まない。
- 追加する a11y devtool（axe）は CI のみで使用し、配布成果物には含めない。

### NRD6-SEC-2 — CI 供給面の継承
- 追加/変更する workflow の Actions は SHA pin（BR-CI-SEC-1）、permissions 最小（contents: read）を継承する。

### NRD6-SEC-3 — マージは Core Maintainer 承認
- 全 CI 通過でも自動マージ禁止。昇格 PR は Core Maintainer 承認でマージ（SEC-3 継承）。FDQ6-3=A により本ユニットでは实 push/PR は承認後。

## N/A

- **Scalability / Availability**: 静的 spec/preview の追加でサービス/インフラ増設なし＝該当なし。
