# Application Design Plan — イニシアチブ#2（Part 1: Planning）

> 目的＝**高レベルの component/service 識別と境界・I/F・repo 跨ぎ依存の設計**（詳細ロジックは各 Unit の Functional Design）。
> 入力: initiative2-requirements / initiative2-stories / busdelayalerts-delta-analysis。
> 下部の質問に `[Answer]:` で回答後、Part 2（成果物生成）へ。推奨案に **(推奨)**。要件で確定済の論点は再質問しません。

## 設計対象（#2 の主要コンポーネント・暫定）
- **C-Bridge**: @theme トークンブリッジ層（BusDelayAlerts 内・Core semantic → Tailwind `@theme`/CSS 変数の対応）。
- **C-Signature**: signature 注入（ブランド `#2C6B5E` を Core 再テーマ機構へ）。
- **C-Distrib**: 配布（Core submodule pin＋CORE-DS-VERSION＋Core CSS import の Vite 結線）。
- **C-PortalIA**: ポータル IA ビュー群（役割別入口・2シナリオ別フロー・getting-started 責務分離・オンボ・閲覧余白・GitHub 操作案内）。
- **C-Promo**: Core 昇格パイプライン（ドメインパターン抽出→FIG-UDS Live Preview 形式化→提案→マージ→昇格確認）。
- **C-UXFlow**: UX 改修フロー（VSCode×Pencil で画面遷移/UX を扱う）。
- **C-Record**: 記録（dev-flow-journal / session-log のポータル素材化）。

## 実行チェックリスト（Part 2 で消化）
- [x] `application-design/initiative2-components.md`（C-Palette/Signature/Distrib/Bridge/PortalIA/Promo/UXFlow/Record）
- [x] `application-design/initiative2-component-methods.md`（generateSignature/StatusPalette・validateA11y 等）
- [x] `application-design/initiative2-services.md`（S-Distribution/Promotion/PortalDelivery/UXRefine/Collection）
- [x] `application-design/initiative2-component-dependency.md`（repo 跨ぎ依存・データフロー・Critical Path）
- [x] `application-design/initiative2-application-design.md`（統合版・トレーサビリティ）

## 回答確定（AD1-AD5）
- **AD1=A**（専用ブリッジ CSS 1枚）/ **AD2=C**（Issue导线＋preview/spec PR）/ **AD3=A**（本文Core・IAはportal）/
  **AD4=A**（Pencil=設計参照）/ **AD5=A**（C-Palette を Core の signature/Taste ユーティリティ化・LLocana 初適用）/
  **AD5-2=B**（status 色も生成メソッド化・**a11y 検証必須**）。

---

## 質問（Part 1）

## Question AD1 — @theme トークンブリッジ層（C-Bridge）の置き場・形
Core semantic トークンを Tailwind v4 へ橋渡しする実体をどこに置きますか？

A) **専用ブリッジ CSS 1枚（例 `src/styles/figuds-bridge.css`）に集約 (推奨)** — Core semantic（`--color-*` 等）を読み、アプリの `theme.css`/`@theme` 変数へ対応づける単一ファイル。差分が一望でき before↔after が明確。

B) **既存 `theme.css` を直接書き換え** — 別ファイルを作らず現行トークン定義を Core 参照へ置換。ファイルは増えないが before/after が混ざる。

C) **トークン対応表（マッピング定義）＋生成スクリプト** — 対応表から CSS を生成。再現性は高いが仕組みが重い。

X) Other (please describe after [Answer]: tag below)

[Answer]: 判断できません。現状はAかCのどちらかを予想。

## Question AD2 — Core 昇格パイプライン（C-Promo）の成果物形式
ドメインパターン（arrival-card 等）を Core へ昇格する際、提案物の形式は？（画像03②「即時 Live Preview に使える形式」）

A) **Core の preview/spec 規約に合わせた成果物（`preview/*.html`＋`components/*.spec.md`）として提案 (推奨)** — FIG-UDS の既存規約に乗せ、マージ後すぐ Live Preview 化。前サイクルの昇格フローと一貫。

B) **まず Issue（temp-part/core-promotion ラベル）で提案し、形式整備は Maintainer 伴走** — 低ハードル提案優先。形式は後段で整える。

C) **A＋B（Issue 起票で導線・本体は preview/spec で PR）** — 提案導線（Issue）と実体（PR）を両建て。

X) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question AD3 — ポータル IA（C-PortalIA）の実装レイヤ
§4-4 の IA は、正典が Core 側（`portal-content.js` の developer PAGES）です。#2 の IA はどこで実装しますか？

A) **本文は Core 側、ポータルは IA（並び・ラベル・入口導線・新ビュー）に絞る (推奨)** — future-work-portal §4-4 の方針どおり。役割別入口/シナリオ導線/閲覧余白はポータル、ガイド本文の責務分離は Core 側。

B) **ポータル側に新規ページ実体も持たせる** — Core を待たずポータルで完結（rolling 設計から外れる懸念）。

C) **実装時に項目ごとに判断** — 入口導線はポータル、本文改訂は Core、と都度仕分け。

X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question AD4 — UX 改修フロー（C-UXFlow）と Pencil の関わり
VSCode×Pencil による UX 改修（画面遷移図等）を、#2 の設計上どう位置づけますか？

A) **「画面遷移/UX を Pencil で表現→確認→実装へ反映」の手順をフロー化し、成果物は設計参照として残す (推奨)** — Pencil 成果（.pen/書き出し）は設計の参照物。実装は既存コードへ。

B) **Pencil を実装の正典にする** — 画面定義を Pencil 側に正典化し、コードはそれに追従。

C) **本サイクルは最小（主要1〜2画面のみ Pencil 化）** — 範囲を絞って実証。

X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question AD5 — signature 注入（C-Signature）の境界
ブランド `#2C6B5E` の注入と、アプリ固有カラー（signature 以外）の扱いの境界は？（Q4=B＋ の具体化）

A) **signature＝1トークンに集約して Core 再テーマへ。固有カラーはプロジェクト集に「カラーパレット資産」として提示（Core 非取込） (推奨)** — 要件 FR2-5 どおり。将来 Taste 派生は別途。

B) **signature＋主要な固有カラーも Core/Taste へ取り込む** — 取込範囲を広げる（規模増）。

C) **実装時に固有カラーの件数を見て判断** — まず signature のみ、固有カラーは状況次第。

X) Other (please describe after [Answer]: tag below)

[Answer]: 相談。弊社のアプリ固有カラーは多岐にわたる。ブランドカラーを基点に派生させたカラーパレットの生成法則に則って、ブランドカラーの代わりにアプリ固有のメインカラーからカラーパレットを生成するメソッドの確立。
