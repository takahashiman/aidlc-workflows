# Logical Components — U2-3 スタイル適用

> スタイル適用（状態色 semantic 化・生 HEX 解消・旧 DS 撤去・検証）を論理要素へ分割（技術非依存）。
> U2-2 の LC-Submodule/Generator-Hook/Bridge/Profile を**前提**として活用。従来型インフラ要素は N/A。

## LC-StatusTheme — 状態色テーマ定義
- **責務**: `@theme`（bridge 連鎖）に `--color-success/-warning/-danger`（＋`-foreground`）を定義し Core `var(--status-*-surface)`/`-on` を参照（SP1）。
- **入出力**: in=Core status トークン（U2-1/U2-2 配布）/ out=`bg-success`等 Tailwind ユーティリティ。
- **依存**: LC-Bridge（U2-2）・Core status。

## LC-StatusMapping — 状態写像適用
- **責務**: StatusBadge・状態表示の className を Tailwind 既定（green/amber/red 直書き）から status ユーティリティへ置換（SP1・5→3 写像）。文言・アイコンは statusConfigs を維持（SP7）。
- **依存**: LC-StatusTheme。

## LC-BrandSubstitution — ブランド色機械置換
- **責務**: 主要導線の `[#2C6B5E]` arbitrary を `primary` ユーティリティへ機械置換（opacity 維持・SP2）。
- **依存**: LC-Bridge（`--primary`=signature 解決）。

## LC-RawHexGuard — 生 HEX ガード（CI）
- **責務**: 主要導線パス限定で `#RRGGBB`/`[#...]` を検出 fail（SP3）。既存三層 lint と整合・周辺画面除外。
- **入出力**: in=対象ファイル glob / out=CI pass/fail。
- **配置確定**: ファイル glob・CI step 結線は Infrastructure Design。

## LC-VRT — スクリーンショット VRT
- **責務**: 主要導線のスクショをベースライン固定し CI で差分検出（SP4）。意図更新時はベースライン再承認。
- **入出力**: in=主要画面レンダリング / out=ベースライン画像（repo 管理）＋差分レポート。
- **配置確定**: tool（既定 Playwright）・対象画面リスト・ビューポート・しきい値・ベースライン更新フロー・CI 実行は Infrastructure Design。
- **依存**: 製品ビルド（描画対象）。

## LC-LegacyRemoval — 旧 DS 撤去
- **責務**: `src/styles/tokens/{primitives,semantic}.css` 削除＋`index.css` 参照除去（SP5）。
- **ガード**: 撤去後 build 成功＋LC-VRT/自己ビジュアル非回帰。

## LC-Verify — 非回帰検証（統合）
- **責務**: `vite build` 成功＋LC-VRT＋自己ビジュアルチェックリスト＋CSS/JS gzip 増分記録（SP4/SP6）。before↔after diff（`feature/figuds-adoption` vs `feature/home-redesign`）。

## 依存図
```text
Core status ─► LC-StatusTheme ─► LC-StatusMapping ─┐
LC-Bridge(U2-2) ─► LC-BrandSubstitution ───────────┤─► 主要導線の描画（success/warning/danger/primary）
                                                    │
LC-LegacyRemoval ──(削除)──► (index.css 参照除去) ──┘
LC-RawHexGuard ──(CI fail で再混入阻止)──► 主要導線パス
LC-VRT ──(ベースライン差分)──┐
LC-Verify ──(build＋VRT＋自己ビジュアル＋gzip)──► 全体非回帰
```

## スタイル読込順（U2-2 から不変・撤去反映）
```
fonts → tailwind → vendor/core(primitives→semantic→signature(生成)→status(生成)→profile-consumer)
      → figuds-bridge(@theme: primary=signature, status=success/warning/danger) → 既存 theme.css 残差
      ※ 旧 src/styles/tokens/{primitives,semantic}.css は LC-LegacyRemoval で除去
```

## 従来型基盤（N/A）
- Queue / Cache / Circuit Breaker / Load Balancer / DB / 外部 API / retry・failover：**いずれも N/A**（ビルド時・静的配布・外部 I/O なし）。

## 検証観点（具体例ベース・PBT なし）
- StatusBadge の 3 状態が success/warning/danger ユーティリティ＝Core status 色で描画。
- 主要導線（Home/RouteDetail/RouteCard/StatusBadge/BusSelector/TicketPurchase 等）で生 HEX 0（LC-RawHexGuard が緑）。
- ブランド主色が Core signature（teal）で反映（LC-BrandSubstitution）。
- 旧 tokens 撤去後 `vite build` 成功・LC-VRT ベースライン差分なし・主要画面非回帰。
- delayRisk と delayed は同 warning 色＋文言/アイコンで深刻度区別（SP7）。
