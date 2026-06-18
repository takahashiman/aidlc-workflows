# 次期 AI-DLC イニシアチブ ブリーフ（新規クローンで即着手用）

> **このファイルの目的**: 現サイクル（FIG-UDS 循環システムの設計・構築）は Construction まで完了した。
> 次は **新しい AI-DLC イニシアチブ**を、このリポジトリ（`aidlc-workflows`）を**新規クローンしてから**開始する。
> 本セッションでは新規 AI-DLC は実行しない。クローン後の次セッションが**すぐ Inception に入れる**よう、
> 到達点・運用方針・2 大目標・並行で進める改善・開始手順をここに集約する。
>
> 最終更新: 2026-06-18

---

## 1. 現在地（前サイクルの到達点）

- **ライフサイクル**: INCEPTION ✅完了 → CONSTRUCTION ✅全 Unit 完了（U1〜U7）→ Build & Test 実質完遂 → **次は OPERATIONS**。
  - 正典: `aidlc-docs/aidlc-state.md`（※冒頭サマリ L6/L105 は古い記述が残存。正確なのは Stage Progress 節と最終 Status＝全 Unit 完了）。
- **要ユーザー操作 checklist（`aidlc-docs/user-actions-checklist.md`）**: A〜F のうち
  **F-4（branch protection 強制＝プラン制約で保留）と E-5（Core CSS 三層負債＝任意・継続運用）を除き完了**。
- **ライブ成果物**: ポータル公開中 `https://takahashiman.github.io/aidlc-workflows/`
  （Core 概要を Core 本文駆動・シェル収斂・Developer ガイド 8 ページ画面化まで反映済）。
- **実リポジトリ（owner=`takahashiman`・個人）**: `aidlc-workflows`(ポータル/親)・`FIG-Universal-Design-System`(Core DS・既定 `core`・v1.1.0=`6efb0c2`)・`fig-ext-template`(Template 化済)・`fig-ext-bus-busapp`(移行製品)。

---

## 2. 運用方針（次サイクルの重要な前提・ユーザー確定 2026-06-18）

1. **OPERATIONS には進むが、当面は個人リポジトリ（`takahashiman`）のまま。**
   システムが上手く回ることを確認して**初めて**会社用 GitHub 組織アカウントへ移設する。
   - 会社用 org 移設で初めて解けるもの＝**F-4（branch protection 強制）／認証付き配信・private Pages／組織シークレット管理**（`future-work-portal.md` §4-2/4-3）。
     → これらは**移設まで保留**。それまでは「設定はするが強制されない／機能は緩和構成」で運用継続。
2. **Core（FIG-UDS）は発展途上**。現状の正典（コンポーネント群）が**視覚的に思想に沿っていない**と判断された場合は**都度修正**する前提で運用する（＝目標①の前提）。
3. **ポータル構成変更は小〜中規模の IA・導線改善**にとどめる（抜本再設計はしない）。時間制約のため、下記 2 大目標を**極力並行**で解決する。

---

## 3. 新規 AI-DLC の 2 大目標

### 目標① 実開発リポジトリが本システムでスタイルを整理できること（dogfooding）
- 実在の開発リポジトリ（busapp 等の実製品 or 新規製品）が、本システム（Core DS の `.fig-*` クラス・三層トークン・3 プロファイル・submodule 配布・移行フロー）を使って**スタイルを整理・統一できる**ことを実証する。
- **前提（重要）**: FIG-UDS はまだ発展途上。**現状の Core 正典が思想（FIG-UDS の三層・プロファイル・ブランド）に視覚的に沿っていない**と見なされたら、その都度 Core を修正する。
  → Core 正典のブラッシュアップ（コンポーネントの見た目・トークンの整合）が目標①に内包される。
  → 関連既存バックログ: `future-work-portal.md` §2（未収録プレビュー 22 件）・§3（思想に則ったコンポーネント拡充）。

### 目標② 「ポータルを見るだけで」意図する操作ができる綿密なポータル内容
- 小規模に**個人リポジトリへエンジニア数人を招待**し、他リポジトリで意図する運用（新製品セットアップ・移行・Core 昇格・バージョン参照など）を行う。
- その際、招待されたエンジニアが**ポータルサイトを見るだけで**、迷わず意図する操作を完遂できるレベルまで**ポータル内容を綿密化**する。
- 関連既存バックログ: `future-work-portal.md` §4-4（**Developer ガイド／ポータル全体の IA ブラッシュアップ**＝初訪問者が迷わない構成・シーン別フロー・getting-started の責務分離）。これは目標②の中核タスク。

