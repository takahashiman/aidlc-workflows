# FIG Universal Design System

**公共交通ドメイン向けの統一デザインシステム。三層アーキテクチャで実現する「資産化された設計」**

---

## 🎯 プロジェクト概要

FIG Universal Design System は、バスアプリケーション（busapp）から抽出された完全なデザインシステムです。

### ビジョン

- **統一ブランド**: FIGターコイズ（#26B7BC）をコア色として、すべてのプロダクトの一貫性を確保
- **資産化**: 三層アーキテクチャ（Primitive → Semantic → Component）により、次のプロジェクトが色変更だけで完成
- **流用可能**: Extensions 配下のテンプレートを複製するだけで、新規ブランドのデザインシステムが5分で立ち上げられる

### 完成度

✅ **100% 完了** — Inception + Construction フェーズ終了  
✅ 3優先コンポーネント実装（Card, Button & FAB, TextField）  
✅ ポータル（Central Hub）構築完了  
✅ 運用ガイド作成完了  

---

## 📚 ディレクトリ構成

```
FIG-Universal-Design-System/
├── index.html                           # ポータル（Central Hub）
├── DEPLOYMENT-GUIDE.md                  # 運用ガイド
├── README.md                            # このファイル
│
├── aidlc-docs/inception/                # Inception フェーズの成果物
│   ├── project-settings.json            # プロジェクト設定（色、プロファイル等）
│   ├── TECHNICAL-ENVIRONMENT.md         # AI 実装契約（三層アーキテクチャルール）
│   ├── VISION.md                        # 最終成果物の定義
│   ├── PHASE-1-PLAN.md                  # Phase 1（Card）実行計画
│   ├── PHASE-2-PLAN.md                  # Phase 2（Button & FAB）実行計画
│   ├── PHASE-3-PLAN.md                  # Phase 3（TextField）実行計画
│   ├── PHASE-4-PLAN.md                  # Phase 4（Assets Circulation）実行計画
│   └── requirement-verification-questions.md  # 要件確認質問（全問回答済み）
│
├── extensions/
│   └── busapp/                          # バスアプリ向けデザインシステム（テンプレート）
│       ├── project-settings.json        # busapp 固有設定
│       ├── README.md                    # busapp 使用ガイド
│       ├── components/
│       │   ├── Card.jsx                 # Card コンポーネント
│       │   ├── Button.jsx               # Button コンポーネント
│       │   ├── FAB.jsx                  # Floating Action Button
│       │   ├── TextField.jsx            # TextField（入力欄）
│       │   └── index.js                 # 統一エクスポート
│       ├── tokens/
│       │   ├── primitives.css           # Layer 1: 生値（HEX、px 等）
│       │   └── semantic.css             # Layer 2: 役割トークン
│       └── preview/
│           ├── card.html                # Card Live Preview
│           ├── button.html              # Button & FAB Live Preview
│           └── textfield.html           # TextField Live Preview
│
└── existing-code/                       # 既存実装（参照用）
    └── FIG Design System/               # 既存コードベース
        ├── components/*.spec.md         # 各コンポーネント仕様書
        ├── preview/                     # 既存プレビュー HTML
        ├── storybook/                   # Storybook ドキュメント
        └── tokens/                      # 既存トークン定義
```

---

## 🚀 クイックスタート

### 1. ポータルを確認

```bash
# index.html をブラウザで開く
open index.html
```

**表示される内容:**
- FIG Universal Design System 概要
- 各プロジェクト（busapp 等）の Live Preview
- Semantic トークン一覧
- 設計ガイドライン
- 複製テンプレート手順

### 2. 新規プロジェクトを作成

```bash
# busapp を複製
cp -r extensions/busapp extensions/[ProjectName]

# project-settings.json を編集
cd extensions/[ProjectName]
open project-settings.json
# projectName, signatureColor（hex）を編集

# ポータルで確認
cd ../..
open index.html
# 新規プロジェクトが自動登録されているか確認
```

### 3. React アプリケーションで使用

```jsx
import { Card, Button, FAB, TextField } from './extensions/[ProjectName]/components';

export function MyApp() {
  return (
    <Card variant="interactive">
      <Button variant="primary">クリック</Button>
      <TextField type="text" label="入力" value={value} onChange={setValue} />
      <FAB icon="plus" onClick={handleAdd} label="追加" />
    </Card>
  );
}
```

---

## 📖 ドキュメント

