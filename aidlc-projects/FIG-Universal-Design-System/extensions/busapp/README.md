# Bus App — FIG Universal Design System Extension

**FIG Universal Design System** のバスアプリケーション向けカプセル化実装。

## 概要

このディレクトリは、FIG ターコイズブランドを採用したモバイルアプリのデザインシステムを完全にカプセル化したものです。三層アーキテクチャ（Primitive → Semantic → Component）に準拠し、新規プロジェクトで即座に流用できる状態にあります。

## ファイル構成

```
busapp/
├── project-settings.json       # ブランド設定・トークン戦略（←必須ファイル）
├── README.md                   # 本ドキュメント
├── components/
│   ├── Card.jsx               # Card コンポーネント（Semantic トークンのみ参照）
│   ├── Button.jsx             # [Phase 2] Button コンポーネント
│   └── TextField.jsx          # [Phase 3] TextField コンポーネント
├── tokens/
│   ├── primitives.css         # Layer 1: 生値（HEX、px、数値）
│   └── semantic.css           # Layer 2: 役割トークン
└── preview/
    ├── card.html              # Card の Live Preview（5 状態を可視化）
    ├── button.html            # [Phase 2] Button Preview
    └── textfield.html         # [Phase 3] TextField Preview
```

## クイックスタート

### 1. 依存ファイルの確認

```bash
# 本ディレクトリが FIG Universal Design System に含まれていることを確認
cd extensions/busapp/
```

### 2. Live Preview で確認

```bash
# preview/card.html をブラウザで開く（開発サーバー不要）
open preview/card.html
# または
start preview/card.html
```

### 3. React アプリケーションでの使用

```jsx
import Card from './components/Card';

export function MyApp() {
  return (
    <Card variant="interactive" padding="md" onClick={handleClick}>
      <div>カードのコンテンツ</div>
    </Card>
  );
}
```

## 設計の原則

### 三層アーキテクチャ（非交渉）

```
Layer 3: Component
  ↑ 参照のみ
  │
Layer 2: Semantic (role tokens)
  ↑ 参照のみ
  │
Layer 1: Primitive (base values)
```

- **Primitive:** 生値のみ（HEX、px、数値）。依存なし。
- **Semantic:** 役割トークン。`--color-surface-*`, `--typography-*`, `--motion-*` 等。Primitive のみ参照。
- **Component:** React JSX。Semantic のみ参照。**直書き禁止**。

### 禁止事項

❌ `background: #26B7BC`  
✅ `background: var(--color-surface-brand)`

❌ `font-size: 22px`  
✅ `font: var(--typography-headline)`

❌ `box-shadow: 0 4px 30px rgba(...)`  
✅ `box-shadow: var(--surface-elevation-card)`

## トークン一覧

### 色（Color）

| トークン | 用途 | 値 |
|---------|------|-----|
| `--color-surface-default` | カード背景（標準） | #FFFFFF |
| `--color-surface-brand-vivid` | Hero / ブランド背景 | #26B7BC |
| `--color-border-card` | カード枠線 | #E5E7EB |
| `--color-surface-canvas` | ページ背景（グラデーション） | `linear-gradient(...)` |

### 角丸（Radius）

| トークン | サイズ | 用途 |
|---------|--------|------|
| `--radius-card` | 16px | 標準カード |
| `--radius-card-hero` | 28px | Hero / 定期券カード |
| `--radius-card-compact` | 12px | 密集 UI |

### 影（Elevation）

| トークン | 用途 |
|---------|------|
| `--surface-elevation-card` | 標準カード（elevation.1） |
| `--surface-elevation-raised` | ホバー時（elevation.2） |
| `--surface-elevation-floating` | 浮遊カード（elevation.3） |
| `--surface-elevation-modal` | Hero / モーダル（elevation.4） |

### 余白（Padding）

| トークン | サイズ | 用途 |
|---------|--------|------|
| `--layout-card-padding-compact` | 12px | 小 padding |
| `--layout-card-padding` | 16px | 標準 padding |
| `--layout-card-padding-loose` | 24px | 大 padding |

