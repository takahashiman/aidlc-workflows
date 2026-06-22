# Application Design — Components（イニシアチブ#2）

> 高レベルの component 識別・責務・インターフェース（詳細ロジックは各 Unit の Functional Design）。
> 確定: AD1=A（専用ブリッジ1枚）/ AD2=C（Issue导线＋preview/spec PR）/ AD3=A（本文Core・IAはportal）/
> AD4=A（Pencil=設計参照）/ AD5=A（Core の signature/Taste ユーティリティ化・LLocana 初適用）/ AD5-2=B（status 色も生成メソッド化・a11y 必須）。

## C-Palette — seed 駆動パレット生成メソッド（Core / FIG-UDS）★中核・新規
- **所在**: FIG-UDS Core（signature/Taste ユーティリティ＋法則ドキュメント）。全アプリ共通資産。
- **責務**:
  - seed（アプリのメインカラー）から **signature パレット**（base/light/dark/tint/shadow/on-color/任意 tonal ramp）を **OKLCH** で生成。
  - **status パレット**（success/warning/danger ＝ AD5-2=B）も生成法則化（seed 調和 or 規定 hue）。**WCAG AA コントラスト検証を必須**。
  - 生成結果を signature/status プリミティブ（`--signature-*` / `--status-*`）として出力 → semantic 層が参照。
- **インターフェース**: `generateSignaturePalette(seed, opts)` / `generateStatusPalette(opts)` / `validateA11y(fg, bg)` / `emitTokens(palette)`。
- **適用**: signature 機構を「seed 差替で派生一式を再生成」へパラメトリック化。LLocana seed=`#2C6B5E` が初適用＝**Taste 派生**の第1例。

## C-Signature — signature 注入（BusDelayAlerts ⇄ Core）
- **責務**: LLocana のメインカラー `#2C6B5E` を C-Palette に渡し、生成 signature/status トークンを製品へ適用（旧 DS の手動派生 teal-* を置換）。
- **インターフェース**: `injectSignature(seed)` → 製品の signature トークンセット。
- **依存**: C-Palette（Core）。

## C-Distrib — 配布（BusDelayAlerts）
- **責務**: Core DS を submodule で pin（＋`CORE-DS-VERSION`）し、Core CSS（primitives/semantic/tokens）を Vite で import。`vite build` 非回帰を保証。
- **インターフェース**: `addCoreSubmodule(repo, ref)` / `pinVersion(tag)` / `importCoreCss(entry)` / `verifyViteBuild()`。
- **確定**: submodule×Vite を標準化（Q5=A）。

## C-Bridge — @theme トークンブリッジ層（BusDelayAlerts）
- **所在**: 製品内 **専用ブリッジ CSS 1枚**（例 `src/styles/figuds-bridge.css`・AD1=A）。
- **責務**: Core semantic（`--color-*` 等）→ アプリ Tailwind `@theme`/CSS 変数 への**静的対応づけ**。既存 shadcn/Radix 構造を壊さず Core 色で描画（Q3 既存=A）。
- **インターフェース**: 宣言的 CSS（ランタイムメソッドなし）。`@theme` 変数 = `var(--fig-color-...)` の対応表。
- **依存**: C-Distrib（Core CSS）/ C-Signature（signature トークン）。

## C-PortalIA — ポータル IA ビュー群（aidlc-workflows portal ＋ Core content）
- **責務（AD3=A）**: 本文の正典は Core 側（`portal-content.js` の developer PAGES）。ポータルは **IA（並び・ラベル・入口導線・新ビュー）**に絞る。
  - 役割別入口（開発者/利用者/管理者）・2シナリオ別フロー（A 既存/② 新規）・getting-started 責務分離（IA 側）・オンボーディング・未整備閲覧「余白」・GitHub 操作案内。
- **インターフェース**: `renderRoleEntry()` / `renderScenarioFlow(scenario)` / `renderOnboarding()` / `renderBrowseMargin()` / `renderGithubGuide()`。
- **依存**: Core content（rolling 取込）。

## C-Promo — Core 昇格パイプライン（製品 ⇄ FIG-UDS Core）
- **責務（AD2=C / S4=B）**: ドメインパターン（arrival-card/delay-banner 等）を抽出→**FIG-UDS Live Preview 形式**（`preview/*.html`＋`components/*.spec.md`）化→**Issue（temp-part/core-promotion）で提案导线＋PR で実体**→マージ→昇格確認。
- **インターフェース**: `extractPattern(name)` / `toLivePreview(artifact)` / `openPromotionIssue(label)` / `openPromotionPR()` / `confirmPromotion()`。
- **依存**: Core（昇格先）・C-Bridge/C-Signature（整形済みスタイル）。

## C-UXFlow — UX 改修フロー（BusDelayAlerts / Pencil）
- **責務（AD4=A / S3=C）**: 主要画面の画面遷移/UX を **Pencil（.pen）で表現→確認→実装へ反映**。Pencil 成果は**設計参照**（実装正典はコード）。既存機能の非回帰。
- **インターフェース**: `captureScreenFlow(screens)` / `reviewFlow()` / `reflectToCode()`。

## C-Record — 記録（aidlc-workflows）
- **責務**: dev-flow-journal / session-log を継続更新し、ポータル素材化（FR-4.10 循環）。
- **インターフェース**: `appendJournalStep(step)` / `appendSessionLog(entry)` / `harvestForPortal()`。
