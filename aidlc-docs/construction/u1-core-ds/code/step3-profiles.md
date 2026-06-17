# U1 Code — Step 3: プロファイル層（要約）

## 結論: 既存 3プロファイルを採用（修正なし）
`tokens/profile-{admin,consumer,terminal}.css` が既存・完備。`.fig-profile-*` セレクタで `--fig-*`（サイズ/余白/タイポ）を上書き。色（`--color-*`）はプロファイル不変（ブランド共通）。

| プロファイル | 最適化 | 例（既存値） |
|---|---|---|
| `.fig-profile-admin` | 情報密度（PC/業務） | body 13px / caption 11px / spacing 密 / radius 小 |
| `.fig-profile-consumer` | 操作性（スマホ） | （既存定義を採用） |
| `.fig-profile-terminal` | 固定視認性（業務端末） | （既存定義を採用） |

## 整合
- ✅ US-1.3 充足。既定＝admin（Web-Admin、ポータル用）
- 注: FDQ2=A「全トークン種をプロファイル上書き可」。現状は主にサイズ/余白/タイポを上書き（色はブランド共通の設計判断）。将来、必要に応じ color もプロファイル上書き可能な構造は維持
