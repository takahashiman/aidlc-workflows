# Infrastructure Design — U2-1 Core パレット基盤（C-Palette）

> 論理コンポーネント（LC-*）を実配置へマッピング。U2-1 は Core repo 内のビルド時ユーティリティ。

## 実行基盤
- **配置先 repo**: FIG-UDS Core（`takahashiman/FIG-Universal-Design-System`）。
- **実行**: Node（ビルド時）。**GitHub-hosted runner**（既存 CI）／ローカル `npm run` で再現可。
- **ランタイム基盤**: なし（出力は静的 CSS）。compute/storage/messaging/networking/DB は **N/A**。

## コンポーネント配置（Core repo 内・想定パス）
| 論理要素 | 配置（想定） |
|---|---|
| LC-Orchestrator / Deriver / StatusDeriver / A11y / Emitter / SeedInput | `tools/palette-gen/`（生成器一式） |
| LC-ColorMath（PoC 確定） | `tools/palette-gen/color-math.*`（案A ゼロ依存 or 案B culori を隔離） |
| 出力（ブランド既定パレット） | `tokens/signature.css` / `tokens/status.css`（semantic が参照） |
| 出力（AAA 充足版・NQ3＋） | `tokens/signature-aaa.css` / `tokens/status-aaa.css`（選択利用） |
| 生成法則ドキュメント | Core `design-system` ドキュメント（コードのみ更新禁止） |

## ビルド結線
- **npm script**: `gen:palette`（seed を入力にトークン CSS を生成）。Core 既定はブランド seed で生成しコミット（NQ2=A）。
- **製品側生成**: 各製品（LLocana=U2-2）は Core を submodule pin し、**製品ビルドで `gen:palette --seed=<製品 seed>` を実行**して製品用 signature/status トークンを生成（Taste 派生）。Core は生成器＋ブランド既定を提供。
- **冪等**: 同 seed→同出力（CI で再生成し差分が出ないことを検査可＝drift gate）。

## CI（既存共有 CI へ接続）
- **三層ガードレール**（`_shared-guardrail`）: 生成 CSS が三層規約（生 HEX は primitive/signature 層のみ・semantic 経由）に適合。
- **a11y 検証ステップ（新規）**: 生成トークンの全 on/status ペアを `validateA11y` で再検証し、**AA 不合格があれば CI 失敗**（P3）。AAA 版は AAA で検査。
- **drift 検査**: `gen:palette` 再実行で出力が一致（決定性の担保）。
- **SCA**: 色演算ライブラリ採用時のみ依存スキャン（案A ゼロ依存なら対象なし）。

## バージョニング
- U2-1 は Core への**機能追加**＝SemVer **MINOR**（新タグ）。製品は submodule で当該タグに pin（U2-2）。ポータルは rolling で取込。

## セキュリティ
- ランタイム攻撃面なし。秘密情報なし。該当は SCA のみ（NFR-PAL-Security）。

## 監視
- 専用 observability 不要。CI ログ＋ a11y/drift ゲートの合否で十分。
