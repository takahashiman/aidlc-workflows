# 開発フロー記録（ポータル提供候補資産）— Dev Flow Journal

> **このファイルの目的**
> 本 AI-DLC イニシアチブ（実開発リポジトリ `BusDelayAlerts` の dogfooding ＋ ポータル綿密化）を進める中で、
> **他の社員が「この流れで開発・整備すればよい」と確認できる開発フロー**を逐次メモする。
> 将来、ポータルサイト（Developer ガイド等）で提供する**再利用可能な資産**にすることを意図する。
>
> **スコープ規約**
> - ✅ **含める**: システム（FIG-UDS Core DS／ポータル／template／移行フロー／AI-DLC 運用）を**使って実開発リポジトリを
>   整えていく流れ**。エンジニアの操作手順・判断・前提・確認方法・つまずきと回避。
> - ❌ **除外**: **デザインシステムそのもの（FIG-UDS Core）の内部開発経過**（Core のトークン設計・コンポーネント実装の
>   作り込み・正典ブラッシュアップの内部詳細）。それらは `aidlc-state.md` / `audit.md` / `construction/` が正典。
> - 迷ったら「**他社員が自分の開発に当てはめて再現したいのはどの情報か**」で判断する。
>
> **正典との関係**: 進捗の正典は `aidlc-state.md`、操作の証跡は `audit.md`。本書はそれらから
> **開発者目線のフロー**だけを抽出・物語化した二次資産（ポータル反映前の素材）。
>
> 最終更新: 2026-06-25

---

## 凡例（各ステップの記録フォーマット）

各ステップは次の見出しで記す:
- **何を / Why（なぜ）/ How（どうやって）/ 確認 / つまずき・注意 / ポータル反映候補**

「ポータル反映候補」= この経験を将来どの Developer ガイドページに綴じると有用か
（`getting-started` / `project-duplication` / `integration` / `migration` / `version-management` / `contribution` / `ai-co-creation` 等）。

---

## フロー年表

### Step 0. 起点の把握（新規クローン後にまず読むもの）
- **何を**: 引き継ぎブリーフ3点（`next-initiative-brief.md` / `future-work-portal.md` / `user-actions-checklist.md`）と
  進捗正典 `aidlc-state.md`、AI-DLC 正典 `aidlc-rules/aws-aidlc-rules/core-workflow.md` を読む。
- **Why**: 前サイクルの到達点・運用方針（個人 repo 継続／会社 org 移設は後／Core は都度修正可）・
  今回スコープ（2大目標）を、作業前に確実に共有するため。
- **How**: リポジトリ同梱の `aidlc-docs/` を正典として読む（機械ローカルのメモリは引き継がれない前提）。
- **確認**: 「前サイクル＝Construction 全 Unit 完了／次は新規イニシアチブを Inception から」を state で確認できる。
- **つまずき・注意**: `aidlc-state.md` 冒頭サマリに古い記述が残る場合あり。**Stage Progress 節と末尾 Status が正確**。
- **ポータル反映候補**: `getting-started`（プロジェクト着手時にまず読む順番）。

### Step 1. 実開発リポジトリの取り込み（マルチレポ方針）
- **何を**: 今回の実開発 repo `https://github.com/takahashiman/BusDelayAlerts.git` を、
  作業リポジトリ（`aidlc-workflows`）の**外側の別ディレクトリ**へクローン。
- **Why**: 本システムは**マルチレポ**方針（AI には Core ＋対象製品 repo のみ渡す＝スコープ分離）。
  製品 repo を親作業ツリーに混在させない。
- **How**: `c:/work/AI-DLC/260618_DesignSystem/` 配下（`aidlc-workflows` の兄弟）に `git clone`。
- **確認**: `BusDelayAlerts/.git` が存在し、`git log` で対象コミット（`main @0c38ec9`）を確認。
- **つまずき・注意**: 製品 repo を `aidlc-workflows` の中に入れない（スコープ混線・誤コミットの元）。
- **ポータル反映候補**: `getting-started` / `project-duplication`（新規/既存製品をシステム配下に置く起点）。

### Step 2. 既存スタイルの現状診断（dogfooding 対象面の定量化）
- **何を**: 実開発 repo の**スタイルの現状**を棚卸しし、Core DS で整理すべき面を**数値で**把握。
- **Why**: 「本システムでスタイルを整理できるか」を後で**定量評価**するには、着手前のベースラインが要る。
- **How**: 生 hex 色の出現数・インライン arbitrary 色を含むファイル数・状態色（正常/遅延/運休）の
  トークン化状況・採用ビルド/スタイル基盤（Vite + Tailwind v4 + shadcn/ui）を機械的に集計。
- **確認（BusDelayAlerts のベースライン 2026-06-18）**:
  - 生 hex 直書き **251 箇所**（うちブランド teal `#2C6B5E` = **203**）。
  - インライン `[#...]` を含む tsx **11 ファイル**。状態色のトークン化 **0**（Tailwind 直接色）。
- **つまずき・注意**: Figma Make 由来の export は依存が多く（Radix/MUI/recharts 等）、**実使用は限定的**なことがある。
  「直書き色の集約」と「状態色の semantic 化」が dogfooding の最初の山になりやすい。
- **ポータル反映候補**: `migration`（既存資産の現状診断→整理の入口）／`integration`（Core トークンへの寄せ方）。

### Step 3. 受け入れ条件の言語化（要件の確認） — 着手中
- **何を**: 「スタイルが整理できた」を**定量条件**に、「ポータルだけで操作完結できる」を**操作条件**に落とすため、
  未確定の判断（実 repo の扱い／配布方式／Tailwind と DS の共存／signature 注入／分類 等）を質問シートで確認。
