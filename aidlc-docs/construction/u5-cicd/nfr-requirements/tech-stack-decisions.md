# U5 CI/CD Automation — Tech Stack Decisions

> FDQ1-8 全A・NFR Requirements を技術選択へ落とす。プロジェクト方針（マルチレポ・Core 中核・GitHub Pages/Actions・自己ホスト・SemVer・三層ガードレール）と整合。
> ツールは方式の確定であり、具体配線は Code Generation。

## TSD-1. 共有 CI 正典の実装形態（FDQ1=A）
- **GitHub Reusable Workflows ＋ Composite Actions** を Core DS repo に置く。
  - Reusable: `_shared-guardrail.yml`（CI-1）/ `_shared-vrt.yml`（CI-2）/ `_shared-registry-check.yml`（CI-5）。
  - Composite Action: `.github/actions/three-layer-lint/` 等、合成可能な実行単位。
- 各 repo は `uses: <org>/FIG-Core-DS/.github/workflows/_shared-*.yml@<ref>` で参照。**拡張＝SemVer タグ pin / portal＝main(rolling)**（BR-CI-PIN-1）。
- **却下**: 独立 `fig-ci` repo（FDQ1=B）＝repo 増・Core との二重統治。各 repo コピー（C）＝ドリフト。

## TSD-2. 三層ガードレール Lint（FDQ2=A / CI-1）
- **CSS = stylelint ＋ カスタムプラグイン**（三層参照グラフ・`var(--fig-*)` 経由必須・生値検出）。
- **JSX/HTML = 軽量静的スキャナ**（Node・正規 + 簡易 AST/トークン走査）で同一 `LintRuleSet` を参照。
- ルールは Core `ci/lint/LintRuleSet`（layerGraph / rawValuePolicy / viaSemantic / 許可リスト）に集約（BR-CI-LINT-1）。
- 出力 `LintViolation[]`、1 件で失敗（CI-Q1/CI-Q5）。

## TSD-3. VRT 方式と baseline（FDQ3=A / CI-2）
- **Playwright（ヘッドレス Chromium 既定）** で preview/*.html を描画→スクショ→画素差分（pixelmatch 相当）。
- **baseline は各 repo 内 `preview/__baseline__/`** にコミット。差分しきい値超過で **required check 失敗**。意図差分は baseline 更新コミットで承認。
- 非決定要素（フォント/アニメ/時刻）を固定してフレーキー回避（CI-Q2）。
- **却下**: baseline Core 集中（同期コスト）／外部 SaaS（自己ホスト方針・外部依存）。

## TSD-4. Core→portal 連動 VRT（FDQ4=A / US-4.2 AC1）
- Core PR の `_shared-vrt` が **portal を checkout → 当該 PR の Core を vendor 取込（rolling 相当）→ U2 ビルド → preview VRT**。差分許容外で **Core PR の required check 失敗**。
- portal の U2 ビルドパイプラインを再利用（重複実装なし / PERF-4）。
- **却下**: マージ後 nightly（事前ブロック不能で AC1 不充足）。

## TSD-5. version/migration 収集（FDQ5=A / FDQ6=A / CI-3）
- **portal ビルド内 `scripts/collect-versions.mjs`**（軽量 Node）。探索対象＝Core `registry.json`（registry 駆動）。
- pin 取得＝**GitHub API（contents）**、優先順 `submodule → CORE-DS-VERSION → package.json`、採用ソースを記録（チェックアウト不要 / PERF-2）。
- **単一クローラで version-matrix.json ＋ migration-index.json を同時生成**（同一走査 / BR-CI-1CRAWL-1）。出力は U2 確定スキーマ準拠（変更しない）。
- **fail-soft**: 個別失敗は `unknown`/skip、全体失敗は据え置き（REL-3/REL-4）。

## TSD-6. registry 登録検査（FDQ7=A / CI-5）
- **Core 側 `_shared-registry-check.yml`** が registry PR に対し C1 schema / C2 taxonomy / C3 naming / C4 dup / C5 coreVersion-exists を機械検査。
- 全通過でも **自動マージ禁止**、Core Maintainer 承認必須（SEC-3）。スキーマ検証は ajv 等、tag 実在は GitHub API。

## TSD-7. 実行環境・セキュリティ
- **GitHub-hosted runner（ubuntu-latest）＋ Node LTS**（U2/U3/U4 と整合）。依存は `actions/cache`（PERF-3）。
- **Actions は SHA pin**（SEC-1）、`permissions: contents: read` 既定、cross-repo 書込のみ最小権限トークン/App（SEC-2）。
- **fork PR は secrets job を skip**（SEC-4）。OSS 依存は lockfile pin＋SCA（SEC-5）。

## TSD-8. スタブ実体化の配置（FDQ8=A）
| 既存スタブ | U5 での差替え |
|---|---|
| `fig-ext-template/.github/workflows/ci.yml`（Lint/VRT echo） | `uses: ...FIG-Core-DS/.github/workflows/_shared-guardrail.yml@<ref>` 等へ |
| `fig-ext-business-busapp/.github/workflows/migrate-checks.yml`（Lint/VRT notice） | 同 reusable workflow 参照へ（migration-status は U4 のまま） |
| `fig-ext-template/.github/workflows/register.yml`（検査委譲） | registry PR 起票後、Core 側 `_shared-registry-check` がゲート |
| `portal/scripts/build.mjs`（version-matrix/showcase スタブ生成） | `collect-versions.mjs` を呼び実体収集へ（showcase は U6） |
| Core repo | `.github/workflows/_shared-*.yml`・`.github/actions/`・`ci/` を新設（正典） |

## TSD-9. 非対象（N/A）
- サーバ/DB/認証認可ランタイム（CI は静的解析・描画・API 読取のみ）。
- PBT（Q10=C・UI 中心）。U5 は決定性テスト（Lint/VRT/収集の固定入出力）で品質担保。
