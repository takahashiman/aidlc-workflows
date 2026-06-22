# Deployment Architecture — U2-4/U2-5 ポータル IA・操作完結

> 確定 IDQ45-1=B / IDQ45-2=A / IDQ45-3=A。既存 Pages デプロイ（Actions artifact 直接）に品質ゲートを追加。

## 配備図（拡張点を ★ で示す）

```
[aidlc-workflows repo] portal/
        │  push / dispatch(core-released) / nightly / 手動
        ▼
  portal-deploy.yml（1 workflow・ubuntu）
   ├─ build job（既存）
   │    Core DS rolling 取込 → validate(schema) → npm test（node 結線テスト内包 ★） → build → upload-pages-artifact(portal/site)
   ├─ quality job（★新規・needs: build）
   │    playwright install chromium → build(site) → ★VRT(Home＋余白＋使い方index) → ★a11y(axe AA) → 失敗時 artifact
   └─ deploy job（needs: build, quality ★）
        deploy-pages → GitHub Pages（公開）
```

- **品質ゲート**: VRT/a11y 失敗時は deploy しない（fail-fast・NRD45-VRT/A11Y）。
- **Linux 真実源**: VRT ベースラインは ubuntu で生成・repo 管理（OS 依存差回避）。
- 新依存（Playwright/axe）は devDependencies＝**Pages 成果物・配布バンドルに非影響**（NRD45-PERF-1）。

## 品質ゲート一覧（本ユニット後）
| ゲート | 実行 | 合否 |
|---|---|---|
| schema/integrity | build job validate | fail-fast |
| node 結線テスト（4操作セルフ検証＝AC②-2 含む） | build job `npm test` | 失敗で停止 |
| VRT（Home＋余白＋使い方index） | quality job | ベースライン差分超で fail |
| a11y（axe WCAG AA serious/critical 0） | quality job | 違反で fail |
| Pages deploy | deploy job | build＋quality 成功時のみ |

## ロールバック
- 品質ゲート失敗→deploy されず前回公開を維持（Pages は最後に成功した artifact）。
- IA 不具合は portal/src の revert＋再 push で復旧（静的・状態なし）。

## ベースライン更新フロー
- 意図的な IA/見た目変更時: `npx playwright test --update-snapshots` を CI/ローカルで実行し
  `tests/vrt/__screenshots__/` を更新コミット（レビュー対象）。

## N/A
- 従来型基盤（queue/cache/CB/LB/DB）・マルチ AZ・オートスケール＝N/A（静的 SPA・Pages）。

## トレーサビリティ
- IDQ45-3=1 workflow 集約（portal-deploy.yml 拡張）。AC②-2=node 結線テストゲート。NRD45-VRT/A11Y=quality job。
