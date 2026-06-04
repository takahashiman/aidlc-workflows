# DEPLOYMENT-GUIDE.md — FIG Universal Design System 運用ガイド

**作成日:** 2026-06-03  
**対象:** エンジニア、デザイナー、プロジェクトマネージャー  
**目的:** 新規プロジェクトのセットアップから git submodule 統合まで

---

## 概要

FIG Universal Design System は、三層アーキテクチャ（Primitive → Semantic → Component）により「資産化された設計」を実現します。

このガイドに従うことで：
- ✅ 新規プロジェクトの **5 分での立ち上げ**
- ✅ 色変更時の **自動反映**（コード修正なし）
- ✅ git submodule による **中央集権管理と各プロダクトの自律性** の両立

---

## セクション

1. [新規プロジェクトのセットアップ](#新規プロジェクトのセットアップ)
2. [git submodule 統合](#git-submodule-統合)
3. [更新・保守フロー](#更新保守フロー)
4. [トラブルシューティング](#トラブルシューティング)
5. [FAQ](#faq)

---

## 新規プロジェクトのセットアップ

### ステップ 1: Extensions をコピー

```bash
cd aidlc-projects/FIG-Universal-Design-System/

# busapp を新規プロジェクト名にコピー
cp -r extensions/busapp extensions/[ProjectName]

# 例：
cp -r extensions/busapp extensions/ticketing-app
```

### ステップ 2: project-settings.json を編集

```bash
cd extensions/[ProjectName]
open project-settings.json  # またはお好みのエディタ
```

**編集項目:**

```json
{
  "projectMetadata": {
    "projectName": "[新規プロジェクト名]",      // ← 変更
    "projectId": "[new-project-2026]",          // ← 変更
    "status": "Construction Phase 3 Complete"
  },

  "signatureColor": {
    "hex": "#[新規HEX値]",                      // ← 変更（例：#38A1DB）
    "name": "[新規ブランド色名]",                 // ← 変更
    "harmonization": "[新規色と Core 色の関係を記述]" // ← 変更
  },

  "designSystem": {
    "profile": "Mobile-Consumer"                 // 不変（初期）
  }

  // その他はそのまま
}
```

**具体例:**

```json
{
  "projectMetadata": {
    "projectName": "Ticketing App",
    "projectId": "ticketing-app-2026",
    "baseVersion": "1.0.0"
  },

  "signatureColor": {
    "hex": "#38A1DB",
    "name": "FIGブルー",
    "harmonization": "定期券・チケット発行システムの「信頼」と「確実性」を表現。FIGターコイズの補色として、視覚的な強調が必要な CTA（定期券発行ボタン等）に使用。WCAG 2.1 AA 準拠。"
  }
}
```

### ステップ 3: ポータルで確認

```bash
# ポータルをブラウザで開く
cd ../..
open index.html
```

**確認項目:**
- ✅ 「プロジェクト」タブに新規プロジェクト名が表示される
- ✅ Live Preview（Card, Button, TextField）が新規色で表示される
- ✅ React コンポーネント JSX が変更されていない（複製のままの状態）

### ステップ 4: コンポーネント確認

```bash
# React アプリケーションでコンポーネントをインポート
import { Card, Button, FAB, TextField } from './extensions/[ProjectName]/components';

// コンポーネントを使用するだけで、自動的に新規色が適用される
<Card variant="interactive">
  <Button variant="primary">新規色で表示される</Button>
</Card>
```

---

## git submodule 統合

### 目的

各プロダクト（ProductA, ProductB 等）が FIG Universal Design System を **submodule として組み込み、git pull で常に最新を同期** できる状態を実現。

### ステップ 1: 中央リポジトリを確認

FIG Universal Design System が Git リポジトリとして管理されていることを確認：

```bash
cd FIG-Universal-Design-System/
git status

# 出力例：
# On branch main
# nothing to commit, working tree clean
```

### ステップ 2: 本体リポジトリに submodule を追加

```bash
cd ProductA/  # 本体アプリケーションのルート
git submodule add https://[repo-url]/FIG-Universal-Design-System.git design-system
```

### ステップ 3: submodule をセットアップ

```bash
git submodule update --init --recursive
cd design-system
git checkout main
cd ..
```

### ステップ 4: .gitmodules を確認

```bash
cat .gitmodules

# 出力例：
# [submodule "design-system"]
#   path = design-system
#   url = https://[repo-url]/FIG-Universal-Design-System.git
```

### ステップ 5: コミット

```bash
git add .gitmodules design-system/
git commit -m "chore: add FIG Universal Design System as submodule"
git push origin main
```

### ステップ 6: 他のエンジニアが clone する場合

```bash
git clone https://[repo-url]/ProductA.git
cd ProductA
git submodule update --init --recursive
# design-system/ が自動的に clone される
```

---

## 更新・保守フロー

### 中央（FIG Universal Design System）で修正する場合

```bash
# 中央リポジトリで修正
cd FIG-Universal-Design-System/extensions/busapp/

# コンポーネントやトークンを修正
open components/Card.jsx
# 修正を加える...

# コミット
git add .
git commit -m "fix(card): improve hover state contrast for accessibility"
git push origin main
```

### 各プロダクト（ProductA 等）が同期する場合

```bash
# ProductA のディレクトリで
cd ProductA/design-system/
git pull origin main

# design-system/ が最新版に更新される
# すべてのコンポーネント / トークン改善が自動反映
```

### submodule ポインタをコミット

```bash
cd ProductA/
# design-system が新しいコミットを指すようになる
git add design-system/
git commit -m "chore(deps): update design-system to latest"
git push origin main
```

---

## トラブルシューティング

### Q: 新規色が反映されない

**A:** 以下を確認：

1. **project-settings.json が正しく編集されているか**
   ```bash
   cat extensions/[ProjectName]/project-settings.json | grep signatureColor
   # 新規色（hex）が正しいか確認
   ```

2. **primitives.css が存在しているか**
   ```bash
   ls extensions/[ProjectName]/tokens/primitives.css
   ```

3. **React コンポーネントが semantic.css を参照しているか**
   ```bash
   grep "var(--color" extensions/[ProjectName]/components/Card.jsx
   # 生値（#26B7BC等）が含まれていないか確認
   ```

### Q: Live Preview で色が反映されない

**A:** ブラウザキャッシュをクリア：

```bash
# Hard refresh (Ctrl+Shift+R または Cmd+Shift+R)
# または
# DevTools → Application → Clear Site Data
```

### Q: ポータルに新規プロジェクトが表示されない

**A:** JSON ファイルを検証：

```bash
# JSON 形式が正しいか確認（Cursor で JSON schema validation を活用）
cat extensions/[ProjectName]/project-settings.json | jq .

# エラーメッセージが出たら、JSON を修正
```

### Q: git submodule が更新されない

**A:** 明示的に pull：

```bash
cd ProductA/design-system/
git fetch origin
git reset --hard origin/main

# または
cd ProductA/
git submodule update --remote design-system
```

### Q: 複製したコンポーネントが表示されない

**A:** tokens ディレクトリが存在するか確認：

```bash
ls extensions/[ProjectName]/tokens/
# primitives.css と semantic.css が存在するか確認
```

HTML で CSS を参照しているか確認：

```html
<link rel="stylesheet" href="../tokens/primitives.css">
<link rel="stylesheet" href="../tokens/semantic.css">
```

---

## FAQ

### Q: 複数の新規プロジェクトを同時に開発できますか？

**A:** はい。extensions/ 配下に複数の [ProjectName] ディレクトリを作成し、それぞれ project-settings.json を編集できます。ポータルは自動的にすべてを検知します。

### Q: コンポーネントをカスタマイズしたい場合は？

**A:** 以下の選択肢があります：

1. **Semantic トークンを追加**（推奨）
   - semantic.css に新規トークンを定義
   - コンポーネント JSX で参照
   - これにより、新色適用時も自動反映される

2. **例外として直書き**（非推奨）
   - 正当な理由がある場合のみ
   - `// EXCEPTION: [理由]` コメントを記載
   - 3 ヶ月以内に Semantic トークン化を再検討

### Q: アクセシビリティ対応は？

**A:** Phase 3 で実装済み：
- ARIA ラベル（aria-label, aria-required, aria-invalid 等）
- キーボードフォーカスリング
- Touch target 最小 44×44 px
- スクリーンリーダー対応

WCAG 2.1 AA 準拠を目指しています。

### Q: Figma との連携は？

**A:** 現在、Code Connect は未実装です。将来的に Figma コンポーネントを Code Connect で Sync する予定。

### Q: npm パッケージとしての公開は？

**A:** 当面は git submodule による配布を標準とします。npm パッケージ化は Phase 5（今後の検討項目）。

---

## サポート

### ドキュメント

- **TECHNICAL-ENVIRONMENT.md** — AI 実装契約。三層アーキテクチャ詳細ルール
- **VISION.md** — 最終成果物の定義。Extensions 流用テンプレート、ポータル構想
- **project-settings.json** — 各プロジェクトの個別設定
- **extensions/[ProjectName]/README.md** — プロジェクト固有の使用方法

### 質問・バグ報告

GitHub Issues または Slack で報告してください。

---

## ライセンス

FIG Universal Design System は内部利用を想定しています。外部公開時はライセンスを明記してください。

---

## チェックリスト

新規プロジェクト作成時の確認リスト：

```markdown
## セットアップ完了チェック

- [ ] extensions/[ProjectName] をコピー
- [ ] project-settings.json を編集（projectName, projectId, signatureColor）
- [ ] JSON Schema 検証で エラーなし
- [ ] ポータルで新規プロジェクトが表示される
- [ ] Live Preview で新規色が反映される
- [ ] React コンポーネント JSX が変更されていない
- [ ] git add / commit / push 完了
- [ ] submodule で他プロジェクトに統合完了

## 保守チェック

- [ ] 月 1 回以上、中央リポジトリを確認
- [ ] 各プロダクトで `git submodule update --remote` を実行
- [ ] トークン / コンポーネント更新時は、すべてのプロジェクトに同期確認
```

---

**作成者:** AI-DLC Inception & Construction Phase  
**最終更新:** 2026-06-03  
**次回更新予定:** Phase 5（npm パッケージ化 / Figma Code Connect）
