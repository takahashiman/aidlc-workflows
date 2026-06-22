# NFR Design Patterns — U2-6 Core 昇格実行（ドメインパターン）

> 代表昇格 `arrival-card` の設計パターン。NQ6-1=B / NQ6-2=A 確定済のため質問ゲートなしで生成。
> a11y 検査の物理配置（`ci/a11y/` 独立 reusable か `ci/vrt` 同居か）は **Infrastructure Design で確定**。採番＝SP6-*。

## SP6-1 — 加算昇格（後方互換・MINOR）
- 新規 `components/arrival-card.spec.md`＋`preview/components-arrival-card.html` の追加のみ。既存 spec/preview を改変しない。
- ギャラリー/索引への登録（加算）のみ。SemVer MINOR。`registry.json`/`taxonomy.json` 変更なし。
- **対応 NFR**: NRD6-REL-1/2/3。

## SP6-2 — プリミティブ合成によるドメインパターン（混入禁止）
- arrival-card = `card`（コンテナ・委譲）＋ `status-pill`（運行状態・配色委譲）＋ 中立 `badge`（系統番号/ダイヤ種別）＋ Core text トークン（到着まで/停留所先/行先）。
- arrival-card 自身は配色トークンを持たない＝混入防止の構造的担保。生 HEX ゼロ。
- 製品 `BusArrival.status` → status-pill status の写像はパターンの一部（extractPattern が同定）。
- **対応 NFR**: NRD6-MNT-2 / A11Y-1。

## SP6-3 — spec＋preview 二点形式（Core 慣習）
- 契約は spec.md（Props/バリエーション/トークン参照/ルール/a11y）、視覚正典は preview.html（Default/Delayed/Approaching/Passed の静的状態ギャラリー）。
- spec 冒頭で `design-system.md` 参照を必須注記。既存 spec と同一様式。
- **対応 NFR**: NRD6-MNT-1 / REL-2。

## SP6-4 — AD2=C 二段导线（Issue→PR・ドラフト化）
- 提案＝`core-promotion` ラベル Issue（背景/対象/受け入れ観点）。実体＝PR（preview/spec・Issue 参照）。
- 本ユニットでは本文ドラフトを成果物化し、実 push/起票/PR/タグはユーザー承認後（FDQ6-3=A）。
- **対応 NFR**: NRD6-SEC-3（Maintainer 承認）/ REL-3（MINOR）。

## SP6-5 — 既存 CI 正典の再利用（二重実装しない）
- 生 HEX/層違反＝既存 三層 lint（`_shared-guardrail`）。視覚回帰＝既存 VRT（`_shared-vrt`＝Playwright/chromium）に `preview/` として arrival-card を含める。
- ベースラインは CI Linux 真実源（初回 push 時生成）。
- **対応 NFR**: NRD6-MNT-3 / VRT-1 / REL-2。

## SP6-6 — 自動 a11y ゲートの新設（既存基盤再利用）
- arrival-card preview を実ブラウザで a11y 自動検査し serious/critical 0 をマージゲート化。
- **既存 Playwright/chromium VRT 基盤（`ci/vrt`）を再利用**し `@axe-core/playwright`（または axe-core）を追加。新規基盤を立てない。
- 物理配置（独立 `_shared-a11y.yml` / `ci/a11y/a11y-runner.mjs` か、`ci/vrt` 同居か）は Infra で決定。
- axe/Playwright は CI devtool のみ＝配布非影響。
- **対応 NFR**: NRD6-A11Y-2 / PERF-1 / SEC-1。

## パターン × NFR マトリクス

| パターン | REL | MNT | A11Y | VRT | PERF | SEC |
|---|---|---|---|---|---|---|
| SP6-1 加算昇格 | ◎ | ○ | | | | |
| SP6-2 プリミティブ合成 | | ◎ | ◎ | | | |
| SP6-3 spec+preview | ○ | ◎ | | | | |
| SP6-4 二段导线 | ○ | | | | | ◎ |
| SP6-5 既存 CI 再利用 | ◎ | ◎ | | ◎ | | |
| SP6-6 自動 a11y 新設 | | | ◎ | | ○ | ○ |

## 継承（初代/前ユニット）
- BR-CI-NODUP-1（CI 正典を二重実装しない）/ BR-CI-SEC-1（Actions SHA pin）/ SEC-3（自動マージ禁止・Maintainer 承認）/ fail-fast（CI ハング自動打切り）。
- U2-1 a11y 思想（AA を Semantic/palette 層で事前検証）＝委譲で継承。U2-4/U2-5 の Playwright＋axe 知見を Core 側にも適用（一貫性）。

## 従来型・N/A
- Scalability / Availability：静的 spec/preview 追加でサービス/インフラ増設なし＝該当なし。
- 従来型 NFR（DB/キャッシュ/スループット等）：本ユニットは設計ドキュメント生成のため該当なし。
