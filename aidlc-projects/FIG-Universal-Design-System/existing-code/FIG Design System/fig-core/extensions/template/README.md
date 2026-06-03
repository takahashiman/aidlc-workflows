# {Your Project Display Name}

> FIG Universal Design System を活用した新規プロジェクトのテンプレート。
> このディレクトリを `extensions/{your-project-name}/` にコピーして使用してください。

## このディレクトリの構成

```
extensions/{your-project-name}/
├── README.md                 ← 本ファイル（プロジェクト概要を記載）
├── project-settings.json     ← プロジェクト設定（必須）
├── index.html                ← 最小スターター HTML
├── styles/
│   └── extensions.css        ← プロジェクト固有スタイル（任意）
└── components/
    └── .gitkeep              ← プロジェクト固有部品を置く場所
```

## 使い方

### 1. ディレクトリを複製
```bash
# Bash / WSL
cp -r extensions/template extensions/{your-project-name}

# Windows PowerShell
Copy-Item -Recurse extensions/template extensions/{your-project-name}
```

### 2. project-settings.json を編集
必須項目：
- `projectName`（ケバブケース・英小文字）
- `displayName`（表示名）
- `designSystem.profile`（`Web-Admin` / `Mobile-Consumer` / `Mobile-Terminal` から選択）
- `signatureColor`（独自識別色）

詳細は [Developer Guide / Project Duplication](../../#/developer/guide/project-duplication) を参照。

### 3. index.html をプロジェクト用に書き換え
`<body class="fig-profile-*">` のプロファイルを project-settings.json に合わせる。

### 4. ポータルへ登録
`assets/js/portal-content.js` の `SITEMAP.extensions.sections` に追記。

## ルール

- ✅ Core トークン（`--fig-*` / `--color-*`）経由でスタイル指定
- ❌ 生 px / 生 hex の直書き禁止
- ✅ クラス名は `.{project-name}-*` 形式（衝突回避）
- ❌ `.fig-*` クラスを上書きしない

## チェックリスト

- [ ] `project-settings.json` の必須項目を埋めた
- [ ] `index.html` のプロファイルクラスを設定
- [ ] ポータルから自プロジェクトページが開ける
- [ ] Profile Switcher を切り替えても表示が壊れない
- [ ] このREADME を自プロジェクト用に書き換えた

## 関連リンク

- [Getting Started](../../#/developer/guide/getting-started)
- [Version Management](../../#/developer/guide/version-management)
- [Project Duplication](../../#/developer/guide/project-duplication)
- [Contribution](../../#/developer/guide/contribution)
