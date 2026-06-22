# Application Design — Services（イニシアチブ#2）

> サービス＝複数コンポーネントのオーケストレーション。

## S-Distribution — Core 取り込み・スタイル整理のオーケストレーション
- **責務**: 既存アプリ（LLocana）へ Core を取り込み、スタイルを FIG-UDS フローへ寄せる一連を統括。
- **連携順**: `C-Distrib.addCoreSubmodule/pin/importCoreCss` → `C-Signature.injectSignature(#2C6B5E)`（内部で `C-Palette.generate*`）→ `C-Bridge`（semantic→@theme 対応）→ 状態色/生 HEX 解消（Functional Design で詳細）→ `C-Distrib.verifyViteBuild`。
- **対応 Unit**: U2-1（配布・トークン基盤）→ U2-2（スタイル適用）。
- **品質ゲート**: `vite build` 非回帰・三層ガードレール・a11y（C-Palette.validateA11y）。

## S-Promotion — Core 昇格のオーケストレーション
- **責務**: ドメインパターンを Core へ昇格（画像03①〜④）。
- **連携順**: `C-Promo.extractPattern` → `toLivePreview` → `openPromotionIssue`（导线）＋`openPromotionPR`（実体）→ Maintainer レビュー → merge → `confirmPromotion`。
- **対応 Unit**: U2-5（Core 昇格実行）。
- **ガバナンス**: 二段レビュー（FR-5.2）・他スタイル混入禁止（画像03 注意）。

## S-PortalDelivery — ポータル綿密化のオーケストレーション
- **責務**: §4-4 IA をポータルへ反映（本文は Core rolling、IA は portal）。
- **連携順**: Core content rolling 取込 → `C-PortalIA.render*`（役割別入口/シナリオ/オンボ/閲覧余白/GitHub 案内）→ `C-Record.harvestForPortal`（journal を素材化）。
- **対応 Unit**: U2-3（ポータル IA）→ U2-4（操作完結・セルフ検証）。
- **品質ゲート**: ポータル build/test・セルフ検証チェックリスト（主要4操作をポータルだけで完遂）。

## S-UXRefine — UX 改修フローのオーケストレーション（任意拡張・S3=C）
- **責務**: 既存機能を壊さず画面遷移/UX を改善。
- **連携順**: `C-UXFlow.captureScreenFlow`（Pencil）→ `reviewFlow` → `reflectToCode` → `C-Distrib.verifyViteBuild`。
- **対応 Unit**: U2-6。

## S-Collection（既存・流用）
- **責務**: ポータルビルド時の version/showcase 自動収集（前サイクル `collect-versions.mjs`）。LLocana を版ダッシュボード/showcase に rolling 反映。
- **備考**: #2 では新規実装せず、LLocana の registry 表示・収集が成立することを確認する範囲。

## サービス×Unit 対応
| サービス | 主 Unit | 主 repo |
|---|---|---|
| S-Distribution | U2-1, U2-2 | BusDelayAlerts（＋Core: C-Palette） |
| S-PortalDelivery | U2-3, U2-4 | aidlc-workflows（＋Core content） |
| S-Promotion | U2-5 | FIG-UDS Core ⇄ 製品 |
| S-UXRefine | U2-6 | BusDelayAlerts / Pencil |
| S-Collection | （確認のみ） | aidlc-workflows |
