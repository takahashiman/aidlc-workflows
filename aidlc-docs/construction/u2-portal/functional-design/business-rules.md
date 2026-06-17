# U2 Portal — Business Rules

> 技術非依存の業務規則。確定回答: FDQ1-10 = すべて A。各規則に検証可能な条件を付す。
> 凡例: **MUST**=必須 / **MUST NOT**=禁止 / **SHOULD**=推奨。

## A. IA / ナビゲーション規則

- **BR-IA-1 (MUST)**: 上位ナビは「概要 / プロジェクト集 / 運用 / 使い方」の4区分のみとする（US-2.4）。旧 scope（Core/Extensions/Developer）を上位に残してはならない（MUST NOT）。
- **BR-IA-2 (MUST)**: あらゆるコンテンツノードは上記4区分のいずれか一つに一意に所属する（多重所属禁止）。
- **BR-IA-3 (MUST)**: 「概要」= Core DS 自身（Foundations/Accessibility/Components/Patterns/Principles）。「プロジェクト集」= 拡張製品。「運用」= 版/showcase/昇格/ガバナンス。「使い方」= 操作随伴ガイド。
- **BR-NAV-1 (MUST)**: サイドナビの各葉ノードは対象ルートへの**直接リンク**を持ち、中間ノードのクリック連打なしに到達できる（US-2.1 AC1）。
- **BR-NAV-2 (MUST)**: 「プロジェクト集」配下のナビは `taxonomy.json` から生成する（FDQ3=A）。手書きの製品ノードを混在させてはならない（MUST NOT）。
- **BR-NAV-3 (MUST)**: ナビの製品階層の深さは taxonomy の `category > subcategory > product` に一致させ、人工的な中間ページを挿入しない。
- **BR-NAV-4 (SHOULD)**: 表示順は taxonomy の `order`、無ければ名称昇順で安定ソートする。

## B. 玄人最適化（情報設計）規則

- **BR-UX-1 (MUST)**: 各メインビューは「一面完結」を満たす（重要情報は最小クリック・原則ノンスクロールで把握可能、US-2.4 AC2）。
- **BR-UX-2 (MUST)**: 詳細 how-to は本文に混ぜず、別ページ（使い方/詳細ページ）へ遷移分離する。
- **BR-UX-3 (SHOULD)**: 既定デバイスプロファイルは Web-Admin（ポータル閲覧者は PC 前提、US-2.1 AC2）。

## C. rolling 規則（最新 Core 反映）

- **BR-ROLL-1 (MUST)**: ポータルは Core DS を**バージョン pin しない**（US-2.3 AC1）。取り込みは「最新タグ or core HEAD」で行う（FDQ5=A）。
- **BR-ROLL-2 (MUST)**: rolling の反映単位は**再ビルド**。Core 更新後に再ビルド・再デプロイすれば最新が反映される（ビルド時取込）。
- **BR-ROLL-3 (MUST)**: ポータルは Core のトークン/コンポーネント CSS を**コピー・改変せず**そのまま取り込む（独自上書きで Core と乖離させない）。例外はポータル固有レイアウト（portal.css）に限る。
- **BR-ROLL-4 (MUST)**: 表示する「Core 版ラベル」は取込時の実際の版を反映する（虚偽表示禁止）。これは表示専用で参照固定の意味を持たない。
- **BR-ROLL-5 (MUST)**: Core 更新で表示崩れが無いこと（US-2.3 AC2）。崩れ検出は VRT（U5/US-4.2）に委ね、U2 は決定的レンダリングを保証する。

## D. データ整合規則（ビルド時バリデーション）

- **BR-DATA-1 (MUST)**: registry の全 product は taxonomy のいずれかの subcategory に所属する（孤児禁止）。違反はビルド警告。
- **BR-DATA-2 (MUST)**: taxonomy 上に存在するが registry 未登録の product は `status=pending`（準備中）として表示する。エラーにしない（MUST NOT crash）。
- **BR-DATA-3 (MUST)**: registry エントリは必須キー（id, name, category, repoUrl, coreVersion）を持つ。欠落はビルド警告とし、当該エントリは pending 扱い。
- **BR-DATA-4 (MUST)**: ポータルは registry/taxonomy を**編集しない**（読み取り専用）。変更は Core DS 側でのみ行う（単一正典、FQ1=A）。
- **BR-DATA-5 (MUST)**: version-matrix.json / showcase-index.json は U2 が定義するスキーマに準拠する。スキーマ非準拠データは空状態として扱う（FDQ6=A）。

## E. 閲覧3形態規則（Project View）

