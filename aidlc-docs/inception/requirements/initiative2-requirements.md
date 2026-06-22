# Requirements — イニシアチブ#2（実開発 dogfooding ＋ ポータル提供方法の綿密化）

> Requirements Analysis（包括的深度・product owner ロール）。
> 入力: next-initiative-brief.md §3 / 差分RE（`reverse-engineering/busdelayalerts-delta-analysis.md`・改訂版）/
> 質問票（`initiative2-requirement-verification-questions.md`）＋ clarification の回答 / 画像3点（state「画像3点の要件化」）。
> 前サイクル要件（`requirements.md` の FR-1〜FR-7）は**正典として継承**し、本書は#2 の差分・受け入れ条件を定義。
>
> 最終更新: 2026-06-18

## Intent Analysis
- **User request**: 前サイクルで構築した「自社デザイン資産の蓄積循環システム（FIG-UDS Core＋ポータル＋template＋移行＋CI）」を、
  **実開発リポジトリ BusDelayAlerts(LLocana) に適用（dogfooding）して有効性を実証**し、同時に
  **ポータルだけで意図する操作が完結できるよう内容を綿密化**する（OPERATIONS 起点の小サイクル）。
- **Request type**: Migration ＋ Enhancement（既存実アプリの FIG-UDS フロー適用 ＋ ポータル IA 改善）。
- **Scope**: Cross-system（実開発 repo BusDelayAlerts ／ ポータル aidlc-workflows ／ 必要に応じ Core FIG-UDS）。
- **Complexity**: Complex（実アプリの旧 DS 置換・配布の Vite 再検証・ポータル IA 再設計・2目標並行）。

## 前提・運用方針（確定事項）
- **個人 repo（takahashiman）継続**。会社用 org 移設は後（F-4 branch protection 強制・private Pages・認証は移設まで保留）。
- **Core（FIG-UDS）は発展途上**。視覚的に思想へ沿わない場合は**都度修正**（目標①に内包）。
- **本サイクル対象外**: `future-work-portal.md` §2 未収録ライブプレビュー22件（次回引継・ユーザー備考 2026-06-18）。
- **実開発 repo**: `https://github.com/takahashiman/BusDelayAlerts.git`。before=`feature/home-redesign`、作業=`feature/figuds-adoption`（push 済）。
- **★アプリ内蔵の独自 DS は「古い(レガシー)」**。本開発で **FIG-UDS Core のフローに則って置換／整理**する（ユーザー確定）。

---

## 目標① dogfooding — Functional Requirements

- **FR2-1（古い内蔵 DS の置換／整理）**: BusDelayAlerts(LLocana) の内蔵レガシー DS（`guidelines/design-system.md`・
  `src/styles/tokens/*`・specs/patterns）を、**FIG-UDS Core のフロー**（三層トークン・semantic 経由・ガードレール）に
  則って置換／整理する。アプリ自前 DS を磨くのではなく、**正典＝FIG-UDS Core** へ寄せる。
- **FR2-2（共存方式＝シナリオ別・Q3 確定）**:
  - **既存アプリ（＝BusDelayAlerts）は A：Core semantic トークンを Tailwind `@theme` へブリッジ**を基礎とし、
    既存構造（shadcn/Radix）を壊さず色・トークンを Core へ寄せる（画像02 ♡「既存機能を壊さない」）。
  - **新規開発は B：`.fig-*` クラス／コンポーネント**で実装、というシナリオ別運用を**方針として確立**し
    `dev-flow-journal.md` に記す。
- **FR2-3（配布機構の確立・Q5=A）**: Core DS の取込は **git submodule で pin（＋`CORE-DS-VERSION`）し製品から Core CSS を import**。
  **Vite + Tailwind v4 で成立することを再検証**し、以後の標準とする（前サイクルは CRA/CRACO 実績）。
- **FR2-4（「定義済みだが未適用」ギャップの解消）**: `src/app` の**生 HEX 直書き 379 箇所**を Core/semantic トークン参照へ移行。
  ブランド `#2C6B5E` は **signature トークン1本へ集約**。状態色（正常/遅延/運休）は **semantic トークン経由**に統一。
