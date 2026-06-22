# Infrastructure Design Plan — U2-1 Core パレット基盤（Part 1）

> U2-1 は **FIG-UDS Core repo 内のビルド時生成ユーティリティ**。クラウド/従来型インフラは大半 N/A。
> 各カテゴリを評価したが**未確定の論点なし**（FD/NFR 設計＋既存 Core CI から確定）。質問ゲートなしで生成。

## カテゴリ評価（質問不要の根拠）
- **Deployment Environment**: Core repo・GitHub-hosted runner（既存）。新規プロビジョニングなし。
- **Compute/Storage/Messaging/Networking**: **N/A**（ビルド時生成・ランタイム/DB/キュー/LB なし）。
- **Monitoring**: CI ログ＋ a11y 検証ステップの結果のみ（専用 observability 不要）。
- **Shared Infrastructure**: 生成器は Core 共有資産（全製品が利用）。既存共有 CI（`_shared-guardrail` 等）に接続。

## 生成する成果物（Part 2）
- [x] `construction/u2-1-core-palette/infrastructure-design/infrastructure-design.md`
- [x] `construction/u2-1-core-palette/infrastructure-design/deployment-architecture.md`