### Inception フェーズ

- **[project-settings.json](aidlc-docs/inception/project-settings.json)** — FIG Universal Design System の設定。色、プロファイル、トークン戦略等。
- **[TECHNICAL-ENVIRONMENT.md](aidlc-docs/inception/TECHNICAL-ENVIRONMENT.md)** — AI 実装契約。三層アーキテクチャの詳細ルール、PR チェックリスト等。
- **[VISION.md](aidlc-docs/inception/VISION.md)** — 最終成果物のイメージ。Extensions 流用テンプレート、ポータル構想、運用フロー等。

### Construction フェーズ

- **[PHASE-1-PLAN.md](aidlc-docs/inception/PHASE-1-PLAN.md)** — Card コンポーネント実装計画
- **[PHASE-2-PLAN.md](aidlc-docs/inception/PHASE-2-PLAN.md)** — Button & FAB 実装計画
- **[PHASE-3-PLAN.md](aidlc-docs/inception/PHASE-3-PLAN.md)** — TextField 実装計画
- **[PHASE-4-PLAN.md](aidlc-docs/inception/PHASE-4-PLAN.md)** — Assets Circulation 計画

### Assets Circulation フェーズ

- **[index.html](index.html)** — ポータル（Central Hub）。全プロジェクトの一元管理。
- **[DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)** — 運用ガイド。新規プロジェクトセットアップ、git submodule 統合、保守フロー等。
- **[extensions/busapp/README.md](extensions/busapp/README.md)** — busapp 使用ガイド。コンポーネント Props、複製テンプレート方法等。

---

## 🏗️ 三層アーキテクチャ

FIG Universal Design System は、以下の厳密な層分離により「資産化」を実現：

```
┌─────────────────────────────────────────────────┐
│ Layer 3: Component                              │
│ React JSX — Semantic トークンのみ参照             │
│ 直書き禁止、インラインスタイル禁止              │
└─────────────────────────────────────────────────┘
                    ↑ 参照のみ
┌─────────────────────────────────────────────────┐
│ Layer 2: Semantic                               │
│ CSS 変数 — 役割トークン（色、タイポ、影等）      │
│ --color-*, --typography-*, --surface-* 等       │
└─────────────────────────────────────────────────┘
                    ↑ 参照のみ
┌─────────────────────────────────────────────────┐
│ Layer 1: Primitive                              │
│ 基本値（HEX、px、数値）— 依存なし               │
│ --color-brand-primary: #26B7BC 等               │
└─────────────────────────────────────────────────┘
```

**ルール:**
- ❌ コンポーネント内に生値（#26B7BC, 14px等）を書かない
- ❌ Semantic から Primitive を直接参照しない
- ❌ Tailwind 任意値（text-[22px]等）を使わない
- ✅ すべてを CSS 変数経由で参照

→ 新色を `project-settings.json` で指定するだけで、すべてのコンポーネントが自動的に新色に更新される

---

## 🎨 コンポーネント一覧

### Phase 1: Card（完了）

- **用途:** コンテナコンポーネント。リスト要素、情報ブロック等
- **バリエーション:** Default, Interactive, Floating, Hero
- **状態:** Default, Hover, Disabled, Error（5状態）
- **ファイル:** [extensions/busapp/components/Card.jsx](extensions/busapp/components/Card.jsx)

### Phase 2: Button & FAB（完了）

**Button:**
- **用途:** ユーザーアクション（決済、検索等）
- **バリエーション:** Primary, Secondary, Ghost, Destructive
- **アイコン:** Leading / Trailing 配置対応
- **ファイル:** [extensions/busapp/components/Button.jsx](extensions/busapp/components/Button.jsx)

**FAB:**
- **用途:** 浮遊アクション
- **配置:** Bottom-Right, Bottom-Left, Bottom-Center
- **サイズ:** Default (56px), Large (64px)
- **ファイル:** [extensions/busapp/components/FAB.jsx](extensions/busapp/components/FAB.jsx)

### Phase 3: TextField（完了）

- **用途:** テキスト入力、検索、数値入力等
- **バリエーション:** Text, Search, Numeric, Password, Select
- **機能:** Label / Hint / Error メッセージ、Clear ボタン、Password トグル
- **アクセシビリティ:** aria-* 属性完全対応
- **ファイル:** [extensions/busapp/components/TextField.jsx](extensions/busapp/components/TextField.jsx)

---

## 🔄 複製テンプレート化の実現

