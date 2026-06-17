# Application Design Plan

> 高レベルのコンポーネント識別・サービス層・依存設計（詳細ビジネスロジックは Construction の Functional Design）。
> 下部 `[Answer]:` にご記入ください。記入後に設計成果物を生成します。

## 生成する設計成果物（チェックリスト）
- [x] `components.md` — コンポーネント定義と責務（Core DS / ポータル / template・セットアップ / CI-CD / showcase・版収集 / サンドボックス）
- [x] `component-methods.md` — 主要メソッド/インターフェース シグネチャ（高レベル）
- [x] `services.md` — サービス（オーケストレーション）定義
- [x] `component-dependency.md` — 依存マトリクス・通信パターン・データフロー
- [x] `application-design.md` — 上記の統合ドキュメント

## 想定コンポーネント群（方向性プレビュー）
- **Core DS**：primitives/semantic トークン層、Component 層（24）、profile 層（`.fig-profile-*`×3）、SemVer リリース
- **ポータル**：アプリシェル＋サイドナビ（taxonomy 駆動）、3区分IA（概要/プロジェクト集/運用）＋使い方、プロジェクト/コンポーネント/デモ ビュー、版ダッシュボード、showcase ビュー
- **template ＋ セットアップ**：GitHub Template、Interactive Prompt Generator 拡張（AI 自律セットアップ）
- **CI/CD**：三層ガードレール Lint、VRT、バージョン自動収集
- **showcase/版収集**：各 repo のクローリング基盤
- **サンドボックス**：ProductA（submodule 検証）

---

## 確認質問（設計上の未確定点）

### ADQ1. ポータルの実装方式
既存 `assets/js/portal-content.js` は **vanilla JS のハッシュルーター SPA**（`#/developer/guide/...`）。

A) **既存 vanilla JS SPA を踏襲・拡張**（推奨：既存資産活用・低保守・依存最小）
B) **React** で再構築（拡張プロジェクトと技術統一）
C) **静的サイトジェネレータ**（Astro/Eleventy 等）
X) Other

[Answer]: A, 拡張プロジェクトが必ずしもReact統一とは限らないため。

### ADQ2. ポータルでの各拡張「デモ画面/ページ遷移」の統合方式
スコープ分離（マルチレポ）下で、各製品の実画面をどうポータルに集約するか。

A) **iframe 埋め込み**（各拡張がビルド済みプレビューを公開、ポータルが iframe 集約）（推奨：スコープ分離維持・自己完結）
B) **ビルド時取り込み**（ポータルビルドで各拡張の成果物をコピー/バンドル）
C) **外部リンク**（各拡張の Pages へ遷移）
X) Other

[Answer]: A

### ADQ3. リポジトリ発見方式（バージョン収集＆showcase の共通基盤）
ポータルが「どの拡張 repo を集約するか」を知る方法。

A) **中央レジストリファイル**（例 `registry.json` を Core Maintainer 管理）（推奨：明示的・認証不要・単純）
B) **GitHub Org API スキャン**（命名規約の repo を自動発見）
C) ハイブリッド（レジストリ＋規約）
X) Other

[Answer]: A, ただし、記載し忘れを防止するため、ポータル側ではなく、新リポジトリ立ち上げ時の「AI自律セットアップ（US-3.2）」の段階で、レジストリへの登録有無を自動チェック・自動PR作成するガードレールを設ける。（例：AIへの指示（プロンプト）の最後に、以下を組み込みます。「初期設定が完了したら、Core DSの registry.json に本リポジトリ名を追加するPull Requestを自動で起票すること」）

### ADQ4. taxonomy 定義の所在・形式
カテゴリ＞サブカテゴリ＞プロジェクトの階層データ。

A) **ポータル内 `taxonomy.json` を Core Maintainer が管理**（推奨）。サイドナビ・スコープ分離の単一ソース
B) 各拡張 repo が自分のカテゴリを宣言し集約
X) Other

[Answer]: A

### ADQ5. 拡張リポジトリ命名規約（taxonomy 連動）
例の方向性：

A) `fig-ext-<category>-<product>`（例 `fig-ext-bus-buslocation`）（推奨）
B) `fig-<category>-<product>`（短縮）
C) 規約は設けず registry で対応
X) Other

[Answer]: A

### ADQ6. Core DS 配布方式の確認
要件では submodule＋`CORE-DS-VERSION`。

A) **git submodule 継続**（拡張は特定版に pin）（推奨・既存方針）
B) npm パッケージ化（private registry）
X) Other

[Answer]: A

---

## フォローアップ（回答分析による要確認）

### FQ1. `registry.json` と `taxonomy.json` の配置統一
ADQ3 注記＝registry は **Core DS**（auto-PR 先）、ADQ4=A＝taxonomy は **ポータル**。registry エントリは taxonomy のカテゴリを参照するため、別 repo だと drift リスク。

A) **両方 Core DS に集約**（推奨：単一正典・auto-PR 先と一致・drift 防止。ポータルは rolling で読み取り）
B) registry=Core DS ／ taxonomy=ポータル（回答どおり2か所。整合は CI で検査）
C) 両方ポータルに集約（ただし auto-PR 先がポータルになり、Core Maintainer 管理と要調整）
X) Other

[Answer]: A

