# NFR Design Plan — U2-6 Core 昇格実行（ドメインパターン）

> 対象: U2-6（代表昇格 `arrival-card`）。NFR Requirements 承認済（2026-06-22）。
> **質問ゲートなし**＝論点（FDQ6-1〜4 / NQ6-1=B / NQ6-2=A）確定済。a11y 検査の物理配置のみ Infra へ送る。

## 質問ゲートなしの justification
- 検証方式＝NQ6-1=B 確定（既存 lint＋VRT 再利用＋自動 a11y 新設）。
- 供給面＝NQ6-2=A 確定（既存 preview パターン継承）。
- 成果物形式・スコープ・导线＝FDQ 確定。
- 残る選択（a11y runner を独立 `ci/a11y` reusable にするか `ci/vrt` 同居にするか＝物理配置）は Infrastructure Design の粒度。

## 生成する成果物
- [x] `construction/u2-6-core-promotion/nfr-design/nfr-design-patterns.md`（SP6-1〜6＋パターン×NFR マトリクス＋継承＋N/A）
- [x] `construction/u2-6-core-promotion/nfr-design/logical-components.md`（LC-ArrivalSpec/ArrivalPreview/StatusMapping/PromotionDraft/CICheck/A11yCheck/Confirm/Record＋依存図＋読込順＋検証観点）

## 申し送り（Infra）
- LC-A11yCheck の物理配置（独立 reusable か vrt 同居か）。
- VRT/a11y ベースラインの CI Linux 初回生成。
