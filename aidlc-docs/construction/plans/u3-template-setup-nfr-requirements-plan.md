# U3 Template & Setup — NFR Requirements Plan

> プロジェクト全体 NFR（WCAG 2.1 AA／Security Baseline 有効／SemVer／三層／PBT 無効）は確定済み。
> ここでは **U3 固有の非機能要件・技術選択**を確定する。FD 確定: FDQ全A（standalone fig-ext-template・project-settings 単一契約・submodule pin+CORE-DS-VERSION・registry 自動 PR・マルチレポ分離・Generator 正典 U3）。
> 下部 `[Answer]:` にご記入ください。A=推奨。

## 生成する成果物（チェックリスト）
- [x] `nfr-requirements.md` — U3 の信頼性(冪等)/セキュリティ(PR権限・スコープ)/保守性/アクセシビリティ/供給チェーン要件
- [x] `tech-stack-decisions.md` — テンプレ/Generator/セットアップの技術選定と根拠

## 確認質問

### NRQ1. Interactive Prompt Generator の実装スタック
既存 `ai-co-creation.js`（vanilla JS・IIFE）を正典化（FDQ8=A）。
- A) **vanilla JS 踏襲（フレームワーク非導入）**。既存資産を保守・最小依存（推奨：ADQ1/U2 と整合）
- B) フレームワーク導入（依存増）
- X) Other

[Answer]: A

### NRQ2. AI セットアップの信頼性（冪等・検証）
runbook（複製→置換→pin→CI→registry PR）の品質担保。
- A) **冪等実行＋完了検証チェックリスト＋dry-run（差分プレビュー）**を必須化。失敗は当該ステップで停止し理由提示（推奨：BR-IDEM 準拠）
- B) ベストエフォート（冪等性は努力目標）
- X) Other

[Answer]: A

### NRQ3. registry/taxonomy 自動 PR の権限・安全性（Security）
AI が Core DS へ登録 PR を起票（ADQ3=A+）。
- A) **最小権限トークン＋ブランチ経由 PR＋CI 検査(U5/CI-5)＋Maintainer 必須レビュー**。直接 push 禁止・registry 直接編集禁止（単一正典）（推奨）
- B) 自動マージまで許容（レビュー省略）
- X) Other

[Answer]: A

### NRQ4. テンプレ/CI の供給チェーン安全性（Security Baseline）
- A) **Core は submodule で pin＋CORE-DS-VERSION 整合検査／CI の GitHub Actions は SHA pin／依存は SCA（npm audit 等）**。秘密はリポジトリに置かずシークレット管理（推奨）
- B) 最新タグ追従（pin 緩め）
- X) Other

[Answer]: A

### NRQ5. スコープ分離の強制レベル（US-3.4）
- A) **マルチレポ物理分離＋ScopeManifest(SKILL/AGENTS)で明文化**。AI に渡すコンテキストは Core＋対象製品のみ（規約＋手順で強制）（推奨）
- B) 規約のみ（手順明文化なし）
- X) Other

[Answer]: A

### NRQ6. Generator のアクセシビリティ／ブラウザ対象
- A) **WCAG 2.1 AA（フォーム a11y）＋モダン・エバーグリーン**（U2/Core と整合）（推奨）
- B) 数値/対象を定めない
- X) Other

[Answer]: A

### NRQ7. テンプレ初期化の実行環境
project-settings 駆動の変数適用（signature/profile/版）の実行手段。
- A) **Node スクリプト（最小依存）でローカル/CI 双方から冪等実行**（U2 build と同系・オフライン可）（推奨）
- B) 手動手順のみ（スクリプト化しない）
- X) Other

[Answer]: A
