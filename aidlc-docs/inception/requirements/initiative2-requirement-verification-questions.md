# 要件確認の質問 — イニシアチブ#2（BusDelayAlerts dogfooding ＋ ポータル綿密化）

> 各質問の `[Answer]:` の後ろに**英字（A/B/C…）**を記入してください。当てはまる選択肢が無ければ
> 最後の「Other」を選び、`[Answer]:` の後に内容を記述してください。
> すべて記入したら「done」等とお知らせください。読み取って要件書（`initiative2-requirements.md`）を生成します。
>
> 背景: 差分 RE（`reverse-engineering/busdelayalerts-delta-analysis.md`）の所見と
> next-initiative-brief.md §3 の2大目標を前提に、未確定の判断のみを確認します。
> （ブリーフで既定の運用方針＝個人 repo 継続／会社 org 移設は後／Core 都度修正可、は確定済として扱います。）

---

## 目標①（dogfooding）に関する質問

## Question 1 — BusDelayAlerts の扱い（repo 構成）
本システムでスタイルを整理するにあたり、BusDelayAlerts をどう位置づけますか？（差分RE論点5）

A) **現 repo 上でスタイル整理（dogfooding）に留める** — repo 構成は変えず、現 BusDelayAlerts に Core DS を導入してスタイルを統一。最短で「整理できるか」を実証。

B) **移行 repo 化（`fig-ext-bus-busdelayalerts` 相当）して取り込む** — template/移行フロー（migrate-in・registry 登録・CI 接続）に正式に載せる。前サイクルの busapp と同じ枠組み。

C) **まず A で実証 → 良ければ B へ昇格** — 現 repo で整理を実証してから、移行 repo 化を後段で行う段階方式。

X) Other (please describe after [Answer]: tag below)

[Answer]: A, fig-ext-bus-busdelayalerts とは別のサービスとして位置付け。今後どちらかのサービスは消える想定だが、本開発中は並列に存在する。

## Question 2 — dogfooding の「整理できた」定量ゴール
何をもって「本システムでスタイルを整理・統一できた」と判定しますか？（差分RE論点6・baseline=hex251/teal203/状態色0）

A) **3条件すべて**: ①ブランド色 `#2C6B5E` を signature トークン1本へ集約 ②状態色（正常/遅延/運休）を semantic トークン化 ③生 hex 直書きを主要画面で 0（全体は大幅削減）。

B) **主要フロー100%＋全体≧80%**（前サイクルの移行ゲート Q3=B を流用）: 画面単位で「画面内が Core 適応100%」を○×判定し、主要フロー全○＋全体8割。

C) **A と B の両方**（トークン集約条件＋画面ゲートの双方を満たす）。

X) Other (please describe after [Answer]: tag below)

[Answer]: A, 「前提（重要）**: FIG-UDS はまだ発展途上。」であるため、Bを判断できるほどの基準が正典に存在しないと認識している。

## Question 3 — Tailwind v4 と FIG-UDS 三層の共存方式
BusDelayAlerts は Tailwind v4 + shadcn/ui。Core DS（三層トークン・`.fig-*`）とどう共存させますか？（差分RE論点2）

A) **Core semantic トークンを Tailwind `@theme` にブリッジ** — `theme.css` の独自変数を Core の `--fig-*` semantic トークンへ差し替え、既存の Tailwind ユーティリティ/shadcn はそのまま Core 色で描画（既存構造の保持を優先）。

B) **`.fig-*` クラスへ寄せる** — 主要コンポーネントを Core の `.fig-*` クラス消費へ置換（前サイクルの配布モデルに忠実・Core クラスの dogfooding を最大化）。

C) **ハイブリッド** — トークン層は A（@theme ブリッジ）で土台を統一しつつ、Core に同等品がある主要部品は B（`.fig-*`）へ段階置換。

X) Other (please describe after [Answer]: tag below)

[Answer]: 判断基準が分かりません。今後の方針に関わりそうなので相談させて。

## Question 4 — signature 色（`#2C6B5E`）の注入経路
ブランド teal をどう Core の signature 機構へ載せますか？ BusDelayAlerts は Figma Make 出自で template 非派生です。（差分RE論点3）

A) **signature.css のトークン手動設定** — 製品側で Core の signature 再テーマ機構に `#2C6B5E` を設定（template init を通さず、最小手順で注入）。

B) **template init 機構を流用** — `fig-ext-template` の init（signature 色注入・変数置換）を BusDelayAlerts に適用（Q1=B 移行 repo 化と整合）。

C) **どちらでもよい（実装時に最小コストの方を選ぶ）**

X) Other (please describe after [Answer]: tag below)

[Answer]: B, ただし変数置換については全ての既存アプリに適用できるか定かではない為、改修も視野に入れる。例えば、新規開発で既存コードが存在しない場合、変数置換は有効。しかし、既にコードが存在し、著しくアプリのコンセプトが損なわれることを避けるため、使用されているカラーがsignature要素以外のものであれど、場合によってはアプリ固有の特徴としてプロジェクト集にカラーパレットを資産として提示。ただし、そのままFIG-UDSに取り込める状態ではないと認識すること。変数置換のバリエーションの1つとして取り込める可能性はある（Tasteの派生かさらに追加してプロジェクトごとのTaste派生）
変数置換への取り込みは開発規模で今回行うか、将来的に行うか判断。

## Question 5 — 配布機構（Core DS の取り込み方）の Vite 互換
Core DS を BusDelayAlerts へどう配布しますか？ 前サイクルの実績は CRA/CRACO + submodule。（差分RE論点1）

