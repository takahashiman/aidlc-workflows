# U1 Core DS — NFR Requirements Plan

> プロジェクト全体 NFR（WCAG 2.1 AA／Security Baseline／SemVer／三層／PBT無効）は確定済み。
> ここでは **U1 Core DS 固有の技術選択**を確定する。下部 `[Answer]:` にご記入ください。

## 生成する成果物（チェックリスト）
- [x] `nfr-requirements.md` — U1 の性能/可用性/保守性/アクセシビリティ/セキュリティ要件
- [x] `tech-stack-decisions.md` — Core DS の技術選定と根拠

## 確認質問

### NRQ1. Core DS の配布形態
拡張は submodule で取り込む（ADQ6=A）。Core DS が**何を**配布するか。

A) **ソースのみ配布**（CSS トークン＋コンポーネント source。消費側がビルド）（推奨：submodule に整合・ビルド成果物を持たない・最小保守）
B) ビルド済み成果物も同梱（minified CSS/JS）
X) Other

[Answer]: A

### NRQ2. Core DS コンポーネントのフレームワーク戦略 ★重要
ADQ1 で「拡張は必ずしも React 統一でない」とのこと。CSS トークンは framework 非依存ですが、コンポーネント実体の方針を確定します。

A) **トークン(CSS)＝普遍 ＋ React/JSX を参照実装**（既存 busapp/ProductA と整合。非 React チームはトークン＋CSS を使い独自実装。コンポーネントは「正解の型」として参照）（推奨：既存資産活用・現実的）
B) **framework 非依存の Web Components**（custom elements）でコンポーネント自体を全 framework から利用可能に（理想だが既存 JSX の作り直しコスト大）
C) **トークンのみを正典**とし、コンポーネント実装は各チーム任せ（Core はトークン＋spec のみ）
X) Other

[Answer]: A

### NRQ3. ブラウザ対象とパフォーマンス
A) **モダン・エバーグリーン**（Chrome/Edge/Safari/Firefox 最新）＋既存の motion 予算/`prefers-reduced-motion` 踏襲（推奨）
B) レガシー（IE 等）も対象
X) Other

[Answer]: A
