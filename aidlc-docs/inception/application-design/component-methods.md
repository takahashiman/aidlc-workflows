# Component Methods / Interfaces — Application Design

> 高レベルのインターフェース・シグネチャ（擬似表現）。詳細ビジネスルールは Functional Design（per-unit）。
> 本システムは UI 資産＋ビルド/CI 中心のため、「メソッド」はデータ契約・ビルド関数・CI ジョブ・プロンプト規約として表現する。

## CD-5 Metadata（データ契約）
```jsonc
// registry.json（Core DS が正典）
{
  "projects": [
    {
      "repo": "fig-ext-bus-buslocation",      // ADQ5 命名規約
      "category": "バス",                       // taxonomy 参照
      "subcategory": "バスロケーションシステム",
      "name": "プロジェクト1",
      "demoUrl": "https://.../index.html",      // PT-4 iframe src
      "coreVersion": "v1.3.0"                   // 表示用（実体は version-matrix が収集）
    }
  ]
}
```
```jsonc
// taxonomy.json（Core DS が正典・Core Maintainer 管理）
{
  "categories": [
    { "id": "bus", "label": "バス",
      "subcategories": [ { "id": "buslocation", "label": "バスロケーションシステム" } ] }
  ]
}
```

## PT-7 Metadata Reader
- `loadTaxonomy(): Taxonomy` — Core DS から rolling 取得 → PT-2 サイドナビ生成
- `loadRegistry(): RegistryEntry[]` — Core DS から rolling 取得 → PT-4/PT-5/PT-6 の入力

## PT-2 Side Navigation
- `buildNavTree(taxonomy, registry): NavNode[]` — カテゴリ＞サブカテゴリ＞プロジェクトの階層生成（即時到達）

## PT-4 Project View
- `renderProject(entry): View` — コンポーネント単体／ページ遷移／`renderDemo(entry.demoUrl)`（iframe）

## CI-3 Version Collector（CI ジョブ）
- `collectVersions(registry): VersionMatrix` — 各 repo の `CORE-DS-VERSION`/submodule コミットを取得 → `version-matrix.json`
- 出力契約: `{ repo, coreVersion, pinnedCommit, collectedAt }[]`

## CI-4 Showcase Collector（CI ジョブ）
- `collectShowcase(registry): ShowcaseIndex` — 各 repo の Extensions 層パーツ／`core-promotion` ラベル Issue を収集 → `showcase-index.json`
- 出力契約: `{ repo, part, status: "local"|"proposed", issueUrl? }[]`

## CI-1 Three-Layer Guardrail Lint（CI ジョブ）
- `lintTokens(files): Finding[]` — 生 hex/px 検出・`--fig-*` 非経由検出
- `lintLayerDeps(files): Finding[]` — Component→Semantic のみ許可、Primitive 直参照を fail
- 規約: いずれか non-empty で **fail**

## CI-2 Visual Regression Test（CI ジョブ）
- `runVRT(coreRef, portalRef): Diff[]` — ポータルを Core 変更で再ビルドし baseline と比較
- 規約: 差分が許容外なら **マージ不可**

## CI-5 Registry Registration Check
- `checkRegistered(repo, registry): bool` — 未登録なら警告。TM-3 が補完 PR を起票

## TM-2 Interactive Prompt Generator
- `generateSetupPrompt(input): string` — input `{ productName, signatureColor, category, subcategory }` → AI 実行用プロンプト
- プロンプト末尾規約（ADQ3）: 「初期設定完了後、Core DS の `registry.json` に本 repo を追加する PR を自動起票」

## TM-3 AI Setup（プロンプト規約・AI が自律実行）
- 複製（GitHub Template）→ 変数置換（製品名/色/カテゴリ/`.fig-profile-*`）→ CI 配線 → `CORE-DS-VERSION` 設定 → **registry 追加 PR 起票**

## CD-4 Components（UI 契約）
- 各コンポーネントの Props/状態契約は Core DS の `components/*.spec.md` を正典とする（ここでは再掲しない）
- 共通制約: Semantic トークンのみ参照・インラインスタイル禁止・3プロファイル成立

## CD-6 Release/Versioning
- `release(type: "MINOR"|"MAJOR"|"PATCH")` — 昇格=MINOR、破壊的=MAJOR、修正=PATCH。タグ＋CHANGELOG
