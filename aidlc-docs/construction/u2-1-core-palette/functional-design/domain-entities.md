# Domain Entities — U2-1 Core パレット基盤（C-Palette）

> 技術非依存のドメインモデル（型は概念表現・実装言語非依存）。

## Color
- **属性**: `oklch{ L: 0–1, C: 0–~0.4, H: 0–360 }` / `hex` / （任意）`alpha`。
- **責務**: 色の正規表現。変換 `toOKLCH() / toHex()`。
- **不変条件**: L/C/H は範囲内（clamp 済）。

## Seed
- **属性**: `value: Color`（製品メインカラー）、`source: 'project-setting'`（FD6=A）。
- **責務**: 生成の唯一入力。1 製品 1 seed。

## SignaturePalette
- **属性**: `base / light / dark / tint / shadow: Color`、`on: OnColor`、`ramp: RampStep[]`。
- **派生元**: Seed（BR-PAL-2/3）。

## RampStep
- **属性**: `step: 50..900`、`color: Color`。
- **規則**: L 固定ステップ（BR-PAL-3）。

## StatusPalette
- **属性**: `success / warning / danger: StatusEntry`。
- **StatusEntry**: `{ base: Color, surface: Color, tint: Color, on: OnColor }`。
- **派生**: 規定 hue＋共通規則＋a11y 内 hue 微回転（BR-PAL-4）。

## OnColor
- **属性**: `text: Color`（白/濃色）、`bg: Color`（補正後）、`a11y: A11yResult`。
- **責務**: 文字色と背景の AA 合格ペア（BR-PAL-5）。

## A11yResult
- **属性**: `ratio: number`、`passAA: bool`、`passAAA: bool`、`textSize: 'normal'|'large'`。
- **責務**: コントラスト検証結果。`passAA=false` は採用不可（BR-PAL-7）。

## PaletteOutput（出力契約）
- **属性**: `tokens: Map<name, Color>`（`--signature-*` / `--signature-50..900` / `--status-*`）。
- **責務**: semantic 層が参照する CSS トークン集合（BR-PAL-6）。
- **不変条件**: 全 on/bg ペアが AA 合格・seed 冪等。

## 関係図（テキスト）
```text
Seed ──1:1──► SignaturePalette ──has──► RampStep[] , OnColor
            └─generates──► StatusPalette ──has──► StatusEntry{ OnColor }
SignaturePalette + StatusPalette ──emit──► PaletteOutput(tokens)
OnColor / StatusEntry ──validated-by──► A11yResult (AA 必須)
PaletteOutput ──consumed-by──► Core semantic 層 ──► C-Bridge(U2-2) ──► Tailwind @theme
```

## 値の初期既定（Code Gen で確定）
| 記号 | 既定 | 出典 |
|---|---|---|
| ΔL_light | +0.08 | 旧 DS light=#34796A 近似 |
| ΔL_dark | −0.10 | 旧 DS dark=#1F5347 近似 |
| W_tint | 0.10 | 旧 DS tint α0.10 相当を不透明 mix へ |
| W_shadow | 0.25 | 旧 DS shadow α0.25 相当 |
| AA_normal / AA_large | 4.5 / 3.0 | WCAG 2.1 AA |
| HUE_NUDGE_MAX | （実装で決定） | FD4=C 調和上限 |
