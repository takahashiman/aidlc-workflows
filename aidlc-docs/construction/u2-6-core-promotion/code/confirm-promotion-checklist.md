# confirmPromotion チェックリスト — arrival-card（U2-6 / BR-PROMO-6 / Q9=C セルフ検証）

> LC-Confirm。昇格成立の自己検証。■=実装/設計で充足、□=承認後 CI/マージで確定。

## 成果物（加算・後方互換）
- [x] `preview/arrival-card.html` 新規作成（余白解消の本体）
- [x] `patterns/arrival-card.md`（既存 spec）無改変
- [x] 既存 component spec / preview / workflow 無改変
- [x] `portal-content.js` `core/patterns/arrival-card` `preview: null` → path

## 品質（生 HEX 0・プリミティブ合成・混入禁止）
- [x] preview 生 HEX ゼロ（grep 0・`var(--...)` のみ）
- [x] 運行状態の配色を `status-pill`（`--color-status-*`）に委譲（arrival-card 独自配色なし）
- [x] コンテナは `card-fig` プリミティブに委譲
- [x] 色だけで意味を伝えない（status-pill アイコン＋ラベル併記・取消線に `aria-label="変更前"`）
- [x] カードに集約 aria-label（spec §6 準拠）

## CI ゲート（新設・承認後 CI で確定）
- [x] `ci/a11y/`（runner＋package＋README）新設・`node --check` OK
- [x] `_shared-a11y.yml` reusable 新設（SHA pin・permissions 最小）
- [x] `component-check.yml` 新設（lint + VRT + a11y 集約・paths 設定）
- [ ] 三層 lint 緑（CI）
- [ ] VRT ベースライン初回生成（CI Linux）＋緑
- [ ] a11y axe serious/critical 0（CI Linux）

## 导线（AD2=C・承認後）
- [x] Issue ドラフト（`core-promotion`）／PR ドラフト 用意
- [ ] 実 push → Issue 起票 → PR 作成
- [ ] Core Maintainer 承認でマージ（自動マージ禁止）
- [ ] release.yml で MINOR タグ → CHANGELOG 自動更新

## 昇格確認（マージ後）
- [ ] components/patterns カタログ・coverage ビューで arrival-card が「整備済」（整備率 9/36 → 10/36）
- [ ] ポータル rolling 取込で arrival-card の Live Preview が閲覧可能
