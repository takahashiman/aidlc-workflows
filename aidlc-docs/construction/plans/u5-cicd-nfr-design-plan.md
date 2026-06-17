# U5 CI/CD Automation — NFR Design Plan

> 対象 Unit: **U5 CI/CD Automation**（US-4.1 / US-4.2 / US-4.3・関連 CI-5）
> 方針: **質問ゲート無し**（FD=FDQ1-8 全A、NFR Requirements 確定済み）。NFR を論理コンポーネント＋設計パターンへ落とす。U5 は CI 基盤＝実行時常駐サーバ無し（従来型 queue/cache/CB/LB/DB は N/A）。

## 生成する成果物（チェックリスト）
- [x] `logical-components.md` — A.共有CI正典(Reusable/Composite/RuleSet) / B.三層Lint / C.VRT(repo内baseline・Core→portal連動) / D.収集(単一クローラ version+migration) / E.registry検査 / F.セキュリティ統制 / G.従来型基盤の N/A 判定 / H.Unit 横断分界
- [x] `nfr-design-patterns.md` — CI Correctness(決定的Lint/安定VRT/網羅収集) / Resilience(SHA pin再現/fail-soft収集/required check) / Performance(差分VRT/並列API収集/キャッシュ) / Security(最小権限/自動マージ禁止/SHA pin/fork遮断/SCA) / Maintainability(単一正典/二重実装回避) / Observability(違反/差分/失敗の可視化)

## 導出根拠（NFR との対応）
| 設計クラスタ | 由来 NFR/BR |
|---|---|
| 共有CI正典(A) | MAINT-1/2 / BR-CI-NODUP / FDQ1 |
| 三層Lint(B) | CI-Q1/CI-Q5 / BR-CI-LINT |
| VRT(C) | CI-Q2 / REL-5 / PERF-1/4 / BR-CI-VRT |
| 収集(D) | CI-Q3 / REL-3/4 / PERF-2 / BR-CI-CRAWL |
| registry検査(E) | CI-Q4 / SEC-3 / BR-CI-REG |
| セキュリティ(F) | SEC-1〜6 / BR-CI-SEC |
| 可観測性 | OBS-1〜4 |
