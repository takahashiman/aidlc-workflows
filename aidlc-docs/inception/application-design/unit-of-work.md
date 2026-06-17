# Unit of Work — 定義

> 7 Unit（UQ1=A）。1 Unit ≒ 1 リポジトリ/独立成果。オーナーは UQ2=A、Sandbox は独立 U7（UQ3=A）。

## U1. Core DS `[Phase①]`
- **リポジトリ**: `FIG-Core-DS`
- **責務**: 三層トークン・24コンポーネント・3プロファイル・SemVer・**registry/taxonomy 正典**・共有 Lint 設定・昇格資産（Core Maintainer 統治）
- **含む**: CD-1〜8
- **オーナー**: Core Maintainer 主導 ＋ エンジニア（メタデータは Core Maintainer）
- **成果の核**: 全 Unit の親（クリティカルパス）

## U2. Portal `[Phase②]`
- **リポジトリ**: `aidlc-workflows`
- **責務**: vanilla JS SPA、3区分IA＋使い方、サイドナビ（taxonomy 駆動）、Project View（iframe デモ）、版ダッシュボード、showcase ビュー、GitHub Pages 公開、rolling 参照
- **含む**: PT-1〜8
- **オーナー**: エンジニア主導

## U3. Template & Setup `[Phase③a]`
- **リポジトリ**: `fig-ext-template` ＋ Interactive Prompt Generator
- **責務**: GitHub Template、AI 自律セットアップ（複製・変数置換・CI 配線・`CORE-DS-VERSION`）、**registry 自動 PR ガードレール**
- **含む**: TM-1〜3
- **オーナー**: エンジニア主導（P4 AI エージェント協働）

## U4. Migration（既存取り込み）`[Phase③b]`
- **リポジトリ**: 各既存製品 → `fig-ext-<category>-<product>`
- **責務**: 既存 repo 化、Core submodule pin、段階移行（画面内混在禁止）、完了判定（主要フロー100%＋全体≧80%）、後方互換ラッパー
- **含む**: EX-1〜4、SV-4、移行チェックリスト
- **オーナー**: 移行担当

## U5. CI/CD Automation `[Phase④]`
- **リポジトリ**: 共有設定 ＋ 各 repo の workflow
- **責務**: 三層ガードレール Lint、VRT（マージ条件）、バージョン自動収集、registry 登録検査
- **含む**: CI-1, CI-2, CI-3, CI-5
- **オーナー**: エンジニア主導

## U6. Showcase `[Phase⑤]`
- **リポジトリ**: CI-4（収集）＋ `aidlc-workflows`（PT-6 ビュー）
- **責務**: Core 未満の独自/仮パーツを自動クローリングし横断一覧化、発見・昇格提案導線
- **含む**: CI-4、Showcase View
- **オーナー**: エンジニア主導

## U7. Sandbox（横断）
- **リポジトリ**: `ProductA`
- **責務**: Core を submodule で正しく引けるか検証。**検証完了後に削除**
- **含む**: SB-1
- **オーナー**: エンジニア