- **Why**: 着手前に「何をもって完了か」を当事者間で合意しておくと、後戻りと解釈ブレを防げる。
- **How**: AI-DLC の作法どおり**質問は .md ファイル**（`requirements/initiative2-requirement-verification-questions.md`）に
  多肢選択で用意し、記入を待つ。差分RE で洗い出した論点だけを問う（既定済の運用方針は再質問しない）。
- **確認**: 全 `[Answer]:` 記入後に要件書を生成。
- **つまずき・注意**: Figma Make 出自の repo は template 由来でないため、signature 注入や配布が
  「テンプレ前提の手順」とズレ得る。**前提が違う分岐は最初に確認**しておくと安全。
- **ポータル反映候補**: `getting-started`（“何をもって完了とするか”・前提差の見極め）。

### Step 4. 既存 repo への Core 取り込み（submodule ＋ ブリッジ 1 枚）— シナリオ A の中核手順
- **何を**: 既存の Vite + Tailwind v4 + shadcn/ui アプリ（BusDelayAlerts）に FIG-UDS Core を**配布し、
  既存コンポーネントを書き換えずに**ブランド色・状態色・面/線を Core トークンへ寄せる。
- **Why**: 「既存機能を壊さずに自社デザイン資産化」（シナリオ A・最優先）を、再現可能な最小手順で確立するため。
- **How（実施した順）**:
  1. **Core を submodule で pin**: `git submodule add <Core repo> vendor/core` → `git -C vendor/core checkout <タグ>`。
     ルートに `CORE-DS-VERSION`（例 `v1.2.1`）を置き、submodule の実 tag と一致させる（CI で検査）。
  2. **トークンはビルド時生成**: `package.json` に `prebuild`/`predev` を追加し
     `node vendor/core/tools/palette-gen/generate.mjs --seed=<自社色> --out src/styles/generated` を実行。
     生成物（signature/status）は **`.gitignore`**（毎ビルド再生成・決定的）。`npm run dev` は prebuild を
     起動しないため **`predev` も要る**点に注意。
  3. **ブリッジ CSS 1 枚**（`src/styles/figuds-bridge.css`）で shadcn のテーマ変数を Core へ再対応:
     `--primary: var(--signature-base)` / `--destructive: var(--status-danger)` ＋ 面/線（background/foreground/
     card/border…）。**index.css の最後**（既存 theme.css の後）に import ＝ CSS 後勝ちで上書き。
  4. **プロファイル**: ルート（`<body>`）に `class="fig-profile-consumer"`。
  5. **検証**: `npm run build`（prebuild 生成 → `vite build` 成功）。ビルド済み CSS で `--primary` が
     signature（teal）に解決され、旧 `#030213` 主色が置換されていることを確認。
- **確認（BusDelayAlerts・2026-06-22）**: `vite build` 成功（2087 modules・CSS 29.93 kB gzip / JS 202 kB gzip）。
  built CSS で `--primary:var(--signature-base)`（teal #2C6B5E）・`--destructive:var(--status-danger)`・
  `.fig-profile-consumer` を確認。ブリッジが theme.css の後に出力され**後勝ち**で効くことをバイト位置で検証。
- **つまずき・注意**:
  - shadcn の `@theme inline` は `:root` のテーマ変数（`--primary` 等）を参照するので、**`:root` のベース変数を
    上書きすれば** Tailwind ユーティリティにも波及する（コンポーネント JSX は不要改修）。
  - 範囲は**最初は中核＋面/線に絞る**（secondary/accent/sidebar/chart は据え置き）と回帰が小さい。
    状態色 success/warning の本格 semantic 化・生 HEX 直書きの解消は**次段（U2-3）**へ。
  - 旧内蔵 DS（`src/styles/tokens/*`）は**即削除せず委譲→段階無効化**（壊さない）。
  - dark（`.dark`）は本サイクル据え置き（必要時に別途ブリッジ）。
- **ポータル反映候補**: `integration`（既存 repo への Core 取り込みの正典手順）／`getting-started`。

### Step 5. 既存スタイルを Core トークンへ寄せる（状態色 semantic 化・生 HEX 解消）— シナリオ A の本番作業（U2-3）

- **やったこと**: ブリッジ導入（Step 4）済の repo で、主要導線の**生 HEX 直書きを Core トークン参照へ置換**し、
  状態色を semantic 化した。
  1. **状態色を Tailwind `@theme` へ**: ブリッジ CSS に `@theme inline { --color-success: var(--status-success-surface); … }`
     を追加。これだけで `bg-success` / `text-success-foreground` 等のユーティリティが Core の AA 済み status 色で描画される。
  2. **ブランド色（teal）を機械置換**: `text-[#2C6B5E]`→`text-primary` 等（opacity modifier `…/10` は維持）。
     `--primary`=signature はブリッジ解決済なので **className のトークンだけ**置換（JSX 不変）。
  3. **派生色（hover/グラデの濃淡）**: signature ramp を `--color-primary-dark/-light` としてブリッジ `@theme` に足し、
     `hover:bg-primary-dark` / `via-primary-light` 等で表現（hex `#23584d`/`#34796A`/`#1F5347` を駆逐）。
  4. **中立色（slate 等）**: Core 中立トークン（`--color-text-disabled`/`--color-border-strong`/`--color-surface-container-low`）
     か Tailwind 既定スケール（`slate-200` 等）へ。生 HEX 直書きにはしない。
  5. **旧内蔵 DS を撤去**: 委譲（Step 4）で参照が切れた `src/styles/tokens/*` を削除（Core へ完全委譲）。
  6. **再混入ガード＋VRT**: 主要導線スコープに限定した生 HEX 検出を CI に接続（緑を保ちつつ再混入を阻止）。
     主要導線のスクリーンショット VRT を導入し、ベースラインは **CI(Linux) を真実源**として repo 管理。
