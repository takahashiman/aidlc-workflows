# TECHNICAL-ENVIRONMENT.md — FIG Universal Design System

## AI実装契約書

このドキュメントは、AI エージェント（Claude、Cursor等）と エンジニアの間の「設計システムの維持」に関する契約です。このルールを逸脱したコード提案は即座に reject してください。

**更新日:** 2026-06-03  
**ステータス:** Inception フェーズ完了時点での固定版  
**対象プロジェクト:** FIG Universal Design System / FIG Core デザインシステム

---

## 1. 三層アーキテクチャ（非交渉の最優先）

### 全体図

```
┌─────────────────────────────────────────────────────────────────┐
│ Layer 3 : Component                                              │
│   React コンポーネント（Card, Button, TextField 等）             │
│   - インラインスタイル禁止                                        │
│   - 直書き（HEX色、px 寸法等）禁止                               │
│   - Semantic トークンのみ参照                                    │
│   参照元: semantic.css                                           │
├─────────────────────────────────────────────────────────────────┤
│ Layer 2 : Semantic                                               │
│   CSS カスタムプロパティ + 役割トークン                          │
│   - --color-text.* / --color-surface.*                          │
│   - --typography-* / --motion.* / --a11y.*                      │
│   - --state.* / --surface-elevation-*                           │
│   - プロファイルクラスで複数対応を見据えた構造設計              │
│   参照元: primitives.css                                        │
├─────────────────────────────────────────────────────────────────┤
│ Layer 1 : Primitive                                              │
│   基本値（HEX、px、数値）                                        │
│   - --color-brand-primary: #26B7BC                              │
│   - --space-4: 4px; --space-8: 8px; ...                         │
│   - --font-size-sm: 14px; --font-size-lg: 18px; ...             │
│   依存なし（自己完結）                                           │
└─────────────────────────────────────────────────────────────────┘

依存方向: 上は下のみを参照 → 逆流厳禁
```

### 守るべきルール

**MUST（必須）:**
1. Component は Semantic のみを参照。Primitive を直接参照しない。
2. Semantic は Primitive を参照。Component を参照しない。
3. React コンポーネント内に生値（`#26B7BC`, `14px`, `rgba(...)`）を書かない。
4. CSS ファイル内に任意値（Tailwind の `text-[22px]` 等）を使わない。トークン不足なら Semantic に追加してから使う。

**MUST NOT（禁止）:**
```
❌ color: #26B7BC           → ✅ var(--color-text-brand)
❌ font-size: 22px          → ✅ font: var(--typography-arrival-time)
❌ box-shadow: 0 4px 30px   → ✅ var(--surface-elevation-card)
❌ z-index: 50              → ✅ var(--z-modal)
❌ Tailwind arbitrary values (text-[22px], bg-[#26B7BC])
❌ Inline styles in JSX
```

---

## 2. AI エージェント向けシステムプロンプト

以下を Claude / Cursor に対して、毎回の会話冒頭で注入してください。

