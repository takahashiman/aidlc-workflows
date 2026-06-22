# Business Logic Model — U2-4/U2-5 ポータル IA・操作完結

> ポータル（`aidlc-workflows/portal/`・vanilla JS SPA）の **IA 振る舞い**と**操作完結導線**の正典。
> 確定回答（PQ1〜4＝全 A）に基づく。本文の正典は Core 側 `portal-content.js`、ポータルは IA に集中（§4-4/AD3=A）。

## 0. 設計の骨子

訪問者が「自分は何者で、まずどこを読めばよいか」を**入口で即わかる**ようにし（US-P1/P5）、
利用シーン（既存を整える／新規を作る）ごとに**順序立てた導線**（US-P2/P3）を用意する。
主要4操作は**ポータルだけで完遂**できるよう使い方ガイドを網羅し（US-P7）、GitHub 操作も
ツール非依存で案内する（US-X3）。未整備の部品は**俯瞰可能な「余白」**として可視化する（US-P6）。

すべて**ポータル側の IA／新ビューの追加**で実現し、Core 本文（rolling 取込）は改変しない。

## 1. Home ランディング（US-P1/P5・PQ2=A）

### 1.1 振る舞い
- 新ルート `#/home`（kind=`home`）を追加し、`DEFAULT_ROUTE` を `#/home` に変更。ブランドロゴの遷移先も Home。
- `renderHome(ctx)` が返す要素:
  1. **役割別入口カード**（3枚）:
     - **開発者**: 「実装に使う」→ シナリオ別ガイド（既存/新規）／Developer ガイド getting-started。
     - **利用者**: 「見て確認する」→ 使い方（ポータルの歩き方・閲覧3形態）／プロジェクト集。
     - **管理者**: 「配布・昇格・版を運用する」→ 運用（版/Showcase/昇格/ガバナンス）。
       非エンジニアの詳細 GitHub 操作（権利者向け）は `aidlc-docs/` のリポジトリ内ドキュメント側にある旨を注記（§4-2・公開ポータルには載せない）。
  2. **はじめに読む順番**（オンボーディング）: 「①ビジョン → ②三層トークン/プロファイル → ③シナリオ別ガイド → ④主要操作の使い方」を番号付きで提示（リンク）。
  3. **シナリオ入口**: シナリオA（既存・★最優先）／シナリオ②（新規）への大きな導線。
  4. **クイックリンク**: 主要4操作（新製品セットアップ／移行／Core 昇格提案／バージョン参照）。
- Home は SPA の他ビューと同じシェル（サイドナビ・プロファイル切替・検索）内に描画する。

### 1.2 ルール準拠
- 玄人最適化（最小クリック・一面完結）を崩さない＝Home は「迷ったときの起点」であり、既存の深いリンク
  （`#/overview/...` 等）は引き続き直接到達可能（後方互換）。

## 2. シナリオ別ガイド（US-P2/P3・PQ3=A）

「使い方」配下に2本の**シナリオ・ガイド**を追加（既存テンプレ 目的→前提→手順→確認 を流用）。
各ガイドは getting-started → 次の一歩 → 参照 を順序立て、関連する使い方ガイド／Developer ページ／運用ビューへ相互リンクする。

### 2.1 シナリオA「既存アプリを整える」（★最優先・画像02-A）
- 想定: 既存コードがある製品（**LLocana/BusDelayAlerts が実例**＝AC②-3 の実例導線）。
- 流れ（手順）: 公開サイト/ポータル閲覧 → Developer ガイド確認 → 必要 repo を clone＋既存コード配置 →
  配布（submodule＋Core CSS import）→ スタイル修正開始（テンプレ／開始宣言例でほぼ自動）→
  「最低でも自社デザイン資産化」達成で完了。
- **あわよくば**（任意の次の一歩）: 既存機能を壊さず UX も改善＝UX 改修フロー（画面遷移図の確認/差替・VSCode×Pencil）。
- 参照: 使い方「ポータルの歩き方」「閲覧3形態」、Developer ガイド getting-started/integration/migration、運用「昇格」。

### 2.2 シナリオ②「新規開発」（画像02-②）
- 想定: 既存が少なく Construction から FIG-UDS スタイル＋UI を実装。
- 流れ: 新製品セットアップ（template 複製・signature seed 注入）→ Core 配布 → Construction で実装 →
  プロジェクト集へ登録（registry 自動 PR）。
- 参照: 使い方「新製品セットアップ」、Developer ガイド project-duplication/getting-started、プロジェクト集。

### 2.3 表示
- 使い方インデックスで**シナリオA に★最優先バッジ**を付け先頭に並べる。Home のシナリオ入口からも到達。

## 3. getting-started 責務分離（US-P4・ポータル IA のみ）

