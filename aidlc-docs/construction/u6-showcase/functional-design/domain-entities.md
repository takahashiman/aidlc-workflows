# U6 Showcase — Domain Entities

> 確定: FDQ1〜7 = 全A。U6 の収集・表示に関わるドメインエンティティ。`ShowcaseItem` は U2 確定契約（`showcase-index.schema.json`）= 既存・不変。

## ShowcaseItem（既契約・不変 / BR-SC-CONTRACT）
ショーケース1項目。`showcase-index.schema.json` に準拠。

| 属性 | 型 | 必須 | 説明 | 由来 |
|---|---|---|---|---|
| `id` | string | ✓ | 安定一意（`ext-{repo}-{stem}` / `temp-{repo}-{num}`） | BR-SC-ID |
| `name` | string | ✓ | 可読名（ヘッダ `// EXTENSION PART — <name>` / Issue タイトル） | BR-SC-SRC-4 |
| `ownerProjectId` | string | ✓ | どの製品の何か（registry projectId） | BR-SC-OWNER / US-5.2 AC1 |
| `kind` | enum(`extension`,`temp-part`) | ✓ | 拡張独自パーツ / 仮パーツ | BR-SC-SRC-1 |
| `previewPath` | string | – | repo 内 `preview/` 相対パス（あれば） | FDQ3 |
| `screenshotUrl` | string | – | 外部スクショ/Issue URL（任意） | FDQ3 |
| `promotable` | boolean | – | 昇格提案導線の表示可否（既定 true） | BR-SC-PROMOTABLE |
| `promotedToCore` | boolean | – | Core 昇格済み→撤去推奨 | BR-SC-PROMOTED / BR-DOG-4 |
| `collectedAt` | string(date-time)\|null | – | 収集時刻 | — |

## ShowcaseCollector（新規・収集器 / CI-4）
独自/仮パーツを自動収集し `showcase-index.json` を生成する論理コンポーネント。**`collect-versions.mjs` 単一クローラ基盤の一部**（BR-CI-1CRAWL）。

| 振る舞い | 説明 |
|---|---|
| `collectShowcase({dataDir, corePath})` | registry 駆動で全製品を1パス走査し `items[]` 生成・schema 充足出力 |
| 収集源走査 | 各 repo の `extensions/` contents ＋ `temp-part` ラベル Issue（GitHub API） |
| 昇格判定 | `promotable`（既定 true）/ `promotedToCore`（Core 正典照合） |
| fail-soft | 個別失敗 skip・全体失敗で既存据え置き（BR-SC-FAILSOFT） |

依存: `Registry`（駆動）、GitHub API（contents/issues）、`CoreCanon`（昇格照合）。

## 収集源エンティティ（中間・永続化しない）

### ExtensionPart（kind=extension の源）
- 由来: 製品 repo `extensions/<file>`。
- 抽出: ファイル名 stem・ヘッダコメント（name・`@core-promotion candidate`）。

### TempPartIssue（kind=temp-part の源）
- 由来: 製品 repo の `temp-part` ラベル open Issue（FR-4.6 / BR-DOG-3）。
- 抽出: Issue タイトル（name）・番号（id）・URL（screenshotUrl 任意）。

### PromotionSignal（補助・昇格候補シグナル）
- `core-promotion` ラベル Issue ／ 部品ヘッダ `@core-promotion candidate`。
- `promotable` の確証（既定でも true / US-4.4・US-5.2）。

## CoreCanon（参照・昇格照合の正典）
- Core repo（`CORE_DS_REPO`）の `registry.json` ／ コンポーネント正典一覧。
- 用途: `promotedToCore` 判定（同名・同義出現で撤去推奨 / BR-SC-PROMOTED）。
- 取得不能時: 照合スキップ・`promotedToCore=false` 据置（fail-soft）。

## Registry（既存・駆動の単一正典）
- Core 正典 `registry.json` の写し（portal `data/`）。`projects[]` が収集対象列挙と `ownerProjectId` の源。U5 version 収集と共有。

## 関係図
```
Registry ──drives──▶ ShowcaseCollector ──scans──▶ {ExtensionPart, TempPartIssue}
                          │  references                     │ + PromotionSignal
                          ▼                                 ▼
                      CoreCanon ──promotedToCore──▶  ShowcaseItem[] ──▶ showcase-index.json
                                                                              │
                                                                     renderShowcase() (PT-6)
```
