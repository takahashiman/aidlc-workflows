# NFR Requirements — U2-3 スタイル適用

> 対象: BusDelayAlerts（`feature/figuds-adoption`）。FD 承認済（FDQ1-4 全A）。
> 確定: **NQ1=B（VRT 新規導入）/ NQ2=A（スコープ付き CI ガード）/ NQ3=A（厳密予算なし）**。
> Security Baseline=Yes / PBT=No。ID 規約: **NRD3-\***（U2-3）。前提=Core v1.2.1・U2-2 bridge 導入済。

## Reliability / 非回帰（◎ 中核）
- **NRD3-REL-1**: スタイル適用後も製品の `vite build` が**成功**する（状態色 semantic 化・teal 置換・旧 tokens 撤去を含む）。CI/ローカルで確認。
- **NRD3-REL-2**: 主要導線（Home/RouteDetail/RouteCard/StatusBadge/BusSelector/TicketPurchase 等）が**非回帰**＝視覚的に崩れず描画。状態色・ブランド色が意図通り（success/warning/danger/primary）。
- **NRD3-REL-3**: 置換は **className のトークンのみ**を変更し JSX 構造・コンポーネント API を書き換えない（破壊的変更なし・BR-STYLE-4）。
- **NRD3-REL-4**: 旧 `src/styles/tokens/{primitives,semantic}.css` 撤去は**安全**＝削除後も build 成功・主要画面非回帰（BR-STYLE-7）。

## Reliability / VRT（NQ1=B・新規）
- **NRD3-VRT-1**: 主要導線の**スクリーンショット VRT** を新規導入し、`feature/figuds-adoption` の after 状態を**ベースライン**として固定する。
- **NRD3-VRT-2**: VRT は CI で実行し、ベースラインからの予期せぬ視覚差分を検出する（意図的更新時はベースライン再承認）。
- **NRD3-VRT-3**: 対象は FDQ3=A の主要導線に限定（周辺画面 Profile/Settings/Onboarding は対象外＝次段）。
- **NRD3-VRT-4**: VRT は自己ビジュアルチェックリスト＋before↔after diff（BR-STYLE-8）を**置換せず補完**する（人手確認とのハイブリッド）。
- 具体 tool・ベースライン運用・しきい値は **tech-stack-decisions.md** ＋ NFR Design/Infrastructure で確定（既定推奨=Playwright スクリーンショット）。

## Maintainability / 生 HEX 再混入ガード（◎・NQ2=A）
- **NRD3-MNT-1**: **スコープ付き CI ガード**＝主要導線パスに限定して生 HEX（`#RRGGBB`）・arbitrary（`[#...]`）の検出で **fail**。周辺画面は対象外（緑を維持・FDQ3=A）。
- **NRD3-MNT-2**: 既存の三層 lint（U2-1/U2-2 で導入の lint-rules）と整合し、U2-2 で「三層 Lint は U2-3 で接続」と持越した結線を**本ユニットで完了**する。
- **NRD3-MNT-3**: ガードは**主要導線で生 HEX 0** を恒常的に保証（再混入を PR 時点で阻止）。周辺残債は別管理（次段で範囲拡大）。
- **NRD3-MNT-4**: 状態写像（5→3）・teal 置換表は宣言的に文書化（business-logic-model のマッピング表が正典）。

## Accessibility（○・継承＋適用）
- **NRD3-A11Y-1**: 状態色は **AA 済み Core status トークン**（`--status-*-surface`/`-on`）を消費（AA 保証は U2-1 生成器）。
- **NRD3-A11Y-2**: 深刻度区別（delayRisk vs delayed＝ともに warning）は**色のみに依存せず**文言・アイコン（statusConfigs）で表現（BR-STYLE-3）。

## Performance（△・NQ3=A）
- **NRD3-PERF-1**: **厳密予算なし**。className 置換は実質中立。CSS/JS gzip 増分を記録・監視（U2-2 NRD-PERF 踏襲）。
- **NRD3-PERF-2**: 旧 tokens 撤去により CSS が減る方向（純増しない見込み）。明確な劣化が出た場合のみ予算化を再検討。

## Security（△・Baseline=Yes・継承）
- **NRD3-SEC-1**: 旧 tokens 撤去は**削除のみ**＝新規供給面なし。U2-2 の submodule pin 整合（Core v1.2.1・`CORE-DS-VERSION`）を継承。
- **NRD3-SEC-2**: 秘密非保持（トークン値は公開可能なデザイン値）。VRT ベースライン画像にも機密含まず。
- **対象外**: 製品の既存依存（Radix/Tailwind 等）の HIGH/CRITICAL 棚卸しは本ユニットスコープ外（既存負債は別途）。

## N/A（明示）
- **Scalability / Availability / 運用監視**: 静的配布・ビルド時生成・ランタイム/サーバ無しのため N/A。

## トレーサビリティ
- AC①-2（状態色 semantic 化）= NRD3-REL-2・A11Y-1/2（US-D3・BR-STYLE-1/2/3）。
- AC①-3（主要画面 生 HEX 0）= NRD3-MNT-1/2/3（US-D4・BR-STYLE-4/5/6）。
- AC①-5（before↔after）= NRD3-VRT-1〜4・REL-2（US-D7・BR-STYLE-8）。
- 旧 DS 撤去 = NRD3-REL-4（BR-STYLE-7）。
