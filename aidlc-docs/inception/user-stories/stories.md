# User Stories — FIG デザインシステム循環システム

> Hybrid 分解：エピック＝構築フェーズ①〜⑤、配下をペルソナ×ジャーニーで分解。
> 各ストーリーは INVEST 準拠。受け入れ基準は Given/When/Then。`[Phase]` / `[FR]` / `[Persona]` を付記。

---

# Epic ① Core DS 整備 `[Phase①]`

## US-1.1 正典24カタログの確定 `[FR-1.1]` `[P1, P2]`
**As a** Core Maintainer, **I want** existing-code（約28）から重複排除・取捨選択して正典24を確定したい, **so that** 全拡張が参照する単一の正典が定まる。
- **AC1 (Given/When/Then)**: Given existing-code の component spec 群、When 重複排除と取捨選択を行う、Then 正典24の一覧（名称・責務）が `Core DS` リポジトリに確定し、重複・別名が解消されている。
- **AC2**: Given 確定した24、When 各コンポーネントを確認する、Then 各々に spec.md と分類（カテゴリ）が紐づく。

## US-1.2 三層トークンの実装 `[FR-1.2]` `[P2]`
**As an** エンジニア, **I want** Primitive/Semantic/Component の三層をトークンで実装したい, **so that** 生値直書きを排し一貫した変更が可能になる。
- **AC1**: Given primitives.css と semantic.css、When Component を実装する、Then Component は Semantic トークンのみ参照し、Primitive/生値を直接参照しない。
- **AC2**: Given 三層構造、When 依存方向を検査する、Then 上位→下位の単方向のみで逆流がない。

## US-1.3 3デバイスプロファイルの定義 `[FR-1.3]` `[P1, P2]`
**As a** Core Maintainer, **I want** Web-Admin / Mobile-Consumer / Mobile-Terminal を `.fig-profile-*` で切替可能にしたい, **so that** デバイス別最適化を単一コードで実現できる。
- **AC1**: Given 3プロファイルクラス、When ルート要素にプロファイルを付与する、Then Semantic トークン値が上書きされ各デバイス最適表示になる。
- **AC2**: Given 各コンポーネント、When 3プロファイルで表示する、Then いずれでも視覚的に成立する。

## US-1.4 SemVer タグ運用 `[FR-1.4]` `[P1]`
**As a** Core Maintainer, **I want** Core DS を SemVer タグで版管理したい, **so that** 各プロジェクトが参照版を特定でき、変更履歴が追える。
- **AC1**: Given Core DS の変更、When リリースする、Then SemVer タグ（例 v1.1.0）と変更履歴が付与される。
- **AC2**: Given 昇格による機能追加、When リリースする、Then MINOR が、破壊的変更時は MAJOR が増える。

---

# Epic ② ポータル `[Phase②]`

## US-2.1 サイドナビからプロジェクトへ即時到達 `[FR-4.1, FR-4.5]` `[P5]`
**As a** ポータル閲覧者, **I want** サイドメニュー（taxonomy）から目的プロジェクトへ即時到達したい, **so that** 探索コストなく目的物に辿り着ける。
- **AC1**: Given カテゴリ＞サブカテゴリ＞プロジェクトの階層、When サイドメニューを操作する、Then 最小クリックで対象プロジェクトに到達する。
- **AC2**: Given Web-Admin（PC）、When ページを開く、Then cloudscape 風の左サイドナビ構成で表示される。

## US-2.2 コンポーネント/ページ遷移/デモの閲覧 `[FR-4.3]` `[P5]`
**As a** ポータル閲覧者, **I want** コンポーネント単体・ページ遷移・デモ画面を閲覧したい, **so that** 実際の見え方と動きを確認できる。
- **AC1**: Given プロジェクトページ、When 閲覧する、Then ①コンポーネント単体 ②ページ遷移 ③デモ画面の3形態を確認できる。

## US-2.3 ポータルが常に最新 Core を反映（rolling） `[FR-4.4, FR-4.10]` `[P5, P1]`
**As a** ポータル閲覧者, **I want** ポータルが常に最新 Core DS スタイルで表示されてほしい, **so that** 最新の正解を基準に比較できる。
- **AC1**: Given Core DS の MINOR 更新、When ポータルをビルドする、Then ポータルは最新 Core を pin せず反映する。
- **AC2**: Given 更新反映、When 表示を確認する、Then レイアウト崩れがない（VRT グリーン、US-4.2 と連動）。

## US-2.4 3区分IA＋使い方 `[FR-4.2, FR-6]` `[P5]`
**As a** ポータル閲覧者, **I want** 概要/プロジェクト集/運用 と 使い方 が明確に分かれていてほしい, **so that** 目的の情報種別へ迷わず進める。
- **AC1**: Given サイドメニュー、When 閲覧する、Then 上位に「概要」「プロジェクト集」「運用」が、操作箇所に使い方ページへの導線がある。
- **AC2**: Given メイン画面、When 重要情報を見る、Then 最小クリック・ノンスクロール（一面完結）で把握でき、詳細 how-to は別ページに分離されている。