- **結果**: 主要導線の生 HEX = **0**（自動ガード緑）／`vite build` 成功・CSS gzip ほぼ不変／状態色・ブランド色が
  Core 由来で一貫。残債（周辺画面の生 HEX）はガードのスコープ拡大で段階対応。
- **Why（他社員向け）**: 「契約（直書き禁止）は語るがコードが守れていない」状態を、**機械置換＋CI ガード＋VRT**で
  恒常的に解消する流れ。色の意味（状態 success/warning/danger・ブランド primary）を Core の単一情報源へ寄せることで、
  signature を 1 点変えれば全画面が追従し、a11y も Core 生成器が保証する。
- **つまずき・注意**:
  - 状態色の写像は**コンポーネント既存の色系統を尊重**して semantic 化すると VRT ベースラインが意味を持つ
    （例: 既に赤い「遅延確定」は danger、琥珀の「遅延の可能性」は warning。同名でもコンポーネントごとに色意図が違う）。
  - `@theme inline` は使用箇所で `var(--token)` を直接参照するため、status トークン（生成物）を真実源にできる。
  - VRT ベースラインは **OS 依存**。ローカル（Win/Mac）で作らず **CI(Linux) で生成・承認**し repo 管理（差分の真実源を一本化）。
  - 生 HEX ガードは**スコープを限定**して導入（残債のある周辺画面まで一気に赤化させない）。段階拡大が現実的。
- **ポータル反映候補**: `migration`（既存スタイルの整理＝状態色 semantic 化・生 HEX 解消の手順）／`integration`（@theme 写像）。

---

### 確立した方針メモ（随時追記）

#### 配布機構＝submodule ＋ Core CSS import（pin＋CORE-DS-VERSION）を標準とする
- **決定（2026-06-18・Q5=A）**: 実開発リポジトリへの Core DS 取り込みは **git submodule で Core を pin（＋`CORE-DS-VERSION` で明示）し、
  製品から Core の CSS（`primitives/semantic/tokens/*.css`）を import** する方式を**標準**とする。
- **Why**: 取り込み方を一本に確立し、以後の開発も同方式を前提化できる（再現性・バージョン参照ダッシュボードと整合）。
- **検証前提**: 前サイクルは CRA/CRACO で実証済。**BusDelayAlerts は Vite + Tailwind v4** のため、本サイクルで
  「Vite でも submodule＋Core CSS import が成立するか」を再検証してから本採用する。問題なければ今後の標準。
- **ポータル反映候補**: `integration` / `getting-started`（既存 repo への Core 取り込み手順の正典）。

#### 「修正前(before)」の正しい見極め — どのブランチ/状態が基準か
- **教訓（2026-06-18）**: 既存 repo を dogfooding する際、**どのブランチが "修正前" の基準か**を最初に確定する。
  BusDelayAlerts では `main` ではなく **`feature/home-redesign`** が実体の濃い最新（main は古い一部のみ PR マージ済・
  80ファイル/+12,618行差）だった。**default ブランチ＝最新とは限らない**。
- **How**: `git branch -a` ＋ 各ブランチの `git log` と `git diff --stat <a> <b>` で「どれが濃いか」を必ず確認。
  当事者（リポジトリ所有者）に**「修正前はどれか」を明示確認**するのが確実。
- **本開発の運用**: before=`feature/home-redesign` を温存し、作業は **`feature/figuds-adoption`** で行う
  （最後に `figuds-adoption` vs `home-redesign` の diff/PR で before↔after を一望）。push 済。
- **ポータル反映候補**: `getting-started` / `migration`（既存 repo 取り込み時の最初の確認手順）。

#### 既存アプリの「内蔵 DS が古い」ことがある — FIG-UDS フローで置き換える
- **発見（2026-06-18）**: 実開発アプリが**独自のデザインシステム**（三層トークン・spec・preview 等）を
  既に内蔵していることがある。BusDelayAlerts は FIG-UDS と**同型の三層 DS** を内蔵していた。
- **方針（ユーザー確認）**: それが**古い（レガシー）**なら、**FIG-UDS Core のフローに則って修正/置換**する
  （アプリ自前 DS を磨くのではなく、本システムへ寄せる）。「契約は立派だがコードは未適用」
  （生 HEX 直書き 379 vs トークン参照 14）のギャップを、三層ガードレールに沿って解消するのが主作業。
- **つまずき・注意**: 自前 DS が立派だと「これで十分では？」となりがち。**正典は FIG-UDS Core**である点を最初に握る。
  アプリ固有のドメイン資産（例: 遅延バナー等）は将来 **Core 昇格候補**として扱える（画像03）。
- **ポータル反映候補**: `migration` / `integration` / `contribution`（昇格）。

#### 製品の signature/status カラーは seed 1 つから自動生成する（C-Palette）
- **決定（2026-06-21・U2-1）**: 製品のブランド色は **seed（メインカラー）1 つ**を宣言するだけでよい。
  Core 同梱の生成器が seed から **signature 一式（base/light/dark/tint/shadow/on＋50–900 ramp）と
  status（success/warning/danger ＋ surface/tint/on）**を**決定的に**生成し、**WCAG AA を保証**する。
  - 製品側の操作: `npm run gen:palette -- --seed=<自社色>`（U2-2 で配布配線）。signature.css を手で書かない。
  - AAA 充足版も別出力（製品が選択利用可）。
- **Why（他社員向け）**: 「signature 色を 1 点で宣言 → 連鎖的に再テーマ」という既存方針を、**a11y を機械保証**する
  パラメトリック生成へ引き上げた。各製品は自社色を入れるだけで、コントラスト不足の配色事故を防げる（＝Taste 派生）。
- **実装メモ（最小限）**: 色演算は知覚均等な OKLCH・**ゼロ依存自前実装**を採択（PoC で精度確認＝往復誤差 0/255・
  WCAG 値正確）。詳細は Core `tools/palette-gen/README.md`（DS 内部のため本書では深追いしない）。
