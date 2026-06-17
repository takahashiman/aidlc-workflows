# Component Inventory

> Reverse Engineering 成果物 — コンポーネント/トークンの所在棚卸し（散在の可視化）

## ⚠️ 核心課題: コンポーネント定義の散在
同種のコンポーネント仕様が **3箇所**に分散しており、どれが正典か未確定。Inception で Core DS の正典カタログを1つに確定する必要がある。

| 所在 | 形式 | 件数 | 役割（推定） |
|---|---|---|---|
| `master(9ee445a)/components/` | `.spec.md` | 10 | Core DS の現行 spec（部分的） |
| `master(9ee445a)/fig-core/`(submodule c263831) | 実装一式 | — | primitives/semantic/components/tokens 等の実体 |
| `main(6f36074)/existing-code/.../components/` | `.spec.md` | 約28（重複含む） | 網羅カタログ（抽出元） |
| `main(6f36074)/extensions/busapp/components/` | `.jsx` 実装 | 4 | 拡張製品の実装（Card/Button/FAB/TextField） |

## master(9ee445a)/components の spec（10件）
bottom-navigation, button, card, icon-bubble, input, list-item, modal, status-pill, tab, toast

## main/existing-code の component spec（ユニーク 約28種）
alert, badge, bottom-navigation, bottom-sheet, breadcrumb, button, card, checkbox, fab, fig-sense, form-group, header, icon-bubble, icon-button, input, list-item, modal, navigation-rail, pagination, picker, radio-button, segmented-button, side-sheet, status-pill, tab, table, toast, toggle-switch

> 📋 **要確認**: ユーザー定義「FIG Core DS = 24コンポーネント」と、実体カタログ（master:10 / existing-code:約28）の差分。正典24の確定が Requirements で必要。

## 拡張プロジェクト busapp（実装済み）
- **components/**: `Card.jsx`, `Button.jsx`, `FAB.jsx`, `TextField.jsx`, `index.js`
- **tokens/**: `primitives.css`, `semantic.css`
- **preview/**: `button.html`, `card.html`, `textfield.html`
- **project-settings.json**, **README.md**

## トークン資産
- `master`: `primitives.css`, `semantic.css`, `tokens/`（Layer1/Layer2）
- `busapp`: `tokens/primitives.css`, `tokens/semantic.css`（製品具体化）

## 補助資産（master）
- `patterns/`, `storybook/`, `preview/`, `assets/`, `screenshots/`, `index.html`
- ドキュメント: ポータル構成案.md, デバイス別実装ガイドライン.md, 活用ガイドの作成.md, accessibility-guidelines.md, component-contract.md, design-system.md, SKILL.md

## Total Count（リポジトリ単位）
- **Total Repositories**: 4（aidlc-workflows / FIG-UDS / ProductA ＋ FIG-UDS内の自己参照submodule）
- **Core DS（中核）**: 1（FIG-UDS master）
- **拡張プロジェクト**: 1（busapp）
- **サンドボックス**: 1（ProductA）
- **ポータル**: 1（aidlc-workflows）
