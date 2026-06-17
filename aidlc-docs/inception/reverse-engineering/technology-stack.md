# Technology Stack

> Reverse Engineering 成果物 — 既存技術スタック

## Programming Languages
- **JavaScript / JSX** — React コンポーネント実装（busapp: Card/Button/FAB/TextField）
- **CSS（Custom Properties）** — 三層トークン（primitives.css = 生値 / semantic.css = 役割トークン）
- **HTML** — ライブプレビュー / ポータル（index.html, preview/*.html）
- **Markdown** — コンポーネント spec（.spec.md）、設計ドキュメント

## Frameworks
- **React** — UI コンポーネント（拡張プロジェクト）
- **CRACO**（ProductA）— Create React App 設定上書き。`@design-system` エイリアス、ModuleScopePlugin 除去で submodule 外 import を許可

## デザインシステム方式
- **三層アーキテクチャ**: Primitive → Semantic → Component（上位は下位のみ参照、逆流禁止）
- **プロファイル方式**: `.fig-profile-*` クラスで CSS 変数を上書きしマルチプロファイル対応。**3プロファイル**＝ Web-Admin（PC・情報密度優先）／ Mobile-Consumer（スマホ・操作性優先）／ Mobile-Terminal（業務端末・固定視認性）
- **インラインスタイル禁止**: Semantic トークンのみ参照（ハルシネーション防止）

## Infrastructure / 配布
- **git submodule** — Core DS 配布機構（中央 Core → 各プロジェクトが pull で同期）
- **GitHub** — リポジトリホスティング、将来 GitHub Pages で HTML 共有予定

## Build Tools
- **npm** — パッケージ管理（ProductA: package.json / package-lock.json）
- **CRACO** — ビルド設定（ProductA）

## Testing Tools
- 現状デザイン資産側に自動テストは未整備（手動視覚確認=Live Preview を優先する方針 / 旧 project-settings.json）

## 大元（ポータル）の品質ツール
- セキュリティ/静的解析: `.bandit`, `.checkov.yaml`, `.gitleaks.toml`, `.grype.yaml`, `.semgrepignore`
- Lint/整形: `.markdownlint-cli2.yaml`, `.pre-commit-config.yaml`
- リリース: `cliff.toml`, `CHANGELOG.md`（git-cliff）
