# U1 Core DS — Frontend Components（正典カタログ）

> FDQ1=A: **28コンポーネントすべてを正典採用**（「24」は概数）。FDQ3=A: フル契約。
> 各コンポーネントの詳細 spec/preview は Code Generation で `components/*.spec.md` / `preview/*.html` として実装。

## 実装方式（NRQ2 更新 2026-06-05）
**Core の正典＝CSS クラス `.fig-<name>`**（`tokens/components.css` 等で `--fig-*`/`--color-*` を消費、framework 非依存）＋ `spec.md` ＋ HTML preview。**JSX は Core に持たない**（各拡張の任意ラッパー）。

## 契約テンプレート（全コンポーネント共通・BR-8）
```
- 実装: CSS クラス .fig-<name>（生値なし・トークン経由）
- Props相当: [HTML属性/修飾子クラス（例 .fig-button--secondary）]
- States: Default / Hover / Active / Disabled / Error（5状態以上）
- a11y: aria 属性 / フォーカス管理 / コントラスト（WCAG 2.1 AA）
- Profiles: Admin / Consumer / Terminal すべてで成立
- Tokens: 参照する Semantic トークン一覧（生値ゼロ）
- Preview: preview/<name>.html（5状態以上）
```

## カテゴリ別カタログ（28）
### コンテナ（6）
| Component | 主用途 | 主 Props（高レベル） |
|---|---|---|
| card | ルート/情報カード | variant, elevation, interactive |
| modal | 中央モーダル | open, size, dismissible |
| bottom-sheet | 下部シート（mobile 寄り） | open, snapPoints |
| side-sheet | 側面シート（admin 寄り） | open, side |
| header | 画面ヘッダ | title, actions |
| form-group | フォーム群 | label, helpText, error |

### アクション（5）
| Component | 主用途 | 主 Props |
|---|---|---|
| button | 主 CTA | variant, size, disabled, loading |
| fab | 浮遊アクション | icon, extended |
| icon-button | アイコン操作 | icon, label(aria) |
| segmented-button | 排他選択 | options, value |
| toggle-switch | ON/OFF | checked, disabled |

### 入力（5）
| Component | 主用途 | 主 Props |
|---|---|---|
| input | テキスト入力 | type, value, error, placeholder |
| checkbox | 複数選択 | checked, indeterminate |
| radio-button | 単一選択 | name, value, checked |
| picker | 選択（日付/候補等） | options, value |
| table | 表（admin 重要） | columns, rows, sort |

### ナビゲーション（5）
| Component | 主用途 | 主 Props |
|---|---|---|
| tab | 画面内並列ビュー | tabs, active |
| breadcrumb | 階層位置 | items |
| pagination | ページ送り | page, total |
| navigation-rail | 縦ナビ（admin/PC） | items, active |
| bottom-navigation | 下部ナビ（mobile） | items, active |

### フィードバック/ステータス（5）
| Component | 主用途 | 主 Props |
|---|---|---|
| alert | 注意喚起 | severity, dismissible |
| toast | 一時通知 | message, duration |
| badge | 数値/ラベル | count, dot |
| status-pill | 状態ピル | status, label |
| fig-sense | FIG 固有の感覚表現/インジケータ | （spec で定義） |

### コンテンツ/リスト（2）
| Component | 主用途 | 主 Props |
|---|---|---|
| list-item | リスト行 | leading, trailing, onClick |
| icon-bubble | アイコン装飾 | icon, color(Domain Color Slot) |

## 優先実装順（Code Generation 用の目安）
1. card / button / input（基盤・利用頻度高）
2. modal / list-item / table / tab（admin 中核）
3. 残りを状態・preview 完備で順次

## 注記
- `fig-sense` は FIG 固有要素のため、Code Generation 前に既存 spec を精査して契約を確定
- mobile 寄り（bottom-sheet/bottom-navigation/fab）も Core に保持（3プロファイル対応の責務）