- **ポータル反映候補**: `integration` / `getting-started`（製品ブランド色の入れ方）。

#### 既存アプリ vs 新規開発で「整え方」を分ける（2活用シーン）
- **既存あり（brownfield・最優先）**: 既存機能を壊さないことを最優先に、**Core のトークンへ寄せて**スタイルを整理
  （アプリ構造は保持）。「最低でも自社デザイン資産化」を達成ラインとする。
- **新規開発（greenfield）**: AI-DLC の Construction で **FIG-UDS のスタイル/コンポーネントに則って**実装。
- **アプリ固有カラーの扱い**: signature 以外の固有カラーは、無理に FIG-UDS へ取り込まず、まず**プロジェクト集に
  カラーパレット資産として提示**。将来 **Taste（プロジェクト別テーマ派生）**として取り込む余地を残す（Q4）。
- **ポータル反映候補**: `getting-started`（シナリオ別の入口）／`migration`（既存整理）。

---

## ポータル反映の棚卸し（このイニシアチブ終了時に整理する）

| 本書のステップ | 想定反映先（Developer ガイド） | 状態 |
|---|---|---|
| Step 0 起点把握 | getting-started | 候補 |
| Step 1 マルチレポ取込 | getting-started / project-duplication | 候補 |
| Step 2 現状診断 | migration / integration | 候補 |
| Step 4 既存 repo への Core 取り込み（submodule＋ブリッジ） | integration / getting-started | 候補（実施済・U2-2） |
| Step 5 状態色 semantic 化・生 HEX 解消（@theme 写像＋CI ガード＋VRT） | migration / integration | 候補（実施済・U2-3） |

> ※ ガイド本文の正典は **Core 側 `assets/js/portal-content.js` の `developer/*` PAGES**。
> 本書はその素材であり、確定反映時は Core リポジトリ側で本文化し、ポータルは rolling 取込で反映する
> （`future-work-portal.md` §背景・§4-4 参照）。

---

## Step 6 — ポータル IA ブラッシュアップ＆操作完結（U2-4/U2-5・2026-06-22）

> 開発者がポータルだけで「自分は何者で、まずどこを読めばよいか」を即把握し、主要4操作を完遂できる導線を整備。

- **入口（ランディング）**: ポータルに **Home（`#/home`・既定ルート）** を新設。役割別入口（開発者/利用者/管理者）・
  「はじめに読む順番」・シナリオ入口・主要4操作クイックリンクを1面提示。ブランドロゴ＝Home。
  既存の深いリンクは後方互換で直接到達可（玄人の最小クリック温存）。
- **シナリオ別ガイド**: 「使い方」に **シナリオA（既存アプリを整える・★最優先）** と **シナリオ②（新規開発）** を
  ガイド化（目的→前提→手順→確認）。シナリオA は LLocana/BusDelayAlerts を実例に、Step 4/5 の整え方へ誘導。
- **主要4操作の完結**: 新製品セットアップ／移行／Core 昇格提案／バージョン参照 を使い方で網羅し、
  **GitHub 操作ガイド（ツール非依存）** を追加。Home から各操作へポータル内リンクで到達できることを結線テストで担保。
- **getting-started 責務分離**: 導入と運用を導線・相互リンクで分離（本文は Core rolling のまま不変・§4-4）。
- **未整備可視化「余白」**: Core カタログの整備済/未整備（preview 未収録）を一覧・整備率（現状 9/36）で俯瞰。
  未収録 preview 22 件の作成自体は本サイクル スコープ外（Core 側で preview を足せば自動で整備済へ）。
- **品質ゲート新設**: ポータルに **Playwright で VRT＋自動 a11y（axe）** を初導入し、CI（portal-deploy.yml）の
  build→品質ゲート→deploy に組込み（fail-fast）。VRT ベースラインは CI(Linux) 真実源。
- **ポータル反映候補**: `getting-started`（役割別入口・はじめに読む順番）／シナリオ別ガイド（既存/新規）／
  操作ガイド（new-product-setup・migration・github-operations）。本文確定時は Core 側で本文化し rolling 反映。

## Step 7 — 運用→Core 昇格の実証（ドメインパターン arrival-card・U2-6・2026-06-22）

> シナリオA の「あわよくば」＝蓄積資産を Core 正典へ昇格するフロー（画像03③④）を、代表 1 パターンで end-to-end 実証。

- **昇格対象＝arrival-card（到着予定カード）**: 製品で最重要のドメイン UX。Core には **Pattern 仕様
  `patterns/arrival-card.md` が既に存在**するが、カタログ上は **`preview: null`＝未整備（Step 6 の「余白」ビューで赤判定）**だった。
  → **真の昇格成果＝この余白を埋める**こと（spec は充実済のため無改変・Core 正典尊重）。
- **抽出→形式化**: 製品 `RouteCard`/`BusLineCard`/`arrivalData.ts`（`BusArrival`）から到着表示を抽出し、
  **Core トークン/既昇格プリミティブの理想形**で `preview/arrival-card.html` を新規作成。
  構成＝`card-fig`（コンテナ）＋ `status-pill`（運行状態・**配色は status-pill に委譲**）＋ route-number badge ＋ arrival-time。
  状態＝normal/possible-delay/delayed/arriving/passed/suspended。**生 HEX ゼロ**（`var(--...)` のみ・他スタイル混入なし）。
- **余白→整備済**: `assets/js/portal-content.js` の `core/patterns/arrival-card` を `preview: null` →
  `preview: 'preview/arrival-card.html'`。整備率 **9/36 → 10/36**（余白ビューで arrival-card が整備済へ遷移）。
