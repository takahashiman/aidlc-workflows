# Logical Components — U2-4/U2-5 ポータル IA・操作完結

> 本ユニットの論理コンポーネント（実ファイル配置は Infrastructure Design で確定）。
> すべて `aidlc-workflows/portal/` 内。既存 SPA（純粋関数 render・hash router・rolling Core 取込）に追加。

## LC-Home — Home ランディング
- **責務**: 役割別入口3枚＋はじめに読む順番＋シナリオ入口＋4操作クイックリンクを描画（SP1/SP2）。
- **想定実装**: `views.js renderHome(ctx)`（HTML 文字列を返す純粋関数）。ctx.data（taxonomy/registry/
  coreContent/buildInfo）参照可。
- **依存**: LC-RoleEntry（誘導先定義）・LC-ScenarioGuides/LC-OpsGuides（リンク先）。

## LC-RoleEntry — 役割→誘導先 定義
- **責務**: 開発者/利用者/管理者 各カードの誘導先を単一データ定義（SP2・NRD45-MNT-3）。権利者向け詳細操作は
  aidlc-docs 注記リンクのみ（NRD45-SEC-2）。
- **想定実装**: `content.js` の定数（例 `ROLE_ENTRIES`）。

## LC-ScenarioGuides — シナリオ別ガイド
- **責務**: シナリオA（既存★最優先）/②（新規）を usage GUIDES として定義・描画（SP3・BR-PIA-4/5/6）。
- **想定実装**: `usage.js GUIDES` に `scenario-existing`/`scenario-new` 追加。`usageIndex()` でA を先頭・★表示。
- **依存**: LC-OpsGuides（手順内リンク）・プロジェクト集（LLocana 実例・AC②-3）。

## LC-OpsGuides — 主要操作ガイド（4操作完結＋GitHub 案内）
- **責務**: 新製品セットアップ/移行/GitHub 操作案内を GUIDES 追加（既存 promotion/core-version と併せ4操作網羅・
  SP3・BR-PIA-10/11）。
- **想定実装**: `usage.js GUIDES` に `new-product-setup`/`migration`/`github-operations` 追加。

## LC-CoverageView — 未整備可視化「余白」
- **責務**: Core カタログの整備済/未整備（preview 未収録）を一覧・バッジ・整備率で提示（SP4・BR-PIA-8/9）。
- **想定実装**: `views.js renderBrowseMargin(ctx)`。`core-content.json` PAGES＋`page.preview` 有無で判定。
  ルート位置（overview 配下 coverage item or 独立）は Infra で確定。

## LC-Router — ルーティング拡張
- **責務**: 新 kind `home`・`DEFAULT_ROUTE='#/home'`・余白ルート（SP1）。後方互換で既存ルート不変。
- **想定実装**: `router.js` KINDS/parseRoute/DEFAULT_ROUTE、`portal.js renderView()` に `case 'home'`、
  `titleFor()` に home、ブランドロゴ href→`#/home`。

## LC-IALinking — 導入↔運用 相互リンク（責務分離）
- **責務**: 導入（getting-started 系）と運用（昇格/版管理/配布）を導線・注記で分離（SP5・BR-PIA-7）。
- **想定実装**: Home/シナリオ導線の分岐＋Developer ガイド描画時の運用ビュー相互リンク注記（views 側・本文不変）。

## LC-Verify — 検証（node テスト＋Playwright VRT/a11y）
- **責務**: SP6（セルフ検証結線）＋SP7（VRT＋axe）。
- **想定実装**:
  - `tests/` に node 純関数テスト追加（parseRoute home／GUIDES 5新規／renderHome 3役割＋4クイックリンク／
    renderBrowseMargin 整備区別／**4操作リンク到達 結線テスト**）。
  - `@playwright/test`＋`@axe-core/playwright` 新設＝Home/ランディング VRT（CI Linux ベースライン）＋axe 検査。
  - CI 配線（既存 portal-deploy.yml 拡張 or 新規 workflow）は Infra で確定。

## 依存図（要約）
```
LC-Router ──► LC-Home ──► LC-RoleEntry
                 │           └► (aidlc-docs 注記)
                 ├──► LC-ScenarioGuides ──► LC-OpsGuides ──► (promotion/core-version 既存)
                 ├──► LC-CoverageView ◄── core-content.json (PAGES/preview)
                 └──► LC-IALinking (導入↔運用 注記)
LC-Verify  ──► 上記すべて（node テスト＋Playwright VRT/a11y）
```

## 読込/描画順
1. build.mjs が Core を rolling 取込→`data/*.json`（既存）。
2. SPA 起動→router が `#/home`（既定）→renderView→renderHome。
3. 役割/シナリオ/クイックリンク→usage GUIDES／overview／ops／projects へ遷移（後方互換）。

## 検証観点（Code Gen で実施）
- node テスト: 上記 LC-Verify 列挙項目（特に4操作セルフ検証結線＝AC②-2）。
- Playwright: Home VRT ベースライン（CI Linux）＋axe 重大違反0。
- build 成功・schema 検証・既存 16+ テスト緑（後方互換）。

## N/A
- 従来型基盤（queue/cache/CB/LB/DB）・Scalability/Availability＝N/A（静的 SPA）。