- **BR-VIEW-1 (MUST)**: 各 product は「コンポーネント単体 / ページ遷移 / デモ」の3形態を提供する（US-2.2）。データ不足の形態はフォールバック表示（準備中/リンク）で代替し、ビューを壊さない。
- **BR-VIEW-2 (MUST)**: デモは iframe 埋め込みで提供する（ADQ2=A）。iframe は sandbox 化し、profile/coreVersion コンテキストを query 伝播する。
- **BR-VIEW-3 (SHOULD)**: 拡張製品が未整備の段階では、Core DS preview を暫定ソースとして3形態を成立させる（FDQ4=A・鶏卵回避）。

## F. ドッグフーディング / 鶏卵回避規則（US-2.5）

- **BR-DOG-1 (MUST)**: Core に無い部品が必要な場合、開発を止めず**製品の Extensions 層に仮パーツとして実装**して継続する（US-2.5 AC1）。
- **BR-DOG-2 (MUST)**: 仮パーツ作成時、専用ラベル `temp-part` の Issue を起票し「仮パーツ作成」「Core 還元検討」を記録する（US-2.5 AC2）。起票テンプレと条件は U2 が定義、自動起票機構は U5(CI) が実装。
- **BR-DOG-3 (MUST)**: ポータルは仮パーツに「仮パーツ」バッジ等の**明示マーキング**を付す（恒久部品と混同させない）。
- **BR-DOG-4 (MUST)**: 仮パーツ名が Core DS registry に `kind:"core"` で出現したら、ポータルは「Core 昇格済み・撤去推奨」を提示する（撤去判定、US-2.5 AC3）。
- **BR-DOG-5 (MUST)**: 昇格後は rolling で最新 Core を取得し、製品側の仮コードを撤去する（重複保持禁止）。
- **BR-DOG-6 (SHOULD)**: 昇格提案は低ハードル（`core-promotion` ラベル・3行起票）で起票でき、ポータルから導線を持つ（US-4.4 と整合）。

## G. 使い方ページ規則（操作随伴ガイド・US-2.7）

- **BR-USE-1 (MUST)**: 操作を要する全ての画面/フローには、再現可能な使い方ページ（`#/usage/<topic>`）への導線が**必ず**存在する（US-2.7 AC1・操作随伴ガイド原則）。
- **BR-USE-2 (MUST)**: 使い方ページの表現はツール非依存（特定の Git クライアント/AI アシスタント名に固定しない）。各チーム標準に読み替え可能な抽象ステップで書く。
- **BR-USE-3 (MUST)**: 使い方ページは定型テンプレ「目的 → 前提 → 手順 → 確認」に従う（再現性の担保、FDQ8=A）。
- **BR-USE-4 (MUST)**: 詳細手順はメインビューに展開せず使い方ページに分離する（玄人最適化、BR-UX-2 と整合）。

## H. 公開規則（GitHub Pages・US-2.6）

- **BR-PUB-1 (MUST)**: ポータルはビルド成果物を GitHub Pages で公開し、閲覧用 URL を提供する（US-2.6 AC1）。
- **BR-PUB-2 (MUST)**: 公開物は静的（サーバ実行を要さない）。実行時に外部 fetch を前提とした機能を必須経路に置かない（FDQ5=A と整合）。
- **BR-PUB-3 (MUST)**: ビルドは Core データ取得失敗時に fail-fast する（壊れた版を公開しない）。

## I. repo / 責務分界規則

- **BR-REPO-1 (MUST)**: U2 ポータルの正式 repo は `aidlc-workflows`。既存ポータル資産は同 repo へ移設する（FDQ1=A）。
- **BR-REPO-2 (MUST)**: `ai-co-creation.js`（Interactive Prompt Generator）は U3(TM-2) 管轄。U2 では機能を壊さず現状維持し、新規責務を負わせない（FDQ10=A）。
- **BR-REPO-3 (SHOULD)**: `feedback.js` は U2 の使い方/運用導線（昇格提案・仮パーツ起票 UI）の母体として再評価する（FDQ10=A）。

## J. 状態永続化規則（FDQ9=A）

- **BR-STATE-1 (MUST)**: 共有可能 UI 状態（route/profile/coreVersionLabel）は URL に反映し、リンク共有で同一表示を再現できる。
- **BR-STATE-2 (MUST)**: 再訪時の継続のため、URL に無い項目は localStorage から復元する。解決順序は URL > localStorage > 既定。
- **BR-STATE-3 (MUST NOT)**: 個人を特定する情報や機密を localStorage/URL に保存してはならない（UI 設定のみ）。

## K. アクセシビリティ規則（横断・Q8=A）

- **BR-A11Y-1 (MUST)**: ポータル UI は WCAG 2.1 AA を満たす（キーボード操作・フォーカス可視・コントラスト・適切なランドマーク/見出し階層）。
- **BR-A11Y-2 (MUST)**: サイドナビ・タブ・iframe デモに適切な aria 属性とフォーカス管理を付与する。
