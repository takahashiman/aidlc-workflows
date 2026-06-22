# NFR Requirements Plan — U2-4/U2-5 ポータル IA・操作完結（Part 1）

> 対象: U2-4/U2-5 統合（ポータル IA・操作完結）。repo: `aidlc-workflows/portal/`。
> 前提継承: 初代ポータル(U2)の NFR 姿勢＝軽量 Node ビルド／Pages 一本化／初回 ≤2.5s・遷移即時・LH≧90／
> WCAG 2.1 AA／Security Baseline 静的サブセット（iframe sandbox・SRI・CSP・機密非保持・サーバ系 N/A）／
> 契約 JSON Schema＋VRT／node test（現状 16+ 本・純粋関数）。

## カテゴリ別 該当性（事前判定）
- **Reliability ◎**: 新 Home/余白/ガイドの空状態・フォールバック（coreContent 未取込時の余白、registry 0 件等）。
- **Maintainability ◎**: 新 render/route/GUIDES は純粋関数・テスト追加。**AC②-2 セルフ検証＝4操作リンク到達テスト**が論点。
- **A11y ○**: 役割カード/シナリオ導線のキーボード操作・フォーカス可視・ランドマーク/見出し階層・AA。
- **Performance △**: Home は静的・軽量。新依存なし。予算は既存姿勢継承（厳密予算なし・監視）。
- **Security △**: 新サーバ無し・新外部呼び出し無し。リンク/カードのみ。機密非保持（権利者操作は載せない・§4-2）。
- **Scalability / Availability N/A**: 静的 SPA・Pages。

## 回答確定（2026-06-22）
- **NQ1=B（検証）**: **既存 node テスト拡張＋セルフ検証結線テスト**に加え、**Playwright をポータルに新設して
  Home/ランディングの VRT を導入**（充実系）。構造・4操作リンク到達（AC②-2）は node 純関数テストで、
  見た目回帰は VRT で担保。U2-3（製品側）に続きポータルにも VRT 基盤を新設。
- **NQ2=B（a11y）**: **CI に自動 a11y 検査を新規導入**＝Playwright＋axe（`@axe-core/playwright`）で
  実ブラウザ検査。NQ1=B の Playwright を共有し一体運用。手動チェックリストは補助に降格。
- **NQ3=A（性能）**: **厳密予算なし・既存姿勢継承**。新依存（Playwright/axe）は devDependencies＝
  配布バンドルに非影響。初回 ≤2.5s/LH≧90 を維持し監視のみ。

## 生成する成果物（Part 2）
- [x] `construction/u2-4-5-portal-ia-ops/nfr-requirements/nfr-requirements.md`
- [x] `construction/u2-4-5-portal-ia-ops/nfr-requirements/tech-stack-decisions.md`

---

## 質問（Part 1）

## Question NQ1 — 検証方法（特に AC②-2 セルフ検証）
新 IA（Home/シナリオ/余白/4操作ガイド）と「4操作ポータル完結」をどう検証しますか？

A) **既存 node テスト拡張＋セルフ検証結線テスト** — 既存 16+ 本の純粋関数テスト基盤を拡張し、
   ① parseRoute('#/home')・GUIDES 5新規 key・renderHome/renderBrowseMargin の描画、② **4操作それぞれが
   Home/シナリオ→該当ガイド→確認 までポータル内リンクで到達できる結線テスト**（AC②-2）を追加。ゼロ SaaS・CI 既存。

B) **A＋Home/ランディングの VRT 追加** — 見た目の回帰も固定（Playwright）。コスト増。

C) **build＋手動セルフレビューのみ** — チェックリスト目視。回帰検出弱い。

[Answer]: **B**（A の結線テストは内包・Playwright を新設し VRT も導入）

## Question NQ2 — A11y 検証の強度
新 Home の役割カード・シナリオ導線等の WCAG 2.1 AA をどう担保しますか？

A) **AA 継承＋手動チェックリスト** — キーボード操作/フォーカス可視/ランドマーク・見出し階層/コントラストを
   既存方針どおり満たし、セルフレビュー チェックリストで確認（初代ポータルと同姿勢）。

B) **CI に自動 a11y 検査（axe 等）を新規導入** — 客観性は上がるが依存・実行環境を新設。

[Answer]: **B**（Playwright＋`@axe-core/playwright` の実ブラウザ検査・NQ1=B と Playwright 共有。手動 CL は補助）

## Question NQ3 — 性能予算
Home 追加等の性能をどう扱いますか？

A) **厳密予算なし・既存姿勢継承（推奨）** — 新依存ゼロ・静的描画。初回 ≤2.5s/LH≧90 の既存目標を維持し監視のみ。

B) **明示予算を再設定** — Home 専用の数値予算を設ける。過剰。

[Answer]: **A**（新依存は devDependencies＝配布非影響・既存目標維持）
