# Components — Application Design

> 高レベルのコンポーネント識別と責務。詳細ロジックは Construction の Functional Design（per-unit）。
> マルチレポ構成：**Core DS** / **Portal(aidlc-workflows)** / **Extensions(fig-ext-*)** / **Sandbox(ProductA)**。

## リポジトリ・トポロジ
| Repo | 役割 | 配布/参照 |
|---|---|---|
| `FIG-Core-DS`（中核） | 24コンポーネント・三層トークン・3プロファイル・SemVer・**registry.json/taxonomy.json**・昇格資産・共有 Lint 設定 | 拡張は submodule で **pin**、ポータルは **rolling** |
| `aidlc-workflows`（ポータル） | cloudscape 風 SPA・3区分IA＋使い方・版ダッシュボード・showcase | Core DS を rolling 参照、各拡張デモを **iframe** 集約 |
| `fig-ext-<category>-<product>`（拡張） | 製品UI・Extensions層（独自/仮パーツ）・デモ公開 | Core DS を submodule pin＋`CORE-DS-VERSION` |
| `ProductA`（サンドボックス） | submodule 引込み検証 | 検証後削除 |

---

## A. Core DS コンポーネント
| ID | コンポーネント | 責務 | インターフェース |
|---|---|---|---|
| CD-1 | Primitive Tokens (`primitives.css`) | 生値（HEX/px）。最下層 | CSS 変数 `--fig-*`（primitive） |
| CD-2 | Semantic Tokens (`semantic.css`) | 役割トークン。Primitive のみ参照 | CSS 変数 `--color-*` 等。Component が参照 |
| CD-3 | Profile Layer (`.fig-profile-*`) | Web-Admin/Mobile-Consumer/Mobile-Terminal のトークン上書き | `<body class="fig-profile-...">` |
| CD-4 | Components（24） | UI 部品（JSX/CSS）＋ `spec.md`＋`preview.html` | Props 契約（spec 記載）、Semantic のみ参照 |
| CD-5 | Metadata (`registry.json`,`taxonomy.json`) | 拡張 repo 一覧＋カテゴリ階層の**単一正典**（Core Maintainer 管理, FQ1=A） | JSON スキーマ |
| CD-6 | Release/Versioning | SemVer タグ・CHANGELOG・昇格＝MINOR/破壊＝MAJOR | git tag, GitHub Release |
| CD-7 | Guardrail Lint Config | 三層・トークン経由を強制する共有 Lint 設定 | stylelint/ESLint 設定の配布物 |
| CD-8 | Promotion Assets | Contribution ガイド・昇格チェックリスト・`core-promotion` ラベル定義 | Markdown＋Issue/PR テンプレ |

## B. Portal コンポーネント（vanilla JS SPA・ADQ1=A）
| ID | コンポーネント | 責務 | インターフェース |
|---|---|---|---|
| PT-1 | App Shell / Hash Router | `#/...` ルーティング・レイアウト（既存 `portal-content.js` 拡張） | route → view |
| PT-2 | Side Navigation | taxonomy 駆動の階層サイドメニュー（即時到達） | taxonomy.json → nav tree |
| PT-3 | IA Sections | 概要 / プロジェクト集 / 運用 ＋ 使い方（玄人最適化・詳細は別ページ） | セクションルート |
| PT-4 | Project View | コンポーネント単体／ページ遷移／**デモ画面(iframe)** | registry entry → iframe src |
| PT-5 | Version Dashboard | 各拡張の参照 Core 版を一覧表示 | version-matrix.json → table |
| PT-6 | Showcase View | Core 未満の独自/仮パーツ横断一覧 | showcase-index.json → list |
| PT-7 | Metadata Reader | Core DS の registry/taxonomy を rolling 読込 | fetch（Core 最新） |
| PT-8 | Usage Guide Pages | 操作随伴ガイド（再現可能・ツール非依存） | 別ページ群 |

## C. Template ＋ Setup
| ID | コンポーネント | 責務 | インターフェース |
|---|---|---|---|
| TM-1 | Template Repository (`fig-ext-template`) | GitHub Template。三層・CI・`.fig-profile-*` 雛形 | Template 複製 |
| TM-2 | Interactive Prompt Generator | 既存 `ai-co-creation.js` 拡張。製品名/色/カテゴリ入力→セットアッププロンプト生成 | form → prompt(text) |
| TM-3 | AI Setup Runbook ＋ 登録ガードレール | AI が複製・変数置換・初期設定を自律実行。**末尾で Core DS `registry.json` へ追加 PR を自動起票**（ADQ3 追加） | prompt 規約＋auto-PR |

## D. CI/CD コンポーネント（共有/各 repo）
| ID | コンポーネント | 責務 | インターフェース |
|---|---|---|---|
| CI-1 | Three-Layer Guardrail Lint | 生 hex/px 禁止・`--fig-*` 経由・層逆流検出 | CI ジョブ（fail/pass） |
| CI-2 | Visual Regression Test | Core 変更×ポータルの差分検知。**マージ条件** | CI ジョブ（baseline 比較） |
| CI-3 | Version Collector | registry の各 repo の pin/`CORE-DS-VERSION` を収集 | → `version-matrix.json` |
| CI-4 | Showcase Collector | 各 repo の独自/仮パーツ/ラベル付 Issue を収集 | → `showcase-index.json` |
| CI-5 | Registry Registration Check | 新規 repo の registry 登録有無を検査（未登録なら警告/PR 補助） | CI ジョブ |

## E. Extension（template 派生）コンポーネント
| ID | コンポーネント | 責務 |
|---|---|---|
| EX-1 | Product UI | Core を submodule pin して製品画面を構築 |
| EX-2 | Extensions 層 | Core 未満の独自/仮パーツ（昇格候補・showcase 対象） |
| EX-3 | Version Pin | `CORE-DS-VERSION`＋submodule コミット |
| EX-4 | Demo Publish | ポータル iframe 用のビルド済みプレビュー公開（Pages） |

## F. Sandbox
| ID | コンポーネント | 責務 |
|---|---|---|
| SB-1 | ProductA | Core を submodule 引込み検証。完了後削除 |
