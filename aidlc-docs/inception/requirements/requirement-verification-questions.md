# Requirement Verification Questions

> Requirements Analysis（包括的深度）。RE 承認済み・CR1-12 で確定済みの事項は再掲しません。
> 各 `[Answer]:` に直接ご記入ください。選択肢は A/B/C/… ＋ X)Other です。

---

## A. スコープと Core DS

### Q1. FIG Core DS の「正典コンポーネントカタログ（24）」の確定方法
RE で散在が判明：`master/components`(10) / `main/existing-code`(約28・重複あり) / `busapp`(実装4)。Core DS の正典24をどう確定しますか。

A) `main/existing-code` の網羅カタログ（約28）を基に、重複排除・取捨選択して**24に整理**して正典化
B) `master/components`(10) を起点に、不足を追加して**24まで拡充**
C) 既存にこだわらず、**必要なコンポーネントを定義し直して**24を確定
D) 実際の spec 内容を**一緒に精査してから**確定（要・別セッション）
X) Other

[Answer]: A

### Q2. 本イニシアチブの構築スコープ／優先順位（フェーズ）
今回 AI-DLC で構築する範囲と順序の希望。

A) 段階的（推奨）：**① Core DS 整備 → ② ポータル（概要/プロジェクト集/運用）→ ③ template ＋ 既存取り込み → ④ CI/CD自動化(層Lint/VRT/バージョン収集) → ⑤ showcase**
B) Core DS とポータルを**最優先**、その他は後続
C) **全体を一括**で設計・構築
D) まず**最小の縦切り**（Core DS の数コンポーネント＋ポータル最小＋template 1本）で end-to-end を通す
X) Other

[Answer]: A

---

## B. 運用基準

### Q3. 既存プロジェクト「移行完了」の定量基準
「1画面内の新旧混在は不可／画面間は期限付き許容」は確定。**完了**の定量基準は？

A) **全画面 100%** Core DS 適応で完了
B) **主要フロー（コア画面）100%＋全体 ≧80%** で完了、残りは継続課題
C) **画面単位で完了判定**（各画面が「画面内 100% Core 適応」なら個別に完了、全画面完了で移行完了）
D) 期限ベース（設定期日までに到達した範囲を完了とみなす）
X) Other

[Answer]: B, 使われていないレガシーな画面の移行に引きずられて全体の完了が遅れるのを防ぐ。

### Q4. Core Maintainer 体制（昇格レビュー・taxonomy 承認の主体）
昇格レビューと taxonomy ガバナンスの主体。旧定義書は「1名体制」想定。

A) **デザイナー1名**が Core Maintainer（兼 taxonomy 承認者）。二段レビューは「軽微＝本人即決／重大＝外部レビュア1名招集」で運用
B) **デザイナー＋エンジニアの2名**体制
C) **複数名のレビュー委員会**
X) Other

[Answer]: B

---

## C. 自動化レベル

### Q5. template 初回セットアップ機構（GitHub Template 複製後の注入）
製品名・signature色・カテゴリ・CI/CD・`.fig-profile-*` の注入方法。

A) **自動（推奨）**：複製後に走る GitHub Action（初回セットアップ）で対話的/パラメータ注入し、CI/CD と CSS クラスを自動生成
B) **半自動**：セットアップ用スクリプト＋手動チェックリスト併用
C) **手動**：使い方ページ（操作随伴ガイド）に沿って手作業で設定
X) Other

[Answer]: 既存の「Interactive Prompt Generator」を拡張し、複製・変数置換・初期設定をAIエージェントに自律実行させる方式。既にあるフォーム資産を活かす。ファイルの置換や複製はプロンプトを受け取ったAI（Cursor/Claude）の賢さに委ねる。

### Q6. ショーケース（Core未満の独自パーツ一覧）の登録方法
横展開可視化のための独自パーツ/仮パーツ一覧の収集方法。

A) **自動（推奨）**：各 repo の所定ディレクトリ/ラベル付 Issue をビルド時にクローリングして自動一覧化
B) **手動登録**：所定の登録ファイル（例: showcase.json）に各プロジェクトが追記
C) **Issue ベースのみ**：GitHub Issue（専用ラベル）のリンク集として表示
X) Other

[Answer]: A

---

## D. 共有・品質

### Q7. ポータルのホスティング／共有方法
「GitHub で共有」の具体手段。

A) **GitHub Pages**（推奨）：ポータルHTMLを Pages で公開・共有
B) リポジトリのみ（各自 clone してローカル表示）
C) 社内サーバ/その他ホスティング
X) Other

[Answer]: A

### Q8. アクセシビリティ目標
既存資料・昇格チェックは **WCAG 2.1 AA** 準拠を前提。

A) **WCAG 2.1 AA を正式目標**として確定（推奨・既存踏襲）
B) AA は努力目標、必須は最小限（コントラスト等）
C) AAA を目指す
X) Other

[Answer]: A

---

## E. Extensions（opt-in）

## Question: Security Extensions
Should security extension rules be enforced for this project?

A) Yes — enforce all SECURITY rules as blocking constraints (recommended for production-grade applications)

B) No — skip all SECURITY rules (suitable for PoCs, prototypes, and experimental projects)

X) Other (please describe after [Answer]: tag below)

[Answer]: A) Yes — enforce all SECURITY rules as blocking constraints (recommended for production-grade applications)

## Question: Property-Based Testing Extension
Should property-based testing (PBT) rules be enforced for this project?

A) Yes — enforce all PBT rules as blocking constraints (recommended for projects with business logic, data transformations, serialization, or stateful components)

B) Partial — enforce PBT rules only for pure functions and serialization round-trips (suitable for projects with limited algorithmic complexity)

C) No — skip all PBT rules (suitable for simple CRUD applications, UI-only projects, or thin integration layers with no significant business logic)

X) Other (please describe after [Answer]: tag below)

[Answer]: C) No — skip all PBT rules (suitable for simple CRUD applications, UI-only projects, or thin integration layers with no significant business logic)
