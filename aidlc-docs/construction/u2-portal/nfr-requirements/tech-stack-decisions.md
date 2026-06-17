# U2 Portal — Tech Stack Decisions

> 確定回答: NRQ1-9 = すべて A。U2 Portal（repo: `aidlc-workflows`）の技術選定と根拠。
> 上位前提: vanilla JS SPA（ADQ1=A）、ハッシュルーティング、iframe デモ（ADQ2=A）、ビルド時 rolling 取込（FDQ5=A）、GitHub Pages（US-2.6）。

## TSD-1. UI 実装: vanilla JS SPA（既存踏襲）
- **決定**: フレームワーク非導入。既存 `portal.js`/`portal-content.js`/`portal.css` を `aidlc-workflows` へ移設（FDQ1=A）して拡張。
- **根拠**: ADQ1=A の踏襲。保守最小・依存最小（NRQ1=A）。Core が CSS クラス方式（NRQ2 U1=A）でフレームワーク非依存のため、ポータルも非依存が自然。
- **却下**: React/Vue 等の導入（既存資産の作り替えコスト・依存増）。

## TSD-2. ルーティング: ハッシュルーター（自前・軽量）
- **決定**: `#/...` ハッシュルーティング（既存方式）。サーバ rewrite 不要で GitHub Pages と相性良。
- **根拠**: 静的ホスティング（AVAIL-1）でディープリンク/リロードが安定。SPA 遷移は即時（PERF-2）。

## TSD-3. ビルド: 軽量 Node スクリプト（最小依存）
- **決定**: バンドラ/フレームワークを増やさず、Node スクリプトで「Core 取込 → データ検証 → スタブ生成 → バンドル → Pages 出力」を実装（NRQ1=A）。
- **根拠**: rolling 自動化（BUILD-4）に必要十分。重量バンドラ（Vite 等）は HMR の利得より依存増の負債が勝る。
- **却下**: ノービルド（rolling/検証の自動化と相反）／本格バンドラ（過剰）。

## TSD-4. Core 取込元: ローカル Core 参照（core ブランチ/タグ）
- **決定**: 同一ワークスペースの Core（`FIG-Core-DS` の core ブランチ/最新タグ）をローカル参照して取込。CI では Core を checkout/submodule で供給（NRQ2=A）。
- **根拠**: 現行のモノレポ的ワークスペースに整合。オフラインビルド可（BUILD-5）。pin しない（rolling, BR-ROLL-1）。
- **却下**: 公開 URL fetch（ネット依存）／npm パッケージ（Core のパッケージ公開は U1 範囲外）。

## TSD-5. ホスティング: GitHub Pages 一本化
- **決定**: 静的成果物を GitHub Pages へデプロイ（US-2.6, NRQ5=A）。
- **根拠**: 社内 URL 共有・運用簡素。実行時バックエンド無し（AVAIL-2）。
- **デプロイ機構の詳細**（Actions ワークフロー等）は infrastructure-design で確定。

## TSD-6. デモ埋め込み: sandbox 化 iframe
- **決定**: Project View のデモは `sandbox`＋`referrerpolicy` 付き iframe（ADQ2=A, SEC-2）。profile/coreVersion を query 伝播（BR-VIEW-2）。
- **根拠**: 製品デモを安全に集約。拡張未整備時は Core preview を暫定ソース（FDQ4=A）。

## TSD-7. データ契約: JSON ＋ JSON Schema
- **決定**: `registry.json`/`taxonomy.json`（Core 由来・読取専用）に加え、U2 が `version-matrix.json`/`showcase-index.json` の **JSON Schema を新規定義**し、ビルド時検証（NRQ9=A, FDQ6=A）。
- **根拠**: U5(CI-3)/U6(CI-4) への機械検証可能な契約。スタブ→自動収集の差替えが安全。

## TSD-8. 外部依存: 自己ホスト＋SRI
- **決定**: 現行 CDN 参照（Prism.js 等）を**ローカルにベンダリング（自己ホスト）＋SRI**（NRQ7=A, SEC-3）。
- **根拠**: 可用性（CDN 障害の影響排除）・オフラインビルド・サプライチェーン安全性。
- **却下**: CDN 参照継続（実行時の第三者依存・可用性リスク）。

## TSD-9. セキュリティ: 静的サイト向け Baseline サブセット
- **決定**: SCA（依存監査）・iframe sandbox・SRI・CSP(best-effort)・localStorage/URL の機密非保持を enforce。サーバ系項目は N/A 明記（NRQ6=A）。
- **根拠**: 認証なし・読取専用の静的サイトに比例した適用。詳細は nfr-requirements §4。

## TSD-10. テスト/品質: スキーマ検証＋ユニット＋VRT＋ビルド検証
- **決定**: JSON Schema 検証・ルーティング/buildNav ユニットテスト・ビルド時バリデーション（孤児/必須キー）・VRT（U5 連動）（NRQ8=A）。PBT 無効（Q10=C）。
- **根拠**: UI 中心・静的サイトに適した品質ゲート。決定的レンダリングで VRT を成立させる。

## TSD-11. ブラウザ対象: モダン・エバーグリーン
- **決定**: Chrome/Edge/Safari/Firefox 最新（NRQ4=A）。レガシー非対象。
- **根拠**: Core(NRQ3=A) と整合。トランスパイル/ポリフィル負債を回避。

---

## 依存サマリ（増やす依存の最小化方針）
| 種別 | 採用 | 備考 |
|---|---|---|
| UI フレームワーク | なし（vanilla JS） | TSD-1 |
| バンドラ | 軽量 Node スクリプト | TSD-3 |
| スキーマ検証 | JSON Schema バリデータ（ビルド時のみ・devDependency） | TSD-7 |
| シンタックスハイライト | Prism.js（自己ホスト＋SRI） | TSD-8 |
| テスト | 軽量テストランナー（devDependency） | TSD-10 |
| ホスティング | GitHub Pages（外部依存ゼロの静的配信） | TSD-5 |
> 実行時の第三者ランタイム依存は持たない（必須経路はすべて自己ホスト/静的）。