- **品質ゲート（Core 側に新設）**: Core 自己ゲート `component-check.yml` を新設し、**三層 lint（生 HEX 0）＋ VRT（preview 視覚回帰）＋
  a11y（axe serious/critical 0）** を集約。a11y は **既存 VRT の Playwright/chromium 基盤を再利用**して `ci/a11y/`＋`_shared-a11y.yml` を新設
  （BR-CI-NODUP-1）。VRT/a11y ベースラインは CI(Linux) 真実源。
- **GitHub 导线（AD2=C）**: `core-promotion` ラベルの Issue（提案）→ PR（preview/spec 実体）のドラフトを用意
  （`construction/u2-6-core-promotion/promotion/`）。**実起票/PR/タグ発行はユーザー承認後**（セルフ運用・Q8=C）。
- **残る余白（次段）**: delay-banner / notification-sheet / route-selector / page-transition は `preview: null` のまま据置
  （代表 1 パターン実証に集中＝FDQ6-1=A）。同じ手順（preview を足す→portal-content 結線）で順次解消できる。
- **ポータル反映候補**: 昇格フローの操作手順は `usage` の `promotion`／`github-operations` ガイドで網羅済。本 Step は
  「Core 側で preview を足せば余白が自動で整備済になる」ことの実証＝Step 6 の余白ビューと一対。

## Step 8 — UX 改修フロー（VSCode×Pencil・あわよくば操作感改善・U2-7・2026-06-22）

> シナリオA の「あわよくば」＝スタイル整理に加え操作感まで改善する UX 改修フロー（画像02-A）を、代表 1 フローで確立。
> 原則＝**Pencil（.pen）＝設計参照／実装が正典／既存非回帰**（AD4=A・AC①「壊さない」厳守）。

- **代表フロー＝遅延アラート核心**: Home（路線カード一覧）→ RouteDetail（到着/遅延/運行位置）→ SettingsNotifications（通知設定）。
  製品で最重要のジョブ「狙った便の遅延を見逃さず通知を仕込む」の最短ジャーニー。
- **確認→差替→反映の3段（C-UXFlow）**:
  - **確認/差替（Pencil＝設計参照）**: 代表3画面を `.pen` の as-is/to-be で表現し改善差分を可視化（`design/llocana-ux.pen`・git 追跡）。
    ※ `.pen` は暗号化・**VSCode Pencil 拡張＋MCP 経由のみ**。実作図はファイルを開いた状態が前提（本 Step では設計意図を `design/README.md` に確定、実 .pen 作図は対話操作待ち）。
  - **反映（実装が正典）＝最小 UX 改善1点（C1）**: RouteDetail の戻り `navigate(-1)` を堅牢化。
    アプリ内履歴がない直リンク/直接アクセス（`location.key === 'default'`）時は **Home へフォールバック**し、アプリ外へ抜けない。
    通常フローは従来どおり1つ前へ＝**挙動不変（非回帰）**。判定は**純粋関数 `decideBackTarget(locationKey)` に切り出し**、単体テスト可能化（実装が正典）。
- **二層検証（非回帰の保証）**: テスト基盤に **vitest を新規導入**（純粋ロジックの単体）＋ **Playwright e2e**（戻り2経路の到達先アサート）＋
  **既存 main-routes VRT**（視覚非回帰）。三者全緑が反映の合格条件。CI は既存 `figuds-build.yml` に同梱（build job=unit／vrt job=e2e）。
  Playwright は U2-3 導入分を再利用し、e2e は **独立 `tests/e2e/`＋専用プロジェクト**で VRT と関心分離。
- **ローカル検証**: vitest 4/4・vite build PASS（2088 modules・CSS 不変）・生 HEX 0 維持・プロジェクト分離正常。e2e/VRT 実描画は CI(Linux) 初回。
- **ポータル导线（US-X2 AC-3）**: `usage` に **`ux-refine` ガイド新規 1 本**（確認→差替→反映＋VSCode×Pencil 手順）。
  シナリオA「あわよくば」と連続する主要操作として使い方インデックスに掲載。portal 42/42 緑・build PASS。
- **学び**: UX 改修は「遷移/操作感/導線」に限定し**状態表現・スタイルには触らない**ことで非回帰を構造的に担保。
  改善ロジックを純粋関数へ薄く切り出すと、Pencil の設計参照と実装（正典）を分けつつテストで非回帰を固定できる。

### Step 8 追記 — UX も Core で蓄積・還元する（生 motion 解消＋UX 循環ループ・2026-06-22）

> ユーザー方針: スタイル（トークン/生 HEX 解消）と同様に **UX 知見も FIG-UDS Core で蓄積・還元**する。必要に応じて開発フローに「UX ブラッシュアップ」を組み込み、**Core の UX 契約を基準に `.pen` で評価者へ修正項目を提案→承認**、最終 UX を次回開発に活用＋ポータルで確認する。

- **UX 基準は Core に既にある（形式知）**: `patterns/transition-budget.md`（体感バジェット 200ms＋`--motion-duration-budget-*`）・`page-transition.md`（forward/back/modal/tab 規約）・`feedback-contract.md`（視覚/触覚/聴覚＋reduced-motion 縮退）・`accessibility-guidelines.md`・`component-contract.md`。これらが UX 改修の**判断基準**。
- **「生 HEX」の UX 版＝生 motion 値**: RouteDetail の遷移が `duration: 0.3`（300ms）の生値＝Core 体感バジェット（nav 200ms）超過だった。C1 を拡張し `src/app/lib/motion.ts`（`motionDurationSec`）で **`--motion-duration-budget-nav` を参照**（未ロード時 200ms 縮退）＝スタイルの生 HEX 解消と同型のUX負債解消。
- **循環ループ**: 消費（Core UX 契約トークン参照）→ 提案/承認（Core 契約に照らし `.pen` で as-is/to-be → 評価者承認・AD4=A）→ 反映（実装が正典・純粋関数化・二層テスト）→ 還元（製品の UX 知見を Core pattern/遷移規約へ昇格・U2-6 同型・AD2=C）→ 活用/確認（次回開発で再利用＋ portal `ux-refine` で確認）。
- **昇格候補（還元）**: C1「履歴なし時 Home フォールバック」は Core `page-transition.md` の back 規約への追補候補（堅牢な戻り先）。実起票は承認後。
- **ポータル**: `ux-refine` ガイドを「Core UX 契約＝基準 → .pen 提案→承認 → 反映 → 還元 → 次回活用/確認」の6手順へ拡充済。
- **学び**: UX 改修の `.pen` は必須ゲートではなく、**Core 契約を基準に修正項目を可視化・合意するための設計参照**。判断の正典は Core 契約（基準）と実コード（実装）。生 motion 値の解消で「UX も測定可能な負債→トークン化」のループに乗せられる。

