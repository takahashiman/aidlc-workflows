# U6 Showcase — Functional Design Plan

> 対象 Unit: **U6 Showcase**（repo: CI-4 収集 ＋ `aidlc-workflows`/portal PT-6 ビュー ／ 含む: CI-4、Showcase View）
> 対象ストーリー: **US-5.1 独自パーツの自動クローリング** `[FR-4.7, FR-6]` / **US-5.2 ショーケースからの発見と昇格提案** `[FR-4.7, FR-5.1]`（関連: FR-2.5 Extensions層 / FR-4.6 ドッグフーディング・仮パーツ / BR-DOG-3/4 / US-4.4 Core 昇格）
> 技術非依存の詳細設計（独自/仮パーツの自動収集アルゴリズム・収集源と項目メタの抽出・昇格判定・ショーケースビューの発見/昇格導線・既存スタブの実体化）。
> 下部 `[Answer]: A` にご記入ください。A=推奨。**前 Unit 同様、全 A で進める場合は「全A」とだけご返信いただければ確定します。**

## 前提認識（U2/U4/U5 が残した「U6 参照」配線点のグラウンディング）
U6 は新規概念を足すのではなく、既に各所に**配線（呼び出し口・契約・規約・ビューの器）まで用意済みのスタブ**を**実体化**する Unit。回収すべき具体スタブ:
- **`portal/data/showcase-index.json`**: `_note: "U6(CI-4) が各 repo の独自/仮パーツを自動クローリングして差替える"` の**空スタブ**（`items: []`）。
- **`portal/schema/showcase-index.schema.json`**: 収集結果の**契約は確定済み**（`ShowcaseItem` = id/name/ownerProjectId/kind[extension|temp-part]/previewPath/screenshotUrl/promotable/promotedToCore/collectedAt）。U6 はこの契約を充足する生成器を作る。
- **`portal/scripts/build.mjs`**: `collectAndStub()` が showcase-index.json を**未収集ならスタブ保証**（`// showcase-index.json は U6(CI-4) 管轄`）。U6 は収集実体を配線。
- **`portal/scripts/collect-versions.mjs`**: U5 の**単一クローラ**（registry 駆動・GitHub API・fail-soft・version+migration を同一走査）。BR-CI-1CRAWL=「単一クローラで version/migration/（U6 で showcase）を一括＝走査の重複排除」と明記済み。U6 は**同一基盤を拡張**。
- **`portal/src/views.js` `renderShowcase()`**: PT-6 ビューの**器は実装済み**（カード描画・仮パーツ/Core昇格済みタグ・「昇格を提案する →」導線 `#/usage/promotion`）。`emptyOps('Showcase', '…自動クローリング = U6 で有効化')` の文言が U6 起点。実データ駆動に切替える。
- **収集対象の規約は U3/U4 で確定済み**:
  - 拡張独自パーツ = 各製品 repo の **`extensions/` ディレクトリ**（FR-2.5 / BR-EXT-1）。busapp 実例 `extensions/Fab.jsx` はヘッダ `// EXTENSION PART …` ＋ `@core-promotion candidate` マーカー付き。
  - 仮パーツ = **`temp-part` ラベル Issue**（FR-4.6 / BR-DOG-3、template SKILL.md 記載）。
  - 昇格提案 = **`core-promotion` ラベル**で3行起票（US-4.4 / US-5.2、template SKILL.md 記載）。
- 確定方針（state Decisions）: ショーケース＝**自動クローリングで一覧化**（Q6=A）。rolling・registry 単一正典・マルチレポでスコープ分離・fail-soft。

## U6 の責務マッピング（CI 番号 → ストーリー → 実体化するスタブ）
| 項目 | 責務 | Story | 実体化するスタブ |
|---|---|---|---|
| CI-4 | 独自/仮パーツの自動収集 → `showcase-index.json` | US-5.1 | portal build の showcase スタブ／単一クローラ拡張 |
| Showcase View | 発見（どの製品の何か）＋再利用/昇格提案導線 | US-5.2 | portal `renderShowcase()` を実データ駆動化 |

