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
- `signatureColor.value` / `name`（独自識別色）
- `signatureColor.harmonization`（[Hue × Taste マトリクス](../../tokens/signature-presets.json) から 1 セル選択 → preset / hue / taste / relation / baseToken が一括確定）

詳細は [Developer Guide / Project Duplication](../../#/developer/guide/project-duplication) と [Color System & Palette](../../#/core/foundations/color-system) を参照。
プリセットを対話的に選びたい場合は [AI Co-creation](../../#/developer/guide/ai-co-creation#ai-generator) の Generator を利用。

### 3. index.html をプロジェクト用に書き換え
`<body class="fig-profile-*">` のプロファイルを project-settings.json に合わせる。
CSS の読み込み順は `primitives → semantic → tokens/signature.css → tokens/base → tokens/profile-* → tokens/components → ./styles/extensions.css`。

### 3-a. styles/extensions.css で `--color-signature` を上書き
```css
:root {
  --color-signature: #007A7A;   /* project-settings.json の signatureColor.value と一致 */
}
```
これだけで `--color-signature-light` / `-dark` / `-tint` / `-shadow` が `tokens/signature.css` から自動派生します。直接これらを上書きしないこと。

### 4. ポータルへ登録
`assets/js/portal-content.js` の `SITEMAP.extensions.sections` に追記。

## ルール

- ✅ Core トークン（`--fig-*` / `--color-*`）経由でスタイル指定
- ❌ 生 px / 生 hex の直書き禁止
- ✅ クラス名は `.{project-name}-*` 形式（衝突回避）
- ❌ `.fig-*` クラスを上書きしない

## チェックリスト

- [ ] `project-settings.json` の必須項目を埋めた（`signatureColor.harmonization.preset` を含む）
- [ ] `styles/extensions.css` の `:root { --color-signature: ...; }` が `signatureColor.value` と一致
- [ ] `index.html` のプロファイルクラスを設定
- [ ] `index.html` で `tokens/signature.css` を読み込み済み
- [ ] ポータルから自プロジェクトページが開ける
- [ ] Profile Switcher を切り替えても表示が壊れない
- [ ] このREADME を自プロジェクト用に書き換えた

## 関連リンク

- [Getting Started](../../#/developer/guide/getting-started)
- [Version Management](../../#/developer/guide/version-management)
- [Project Duplication](../../#/developer/guide/project-duplication)
- [Contribution](../../#/developer/guide/contribution)
