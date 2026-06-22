# NFR Requirements Plan — U2-3 スタイル適用

> 対象: BusDelayAlerts（`feature/figuds-adoption`）。FD 承認済（FDQ1-4 全A・2026-06-22）。
> Security Baseline=Yes / PBT=No。前提=Core v1.2.1 配布・U2-2 bridge 導入済。

## NFR 評価ステップ（チェックボックス）

- [x] FD 成果物（business-logic-model / business-rules / frontend-components）を分析
- [x] カテゴリ別に NFR 該当性を判定（Scalability/Performance/Availability/Security/Reliability/Maintainability/Usability/A11y）
- [ ] 文脈質問（NQ1-3）にユーザー回答
- [ ] 回答の曖昧性チェック（必要なら follow-up）
- [ ] `nfr-requirements.md` / `tech-stack-decisions.md` 生成
- [ ] 完了メッセージ提示・承認ゲート

## カテゴリ別該当性（事前判定）

| カテゴリ | 該当 | 所見 |
|---|---|---|
| Reliability / 非回帰 | ◎ 中核 | className トークン置換＋旧 tokens 撤去後も vite build 成功・主要画面非回帰 |
| Maintainability | ◎ | 生 HEX 直書きの再混入防止（lint/CI ガード）が U2-3 の主眼の一つ。U2-2 で「三層 Lint は U2-3 で接続」と持越済 |
| Accessibility | ○ | 状態色の semantic 化に伴い AA 済み Core status を消費。色のみに依存しない深刻度区別（BR-STYLE-3） |
| Performance | △ | CSS class レベルの置換＝実質中立。厳密予算なし・gzip 増分監視（U2-2 踏襲） |
| Security | △ | 旧 tokens 撤去＝削除のみ・新規供給面なし。U2-2 の submodule pin 整合を継承 |
| Scalability / Availability | N/A | 静的配布・ビルド時生成・ランタイム/サーバ無し |

## 文脈質問（[Answer]: タグ）

### NQ1 — 非回帰の検証方法
状態色 semantic 化・teal 置換・旧 tokens 撤去後の「壊れていない」確認をどう定義するか。
- A（推奨）: U2-2 踏襲＝**vite build 成功＋自己ビジュアルチェックリスト＋before↔after diff**（`feature/figuds-adoption` vs `feature/home-redesign`）。自動テストがあれば併用。
- B: 上記に加え、主要画面の VRT（Visual Regression Test）を新規導入する。
- C: build 成功のみを必須とし、ビジュアル確認は手動裁量。

[Answer]: **B**（VRT 新規導入＝主要導線のスクリーンショット VRT。tool は NFR Design/Infra で確定・Playwright 系を既定推奨）。

### NQ2 — 生 HEX 再混入のガード（CI/lint 接続）
FD で主要導線の生 HEX を 0 にするが、周辺画面（Profile/Settings/Onboarding 等）には生 HEX が残る（FDQ3=A）。再混入をどう防ぐか。U2-2 で「三層 Lint は U2-3 で接続＝raw hex 379 で赤回避」と持越済。
- A（推奨）: **スコープ付き CI ガード**＝主要導線パス（`src/app` の対象ファイル群）に限定して `#RRGGBB`／`[#...]` arbitrary の検出で fail。周辺画面は除外（緑を保てる）。残債は別途。
- B: 警告のみ（fail させない）。全画面ガード化は周辺画面完了（次段）まで保留。
- C: 本ユニットでは CI ガードを設けず、検証は手動のみ。

[Answer]: **A**（スコープ付き CI ガード）。

### NQ3 — 性能の扱い
className 置換は実質中立だが方針を確定する。
- A（推奨）: **厳密予算なし**。CSS/JS gzip 増分を記録・監視（U2-2 NRD-PERF 踏襲）。明確な劣化が出た場合のみ予算化再検討。
- B: 主要画面に明示的なバンドル/描画予算を設定する。

[Answer]: **A**（厳密予算なし・gzip 増分監視）。

## 完了後アクション
- 回答確定 → `nfr-requirements.md`（ID 規約 NRD3-*）＋`tech-stack-decisions.md` 生成 → 承認ゲート → NFR Design。
