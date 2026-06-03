# VISION.md — FIG Universal Design System

## 最終成果物の定義

**作成日:** 2026-06-03  
**対象:** FIG Universal Design System / FIGブランド統一デザインシステム  
**時間軸:** Construction フェーズ（5日間） → Assets Circulation フェーズ（1-2日）

---

## 1. ビジョン：「資産化された設計」

### ゴール（5日間後）

**三層アーキテクチャの完全なカプセル化により、次のエンジニアが以下のステップだけで新規プロジェクトのデザインを完成させられる状態。**

```
1. extensions/[projectName]/ ディレクトリをコピー
2. project-settings.json の signatureColor を新規色に置換
3. npm install / yarn install
4. デバイスフレーム上で確認 → 完了

React コンポーネント JSX、Semantic トークン、Live Preview HTML すべてが
新規色で自動的に再レンダリング。エンジニアが 1 行も コードを修正しない。
```

### 実現の鍵：「Semantic トークンの完全統治」

新色適用が「自動化」できるのは、以下の 3 条件を満たすため：

1. **Layer 3 (React) が生値を持たない** — インラインスタイル / 直書き / hardcoded color 値なし
2. **Layer 2 (Semantic) が一元管理** — すべての視覚的意味づけが CSS 変数で定義
3. **Layer 1 (Primitive) が project-settings.json から導出可能** — signatureColor → Primitive 色群 → Semantic 値

→ project-settings.json を書き換える = デザイン全体が新規色で統一される「魔法」が実現

---

## 2. Extensions ディレクトリ構造（流用テンプレート）

### 完成形イメージ

```
extensions/
├── busapp/                          # 既存実装（参照）
│   ├── project-settings.json
│   ├── README.md
│   ├── components/
│   │   ├── Card.jsx
│   │   ├── Button.jsx
│   │   └── TextField.jsx
│   ├── tokens/
│   │   ├── primitives.css
│   │   └── semantic.css
│   └── preview/
│       ├── card.html
│       ├── button.html
│       └── textfield.html
│
├── [newProjectName]/               # 新規プロジェクト（複製テンプレート）
│   ├── project-settings.json       # ← signatureColor のみ新規値に置換
│   ├── README.md                   # ← 最小限
│   ├── components/                 # ← busapp から複製、JSX は 1 行も変更しない
│   │   ├── Card.jsx
│   │   ├── Button.jsx
│   │   └── TextField.jsx
│   ├── tokens/
│   │   ├── primitives.css          # ← 自動導出可能
│   │   └── semantic.css            # ← primitives.css に基づく
│   └── preview/
│       ├── card.html
│       ├── button.html
│       └── textfield.html
```

### 複製の手順書（README.md の内容例）

```markdown
# [Project Name] — FIG Universal Design System 実装

## セットアップ

1. このディレクトリを新規プロジェクト用フォルダにコピー
2. project-settings.json を開き、signatureColor の値を新規ブランド色に置換
3. npm install / yarn install
4. プレビュー HTML をブラウザで開く

## ファイル構成

- `project-settings.json` — ブランド色、プロファイル、トークン戦略
- `components/` — 再利用可能なコンポーネント
- `tokens/` — Primitive / Semantic CSS 変数
- `preview/` — Live Preview HTML

## 構成ルール

三層アーキテクチャを参照。TECHNICAL-ENVIRONMENT.md を確認。
```

---

## 3. ポータル（Central Hub）の構想

### 機能

1. **デザインシステム の概要表示**
   - FIG Core のブランド色、哲学
   - 優先コンポーネント（Card, Button, TextField）の仕様

2. **プロジェクト別タブ**
   - 各 extensions/[projectName]/ の Live Preview の埋め込み
   - project-settings.json の summary 表示

3. **Semantic トークンの可視化**
   - 全 `--color-*`, `--typography-*`, `--motion-*` の一覧
   - 色サンプル + 16進数コード

4. **更新履歴（git log の簡略版）**
   - 中央リポジトリのコミット履歴

### 実装順序

**Phase 1-3:** Live Preview HTML を extensions/[projectName]/preview/ に配置  
**Phase 4:** assets/js/portal-content.js に自動登録スクリプト  
**Phase 4+:** Web ポータルの UI 構築（Storybook 連携は後回し）

---

## 4. Distribution / 運用フロー

### git submodule による連携

**構成:**
```
[ProductA]/
├── design-system/     ← FIG Universal Design System (submodule)
│   ├── extensions/fig-productA/
│   └── ...
└── package.json
```

### 更新フロー

1. **中央（FIG Universal Design System）で修正**
   ```bash
   git add components/Card.jsx tokens/semantic.css
   git commit -m "fix(card): improve hover state contrast"
   ```

2. **各プロダクトが pull**
   ```bash
   cd ProductA/design-system/
   git pull origin main
   ```

---

## 5. 品質指標（完了の証拠）

### Construction フェーズ完了時の checklist

| 項目 | 完了条件 |
|-----|--------|
| **Primitive** | primitives.css が完全、base value が全定義 |
| **Semantic** | semantic.css に全 `--color-*`, `--typography-*` 等が登録 |
| **Component** | Card/Button/TextField の JSX が生値なし |
| **Live Preview** | 5 状態以上を視覚確認 |
| **Tokens** | semantic.json が更新、project-settings.json に記録 |
| **Template** | extensions/busapp を複製して新色に置換するだけで動作 |

---

## 6. 期待効果

### エンジニア視点
- **開発速度:** 新規プロジェクトのデザイン構築が「複製 + 色変更」で 5 分以内
- **保守性:** 統一された Semantic トークン → コンポーネント実装が予測可能
- **品質:** 三層アーキテクチャ遵守 → AI のハルシネーション防止

### ユーザー視点（プロダクト側）
- **一貫性:** FIG ブランドが全プロダクトで統一
- **アクセシビリティ:** Semantic トークン = アクセシビリティ品質の一括管理

### 組織視点
- **Single Source of Truth:** ポータルが唯一の設計定義
- **スケーラビリティ:** 新規プロジェクト追加時、複製だけで対応

---

## 7. リスク管理

### リスク 1: 現場環境での視認性
**対策:** エンジニアの目による最終検収を必須、複数デバイスで確認

### リスク 2: AI による過剰生成
**対策:** TECHNICAL-ENVIRONMENT.md で strict rule を定義、PR チェックリスト で確認

### リスク 3: ポータルの陳腐化
**対策:** 自動登録スクリプトで常時同期、git submodule により linked 状態を維持

---

## 最終的なメッセージ

**このデザインシステムの成功の定義は、「次のエンジニアが、コードを 1 行も修正せず、新規プロジェクトのデザインを完成させられること」です。**

そのためには：

1. **三層アーキテクチャの完全な遵守**
2. **Semantic トークンの完全統治**
3. **ドキュメント（project-settings.json + README.md）の最小化**

**AI との付き合い方:**
- AI は「設計システムの番犬」ではなく、「三層アーキテクチャの実装者」
- ルール違反を見つけたら即 reject し、理由を明記して指導
- AI 自身も自分のコードを検証する癖をつける

---

**最終更新:** 2026-06-03  
**ステータス:** Inception フェーズ完了
