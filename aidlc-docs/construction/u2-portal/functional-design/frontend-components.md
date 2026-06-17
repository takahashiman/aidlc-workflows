# U2 Portal — Frontend Components

> PT-1〜PT-8 の技術非依存コンポーネント契約。確定回答: FDQ1-10 = すべて A。
> vanilla JS SPA（ADQ1=A）。Props=入力、State=内部状態、Emits/Actions=出力イベント。空状態/エラー時挙動を明記。

## コンポーネント階層
```
PT-1 App Shell / Hash Router
 ├─ Header（profile 切替 / coreVersion 表示 / 検索）
 ├─ PT-2 Side Navigation（4区分: 概要/プロジェクト集/運用/使い方）
 └─ Main Outlet（route に応じ切替）
      ├─ PT-3 IA Section View（概要 ほか静的セクション）
      ├─ PT-4 Project View（component/page/demo）
      ├─ PT-5 Version Dashboard（運用）
      ├─ PT-6 Showcase View（運用）
      └─ PT-8 Usage Guide Page（使い方）
 [PT-7 Metadata Reader = ビルド時データ供給・非 UI]
```

---

## PT-1 App Shell / Hash Router
- **責務**: ハッシュルーティング、レイアウト合成、UiState 管理、子ビューへの dispatch（既存 `portal.js` 拡張）。
- **Props**: `navTree`(NavNode[]), `dataSources`(taxonomy/registry/version-matrix/showcase), `defaultRoute`。
- **State**: `currentRoute`(Route), `uiState`(profile/coreVersionLabel)。
- **Actions/Emits**: `routeChanged`, `profileChanged`, `versionLabelChanged`。
- **操作フロー**: `hashchange` → parse(Route) → resolve view → render → URL/localStorage 同期（business-logic §1.3, §5）。
- **空/エラー**: 未知 route → Not-Found ＋最近接祖先誘導（BR §6）。
- **a11y**: ランドマーク（banner/navigation/main）、route 変更時のフォーカス移動と live region 通知。

## PT-2 Side Navigation
- **責務**: 4区分の階層ナビ。プロジェクト集枝は taxonomy 駆動（FDQ3=A）。即時到達（US-2.1）。
- **Props**: `navTree`(NavNode[]), `currentRoute`。
- **State**: 展開/折りたたみ（route から導出）。
- **Actions/Emits**: `navigate(route)`。
- **操作フロー**: buildNav（business-logic §2.2）の結果を描画。葉は直接リンク（BR-NAV-1）。pending 製品は淡色＋「準備中」（BR-DATA-2）。仮パーツは badge（BR-DOG-3）。
- **空/エラー**: taxonomy 空 → プロジェクト集枝は「製品未登録」表示。概要/運用/使い方は常時表示。
- **a11y**: `nav` ランドマーク、`aria-current`、ツリーのキーボード操作、`aria-expanded`。

## PT-3 IA Section View（概要・静的セクション）
- **責務**: 概要区分（Foundations/Accessibility/Components/Patterns/Principles）の静的ページ描画。既存 PAGES を移植・再配置（FDQ2=A）。
- **Props**: `pageMeta`(section/item), `coreAssets`(rolling 取込のトークン/CSS)。
- **State**: なし（静的）。
- **操作フロー**: route → page lookup → 本文描画。一面完結（BR-UX-1）、詳細は使い方/別ページへ（BR-UX-2）。
- **空/エラー**: item 不在 → Not-Found。
- **a11y**: 見出し階層、コードサンプルの読み上げ配慮。

## PT-4 Project View
- **責務**: 製品の閲覧3形態（component/page/demo, US-2.2）。
- **Props**: `project`(Project), `view`(component/page/demo), `context`(profile/coreVersion)。
- **State**: 選択中 view（タブ）。
- **Actions/Emits**: `changeView`, `openDemoFullscreen`。
- **操作フロー**: renderProjectView（business-logic §3.2）。demo は sandbox iframe ＋ context query 伝播（BR-VIEW-2）。暫定は Core preview（BR-VIEW-3）。
- **空/エラー**: registry 未登録 → PendingView。demoUrl 不在 → fallback リンク/「デモ準備中」。
- **a11y**: タブ ARIA、iframe `title`、フォーカストラップ回避。

