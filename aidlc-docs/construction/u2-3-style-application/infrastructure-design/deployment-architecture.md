# Deployment Architecture — U2-3 スタイル適用

> U2-2 の配備（マルチレポ・ビルド時生成・静的ホスト）を継承。U2-3 は CI に検証/ガードを追加（配備手段そのものは不変）。

## 配備の全体像（ビルド時・マルチレポ・U2-3 拡張）
```text
┌─ FIG-UDS Core repo（pin 元・tag v1.2.1）───────────────────┐
│  primitives/semantic/tokens/*.css ＋ tools/palette-gen     │
└──────────────┬──────────────────────────────────────────────┘
               │ git submodule（pin v1.2.1・CORE-DS-VERSION）
               ▼
┌─ BusDelayAlerts repo（feature/figuds-adoption）─────────────┐
│  vendor/core（submodule）                                   │
│  prebuild/predev: generate.mjs --seed=#2C6B5E               │
│      --out src/styles/generated（gitignore）               │
│  src/styles/index.css:                                       │
│    fonts → tailwind → vendor/core(...) → figuds-bridge       │
│      （@theme: primary=signature, status=success/warning/    │
│        danger）→ 旧 theme 残差                               │
│  ※ 旧 src/styles/tokens/{primitives,semantic}.css は撤去    │
│  主要導線: [#2C6B5E]→primary・状態色→success/warning/danger │
│        │ vite build                                          │
│        ▼                                                     │
│  dist/（静的フロント）→ 既存の配備方法でホスト              │
│  tests/vrt/__screenshots__/（Linux ベースライン・repo管理） │
└──────────────────────────────────────────────────────────────┘
        │ CI: figuds-build.yml（拡張・1 workflow）
        ▼
  ① submodule pin 整合（CORE-DS-VERSION=実 ref）
  ② npm ci → npm run build（prebuild 生成 → vite build 成功）
  ③ raw-hex guard（主要導線 glob・ヒット fail）★U2-3 新規
  ④ VRT job（Playwright・Linux ベースライン差分 fail）★U2-3 新規
```

## デプロイ単位・タイミング
- **製品ビルド**: prebuild 生成 → `vite build`。生成物は成果物（コミットしない）。
- **配備**: 既存方法（静的ホスティング）。U2-3 もランタイムデプロイを新設しない。
- **VRT ベースライン**: Linux 生成画像を repo 管理（CI 真実源）。意図更新は `--update-snapshots`＋レビュー承認。

## 環境変数 / 入力
- `seed = #2C6B5E`（固定）。Core pin = `v1.2.1`（`CORE-DS-VERSION`）。秘密情報なし。

## 品質ゲート（マージ条件）
- `vite build` 成功（prebuild 生成込み）＋ submodule pin 整合 ＋ **raw-hex guard 緑（主要導線 生 HEX 0）** ＋ **VRT ベースライン差分なし** ＋ 主要画面 自己ビジュアル非回帰（チェックリスト・VRT を補完）。
- a11y AA は Core 生成器が保証（製品は消費のみ）。

## ロールバック
- 製品は前の pin タグへ戻すだけ（submodule＋`CORE-DS-VERSION`）。ブリッジ/置換は className レベルで局所的。
- 旧 tokens 撤去はコミット単位で revert 可能。VRT ベースラインで撤去前後の差を検証。
- before=`feature/home-redesign` 温存（before↔after diff・BR-STYLE-8）。

## N/A（明示）
- クラウド compute/storage/DB/queue/LB/CDN・オートスケール・ランタイム監視：**いずれも N/A**（静的フロント・ビルド時生成）。
