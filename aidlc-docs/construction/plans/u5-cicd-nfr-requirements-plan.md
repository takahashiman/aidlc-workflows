# U5 CI/CD Automation — NFR Requirements Plan

> 対象 Unit: **U5 CI/CD Automation**（US-4.1 / US-4.2 / US-4.3・関連 CI-5/US-3.2）
> 方針: **質問ゲート無し**（論点は Functional Design = FDQ1-8 全A で確定済み。U2/U3/U4 先例に倣う）。プロジェクト全体 NFR（WCAG 2.1 AA／Security Baseline 有効／SemVer／三層ガードレール／PBT 無効）を前提に、U5 固有の「CI 基盤としての非機能要件」を導出。

## 生成する成果物（チェックリスト）
- [x] `nfr-requirements.md` — CI 正確性(CI-Q: Lint/VRT/収集の決定性・偽陰性排除)・信頼性/再現性(REL: SHA pin で再現・fail-soft収集・required check)・性能(PERF: 差分VRT・収集の軽量/並列・キャッシュ)・セキュリティ(SEC: 最小権限・fork秘密遮断・自動マージ禁止・SHA pin・SCA)・保守性(MAINT: 単一正典・二重実装回避・契約準拠)・可観測性(OBS: 違反/差分/収集失敗の可視化)・A11Y(VRT が a11y 退行も捕捉)
- [x] `tech-stack-decisions.md` — TSD: Core 共有CI正典(Reusable Workflow/Composite Action) / stylelint カスタム+静的スキャナ(三層Lint) / Playwright VRT(repo内baseline) / Core→portal rolling VRT / GitHub API 収集(チェックアウト不要) / 単一クローラ(version+migration) / Core側 registry 検査 / GitHub-hosted runner・Node LTS / SHA pin・最小権限

## 導出根拠（FD との対応）
| NFR クラスタ | 由来 FDQ/BR |
|---|---|
| CI-Q（Lint/VRT/収集の正確性・決定性） | FDQ2/3/5 / BR-CI-LINT/VRT/CRAWL |
| REL（再現性・fail-soft・required check） | FDQ1/3/5 / BR-CI-PIN/VRT/CRAWL-5 |
| PERF（差分VRT・軽量収集） | FDQ3/5 / BR-CI-VRT-4 / PERF-2 継承 |
| SEC（最小権限・自動マージ禁止・SHA pin・fork） | FDQ7 / BR-CI-SEC / Security Baseline |
| MAINT（単一正典・二重実装回避） | FDQ1/8 / BR-CI-NODUP |
| OBS（違反/差分/収集失敗の可視化） | FDQ2/3/6 / frontend-components §5/§6 |
