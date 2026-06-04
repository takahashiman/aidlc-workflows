# Phase 1: Card Component — 実行計画書

**期間:** 2日（Day 1-2）  
**目標:** Card コンポーネント を三層アーキテクチャで完全実装  
**成功条件:** Live Preview + React impl + Semantic tokens (100% coverage)

---

## Day 1: 分析 + Live Preview 作成

### タスク 1.1: 既存実装の分析

**内容:**
- existing-code/BusappComponents.jsx から Card の現在の実装を抽出
- card.spec.md の仕様（4 バリエーション）と現状を対比
- 使用されている Semantic トークンをリスト化

**現状の懸念点:**
- インラインスタイル（`style={{ background: '#2C6B5E', ... }}`）が多い
- `--typography-status-pill` などの Semantic トークン は使用されているが、色は生値（HEX）が混在

**出力:**
- Card バリエーション別の構造図
- 現在参照されている Semantic トークンのリスト
- 不足しているトークンの洗い出し

### タスク 1.2: Live Preview HTML の作成

**内容:**
- `aidlc-docs/inception/../../../extensions/busapp/preview/card.html` に新規作成
- 5 状態（Default, Hover, Active, Disabled, Error）を視覚化
- デバイスフレーム（iPhone SE 360px）でのレスポンス確認

**要件:**
- primitives.css + semantic.css を参照
- インラインスタイルなし（すべて Semantic トークン参照）
- Lucide アイコン CDN で読み込み
- 手動でホバー状態を CSS で再現（`:hover`）

**出力:**
```
extensions/busapp/preview/card.html
 ↓ ブラウザで開く
 ↓ 5 状態が正確に表示される
 ✅ エンジニアが目視で「これなら現場でも見間違えない」と判定
```

---

## Day 2: React 実装 + Semantic トークン完全化

### タスク 2.1: Card.jsx を改良

**内容:**
- `extensions/busapp/components/Card.jsx` を新規作成
- Props: `variant`, `children`, `onClick`, `padding`, `as` 等
- インラインスタイル なし、すべて Semantic トークン参照

**チェックリスト:**
- ✓ `background` は `var(--color-surface-*)` で指定
- ✓ `borderRadius` は `var(--radius-card*)` で指定
- ✓ `boxShadow` は `var(--surface-elevation-*)` で指定
- ✓ ホバー状態は CSS class で実装（`:hover` selector）
- ✓ `onClick` は `variant="interactive"` でのみ許容

### タスク 2.2: Semantic トークン統合

**内容:**
- `extensions/busapp/tokens/semantic.css` に必要なトークンが全て定義されているか確認
- 不足トークンを primitive.css から導出して semantic.css に追加
- `semantic.json` に新規トークンを記録

**確認内容:**
```
色関連:
  ✓ --color-surface-default (カード背景)
  ✓ --color-surface-brand-vivid (Hero 背景)
  ✓ --color-border-card (枠線)
  ✓ --color-border-subtle

角丸:
  ✓ --radius-card (16px)
  ✓ --radius-card-hero (28px)
  ✓ --radius-card-compact (12px)

影:
  ✓ --surface-elevation-card (elevation.1)
  ✓ --surface-elevation-raised (elevation.2)
  ✓ --surface-elevation-modal (elevation.4)

Padding:
  ✓ --layout-card-padding-compact (12px)
  ✓ --layout-card-padding (16px)
  ✓ --layout-card-padding-loose (24px)

状態:
  ✓ --state-hover-overlay
  ✓ --motion-hover
  ✓ --motion-press

アクセシビリティ:
  ✓ --a11y-focus-ring
```

### タスク 2.3: Live Preview で視覚確認

**内容:**
- Day 1 で作成した preview/card.html をブラウザで開く
- 5 状態が正確に表示されているか目視確認
- iOS Safari / Chrome / Firefox で表示揺れがないか確認
- デバイスフレーム（iPhone SE, Tablet, Desktop）での対応確認

---

## 完了の証拠（チェックリスト）

### コード品質

- [ ] Card.jsx に直書き値（HEX, px, rgba）なし
- [ ] すべてのスタイル属性が `var(--color-*, --radius-*, --surface-elevation-*, etc.)` で定義
- [ ] インラインスタイル（`style={{ ... }}`）なし（必要に応じてのみ `className` で対応）

### Live Preview

- [ ] `extensions/busapp/preview/card.html` が存在
- [ ] 5 状態（Default, Hover, Active, Disabled, Error）が視覚化
- [ ] デバイスフレーム（最小 360px）でレスポンス確認
- [ ] エンジニアの目視で「視認性、見間違い、判別が明確」と確認

### Semantic Tokens

- [ ] `extensions/busapp/tokens/semantic.css` に新規トークンが追加
- [ ] `semantic.json` に対応レコード作成
- [ ] project-settings.json の `semanticTokens` セクションに記録

### 仕様準拠

- [ ] 4 バリエーション（Default, Interactive, Floating, Hero）の構造が実装可能
- [ ] Props contract（variant, children, onClick, padding, as）に準拠
- [ ] アクセシビリティ（`as="button"`, focus ring）を実装

---

## 成功の定義

**「次のエンジニアが、このディレクトリを複製して色を変更するだけで、新規ブランドのカード が自動的に完成する」状態を実現。**

つまり：
1. React JSX には「FIG ターコイズ色」の直書きがない
2. CSS は 100% Semantic トークン参照
3. Live Preview が「正解の見た目」を証明
4. 他プロジェクト複製時、色を変えるだけで自動反映される

→ **三層アーキテクチャの証明**

---

## Card コンポーネント仕様（参考）

### バリエーション

| 種別 | 用途 | Elevation |
|---|---|---|
| Default | 標準の白カード | `card` (elevation.1) |
| Interactive | クリック可能なカード（リスト要素など） | `card` → hover で `raised` |
| Floating | FAB 的に浮いた情報カード | `floating` (elevation.3) |
| Hero | 定期券カードなど、ブランドティント影を持つ大型 | `modal` (elevation.4) + ブランドティント |

### Props（契約）

```ts
type CardProps = {
  children: ReactNode;
  variant?: 'default' | 'interactive' | 'floating' | 'hero';  // 既定 'default'
  onClick?: (e) => void;       // interactive 時のみ意味を持つ
  ariaLabel?: string;
  padding?: 'sm' | 'md' | 'lg';  // 既定 'md'
  as?: 'div' | 'article' | 'section' | 'button';  // 既定 'div'
};
```

### トークン参照（必須）

| 役割 | Default | Hero |
|---|---|---|
| 背景 | `var(--color-surface-default)` | `var(--color-surface-brand-vivid)` |
| ボーダー | `1px solid var(--color-border-card)` | `1px solid rgba(255,255,255,0.15)` |
| 角丸 | `var(--radius-card)` (16px) | `var(--radius-card-hero)` (28px) |
| 影 | `var(--surface-elevation-card)` | `var(--surface-elevation-modal)` |
| Padding sm | `var(--layout-card-padding-compact)` (12px) | — |
| Padding md | `var(--layout-card-padding)` (16px) | — |
| Padding lg | `var(--layout-card-padding-loose)` (24px) | `var(--layout-card-padding-loose)` (24px) |
| 周辺アイソレーション (Hero) | — | `margin: var(--isolation-around)` |

---

## 参考資料

- **card.spec.md** — Card コンポーネント仕様書（既存-code/components/）
- **design-system.md** — FIG Design System 全体規約（existing-code/）
- **TECHNICAL-ENVIRONMENT.md** — AI 実装契約 + 三層アーキテクチャ詳細
