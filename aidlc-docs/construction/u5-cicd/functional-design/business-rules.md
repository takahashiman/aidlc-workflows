# U5 CI/CD Automation — Business Rules

> 確定: FDQ1-8 全 A。U5 の規則は「共有 CI 正典の単一性」「三層 Lint ゲート」「VRT マージ条件」「収集の単一クローラ」「registry 検査ゲート」「セキュリティ横断」の 6 群。
> ロジックは [business-logic-model.md](business-logic-model.md)、エンティティは [domain-entities.md](domain-entities.md) 参照。

---

## A. 共有 CI 正典・配布（CI-NODUP / FDQ1）

### BR-CI-NODUP-1（二重実装の禁止）
Lint ルール・VRT runner・registry 検査の**ロジック実体は Core DS repo に 1 つだけ**置く。各拡張 repo / portal の workflow は `uses:` による**配線のみ**を持ち、ロジックを複製・再記述してはならない。
- **根拠**: 既存テンプレ（ci.yml/migrate-checks.yml）が「実体は U5 共有設定を参照／テンプレは配線・二重実装しない」と明記。ドリフト防止。

### BR-CI-NODUP-2（配置の所有境界）
共有 CI 正典＝Core repo の `.github/workflows/_shared-*.yml`・`.github/actions/`・`ci/`。version/migration 収集クローラ＝portal の `scripts/`（portal ビルドの一部）。registry 検査＝Core 側。U5 は各 Unit の所有境界を侵さず、スタブを「配線済みの呼び出し口」として活かす（FDQ8）。

### BR-CI-PIN-1（参照 ref と pin の整合）
拡張 repo が共有 CI を参照する `uses: ...@<ref>` の `<ref>` は、その repo の `CORE-DS-VERSION` / submodule pin と**一致**しなければならない。portal のみ `@main`（rolling）を許す。不一致は CI-1 が `::warning::` を出す。
- **根拠**: 拡張＝pin / portal＝rolling（state Decisions・ADQ6）。CI のバージョンと Core 実体のバージョンの乖離を防ぐ。

---

## B. 三層ガードレール Lint ゲート（CI-Lint / FDQ2・US-4.1）

### BR-CI-LINT-1（単一ルールセット）
三層 Lint のルールは Core の `ci/lint/LintRuleSet` を**唯一の正典**とする。CSS は stylelint カスタムプラグイン、JSX/HTML は静的スキャナが**同一ルールセット**を参照する。

### BR-CI-LINT-2（検出 3 種）
以下を違反として検出する：
- **V1 生値**: 許可リスト外の生 `#hex` / `px` 直書き（CSS・JSX・HTML）。
- **V2 非経由**: `var(--fig-<semantic>-*)` を介さない値、または semantic を飛ばした primitive 直参照。
- **V3 層逆流**: 一方向 `primitives ← semantic ← components/製品` に反する参照（例：components が primitives を直参照）。

### BR-CI-LINT-3（ゼロ違反ゲート）
`LintViolation` が **1 件でも**あれば当該ジョブは**失敗**する（US-4.1 AC1）。警告降格は許さない。

### BR-CI-LINT-4（許可リストの明示宣言）
例外（0、`1px` ボーダー、`100%` 等）は LintRuleSet 内に**明示宣言**したものだけを許可。暗黙の取りこぼしを作らない。

---

## C. VRT マージ条件（CI-VRT / FDQ3・FDQ4・US-4.2）

### BR-CI-VRT-1（必須チェック）
VRT は **required check**。`diffRatio > threshold` の画面が 1 つでもあれば **PR をマージできない**（US-4.2 AC1）。

### BR-CI-VRT-2（baseline は repo 内・更新は明示コミット）
baseline は各 repo `preview/__baseline__/` にコミットして管理する。意図的な見た目変更は **baseline 更新コミット**で承認を明示する（差分の説明責任を PR 履歴に残す）。

