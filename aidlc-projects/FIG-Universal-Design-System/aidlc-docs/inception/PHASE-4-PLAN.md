# Phase 4: Assets Circulation — 実行計画書

**期間:** 1-2日  
**目標:** Extensions の完全なカプセル化と ポータル（Central Hub）の構築  
**成功条件:** 複製テンプレート動作確認 + ポータル表示 + 運用ガイド完成

---

## Phase 4 の実装内容

### タスク 4.1: ポータル（index.html）の構築

**目的:** FIG Universal Design System の「唯一の真実の情報源（Single Source of Truth）」を実現

**内容:**
- `index.html` — ポータル トップページ
- 全 extensions（busapp, [新規プロジェクト], ...）を一覧表示
- 各プロジェクトの Live Preview を埋め込み
- Semantic トークンの可視化（色、タイポグラフィ、モーション）
- 更新履歴（git log の簡略版）

**セクション構成:**

```html
<section id="overview">
  <!-- FIG Universal Design System 概要 -->
  - ブランド説明
  - 三層アーキテクチャ説明
  - デザイン哲学
</section>

<section id="projects">
  <!-- 各プロジェクトのタブ -->
  <tab data-project="busapp">
    - project-settings.json サマリー
    - Live Preview 埋め込み (card.html, button.html, textfield.html)
    - 複製手順へのリンク
  </tab>
  <tab data-project="[newProjectName]">
    <!-- 同じ構成 -->
  </tab>
</section>

<section id="tokens">
  <!-- Semantic トークンの一覧 -->
  - Color swatches + hex codes
  - Typography samples + CSS variables
  - Motion curves + easing functions
  - Elevation / Shadow definitions
</section>

<section id="guidelines">
  <!-- 設計ガイドライン -->
  - 三層アーキテクチャ図
  - 禁止事項（直書き禁止等）
  - 複製テンプレートの使い方
</section>

<section id="updates">
  <!-- 更新履歴 -->
  - git log（最新 10 コミット程度）
  - 各プロジェクトの最終更新日
</section>
```

### タスク 4.2: 自動登録スクリプト（portal-content.js）の実装

**目的:** 新規プロジェクト追加時、ポータルが自動的にタブを生成

**内容:**
- `assets/js/portal-content.js` — JavaScript スクリプト
- extensions/ ディレクトリをスキャン
- project-settings.json を読み込み
- ポータル内に新規プロジェクトのタブを動的生成

**処理フロー:**

```javascript
1. extensions/ 配下のディレクトリ一覧を取得
2. 各ディレクトリの project-settings.json を読み込み
3. 以下の情報をポータル UI に反映：
   - projectName
   - signatureColor
   - designSystem.profile
   - components リスト（状態別）
4. Live Preview の iframe を自動生成
5. タブの切り替え機能を実装
```

### タスク 4.3: 複製テンプレート確認

**目的:** busapp を複製して、新規プロジェクトが自動生成できるか検証

**手順:**

```bash
1. extensions/busapp を extensions/sample-project にコピー
2. sample-project/project-settings.json を編集：
   - projectName → "Sample Project"
   - signatureColor → 新規色（例：#38A1DB）
   - harmonization を新規色に合わせて記述
3. ポータルを開く → sample-project が自動登録されているか確認
4. sample-project/preview/card.html → 新規色で表示されているか確認
5. React コンポーネント JSX は変更されていないか確認
```

### タスク 4.4: 運用ガイド（DEPLOYMENT-GUIDE.md）の作成

**目的:** 次のエンジニアが新規プロジェクトをセットアップできるように

**内容:**

```markdown
# FIG Universal Design System — デプロイメント・運用ガイド

## 新規プロジェクトのセットアップ

### ステップ 1: Extensions をコピー
```bash
cp -r extensions/busapp extensions/[ProjectName]
```

### ステップ 2: project-settings.json を編集
- projectName
- projectId
- signatureColor（新規ブランド色）
- harmonization（新規色と Core 色の関係）

### ステップ 3: ポータルで確認
```bash
open index.html
# 新規プロジェクトが自動登録されているか確認
```

### ステップ 4: git submodule として他プロジェクトに統合
```bash
cd ProductA
git submodule add https://[repo-url] design-system
cd design-system
git checkout main
```

## 保守・更新フロー

### 中央で修正する場合
```bash
cd extensions/busapp/
# components や tokens を修正
git add .
git commit -m "fix(card): ..."
git push origin main
```

### 各プロダクトで同期する場合
```bash
cd ProductA/design-system
git pull origin main
# 最新のコンポーネント / トークンが反映される
```

## トラブルシューティング

### 新規色が反映されない
→ primitives.css の --color-brand-primary が正しく置換されているか確認

### コンポーネントが表示されない
→ semantic.css と tokens/ ディレクトリが正しく配置されているか確認

### ポータルに新規プロジェクトが表示されない
→ extensions/[ProjectName]/project-settings.json が存在するか確認
→ JSON 形式が正しいか確認（Cursor の JSON schema validation を活用）
```

---

## 完了の証拠（チェックリスト）

### ポータル

- [ ] `index.html` が存在し、ブラウザで開くと表示される
- [ ] 「概要」「プロジェクト」「トークン」「ガイドライン」「更新履歴」セクションが表示
- [ ] busapp タブがアクティブで、Live Preview が埋め込まれている
- [ ] タブ切り替えが動作する
- [ ] Semantic トークン（色、タイポ、モーション）が可視化されている

### 自動登録スクリプト

- [ ] `assets/js/portal-content.js` が存在
- [ ] JavaScript エラーがなく実行される
- [ ] 新規プロジェクトをコピーすると、ポータルに自動登録される

### 複製テンプレート検証

- [ ] extensions/busapp → extensions/sample-project への複製完了
- [ ] sample-project/project-settings.json を新規色に変更
- [ ] ポータルで sample-project が表示される
- [ ] sample-project/preview/card.html が新規色で表示される
- [ ] sample-project/components/*.jsx が変更されていない（検証済み）

### 運用ガイド

- [ ] `DEPLOYMENT-GUIDE.md` が存在
- [ ] 新規プロジェクトセットアップの手順が明確
- [ ] git submodule 統合方法が記載
- [ ] トラブルシューティングセクションが充実

---

## 成功の定義

**「ポータルを開いて、複製されたテンプレートが自動登録され、新規色で表示される」状態。**

つまり：
1. ポータルが唯一の真実の情報源として機能している ✅
2. Extensions の複製テンプレート化が証明されている ✅
3. 自動登録スクリプトが新規プロジェクトを検知する ✅
4. 新規色が CSS 変数を通じて自動反映される ✅
5. 次のエンジニアが運用ガイドで独立してセットアップ可能 ✅

→ **AI-DLC Complete — 資産化と循環の実現**

---

## AI-DLC 全体の総括

| フェーズ | 実装内容 | ステータス |
|---------|--------|-----------|
| **Inception** | 要件確認 + 設定定義 + ドキュメント | ✅ Complete |
| **Construction** | コンポーネント実装（Card, Button, TextField） | ✅ Complete |
| **Assets Circulation** | ポータル + 複製テンプレート + 運用ガイド | 🔄 In Progress |

**最終成果物:**
- ✅ 3優先コンポーネント（Card, Button & FAB, TextField）
- ✅ 100% Semantic トークン参照
- ✅ ポータル（Central Hub）
- ✅ 複製テンプレート化
- ✅ 運用ガイド
- ✅ git submodule 統合可能

