# Functional Design Plan — U2-4/U2-5 ポータル IA・操作完結（統合）

> 対象 Unit: **U2-4（ポータル IA）＋ U2-5（操作完結）統合**（PQ1=A）。repo: `aidlc-workflows/portal/`（vanilla JS SPA）。
> component: C-PortalIA（＋C-Record 横断）。
> ストーリー: US-P1（役割別入口）/ US-P2（シナリオA 既存★最優先）/ US-P3（シナリオ② 新規）/
> US-P4（getting-started 責務分離）/ US-P5（オンボ・ランディング）/ US-P6（未整備閲覧「余白」）/
> US-P7（主要4操作のポータル完結・セルフ）/ US-X3（GitHub 操作案内）。
> AC: AC②-1（主要4操作ポータル完結）/ AC②-2（セルフ検証）/ AC②-3（LLocana 実例導線）/ FR2-9〜15。
> 前提: 本文（Developer ガイド等）の正典は **Core 側 `assets/js/portal-content.js` の `developer/*` PAGES**。
> ポータルは rolling 取込し、**IA（並び・ラベル・入口導線・新ビュー）に集中**（§4-4／AD3=A）。

## 回答確定（2026-06-22）

- **PQ1=A（進め方）**: U2-4＋U2-5 を**統合1ループ**で実行（US-P1〜P7＋US-X3 を単一 FD）。両者ポータル
  repo・密結合 IA のため一貫性とゲート削減を優先。
- **PQ2=A（入口/ランディング）**: **新 Home ルートを `DEFAULT_ROUTE` 化**。役割別入口カード（開発者/
  利用者/管理者）＋「はじめに読む順番」を提示。Vision は1クリック先へ（US-P1/P5）。
- **PQ3=A（シナリオ）**: 2シナリオを**「使い方」配下の「シナリオ別ガイド」ページ**に。既存テンプレ
  （目的→前提→手順→確認）で getting-started→次の一歩→参照 を順序立て。シナリオA（既存）を★最優先表示。
- **PQ4=A（余白）**: **未整備可視化ビュー**＝Core カタログに「未整備（preview 未収録）」を一覧/バッジで
  可視化。22 件 preview 自体は作らず（本サイクル スコープ外を尊重）どの部品が未整備かを俯瞰可能に（US-P6）。
- **US-P4（getting-started 責務分離）= ポータル IA のみ（§4-4）**: 本文 Core rolling のまま、nav の
  並び/ラベル/相互リンクと Home/シナリオ導線で「導入（getting-started）」と「運用（昇格/版管理/配布）」を
  分離・誘導。Core 本文の組み替え自体は本ユニット スコープ外（将来 Core repo 側）。
- **US-P7（主要4操作完結）/ US-X3（GitHub 案内）**: 4操作＝新製品セットアップ／移行／Core 昇格提案／
  バージョン参照。各操作の使い方ガイドを網羅＋GitHub 操作案内ガイド（ツール非依存）を追加し、
  入口（Home/シナリオ）から完結到達できるようにする。

## 現状（実測・portal/src）

- **ランディング無し**: `router.js DEFAULT_ROUTE = '#/overview/principles/vision'`（いきなり Vision）。
  ブランドロゴも DEFAULT_ROUTE を指す（`portal.js`）。役割別入口・オンボは未実装。
- **SECTIONS（content.js）**: 概要 / プロジェクト集 / 運用 / 使い方 / Developer の5区分。`KINDS`（router.js）
  = overview/projects/ops/usage/developer。view dispatch は `portal.js renderView()`。
- **使い方（usage.js GUIDES）**: portal-basics / view-modes / core-version / promotion / temp-part /
  feedback の6本。**新製品セットアップ・移行・GitHub 操作案内・シナリオ別ガイドは未収録**。
- **未整備可視化**: 個別ページでは preview 未収録時に「プレビュー未収録」を表示するが、**横断で「どの部品が
  未整備か」を俯瞰する余白ビューは無い**（build.mjs が実体なき preview 参照を prune）。
- **運用（OPS）**: versions / showcase / promotion / governance。バージョン参照・昇格提案の本体はここ＆使い方。

## 生成する成果物（Part 2）

- [x] `construction/u2-4-5-portal-ia-ops/functional-design/business-logic-model.md`（Home/シナリオ/余白/操作完結の振る舞い）
- [x] `construction/u2-4-5-portal-ia-ops/functional-design/business-rules.md`（BR-PIA-*：入口/シナリオ/余白/操作完結/IA分離/記録）
- [x] `construction/u2-4-5-portal-ia-ops/functional-design/frontend-components.md`（影響ファイルと新ビュー・ルート）

---

## 質問（Part 1）— 回答済み

## Question PQ1 — U2-4/U2-5 の進め方
A) **統合1ループ（推奨）** / B) 逐次2ループ → **[Answer]: A**

## Question PQ2 — 役割別入口とランディング
A) **新 Home ルートを DEFAULT_ROUTE 化（推奨）** / B) 概要トップにヒーロー / C) 概要に「はじめに」節 → **[Answer]: A**

## Question PQ3 — 2シナリオ別フローの置き場所
A) **使い方にガイド化（推奨）** / B) 新トップ区分「シナリオ」 / C) ランディングのカードのみ → **[Answer]: A**

## Question PQ4 — 未整備コンポ閲覧「余白」
A) **未整備可視化ビュー（推奨）** / B) 文言追記のみ / C) 今回省略 → **[Answer]: A**