### BR-CI-VRT-3（Core 変更は portal を巻き込む）
Core 変更 PR の VRT は、**この PR の Core を rolling 取込した portal の preview** を対象に実行し、差分許容外なら **Core PR の required check を失敗**させる。事後（マージ後 nightly のみ）検出は AC1 不充足のため不可。

### BR-CI-VRT-4（差分対象の限定）
VRT は**変更された画面に限定**して実行する（PERF-2）。全画面総当たりは既定としない。

---

## D. 収集の単一クローラ（CI-CRAWL / FDQ5・FDQ6・US-4.3）

### BR-CI-1CRAWL-1（単一クローラ・単一走査）
version 収集・migration マニフェスト集約（将来 U6 showcase）は**単一クローラ（portal `collect-versions.mjs`）の同一走査**で行い、repo ごとの重複アクセスを作らない。

### BR-CI-CRAWL-2（registry 駆動の探索）
収集対象は **Core `registry.json` に登録された製品**を正典とする。registry に無い repo は収集対象外（登録＝可視化の前提＝CI-5 ゲートと一貫）。

### BR-CI-CRAWL-3（pin の取得優先順位とソース記録）
各製品の参照 Core 版は `submodule` → `CORE-DS-VERSION` → `package.json` の優先順で取得し、採用ソースを `source` に記録する。取得は GitHub API（contents）で行い、チェックアウトに依存しない。

### BR-CI-CRAWL-4（契約準拠）
収集出力は U2 確定スキーマ（`version-matrix.schema.json` / 移行は portal 運用ビュー入力）に準拠する。`status` は pinned vs latest(rolling 基準) で算出し、不明は `unknown`。

### BR-CI-CRAWL-5（fail-soft 収集）
個別 repo の取得失敗は**当該エントリを `unknown`/skip** とし、収集全体は止めない（portal ビルドを fail-fast にしない＝版ダッシュボードの可用性優先）。

---

## E. registry 登録検査ゲート（CI-REG / FDQ7・US-3.2・SEC-2）

### BR-CI-REG-1（5 検査）
Core `registry.json` への PR は ①スキーマ ②taxonomy 整合（実在 or 追記提案同梱）③命名 `fig-ext-<category>-<product>` ④重複（repo/name）⑤coreVersion 実在（タグ存在）を検査する。1 つでも失敗で required check ❌、PR に注記。

### BR-CI-REG-2（自動マージ禁止）
検査全通過でも **registry / Core への変更は自動マージしない**。Core Maintainer の承認を必須とする（SEC-2）。

### BR-CI-REG-3（taxonomy 追記の同梱許容）
未存在カテゴリの登録は、同 PR に `taxonomy.json` 追記提案を含めれば C2 を満たす（Maintainer がガバナンス承認）。

---

## F. セキュリティ横断（SEC / 全 CI 共通）

### BR-CI-SEC-1（Actions SHA pin）
U5 が同梱・参照する**全 Action は commit SHA で pin**する（SEC-4）。タグ/ブランチ参照のみは不可。

### BR-CI-SEC-2（最小権限）
各 workflow の `permissions` は既定 `contents: read`。registry の cross-repo 書込のみ最小権限トークン/GitHub App に限定する。

### BR-CI-SEC-3（fork PR で秘密を出さない）
fork からの PR では secrets を要する job（registry PR 起票等）を実行しない。Lint/VRT は secrets 不要で動く構成とする。

---

## トレーサビリティ
| 規則群 | Story / 出典 | CI |
|---|---|---|
| A 共有正典 | state Decisions(CI/CD クラスタ)・テンプレ「二重実装しない」 | 全 |
| B 三層 Lint | US-4.1 AC1 | CI-1 |
| C VRT | US-4.2 AC1・PERF-2 | CI-2 |
| D 収集 | US-4.3 AC1・ADQ(自動収集)・U4 BR-VIS-2 | CI-3 |
| E registry 検査 | US-3.2・SEC-2 | CI-5 |
| F セキュリティ | SEC-2/SEC-4・Security Baseline | 全 |