- 本文（Core `developer/getting-started` 等）は rolling のまま改変しない（§4-4）。ポータル側で:
  - **導入**（はじめての人向け）＝Home の「はじめに読む順番」＋シナリオA/②ガイド＋Developer getting-started を「導入」として束ねる。
  - **運用**（昇格/版管理/配布）＝運用（`#/ops/*`）＋使い方の運用系ガイドへ寄せ、シナリオ/Home から**運用は別系統**として誘導。
  - Developer ガイドの各ページ描画時、**運用に属する話題は運用ビューへの相互リンク注記**を IA レベルで添える（本文は変えず、ポータルの導線で補助）。
- Core 本文そのものの組み替えは将来 Core repo 側（本ユニット スコープ外・注記のみ）。

## 4. 未整備閲覧「余白」（US-P6・PQ4=A）

### 4.1 振る舞い
- 新ビュー `renderBrowseMargin(ctx)`（ルート例 `#/overview/components/coverage` もしくは運用配下の独立ビュー）。
- データ源: `data/core-content.json` の PAGES（`template` が component/pattern のもの）と `vendor/core/preview/` の
  実体有無。**preview を持つ=整備済 / 持たない=未整備（preview 未収録）** として一覧化（build.mjs が既に
  実体なき preview 参照を prune するため、`page.preview` の有無で判定可能）。
- 表示: コンポーネント/パターンをセクション別に一覧し、各項目に **整備済 / 未整備バッジ**と整備率（例: 14/36）を提示。
  未整備項目は Core リポジトリ側で preview を足せば自動で整備済に変わる旨を注記（§背景）。
- **22 件 preview 自体は作らない**（本サイクル スコープ外）。本ビューは「どこに余白があるか」を俯瞰させるだけ。

### 4.2 到達
- Home のクイックリンク／概要 Components／（任意）運用から到達可能に。

## 5. 主要4操作のポータル完結（US-P7・AC②-1/2）＋ GitHub 操作案内（US-X3）

「使い方」ガイドを拡充し、**4操作すべてがポータル内で完遂**できる状態にする。

| 操作 | 使い方ガイド | 状態 |
|---|---|---|
| バージョン参照 | `core-version`（既存） | 既存・到達確認 |
| Core 昇格提案 | `promotion`（既存） | 既存・到達確認 |
| 新製品セットアップ | `new-product-setup`（**新規**） | 追加 |
| 移行（既存→Core 採用） | `migration`（**新規**） | 追加 |
| （横断）GitHub 操作 | `github-operations`（**新規・US-X3**） | 追加 |

### 5.1 新製品セットアップ（`new-product-setup`）
- 目的: 新規製品を template から複製し signature seed を注入して開始（シナリオ②起点）。
- 手順: template 複製 → `project-settings.json`（製品名/signature seed/カテゴリ）記入 → init 実行 →
  Core submodule pin → registry 登録 PR（AI 自動起票）→ プロジェクト集に出現を確認。
- 確認: build 成功・プロジェクト集に製品が「準備中→公開」で現れる。

### 5.2 移行（`migration`）
- 目的: 既存コードを Core 採用へ移行（シナリオA起点）。
- 手順: repo clone → Core submodule＋CSS import 配布 → ブリッジ CSS で @theme 写像 → 状態色 semantic 化・
  生 HEX 解消 → migration-status で定量確認（主要100%/全体≧80%）。
- 確認: 主要画面 生 HEX 0・vite build 成功・migration-status PASS。

### 5.3 GitHub 操作案内（`github-operations`・US-X3）
- 目的: 4操作で必要な GitHub 操作を**ツール非依存**（各チーム標準の Git/AI に読み替え可）で再現可能に。
- 内容: clone / branch 作成 / submodule pin 更新 / Issue 起票（temp-part・core-promotion ラベル）/ PR 作成。
- BR-USE-2 準拠（ツール非依存表現）。シークレット/PAT 等の権利者専用操作は載せない（§4-2・aidlc-docs 側）。

### 5.4 セルフ検証（AC②-2）
- 4操作それぞれについて、Home/シナリオ → 該当使い方ガイド → 確認まで**ポータル内リンクのみで到達**できることを
  セルフレビュー チェックリストで確認（Q8=C→セルフ／Q9=C）。Code Gen の検証で結線テスト（リンク到達・ガイド存在）を行う。

## 6. 記録（US-X4・C-Record 横断）
- 本ユニットの IA 改修を `dev-flow-journal.md` に追記（ポータル素材化・FR-4.10）。

## トレーサビリティ
- US-P1/P5=§1（Home/役割入口/オンボ）。US-P2/P3=§2（シナリオ）。US-P4=§3（IA 分離）。US-P6=§4（余白）。
- US-P7=§5（4操作完結・セルフ）。US-X3=§5.3（GitHub 案内）。US-X4=§6（記録）。
- AC②-1=§5 / AC②-2=§5.4 / AC②-3=§2.1（LLocana 実例）。
