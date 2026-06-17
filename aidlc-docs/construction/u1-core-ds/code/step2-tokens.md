# U1 Code — Step 2: トークン層（要約）

## 結論: 既存を採用（再利用）。大規模リネームせず。
既存 Core の token 層は充実・ブランド準拠・三層準拠のため**そのまま採用**。BR-2（命名規約）を実態に合わせて修正済み。

## 採用したファイル（core ブランチ・修正なし）
| ファイル | 行数 | 役割 |
|---|---|---|
| `primitives.css` | 546 | 生値（ブランド色 `--color-brand-*`、`--fg-*` スレート、背景等） |
| `semantic.css` | 1221 | セマンティック色役割 `--color-{text,surface,icon,border}-*` ＋ State ＋ ドメイン |
| `tokens/base.css` | 115 | 基礎（`--fig-size-*`/`--fig-spacing-*` 既定等） |
| `tokens/components.css` | 224 | コンポーネント用トークン |
| `tokens/profile-*.css` | 62-64 ×3 | 3プロファイル上書き（Step3 で確認） |

## 命名規約（実態＝採用）
- `--color-*`：色役割（semantic 正典） / `--fig-*`：サイズ・余白・タイポ（プロファイル変動） / `--fg-*`：スレート primitive
- semantic.css 冒頭が層規約を明文化：「primitive → semantic role → component。component は raw hex/primitive を直接参照しない」

## 三層整合
- ✅ 層構造は既存で確立済み（semantic が primitive を参照、component は semantic を参照）
- U5 Lint はこの**多接頭辞規約**で検査する（生 hex/px・primitive 直参照を fail）

## 補修
- 本ステップでの CSS 変更は**なし**（既存が要件充足）。WCAG AA コントラストは Build&Test の a11y チェックで検証
