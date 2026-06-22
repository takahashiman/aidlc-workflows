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
> 最終更新: 2026-06-22

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
