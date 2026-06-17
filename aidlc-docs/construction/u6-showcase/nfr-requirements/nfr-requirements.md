# U6 Showcase — NFR Requirements

> 確定: FDQ1-7 全A。全体 NFR（WCAG 2.1 AA / Security Baseline / rolling / 三層ガードレール / PBT 無効）＋ U5 CI 基盤 NFR を前提に、U6 固有の収集クローラ＋ショーケースビューの非機能要件を導出。

## SC-Q 収集正確性（Collection Quality）
- **SC-Q-1**: 収集源は `extensions/` ディレクトリ＋`temp-part` ラベル Issue の2系統を**網羅**し、登録済み全製品（registry）を漏れなく走査する（US-5.1 AC1）。
- **SC-Q-2（誤検知排除）**: `extensions/` の非部品（`compat`/`index`/`README`/隠し/ディレクトリ）を除外し、部品のみを項目化（BR-SC-SRC-3）。
- **SC-Q-3（決定性）**: 同一入力（repo 状態）に対し収集結果（id・ソート順）は決定的。`id` は repo×名で安定（BR-SC-ID）、出力は `ownerProjectId→kind→name` で安定ソート。
- **SC-Q-4（昇格判定の正確性）**: `promotedToCore` は Core 正典との同名/同義照合で判定し、照合不能時は `false` 据置（誤検知側に倒さない・BR-SC-PROMOTED/FAILSOFT）。`promotable` は extension/temp-part で既定 true（US-5.2 AC1）。
- **SC-Q-5（帰属正確性）**: `ownerProjectId` は registry を単一正典とし、推測しない（US-5.2 AC1）。

## REL 信頼性・再現性
- **REL-1（fail-soft 据え置き）**: 全体収集失敗でも portal ビルドを止めず、既存 `showcase-index.json` を据え置く（U5 REL-4 継承 / BR-SC-FAILSOFT）。
- **REL-2（部分失敗 skip）**: 個別 repo/項目の API 失敗（404・レート・解析）は該当のみ skip し他を継続（U5 REL-3 継承）。
- **REL-3（再現性）**: 収集は read-only・冪等。再実行で同一結果（外部 repo 状態が不変なら）。

## PERF 性能
- **PERF-1（単一走査）**: version/migration/showcase を**単一クローラの同一走査**で生成し、registry 列挙・API 取得を重複させない（BR-CI-1CRAWL）。
- **PERF-2（並列・レート配慮）**: 製品単位で並列収集（Promise.all）。GitHub API はトークン併用でレート緩和、失敗時 fail-soft。
- **PERF-3（ビュー描画）**: ショーケースビューは静的データ描画で初回・遷移とも即時（U2 PERF 継承・LH≧90 を損なわない）。

## SEC セキュリティ（Security Baseline 適用サブセット）
- **SEC-1（最小権限・read-only）**: 収集に使うトークンは **contents:read / issues:read のみ**（書込権限不要）。register/promotion の書込とは分離。
- **SEC-2（収集データの無害化）**: 収集した name/owner/Issue タイトル等の外部由来文字列はビュー描画時に**必ずエスケープ**（既存 `esc()` 踏襲）。XSS 防止。
- **SEC-3（外部参照の制限）**: `screenshotUrl`/`previewPath` は表示時に sandbox/SRI/CSP（U2 継承）配下。任意外部 URL を無検証で埋め込まない。
- **SEC-4（SCA）**: 依存追加は最小（理想ゼロ・既存 fetch/標準ライブラリ）。追加時は SCA 対象。

## MAINT 保守性
- **MAINT-1（単一クローラ）**: `collect-versions.mjs` 基盤を拡張し二重実装しない（BR-CI-1CRAWL / U5 BR-CI-NODUP 継承）。
- **MAINT-2（契約不変）**: `showcase-index.schema.json` を変更せず充足（BR-SC-CONTRACT）。ビューの入力契約安定。
- **MAINT-3（規約ベース収集）**: 収集は `extensions/`・ラベル規約に依存し、各 repo に専用マニフェストを強制しない（BR-SC-SRC・改修不要）。
- **MAINT-4（所有境界）**: 収集・ビュー・契約は portal 配下に集約（BR-SC-PLACEMENT）。

## OBS 可観測性
- **OBS-1**: 収集ログに「製品数・収集件数（extension/temp-part 別）・skip 件数」を出力（U5 collect ログ踏襲）。
- **OBS-2（空状態の区別）**: ビューは「未収集（クローリング未実行/無効）」と「収集済み0件」を文言で区別（BR-SC-EMPTY）。運用者が原因を取り違えない。

## A11Y アクセシビリティ
- **A11Y-1**: ショーケースビューは **WCAG 2.1 AA**（Q8=A）。カードの見出し階層・バッジのテキスト等価・導線リンクの可読ラベル・キーボード操作・コントラスト。
- **A11Y-2（空状態の説明性）**: 空状態は原因と次アクション（使い方リンク）をテキストで提示。

## トレーサビリティ
| NFR | Story/規則 |
|---|---|
| SC-Q-1/5 | US-5.1 AC1 / US-5.2 AC1 |
| SC-Q-4 | US-5.2 / BR-SC-PROMOTED |
| REL-1/2 | BR-SC-FAILSOFT（U5 REL-3/4） |
| PERF-1 | BR-CI-1CRAWL |
| SEC-1/2 | Security Baseline / BR-SC-* |
| MAINT-1/2 | BR-CI-1CRAWL / BR-SC-CONTRACT |
| OBS-2 | BR-SC-EMPTY |
| A11Y-1 | Q8=A |