## PT-5 Version Dashboard（運用）
- **責務**: 各製品の参照 Core 版一覧（US-4.3 表示側）。入力 `version-matrix.json`（スキーマ U2 確定・収集 U5, FDQ6=A）。
- **Props**: `entries`(VersionMatrixEntry[])。
- **State**: ソート/フィルタ（任意）。
- **操作フロー**: entries を表描画。`status`(up-to-date/behind/unknown) を視覚化。
- **空/エラー**: 空配列/欠落 → 「収集待ち（U5）」空状態（BR-DATA-5）。
- **a11y**: data table セマンティクス（th/scope/caption）。

## PT-6 Showcase View（運用）
- **責務**: Core 未満の独自/仮パーツ横断一覧と昇格提案導線（US-5.1/5.2・US-2.5 連動）。入力 `showcase-index.json`（スキーマ U2 確定・収集 U6, FDQ6=A）。
- **Props**: `items`(ShowcaseItem[])。
- **State**: フィルタ（kind/owner）。
- **Actions/Emits**: `proposePromotion(item)`（`core-promotion` 起票導線, BR-DOG-6）, `viewOwnerProject`。
- **操作フロー**: items を一覧。owner と種別を明示（US-5.2 AC1）。temp-part は badge、撤去推奨は「Core 昇格済み」表示（BR-DOG-4）。
- **空/エラー**: 空 → 「収集待ち（U6）」空状態。
- **a11y**: リスト/カードのセマンティクス、バッジの代替テキスト。

## PT-7 Metadata Reader（非 UI・ビルド時）
- **責務**: Core DS から registry/taxonomy/トークン/CSS を rolling 取込（FDQ5=A）。整合検査（business-logic §4.3）。
- **入力**: Core DS（最新タグ or core HEAD）。
- **出力**: ポータルにバンドルされた `data/` と `vendor/core/`、検査結果（警告）。
- **規則**: pin しない（BR-ROLL-1）、Core CSS は無改変（BR-ROLL-3）、取得失敗は fail-fast（BR-PUB-3）。
- **注**: 実装機構（取得手段）は infrastructure-design で確定。本書では契約と振る舞いのみ。

## PT-8 Usage Guide Page（使い方）
- **責務**: 操作随伴ガイド（US-2.7）。独立エンティティ UsageGuidePage を定型テンプレで描画（FDQ8=A）。
- **Props**: `guide`(UsageGuidePage)。
- **State**: なし。
- **操作フロー**: 目的→前提→手順→確認 を順に描画。ツール非依存表現（BR-USE-2）。
- **空/エラー**: topic 不在 → Not-Found ＋使い方インデックスへ誘導。
- **a11y**: 手順は順序リスト（ol）、見出し階層、リンクの自己説明的ラベル。

---

## 横断: Header（PT-1 内包）
- **責務**: profile 切替（admin/consumer/terminal）、coreVersionLabel 表示、（任意）検索。
- **Props**: `uiState`, `coreVersionLabel`。
- **Actions/Emits**: `profileChanged`（body の `.fig-profile-*` 付替）, `search(query)`。
- **規則**: profile 既定 admin（BR-UX-3）、状態は URL+localStorage（BR-STATE-1/2）。version は表示専用（BR-ROLL-4）。

## 既存資産の配置（FDQ10=A）
| 既存 | U2 での位置づけ |
|---|---|
| `portal.js` | PT-1 の母体（拡張） |
| `portal-content.js`（PAGES） | PT-3 静的セクション定義＋IA 再編の対象 |
| `portal.css` | ポータル固有レイアウト（Core CSS とは分離, BR-ROLL-3 例外） |
| `ai-co-creation.js` | U3(TM-2) 管轄。U2 は現状維持、使い方から導線のみ |
| `feedback.js` | PT-6 昇格提案 / 仮パーツ起票 UI の母体候補（再評価） |

---

## API/データ統合ポイント（バックエンド非依存・データ契約）
| Component | 依存データ | 由来 |
|---|---|---|
| PT-2 | taxonomy.json, registry.json | Core DS（rolling, PT-7） |
| PT-4 | registry.json（previewPath/demoUrl） | Core DS / 各製品（iframe） |
| PT-5 | version-matrix.json | U5(CI-3)（スキーマ U2） |
| PT-6 | showcase-index.json | U6(CI-4)（スキーマ U2） |
| PT-3/PT-8 | 静的コンテンツ | ポータル内 |
> ポータルは読み取り専用（BR-DATA-4）。書込（registry 登録/Issue 起票）は U3/U5 の機構へ委譲し、U2 は導線のみ提供。
