# U5 CI/CD Automation — Business Logic Model

> 確定: FDQ1-8 全 A。U5 は「各 repo に配線済みのスタブ（呼び出し口）」を**実体化**する Unit。新概念は足さず、Core を共有 CI 正典に据えて Reusable Workflows / Composite Actions / Lint 設定で機械化し、portal ビルドで version+migration を収集する。
> 技術非依存。具体ツール（stylelint/Playwright/GitHub API）は方式の例示で、実体配線は Code Generation。

---

## 0. 全体像 — 4 つの自動化と単一正典

```
                    ┌──────────────────────────────────────────┐
                    │  Core DS repo = 共有 CI 正典 (FDQ1=A)      │
                    │  .github/workflows/_shared-*.yml (再利用)  │
                    │  .github/actions/* (composite)             │
                    │  ci/  (LintRuleSet / VRT runner / 検査)    │
                    └──────────────────────────────────────────┘
                       ▲ uses:@<ref>        ▲ uses:@<ref>
        ┌──────────────┘                    └───────────────┐
   各拡張 repo (pin)                                    portal (rolling)
   ci.yml / migrate-checks.yml                          build.mjs
   ├ CI-1 三層 Lint  ──┐                                 ├ CI-3 version 収集
   └ CI-2 VRT        ──┤                                 │   collect-versions.mjs
                       │                                 │   → version-matrix.json
   register.yml ──────┘                                 ├ (FDQ6) migration 集約
   └ CI-5 registry 検査 (Core 側ゲート)                  └ (U6) showcase 収集
```

- **単一正典の原則（FDQ1=A）**: Lint ルール・VRT runner・検査ロジックの**実体は Core に 1 つ**。各 repo の workflow は `uses:` の**配線のみ**で、ロジックを複製しない（[business-rules](business-rules.md) BR-CI-NODUP）。
- **pin vs rolling**: 拡張 repo は共有 CI を **Core の SemVer タグに pin** して参照。portal は **rolling**（最新追従）。これは ADQ6 / state Decisions の配布方針と一致。

---

## 1. SharedCIAsset の配布モデル（FDQ1=A）

### 1.1 構成要素
| 種別 | 物理 | 役割 |
|---|---|---|
| Reusable Workflow | Core `.github/workflows/_shared-guardrail.yml` | CI-1 三層 Lint を呼び出し可能ジョブ化 |
| Reusable Workflow | Core `.github/workflows/_shared-vrt.yml` | CI-2 VRT（preview スナップ→baseline 比較） |
| Reusable Workflow | Core `.github/workflows/_shared-registry-check.yml` | CI-5 registry PR 検査 |
| Composite Action | Core `.github/actions/three-layer-lint/` | Lint の実行単位（他ワークフローからも合成可） |
| 設定パッケージ | Core `ci/lint/`（LintRuleSet）/`ci/vrt/`（runner）/`ci/registry/`（検査スクリプト） | ロジック本体 |

### 1.2 参照解決フロー
```
拡張 repo ci.yml:
  jobs.guardrail.uses: <org>/FIG-Core-DS/.github/workflows/_shared-guardrail.yml@v1.3.0
                                                                              └ CORE-DS-VERSION に整合 (BR-PIN)
portal ci:
  uses: <org>/FIG-Core-DS/.github/workflows/_shared-vrt.yml@main  ← rolling
```
- **ref 整合規則**: 拡張 repo が参照する `@<ref>` は、その repo の `CORE-DS-VERSION` / submodule pin と一致しなければならない（[business-rules](business-rules.md) BR-CI-PIN）。不一致は Lint 自身が警告。

---

## 2. CI-1 三層ガードレール Lint — 判定アルゴリズム（FDQ2=A / US-4.1）

### 2.1 検出する 3 違反
| 違反 | 定義 | 検出手段 |
|---|---|---|
| V1 生値 | CSS/JSX に生 `#rrggbb` / `Npx`（境界外）直書き | パターン走査（許可リスト除外：0、1px ボーダー等は LintRuleSet で宣言） |
| V2 非経由 | semantic を介さず primitive 値/変数を直書き、または `var(--fig-*)` を介さない値 | 値が `var(--fig-<semantic>-*)` 経由か検査 |
| V3 層逆流 | `components`/製品コードが `primitives.*` を直参照（一方向 primitives←semantic←components に反する） | 三層参照グラフ解析 |

### 2.2 アルゴリズム
```
lint(repo):
  rules ← load(Core ci/lint/LintRuleSet)         # 単一正典
  files ← collect(*.css, *.jsx, *.html in scope) # scope = styles/, src/, extensions/, preview/
  violations ← []
  for f in files:
    for token in parse(f):
      if isRawValue(token) and not allowed(token, rules): violations += V1(f, line, token)
      if usesValue(token) and not viaSemanticVar(token, rules): violations += V2(...)
    for ref in references(f):
      if layerOf(ref.target) is upstream-violating(layerOf(f), rules): violations += V3(...)
  return violations   # LintViolation[]: {file,line,rule,layer,message}
```
- **ゲート規則**: `violations.length > 0` → **ジョブ失敗**（US-4.1 AC1「1 件でも検出で失敗」）。
- **三層グラフ**: `primitives`(L1) ← `semantic`(L2) ← `components`/製品(L3)。L3→L1 直参照、L2→L3 参照などの逆流を NG（[domain-entities](domain-entities.md) LintRuleSet.layerGraph）。

---

## 3. CI-2 VRT — ゲート状態機械（FDQ3=A / FDQ4=A / US-4.2）

