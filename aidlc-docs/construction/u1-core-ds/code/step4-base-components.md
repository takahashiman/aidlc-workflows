# U1 Code — Step 4: 基盤コンポーネント（要約）

## 結論: 既存の基盤3部品を採用（CSSクラス方式・NRQ2更新）
button / card / input は **CSS クラス＋spec＋preview が既存で揃っている**ため採用・確認。

| 部品 | CSS クラス | spec | preview |
|---|---|---|---|
| button | `.fig-button`（+`--secondary`/`--ghost`） ✅ | `components/button.spec.md` ✅ | `preview/components-buttons.html` ✅ |
| card | `.fig-card` ✅ | `components/card.spec.md` ✅ | `preview/components-bus-card.html`（+pass-card） ✅ |
| input | `.fig-input` ✅ | `components/input.spec.md` ✅ | `preview/components-inputs.html` ✅ |

## 整合（BR-8）
- ✅ トークン経由（生値なし）・3プロファイル成立（`.fig-profile-*` で自動最適化）
- States/a11y/data-testid は Step5 と合わせて spec/preview の完備度を点検（Build&Test の a11y 検証へ）
- 本ステップでの新規 CSS は不要（既存採用）。`data-testid` 規約は将来 JSX ラッパー側で付与（Core は CSS クラスのため対象外）
