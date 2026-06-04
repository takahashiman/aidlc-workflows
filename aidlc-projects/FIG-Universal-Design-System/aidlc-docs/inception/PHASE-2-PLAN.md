# Phase 2: Button & FAB — 実行計画書

**期間:** 2日（Day 1-2）  
**目標:** Button と FAB コンポーネントを三層アーキテクチャで完全実装  
**成功条件:** Live Preview + React impl + Semantic tokens (100% coverage)

---

## Button の仕様

### バリエーション

| 種別 | 用途 | Props |
|-----|------|-------|
| Primary | 画面の主要 CTA | variant="primary" |
| Secondary | 補助 CTA | variant="secondary" |
| Ghost（Tertiary） | キャンセル、テキスト型 | variant="ghost" |
| Destructive | 削除、ログアウト | variant="destructive" |

### Props（契約）

```typescript
type ButtonProps = {
  children: ReactNode;                    // ラベル文言（必須）
  icon?: string;                          // lucide アイコン名
  iconPosition?: 'leading' | 'trailing';  // default: 'leading'
  onClick?: (e) => void;
  disabled?: boolean;
  loading?: boolean;                      // 操作ロック + スピナー
  fullWidth?: boolean;                    // default: true（モバイル）
  type?: 'button' | 'submit' | 'reset';  // default: 'button'
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  ariaLabel?: string;                     // icon-only 時は必須
};
```

### トークン参照

| 役割 | Primary | Secondary | Ghost | Destructive |
|-----|---------|-----------|-------|-------------|
| 背景 | `--color-surface-brand` | `--color-surface-inverse` | transparent | `--color-surface-error` |
| 文字 | `--color-text-onBrand` | `--color-text-inverse` | `--color-text-brand` | `--color-text-inverse` |
| 角丸 | `--radius-cta` (Pill) | `--radius-button` (16px) | `--radius-cta` | `--radius-button` |
| Min Height | `var(--interactive-primary-min-height)` (48px) | `var(--interactive-secondary-min-height)` (44px) | 40px | 44px |

---

## FAB（Floating Action Button）の仕様

### 用途
浮遊アクション。画面端に固定されるボタン。

### Props

```typescript
type FABProps = {
  icon: string;                           // lucide アイコン名（必須）
  onClick: (e) => void;                   // 必須（何もしないボタンは不可）
  label?: string;                         // アクセシビリティ用ラベル
  disabled?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  size?: 'default' | 'large';
};
```

### トークン参照

| 役割 | 値 |
|-----|-----|
| 背景 | `--color-surface-brand` |
| 文字 | `--color-text-onBrand` |
| 角丸 | 円形（直径で指定） |
| 影 | `--surface-elevation-floating` |
| Size | 56px / 64px |

---

## Day 1: 分析 + Live Preview 作成

### タスク 1.1: 既存実装の分析

- existing-code から Button の実装を抽出
- button.spec.md の仕様と現状を対比
- 生 HEX / pixel 値をリスト化（`#F97316`, `#2C6B5E` 等）

### タスク 1.2: Live Preview HTML の作成

**内容:**
- `extensions/busapp/preview/button.html` に新規作成
- Button 4 バリエーション × 5 状態（Default, Hover, Active, Disabled, Loading）を視覚化
- FAB の配置パターン（Bottom-Right, Bottom-Left, Bottom-Center）も表示
- デバイスフレーム（iPhone SE 360px）でのレスポンス確認

**要件:**
- Semantic トークンのみ参照
- lucide アイコン CDN で読み込み
- ホバー・アクティブ状態を CSS で再現
- ローディング状態でスピナーアニメーション

---

## Day 2: React 実装 + Semantic トークン完全化

### タスク 2.1: Button.jsx を実装

**内容:**
- `extensions/busapp/components/Button.jsx` を作成
- 4 バリエーション + アイコン配置対応
- Loading 状態でスピナー表示（簡易版）
- インラインスタイル なし、Semantic トークンのみ参照

**チェックリスト:**
- ✓ `background` は `var(--color-surface-*)` で指定
- ✓ `borderRadius` は `var(--radius-*)` で指定
- ✓ `minHeight` は `var(--interactive-*-min-height)` で指定
- ✓ ホバー状態は CSS class で実装（`:hover` selector）
- ✓ Loading 状態は `opacity` + `pointer-events: none` で実装

### タスク 2.2: FAB.jsx を実装

**内容:**
- `extensions/busapp/components/FAB.jsx` を作成
- 固定配置（position: fixed）
- z-index は `var(--z-fab)` で管理
- タップ可能領域 44×44px 以上を保証

### タスク 2.3: Semantic トークン統合

**新規トークン（存在しない場合）:**
```css
/* Button 関連 */
--interactive-primary-min-height: 48px;
--interactive-secondary-min-height: 44px;
--interactive-compact-min-height: 40px;

/* FAB */
--z-fab: 40;
--interactive-fab-size: 56px;
--interactive-fab-size-large: 64px;

/* Motion: Loading spinner */
--motion-spin: spin 1s linear infinite;
```

### タスク 2.4: Live Preview で視覚確認

- 5 状態 × 4 バリエーション が正確に表示されているか
- FAB の配置パターンが正しいか
- スピナーアニメーションが滑らかか
- デバイス別（iPhone SE, Tablet, Desktop）での対応確認

---

## 完了の証拠（チェックリスト）

### コード品質

- [ ] Button.jsx と FAB.jsx に直書き値（HEX, px, rgba）なし
- [ ] すべてのスタイル属性が `var(--color-*, --radius-*, --interactive-*, --z-*, etc.)` で定義
- [ ] インラインスタイル（`style={{ ... }}`）なし

### Live Preview

- [ ] `extensions/busapp/preview/button.html` が存在
- [ ] 4 バリエーション × 5 状態を視覚化
- [ ] FAB の 3 配置パターンを表示
- [ ] スピナーアニメーションが動作
- [ ] デバイスフレーム（360px 以上）でレスポンス確認

### Semantic Tokens

- [ ] `extensions/busapp/tokens/semantic.css` に新規トークンが追加
- [ ] `semantic.json` に対応レコード作成
- [ ] project-settings.json の `semanticTokens` セクションに記録

### アクセシビリティ

- [ ] `disabled` 時に `aria-disabled="true"` と `cursor: not-allowed` を併記
- [ ] Icon-only ボタンに `ariaLabel` が必須
- [ ] Loading 中に `aria-busy="true"`
- [ ] フォーカスリングが `--a11y-focus-ring` で定義

---

## 成功の定義

**「Button と FAB をディレクトリ全体で複製して色を変更するだけで、新規ブランドのボタンが完成する」状態を実現。**

つまり：
1. React JSX には「生値」の直書きがない
2. CSS は 100% Semantic トークン参照
3. Live Preview が「正解の見た目」を証明
4. 他プロジェクト複製時、色を変えるだけで自動反映される

→ **三層アーキテクチャの証明（Card に続き 2 つ目）**
