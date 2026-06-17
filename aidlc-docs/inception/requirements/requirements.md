# Requirements — FIG デザインシステム循環システム

> Requirements Analysis（包括的深度）。RE 成果物・CR1-12・検証質問 Q1-Q10 を統合した正式要件。

## Intent Analysis
- **User request**: AI-DLC Inception を再実行し、「FIG Core DS のブラッシュアップ」を中核に、Core DS／拡張プロジェクト／ポータルの3層と、バージョニング・スコープ分離・既存取り込み・Core昇格・自動化を備えた**自社デザイン資産の蓄積循環システム**を設計する
- **Request type**: New Project（既存資産の再編を伴う brownfield リファクタ＋新規構築）
- **Scope**: Cross-system（マルチレポ：Core DS / 各拡張 / ポータル / サンドボックス）
- **Complexity**: Complex（複数ペルソナ・ガバナンス・自動化・バージョニング）

---

## Functional Requirements

### FR-1 FIG Core DS（恒久中核）
- **FR-1.1** 正典コンポーネントカタログ**24**を、`main/existing-code`（約28・重複あり）から**重複排除・取捨選択して24に整理**し正典化（Q1=A）
- **FR-1.2** 三層アーキテクチャ（Primitive → Semantic → Component、上位は下位のみ参照・逆流禁止・生値直書き禁止）
- **FR-1.3** 3デバイスプロファイル（**Web-Admin** / **Mobile-Consumer** / **Mobile-Terminal**）を `.fig-profile-*` クラスのトークン上書きで提供
- **FR-1.4** **SemVer タグ**でバージョン管理（昇格＝次 MINOR、破壊的変更＝MAJOR）
- **FR-1.5** 既存資産を起点に整備：`extensions/template/`（雛形）、`assets/js/ai-co-creation.js`（Interactive Prompt Generator）、`assets/js/portal-content.js`（ポータルIA/Contribution）

### FR-2 拡張プロジェクト（製品単位・マルチレポ）
- **FR-2.1** **新規派生**：GitHub **Template Repository**（`extensions/template` ベース）で複製
- **FR-2.2** **初回セットアップ**：既存 **Interactive Prompt Generator を拡張**し、複製・変数置換（製品名/signature色/カテゴリ）・CI/CD・`.fig-profile-*` 生成を **AIエージェント（各チーム標準）が自律実行**（Q5=Other）
- **FR-2.3** Core DS を **submodule で特定バージョンに pin**（再現性）
- **FR-2.4** 参照中の Core バージョンを `CORE-DS-VERSION` で**明示**
- **FR-2.5** 製品ごとに **Extensions 層**（Core 未満の独自パーツ／仮パーツの置き場）を持つ
- **FR-2.6** **スコープ分離**：製品単位の独立 repo とし、開発/AI生成には「**Core DS ＋ 対象製品 repo のみ**」を渡す（無関係製品を物理遮断）

### FR-3 既存プロジェクト取り込み
- **FR-3.1** 既存コードを拡張枠へ **repo 化**して取り込む
- **FR-3.2** **段階移行**：1画面内の新旧混在は**不可**、画面間の混在は**期限付き許容**
- **FR-3.3** **移行完了基準**（Q3=B）：**主要フロー（コア画面）100% ＋ 全体 ≧80%**。残レガシー画面は継続課題。**チェックリストで○×機械判定**（各画面「画面内100% Core適応」を判定単位）

### FR-4 ポータルサイト（aidlc-workflows 大元 / Web-Admin）
- **FR-4.1** **cloudscape.design 風**の堅牢構成（左サイドナビ中心の管理画面）。**サイドメニューから目的プロジェクトへ即時到達**
- **FR-4.2** **IA 上位3区分**：①概要 ②プロジェクト集 ③運用 ＋ **使い方（操作随伴ガイド）**
- **FR-4.3** 閲覧3形態：①コンポーネント単体 ②プロジェクトのページ遷移 ③デモ画面
- **FR-4.4** **rolling**：常に最新 Core DS のスタイルを反映（pin しない）
- **FR-4.5** **taxonomy**（カテゴリ＞サブカテゴリ＞プロジェクト、細分化可能）をサイドメニュー構造に反映
- **FR-4.6** **ドッグフーディング＋鶏卵回避**：Core 未満が必要なら製品 Extensions に**仮パーツ**を一時設置→専用ラベル付 Issue→Maintainer レビュー→次 MINOR で Core 化→**ポータルは rolling で取得し仮パーツを削除**
- **FR-4.7** **ショーケース**：Core 未満の各拡張独自パーツを**自動クローリングで一覧化**（Q6=A）。横展開・車輪の再発明防止
- **FR-4.8** **バージョン参照ダッシュボード**：各 repo の pin 情報（submodule ハッシュ/`CORE-DS-VERSION`/`package.json`）を**ビルド時に自動収集**して一覧表示
- **FR-4.9** **GitHub Pages** でホスティング・共有（Q7=A）
- **FR-4.10** ポータル自身も自社資源として循環対象（不足コンポーネントを Core へ還元）

### FR-5 運用（ガバナンス）
- **FR-5.1** **Core 昇格フロー**（既存 Contribution 準拠5ステップ：提案→3プロダクト基準→普遍化→レビュー→次MINOR）。**①提案は3行で低ハードル**、③④で **Core Maintainer が伴走**して普遍化・a11y を仕上げ
- **FR-5.2** **レビュー体制**：**デザイナー＋エンジニアの2名**（Q4=B）。**二段レビュー**（軽微＝1名即決／重大＝2名）＋**リリース列車**でベロシティ確保
- **FR-5.3** **マイグレーション方針**：後方互換優先、旧名→新名の**エイリアス/ラッパー**を一定期間提供、破壊的変更は **MAJOR＋移行ガイド**
- **FR-5.4** **taxonomy ガバナンス**：カテゴリ命名・ディレクトリ構造・追加/再編の決定・承認は **Core Maintainer**（デザイナー）が管掌
- **FR-5.5** 運用は**ポータル「運用」カテゴリ**に集約（開発作業ではない）

