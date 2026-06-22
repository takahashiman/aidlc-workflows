# Business Logic Model — U2-3 スタイル適用

> 対象: BusDelayAlerts。生 HEX 直書きを Core トークン参照へ置換し、状態色を semantic 化する変換ロジック。
> 確定: FDQ1=A（status を @theme へ）/ FDQ2=A（teal→primary ユーティリティ）/ FDQ3=A（主要導線で 0）/ FDQ4=A（5→3 写像・旧 tokens 撤去）。

## 変換の全体フロー
```text
[1] status を @theme へ定義      figuds-bridge.css（または theme）に
        │                          --color-success/-warning/-danger（＋-foreground）
        │                          = var(--status-*surface/-on) を追加（Tailwind がユーティリティ生成）
        ▼
[2] StatusBadge / 状態表示を      bg-green-50 text-green-700 → bg-success text-success-foreground
        │  Core status へ          amber → warning / red → danger（statusConfigs 5→3 写像）
        ▼
[3] teal arbitrary を primary へ  text-[#2C6B5E] → text-primary
        │  機械置換                bg-[#2C6B5E]/10 → bg-primary/10
        │                          border-[#2C6B5E]/20 → border-primary/20 / ring 同様
        ▼
[4] 残存生 HEX を token 参照へ     主要導線の他の生 HEX（slate 等）を semantic/utility へ
        │  （主要画面で 0）        （周辺画面は次段許容）
        ▼
[5] 旧内蔵 DS 撤去                src/styles/tokens/{primitives,semantic}.css を削除
        │                          （U2-2 で Core へ委譲済・参照を index.css から除去）
        ▼
[6] 検証                          vite build 成功＋主要画面の生 HEX 0＋before↔after diff
```

## 状態写像（FDQ4=A）
| app 状態（statusConfigs / StatusBadge） | Core status | 用途 |
|---|---|---|
| onTime（通常運行 / normal） | success | 緑系・正常 |
| delayRisk（遅延の可能性） | warning | 琥珀系・注意 |
| delayed（遅延 / delay） | warning | 琥珀系（深刻度は文言/アイコンで区別） |
| suspended（運休） | danger | 赤系・危険 |
| passed（通過済み） | neutral（muted・status 非対象） | 灰系・非状態 |

## teal 置換マッピング（FDQ2=A・機械置換）
| 旧（arbitrary） | 新（utility） |
|---|---|
| `text-[#2C6B5E]` | `text-primary` |
| `bg-[#2C6B5E]` | `bg-primary` |
| `bg-[#2C6B5E]/10` | `bg-primary/10` |
| `border-[#2C6B5E]` / `/20` | `border-primary` / `border-primary/20` |
| `ring-[#2C6B5E]/20` | `ring-primary/20` |
> bridge で `--primary`=signature 解決。opacity modifier は Tailwind v4 の color-mix で維持。

## 関係（component）
- **C-Bridge 消費**: 既存ユーティリティが Core 由来トークンを参照（U2-2 の bridge を活用）。
- **semantic**: 状態色を `--status-*`／Tailwind status ユーティリティ経由に統一。

## トレーサビリティ
- AC①-2（状態色 semantic 化）= [1][2]・US-D3。AC①-3（主要画面 生 HEX 0）= [3][4]・US-D4。
- AC①-5（before↔after）= [6]・US-D7（`feature/figuds-adoption` vs `feature/home-redesign` diff）。