## US-2.5 ドッグフーディングと鶏卵回避 `[FR-4.6]` `[P1, P2]`
**As a** Core Maintainer/エンジニア, **I want** ポータル構築中に Core 未満が必要でも開発を止めない流れがほしい, **so that** デッドロックなく構築できる。
- **AC1**: Given Core にないコンポーネントが必要、When ポータルを構築する、Then 製品の Extensions 層に仮パーツとして実装し開発を継続できる。
- **AC2**: Given 仮パーツ、When 画面が動く、Then 専用ラベル付 Issue で「仮パーツ作成」「Core還元検討」が起票される。
- **AC3**: Given Core 昇格後、When 反映する、Then ポータルは rolling で最新 Core を取得し、仮住まいのローカルコードを削除する。

## US-2.6 GitHub Pages 公開 `[FR-4.9]` `[P1]`
**As a** Core Maintainer, **I want** ポータルを GitHub Pages で公開したい, **so that** 社内で URL 共有・閲覧できる。
- **AC1**: Given ポータルのビルド、When デプロイする、Then GitHub Pages で閲覧可能な URL が得られる。

## US-2.7 操作随伴ガイド（玄人最適化） `[FR-6.1, FR-6.2]` `[P5, all]`
**As a** 利用者全般, **I want** 操作を依頼される全場面に再現可能な使い方ページがほしい, **so that** 口頭説明なしに誰でも等しく再現できる。
- **AC1**: Given 操作を要する画面/フロー、When 使い方を参照する、Then 使い方ページをベースに、各チーム標準の Git ツール/AI アシスタントで再現できる手順が揃っている。
- **AC2**: Given 玄人利用者、When メインを見る、Then 詳細は別ページ遷移で分離され、メインの一覧性・速度が保たれる。

---

# Epic ③ template ＋ 既存取り込み `[Phase③]`

## US-3.1 template から新規派生 `[FR-2.1]` `[P2]`
**As an** エンジニア, **I want** GitHub Template Repository（template ベース）で新製品を複製したい, **so that** 雛形から素早く立ち上げられる。
- **AC1**: Given `template` リポジトリ、When 新規 repo を作成する、Then 三層構造とディレクトリが揃った状態で複製される。

## US-3.2 AI 自律セットアップ（Interactive Prompt Generator 拡張） `[FR-2.2]` `[P2, P4]`
**As an** エンジニア（AI エージェント経由）, **I want** 複製後の製品名/signature色/カテゴリ/CI-CD/CSSクラスを AI が自律設定してほしい, **so that** 手作業の初期設定を省ける。
- **AC1**: Given 既存 Interactive Prompt Generator を拡張したフォーム、When 製品情報を入力しプロンプトを生成する、Then AI エージェントがそのプロンプトに従い複製・変数置換・初期設定を実行できる。
- **AC2**: Given セットアップ完了、When 確認する、Then signature色・カテゴリ・`.fig-profile-*`・CI/CD が製品向けに設定されている。

## US-3.3 Core を pin しバージョン明示 `[FR-2.3, FR-2.4]` `[P2]`
**As an** エンジニア, **I want** Core DS を特定バージョンに pin し参照版を明示したい, **so that** 再現性と参照バージョンの可視性を確保できる。
- **AC1**: Given 拡張プロジェクト、When Core を取り込む、Then 特定 SemVer/コミットに pin され、`CORE-DS-VERSION` に明記される。

## US-3.4 スコープ分離 `[FR-2.6]` `[P2, P4]`
**As an** エンジニア/AI エージェント, **I want** 開発時に Core＋対象製品のみを参照したい, **so that** 無関係製品の情報に惑わされない。
- **AC1**: Given マルチレポ構成、When 開発/AI生成を行う、Then 渡されるのは Core DS と対象製品 repo のみで、他事業の製品は含まれない。

## US-3.5 既存プロジェクトの取り込み `[FR-3.1]` `[P3]`
**As a** 移行担当, **I want** 既存製品を拡張枠へ repo 化して取り込みたい, **so that** Core DS への段階移行を始められる。
- **AC1**: Given 既存コード、When 取り込む、Then 拡張プロジェクト枠の repo として配置され、Core DS を参照できる状態になる。

## US-3.6 段階移行と完了判定 `[FR-3.2, FR-3.3]` `[P3]`
**As a** 移行担当, **I want** 新旧混在の許容範囲と完了基準を機械的に判定したい, **so that** 移行の進捗と完了が客観的に分かる。
- **AC1**: Given 移行中の画面、When 1画面を評価する、Then 「画面内 100% Core 適応」でなければ不可（新旧混在画面は NG）。
- **AC2**: Given プロジェクト全体、When 完了判定する、Then 主要フロー100%＋全体≧80% でチェックリストが○となり「移行完了」と判定される。