- **FR2-5（signature 注入・Q4=B+）**: ブランド teal を Core の **signature 再テーマ機構**へ載せる（template init 流用）。
  ただし**既存コードゆえ変数置換は改修視野**。アプリ固有カラー（signature 以外）は無理に Core 取込せず、
  **ポータルのプロジェクト集に「カラーパレット資産」として提示**（将来 **Taste＝プロジェクト別テーマ派生**として取込余地）。
- **FR2-6（プロファイル適用）**: BusDelayAlerts は **Mobile-Consumer** プロファイル（`.fig-profile-*`）を適用。
  （画像01 の「同一サービスで端末2種」論点は将来検討・本サイクルは Consumer を主とする。）
- **FR2-7（ドメインパターンの Core 昇格を実行・S4=B でスコープ拡張）**: `arrival-card`/`delay-banner`/`notification-sheet`/
  `route-selector`・transport-domain を画像03 の昇格フローに載せ、**抽出→FIG-UDS Live Preview 形式化→Core へ提案・マージ→昇格確認（画像03①〜④）まで本サイクルで実行**する（FR-5.1 Core 昇格フロー準拠）。他スタイル/旧 DS スタイルの混入禁止。→ US-X1。
- **FR2-8（taxonomy/表示・Q6=C+）**: 分類は Core Maintainer 委任。ポータルの**プロジェクト集に「LLocana」名**で提示。
  既存 `bus`/`bus-notification`・`fig-ext-bus-busdelayalerts` とは**別サービス**として扱う。

### 目標①の受け入れ条件（AC①・Q2=A）
> FIG-UDS が発展途上で画面ゲート(B: 100%/80%)基準が正典未確立のため、**トークン3条件**で判定する。
- **AC①-1**: ブランド `#2C6B5E` が **signature トークン1本**へ集約され、直書きが除去されている。
- **AC①-2**: 状態色（正常/遅延/運休）が **semantic トークン経由**で表現されている。
- **AC①-3**: **主要画面で生 HEX 直書き 0**（全体は大幅削減）。`var(--token)` 参照が標準化されている。
- **AC①-4**: Core DS が **submodule＋pin** で取り込まれ、**Vite で `build` 成功**（配布機構が成立）。
- **AC①-5**: `feature/figuds-adoption` と `feature/home-redesign` の **diff で before↔after が確認**できる。

---

## 目標② ポータル綿密化 — Functional Requirements（§4-4 IA 全項目・Q7=A）

- **FR2-9（役割別入口）**: 初訪問者が「自分は何者か（開発者／利用者／権利者・管理者）」と「まずどこを読むか」が
  入口で即わかる IA（画像01 の「管理者が行うこと／開発者が確認するもの」）。
- **FR2-10（活用シーン別フロー・画像02）**: **2シナリオ**を順を追って導線化:
  - **A=既存あり（★最優先）**: 公開サイト閲覧 → Developer ガイド → 必要 repo を clone・既存コード配置 →
    スタイル修正開始（**テンプレート／開始宣言例**でほぼ自動的に進む状態）→「**最低でも自社デザイン資産化**」達成で通知・終了。
  - **②=新規（既存少）**: AI-DLC の Construction で FIG-UDS スタイル＋UI 実装。
  - **BusDelayAlerts(LLocana) を「シナリオ A の実例（ウォークスルー）」**としてポータルに綴じる。
- **FR2-11（getting-started 責務分離）**: `developer/getting-started` に混在する運用内容（Core 昇格等）を分離し、
  導入（はじめての開発の入口）に絞る。運用系は `#/ops/*`・`version-management`・`integration` へ寄せ相互リンク。
  （正典は Core 側 `assets/js/portal-content.js` の `developer/*` PAGES。ポータルは IA 調整。）
- **FR2-12（運用→Core 昇格の案内・画像03）**: 蓄積資産の**2パターン**（資産化完了／一旦残す）を示し、
  **Core 昇格フローを具体化**（蓄積完了→使用コンポ抽出→FIG-UDS Live Preview 形式→リクエスト→マージ→昇格確認）。
  **GitHub 上の操作も案内**する。