### Step 9 追記 — T4（置換完了判定）の設計と実装、置換実行 100% PASS 達成（2026-06-24）

> セッションテーマ: T4 設計案から開始 → 実装・検証完了 → Haiku による置換実行が 100% PASS で確認。色の整備は完全ながら、次は「コンポーネント形態（ボタンサイズ・余白・タイポグラフィ）の FIG-UDS 準拠ブラッシュアップ」に移行。

### Step 9 補遺 — シナリオ①-補遺「コンポーネント形態の最適化」ページの設計＋実装（2026-06-24 夜間）

> セッションテーマ: 色置換（T4）完了後、形態最適化（ボタンサイズ・カード余白・タイポグラフィ）を Core DS に統一するガイドページを新規設計・実装。テンプレ強化（CH5_AI_TEXT）と同じ「AI/人間分離パターン」で形態判定ルール（T5_FORM_AI_TEXT/CHECK_TEXT/FORM_OPTIMIZATION_RULES）を確立。

- **T4（置換完了判定チェック）実装**: T3 と同じ AI/人間分離パターン＝T4_AI_TEXT（grep で生 hex 残存確認・var(...) 置換確認・製品ローカル色・グレー・白確認）+ T4_CHECK_TEXT（人間目視5項目：色の表示/意味/レイアウト/無効化/エラー）。章6 を「Core トークンへ寄せる（置換完了判定）」へ全面改稿＝T3→T4→完了判定の明確フロー。ビルド/テスト 42/42・全緑。
- **Haiku 置換実行結果**: 那覇空港サイネージ（レガシー素 HTML/CSS）での置換実行が完了→T4 自動チェックで「全項目 ✅ PASS・**置換完全性 100%**」と報告。**カラーコード（token 値）の整備は完全に完了**。
- **🔍 発見事項（重要）**: 置換は完全ながら、**見た目には FIG-UDS コンポーネント群への準拠が足りない**ことが新たに発見。
  - 色：✅ 置換完了（トークン参照に統一）
  - 形態：❌ まだ Core DS に準拠していない
  - 課題：ボタンサイズ・カード余白・タイポグラフィが Core 標準に統一されていない

- **スコープの進化**: 
  - U2-3 以前＝「トークン置換（色）」＝**完了** ✅
  - 次フェーズ＝「**コンポーネント構造ブラッシュアップ（形態）**」へ移行 ⏳
  - 対象：ボタンサイズ（Core サイズトークン）/ 余白（Core spacing）/ タイポグラフィ（Core font-size/line-height）
  
- **理由**: 「自社デザイン資産化」は、既存スタイルが Core DS に**完全に準拠している**ことが前提。色だけでなく形態も含めて「FIG-UDS 準拠」の完全性が必要＝他プロジェクトへの参照・再利用価値が出る。

### Step 9 補遺 2 — 形態最適化フロー（手順 3）のコンテキスト別タブ化＋Large Display サイネージ専用診断（2026-06-25）

> セッションテーマ: 形態診断/確認フロー（T5_FORM_AI_TEXT / T5_FORM_CHECK_TEXT）の導入に続き、判定ルール（FORM_OPTIMIZATION_RULES）を Web/Mobile / Large Display / Hybrid の 3 コンテキスト版に分割。Large Display サイネージ専用の形態基準（36～72px スケール・視認距離 3-5m）を詳細化。

- **コンテキスト別判定ルール分割**: FORM_OPTIMIZATION_RULES を以下の 3 つに分割し、各コンテキストの視認距離・スケール・注意点を個別化
  - **FORM_OPTIMIZATION_RULES_WEB_MOBILE**：Core 標準スケール（11～32px）・視認距離 30-70cm（通常デバイス）
  - **FORM_OPTIMIZATION_RULES_LD**：Large Display 拡張スケール（36～72px）・視認距離 3-5m（駅・空港・施設サイネージ）・Web/Mobile スケール採用禁止の⚠️警告付き
  - **FORM_OPTIMIZATION_RULES_HYBRID**：両スケール併用・@media ブレークポイント条件分岐・小画面/大画面別の修正方針
  
- **各ルールの構成**: 公通で「❶ 標準サイズ統一」「❷ 複数パターン整理」のフロー + コンテキスト固有の ❌ ステップ
  - Web/Mobile: 標準化→パターン整理→製品固有判定（❶❷❸）
  - Large Display: **スケール混在排除が必須**→標準化→パターン整理（❶❷❌）。18～30px は視認不可のため混在は critical
  - Hybrid: 両フロー並用→ビューポート別方針決定→@media 分岐実装
  
- **修正例の詳細化**: 各ルール版に「修正前/修正後」のコード例を CSS スニペット で提示
  - Web/Mobile：タイポグラフィ統一（font-size-sm + space-2/3）・line-height 日本語標準化
  - Large Display：**Web スケール（18px）→ Large Display スケール（36px）の置換例**・余白も ld-* トークン参照
  - Hybrid：@media(min-width:768px) で条件分岐・小画面 Web スケール / 大画面 LD スケール
  
