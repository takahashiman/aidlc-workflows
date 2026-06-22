# U2-7 UX 改修フロー — Business Rules（C-UXFlow）

> AD4=A／US-X2／AC①（既存機能を壊さない）厳守。Pencil＝設計参照、実装が正典。

## BR-UX（UX 改修フロー全体）

- **BR-UX-1（Pencil＝設計参照）**: `.pen` 成果は**設計参照**であり仕様の正典ではない。コードと差異が生じた場合は**コードを真**とする（実装が正典）。
- **BR-UX-2（非回帰が最優先）**: いかなる UX 改修も**既存機能の振る舞いを変えない**。機能・データ・通知ルール・状態表示は不変。改修は遷移/操作感/導線に限定する。
- **BR-UX-3（最小UX改善1点）**: 本ユニットの reflectToCode は**最小UX改善 1 点**に限る（FDQ7-2=A）。複数改善・大規模リファクタは対象外（次段・別ユニット）。
- **BR-UX-4（代表1フロー）**: 対象は遅延アラート核心フロー（Home→RouteDetail→SettingsNotifications）のみ。他画面は対象外（FDQ7-1=A）。
- **BR-UX-5（.pen は MCP 経由のみ）**: `.pen` は暗号化ファイル。**pencil MCP ツール経由でのみ**読み書きする。Read/Grep を `.pen` に使わない。
- **BR-UX-6（成果物配置）**: `.pen` は製品 repo `BusDelayAlerts/design/`、ポータル導線用の**書き出し画像**は aidlc-workflows `portal/`（FDQ7-3=B）。設計と公開素材を分離。
- **BR-UX-7（ポータル導線）**: UX 改修フロー（確認→差替→反映）は portal の `ux-refine` ガイド 1 本として残す（FDQ7-4=A）。VSCode×Pencil 手順と Pencil 書き出し参照を含む。
- **BR-UX-8（スタイル不混入）**: 改修で生 HEX や旧 DS スタイルを持ち込まない（U2-3 の生HEX0 成果を退行させない）。Core トークン委譲を維持。
- **BR-UX-9（承認ゲート）**: 実コード変更の commit/push・`.pen` 最終確定はユーザー承認後（Initiative #2 運用方針）。

## BR-FLOW（代表フローの遷移規則）

- **BR-FLOW-1（戻り導線の堅牢化＝主候補）**: RouteDetail の戻りは、ブラウザ履歴がある場合は従来どおり `navigate(-1)`、**履歴が無い直リンク/直接アクセス時は Home（`/`）へフォールバック**する。通常フローの挙動は不変（非回帰）。
- **BR-FLOW-2（遷移の連続性）**: 画面遷移にモーションを足す場合、既存 RouteDetail の系（`opacity`+`scale`・0.3s・ease `[0.22,1,0.36,1]`）と**一貫**させる。新規モーションは機能・タイミングを阻害しない範囲に限る。
- **BR-FLOW-3（状態表現は不変）**: 遅延状態の色/ラベルは Core status-pill 委譲のまま（U2-6 arrival-card と同源）。本ユニットで状態の写像・配色を変更しない。
- **BR-FLOW-4（通知導線）**: 通知設定への導線を強化する場合も、既存の保存/ルール編集の振る舞いは不変。過剰な新導線（C3）はレビューで価値が確認できなければ見送る。
- **BR-FLOW-5（motion は Core 契約トークンを消費・2026-06-22 追記）**: 画面遷移の motion は**生値を書かず Core の体感バジェット契約トークンを参照**する（ナビゲーション遷移＝`--motion-duration-budget-nav` 200ms）。生 motion 値は「生 HEX」の UX 版負債とみなし解消する。未ロード時はバジェット内 fallback に縮退。Core 契約（`transition-budget.md`/`page-transition.md`）が UX 改修の判断基準。

## BR-REV（レビュー／反映の合格条件）

- **BR-REV-1（非回帰テスト緑）**: reflectToCode の反映は、既存テスト（lint/build/VRT/該当ユニットテスト）が緑であることを合格条件とする。
- **BR-REV-2（差替の可視化）**: `.pen` は as-is（現状）と to-be（改善案）の 2 状態を持ち、レビューで差分を確認できる。
- **BR-REV-3（記録）**: 確立した UX 改修フローと採用改善を dev-flow-journal に記録（US-X4）。
