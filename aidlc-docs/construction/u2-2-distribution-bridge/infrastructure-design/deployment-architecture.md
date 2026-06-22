# Deployment Architecture — U2-2 配布・ブリッジ

## 配備の全体像（ビルド時・マルチレポ）
```text
┌─ FIG-UDS Core repo（pin 元）────────────────────────────────┐
│  tag v1.2.0: primitives/semantic/tokens/*.css               │
│              tools/palette-gen（生成器）                     │
└──────────────┬──────────────────────────────────────────────┘
               │ git submodule（pin v1.2.0）
               ▼
┌─ BusDelayAlerts repo（feature/figuds-adoption）─────────────┐
│  vendor/core  ← submodule（CORE-DS-VERSION=v1.2.0）          │
│  prebuild/predev:                                            │
│    node vendor/core/tools/palette-gen/generate.mjs           │
│        --seed=#2C6B5E --out src/styles/generated            │
│        → signature.css / status.css（＋-aaa）[gitignore]    │
│  src/styles/index.css:                                       │
│    fonts → tailwind → vendor/core(primitives→semantic        │
│      →signature(生成)→status(生成)→profile-consumer)         │
│      → figuds-bridge.css（@theme 後勝ち）→ 旧 theme 残差     │
│  ルート要素 .fig-profile-consumer                            │
│        │ vite build                                          │
│        ▼                                                     │
│  dist/（静的フロント）→ 既存の配備方法でホスト              │
└──────────────────────────────────────────────────────────────┘
        │ CI: figuds-build.yml
        ▼
  ① submodule pin 整合（CORE-DS-VERSION=実 ref）
  ② npm ci → npm run build（prebuild 生成 → vite build 成功）
  （三層 Lint guardrail は U2-3 で接続）
```

## デプロイ単位・タイミング
- **製品ビルド**: prebuild で生成 → `vite build`。生成物は成果物（コミットしない）。
- **配備**: 既存方法（静的ホスティング）。U2-2 はランタイムデプロイを新設しない。

## 環境変数 / 入力
- `seed = #2C6B5E`（製品の単一設定・固定）。Core pin = `v1.2.0`（`CORE-DS-VERSION`）。秘密情報なし。

## 品質ゲート（マージ条件）
- `vite build` 成功（prebuild 生成込み）＋ submodule pin 整合 ＋ 主要画面 自己ビジュアル非回帰（手動チェックリスト）。
- a11y AA は Core 生成器が保証（製品は消費のみ）。

## ロールバック
- 製品は前の pin タグへ戻すだけ（submodule＋`CORE-DS-VERSION`）。ブリッジは 1 枚なので無効化も容易。
- before=`feature/home-redesign` 温存（before↔after diff）。

## N/A（明示）
- クラウド compute/storage/DB/queue/LB/CDN・オートスケール・ランタイム監視：**いずれも N/A**（製品の静的フロント・ビルド時生成）。