- **FR2-13（オンボーディング/ランディング）**: トップ/概要に役割別入口カード・「はじめに読む順番」を提示。
- **FR2-14（UX 改修フローの確立・S3=C でスコープ拡張）**: 既存機能を壊さず画面操作感を改善する UX 改修フロー
  （画面遷移図の確認/差替・**VSCode×Pencil** 採用）を、入口だけでなく**本サイクルの実装スコープに含める**。
  主要画面の画面遷移/UX を Pencil（.pen）で表現・差替し、機能非回帰を保つ。→ US-X2。
- **FR2-15（未整備コンポ閲覧の「余白」・画像01/03）**: 既リリース済で未整備のコンポーネント群を**閲覧できる余白**を
  ポータルに用意（昇格前資産の可視化）。実装範囲は設計で確定。

### 目標②の受け入れ条件（AC②・Q8=C→セルフ・Q9=C）
- **AC②-1**: 主要4操作 ①新製品セットアップ ②既存製品の移行（=シナリオA）③Core 昇格提案 ④バージョン参照 が、
  **ポータル参照のみ**で完遂できる（口頭補足なしに辿れる）。
- **AC②-2**: 検証は**ユーザー1人のセルフ試験**（招待の代替）＝チェックリストで「主要操作をポータルだけで辿れるか」を自己検証。
- **AC②-3**: BusDelayAlerts(LLocana) のシナリオ A ウォークスルーが、ポータル導線として一貫して読める。

---

## Non-Functional Requirements
- **NFR2-1（Security Baseline＝有効・Q=A）**: SECURITY ルールをブロッキング制約として強制（適用可能な範囲で。
  静的サイト/フロント中心ゆえサーバ系は N/A 判定）。
- **NFR2-2（PBT＝No・確定）**: UI 中心・ロジック薄のため PBT は無効（品質はガードレール Lint＋将来 VRT で担保）。ユーザー確定 2026-06-18。
- **NFR2-3（既存機能の非回帰）**: dogfooding の改修で BusDelayAlerts の**既存機能を壊さない**（画像02 ♡）。`vite build` 成功を維持。
- **NFR2-4（三層ガードレール）**: 改修コードは FIG-UDS の三層ルール（生 HEX/px 禁止・semantic 経由・層逆流禁止）に準拠。
  主対象は新規・変更分（既存負債は段階解消＝E-5 方針継承）。
- **NFR2-5（a11y）**: WCAG 2.1 AA を目標（前サイクル Q8=A 継承）。
- **NFR2-6（ポータル性能/エバーグリーン）**: 前サイクル NFR（軽量 Node ビルド・rolling・Pages 一本化）を継承。

## 継承する前サイクル要件（正典・再掲せず参照）
- FR-1（Core DS 三層/プロファイル/SemVer）・FR-2（拡張/submodule/スコープ分離）・FR-3（既存取り込み/段階移行）・
  FR-4（ポータル IA/rolling/showcase/版ダッシュボード/dogfooding）・FR-5（Core 昇格/ガバナンス）・
  FR-6（操作随伴ガイド）・FR-7（CI/CD 三層 Lint/VRT/収集）は `requirements.md` を正典として継承。

## Out of Scope（本サイクル）
- §2 未収録ライブプレビュー22件 / 会社 org 移設に紐づく項目（F-4 強制・private Pages・認証・組織シークレット）。
- BusDelayAlerts の移行 repo 化（Q1=A：現 repo 上で整理。`fig-ext-bus-busdelayalerts` 化はしない）。

## キー要件サマリ
1. **dogfooding**: 古い内蔵 DS を FIG-UDS フローで置換／整理。既存=@theme トークンブリッジ、新規=`.fig-*`。
   signature 集約・状態色 semantic 化・主要画面 hex 0・submodule×Vite 成立を AC とする。
2. **ポータル**: §4-4 全項目（役割別入口・2シナリオ別フロー・getting-started 責務分離・Core 昇格＋GitHub 操作案内・
   オンボーディング・閲覧余白）。主要4操作をポータルだけで完遂（セルフ検証）。
3. **記録**: 開発フロー（dev-flow-journal）／セッション（session-log）／公式証跡（audit）の3記録を継続。