> **2 目標の関係**: ①は「中身（Core 正典・実装）」、②は「伝え方（ポータルの導線・ガイド）」。
> 時間制約のため**並行**で進める。①で Core を直しながら、②でその使い方をポータルに綴じていくと、
> ポータル自身が自社資源として循環する（FR-4.10 dogfooding）流れと一致する。

---

## 4. 並行で進める IA・導線改善（小〜中規模・目標②の具体作業）

`future-work-portal.md` に既出のバックログから、次サイクルで着手する候補（優先度の目安付き）:

- **§4-4 IA ブラッシュアップ（最優先・目標②中核）**
  - 初訪問者が迷わない入口（役割別＝開発者/利用者/権利者の導線）。
  - シーン別（開発／運用）の順を追ったフロー。
  - `developer/getting-started` に混在する運用内容（Core 昇格フロー等）の責務分離。
  - ※ガイド本文の正典は **Core 側 `assets/js/portal-content.js` の `developer/*` PAGES**。組み替えは原則 Core リポジトリ側で行い、ポータルは IA（並び・ラベル・入口導線）調整に絞る。
- **§1 B1〜B10 軽微修正**（spec リンク 404・Prism 未導入・パンくず非リンク 等／ユーザー予測では後回し可）。
- **§2 未収録ライブプレビュー 22 件**（Core 側に `preview/*.html` 実体を足す。目標①の Core ブラッシュアップと同時に進むと効率的）。

---

## 5. 次セッション（新規クローン後）の開始手順

1. `aidlc-workflows` を**新規にクローン**し、`aidlc-docs/` の本ファイル・`aidlc-state.md`・`future-work-portal.md`・`user-actions-checklist.md` を読む。
2. **本ファイル §2 の運用方針を厳守**（個人リポジトリ継続・会社用 org 移設は後・Core は都度修正可）。
3. 新規 AI-DLC イニシアチブとして **Inception を起動**し、スコープを **§3 の 2 大目標**に設定する。
   - Initiative 名（案）: 「実開発リポジトリの dogfooding ＋ ポータル提供方法の綿密化（OPERATIONS 起点の小サイクル）」。
   - Brownfield（既存コードあり）。Reverse Engineering は前サイクル成果（`aidlc-docs/inception/`）を流用し、差分のみ。
4. 要件は 2 軸で立てる: **(a) dogfooding が成立する受け入れ条件**（実開発 repo がスタイル統一できた＝定量）／**(b) ポータルだけで操作完結できる受け入れ条件**（招待エンジニアが主要操作をポータル参照のみで完遂）。
5. Core 正典の視覚的ブラッシュアップは**目標①の作業項目**として Construction の Unit に内包する（FIG-UDS repo 側の変更）。

---

## 6. 関連ドキュメント（正典）

- 進捗の正典: `aidlc-docs/aidlc-state.md`
- 手動操作の進捗: `aidlc-docs/user-actions-checklist.md`（F-4/E-5 に「🔮 将来前提＝会社用 org 移設」追記済）
- ポータル将来バックログ: `aidlc-docs/future-work-portal.md`（§4-4 IA ブラッシュアップ・§2 未収録プレビュー・§3 コンポーネント拡充・§4-2/4-3 公開範囲/認証）
- 前サイクルの Inception 成果: `aidlc-docs/inception/`／Construction 成果: `aidlc-docs/construction/`

---

## 7. 留意（クローン前にやること）

- **本ブリーフを含む `aidlc-docs/` の変更を commit & push** しておくこと。新規クローンに反映されるのは push 済みの内容のみ。
  - 現在の未コミット: `aidlc-docs/future-work-portal.md`・`aidlc-docs/user-actions-checklist.md`・（本ファイル新規）。
- 機械ローカルのメモリ（`.claude/projects/.../memory/`）は**クローン先に付いてこない可能性がある**ため、引き継ぎの正典は本ファイル（リポジトリ同梱）とする。