## 生成する成果物（チェックリスト）
- [ ] `business-logic-model.md` — 収集クローラのフロー（registry 駆動探索→`extensions/` 列挙＋`temp-part`/`core-promotion` ラベル Issue 取得→項目メタ抽出→昇格判定→`showcase-index.json` 生成）／単一走査での version/migration/showcase 統合（BR-CI-1CRAWL 履行）／ショーケースビューの発見・昇格導線の状態（収集済み0件 vs 未収集の区別、promotable/promotedToCore による導線分岐）
- [ ] `business-rules.md` — 収集源規約（`extensions/`・ラベル）・項目同定/重複排除規則・`promotable`/`promotedToCore` 判定規則（BR-DOG-4 撤去推奨）・fail-soft 規則・単一クローラ規則（BR-CI-1CRAWL）・「契約（schema）を変えずに充足」規則
- [ ] `domain-entities.md` — `ShowcaseItem`（既契約）・`ShowcaseCollector`（収集器）・収集源（`ExtensionPart`/`TempPartIssue`/`PromotionIssue`）・`PromotionLink`（昇格導線）。registry/Core registry との関係
- [ ] `frontend-components.md` — Showcase View（PT-6）: 一覧カード（owner/kind/preview）・仮パーツ/Core昇格済みバッジ・昇格提案導線・空状態2種・フィルタ（任意: kind/owner）。入力契約＝`showcase-index.json`

## 確認質問

### FDQ1. CI-4 収集の実行基盤（単一クローラ拡張 vs 独立クローラ・最重要）
US-5.1 の自動収集を、U5 の単一クローラ基盤に**統合**するか、別系統で持つか。
- A) **U5 の `collect-versions.mjs` 単一クローラ基盤を拡張**し、**同一走査（registry 駆動の1パス）で showcase も収集**（version-matrix / migration-index / **showcase-index** を一括生成）。実装は `collectShowcase()` を同モジュール群に追加し `build.mjs` から version 収集と同じ箇所で呼出（推奨：state 明記の **BR-CI-1CRAWL「単一クローラで一括＝走査の重複排除」** をそのまま履行・GitHub API 呼数/レートを節約・fail-soft 規約を再利用）
- B) 独立した `collect-showcase.mjs` を新設し別走査（関心分離だが registry 再走査・API 二重・BR-CI-1CRAWL に反する）
- C) 各 repo が自身の独自パーツを中央へ push 報告（分散・全 repo 改修・自動クローリング方針に反する）
- X) Other

[Answer]: A

### FDQ2. ショーケース項目の収集源（discovery sources / US-5.1 AC1「所定ディレクトリ/ラベル付 Issue」）
何を「独自/仮パーツ」として収集するか。
- A) **registry 駆動で各製品 repo を走査し、2系統を収集**：①**`extensions/` ディレクトリ**配下の部品ファイル（GitHub API contents 列挙）→ `kind: "extension"`、②**`temp-part` ラベルの Issue**（GitHub API issues）→ `kind: "temp-part"`。補助シグナルとして部品ヘッダの `// EXTENSION PART` / `@core-promotion candidate` マーカーを尊重（推奨：U3/U4 で確定済みの規約＝busapp `extensions/Fab.jsx`・template SKILL の `temp-part`/`core-promotion` ラベルにそのまま対応・schema の `kind` enum と一致）
- B) `extensions/` ディレクトリのみ（仮パーツ Issue を取りこぼし・FR-4.6 ドッグフーディング導線が欠落）
- C) ラベル Issue のみ（実装済み拡張部品を一覧化できず横展開価値が薄い）
- X) Other

[Answer]: A

### FDQ3. 項目メタ（name / ownerProjectId / preview）の抽出方式
`ShowcaseItem` の各フィールドをどう埋めるか。
- A) **`ownerProjectId` = registry エントリの projectId（repo/name）で紐付け**（「どの製品の何か」US-5.2 AC1 を保証）／`name` = 拡張はファイル名・ヘッダコメント、仮パーツは Issue タイトルから導出／`previewPath` = repo に `preview/` があれば相対パス、無ければ省略／`screenshotUrl` = （任意・VRT/preview があれば）リンク。欠損は省略し描画側で graceful（推奨：registry 単一正典で owner 確定・既存資産から無理なく抽出・契約の required[id/name/ownerProjectId/kind] を最小充足）
- B) 各 repo に showcase 専用マニフェスト（`showcase.json`）を必須化（全 repo 改修・手動メンテで陳腐化）
- C) ファイルパスのみで name 代替（owner/可読名が不明瞭・US-5.2 AC1 不充足）
- X) Other

[Answer]: A

