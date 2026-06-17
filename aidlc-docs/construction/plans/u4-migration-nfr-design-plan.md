# U4 Migration — NFR Design Plan

> 対象 Unit: **U4 Migration**。方針: **質問ゲート無し**（U2/U3 先例）。NFR Requirements を設計パターン＋論理要素へ落とす。

## 生成する成果物（チェックリスト）
- [x] `nfr-design-patterns.md` — Migration Correctness(VRT baseline/API保存ラッパー/三層Lint/画面原子/導出完了ゲート)・Resilience(冪等migrate-in/legacy隔離/dry-run/再生成マニフェスト)・Backward Compatibility(期限付き廃止/CI警告/alias-wrapper分離/構造化ガイド/完了後撤去)・Scalability・Performance(最小依存/差分VRT/収集基盤再利用)・Security・A11y/Maint
- [x] `logical-components.md` — A取り込み(LC-I)・B写像(LC-C)・C移行判定(LC-G)・D後方互換(LC-W)・E進捗収集(LC-M)・Fガードレール(LC-R, U3継承)・G従来型基盤N/A・H Unit横断責務分界

## 設計の核
- 移行の正しさは **VRT baseline（旧preview）＋ API保存ラッパー＋三層Lint＋導出完了ゲート** で担保。
- 取り込みは **冪等 migrate-in ＋ `legacy/` 隔離**（ロールバック容易）。
- 移行率算出は **U5 version 収集と同一クローリング基盤** を再利用（二重実装回避）。
- 後方互換は **期限メタ（deprecatedSince/removeBy）＋ CI 警告**、完了で撤去。