- **ポータル構造（タブ化）**: 手順 3「形態最適化の判定ルール」を `tabs` で 3 コンテキスト選択可能に実装
  - ステップ 1 で判定したコンテキストと同じ ID で tab デフォルト選択が一致
  - 各タブ内にコンテキスト専用の AI テンプレ（判定ルール）を表示
  
- **Large Display 専用テンプレ検証**: T5_FORM_AI_TEXT_LD・T5_FORM_CHECK_TEXT（大型ディスプレイ版）の生成内容確認
  - 診断結果：スケール混在 ✗、トークン参照 0 ✗、見た目最深刻（15+ パターン）→修正時間 10-18h
  - 確認結果：Core DS 準拠度 20%、判定 ✗ 多くが非標準（大規模最適化必要）
  - Phase 分類：B（スケール統一・優先度①）→ A（正規化）→ C（状態表現）
  
- **次ステップ**: PR #11 merge 完了後、実開発リポジトリで Phase B-A-C を順次実施予定（対象：BusDelayAlerts / 那覇空港サイネージ等）
  
- **ポータル版貢献**: 形態最適化フロー（T5）の 3 コンテキスト別ガイド化により、**開発者が自身のプロジェクト context を判定後、最適な修正ルール・具体例・推定時間を即座に確認**できる構造が完成。

- **次セッション計画（次フェーズ）**:
  1. コンポーネント形態の調査＝既存コンポーネント列挙・Core 仕様と比較
  2. 形態の最適化設計＝Core サイズ・spacing・font トークンに統一
  3. 実装とテスト＝CSS 書き換え・VRT・a11y 非回帰確認
  → 自社デザイン資産化の前に「見た目の完全準拠」を達成

- **記録**: aidlc-state.md RESUME POINT を最新に更新（T4 実装完了→置換 100% PASS→コンポーネント準拠へ）。memory に新規記録 `t4-completion-component-next.md`（色完了・形態次）。audit.md に本セッション記録追記。

---

- **何を**：シナリオ①（既存アプリを整える）の「色置換（T4）完了」と「自社デザイン資産化判定」の間に、新ページ「コンポーネント形態の最適化」（シナリオ①-補遺）を設計・実装。
  - 色（生hex → トークン参照）は T4 で完了 ✅
  - **形態（ボタンサイズ・カード余白・タイポグラフィ）が Core DS に準拠していない** ❌ ← 新ページで対応
  - 両面で「FIG-UDS 完全準拠」を達成して「自社デザイン資産化」判定

- **Why**：「自社デザイン資産化」は、既存スタイルが Core DS に「完全に準拠している」ことが前提（色だけでなく形態も含めて）。そうなって初めて「他プロジェクトへの参照・再利用価値」が出る。シナリオ① だけでは「ただのCSS整理」になる。

- **How**（テンプレ強化セッション（CH5_AI_TEXT）と同じパターン）：
  1. **T5_FORM_AI_TEXT** ＝ AI による形態診断（ボタン・カード・タイポグラフィを列挙・計測）
  2. **T5_FORM_CHECK_TEXT** ＝ 人間による目視確認（Core 標準との比較）
  3. **FORM_OPTIMIZATION_RULES** ＝ 判定ルール（❶Core 標準に統一できるか ❷複数パターンがあるが標準寄りか ❸製品固有として保持するか）
  4. **CH_FORM_OPTIMIZATION**（章 6.5）＝ ポータル表示用の章立て（4 手順）

- **確認**（実装完了）：
  - portal/src/usage.js に新テンプレ 3 種 + 新章を追加。構文エラーなし（node -c 通過）。
  - ビルド成功（portal `npm run build`）。
  - テスト 42/42 PASS（portal `npm run test`）。
  - CH_EXISTING に新章（n: 6.5）が追加 → ポータルで「シナリオ① の章一覧」に自動で 6.5 が表示される（chapters: CH_EXISTING で反映）。

- **つまずき・注意**：
  - 形態最適化は「色の置換」と違い「デザイン判定」の幅が少ない（数値スケール確定的）→ ❶❷❸ルール を簡潔に。
  - 新ページは「シナリオ①-補遺」として扱い、シナリオ② ではスコープ外（新規は最初から Core 準拠を想定）。
  - ユーザー操作：manual で形態チェック指示・修正スコープ判定・実装指示 → VRT/a11y 非回帰確認（テンプレ強化と同型）。

- **ポータル反映候補**：`usage/scenario-existing`（シナリオ①）の章 6.5 として自動で表示。「将来タスク（形態最適化の本格実施）」の導線にもなる（memory `t4-completion-component-next`）。

- **次のステップ**（別セッション以降）：
  - 実際の那覇空港サイネージ or BusDelayAlerts で形態最適化フローを実行。T5_FORM_AI_TEXT で現状診断 → FORM_OPTIMIZATION_RULES で修正スコープ決定 → 実装 → VRT/a11y テスト。
  - audit.md に実行ログを記録。
  - Core へ昇格候補（形態が整ったコンポーネント）の情報を記録。

---

### Step 9.5. デバイスコンテキスト判定層の追加（2026-06-25）

**背景**：Step 9 で設計した形態最適化フロー（シナリオ①-補遺）が「Web/Mobile アプリケーション前提」であることが判明。
那覇空港サイネージのように「遠距離視認（3-5m）が前提のデバイス」には、
Core DS の標準フォントスケール（最大 32px）が適用不可。視認性が損なわれる可能性あり。

- **何を**：形態最適化フロー（手順 0-4）に **新規「デバイスコンテキスト判定」ステップ** を追加。
  3 つのコンテキスト（Web/Mobile / Large Display / Hybrid）を区別し、
  コンテキスト別に適用するスケールを選別。