詳細は `tokens/semantic.css` を参照。

## コンポーネント Props

### Card

```typescript
type CardProps = {
  variant?: 'default' | 'interactive' | 'floating' | 'hero';  // default: 'default'
  children: ReactNode;
  onClick?: (e: Event) => void;                               // interactive 時のみ
  padding?: 'sm' | 'md' | 'lg';                               // default: 'md'
  as?: 'div' | 'article' | 'section' | 'button';             // default: 'div'
  className?: string;                                          // 追加 CSS class
  ariaLabel?: string;                                          // a11y label
};
```

**使用例:**

```jsx
// 標準カード
<Card>
  <h3>タイトル</h3>
  <p>コンテンツ</p>
</Card>

// インタラクティブ
<Card variant="interactive" onClick={handleClick}>
  クリック可能なカード
</Card>

// Hero（定期券等）
<Card variant="hero" padding="lg">
  デジタル定期券
</Card>
```

## テスト

### Live Preview で視覚確認

```bash
# 5 つの状態（Default / Hover / Disabled / Error / Hero）が
# デバイスフレーム（iPhone SE 相当）で正確に表示されることを確認
open preview/card.html
```

### React コンポーネント動作確認

```jsx
// components/__tests__/Card.test.jsx
import { render } from '@testing-library/react';
import Card from '../Card';

describe('Card', () => {
  it('renders with Semantic tokens only', () => {
    const { getByText } = render(<Card>Test</Card>);
    expect(getByText('Test')).toBeInTheDocument();
  });

  it('applies interactive styles on click', () => {
    const onClick = jest.fn();
    const { getByRole } = render(
      <Card variant="interactive" onClick={onClick}>
        Click me
      </Card>
    );
    getByRole('generic').click();
    expect(onClick).toHaveBeenCalled();
  });
});
```

## 複製テンプレート（他プロジェクト向け）

### ステップ 1: ディレクトリをコピー

```bash
cp -r extensions/busapp extensions/[NewProjectName]
```

### ステップ 2: project-settings.json を編集

```json
{
  "projectName": "[New Project Name]",
  "signatureColor": {
    "hex": "#[新規色]",
    "name": "[新規ブランド名]",
    "harmonization": "[新規色とCore色の関係を記述]"
  }
  // ... その他の設定は busapp から継承
}
```

### ステップ 3: Colors を置換（必要に応じて）

Primitives 内の `--color-brand-primary: #26B7BC` を新規色に置換すれば、すべてのコンポーネントが自動的に新色でレンダリングされます。

### ステップ 4: 動作確認

```bash
open extensions/[NewProjectName]/preview/card.html
# → すべてのコンポーネントが新規ブランド色で表示される
```

## トラブルシューティング

### Q: コンポーネントが正しく表示されない

A: 以下を確認してください：
1. `tokens/primitives.css` と `tokens/semantic.css` が読み込まれているか
2. CSS ファイルの読み込み順序：primitives → semantic
3. ブラウザキャッシュをクリア

### Q: 新規トークンが必要

A: `tokens/semantic.css` に新規トークンを追加し、`project-settings.json` の `semanticTokens` セクションに記録してください。詳細は TECHNICAL-ENVIRONMENT.md を参照。

### Q: インラインスタイルを使いたい

A: 原則として禁止です。Semantic トークンの不足が原因の可能性があります。トークンを追加することをお勧めします。

## ドキュメント

- **project-settings.json** — このプロジェクト固有の設定（色、プロファイル等）
- **TECHNICAL-ENVIRONMENT.md** — AI 実装契約 / 三層アーキテクチャの詳細ルール
- **VISION.md** — Extensions 流用テンプレートの構想
- **tokens/semantic.css** — すべての Semantic トークン定義

## 参考

- FIG ブランドガイドライン: https://[figma-url]
- デザインシステム規約: TECHNICAL-ENVIRONMENT.md
- Lucide Icons: https://lucide.dev/

---

**最終更新:** 2026-06-03  
**フェーズ:** Construction Phase 1（Card コンポーネント完成）  
**メンテナ:** AI-DLC Inception Phase
