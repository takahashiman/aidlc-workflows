# U6 Showcase — Business Logic Model

> 対象: US-5.1 自動クローリング（CI-4）／US-5.2 発見・昇格提案（Showcase View）
> 確定: FDQ1〜7 = 全A。技術非依存の論理設計。実装は U5 単一クローラ基盤（`collect-versions.mjs`）の拡張＋portal `renderShowcase()` の実データ駆動化。

## 0. 全体像（1枚）

```
registry.json（Core 正典・単一駆動）
        │ 製品列挙（projectId）
        ▼
┌─────────────────────────────────────────────┐
│  単一クローラ 1パス（BR-CI-1CRAWL）            │
│  各製品 repo を GitHub API で走査:             │
│   ├─ version pin   → version-matrix.json (U5) │
│   ├─ migration     → migration-index.json(U5) │
│   └─ showcase      → showcase-index.json (U6) │←★本Unit
└─────────────────────────────────────────────┘
        │ showcase-index.json（契約=showcase-index.schema.json）
        ▼
portal build → data/ 配置 → renderShowcase()（PT-6 ビュー）
        │
        ▼
閲覧者/Maintainer: 発見（どの製品の何か）→ 再利用 / 昇格提案導線（#/usage/promotion）
```

## 1. 収集クローラのフロー（CI-4 / US-5.1）

`collectShowcase()` を `collect-versions.mjs` と同一基盤・同一走査内に実装（FDQ1=A）。

### 1.1 入力
- **駆動**: `portal/data/registry.json`（Core 正典の写し）の `projects[]`。各 `projectId = repo || name`、`owner = GH_OWNER`。
- **環境**: `GH_OWNER`（owner）/ `GITHUB_TOKEN`（read・任意だが推奨）/ `CORE_DS_REPO`（Core 照合用）。U5 の env 規約を共有。
- registry 不在 or owner 未設定 → 空収集（fail-soft / BR-SC-FAILSOFT）。

### 1.2 メイン手順（1製品あたり・並列 Promise.all）
1. **拡張パーツ収集（kind=extension）**
   - GitHub API `GET /repos/{owner}/{repo}/contents/extensions` でディレクトリ列挙。
   - 各エントリ（`type:"file"`、部品拡張子 `.jsx|.tsx|.js|.css|.html`、`compat`/`index`/`README` は除外）を `ShowcaseItem` 候補に。
   - `name` = ヘッダコメント `// EXTENSION PART — <name>` があれば優先、無ければファイル名 stem。
   - 補助シグナル `@core-promotion candidate` を `promotable=true` の確証として尊重（既定でも true・BR-SC-PROMOTABLE）。
2. **仮パーツ収集（kind=temp-part）**
   - GitHub API `GET /repos/{owner}/{repo}/issues?labels=temp-part&state=open` で Issue 列挙。
   - `name` = Issue タイトル、`id` = `temp-{repo}-{number}`、参照リンク = Issue URL（screenshotUrl 任意）。
3. **項目メタ確定（FDQ3=A）**
   - `id`（一意・後述 1.4）/ `name` / `ownerProjectId = projectId`（「どの製品の何か」US-5.2 AC1）/ `kind` / `previewPath`（repo に `preview/` があれば相対パス、無ければ省略）/ `screenshotUrl`（任意）/ `collectedAt`。
4. **昇格判定（FDQ4=A / 1.3）** で `promotable` / `promotedToCore` を付与。
5. 個別失敗（404/レート/解析失敗）は **その項目/その repo を skip**、全体は継続（fail-soft）。

