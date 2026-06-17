# U6 Showcase — Code Generation Plan

> 対象 Unit: **U6 Showcase**（CI-4 収集 ＋ PT-6 Showcase View）。確定: FDQ1-7 / NFR / Infra 全A。
> 方針: 新概念を足さず、U2/U5 が残したスタブ（showcase-index 空スタブ・renderShowcase 器・単一クローラ基盤）を実体化。契約（schema）は不変。

## 実装ステップ
- [x] S1. `collect-versions.mjs` に `collectShowcase()` を追加（単一クローラ基盤拡張・BR-CI-1CRAWL）
  - extensions/ 列挙（kind=extension・除外フィルタ・ヘッダ name 抽出）／temp-part ラベル Issue（kind=temp-part・PR 除外）
  - Core 正典照合 `loadCoreCanon()`（local components/*.spec.md → API フォールバック）＋ `coreHasEquivalent()`（正規化＋別名＋製品プレフィックス吸収）で `promotedToCore`
  - `promotable` 既定 true・安定 id・安定ソート・fail-soft（個別 skip / owner 未設定は据え置き）
  - CLI: 既定で version+showcase を並走、`--showcase` で showcase 単独
- [x] S2. `build.mjs` 配線（showcase スタブ生成 → `collectShowcase()` 実体・fail-soft・未収集はスタブ保証）
- [x] S3. `views.js` `renderShowcase()` 実体化（空状態2種の区別・拡張バッジ・preview 導線・撤去推奨・昇格導線・XSS エスケープ）
- [x] S4. `portal-app.css` に `.fig-badge--ext` / `.fig-showcase-item__preview` 追補
- [x] S5. 検証（build 成功・npm test 16 pass・collectShowcase モック機能テスト 10 アサーション・view 分岐スモーク）
- [x] S6. user-actions-checklist フェーズ E に U6 操作（E-6 issues:read / E-7 ラベル / E-8 撤去推奨確認）追記

## 契約・所有境界
- `showcase-index.schema.json` 不変で充足（BR-SC-CONTRACT）。
- 収集・ビュー・契約は portal 配下に集約（BR-SC-PLACEMENT）。Core repo に収集ロジックを置かない。
- 各製品 repo は規約（`extensions/`・`temp-part`/`core-promotion` ラベル）に従うのみ・改修不要（MAINT-3）。

## トレーサビリティ
| Story/AC | 実装 |
|---|---|
| US-5.1 AC1（所定 dir/ラベルから自動一覧化） | S1 collectShowcase / S2 build 配線 |
| US-5.2 AC1（どの製品の何か・到達前でも昇格導線） | S1 ownerProjectId/promotable / S3 昇格導線 |
| BR-DOG-4（Core 昇格済み撤去推奨） | S1 promotedToCore / S3 撤去推奨バッジ |
| BR-CI-1CRAWL（単一クローラ） | S1 同一基盤拡張 |
| BR-SC-FAILSOFT | S1/S2 fail-soft |
