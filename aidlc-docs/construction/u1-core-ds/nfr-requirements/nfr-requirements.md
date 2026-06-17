# U1 Core DS — NFR Requirements

> 全体 NFR を U1 に具体化。決定: NRQ1=ソースのみ配布 / NRQ2=トークン普遍＋React参照実装 / NRQ3=モダン・エバーグリーン。

## アクセシビリティ（最重要）
- **WCAG 2.1 AA** 準拠（コントラスト 4.5:1 以上、タップ領域 44×44px 以上、フォーカス可視、aria 適正）
- `prefers-reduced-motion` 追従（既存 motion 設計踏襲）
- 3プロファイル（Admin/Consumer/Terminal）すべてで a11y 成立

## パフォーマンス
- Core DS は**ソースのみ配布**（ビルド成果物を持たない）。バンドル最適化は消費側の責務
- CSS は Custom Properties による軽量設計。生値直書きなし
- motion 予算を踏襲（過剰アニメーション禁止、`0.01ms` 手法で `onTransitionEnd` 維持）
- 対象: **モダン・エバーグリーン**（Chrome/Edge/Safari/Firefox 最新）。レガシー非対象

## 保守性
- **三層アーキテクチャ**徹底（Component→Semantic→Primitive）。U5 Lint で機械検査
- 最小ドキュメント主義（コードと spec が正典）。各コンポーネントはフル spec＋preview
- 共有 Lint 設定（CD-7）を配布し全 repo で同一規約

## 信頼性
- **後方互換**: 改名は旧名エイリアス/ラッパー、破壊的は MAJOR＋移行ガイド
- **SemVer** による予測可能なリリース

## 可用性
- サービス稼働の概念なし（git 配布）。ポータルは GitHub Pages（U2）、Core は git tag 取得

## スケーラビリティ
- コンポーネント/トークン追加は MINOR で拡張。taxonomy 多階層で製品増に対応

## セキュリティ（Security Baseline 有効・U1 適用判定）
| Rule | 適用 | U1 方針 |
|---|---|---|
| SECURITY-10 サプライチェーン | **適用** | Core repo の依存を lock 固定・脆弱性スキャン（U5 CI）・`latest` 禁止 |
| SECURITY-13 完全性 | **部分適用** | 外部 CDN を使う場合 SRI。CI 定義のアクセス制御（U5） |
| SECURITY-09 ハードニング | **部分適用** | デモ/既定ページの混入防止、エラー詳細非露出（消費アプリ側で主に評価） |
| SECURITY-04/15 | 後続評価 | ヘッダ/例外は U2 ポータル・消費アプリで評価 |
| その他(01/02/03/05/06/07/08/11/12/14) | **N/A** | データストア/API/認証/インフラが U1 に存在しない |

## usability
- コンポーネントは **CSS クラス（`.fig-*`）＋トークン**で提供（framework 非依存）。class 付与だけで誰でも利用可。React/JSX は各拡張の任意ラッパー（Core には持たない）
- 玄人最適化 IA はポータル（U2）で実現、Core は spec/preview の明快さで担保
