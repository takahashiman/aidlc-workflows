# U2-7 UX 改修フロー — NFR Design Patterns

> 論点確定済（FDQ7-1〜4 / NQ7-1=B / NQ7-2=A）につき質問ゲートなしで生成。
> justification: 検証方式（二層）=NQ7-1 確定・CI 統合=NQ7-2 確定・成果物形式/スコープ/導線=FDQ 確定。残る vitest 物理配置・CI step 位置は Infra 粒度。

## 設計パターン

- **SP7-1（戻り堅牢化＝純粋判定＋フォールバック）**: 戻り先を**純粋関数で決定**し、RouteDetail はその結果で `navigate(-1)`（`'back'`）／`navigate('/', {replace:true})`（`'home'`）を分岐。履歴有=従来挙動、履歴無（`location.key==='default'`）=Home フォールバック（NRD7-REL-1/2・BR-FLOW-1）。
- **SP7-2（純粋ロジック抽出＝テスト可能化）**: ルーティング判定を React Router フックから切り離し `decideBackTarget(locationKey)` に集約。**実装が正典**＝ヘルパーは判定のみ・副作用（navigate）は呼び出し側（NRD7-MNT-1）。
- **SP7-3（二層検証）**: ①vitest 単体（純粋ヘルパーの分岐）②Playwright e2e（戻り2経路の実挙動）③既存 main-routes VRT 緑（視覚非回帰）。三者全緑が反映合格条件（NRD7-REL-3・BR-REV-1）。
- **SP7-4（既存基盤再利用）**: e2e/VRT は U2-3 導入の Playwright（`tests/`・`playwright.config.ts`）を再利用。CI は `figuds-build.yml` を拡張（新規 workflow/基盤を増やさない・NRD7-MNT-3）。
- **SP7-5（非回帰最優先）**: 通常フローの挙動・遷移・状態表示（status-pill 委譲）・戻りボタンの a11y を不変に保つ。改修は RouteDetail 戻りのみ局所（NRD7-REL-1・A11Y-1/2・BR-UX-2/BR-FLOW-3）。
- **SP7-6（Pencil＝設計参照）**: `.pen`（製品 repo `design/`）に as-is/to-be の2状態を表現＝差分可視化。実装と差異が出たらコードを真とする。書き出し画像のみ portal へ（BR-UX-1/5/6・FDQ7-3）。
- **SP7-7（ポータル導線＝データ駆動ガイド）**: portal usage の GUIDES に `ux-refine` を1本追加（確認→差替→反映＋VSCode×Pencil 手順＋Pencil 書き出し参照）。既存 nav/usage テストを非回帰（BR-UX-7・FDQ7-4）。

## パターン × NFR マトリクス

| パターン | REL/非回帰 | MNT | A11Y | SEC |
|---|---|---|---|---|
| SP7-1 戻り堅牢化 | ◎ | ○ | ○ | – |
| SP7-2 純粋ロジック抽出 | ○ | ◎ | – | – |
| SP7-3 二層検証 | ◎ | ◎ | ○ | – |
| SP7-4 既存基盤再利用 | ○ | ◎ | – | △ |
| SP7-5 非回帰最優先 | ◎ | ○ | ◎ | – |
| SP7-6 Pencil 設計参照 | – | ○ | – | – |
| SP7-7 ポータル導線 | ○（テスト非回帰） | ○ | ○ | – |

## 継承・前提

- BR-CI 継承: figuds-build.yml の Actions SHA pin・最小 permissions・fail-fast を維持。
- 生HEX0（U2-3）退行禁止: 改修・ガイドで生 HEX/旧 DS を持ち込まない（BR-UX-8）。
- vitest は devDependency のみ＝配布物・ランタイムに影響なし（SEC 供給面最小）。

## N/A（明示）

- Performance（クライアント分岐＝無視可能）・Scalability・Availability・従来型インフラ＝該当なし。