### 1.3 昇格判定アルゴリズム（promotable / promotedToCore）
```
promotable      := (kind ∈ {extension, temp-part}) ? true : false      // 3製品基準未達でも true（US-5.2 AC1）
promotedToCore  := coreHasEquivalent(item.name) ? true : false         // Core 正典に同名/同義が出現
```
- `coreHasEquivalent(name)`: Core の `registry`/コンポーネント正典（`CORE_DS_REPO` の `registry.json` or components 一覧）を取得し、正規化名（小文字・記号除去・`fab`↔`floating action button` 等の別名表）で一致判定。
- Core 照合不能（API 失敗・正典取得不可）→ `promotedToCore=false` 据置（誤検知側に倒さない・BR-SC-FAILSOFT）。
- `promotedToCore=true` → ビューで「Core昇格済み・撤去推奨」（BR-DOG-4）。

### 1.4 同定・重複排除
- `id` = `ext-{repo}-{fileStem}` / `temp-{repo}-{issueNumber}`。repo×名で安定一意（再収集で同一 id）。
- 同一 repo 内で同名の extension と temp-part が併存しうる（仮→拡張の移行途中）。両方保持し kind で区別（BR-SC-DEDUP）。

### 1.5 出力
- `portal/data/showcase-index.json`（契約 = `showcase-index.schema.json`・変更なし）。
  ```
  { "_generatedBy": "collect-showcase (U6/CI-4)", "collectedAt": <ISO>, "items": [ ShowcaseItem... ] }
  ```
- `items` を `ownerProjectId` → `kind` → `name` で安定ソート。

## 2. 単一走査統合（BR-CI-1CRAWL 履行 / FDQ1=A）
- `collect-versions.mjs` の `collectVersions()` が回す `Promise.all(projects.map(...))` の**同一ループ内**で showcase 収集も実行（registry・owner・token・API クライアントを共有）。
- 公開 API: `collectShowcase({ dataDir, corePath })` を追加（単体実行可）＋ `build.mjs` は version 収集と**同じ呼出箇所**で showcase も生成。
- 走査の重複排除 = registry 列挙1回・各 repo の contents/issues 取得を version 収集と束ねる（API 呼数最小化・PERF）。

## 3. ショーケースビューの状態（PT-6 / US-5.2 / FDQ5=A）

`renderShowcase(ctx)` の状態機械:

| 状態 | 条件 | 表示 |
|---|---|---|
| **未収集** | `showcase._generatedBy` がスタブ or `collectedAt == null` | 「自動クローリング未実行（CI-4 無効/未設定）」空状態 |
| **収集済み0件** | `collectedAt != null` かつ `items.length == 0` | 「収集済み・該当パーツなし」空状態（文言で未収集と区別） |
| **一覧** | `items.length > 0` | カード一覧（下記） |

各カード（1 ShowcaseItem）:
- 見出し: `name` ＋ `kind` バッジ（`temp-part`→「仮パーツ」/ `extension`→「拡張」）。
- 帰属: `ownerProjectId`（「どの製品の何か」US-5.2 AC1）。
- preview: `previewPath`/`screenshotUrl` があればサムネ/リンク。
- 導線分岐:
  - `promotedToCore` → 「Core昇格済み・撤去推奨」バッジ（昇格導線は出さない）。
  - `promotable && !promotedToCore` → **「昇格を提案する →」**（`#/usage/promotion`＝使い方ページ経由で `core-promotion` 3行起票手順／FR-6 操作随伴ガイド）。

## 4. ストーリー対応（トレーサビリティ）
| 要素 | Story / AC | 実現 |
|---|---|---|
| 所定ディレクトリ/ラベルから自動一覧化 | US-5.1 AC1 | 1.2 拡張+仮パーツ2系統収集・ビルド時生成 |
| 手動登録なく横断一覧維持 | US-5.1 | registry 駆動・1パス・fail-soft |
| どの製品の何かが分かる | US-5.2 AC1 | `ownerProjectId`＋`name`＋`kind` |
| 到達前でも再利用/昇格提案導線 | US-5.2 AC1 | `promotable` 既定 true・昇格導線（FDQ4/5） |
| Core 昇格済みの撤去推奨 | BR-DOG-4 | `promotedToCore` 判定＋バッジ |
| 走査重複排除（単一クローラ） | BR-CI-1CRAWL | §2 統合 |
