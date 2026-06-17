# U1 Core DS — Infrastructure Design Plan

> Core DS は git 配布（submodule）＋ git タグ＋GitHub。クラウド基盤は N/A。
> 実在の論点＝**リポジトリ確立（現 FIG-UDS.git の整理）** と **リリース自動化**。下部 `[Answer]:` にご記入ください。

## 生成する成果物（チェックリスト）
- [x] `infrastructure-design.md` — リポジトリ/配布/バージョニング基盤、CI フック、メタデータ配置
- [x] `deployment-architecture.md` — Core DS の「配置」アーキ（git 中心）

## カテゴリ評価（MANDATORY・根拠付き）
| カテゴリ | 評価 | 根拠 |
|---|---|---|
| Deployment Environment | **適用（GitHub）** | リポジトリ＋タグ。クラウド環境なし |
| Compute / Storage / Messaging / Networking | **N/A** | ランタイム/永続化/通信なし（静的 source） |
| Monitoring | **代替** | サービス監視なし。代替＝CI（Lint/scan, U5）＋VRT（U2連携） |
| Shared Infrastructure | **適用** | 共有 Lint 設定（CD-7）・メタデータ正典（registry/taxonomy） |

## 確認質問

### IDQ1. Core DS リポジトリの確立方法（現 FIG-UDS.git の整理）
現 `FIG-Universal-Design-System.git` は master(9ee445a)=Core 実体／main(6f36074)=AI-DLC docs＋busapp が無関係同居、かつ fig-core 二重ネストあり。

A) **既存 `FIG-Universal-Design-System.git` をリブランド/整理**（master系=Core を**デフォルトブランチ**化、6f36074 系の busapp は `fig-ext-bus-*` へ移設、二重ネスト解消）（推奨：履歴・既存 submodule 参照を保全）
B) **新規 `FIG-Core-DS.git`** を作成し master(9ee445a) 内容で清新スタート（旧 repo はアーカイブ）
X) Other

[Answer]: A

### IDQ2. リリース／CHANGELOG 自動化
A) **GitHub Actions ＋ git-cliff（既存 `cliff.toml`）**：タグ時に CHANGELOG/GitHub Release を自動生成（推奨）
B) 手動タグ＋手動 CHANGELOG
X) Other

[Answer]: A