### FDQ4. `promotable` / `promotedToCore` の判定（US-5.2 昇格導線・BR-DOG-4 撤去推奨）
昇格提案導線の表示可否と「Core 昇格済み→撤去推奨」の機械判定。
- A) **`promotable` = extension/temp-part は原則 `true`**（3製品基準未達でも提案導線を出す＝US-5.2 AC1「到達前でも昇格提案の導線」）。`promotedToCore` = **Core の registry.json/コンポーネント正典に同名・同義部品が出現したら `true`**（出現検知で「撤去推奨」バッジ＝BR-DOG-4）。判定は fail-soft（Core 照合不能なら `false` 据置）（推奨：US-5.2/BR-DOG-4 直結・Core 正典を単一ソースに機械照合・誤検知側に倒さない）
- B) `promotable` を3製品基準達成時のみ true（US-5.2 AC1「到達前でも」に反する）
- C) 両者を手動フラグで管理（自動クローリング方針に反する）
- X) Other

[Answer]: A

### FDQ5. ショーケースビューの発見・昇格導線（PT-6 / US-5.2）
`renderShowcase()` を実データ駆動化する際の UI 契約。
- A) **収集済み `showcase-index.json` を消費し、項目ごとに「どの製品の何か（ownerProjectId）＋ kind バッジ（仮パーツ/拡張）＋ preview/screenshot」を提示**。`promotable && !promotedToCore` の項目に**「昇格を提案する →」導線**（使い方 › 昇格＝`#/usage/promotion` 経由で `core-promotion` ラベル起票手順へ）。`promotedToCore` は「Core昇格済み・撤去推奨」バッジ。空状態は**「未収集（クローリング無効）」と「収集済み0件」を文言で区別**（推奨：既存ビュー器・タグ・導線をそのまま活かし実データに接続・FR-6 使い方ページ経由で操作随伴ガイド原則を満たす）
- B) ビューに昇格 Issue 起票フォームを直接埋め込む（ポータルは静的 Pages・サーバ機能なし／FR-6 の「使い方ページ経由」原則と不整合）
- C) 一覧のみで昇格導線なし（US-5.2 AC1 の昇格提案導線が欠落）
- X) Other

[Answer]: A

### FDQ6. ビルド配線とスタブ撤去・空状態の据え置き（fail-soft）
`build.mjs` の showcase スタブ生成をどう実体へ差替えるか。
- A) **`collectAndStub()` の showcase スタブ生成箇所を収集実体（`collectShowcase()`）の呼出に差替え**、version 収集と同一の fail-soft 規約を適用（全体失敗でも portal ビルドは継続＝既存 `showcase-index.json` を据え置き／個別 repo 失敗は skip）。`_generatedBy` を `collect-showcase (U6/CI-4)` に更新し、`collectedAt` を実時刻化（推奨：U5 の REL-3/4 fail-soft をそのまま継承・portal ビルドを止めない・schema 検証は既存パイプラインを通す）
- B) 収集失敗時はビルドを fail-fast（収集器の一時障害で portal 全体が落ちる・運用脆弱）
- C) スタブを残し収集は nightly 別ジョブのみ（build 一貫性が崩れ version 収集と非対称）
- X) Other

[Answer]: A

### FDQ7. U6 成果物の物理配置（このワークスペース内での生成先）
Code Generation 時の配置（Critical Rules: アプリ/CI コードは workspace 配下、aidlc-docs/ には置かない）。
- A) **収集クローラ＝`portal/scripts/`（`collect-versions.mjs` と同一基盤・`collect-showcase.mjs` を追加 or 同モジュールに `collectShowcase()` を実装し `build.mjs` から呼出）／ ビュー＝`portal/src/views.js` の `renderShowcase()` を実体化（必要に応じ `portal/assets/*.css` のショーケース用クラス追補）／ 契約＝U2 確定の `showcase-index.schema.json` を**変更せず充足**／ 収集対象規約（`extensions/`・`temp-part`/`core-promotion` ラベル）は U3/U4 で各テンプレ（template/busapp の AGENTS.md・SKILL.md）に**記載済みを確認・必要なら明確化追補のみ****（推奨：FDQ1/5/7 と一貫・portal が PT-6 と収集の所有者・各 Unit の所有境界を尊重・契約安定）
- B) 収集を Core repo 側に集約（portal ビルドとの結合が不自然・version 収集の配置と非対称）
- C) 新規 showcase 専用 repo（過剰・マルチレポ統治を複雑化）
- X) Other

[Answer]: A
