# U2-7 UX 改修フロー — NFR Design 実行プラン

> per-unit ループ NFR Design 段。**質問ゲートなし**（論点 FDQ7-1〜4 / NQ7-1=B / NQ7-2=A 確定済）。

## 質問ゲート省略の justification

- 検証方式（二層＝vitest 単体＋e2e＋既存 VRT）= NQ7-1 確定。
- CI 統合（figuds-build.yml 同梱）= NQ7-2 確定。
- 成果物形式／スコープ／導線（代表1フロー・最小改善1点・.pen 配置・portal ガイド）= FDQ7-1〜4 確定。
- 残る vitest 物理配置・CI step 位置・.pen 版管理のみ Infra 粒度 → Infra へ申し送り。

## 生成成果物（nfr-design/）

1. **nfr-design-patterns.md** — SP7-1（戻り堅牢化＝純粋判定＋フォールバック）/SP7-2（純粋ロジック抽出）/SP7-3（二層検証）/SP7-4（既存基盤再利用）/SP7-5（非回帰最優先）/SP7-6（Pencil 設計参照）/SP7-7（ポータル導線データ駆動）＋パターン×NFR マトリクス＋継承（SHA pin/生HEX0 退行禁止/vitest devDep）＋N/A。
2. **logical-components.md** — LC-BackDecision（純粋 `decideBackTarget`）/LC-RouteDetailBinding/LC-UnitTest（vitest）/LC-E2E（Playwright 戻り2経路）/LC-VRT（既存再利用）/LC-CIWire（figuds-build.yml）/LC-PenArtifact（.pen as-is/to-be・MCP）/LC-PortalGuide（usage ux-refine）/LC-Record（dev-flow-journal）＋依存図＋実行順9 step＋検証観点＋Infra 申し送り。

## Infra 申し送り

- vitest 物理配置（config・script・パス）／figuds-build.yml の unit step 位置・e2e 同梱形態／`.pen` 版管理・書き出し画像の portal 取込先。

**次**: NFR Design 承認待ち（次=Infrastructure Design）。
