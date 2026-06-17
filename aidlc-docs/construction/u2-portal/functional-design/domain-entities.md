# U2 Portal — Domain Entities

> 技術非依存のドメインモデル。確定回答: FDQ1-10 = すべて A。
> ポータルは読み取り専用ビュー。正典（taxonomy/registry）は Core DS 由来で rolling 取込（FDQ5=A）。U2 が新規にスキーマ定義する契約 = VersionMatrixEntry / ShowcaseItem。

## エンティティ関係（概観）
```
TaxonomyNode (category>subcategory>product)
      │ 投影
      ▼
   NavNode ──(projects枝)── Route
      │
Project(RegistryEntry 投影) ──< DemoView(component/page/demo)
      │                              └─ iframe: demoUrl
      ├─< TempPart (仮パーツ; Extensions層)
      └─ coreVersion (pin; 表示)

VersionMatrixEntry (U5入力) ─┐
ShowcaseItem      (U6入力) ─┤→ Ops ビュー（運用）
UsageGuidePage              ─┘   ＋ 使い方区分
```

---

## 1. Route（値オブジェクト）
ハッシュルートを表す。永続はしない（URL が真実）。
| 属性 | 型 | 説明 |
|---|---|---|
| `kind` | enum(overview/projects/ops/usage) | 上位4区分 |
| `path` | string[] | セグメント列 |
| `view` | enum(component/page/demo)? | projects 時の閲覧形態 |
| `query` | map | profile, coreVersion 等の共有状態 |
- 規則: BR-IA-1〜3, BR-STATE-1。

## 2. NavNode（導出エンティティ）
サイドナビの1ノード。taxonomy（projects枝）＋静的定義（概要/運用/使い方枝）から構築。
| 属性 | 型 | 説明 |
|---|---|---|
| `id` | string | 安定識別子 |
| `label` | string | 表示名 |
| `route` | Route | 葉なら直接リンク先（BR-NAV-1） |
| `children` | NavNode[] | 子ノード |
| `source` | enum(static/taxonomy) | 生成由来（FDQ3=A） |
| `status` | enum(published/pending)? | product の場合のみ（registry 有無） |
| `badge` | enum(temp-part/core/none)? | 仮パーツ等のマーキング（BR-DOG-3） |

## 3. TaxonomyNode（外部正典・Core DS 由来）
`taxonomy.json` の1ノード。U2 は読み取りのみ（BR-DATA-4）。
| 属性 | 型 | 説明 |
|---|---|---|
| `level` | enum(category/subcategory/product) | 階層種別 |
| `id` | string | 識別子 |
| `name` | string | 表示名 |
| `order` | number? | 表示順（BR-NAV-4） |
| `children` / `products` | node[] | 下位 |
- 関係: NavNode へ投影（projects 枝）。

## 4. Project（= RegistryEntry の投影・Core DS 由来）
`registry.json` の1エントリをポータル視点で表現。読み取りのみ。
| 属性 | 型 | 必須 | 説明 |
|---|---|---|---|
| `id` | string | ● | 製品識別子（taxonomy product と対応） |
| `name` | string | ● | 製品名 |
| `category` | string | ● | 所属（taxonomy 整合, BR-DATA-1） |
| `repoUrl` | string | ● | 製品 repo |
| `coreVersion` | string | ● | pin した Core 版（`CORE-DS-VERSION`） |
| `previewPath` | string | | コンポーネント単体 preview |
| `pagePreviewPath` | string | | ページ遷移 preview |
| `demoUrl` | string | | デモ iframe ソース（ADQ2=A） |
| `kind` | enum(core/extension/temp-part) | | 種別（昇格/撤去判定に使用, BR-DOG-4） |
- 規則: BR-DATA-2/3（欠落時 pending）, BR-VIEW-1。
- 暫定: 拡張未整備時は Core DS 自身を1 Project として提示（BR-VIEW-3）。

## 5. DemoView（値オブジェクト）
Project の閲覧3形態（US-2.2）。
| 属性 | 型 | 説明 |
|---|---|---|
| `mode` | enum(component/page/demo) | 形態 |
| `source` | string | preview パス or demoUrl |
| `render` | enum(inline-preview/iframe/fallback-link) | 描画方式 |
| `context` | map(profile, coreVersion) | iframe へ伝播（BR-VIEW-2） |

