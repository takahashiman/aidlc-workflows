# U2 Code Gen — Step2: ポータル固有資産の移設

移設元: `aidlc-projects/FIG-Universal-Design-System/`（FIG-UDS core）。**ポータル固有のみ**移設、Core 資産（tokens/components/preview）は移設せず Step3 でビルド時取込。

- 作成(コピー): `portal/src/ai-co-creation.js`（Interactive Prompt Generator・**U3(TM-2) 管轄として無改変**・FDQ10=A）
- 作成(コピー): `portal/src/feedback.js`（フィードバック機構・Step10 で昇格提案/仮パーツ導線の母体として再評価）
- 作成(コピー): `portal/assets/portal.css`（ポータル固有レイアウト 947 行・BR-ROLL-3 例外。Core CSS は vendor/core）
- 保全アーカイブ: `portal/src/legacy/legacy-content.js`（旧 PAGES 1950 行）・`portal/src/legacy/legacy-portal.js`（旧 shell 826 行）
  - 旧 IA（scope=Core/Extensions/Developer×section）の充実コンテンツを保全。Step5 の新 IA（概要/プロジェクト集/運用/使い方）が `#/overview` 配下で段階的に取り込む土台
- Core 直リンク（primitives.css/semantic.css/tokens/*）→ `vendor/core/` 参照へ付替は index.html(Step5) とビルド(Step3) で実施
