# U6 Showcase — NFR Design Patterns

> 確定: FDQ1-7 全A。U6 が採る設計パターンと適用箇所。多くは U5 から継承。

## P1. 単一走査統合（Single-Crawl Fan-out）
- **適用**: LC-C1 / BR-CI-1CRAWL。
- **形**: `collectVersions()` の `Promise.all(projects.map(...))` と同一ループ内（or 同一 registry 列挙）で showcase も収集。registry・owner・token・fetch クライアントを共有。
- **効果**: API 呼数・レート消費を最小化（PERF-1）。version/migration/showcase の3出力を1走査で。

## P2. registry 駆動探索（Registry-Driven Discovery）
- **適用**: LC-D1 / BR-SC-SRC-2。
- **形**: 走査対象は registry 登録製品のみ。未登録は対象外（登録＝一覧化の前提・U3 register と整合）。

## P3. 規約ベース収集（Convention over Manifest）
- **適用**: LC-C2/C3 / BR-SC-SRC-1/3/4。
- **形**: `extensions/` ディレクトリ＋`temp-part` ラベルという**既定規約**で収集。各 repo に専用マニフェストを強制しない。除外フィルタ（compat/index/README/隠し）で誤検知排除。
- **効果**: 改修ゼロで横展開（MAINT-3）・誤検知排除（SC-Q-2）。

## P4. fail-soft（Graceful Degradation・U5 継承）
- **適用**: LC-C5 / LC-X1/X2 / BR-SC-FAILSOFT。
- **形**: 個別 repo/項目失敗は try/catch で skip し継続。全体失敗でも `process.exit(0)` で portal ビルド継続＝既存 `showcase-index.json` 据え置き。Core 照合不能は `promotedToCore=false` 据置。
- **効果**: 外部 repo/API の一時障害が portal 全体を落とさない（REL-1/2）。

## P5. 正規化名照合（Normalized-Name Matching）
- **適用**: LC-C4/C6 / BR-SC-PROMOTED。
- **形**: name を小文字化・記号除去・別名表（例 `fab`↔`floating action button`）で正規化し Core 正典と一致判定。誤検知を避けるため厳格一致寄り。
- **効果**: `promotedToCore` の決定的判定（SC-Q-4）。

## P6. 安定同定・安定ソート（Stable Identity & Order）
- **適用**: LC-D2 / BR-SC-ID。
- **形**: `id` を repo×名で安定生成、出力を `ownerProjectId→kind→name` で安定ソート。
- **効果**: 再収集で差分最小・決定性（SC-Q-3）。

## P7. 出力エスケープ（Output Encoding・XSS 防止）
- **適用**: LC-V5 / SEC-2。
- **形**: 収集した外部由来文字列（name/owner/Issue タイトル/URL）はビュー描画時に既存 `esc()` で必ずエスケープ。`screenshotUrl`/`previewPath` は CSP/SRI（U2 継承）配下。

## P8. 空状態判別（Distinct Empty States）
- **適用**: LC-V1/V6 / BR-SC-EMPTY / OBS-2。
- **形**: `collectedAt==null || _generatedBy がスタブ`→「未収集」、`collectedAt!=null && items.length==0`→「収集済み0件」を文言で区別。各空状態に次アクション（使い方リンク）。

## P9. 並列収集＋レート配慮（Parallel with Rate-Awareness）
- **適用**: LC-C1 / LC-X1 / PERF-2。
- **形**: 製品単位 `Promise.all` 並列。GitHub token 併用でレート緩和、429/403 は fail-soft skip。

## パターン×NFR マトリクス
| パターン | SC-Q | REL | PERF | SEC | MAINT | OBS | A11Y |
|---|---|---|---|---|---|---|---|
| P1 単一走査 | | | ✓ | | ✓ | | |
| P2 registry 駆動 | ✓ | | | | ✓ | | |
| P3 規約収集 | ✓ | | | | ✓ | | |
| P4 fail-soft | ✓ | ✓ | | ✓ | | ✓ | |
| P5 正規化照合 | ✓ | | | | | | |
| P6 安定同定 | ✓ | | | | | | |
| P7 エスケープ | | | | ✓ | | | |
| P8 空状態判別 | | | | | | ✓ | ✓ |
| P9 並列/レート | | ✓ | ✓ | | | | |
