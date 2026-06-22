# Unit of Work — イニシアチブ#2

> 確定: U1=A（C-Palette を独立 Unit）/ U2=A（配布と適用を分割）/ U3=A（ポータル並行）/ U4=A（U2-1 から着手）。
> 計 **7 Unit**＋横断記録。per-unit に Functional/NFR-Req/NFR-Design/Infra/Code Gen を回す（条件付・execution-plan）。

## U2-1 — Core パレット基盤（seed 駆動パレット生成）★Critical Path 根
- **責務**: C-Palette を FIG-UDS Core に新設。seed（アプリのメインカラー）から **signature 派生**（base/light/dark/tint/shadow/on-color/任意 ramp）と **status 色**を **OKLCH** で生成し、**WCAG AA を必須検証**。`--signature-*`/`--status-*` を出力し semantic 層が参照。signature 機構を seed パラメトリック化（Taste 派生基盤）。
- **主 component**: C-Palette。**主ストーリー**: US-D2/US-D3（基盤）・AD5/AD5-2。**repo**: FIG-UDS Core。
- **完了条件**: 生成法則（Δ/α/ramp/status）確定・a11y 検証が AA を保証・LLocana seed=`#2C6B5E` で派生一式が生成できる・Core CI（三層/a11y）緑。
- **Construction 想定**: FD=◎（生成規則・a11y fallback）/ NFR-Req=◎（a11y AA・決定性）/ NFR-Design=○ / Infra=○（Core CI）/ Code Gen=◎。

## U2-2 — 配布・ブリッジ（submodule×Vite・@theme ブリッジ）
- **責務**: Core を submodule pin（＋`CORE-DS-VERSION`）し Vite で Core CSS import。**専用ブリッジ CSS 1枚**で Core semantic→Tailwind `@theme` を対応。`injectSignature(#2C6B5E)`（U2-1 の C-Palette 利用）を適用。Consumer プロファイル。`vite build` 非回帰。
- **主 component**: C-Distrib/C-Bridge/C-Signature。**主ストーリー**: US-D1/US-D5/US-D6。**repo**: BusDelayAlerts。
- **完了条件**: AC①-4（submodule×Vite build 成功）・既存非回帰・signature が Core 由来トークンで描画。
- **Construction 想定**: FD=○ / NFR-Req=○（非回帰）/ Infra=◎（submodule/Vite/CI 接続）/ Code Gen=◎。

## U2-3 — スタイル適用（状態色 semantic 化・生 HEX 解消）
- **責務**: 状態色（正常/遅延/運休）を semantic トークン経由へ（U2-1 status パレット利用）。`src/app` の生 HEX 直書き（baseline 379）を主要画面で 0、`var(--token)` 標準化。before↔after を `feature/figuds-adoption` vs `feature/home-redesign` で確認。
- **主 component**: C-Bridge 消費・semantic。**主ストーリー**: US-D3/US-D4/US-D7。**repo**: BusDelayAlerts。
- **完了条件**: AC①-1/2/3/5（signature 集約・状態色 semantic・主要画面 hex 0・before↔after diff）。
- **Construction 想定**: FD=◎（状態色割付・画面別手順）/ NFR-Req=○（三層/a11y）/ Infra=○ / Code Gen=◎。

## U2-4 — ポータル IA（役割別入口・2シナリオ・責務分離・余白）※dogfooding と並行
- **責務**: §4-4 IA。本文は Core 正典、ポータルは IA（並び/ラベル/入口導線/新ビュー）。役割別入口・2シナリオ別フロー（A 既存/② 新規）・getting-started 責務分離・オンボーディング・未整備閲覧「余白」。
- **主 component**: C-PortalIA。**主ストーリー**: US-P1〜P6。**repo**: aidlc-workflows（＋Core content）。
- **完了条件**: 役割別入口/2シナリオ導線/オンボ/余白がポータルに成立・ポータル build/test 緑。
- **Construction 想定**: FD=○（IA ルール）/ NFR-Req=○（a11y/性能）/ Infra=○（Pages）/ Code Gen=◎。

## U2-5 — ポータル操作完結・GitHub 操作案内・セルフ検証
- **責務**: 主要4操作（①セットアップ ②移行 ③昇格提案 ④バージョン参照）をポータル参照のみで完遂。GitHub 操作案内（昇格/移行）。セルフ検証チェックリスト。
- **主 component**: C-PortalIA/C-Record。**主ストーリー**: US-P7/US-X3。**repo**: aidlc-workflows。
- **完了条件**: AC②-1/2/3（ポータルだけで4操作完遂・セルフ検証・LLocana 実例導線）。
- **Construction 想定**: FD=○ / NFR-Req=○ / Infra=○ / Code Gen=◎。

## U2-6 — Core 昇格実行（ドメインパターン）
- **責務**: arrival-card/delay-banner 等を抽出→FIG-UDS Live Preview 形式（`preview/*.html`＋`spec.md`）→**Issue 导线＋PR**→レビュー→マージ→昇格確認。他スタイル混入禁止。
- **主 component**: C-Promo。**主ストーリー**: US-X1（S4=B）。**repo**: FIG-UDS Core ⇄ 製品。
- **完了条件**: Core に新規コンポーネントが昇格・確認可能（画像03④）。
- **Construction 想定**: FD=◎（spec 仕様）/ NFR-Req=○ / Infra=○（Core CI）/ Code Gen=◎。
- **前提**: U2-3（蓄積）後に着手。

## U2-7 — UX 改修フロー（VSCode×Pencil）
- **責務**: 主要画面の画面遷移/UX を Pencil（.pen）で表現→確認→実装反映。Pencil=設計参照、実装が正典、既存非回帰。
- **主 component**: C-UXFlow。**主ストーリー**: US-X2（S3=C）。**repo**: BusDelayAlerts/Pencil。
- **完了条件**: 主要画面の UX 改修フローが確立・機能非回帰・ポータルに導線。
- **Construction 想定**: FD=○ / NFR-Req=○（非回帰）/ Infra=△ / Code Gen=◎。

## 横断 — 記録（C-Record）
- **責務**: dev-flow-journal / session-log を各 Unit で更新し、ポータル素材化（US-X4）。独立 Unit にせず**全 Unit に内包**。

## Unit 一覧サマリ
| Unit | 名称 | repo | 並行性 |
|---|---|---|---|
| U2-1 | Core パレット基盤 | Core | 根（最初） |
| U2-2 | 配布・ブリッジ | 製品 | U2-1 後 |
| U2-3 | スタイル適用 | 製品 | U2-2 後 |
| U2-4 | ポータル IA | ポータル | **並行可** |
| U2-5 | ポータル操作完結 | ポータル | U2-4 後（並行可） |
| U2-6 | Core 昇格実行 | Core⇄製品 | U2-3 後 |
| U2-7 | UX 改修 | 製品/Pencil | 並行可（U2-2 後推奨） |
