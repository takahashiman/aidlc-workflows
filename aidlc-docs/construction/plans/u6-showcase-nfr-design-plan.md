# U6 Showcase — NFR Design Plan

> 対象 Unit: **U6 Showcase**。方針: **質問ゲート無し**（FDQ1-7 全A・NFR Requirements 確定済み。先例踏襲）。
> NFR Requirements（SC-Q/REL/PERF/SEC/MAINT/OBS/A11Y）を**論理コンポーネントと設計パターン**へ落とす。

## 生成する成果物（チェックリスト）
- [ ] `logical-components.md` — 収集層（LC-C: ShowcaseCollector / 収集源アダプタ extensions・issues / 昇格判定器 / fail-soft ラッパ）・データ層（LC-D: showcase-index.json 生成・schema 検証・registry 駆動）・ビュー層（LC-V: renderShowcase 状態機械・カード・空状態2種・昇格導線）・境界（LC-X: GitHub API 境界・Core 正典境界・portal build 境界）
- [ ] `nfr-design-patterns.md` — fail-soft（個別 skip＋全体据え置き）・単一走査統合（version/migration/showcase 同一ループ）・registry 駆動探索・規約ベース収集（ディレクトリ/ラベル）・正規化名照合（昇格）・出力エスケープ（XSS）・空状態判別（未収集/0件）・並列収集＋レート配慮

## NFR → 設計対応
| NFR | 設計手段 |
|---|---|
| SC-Q（網羅/誤検知/決定性/昇格正確性） | 規約ベース収集＋除外フィルタ＋安定 id/ソート＋正規化照合 |
| REL（fail-soft/部分 skip） | try/skip ラッパ＋全体失敗 exit0 据え置き |
| PERF（単一走査/並列） | collectVersions と同一 Promise.all 統合・API 共有 |
| SEC（read-only/無害化） | 最小権限 token＋描画 esc()＋CSP/SRI 継承 |
| MAINT（単一クローラ/契約不変） | 同モジュール拡張＋schema 充足 |
| OBS（件数/失敗/空状態区別） | 収集ログ＋空状態2分岐 |
| A11Y（WCAG AA） | 見出し階層・テキスト等価バッジ・キーボード/コントラスト |