### 仕組み

1. **extensions/busapp 全体をコピー**
2. **project-settings.json の signatureColor を新規色に変更**
3. **CSS 変数が自動的に新色に置換される**
4. **React JSX は一切変更されない**

→ エンジニアが 1 行もコードを修正しない

### 具体例

```bash
# busapp（FIGターコイズ #26B7BC）を複製
cp -r extensions/busapp extensions/ticketing-app

# project-settings.json を編集
cd extensions/ticketing-app
# signatureColor.hex を #38A1DB（FIGブルー）に変更

# ポータルで確認
cd ../..
open index.html
# → Ticketing App が新規色（#38A1DB）で自動表示される
# → React コンポーネント JSX は変更されていない
```

---

## 🚢 git submodule による配布

### 他プロジェクトへの統合

```bash
# ProductA に FIG Universal Design System を submodule として追加
cd ProductA/
git submodule add https://[repo-url]/FIG-Universal-Design-System.git design-system

# セットアップ
git submodule update --init --recursive
cd design-system && git checkout main && cd ..

# コミット
git add .gitmodules design-system/
git commit -m "chore: add FIG Universal Design System as submodule"
```

### 更新フロー

```bash
# 中央で修正
cd FIG-Universal-Design-System/extensions/busapp/
# components / tokens を修正
git commit -m "fix(card): improve contrast"
git push origin main

# 各プロダクトが同期
cd ProductA/design-system/
git pull origin main
# 最新の修正が自動反映される
```

---

## 📋 チェックリスト

### Inception フェーズ

- ✅ 要件確認質問に全問回答
- ✅ project-settings.json 生成
- ✅ TECHNICAL-ENVIRONMENT.md 作成
- ✅ VISION.md 作成

### Construction フェーズ

- ✅ Phase 1（Card）完了
  - ✅ Live Preview HTML
  - ✅ React 実装
  - ✅ Semantic トークン完全化

- ✅ Phase 2（Button & FAB）完了
  - ✅ Live Preview HTML
  - ✅ React 実装
  - ✅ Semantic トークン完全化

- ✅ Phase 3（TextField）完了
  - ✅ Live Preview HTML
  - ✅ React 実装
  - ✅ Semantic トークン完全化

### Assets Circulation フェーズ

- ✅ ポータル（index.html）構築
- ✅ 複製テンプレート化完了
- ✅ 運用ガイド（DEPLOYMENT-GUIDE.md）作成
- ✅ git submodule 統合可能

---

## 🔗 次のステップ

### Phase 5 以降（将来の検討）

- [ ] npm パッケージ化（@fig/design-system として npm publish）
- [ ] Figma Code Connect 連携（Figma コンポーネントと自動同期）
- [ ] 複数プロファイル対応（Mobile-Terminal, Web-Admin 等）
- [ ] Storybook 自動生成
- [ ] アクセシビリティ監査（WCAG 2.1 AAA 準拠）

---

## 📞 サポート

### ドキュメント

- **三層アーキテクチャについて** → [TECHNICAL-ENVIRONMENT.md](aidlc-docs/inception/TECHNICAL-ENVIRONMENT.md)
- **新規プロジェクトセットアップ** → [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)
- **コンポーネント使用方法** → [extensions/busapp/README.md](extensions/busapp/README.md)
- **複製テンプレート化** → [VISION.md](aidlc-docs/inception/VISION.md)

### 質問

GitHub Issues または Slack で報告してください。

---

## 📄 ライセンス

FIG Universal Design System は内部利用を想定しています。  
外部公開時はライセンスを明記してください。

---

## 🎉 まとめ

このプロジェクトは、**AI-DLC（AI-Driven Lifecycle）** により、以下を実現しました：

1. **Inception フェーズ** — 要件確認 + 設計定義（プロジェクト、トークン、ガイドライン等）
2. **Construction フェーズ** — 3優先コンポーネント実装（5日間）
3. **Assets Circulation フェーズ** — ポータル構築 + 複製テンプレート化 + 運用ガイド

**最終成果:**
- ✅ 三層アーキテクチャ 100% 遵守
- ✅ Semantic トークンによる完全統治
- ✅ 新規プロジェクト 5 分立ち上げ可能
- ✅ AI のハルシネーション防止
- ✅ git submodule による中央管理

---

**作成者:** AI-DLC Project  
**完成日:** 2026-06-03  
**ステータス:** ✅ Production Ready