- **Why**：
  - **視認距離による要件分化**：Web/Mobile（30-70cm）と Large Display サイネージ（3-5m）では「読める最小文字高さ」が全く異なる。
  - **Haiku 出力の修正**：Step 9 で Haiku の T5_FORM_CHECK_TEXT 出力（見出し 68px → 32px に統一）が、
    サイネージの視認性を損なわせる可能性があった → コンテキスト判定で事前に防止。

- **How**：
  1. **Core DS 拡張**（`primitives.css`）：Large Display 専用フォントスケール追加
     ```css
     --font-size-ld-sm:   36px;  /* サイネージ内テキスト・ラベル */
     --font-size-ld-md:   44px;  /* 中見出し */
     --font-size-ld-lg:   56px;  /* 副見出し */
     --font-size-ld-xl:   64px;  /* メイン見出し */
     --font-size-ld-2xl:  72px;  /* 超大見出し */
     ```
  
  2. **新テンプレ追加**（`usage.js`）：
     - **T5_DEVICE_CONTEXT_CHECK** ＝ 対象デバイスを判定（Web/Mobile / Large Display / Hybrid）
     - **T5_FORM_AI_TEXT_LD** ＝ Large Display 向け診断テンプレ（LD スケール対応）
  
  3. **ポータル 6.5 章修正**：
     - デバイスコンテキスト判定セクション追加（最初に実施）
     - 手順 1 で Web/Mobile と Large Display の診断テンプレを選択可能に
     - FORM_OPTIMIZATION_RULES にコンテキスト別判定フロー統合

- **確認**（実装完了）：
  - Core DS `primitives.css`：LD スケール追加・構文エラーなし
  - `usage.js`：T5_DEVICE_CONTEXT_CHECK / T5_FORM_AI_TEXT_LD 追加・既存テンプレ修正・構文エラーなし（node -c 通過）
  - ポータル 6.5 章：デバイスコンテキスト判定セクション統合・テンプレ 2 種選択可能
  - ビルド成功・テスト通過
  - memory 新規作成 `device-context-typography.md`（コンテキスト別スケール定義・設計思想）

- **つまずき・注意**：
  - **スコープ判定が重要**：大型サイネージと Web アプリが混在する場合、優先度を明確に。
  - **Web/Mobile スケール混在禁止**：Large Display コンテキストで 32px 以下を採用すると視認性が大幅低下。
  - **ビューポート別対応**：Hybrid コンテキスト（レスポンシブ）の場合、ビューポート幅と視認距離を両立させるメディアクエリ設計が必須。

- **ポータル反映**：`usage/scenario-existing` の章 6.5「コンポーネント形態の最適化」に統合。
  デバイスコンテキスト判定が「形態最適化の前提判定」として機能。

- **次のステップ**（別セッション）：
  - 実開発リポジトリ（BusDelayAlerts / サイネージ）でコンテキスト判定 → 適切なテンプレで診断実行
  - conformance-assessment.md（Haiku 出力）がどのコンテキストを対象にしているか明確化
  - 該当コンテキストのフロー（手順 0-4）を実行
  - audit.md に実行ログ＋判定理由を記録

---

### Step 9. Core DS Large Display プロファイル外部公開（2026-06-25）

- **何を**: デバイスコンテキスト別診断で構想した Large Display フォントスケール（36-72px）を、
  Core DS `primitives.css` に正式なトークンとして追加・外部公開。
  前セッション（2026-06-23）で portal 6.5 章に実装・テスト済みの機能を、
  外部プロジェクトでも参照可能にする環境整備。

- **Why**: Haiku の修正スコープ出力（conformance-assessment.md）が「Core DS には Large Display 専用プロファイルがまだ定義されていない」と指摘。
  実装は完了していたが、Core DS の公式トークンとして宣言・管理する必要があった。
  そることで、外部企画プロジェクトの UX チームが大型ディスプレイ対応時に参照・引用可能に。

- **How**:
  1. `portal/vendor/core/primitives.css` の Font size セクション（134-150 行）直後に新規セクション追加
  2. コメント付きで 5 段階トークンを定義：
     ```css
     /* Font size · Large Display (サイネージ・大型ディスプレイ・遠距離視認専用) */
     --font-size-ld-sm:   36px;  /* サイネージ内テキスト・ラベル */
     --font-size-ld-md:   44px;  /* 中見出し・説明文見出し */
     --font-size-ld-lg:   56px;  /* 副見出し */
     --font-size-ld-xl:   64px;  /* メイン見出し・強調 */
     --font-size-ld-2xl:  72px;  /* 超大見出し（限定用途） */
     ```
  3. 視認距離（3-5m）の前提を明記

- **確認**：
  - `primitives.css` 構文検証通過（ポータル npm build で確認）
  - Web/Mobile スケール（11-32px）との段階的分離が視認可能
  - コメントに「Web/Mobile との混在禁止」を明記

- **つまずき・注意**：
  - LD スケール導入時、既存 Web/Mobile コンテキスト用スタイルとの混在を絶対に避けること
  - ビューポート判定の責任は使用側プロジェクトに属する（Hybrid コンテキストの @media 設計は Core では定義しない）

- **ポータル反映**：Core DS の `primitives.css`（ベンダー同梱）として他プロジェクトで参照可能。
  従来は portal の 6.5 章でのみ説明 → Core トークンとして「定義・管理・再利用可能な資産」に昇格。

- **関連する確認**：
  - `aidlc-docs/dev-flow-journal.md`（本ファイル）最終更新日を更新 → 2026-06-25
  - `aidlc-state.md` の Stage Progress に「Large Display トークン外部公開」を追記
  - git commit 作成：feat(core): Large Display フォントスケール追加（視認距離 3-5m 対応）
