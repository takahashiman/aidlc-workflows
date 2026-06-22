# Deployment Architecture — U2-1 Core パレット基盤（C-Palette）

## 配備の全体像（ビルド時・マルチレポ）
```text
┌─ FIG-UDS Core repo ───────────────────────────────────────────┐
│  tools/palette-gen/  (LC-Orchestrator/Deriver/StatusDeriver/   │
│                       A11y/Emitter/SeedInput/ColorMath)        │
│        │ npm run gen:palette (brand seed)                      │
│        ▼                                                       │
│  tokens/signature.css / status.css  (＋ -aaa.css)             │  ← semantic 層が参照（三層）
│  design-system docs（生成法則）                                │
│        │                                                       │
│  CI: 三層ガードレール + a11y 検証 + drift 検査                 │
│        │ SemVer MINOR タグ発行                                 │
└────────┼───────────────────────────────────────────────────────┘
         │ submodule pin（U2-2）
         ▼
┌─ BusDelayAlerts (LLocana) repo ─ (U2-2) ──────────────────────┐
│  製品ビルドで gen:palette --seed=#2C6B5E を実行                │
│    → LLocana の signature/status トークン生成（Taste 派生）     │
│    → C-Bridge（@theme）が消費 → shadcn/Radix が Core 色で描画   │
└───────────────────────────────────────────────────────────────┘
         │ rolling 取込
         ▼
   ポータル（aidlc-workflows）：Core tokens を rolling 反映
```

## デプロイ単位・タイミング
- **Core**: 生成器＋ブランド既定トークン＋docs をコミット → CI 緑 → SemVer タグ。配備＝リポジトリ反映（ランタイムデプロイなし）。
- **製品（U2-2）**: Core タグに pin し、製品ビルド時に seed 指定で生成。製品の配備に内包。
- **ポータル**: rolling で Core tokens を取込（pin しない）。

## 環境変数 / 入力
- `seed`（製品の単一設定＝`--seed`/project-settings・FD6=A）。Core 既定はブランド seed。
- ライブラリ依存（PoC 後に確定・案A ゼロ依存なら無し）。

## 品質ゲート（マージ条件）
- 三層ガードレール緑・**a11y AA 全合格**・drift なし（再生成一致）。AAA 版は AAA 合格。
- これらは US-X1（Core 昇格）等と同じ Core CI 基盤を共有。

## ロールバック
- Core 変更は PR/タグ単位で取消容易。製品は前タグへ pin 戻し。before=`feature/home-redesign` 温存（製品側）。

## N/A（明示）
- クラウド compute/storage/DB/queue/LB/CDN・オートスケール・ランタイム監視：**いずれも N/A**（ビルド時生成・静的 CSS 配布）。
