# Frontend Components — U2-3 スタイル適用

> 既存コンポーネントの className/トークンを Core 由来へ置換（JSX 構造は不変）。新規 UI は作らない。

## 対象（主要導線・FDQ3=A）
| ファイル | 変更内容 |
|---|---|
| `components/StatusBadge.tsx` | `bg-green-50 text-green-700`→`bg-success text-success-foreground`／amber→warning／red→danger（BR-STYLE-1/2） |
| `constants/statusConfigs.ts` | label/icon は維持。色は CSS（status トークン）参照を明確化（5→3 写像のコメント更新） |
| `components/RouteCard.tsx`（teal 38） | `[#2C6B5E]`→`primary` ユーティリティ（BR-STYLE-4） |
| `components/BusSelector.tsx` / `StopSelector.tsx` | teal arbitrary→primary |
| `pages/Home.tsx` / `RouteDetailScreen.tsx` | 状態色・teal・残存生 HEX を token 化 |
| `pages/TicketPurchase.tsx`（teal 32） | teal→primary |
| `components/MapSearchScreen.tsx` 等 | 主要導線分を token 化 |

## 状態表示の適用形（BR-STYLE-1）
```
@theme に追加（bridge or theme）:
  --color-success: var(--status-success-surface);
  --color-success-foreground: var(--status-success-on);
  --color-warning / --color-danger 同様
使用:
  <div className="bg-success text-success-foreground …">…正常運行…</div>
```

## 周辺画面（次段許容・FDQ3=A）
- `Profile.tsx`（teal 31）/ `SettingsNotifications.tsx`（23）/ `Onboarding.tsx`（19）等は本 Unit で必須ではない
  （主要導線優先）。可能なら同方式で機械置換、未了は U2 後続/次サイクルで。

## 旧 tokens 撤去（BR-STYLE-7）
- `src/styles/index.css` から `./tokens/primitives.css`・`./tokens/semantic.css` の参照を除去し、ファイル削除。
- 削除後 `vite build` 成功・主要画面非回帰を確認。

## 非回帰／before↔after 検証（BR-STYLE-8）
- [ ] `vite build` 成功。
- [ ] 主要画面（Home/RouteDetail/RouteCard/StatusBadge/BusSelector/TicketPurchase）の生 HEX = 0。
- [ ] 状態色（正常/遅延/運休）が Core status 由来（success/warning/danger）で描画。
- [ ] ブランド色が signature（teal）で一貫。
- [ ] `feature/figuds-adoption` vs `feature/home-redesign` の diff で before↔after を提示。

## 依存
- C-Bridge（U2-2・`--primary`/`--destructive`/status @theme）。Core status トークン（U2-1）。