```text
=== FIG Universal Design System — STRICT Design System Rules ===

You are working on FIG Universal Design System, a design system for public
transportation applications. This system enforces a strict three-layer
architecture to prevent hallucinations and ensure consistency.

**CRITICAL RULES (Non-negotiable):**

1. THREE-LAYER ARCHITECTURE:
   - Layer 3 (Component): React JSX — MUST reference ONLY Semantic tokens
   - Layer 2 (Semantic): CSS variables — role-based tokens like --color-text-brand
   - Layer 1 (Primitive): Base values — --color-brand-primary: #26B7BC, etc.

2. NEVER WRITE (Direct writes are ALWAYS rejected):
   ✗ color: #26B7BC          → ✓ var(--color-text-brand)
   ✗ font-size: 22px         → ✓ font: var(--typography-arrival-time)
   ✗ box-shadow: 0 4px 30px  → ✓ var(--surface-elevation-card)
   ✗ z-index: 50             → ✓ var(--z-modal)
   ✗ Tailwind arbitrary values (text-[22px], bg-[#26B7BC])
   ✗ Inline styles in JSX

3. SEMANTIC TOKENS YOU MUST USE:
   Colors: --color-text-{primary,secondary,tertiary,muted,disabled,brand}
          --color-surface-{default,container-low,container,container-high,brand}
          --color-border-{default,light}
   Typography: --typography-{arrival-time,display,headline,body,label,caption}
   Motion: --motion-{enter,exit,modalIn}, --ease-out-expo
   Accessibility: --a11y-touch-target, --a11y-focus-ring
   Elevation: --surface-elevation-{card,sheet,modal}

4. COMPONENT SUCCESS CRITERIA:
   ✓ Live Preview HTML exists showing 5+ states
   ✓ React JSX with ZERO inline styles
   ✓ ZERO raw HEX colors in code
   ✓ ALL styling goes through semantic.css tokens
   ✓ semantic.json updated with any new tokens

5. VALIDATION (AI Self-Check After Generation):
   After writing code, verify:
   [ ] No raw HEX colors in .jsx or .css
   [ ] No inline styles in JSX
   [ ] All colors reference --color-* variables
   [ ] All typography uses --typography-*
   [ ] All motion uses --motion-* and --ease-*
   [ ] No z-index values — all use --z-* tokens
   [ ] No arbitrary Tailwind values

When in doubt, ask the engineer. A missing token is a design system gap to fill.

=== END STRICT RULES ===
```

---

## 3. Construction フェーズのマイルストーン

| Phase | Component | 期限 | 成功条件 |
|-------|-----------|------|--------|
| Phase 1 | Card | 2日 | Live Preview + React impl + Semantic tokens (100% coverage) |
| Phase 2 | Button & FAB | 2日 | ⬆️ |
| Phase 3 | TextField | 1日 | ⬆️ |
| Phase 4 | Extensions + Portal | 1-2日 | assets/js/portal-content.js 更新、ディレクトリ構造確定 |

### Phase 1 詳細 (Card コンポーネント)

**Day 1:**
1. existing-code から Card コンポーネントの実装を分析
2. Live Preview HTML を作成（5 状態を縦に配置）
3. デバイスフレーム（iPhone SE 等）をエミュレート

**Day 2:**
1. Card.jsx を改良（インラインスタイル削除）
2. semantic.css に不足トークンを追加
3. Live Preview で視覚確認、デバイス別レスポンス検証

**成功の証:**
- preview/card.html で 5 状態が正確に表示
- Card.jsx に直書き / インラインスタイルなし
- semantic.json / semantic.css に新規トークンが漏れなく登録

---

## 4. PR チェックリスト

AI・エンジニアが提案した変更をレビューする際：

```markdown
## Design System Compliance

- [ ] No raw HEX colors (#abc def など)
- [ ] No inline styles in JSX
- [ ] No arbitrary Tailwind values (text-[22px], bg-[#abc])
- [ ] All colors use --color-* tokens
- [ ] All typography uses --typography-* shorthand
- [ ] All motion uses --motion-* + --ease-* + --duration-*
- [ ] All elevation uses --surface-elevation-*
- [ ] All a11y (focus, touch target) uses --a11y-* tokens
- [ ] semantic.css 更新時に project-settings.json も更新
- [ ] Live Preview HTML で 5状態以上を確認
```

---

## 5. Exception 記録フォーマット

ルール破りの正当な理由がある場合：

```javascript
// EXCEPTION: フレーマー Motion の exit animation に対応するため、
// この1箇所のみ inline style で opacity を制御。期限: 2026-09-03
opacity: isExiting ? 0 : 1,
transition: `opacity var(--motion-exit)`,
```

---

## 参考資料

- **project-settings.json** — このプロジェクト固有の設定
- **VISION.md** — Extensions 流用テンプレートの構想
- **existing-code/design-system.md** — 既存実装の Design System Rules
