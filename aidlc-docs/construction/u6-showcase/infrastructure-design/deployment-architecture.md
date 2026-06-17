# U6 Showcase — Deployment Architecture

> 確定: FDQ1-7 全A。U2 portal デプロイ（Pages/Actions）に showcase 収集を相乗りさせたデータフロー。

## データフロー
```
[トリガ] push / repository_dispatch(core-released) / nightly / 手動
   │
   ▼
GitHub Actions（portal build, ubuntu, Node LTS）
   │
   ├─ build.mjs
   │    └─ collectVersions()  ─┐  単一走査（registry 駆動・Promise.all）
   │    └─ collectShowcase() ─┤    GH API: contents/extensions + issues?labels=temp-part
   │                          │    Core 照合: CORE_DS_REPO（promotedToCore）
   │                          ▼
   │    data/version-matrix.json / migration-index.json / showcase-index.json
   │                          │  schema 検証（showcase-index.schema.json）
   │                          ▼
   └─ 静的サイト artifact ──▶ GitHub Pages 配信
                                   │
                                   ▼
                            renderShowcase()（クライアント描画）
                              ├─ 一覧: name/kind/owner/preview
                              ├─ 昇格導線 → #/usage/promotion
                              └─ 撤去推奨（promotedToCore）
```

## rolling 反映（Core 昇格の伝播）
1. Extension/temp-part が Core へ昇格 → Core release → `repository_dispatch(core-released)`。
2. portal 再ビルド → `collectShowcase()` が Core 正典照合で当該項目を `promotedToCore=true`。
3. ビューが「Core昇格済み・撤去推奨」を表示（BR-DOG-4）→ 製品側に仮コード撤去を促す。

## fail-soft 配備
- 個別 repo/API 失敗 → 該当 skip・他継続（REL-2）。
- 全体収集失敗 → `exit 0` で build 継続・既存 `showcase-index.json` 据え置き（REL-1）。
- Core 照合不能 → `promotedToCore=false` 据置（誤検知回避）。
- ビューは未収集/0件を区別表示（OBS-2）。

## 所有境界
- 収集・契約・ビュー・出力はすべて **portal（`aidlc-workflows`）配下**で完結（BR-SC-PLACEMENT）。Core repo に収集ロジックを置かない（version 収集と対称）。
- 各製品 repo は規約（`extensions/`・ラベル）に従うのみで改修不要（MAINT-3）。

## 要ユーザー操作（U6 / 後続 user-actions-checklist フェーズ F へ）
- portal 収集トークンに **issues:read** を追加（contents:read は U5 で設定済み）。
- 各製品 repo に `temp-part` / `core-promotion` ラベルを用意（template に記載済・運用で作成）。
- Core 昇格時の `repository_dispatch(core-released)` 配線（U2/U5 と共有・rolling 追従）。