## 6. TempPart（仮パーツ・ドメイン概念）
鶏卵回避で Extensions 層に置かれる暫定部品（US-2.5）。registry/showcase 上は `kind:"temp-part"`。
| 属性 | 型 | 説明 |
|---|---|---|
| `name` | string | 部品名 |
| `ownerProjectId` | string | 所属製品 |
| `issueRef` | string? | `temp-part` ラベル Issue（BR-DOG-2） |
| `promotionIssueRef` | string? | `core-promotion` Issue（BR-DOG-6） |
| `lifecycle` | enum(created/proposed/promoted/removable) | §business-logic §7 状態遷移 |
- 撤去判定: 同名が Core registry に `kind:"core"` 出現 → `removable`（BR-DOG-4/5）。

## 7. VersionMatrixEntry（U2 が新規スキーマ定義・U5 入力契約）
版ダッシュボード(PT-5)の1行。生成は U5(CI-3)、スキーマは U2 確定（FDQ6=A）。
| 属性 | 型 | 説明 |
|---|---|---|
| `projectId` | string | 製品 |
| `projectName` | string | 表示名 |
| `coreVersionPinned` | string | 製品が pin する Core 版 |
| `coreVersionLatest` | string | 現行最新 Core 版（rolling 基準） |
| `status` | enum(up-to-date/behind/unknown) | 追従状況（導出） |
| `source` | enum(submodule/CORE-DS-VERSION/package.json) | 収集元 |
| `collectedAt` | timestamp | 収集時刻 |
- 空/欠落時は空状態（BR-DATA-5）。

## 8. ShowcaseItem（U2 が新規スキーマ定義・U6 入力契約）
Showcase(PT-6)の1項目。生成は U6(CI-4)、スキーマは U2 確定（FDQ6=A）。
| 属性 | 型 | 説明 |
|---|---|---|
| `id` | string | 識別子 |
| `name` | string | パーツ名 |
| `ownerProjectId` | string | どの製品の何か（US-5.2 AC1） |
| `kind` | enum(extension/temp-part) | 種別（仮パーツ表示, BR-DOG-3） |
| `previewPath` / `screenshotUrl` | string? | 見た目 |
| `promotable` | bool | 昇格提案導線の表示可否（US-5.2） |
| `collectedAt` | timestamp | 収集時刻 |
- 空/欠落時は空状態（BR-DATA-5）。

## 9. UsageGuidePage（U2 所有・静的）
操作随伴ガイド（US-2.7・FDQ8=A）。
| 属性 | 型 | 説明 |
|---|---|---|
| `topic` | string | `#/usage/<topic>` の識別子 |
| `title` | string | 表題 |
| `purpose` | string | 目的（テンプレ） |
| `preconditions` | string[] | 前提（テンプレ） |
| `steps` | string[] | 手順（ツール非依存・抽象, BR-USE-2） |
| `verification` | string[] | 確認（テンプレ） |
| `linkedFrom` | string[] | この topic を参照する操作箇所（BR-USE-1 逆引き） |

## 10. UiState（クライアント状態・FDQ9=A）
| 属性 | 型 | 永続 | 説明 |
|---|---|---|---|
| `profile` | enum(admin/consumer/terminal) | URL+localStorage | 既定 admin |
| `coreVersionLabel` | string | URL+localStorage | 表示用（pin ではない, BR-ROLL-4） |
| `route` | Route | URL | 現在地 |
- 解決順序: URL > localStorage > 既定（BR-STATE-2）。

---

## エンティティ別 担当ストーリー
| Entity | Story |
|---|---|
| Route / NavNode / TaxonomyNode | US-2.1, US-2.4 |
| Project / DemoView | US-2.2 |
| VersionMatrixEntry | US-4.3（表示は U2／収集 U5） |
| ShowcaseItem / TempPart | US-2.5, US-5.1, US-5.2（表示は U2／収集 U6） |
| UsageGuidePage | US-2.7 |
| UiState | US-2.3（版表示）, 横断 |