A) **submodule ＋ Core CSS import（pin＋CORE-DS-VERSION）** — 設計どおりの配布機構を Vite で再検証して採用（一貫性を優先）。

B) **npm/ローカルパッケージ参照** — Vite + Tailwind v4 との相性を優先し、Core を依存パッケージとして取り込む別経路を検討。

C) **実装時に PoC で両者を比較して決定**

X) Other (please describe after [Answer]: tag below)

[Answer]: A, 取り込み方を確立させたいので、検証結果に問題なければ今後の開発もAを前提とする。この情報はdev-flow-journal.md にも必要なはず。

## Question 6 — taxonomy 分類（`category=bus` 配下）
ポータルの一覧で BusDelayAlerts をどの分類に置きますか？ 既存に `bus-notification`（接近案内通知）あり。（差分RE論点4）

A) **既存 `bus-notification` に同居** — 「接近案内通知」に遅延案内も含める。

B) **新 subcategory `bus-delay`（遅延情報）を新設** — Core Maintainer 承認のうえ分類を分ける。

C) **実装時に Core Maintainer 判断へ委ねる（要件では未確定でよい）**

X) Other (please describe after [Answer]: tag below)

[Answer]: C, だがサービスとしては現状含まれているものとは別と認識している為、プロジェクト集に「LLocana」という名前で実開発リポジトリの内容（？）は作成したい。

---

## 目標②（ポータル綿密化）に関する質問

## Question 7 — 本サイクルで着手する IA ブラッシュアップの範囲
`future-work-portal.md` §4-4 のうち、今回どこまで実施しますか？

A) **§4-4 全項目** — ①役割別入口（開発者/利用者/権利者）②シーン別フロー（開発/運用）③`developer/getting-started` の責務分離（導入と運用の分離）④トップ/概要のオンボーディング設計。

B) **入口導線＋責務分離に絞る** — ①役割別入口 と ③getting-started 責務分離を優先、②④は次サイクル。

C) **「ポータルだけで操作完結」を阻む箇所のみ最小修正** — 目標②の受け入れ条件（Q8）を満たすのに必要な導線・記述だけを直す。

X) Other (please describe after [Answer]: tag below)

[Answer]: A, aidlc-docs\ 下の以下の画像も参照。
ポータルサイト改修01情報整理.jpg
特に「自社デザイン資産として取り入れる準備と再開発」の項目参照。
ポータルサイト改修02活用シーン2種.jpg
想定される二つの分岐が存在し、ある一定の目標を達成したら開発が終了することを確認する。（あわよくばポイントは将来的な開発に組み込んでも良い）
ポータルサイト改修03運用_蓄積からCore昇格まで.jpg
資産として蓄積されるものに2パターン存在することを確認する。最終的にはCore昇格フローの方法についてGithub上での操作も案内すること。

## Question 8 — 目標②の受け入れ条件（「ポータルだけで操作完結」の検証）
招待エンジニアがポータルだけで完遂できるべき「意図する操作」をどう定義しますか？

A) **主要4操作** — ①新製品セットアップ ②既存製品の移行 ③Core 昇格提案 ④バージョン参照、をポータル参照のみで完遂できること。

B) **dogfooding と同じ操作に限定** — 今回 BusDelayAlerts で実際に行う操作（Core 導入・スタイル整理・バージョン確認）をポータルだけで再現できること。

C) **A＋実地検証** — A の4操作を、実際に数人を個人 repo へ招待して「ポータルだけで」完遂できるか観察するところまで。

X) Other (please describe after [Answer]: tag below)

[Answer]: C, ただし今回の「数人」の代替として私一人の試験で行う。(セルフ)

## Question 9 — 検証の主体・タイミング
目標②の「ポータルだけで完遂」検証は本サイクルのどこで行いますか？

A) **本サイクル内で実地招待まで行う** — Construction 後半で数人を招待して観察・是正。

B) **本サイクルは「ポータル内容の綿密化」までとし、実地招待は次サイクル** — 招待で迷わない状態に整えることをゴールにする。

C) **セルフレビューで代替** — 招待は行わず、チェックリスト（主要操作をポータルだけで辿れるか）で自己検証。

X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## 拡張機能（Extension）の有効化

## Question: Security Extensions
このプロジェクトでセキュリティ拡張ルールを強制しますか？

A) Yes — すべての SECURITY ルールをブロッキング制約として強制（本番品質アプリ向け・推奨）

B) No — SECURITY ルールをすべてスキップ（PoC・試作・実験向け）

X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question: Property-Based Testing Extension
このプロジェクトでプロパティベーステスト（PBT）ルールを強制しますか？

A) Yes — すべての PBT ルールをブロッキング制約として強制（ビジネスロジック・データ変換・直列化・状態を持つコンポーネント向け）

B) Partial — 純粋関数と直列化ラウンドトリップにのみ PBT を強制（アルゴリズム複雑度が限定的なプロジェクト向け）

C) No — PBT ルールをすべてスキップ（単純 CRUD・UI 中心・薄い結合層向け）

X) Other (please describe after [Answer]: tag below)

[Answer]: 違いがわからないため、判断できません。

---

> 補足: ブリーフで既定済の前提（個人 repo 継続・会社 org 移設は後・Core 都度修正可・§2 未収録プレビュー22件は対象外）に
> 異論があればこの欄に記してください。無ければ空欄で構いません。
>
> [補足]: BusDelayAlerts.gitについて、今回の開発による修正前と修正後を確認できるように、予めブランチを新規追加したいです。
