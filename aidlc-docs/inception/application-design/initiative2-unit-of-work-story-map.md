# Unit of Work — Story Map（イニシアチブ#2）

## ストーリー → Unit 割付（全ストーリーを Unit へ）
| ストーリー | 概要 | Unit | AC |
|---|---|---|---|
| US-D1 | 配布（submodule×Vite・Core CSS import） | U2-2 | AC①-4 |
| US-D2 | signature 集約（#2C6B5E→1トークン） | U2-1（生成）/ U2-2（適用） | AC①-1 |
| US-D3 | 状態色 semantic 化 | U2-1（status 生成）/ U2-3（適用） | AC①-2 |
| US-D4 | 生 HEX 直書き解消（主要画面 0） | U2-3 | AC①-3 |
| US-D5 | @theme トークンブリッジ（既存非回帰） | U2-2 | AC①, NFR2-3 |
| US-D6 | Mobile-Consumer プロファイル | U2-2 | — |
| US-D7 | before↔after 可視化 | U2-3 | AC①-5 |
| US-P1 | 役割別入口 | U2-4 | FR2-9 |
| US-P2 | シナリオA フロー（既存・★最優先） | U2-4 | AC②-1 |
| US-P3 | シナリオ② フロー（新規） | U2-4 | FR2-10 |
| US-P4 | getting-started 責務分離 | U2-4 | FR2-11 |
| US-P5 | オンボーディング/ランディング | U2-4 | FR2-13 |
| US-P6 | 未整備コンポ閲覧「余白」 | U2-4 | FR2-15 |
| US-P7 | 主要4操作のポータル完結（セルフ） | U2-5 | AC②-1/2 |
| US-X1 | Core 昇格実行（ドメインパターン） | U2-6 | FR2-7（S4=B） |
| US-X2 | UX 改修フロー（VSCode×Pencil） | U2-7 | FR2-14（S3=C） |
| US-X3 | GitHub 操作案内 | U2-5 | FR2-12 |
| US-X4 | 開発フロー記録・ポータル素材化 | 横断（全 Unit・C-Record） | FR-4.10 |

## Unit → ストーリー（逆引き）
- **U2-1 Core パレット基盤**: US-D2(生成)・US-D3(status 生成)＋AD5/AD5-2。
- **U2-2 配布・ブリッジ**: US-D1・US-D5・US-D6・US-D2(適用)。
- **U2-3 スタイル適用**: US-D3(適用)・US-D4・US-D7。
- **U2-4 ポータル IA**: US-P1〜P6。
- **U2-5 ポータル操作完結**: US-P7・US-X3。
- **U2-6 Core 昇格実行**: US-X1。
- **U2-7 UX 改修**: US-X2。
- **横断（記録）**: US-X4（全 Unit に内包）。

## 受け入れ条件 → Unit カバレッジ
| AC | 内容 | Unit |
|---|---|---|
| AC①-1 | signature 集約 | U2-1/U2-2 |
| AC①-2 | 状態色 semantic | U2-1/U2-3 |
| AC①-3 | 主要画面 hex 0 | U2-3 |
| AC①-4 | submodule×Vite build | U2-2 |
| AC①-5 | before↔after diff | U2-3 |
| AC②-1 | 主要4操作ポータル完結 | U2-5（＋U2-4 導線） |
| AC②-2 | セルフ検証 | U2-5 |
| AC②-3 | LLocana 実例導線 | U2-4 |

## 旅（ジャーニー）→ Unit（S1=C の通し線）
- **旅1「既存アプリを整える」**: U2-4(閲覧導線) → U2-2(配布) → U2-1(パレット) → U2-3(適用) → U2-7(UX) → U2-6(昇格)。
- **旅2「ポータルだけで操作する」**: U2-4(入口/シナリオ/オンボ/余白) → U2-5(4操作完結・GitHub 案内・セルフ検証)。

> 全 18 ストーリーが Unit に割付済み（US-X4 は横断内包）。未割付なし。
