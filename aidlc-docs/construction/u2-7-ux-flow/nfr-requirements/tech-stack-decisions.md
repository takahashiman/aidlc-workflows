# U2-7 UX 改修フロー — Tech Stack Decisions

> NQ7-1=B（二層検証）/ NQ7-2=A（figuds-build.yml 同梱）を反映。

| ID | 決定 | 内容 | 根拠 |
|---|---|---|---|
| **TSD7-1** | 非回帰＝二層検証 | **vitest 単体**（純粋ヘルパー）＋**Playwright e2e**（戻り2経路）＋**既存 main-routes VRT 緑**（視覚） | NQ7-1=B。実装が正典・非回帰テスト緑が反映合格条件（BR-REV-1） |
| **TSD7-2** | 純粋ヘルパー抽出 | 戻り判定を `decideBackTarget(locationKey: string): 'back' \| 'home'` に抽出（React Router フック非依存）。RouteDetail はこの結果で `navigate(-1)` / `navigate('/', {replace:true})` を分岐 | テスト可能化・モック最小・将来 UX ロジックの単体検証土台（NRD7-MNT-1/2） |
| **TSD7-3** | vitest 最小導入 | `vitest` を devDependency 追加・最小 config・`test:unit` script。初期は `decideBackTarget` の単体テスト1本 | NQ7-1=B のユーザー意図（テスト基盤の土台化）。配布非影響（NRD7-SEC-1） |
| **TSD7-4** | e2e は Playwright 再利用 | U2-3 導入の `@playwright/test`/`playwright.config.ts`/`tests/` を再利用し戻り2経路の機能 e2e を追加。新規ブラウザ基盤を増やさない | NRD7-MNT-3 |
| **TSD7-5** | CI 同梱 | `figuds-build.yml` に **unit step**（vitest）を追加し、VRT job に **戻り e2e** を同梱（pin整合→build→raw-hex→unit→VRT/e2e・fail-fast） | NQ7-2=A。1 workflow 集約・U2-3 と整合 |
| **TSD7-6** | Pencil 成果物 | `.pen` は製品 repo `BusDelayAlerts/design/llocana-ux.pen`（MCP 経由のみ・暗号化）／書き出し画像は aidlc-workflows `portal/` | FDQ7-3=B / BR-UX-5,6 |
| **TSD7-7** | 非回帰スコープ | 代表フロー（Home/RouteDetail/Notifications）＋既存 main-routes VRT 全体の緑維持。改修は RouteDetail 戻りのみ局所 | NRD7-REL-1〜3 |
| **TSD7-8** | Security 供給面 | 追加は devDependency（vitest）のみ・SHA pin/最小 permissions 継承 | NRD7-SEC-1/2 |

## 不採用・保留

- **e2e のみ（フレームワーク追加なし）**: 検討したが、ユーザー判断で**テスト基盤（vitest）を土台として導入**（NQ7-1=B）。純粋ロジックの単体検証を将来の UX 改修にも効かせるため採用。
- **単体のみ（e2e なし）**: ルーティング実挙動（実 history スタックでの戻り先）を検証できないため不採用。e2e と併用する。

## 後続ステージへの申し送り

- **NFR Design**: 二層検証の論理コンポーネント分割（純粋ヘルパー／単体テスト／e2e／VRT／CI 結線）。質問ゲートは論点確定済のため原則不要見込み（残るは vitest の物理配置・CI step 位置＝Infra 粒度）。
- **Infrastructure Design**: vitest config/script の配置・`figuds-build.yml` の unit step と e2e 同梱位置・`.pen` の版管理（暗号化・MCP）・書き出しの portal 取込。
- **Code Generation**: `decideBackTarget` 抽出＋RouteDetail 結線・vitest 単体・Playwright e2e・portal `ux-refine` ガイド・`.pen`（MCP）。実コード commit/push と `.pen` 最終確定は承認後。
