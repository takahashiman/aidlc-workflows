# U2-7 UX 改修フロー — Logical Components

> 二層検証（vitest 単体＋Playwright e2e＋既存 VRT）と UX 改修フロー（capture→review→reflect）の論理分割。
> repo: **BusDelayAlerts**（製品コード・テスト・CI）／**aidlc-workflows**（portal 導線）／**Pencil**（.pen）。

## 論理コンポーネント

| LC | 役割 | 配置（論理） | 対応パターン |
|---|---|---|---|
| **LC-BackDecision** | 戻り先を決める純粋関数 `decideBackTarget(locationKey: string): 'back' \| 'home'`（`'default'`→`'home'`／他→`'back'`）。副作用なし | 製品 `src/app/.../navigation`（util） | SP7-1/SP7-2 |
| **LC-RouteDetailBinding** | RouteDetail の `handleBack` を LC-BackDecision の結果で分岐（`navigate(-1)` / `navigate('/',{replace:true})`）。motion/レイアウトは不変 | 製品 `pages/RouteDetail.tsx` | SP7-1/SP7-5 |
| **LC-UnitTest** | vitest で LC-BackDecision の分岐（履歴有→back／無→home）を単体検証 | 製品 `*.test.ts`（vitest） | SP7-3 |
| **LC-E2E** | Playwright で戻り2経路を実挙動アサート（①Home→カード→詳細→戻る=Home ②`/routes/detail/:busId` 直アクセス→戻る=Home） | 製品 `tests/`（Playwright 再利用） | SP7-3/SP7-4 |
| **LC-VRT** | 既存 main-routes VRT を緑維持（視覚非回帰）。新規ベースライン不要（既存） | 製品 `tests/vrt/main-routes.spec.ts` | SP7-3/SP7-5 |
| **LC-CIWire** | figuds-build.yml に unit step（vitest）追加＋VRT job に e2e 同梱（pin整合→build→raw-hex→unit→VRT/e2e・fail-fast） | 製品 `.github/workflows/figuds-build.yml` | SP7-4 |
| **LC-PenArtifact** | 代表3画面の as-is/to-be を `.pen` 表現（MCP 経由）。書き出し画像を生成 | 製品 `design/llocana-ux.pen`（暗号化）／書き出し→portal | SP7-6 |
| **LC-PortalGuide** | usage GUIDES に `ux-refine` 追加（確認→差替→反映＋VSCode×Pencil＋Pencil 書き出し参照）。シナリオA「あわよくば」入口から導線 | aidlc-workflows `portal/`（usage.js ほか） | SP7-7 |
| **LC-Record** | dev-flow-journal に UX 改修フロー確立を記録（US-X4 横断） | aidlc-workflows `aidlc-docs/dev-flow-journal.md` | – |

## 依存図

```
LC-BackDecision ──used by──▶ LC-RouteDetailBinding ──renders──▶ RouteDetail（motion 不変）
       ▲                                  │
       │ tests                            │ verified by
   LC-UnitTest                        LC-E2E ─┐
                                            ├─▶ LC-CIWire（figuds-build.yml: unit + VRT/e2e）
                                  LC-VRT ───┘
LC-PenArtifact（.pen as-is/to-be・MCP）──書き出し──▶ LC-PortalGuide（ux-refine）
すべて ──記録──▶ LC-Record（dev-flow-journal）
```

## 読込／実行順（Code Generation の青写真）

1. **LC-BackDecision** 抽出（純粋関数）。
2. **LC-RouteDetailBinding** 結線（`handleBack` を分岐）。
3. **LC-UnitTest**（vitest 導入＋分岐テスト）。
4. **LC-E2E**（戻り2経路の機能 e2e）。
5. **LC-VRT** 緑維持確認（既存・改修で視覚不変）。
6. **LC-CIWire**（figuds-build.yml に unit step＋e2e 同梱）。
7. **LC-PenArtifact**（`.pen` as-is/to-be・MCP・書き出し）。
8. **LC-PortalGuide**（usage `ux-refine` 追加・nav/usage テスト非回帰）。
9. **LC-Record**（dev-flow-journal）。

## 検証観点

- LC-BackDecision: 純粋・参照透過（同入力→同出力）・`'default'` 判定の境界。
- LC-RouteDetailBinding: 通常フロー不変（既存 e2e/VRT 緑）・直リンク時 Home 着地。
- LC-CIWire: fail-fast・既存 job を壊さない・unit/e2e が緑で deploy 継続。
- LC-PortalGuide: 既存 portal テスト（nav/usage/ia）緑・生HEX 持込なし。

## Infra 申し送り（物理配置）

- **vitest 物理配置**: config（`vitest.config.ts` or vite config 内 `test`）・`test:unit` script・LC-BackDecision/LC-UnitTest の正確なパス。
- **CI step 位置**: figuds-build.yml の unit step 挿入位置（build 後・VRT 前）と e2e の VRT job 同梱形態。
- **.pen 版管理**: 暗号化 `.pen` の追跡可否・書き出し画像の portal 取込先（`portal/assets` 等）。

## N/A

- Compute/Storage/Network/従来型・Scalability・Availability＝該当なし（静的 SPA・クライアント改修＋devtool）。
