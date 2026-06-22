# Frontend Components — U2-4/U2-5 ポータル IA・操作完結

> 影響ファイル・新ビュー・新ルートの一覧（実装は Code Gen）。すべて `aidlc-workflows/portal/` 内。
> 既存アーキテクチャ（vanilla JS SPA・hash router・純粋関数 render・rolling Core 取込）を踏襲。

## 1. 新規ビュー（views.js）

| 関数 | 役割 | ストーリー |
|---|---|---|
| `renderHome(ctx)` | Home ランディング（役割別入口3枚＋はじめに読む順番＋シナリオ入口＋クイックリンク） | US-P1/P5 |
| `renderBrowseMargin(ctx)` | 未整備可視化「余白」（Core カタログ整備状況・バッジ・整備率） | US-P6 |

- シナリオ別ガイド／新規操作ガイドは**新ビューを作らず** `usage.js` の `renderGuide()` を流用（GUIDES へ追加）。
- `renderHome` は `ctx.data`（taxonomy/registry/coreContent/buildInfo）を参照可。余白は coreContent.PAGES を走査。

## 2. ルーティング（router.js）

- `KINDS` に `'home'` を追加。`parseRoute` は home を `{kind:'home', path, query, raw}` で返す。
- `DEFAULT_ROUTE` を `'#/home'` に変更（既存 `#/overview/...` 直リンクは後方互換維持）。
- 余白ビューのルート: `#/overview/components/coverage`（overview 内の予約 item）または独立 `#/coverage`。
  Code Gen で既存 overview ディスパッチと整合する方を確定（既存 `renderScopeView` を壊さない実装）。

## 3. IA コンテンツ（content.js）

- `SECTIONS`: Home はサイドナビ最上位に出さず**ブランドロゴ＝Home**とする（玄人の最小クリックを保つ）。
  ※必要なら「ホーム」項目を先頭追加するかは Code Gen で判断（既定: ロゴ遷移のみ）。
- 余白ビュー定義（OVERVIEW に coverage item を予約 or 専用定義）を追加。
- `OPS`/`OVERVIEW` は本文不変。getting-started 責務分離は描画時の相互リンク注記（views 側）で対応。

## 4. 使い方ガイド（usage.js GUIDES 追加）

| key | タイトル | 種別 | ストーリー |
|---|---|---|---|
| `scenario-existing` | シナリオA：既存アプリを整える（★最優先） | シナリオ | US-P2 |
| `scenario-new` | シナリオ②：新規開発で FIG-UDS を使う | シナリオ | US-P3 |
| `new-product-setup` | 新製品セットアップ | 操作 | US-P7 |
| `migration` | 既存コードを Core 採用へ移行 | 操作 | US-P7 |
| `github-operations` | GitHub 操作ガイド（ツール非依存） | 操作 | US-X3 |

- `usageIndex()` を拡張: シナリオ2本を先頭・シナリオA に★最優先バッジ。操作ガイドを「主要操作」グルーピング。
- 既存 `core-version`（バージョン参照）・`promotion`（昇格提案）は到達確認のみ（4操作の2つを充足）。

## 5. ビュー dispatch（portal.js）

- `renderView()` に `case 'home': return renderHome(ctx)` を追加。
- `titleFor()` に `home: 'ホーム'` を追加。`renderView` の overview ケースで余白ルートを分岐（or 専用 case）。
- ブランドロゴ `href` を `#/home` に。検索インデックス（`buildSearchIndex`）は navTree 走査のため Home/余白の
  扱いは Code Gen で確認（Home は検索対象外でも可・ガイドは usage 経由で索引化）。

## 6. テスト（tests/）

- `parseRoute('#/home')` が home を返す（純粋関数テスト）。
- `GUIDES` に5新規 key が存在し `renderGuide()` が各 key を描画（目的→前提→手順→確認）。
- `usageIndex()` がシナリオA★最優先を先頭に出す。
- `renderHome()` が3役割カード＋4クイックリンク（4操作）を含む（AC②-1 結線）。
- `renderBrowseMargin()` が coreContent から整備済/未整備を区別（モックで整備率算出）。
- **4操作セルフ検証**: Home/シナリオ→各操作ガイド→確認 のリンク到達をアサート（AC②-2）。

## 7. 非対象（本ユニットで触らない）
- Core 本文（`portal-content.js`）の組み替え（§4-4・将来 Core repo）。
- 22 件未収録 preview の作成（本サイクル スコープ外）。
- 認証/閲覧制限・シークレット管理（§4-3・会社 org 移設前提）。

## トレーサビリティ
- §1/§2/§5=US-P1/P5。§4=US-P2/P3/P7/US-X3。§1.2/余白=US-P6。§6=AC②-1/2。
