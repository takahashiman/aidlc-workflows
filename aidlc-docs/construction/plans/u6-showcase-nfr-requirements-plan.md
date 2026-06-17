# U6 Showcase — NFR Requirements Plan

> 対象 Unit: **U6 Showcase**（US-5.1 自動クローリング / US-5.2 発見・昇格提案）
> 方針: **質問ゲート無し**（論点は Functional Design = FDQ1-7 全A で確定済み。U2/U3/U4/U5 先例に倣う）。プロジェクト全体 NFR（WCAG 2.1 AA／Security Baseline 有効／rolling／三層ガードレール／PBT 無効）と U5 の CI 基盤 NFR を前提に、U6 固有の「収集クローラ＋ショーケースビューの非機能要件」を導出。

## 生成する成果物（チェックリスト）
- [ ] `nfr-requirements.md` — 収集正確性(SC-Q: 収集源の網羅/誤検知排除・昇格判定の決定性)・信頼性(REL: fail-soft 据え置き・部分失敗 skip・U5 継承)・性能(PERF: 単一走査で API 共有・並列・レート配慮)・セキュリティ(SEC: read-only token・最小権限・収集データの無害化/エスケープ・SCA・iframe/SRI 継承)・保守性(MAINT: 単一クローラ・契約不変・規約ベース収集)・可観測性(OBS: 収集件数/失敗/未収集の可視化)・A11Y(ショーケースビュー WCAG 2.1 AA・空状態の説明)
- [ ] `tech-stack-decisions.md` — TSD: U5 単一クローラ基盤(`collect-versions.mjs`)拡張 / GitHub API(contents+issues, read-only) / registry 駆動 / Core 正典照合(昇格判定) / portal vanilla JS ビュー(既存 renderShowcase) / fail-soft / 契約 schema 不変(showcase-index.schema.json) / GitHub-hosted runner・Node LTS

## 導出根拠（FD との対応）
| NFR クラスタ | 由来 FDQ/BR |
|---|---|
| SC-Q（収集網羅・誤検知排除・昇格判定の決定性） | FDQ2/3/4 / BR-SC-SRC/ID/OWNER/PROMOTED |
| REL（fail-soft・部分失敗 skip・据え置き） | FDQ6 / BR-SC-FAILSOFT（U5 REL-3/4 継承） |
| PERF（単一走査 API 共有・並列・レート） | FDQ1 / BR-CI-1CRAWL |
| SEC（read-only・最小権限・収集データ無害化） | FDQ1/5 / Security Baseline（U2 iframe/SRI/CSP 継承） |
| MAINT（単一クローラ・契約不変・規約収集） | FDQ1/7 / BR-SC-CONTRACT/PLACEMENT |
| OBS（収集件数/失敗/未収集の区別） | FDQ6 / BR-SC-EMPTY |
| A11Y（ビュー WCAG AA・空状態説明） | frontend-components / Q8=A |
