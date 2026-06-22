# NFR Requirements — U2-4/U2-5 ポータル IA・操作完結

> 非機能要件の正典。確定回答 NQ1=B / NQ2=B / NQ3=A に基づく。
> 初代ポータル(U2)の NFR 姿勢（軽量 Node ビルド／Pages 一本化／初回 ≤2.5s・LH≧90／WCAG AA／
> Security Baseline 静的サブセット／契約 JSON Schema＋VRT）を継承し、本ユニットの差分を定義する。

## Reliability（信頼性・◎）

### NRD45-REL-1 — 後方互換（既存導線非破壊）
- Home 追加・`DEFAULT_ROUTE` 変更後も、既存の深いルート（`#/overview/...`・`#/usage/...`・`#/ops/...`・
  `#/projects/...`・`#/developer/...`）は従来どおり直接到達できること。

### NRD45-REL-2 — 空状態・フォールバック
- Home/シナリオ/余白/ガイドは coreContent 未取込・registry 0 件等でも壊れず、空状態文言で縮退すること。
- 余白ビューは coreContent.PAGES が無い場合「未収集」を明示（既存 emptyOps 流儀）。

### NRD45-REL-3 — ビルド fail-fast
- 新ビュー/ルート/GUIDES 追加後も `npm run build`（軽量 Node）が成功し、契約 schema 検証を通ること。

## Maintainability（保守性・◎）

### NRD45-MNT-1 — 純粋関数・テスト容易性
- 新規 `renderHome`/`renderBrowseMargin`・`parseRoute('#/home')`・GUIDES 追加は副作用のない純粋関数として
  テスト可能であること（既存 MAINT-2 継承）。

### NRD45-MNT-2 — セルフ検証 結線テスト（AC②-2）★本ユニット中核
- 4操作（新製品セットアップ／移行／Core 昇格提案／バージョン参照）それぞれについて、
  **Home/シナリオ → 該当ガイド → 確認** がポータル内リンクのみで到達できることを node テストで検証する。
- 検証観点: ①各操作に対応する GUIDES key が存在し `renderGuide()` が描画する、②Home/シナリオの導線リンクが
  当該 GUIDES へ解決する、③ガイドが目的→前提→手順→確認 を含む。

### NRD45-MNT-3 — IA の単一定義
- SECTIONS/KINDS/GUIDES/役割カードの定義はデータ駆動で1箇所に集約し、重複を避ける（既存 BR-IA/NAV 継承）。

## A11y（アクセシビリティ・WCAG 2.1 AA・NQ2=B）

### NRD45-A11Y-1 — AA 達成（新 Home/導線）
- 役割カード・シナリオ導線・クイックリンクはキーボード操作可能・フォーカス可視・適切なランドマーク/見出し階層・
  コントラスト AA を満たすこと。3プロファイルいずれでも AA 成立。

### NRD45-A11Y-2 — 自動 a11y 検査（新規導入）
- **Playwright＋`@axe-core/playwright`** で Home/ランディング（および主要新ビュー）に対し axe 検査を CI 実行し、
  WCAG 2.1 AA 相当の重大違反 0 を合否ゲートとする。手動チェックリストは補助。

## VRT（視覚回帰・NQ1=B・本ユニットで新設）

### NRD45-VRT-1 — Home/ランディングのベースライン VRT
- **Playwright `toHaveScreenshot`** で Home/ランディングのスクリーンショット VRT を新設し、ベースライン差分を
  CI で検出する。ポータルに VRT 基盤を初導入（U2-3 製品側に続く）。

### NRD45-VRT-2 — 対象範囲
- 必須＝Home（役割カード＋はじめに読む順番＋シナリオ入口＋4操作クイックリンクを含む全体）。
- 任意＝余白ビュー・使い方インデックス（シナリオA★最優先表示）。対象粒度は Infra で確定。

### NRD45-VRT-3 — ベースライン真実源
- OS 依存差を避けるため**ベースラインは CI(Linux) で生成・repo 管理**（U2-3 IDQ1=A と同方針）。ローカルは差分確認のみ。

## Performance（性能・NQ3=A）

### NRD45-PERF-1 — 既存目標維持・厳密予算なし
- 初回表示 ≤2.5s・遷移即時・LH≧90 の既存目標を維持。Home は静的・軽量で新ランタイム依存を持たない。
- 新依存（Playwright/axe）は **devDependencies**＝配布バンドル・Pages 成果物に非影響。

## Security（Security Baseline 静的サブセット・△）

### NRD45-SEC-1 — 新たな攻撃面を増やさない
- Home/ガイドは静的リンク・カードのみ。新サーバ・新外部 API 呼び出しを持たない。iframe sandbox/CSP/SRI は既存維持。
- ユーザ生成文字列（coreContent 由来ラベル等）は既存 `esc()` でエスケープ。

### NRD45-SEC-2 — 機密非保持（権利者操作の非掲載）
- GitHub 操作案内（US-X3）はツール非依存の一般操作のみ。シークレット/PAT/権利者専用操作は載せない（§4-2）。

## N/A
- **Scalability / Availability**: 静的 SPA・GitHub Pages のため N/A（既存判断継承）。

## トレーサビリティ
- AC②-1=NRD45-MNT-2（4操作完結）/ AC②-2=NRD45-MNT-2（セルフ検証）。
- US-P1/P5=REL-1/A11Y-1/VRT-1。US-P6=REL-2。US-X3=SEC-2。