### FR-6 操作随伴ガイド（使い方）
- **FR-6.1** ユーザに操作を依頼する**全場面**（AI-DLC 開発、Core昇格などの運用を含む）に、**口頭説明なしに使い方ページをベースとして、各チーム標準の Git ツールや AI アシスタントの支援のもとで誰でも等しく再現可能**な詳細ガイドを必ず付随
- **FR-6.2** **情報設計（玄人最適化）**：メインは最重要情報を**最小クリック・ノンスクロール（一面完結）**、詳細 how-to は**別ページ遷移**

### FR-7 CI/CD & 自動化
- **FR-7.1** **三層アーキテクチャ ガードレール**：Lint/静的解析で生 hex/px 禁止・`--fig-*` トークン経由のみ・層依存（Component→Semantic のみ、Primitive 直参照禁止）を自動検査
- **FR-7.2** **Visual Regression Test (VRT)**：Core 変更 PR にポータルを巻き込んだ VRT＋自動ビルドチェック、**VRT グリーンをマージ条件**（rolling リグレッション防止）
- **FR-7.3** **バージョン自動収集**（FR-4.8 のバックエンド処理）

### FR-8 サンドボックス（ProductA）
- **FR-8.1** Core DS を submodule で正しく引けるかの**運用検証**。検証完了後に削除

---

## Non-Functional Requirements

- **NFR-A11y**: **WCAG 2.1 AA** を正式目標（Q8=A）。コントラスト/タップ領域/フォーカス/`prefers-reduced-motion`
- **NFR-Security**: **Security Baseline 有効**（Q9=A）。静的フロントエンド/ポータルの性質上、適用ルールを enforce し非該当は N/A（下記 Security Compliance）
- **NFR-Versioning**: Core=SemVer タグ、各プロジェクト=pin＋`CORE-DS-VERSION` 明示、ポータル=rolling
- **NFR-Maintainability**: 三層アーキ徹底、トークン経由実装、最小ドキュメント（コードが正典）
- **NFR-Reusability**: template 複製（GitHub Template）、ディレクトリ単位の流用
- **NFR-Testability**: VRT＋Lint で品質担保。**PBT は無効**（Q10=C、UI 中心）
- **NFR-Usability**: 再現可能な操作随伴ドキュメント＋玄人最適化 IA
- **NFR-Scalability**: taxonomy の多階層細分化、マルチレポによる製品増加への対応
- **NFR-Performance**: 静的サイト（Pages）。rolling 参照の表示安定は VRT で担保

---

## Security Compliance（Security Baseline 有効・適用判定）
本システムは**静的フロントエンド（ポータル）＋ React UIデザイン資産**で、バックエンド/データストア/認証/クラウドインフラは scope 外。

| Rule | 適用 | 方針 |
|---|---|---|
| SECURITY-04 HTTP セキュリティヘッダ | **適用** | CSP（最低 `default-src 'self'`）等。Pages の制約は `<meta>` CSP/代替で対応、要検討 |
| SECURITY-09 ハードニング/誤設定防止 | **適用** | デフォルト資格情報なし・スタックトレース非露出・デモ/既定ページ排除・ディレクトリ列挙無効 |
| SECURITY-10 サプライチェーン | **適用** | 依存の lock 固定・脆弱性スキャンを CI に・`latest` タグ禁止（template/portal/extension の CI） |
| SECURITY-13 完全性検証 | **適用** | 外部 CDN スクリプトに **SRI**、CI/CD パイプラインのアクセス制御 |
| SECURITY-15 例外処理/フェイルセーフ | **適用** | JS/React の大域エラーハンドリング・fail closed・リソース解放 |
| SECURITY-05 入力検証 | **部分適用** | API 無し。Prompt Generator フォーム等のクライアント入力を検証 |
| SECURITY-11 セキュア設計 | **部分適用** | 関心分離は適用。rate limiting 等は N/A |
| SECURITY-01/02/03/06/07/08/12/14 | **N/A** | データストア/網羅中継/IAM/認証/監視基盤が scope 外（該当時に再評価） |

---

## Out of Scope / Deferred
- 本番バックエンド・認証・クラウドインフラ（将来の製品実装側で別途）
- Operations フェーズ（デプロイ運用監視）は AI-DLC のプレースホルダ
- HTML 差分可視化 UI の詳細仕様は VRT 設計と合わせ Application Design で具体化

## 構築フェーズ順序（Q2=A）
① Core DS 整備 → ② ポータル（概要/プロジェクト集/運用＋使い方）→ ③ template＋既存取り込み → ④ CI/CD 自動化（層Lint/VRT/バージョン収集）→ ⑤ showcase

## Key Requirements Summary
FIG Core DS（24コンポーネント・3プロファイル・SemVer）を恒久中核に、製品ごとマルチレポの拡張（Template 複製＋AI 自律セットアップ＋Core pin）、cloudscape 風ポータル（3区分 IA＋rolling＋taxonomy＋ショーケース＋バージョンダッシュボード＋Pages 公開）、2名体制のガバナンス（Core昇格・二段レビュー・マイグレーション）、全操作への再現可能ガイド、CI/CD 自動化（三層 Lint/VRT/バージョン収集）を、段階的に構築する。
