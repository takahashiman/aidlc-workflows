# Business Logic Model — U2-2 配布・ブリッジ

> 対象: BusDelayAlerts（`feature/figuds-adoption`）。技術非依存の業務ロジック（配布→生成→ブリッジ→描画）。
> 確定: FDQ1=A（ビルド時生成・gitignore）/ FDQ2=B（中核＋surface/border）/ FDQ3=A（旧DS委譲→段階無効化）/ FDQ4=A（signature→`--primary`）/ FDQ5=A（profile クラス）。

## 全体フロー（製品ビルド時）
```text
[1] 配布(C-Distrib)        Core を submodule pin（タグ）＋CORE-DS-VERSION 整合
        │                  → Core CSS（primitives/semantic/tokens）を Vite 解決可能に
        ▼
[2] 生成(C-Signature)      build 前フックで Core 生成器を実行:
        │                    gen:palette --seed=#2C6B5E
        │                  → 生成 signature.css/status.css（＋-aaa）を製品の生成出力先へ（gitignore）
        ▼
[3] ブリッジ(C-Bridge)     専用 CSS 1枚 figuds-bridge.css が
        │                    Core semantic（--signature-*/--status-*/--color-*）
        │                    → shadcn @theme 変数（--primary/--destructive/--background…）へ静的対応
        ▼
[4] プロファイル            ルート要素に .fig-profile-consumer 付与＋profile-consumer.css import
        ▼
[5] 描画                   既存 shadcn/Radix コンポーネントが @theme 変数経由で Core 色を描画
        ▼
[6] 検証                   vite build 成功（非回帰）＋ signature が Core 由来トークンで反映
```

## 擬似コード（配布・生成の手順）
```
# 一度きり（配布確立・US-D1）
addCoreSubmodule(repo="takahashiman/FIG-Universal-Design-System", path="vendor/core", ref=<SemVerタグ>)
writeFile("CORE-DS-VERSION", <SemVerタグ>)
assert(submodule.ref == read("CORE-DS-VERSION"))      # 版一致（BR-DIST-2）

# 毎ビルド（package.json scripts.prebuild / vite plugin）
run("node vendor/core/tools/palette-gen/generate.mjs --seed=#2C6B5E --out src/styles/generated")
import "src/styles/generated/signature.css"           # gitignore（BR-SIG-2）
import "src/styles/generated/status.css"
import "vendor/core/primitives.css", "vendor/core/semantic.css", "vendor/core/tokens/*.css"
import "src/styles/figuds-bridge.css"                 # 最後に読み込む（上書き順・BR-BRIDGE-3）
```

## スタイル読み込み順（決定的・三層 + ブリッジ）
```
fonts → tailwind → core(primitives → semantic → signature(生成) → status(生成) → profile-consumer)
      → figuds-bridge(@theme 対応)  → 既存 theme.css 残差（段階的に縮小・FDQ3=A）
```
> ブリッジは Core 読込後・最後に置き、@theme 変数を Core へ上書き（CSS 後勝ち）。

## 関係（component）
- **C-Distrib** … submodule/版整合/Core CSS の取り込み・`vite build` 非回帰。
- **C-Signature** … `gen:palette --seed=#2C6B5E` 実行＝U2-1 C-Palette 利用（旧手動 teal-* 派生を置換）。
- **C-Bridge** … Core semantic → shadcn @theme の静的対応表（ランタイム無し・宣言的 CSS）。

## トレーサビリティ
- US-D1（AC①-4）= [1]配布・`vite build`。US-D5（NFR2-3 非回帰）= [3]ブリッジ。US-D6 = [4]プロファイル。
- 依存: U2-1（C-Palette・要 Core push＋タグ）。次: U2-3（状態色 semantic 化・生 HEX 解消）。
