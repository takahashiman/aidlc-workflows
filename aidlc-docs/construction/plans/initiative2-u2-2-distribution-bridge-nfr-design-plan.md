# NFR Design Plan — U2-2 配布・ブリッジ

> NFR の論点は FD（FDQ1-5）と NFR-Req（NQ1-3）で確定済み。**未確定の設計論点なし** → 質問ゲートなしで生成。
> 従来型インフラ要素（queue/cache/CB/LB/DB）は **N/A**（ビルド時生成・静的配布）。

## 質問不要の根拠
- 非回帰の担保方式（build＋自己ビジュアル）・配布（submodule×pin v1.2.0）・生成（ビルド時 gitignore）・
  ブリッジ範囲（中核＋面/線）・旧DS（委譲→段階無効化）・プロファイル・Security 範囲は全て確定済。
- 残りは「確定事項を設計パターン・論理要素へ落とす」作業のみ。

## 生成する成果物
- [ ] `construction/u2-2-distribution-bridge/nfr-design/nfr-design-patterns.md`（P1-Pn）
- [ ] `construction/u2-2-distribution-bridge/nfr-design/logical-components.md`（LC-* ＋ 従来型 N/A）
