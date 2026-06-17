# U6 Showcase — Frontend Components

> 確定: FDQ1〜7 = 全A。PT-6 Showcase View（US-5.2）。既存 `portal/src/views.js` `renderShowcase()` の器を**実データ駆動化**。入力契約 = `showcase-index.json`。

## ビュー: Showcase View（PT-6 / 運用 › Showcase）
- ルート: `#/ops/showcase`（既存 router・nav の `{ id:'showcase', kind:'showcase' }`）。
- 入力: `ctx.data.showcase`（= `data/showcase-index.json` を `portal.js` がロード）。
- 玄人最適化（FR-6.2）: 一面で「どの製品の何が在るか」を把握→詳細 how-to（昇格手順）は使い方ページへ遷移。

### 状態（BR-SC-EMPTY）
| 状態 | 条件 | 表示 |
|---|---|---|
| 未収集 | スタブ or `collectedAt==null` | 空状態「自動クローリング未実行（CI-4 未設定/無効）」＋使い方リンク |
| 収集済み0件 | `collectedAt!=null && items.length==0` | 空状態「収集済み・該当パーツなし」 |
| 一覧 | `items.length>0` | カードグリッド |

### カード（ShowcaseItem 1件）
構成要素:
- **見出し**: `name` ＋ `kind` バッジ
  - `temp-part` → 「仮パーツ」タグ（warn 系）
  - `extension` → 「拡張」タグ（neutral）
  - `promotedToCore` → 「Core昇格済み・撤去推奨」タグ（core 系・BR-DOG-4）
- **帰属**: `ownerProjectId`（US-5.2 AC1「どの製品の何か」）
- **preview**: `screenshotUrl` あればサムネ／`previewPath` あれば「プレビュー →」リンク（製品ページ/iframe）
- **昇格導線**: `promotable && !promotedToCore` のとき **「昇格を提案する →」** → `#/usage/promotion`（FR-6 経由で `core-promotion` 3行起票手順）

### data-testid（既存踏襲・テスト契約）
- `showcase-item-{id}` / `showcase-promote-{id}`（既存 renderShowcase の testid を実データで維持）

### 任意フィルタ（あれば・非必須）
- `kind`（拡張/仮パーツ）/ `ownerProjectId`（製品）での絞り込み。MVP は全件表示で可。

## 既存資産との差分（実体化ポイント）
| 既存（スタブ） | U6 後 |
|---|---|
| `emptyOps('Showcase','…U6 で有効化')` 固定 | 未収集/0件を文言で区別（BR-SC-EMPTY） |
| `ctx.data.showcase.items`（常に空） | 収集済み実データを描画 |
| 「昇格を提案する →」導線（実装済） | `promotable && !promotedToCore` で条件表示（実データ駆動） |

## CSS（既存クラス踏襲・必要なら追補）
- `.fig-showcase` / `.fig-showcase-item` / `.fig-showcase-item__head`（既存）。
- 追補があれば `portal/assets/*.css` に kind バッジ色・preview サムネ枠のみ（Core トークン経由・生値禁止 / 三層 Lint 準拠）。

## 使い方ページ連携（FR-6 / US-5.2）
- `#/usage/promotion`（既存）に Showcase からの昇格提案フロー（`core-promotion` 3行起票・3製品基準・Maintainer 伴走）が記載されていることを確認・必要なら Showcase 起点の導線文を追補。
- 「未収集」空状態からは使い方 › 仮パーツ/CI-4 設定への導線。

## 入力契約（再掲・不変）
`showcase-index.json`（`showcase-index.schema.json` 準拠）。ビューは欠損項目（previewPath/screenshotUrl）を graceful に省略描画。
