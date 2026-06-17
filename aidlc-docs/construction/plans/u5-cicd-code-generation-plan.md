# U5 CI/CD Automation — Code Generation Plan

> 確定: FDQ/NRQ/IDQ 全A。生成先（FDQ8/IDQ7=A）: ① **Core DS repo**（`aidlc-projects/FIG-Universal-Design-System/`）の `.github/`＋`ci/`＝共有 CI 正典 ② **portal** `scripts/collect-versions.mjs`（build.mjs 配線）③ 既存テンプレ（`fig-ext-template`・`fig-ext-business-busapp`）の ci スタブを `uses:` 実体参照へ差替え。
> Critical Rules: ロジック実体は Core に 1 つ（BR-CI-NODUP）。CI/コードは workspace 配下、aidlc-docs/ には置かない。Actions は SHA pin（SEC-1）。

## 生成ステップ
| # | 対象 | 内容 | Story/LC |
|---|---|---|---|
| 1 | `Core ci/lint/lint-rules.json` | 三層 LintRuleSet 単一正典（color 中心・severity・層分類） | LC-A3, BR-CI-LINT-1 |
| 2 | `Core ci/lint/three-layer-lint.mjs` | Lint エンジン（V1 hex/色リテラル・V3 color primitive 直参照・px=warn） | LC-B1〜4, CI-1 |
| 3 | `Core ci/lint/__fixtures__/` | good/bad 検証フィクスチャ | REL-1（検証） |
| 4 | `Core .github/actions/three-layer-lint/` | composite action（engine ラッパー） | LC-A2 |
| 5 | `Core .github/workflows/_shared-guardrail.yml` | CI-1 reusable workflow | LC-A1, CI-1 |
| 6 | `Core ci/vrt/vrt-runner.mjs`＋package.json | Playwright+pixelmatch VRT（baseline=repo 内・差分 gate・--changed） | LC-C1〜6, CI-2 |
| 7 | `Core .github/workflows/_shared-vrt.yml` | CI-2 reusable（default＋core-to-portal 連動） | LC-C5, CI-2/US-4.2 |
| 8 | `Core ci/registry/check-registry.mjs`＋schema | CI-5 検査（C1-C5・自動マージ禁止） | LC-E1〜3, CI-5 |
| 9 | `Core .github/workflows/_shared-registry-check.yml` | CI-5 reusable（base 差分・tags 取得） | LC-E1, CI-5 |
| 10 | `Core ci/README.md`＋各 README | 共有正典の参照ガイド | MAINT-1 |
| 11 | `portal/scripts/collect-versions.mjs` | CI-3 単一クローラ（version-matrix＋migration-index・fail-soft） | LC-D1〜6, CI-3 |
| 12 | `portal/scripts/build.mjs` | 収集器を配線（version-matrix スタブ→実収集、showcase は U6 スタブ維持） | LC-D4 |
| 13 | `fig-ext-template/.github/workflows/ci.yml` | echo→`uses:` 実体参照（guardrail/vrt） | スタブ実体化 |
| 14 | `fig-ext-business-busapp/.github/workflows/migrate-checks.yml` | notice→`uses:`（guardrail/vrt）＋migration-status 維持 | スタブ実体化 |
| 15 | `fig-ext-template/.github/workflows/register.yml` | CI-5 検査先（_shared-registry-check）明記 | CI-5 |
| 16 ✅ | 検証 | lint(fixture: good clean/bad error3+warn1)・registry(empty pass/bad C2-4)・VRT(graceful skip)・portal build(収集+schema OK)・portal test 16 pass | REL-1 |

## 検証結果（実行済み）
- **CI-1 Lint**: fixture good=clean / bad=error3(V1_raw_hex・V1_color_literal・V3_color_primitive_leak)+warn1(px)。color primitive 57/242 識別。Core 自身は既存負債 866 error を可視化（段階導入・本 Lint は拡張製品向け）。
- **CI-2 VRT**: preview 無し→skip(exit0) / 依存無し→notice skip(exit0)。Playwright+pixelmatch は CI で導入。
- **CI-5 registry**: 現 registry(空)=合格 / bad fixture=C2(unknown cat)・C3(命名)・C4(dup) 検出。自動マージ禁止メッセージ出力。
- **CI-3 収集**: portal build に配線、version-matrix.json/migration-index.json を schema 準拠で生成（registry 空→0 件・fail-soft）。
- **回帰**: portal `node --test` 16 pass。portal build 成功。