---

# Epic ④ CI/CD 自動化・運用 `[Phase④]`

## US-4.1 三層アーキテクチャ ガードレール `[FR-7.1]` `[P2]`
**As an** エンジニア, **I want** 三層違反を CI で自動検出したい, **so that** 高速生成しても規約を維持できる。
- **AC1**: Given コミット/PR、When Lint/静的解析を実行する、Then 生 hex/px・`--fig-*` 非経由・層逆流（Primitive 直参照）が検出されると失敗する。

## US-4.2 VRT をマージ条件に `[FR-7.2]` `[P1, P2]`
**As a** Core Maintainer/エンジニア, **I want** Core 変更時にポータルを巻き込んだ VRT を必須にしたい, **so that** rolling による表示崩れを事前に防げる。
- **AC1**: Given Core 変更 PR、When CI を実行する、Then ポータル VRT が走り、差分が許容外なら PR はマージできない。

## US-4.3 バージョン参照の自動収集 `[FR-4.8, FR-7.3]` `[P2, P5]`
**As an** エンジニア/閲覧者, **I want** 各プロジェクトの参照 Core バージョンを自動一覧化したい, **so that** 手動更新なしに全体の版状況が分かる。
- **AC1**: Given 各 repo の pin 情報（submodule/`CORE-DS-VERSION`/package.json）、When ポータルをビルドする、Then バージョンダッシュボードが自動生成される。

## US-4.4 Core 昇格フローの運用 `[FR-5.1, FR-5.2]` `[P1, P2]`
**As a** Core Maintainer, **I want** 低ハードルな提案と伴走、二段レビュー、リリース列車で昇格を回したい, **so that** ボトルネックなく良い部品を Core 化できる。
- **AC1**: Given 提案者、When `core-promotion` ラベルで3行起票する、Then 普遍化/a11y は提案者に課されず、Maintainer が伴走して仕上げる。
- **AC2**: Given 変更の影響度、When レビューする、Then 軽微＝1名即決／重大＝2名（デザイナー＋エンジニア）で承認され、MINOR のリリース列車に乗る。
- **AC3**: Given 昇格判定、When チェックする、Then 3プロファイル成立・トークン階層遵守・WCAG AA・spec/preview 完備 を満たす。

## US-4.5 マイグレーション方針 `[FR-5.3]` `[P1, P2, P3]`
**As a** エンジニア/移行担当, **I want** 普遍化で名称等が変わっても追従コストの所在が明確であってほしい, **so that** 安心して最新 Core に追従できる。
- **AC1**: Given Core 側の普遍化（改名等）、When 反映する、Then 旧名→新名のエイリアス/ラッパーが一定期間提供される。
- **AC2**: Given 破壊的変更、When リリースする、Then MAJOR＋移行ガイドが提供される。

---

# Epic ⑤ ショーケース `[Phase⑤]`

## US-5.1 独自パーツの自動クローリング `[FR-4.7, FR-6]` `[P2, P4]`
**As an** エンジニア/AI エージェント, **I want** 各製品の Core 未満独自パーツを自動収集したい, **so that** 手動登録なく横断一覧を維持できる。
- **AC1**: Given 各 repo の所定ディレクトリ/ラベル付 Issue、When ポータルをビルドする、Then 独自パーツ/仮パーツが自動でショーケースに一覧化される。

## US-5.2 ショーケースからの発見と昇格提案 `[FR-4.7, FR-5.1]` `[P5, P1]`
**As a** 閲覧者/Core Maintainer, **I want** 他製品の独自パーツを発見し再利用・昇格提案したい, **so that** 車輪の再発明を防ぎ Core 昇格の起点にできる。
- **AC1**: Given ショーケース、When 独自パーツを見る、Then どの製品の何かが分かり、3プロダクト基準到達前でも再利用/昇格提案の導線がある。

---

# 横断ストーリー（サンドボックス）

## US-X.1 Core 引込み検証（サンドボックス） `[FR-8.1]` `[P2]`
**As an** エンジニア, **I want** ProductA で Core を submodule として正しく引けるか検証したい, **so that** 配布機構の妥当性を確認してから本運用できる。
- **AC1**: Given ProductA、When Core を submodule で取り込む、Then 正しくビルド・参照でき、検証完了後に ProductA は削除される。

---

## INVEST 自己検証
- **Independent**: エピック（フェーズ）内で各ストーリーは概ね独立。依存（例 US-2.3↔US-4.2）は明記。
- **Negotiable / Valuable**: 各ストーリーはペルソナの価値に紐づく。
- **Estimable / Small**: エピック→ストーリーの2階層で見積可能な粒度。
- **Testable**: 全ストーリーに Given/When/Then 受け入れ基準を付与。
