# U4 Migration — NFR Requirements Plan

> 対象 Unit: **U4 Migration**（US-3.5 / US-3.6 / US-4.5・横断 US-2.5）
> 方針: **質問ゲート無し**（論点は Functional Design = FDQ1-8 全A で確定済み。U2/U3 先例に倣う）。プロジェクト全体 NFR（WCAG 2.1 AA／Security Baseline 有効／SemVer／三層ガードレール／PBT 無効）を前提に U4 固有の移行品質要件を導出。

## 生成する成果物（チェックリスト）
- [x] `nfr-requirements.md` — 移行品質(MIG-Q: 写像VRT/props互換/三層Lint/完了自動算出/混在検出)・信頼性/冪等(REL: 取り込み冪等/dry-run/legacy隔離ロールバック)・後方互換(COMPAT: 期限メタ/CI警告/MAJORガイド)・セキュリティ(SEC: PR/pin/scope/SCA)・A11Y(退行防止)・保守性(マニフェスト機械可読/U5基盤再利用)・性能(軽量/差分VRT)
- [x] `tech-stack-decisions.md` — TSD: U3 template派生+migrate-in / Core `.fig-*` クラス委譲(JSX薄ラッパー) / 機械可読ComponentMapping / 画面=原子自動算出 / VRT(旧preview baseline) / ラッパー期限メタ / MigrationGuide / migration-manifest.json集約 / U3継承(pin/scope/供給チェーン)

## 導出根拠（FD との対応）
| NFR クラスタ | 由来 FDQ/BR |
|---|---|
| MIG-Q（写像/混在/完了の機械化） | FDQ2/3/4 / BR-CONV/SCR/DONE |
| REL（取り込み冪等/隔離） | FDQ1 / BR-MIG / U3 REL 継承 |
| COMPAT（ラッパー/エイリアス/MAJOR） | FDQ6/7 / BR-WRAP/GUIDE |
| SEC | U3 SEC 継承 / BR-SCOPE / Security Baseline |
| MAINT/PERF（収集基盤再利用） | FDQ8 / BR-VIS |
