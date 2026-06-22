# NFR Design Patterns — U2-4/U2-5 ポータル IA・操作完結

> NFR を満たす設計パターン。確定 PQ1-4／NQ1-3 に基づく。質問ゲートなし
> （justification: 入口/シナリオ/余白の方式は PQ で確定・検証方式は NQ で確定・配置粒度のみ Infra へ）。
> 初代ポータル(U2)の NFR Design（fail-fast＋空状態／taxonomy 駆動／最小依存＋自己ホスト SRI／
> iframe sandbox＋CSP＋SCA）を継承し、本ユニット分のパターンを追加する。

## SP1 — 新ランディング Home（後方互換ルート）
- **目的/NFR**: US-P1/P5・NRD45-REL-1。
- **方式**: 新 kind `home`・`renderHome()`・`DEFAULT_ROUTE='#/home'`。既存の深いルートは parseRoute で従来どおり
  解決＝Home 追加は導線の**追加**であって既存導線の置換ではない（後方互換）。
- **根拠**: 初訪問者のオンボーディングを満たしつつ、玄人の最小クリック（直リンク）を温存。

## SP2 — 役割別入口（固定対応表）
- **目的/NFR**: US-P1・NRD45-A11Y-1。
- **方式**: 役割（開発者/利用者/管理者）→誘導先を**データで固定定義**し renderHome がカードへ展開。権利者向け詳細
  GitHub 操作はポータル非掲載＝aidlc-docs への注記リンクのみ（NRD45-SEC-2/§4-2）。
- **根拠**: 「自分は何者か」で即分岐。誘導先の単一定義で保守容易（NRD45-MNT-3）。

## SP3 — ガイド as IA（usage テンプレ流用）
- **目的/NFR**: US-P2/P3/P7/US-X3・NRD45-MNT-1。
- **方式**: シナリオA/②・新製品セットアップ・移行・GitHub 操作案内を `usage.js GUIDES` に追加し
  `renderGuide()`（目的→前提→手順→確認）を流用。新ビュー・新依存を作らない。
- **根拠**: 既存テンプレ再利用で実装/テスト面積最小・一貫 UX。シナリオA は★最優先メタで先頭表示（BR-PIA-5）。

## SP4 — データ駆動 未整備可視化「余白」
- **目的/NFR**: US-P6・NRD45-REL-2。
- **方式**: `renderBrowseMargin()` が `core-content.json` PAGES（template=component/pattern）と `page.preview`
  有無で整備済/未整備を判定し一覧・バッジ・整備率を提示。**22 件 preview は作らない**（スコープ尊重・BR-PIA-8）。
  coreContent 未取込時は「未収集」で縮退。
- **根拠**: Core 側で preview を足せば自動で整備済へ切替（ポータル改修不要・§背景・BR-PIA-9）。

## SP5 — IA のみ責務分離（Core 本文不変）
- **目的/NFR**: US-P4・§4-4。
- **方式**: 導入（getting-started 系）と運用（昇格/版管理/配布）を Home/シナリオ/nav の導線と相互リンク注記で
  分離。Core 本文（`developer/*` PAGES）は rolling のまま改変しない。
- **根拠**: 本文正典は Core。ポータルは IA 調整に限定し rolling 整合を崩さない。

## SP6 — セルフ検証 結線テスト（4操作完結）
- **目的/NFR**: AC②-1/2・NRD45-MNT-2（本ユニット中核）。
- **方式**: node 純関数テストで、4操作それぞれ ①対応 GUIDES key 存在＋`renderGuide()` 描画、②Home/シナリオ導線
  リンクが当該 GUIDES へ解決、③ガイドが4節（目的/前提/手順/確認）を含む、を検証。`parseRoute('#/home')`・
  renderHome（3役割＋4クイックリンク）・renderBrowseMargin（整備済/未整備区別）も網羅。
- **根拠**: 「ポータルだけで操作完遂」を機械検証＝受け入れ条件直結・ゼロ SaaS。

## SP7 — ブラウザ VRT＋axe a11y（Playwright・ポータル新設）
- **目的/NFR**: NRD45-VRT-1〜3・NRD45-A11Y-2（NQ1=B/NQ2=B）。
- **方式**: `@playwright/test` をポータルに新設。`toHaveScreenshot` で Home/ランディング VRT（ベースライン
  CI Linux 真実源）＋`@axe-core/playwright` で同一実行に axe 検査（WCAG AA 重大違反0 を合否）。devDependencies。
- **根拠**: 新設 Home の見た目固定＋客観 a11y を1基盤で両立。配布バンドル非影響（NRD45-PERF-1）。

## パターン × NFR マトリクス
| パターン | Reliability | Maintainability | A11y | Performance | Security |
|---|---|---|---|---|---|
| SP1 後方互換 Home | ◎ | ○ | ○ | ○ | — |
| SP2 役割別入口 | ○ | ◎ | ◎ | — | ○ |
| SP3 ガイド as IA | ○ | ◎ | ○ | — | — |
| SP4 データ駆動余白 | ◎ | ○ | ○ | — | — |
| SP5 IA のみ分離 | ○ | ◎ | — | — | — |
| SP6 セルフ検証結線 | ◎ | ◎ | — | — | — |
| SP7 VRT＋axe | ○ | ○ | ◎ | ○(dev のみ) | — |

## 継承（初代ポータル NFR Design・再掲）
- fail-fast ビルド＋空状態/フォールバック／最小依存・自己ホスト SRI／iframe sandbox＋CSP／SCA。
- 従来型基盤（queue/cache/CB/LB/DB）は **N/A**（静的 SPA）。Scalability/Availability **N/A**。
