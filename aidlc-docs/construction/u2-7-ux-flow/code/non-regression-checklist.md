# U2-7 UX 改修 — 非回帰チェックリスト（セルフ検証・Q9=C）

> AC①「既存機能を壊さない」厳守。改修は C1（RouteDetail 戻りの堅牢化）1点のみ。

## 機能非回帰

- [x] 通常フロー（アプリ内履歴あり）の戻りは従来どおり1つ前（Home）へ＝挙動不変（e2e ① / decideBackTarget→'back'→`navigate(-1)`）。
- [x] 直リンク/履歴なし（`location.key==='default'`）の戻りは Home へフォールバック＝アプリ外へ抜けない（e2e ② / →'home'→`navigate('/',{replace:true})`）。
- [x] RouteDetail の motion は **Core 体感バジェットへ整合**（300ms 生値→`--motion-duration-budget-nav` 200ms トークン参照・C1 拡張）。easing 曲線・レイアウト・RouteDetailScreen の中身は不変。VRT は `animations:'disabled'` のため視覚スクショ非影響。
- [x] 遅延状態の色/ラベル（Core status-pill 委譲）は不変（状態表現に手を入れていない・BR-FLOW-3）。
- [x] 他画面（MapSearch/Profile/TicketPurchase/RegionSettings/Onboarding）は未改修。

## スタイル非回帰（U2-3 退行禁止）

- [x] 主要導線 生 HEX 0 維持（`check:rawhex` 緑・新規ファイルに生 HEX なし）。
- [x] CSS バンドルサイズ実質不変（gzip 30.23kB）。

## テスト・ビルド

- [x] vitest 単体 8/8 緑（navigation 4＋motion 4）。
- [x] vite build PASS（2088 modules）。
- [x] Playwright プロジェクト分離正常（e2e=tests/e2e・chromium=tests/vrt）。
- [ ] e2e 実描画 緑（CI Linux 初回・戻り2経路）。
- [ ] VRT ベースライン差分なし（CI Linux 初回・視覚非回帰）。
- [x] portal 42/42 緑・portal build PASS（ux-refine 追加の非回帰）。

## アクセシビリティ

- [x] 戻りボタンの role/操作/フォーカスは不変（追加は `data-testid` のみ＝視覚/a11y 不影響）。

## 導線・記録

- [x] portal `ux-refine` ガイドが使い方インデックス（主要操作）に出る＝改修フローが導線として残る（US-X2 AC-3）。
- [x] dev-flow-journal Step 8 に UX 改修フロー確立を記録（US-X4）。

## 承認後タスク（未チェック＝ゲート）

- [ ] `.pen`（design/llocana-ux.pen）を Pencil 拡張で作図し as-is/to-be を確定＋portal/assets へ書き出し。
- [ ] BusDelayAlerts・aidlc-workflows の commit/push。
- [ ] CI（figuds-build.yml）で unit/e2e/VRT 緑を確認。
