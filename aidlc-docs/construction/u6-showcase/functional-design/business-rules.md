# U6 Showcase — Business Rules

> 確定: FDQ1〜7 = 全A。CI-4 収集 ＋ Showcase View の業務規則。既存規約（BR-EXT-1 / BR-DOG-3/4 / BR-CI-1CRAWL）の履行と U6 固有規則。

## 収集源規約（CI-4 / US-5.1）

- **BR-SC-SRC-1（収集源2系統）**: ショーケース収集対象は ①各製品 repo の **`extensions/` ディレクトリ**配下の部品ファイル（`kind: "extension"`）、②**`temp-part` ラベルの open Issue**（`kind: "temp-part"`）の2系統のみ。schema の `kind` enum と一致。
- **BR-SC-SRC-2（registry 駆動）**: 走査対象 repo は **Core registry.json に登録された製品のみ**（未登録 repo は収集しない＝登録が一覧化の前提・U3 register フローと整合）。
- **BR-SC-SRC-3（除外）**: `extensions/` 配下でも `compat.*` / `index.*` / `README*` / 隠しファイル / ディレクトリ自身は部品とみなさない。
- **BR-SC-SRC-4（マーカー尊重）**: 部品ヘッダの `// EXTENSION PART — <name>` を `name` の正典とし、`@core-promotion candidate` を昇格候補シグナルとして尊重（busapp `extensions/Fab.jsx` 規約）。

## 項目同定・重複排除

- **BR-SC-ID（安定一意 id）**: `id = ext-{repo}-{fileStem}`（拡張）／`temp-{repo}-{issueNumber}`（仮パーツ）。再収集で同一 id を保つ（差分検知・アンカー安定）。
- **BR-SC-OWNER（帰属の正典）**: `ownerProjectId = registry の projectId（repo||name）`。owner はファイルパスやコメントから推測せず **registry を単一正典**とする（US-5.2 AC1「どの製品の何か」を機械保証）。
- **BR-SC-DEDUP（kind 併存許容）**: 同一 repo に同名の extension と temp-part が併存しうる（仮→拡張の移行途中）。両方保持し `kind` で区別。同一 kind・同一 id の重複は後勝ちで1件に統合。

## 昇格判定（US-5.2 / BR-DOG-4）

- **BR-SC-PROMOTABLE（到達前でも導線）**: `extension`/`temp-part` は原則 `promotable = true`。**3製品基準未達でも昇格提案導線を出す**（US-5.2 AC1「到達前でも」）。Core 昇格済み（`promotedToCore=true`）の項目のみ昇格導線を抑止。
- **BR-SC-PROMOTED（撤去推奨の機械判定）**: `promotedToCore = true` ⇔ Core 正典（registry/コンポーネント一覧）に**同名・同義の部品が出現**。出現検知でビューは「Core昇格済み・撤去推奨」を表示（BR-DOG-4＝rolling 取得済み Core へ切替え仮コード撤去を促す）。
- **BR-SC-PROMOTE-LINK（導線は使い方経由）**: 昇格提案導線は `#/usage/promotion`（使い方 › 昇格）へ遷移し、`core-promotion` ラベルでの3行起票手順を案内（FR-6 操作随伴ガイド・US-4.4 低ハードル提案）。ポータルから直接 Issue 起票はしない（静的 Pages・サーバ機能なし）。

## 単一クローラ・耐障害（U5 継承）

- **BR-CI-1CRAWL（単一クローラ・再掲履行）**: version / migration / showcase は**単一クローラの同一走査**で生成し、registry 列挙・GitHub API 取得を重複させない。U6 は `collect-versions.mjs` 基盤を拡張して履行。
- **BR-SC-FAILSOFT（fail-soft）**: 個別 repo/項目の収集失敗（404・レート・解析失敗）は **skip して継続**。全体失敗でも portal ビルドは止めず **既存 `showcase-index.json` を据え置き**（U5 REL-3/4 継承）。Core 照合不能時は `promotedToCore=false` 据置（誤検知側に倒さない）。

## 契約・配置

- **BR-SC-CONTRACT（契約不変）**: U2 確定の `showcase-index.schema.json`（ShowcaseItem）を**変更せず充足**。生成器は required（id/name/ownerProjectId/kind）を最小充足し、欠損可能項目は省略（描画側で graceful）。
- **BR-SC-PLACEMENT（所有境界）**: 収集クローラ・ビュー・契約はすべて **portal（`aidlc-workflows`）配下**。Core repo には収集ロジックを置かない（version 収集の配置と対称・各 Unit 所有境界の尊重）。
- **BR-SC-EMPTY（空状態の区別）**: ビューは「未収集（クローリング未実行/無効）」と「収集済み0件」を**文言で区別**（運用者が原因を取り違えない）。
