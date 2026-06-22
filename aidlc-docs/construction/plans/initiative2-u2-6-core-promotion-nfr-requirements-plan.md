# NFR Requirements Plan — U2-6 Core 昇格実行（ドメインパターン）

> 対象: U2-6（代表昇格 `arrival-card`）。FD 承認済（2026-06-22）。
> Core 既存 CI 正典（三層 lint・`_shared-vrt`＝Playwright/chromium・Actions SHA pin・Maintainer 承認）を継承。

## カテゴリ該当性 事前判定

| カテゴリ | 該当 | 理由 |
|---|---|---|
| Reliability/後方互換 | ◎ | 昇格は加算（既存 spec/preview 無改変・ギャラリー/索引維持・MINOR） |
| Maintainability | ◎ | Core 慣習準拠 spec・生HEX0・プリミティブ合成・既存 CI 再利用 |
| Accessibility | ○→自動化 | status-pill/card 委譲で AA 継承＋NQ6-1=B で自動 a11y 検査新設 |
| Performance | N/A 寄り | 静的 spec/preview＝配布非影響・厳密予算なし継承 |
| Security | △ | 供給面のみ（新規依存なし・CDN preview パターン・SHA pin） |
| Scalability/Availability | N/A | サービス/インフラ増設なし |

## 回答確定（2026-06-22・NFR-Req 質問ゲート）

- **NQ6-1=B（検証方式）**: Core 既存 CI（三層 lint＝生HEX0／`_shared-vrt`＝preview VRT）に乗せ、**さらに専用自動 a11y 検査を Core CI に新設**（arrival-card preview を axe で検査・serious/critical 0）。
  - 実装方針: Core 既存 Playwright/chromium VRT 基盤（`ci/vrt`）を再利用し `@axe-core/playwright` を追加（配置は Infra で確定）。新規基盤コストを最小化（BR-CI-NODUP-1）。
- **NQ6-2=A（Security 供給面）**: **既存 Core preview パターンを継承**（lucide CDN unpkg pin・新規依存なし・秘密非保持・Actions SHA pin）。

## 生成する成果物

- [x] `construction/u2-6-core-promotion/nfr-requirements/nfr-requirements.md`（NRD6-REL-1〜3 / MNT-1〜3 / A11Y-1〜3 / VRT-1 / PERF-1 / SEC-1〜3・Scal/Avail N/A）
- [x] `construction/u2-6-core-promotion/nfr-requirements/tech-stack-decisions.md`（TSD6-1〜7＋継承）

---

## 質問 — 回答済み

## Question NQ6-1 — 昇格成果物の検証方式
A) Core 既存 CI に乗せる＋セルフチェック / B) **さらに専用自動 a11y 検査を Core CI に新設** / C) セルフレビューのみ → **[Answer]: B**

## Question NQ6-2 — 供給面 Security のスコープ
A) **既存 Core preview パターンを継承** / B) preview を自己完結化（CDN 排除） → **[Answer]: A**