### 3.1 baseline と差分（FDQ3=A）
- baseline は**各 repo 内にコミット**（`preview/__baseline__/<screen>.png`）。
- VRT 実行＝preview/*.html を**ヘッドレス描画→スクショ→baseline と画素差分**。
- 差分 `diffRatio > threshold`（LintRuleSet/VRT 設定のしきい値）→ **マージブロック（required check 失敗）**。
- 承認＝**baseline 更新コミット**で意図的差分を明示（差分の説明責任が PR 履歴に残る）。

### 3.2 状態機械
```
[start] → render(changed previews)   # PERF-2: 変更画面に限定
        → compare(snapshot, baseline)
        → diffRatio ≤ threshold ? ─yes→ [PASS] (required check ✅)
                                 └no → [FAIL] + diff artifact + PR コメント (❌ マージ不可)
                                         └ 解消: 修正 or baseline 更新コミット
```

### 3.3 Core 変更で portal を巻き込む連動（FDQ4=A / US-4.2 AC1）
```
Core PR の CI (_shared-vrt を Core 自身が呼ぶ):
  1. checkout portal (U2 build)
  2. vendor 取込: portal が参照する Core を「この PR の Core」に差し替え (rolling 相当)
  3. build portal → preview 描画
  4. VRT(portal previews vs portal baseline)
  5. 差分許容外 → Core PR の required check を失敗（= Core をマージできない）
```
- **意図**: rolling による表示崩れを「**Core をマージする前**」に検出（US-4.2 AC1 そのもの）。事後 nightly では AC 不充足（FDQ4 で B を不採用）。

---

## 4. CI-3 version 自動収集クローラ（FDQ5=A / FDQ6=A / US-4.3）

### 4.1 フロー
```
collect-versions.mjs (portal build の一部):
  registry ← read(Core registry.json)            # 探索対象＝登録済み全製品 (registry 駆動)
  latest   ← Core の最新 SemVer タグ (rolling 基準)
  entries  ← []
  for proj in registry.entries:
    pin ← fetchPin(proj.repo)                     # GitHub API contents: 優先 submodule → CORE-DS-VERSION → package.json
    status ← pin == latest ? "up-to-date"
            : pin が古い      ? "behind"
            : "unknown"
    entries += VersionMatrixEntry{projectId, projectName, coreVersionPinned:pin, coreVersionLatest:latest, status, source}
  write version-matrix.json   # U2 確定 schema 準拠 (portal/schema/version-matrix.schema.json)
```
- **チェックアウト不要**: 各 repo の pin は GitHub API（contents）で取得（FDQ5=A）。ローカル submodule 物理走査（C）は GitHub 最新を取れず status 不正確のため不採用。
- **契約**: 出力は既存 `version-matrix.schema.json`（entries[]＝projectId/projectName/coreVersionPinned/coreVersionLatest/status/source/collectedAt）を**そのまま充足**。build.mjs のスタブ生成を本収集器に差し替える。

### 4.2 移行マニフェスト集約の統合（FDQ6=A / U4 BR-VIS-2 履行）
```
同一クローラ内で追加収集:
  for proj in registry.entries:
    manifest ← fetch(proj.repo / migration/migration-manifest.json)  # 無ければ skip
    if manifest: migrationIndex += {projectId, ...manifest 要約(画面比率/critical/完了/wrapper期限)}
  write migration-index.json → portal 運用ビュー(移行進捗)へ
```
- **単一クローラで version + migration を一括走査**（将来 U6 showcase も同基盤）＝走査の重複排除（[business-rules](business-rules.md) BR-CI-1CRAWL）。projectId で registry と紐付け。

---

## 5. CI-5 registry 登録検査ゲート（FDQ7=A / US-3.2・SEC-2）

### 5.1 検査アルゴリズム（Core 側 `_shared-registry-check.yml`）
```
checkRegistryPR(pr):
  entry ← diff(pr, registry.json)               # 追加/変更エントリ
  checks = [
    C1: validate(entry, registry schema),                       # スキーマ
    C2: entry.category/subcategory ∈ taxonomy.json
        OR pr に taxonomy 追記提案を同梱,                        # taxonomy 整合
    C3: entry.repo == `fig-ext-${category}-${product}`,         # 命名規約
    C4: not duplicate(entry.repo, entry.name, registry),        # 重複
    C5: tagExists(Core, entry.coreVersion),                     # coreVersion 実在
  ]
  if any(checks fail): annotate PR + required check ❌
  else: required check ✅  BUT 自動マージ禁止 → Core Maintainer 承認必須 (SEC-2)
```
- register.yml（U3）の「検査は CI(U5/CI-5)＋Maintainer」委譲先を実体化。
- **全通過でも自動マージしない**（SEC-2）。検査は健全性の機械保証、最終判断は人。

---

## 6. セキュリティ横断ロジック（[business-rules](business-rules.md) と対）
- **SHA pin（SEC-4）**: U5 が同梱/参照する全 Actions は commit SHA で pin（既存テンプレ踏襲）。
- **最小権限**: 各 workflow は `permissions: contents: read` 既定。registry PR の cross-repo 書込のみ最小権限トークン/App。
- **自動マージ禁止（SEC-2）**: registry / Core への変更は必ず人手承認。

---

## 7. エンティティ参照
本モデルが扱う中核エンティティは [domain-entities.md](domain-entities.md) を、判定/ゲートの規則は [business-rules.md](business-rules.md) を、portal 入力契約は [frontend-components.md](frontend-components.md) を参照。
