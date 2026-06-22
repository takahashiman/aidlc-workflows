# Logical Components — U2-2 配布・ブリッジ

> 製品側のスタイル配布/ブリッジ構造を論理要素へ分割（技術非依存）。従来型インフラ要素は N/A。

## LC-Submodule — Core 配布（vendor/core）
- **責務**: Core を submodule で pin（`v1.2.0`）し、`CORE-DS-VERSION` と整合（P1）。Core CSS を Vite 解決可能に。
- **入出力**: in=Core repo タグ / out=`vendor/core/**`（primitives/semantic/tokens/tools）。

## LC-Generator-Hook — ビルド時生成フック
- **責務**: prebuild で `vendor/core/tools/palette-gen/generate.mjs --seed=#2C6B5E` を実行（P2）。
- **出力**: `src/styles/generated/{signature,status}.css`（＋`-aaa`・gitignore）。
- **依存**: LC-Submodule（生成器の所在）・U2-1 C-Palette。

## LC-Bridge — トークンブリッジ層
- **責務**: Core semantic → shadcn `@theme` の静的対応（P3・1 枚・後勝ち）。範囲＝中核＋面/線。
- **形式**: 宣言的 CSS（`:root { --primary: var(--signature-base); … }`）。ランタイム無し。
- **依存**: LC-Submodule（Core semantic）・LC-Generator-Hook（signature/status）。

## LC-Profile — プロファイル適用
- **責務**: ルート要素に `.fig-profile-consumer` ＋ `tokens/profile-consumer.css` import（P3 範囲外の独立適用）。

## LC-Legacy-Shim — 旧DS 委譲
- **責務**: 旧 `tokens/{primitives,semantic}.css` をブリッジ経由で Core へ委譲し段階的に無効化（P4）。撤去は U2-3。

## LC-Verify — 非回帰検証
- **責務**: `vite build` 成功＋自己ビジュアルチェックリスト＋gzip 増分記録（P5）。CI/ローカル。

## 依存図
```text
LC-Submodule ─► LC-Generator-Hook ─► LC-Bridge ─► (shadcn @theme) ─► 既存コンポーネント描画
      │                  │               ▲
      └──────────────────┴── LC-Profile ─┘
LC-Legacy-Shim ──(委譲)──► LC-Bridge
LC-Verify ──(build＋自己ビジュアル＋gzip)──► 全体
```

## スタイル読込順（決定的）
```
fonts → tailwind → vendor/core(primitives→semantic→signature(生成)→status(生成)→profile-consumer)
      → figuds-bridge → 既存 theme.css 残差（段階縮小）
```

## 従来型基盤（N/A）
- Queue / Cache / Circuit Breaker / Load Balancer / DB / 外部 API：**いずれも N/A**（ビルド時・静的配布・外部 I/O なし）。

## 検証観点（具体例ベース・PBT なし）
- submodule ref＝`CORE-DS-VERSION`＝`v1.2.0` 一致。
- `gen:palette --seed=#2C6B5E` 出力が決定的（再実行で一致）。
- `vite build` 成功・主要画面非回帰・ブランド主色が Core signature（teal）で反映。
- `.fig-profile-consumer` 上書きが効く。
