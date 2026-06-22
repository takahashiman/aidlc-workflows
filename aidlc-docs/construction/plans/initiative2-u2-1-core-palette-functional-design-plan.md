# Functional Design Plan — U2-1 Core パレット基盤（Part 1）

> 対象 Unit: U2-1（C-Palette を FIG-UDS Core に新設）。技術非依存の業務ロジック設計。
> ストーリー: US-D2/US-D3（基盤）・AD5/AD5-2。確定: AD5=A（Core ユーティリティ）/ AD5-2=B（status も生成・a11y 必須）。
> `[Answer]:` 記入後に生成。推奨案に **(推奨)**。

## 手がかり（旧 DS の実測アンカー・seed=`#2C6B5E`）
| 役割 | 旧 DS 値 | 示唆 |
|---|---|---|
| base | `#2C6B5E` | seed |
| light | `#34796A` | seed より明るい（L↑・同系統） |
| dark | `#1F5347` | seed より暗い（L↓） |
| tint | `rgba(44,107,94,0.10)` | seed α0.10 |
| shadow | `rgba(44,107,94,0.25)` | seed α0.25 |

## 生成する成果物（Part 2）
- [x] `construction/u2-1-core-palette/functional-design/business-logic-model.md`（生成パイプライン/擬似コード）
- [x] `construction/u2-1-core-palette/functional-design/business-rules.md`（BR-PAL-1〜8・a11y 自動補正・トークン契約）
- [x] `construction/u2-1-core-palette/functional-design/domain-entities.md`（Color/Seed/SignaturePalette/StatusPalette/OnColor/A11yResult/PaletteOutput）
- （UI なしのため frontend-components は作成しない）

## 回答確定（FD1-FD6）
- FD1=A（OKLCH L シフト・ΔL_light+0.08/ΔL_dark−0.10）/ FD2=B（surface と mix・不透明）/ FD3=A（ramp 50–900）/
  FD4=C（status 規定 hue＋共通規則＋a11y 内 seed 寄り微回転）/ FD5=A（a11y 自動補正・必ず AA で返す）/ FD6=A（製品の単一設定 seed）。

---

## 質問（Part 1）

## Question FD1 — light/dark バリアントの導出規則
seed から light/dark をどう導出しますか？

A) **OKLCH の L を固定量シフト（例 light=L+0.08 / dark=L−0.10、H 固定・C は端で微調整）。旧 DS 値に近づける (推奨)** — 知覚均等・再現性が高い。`#34796A`/`#1F5347` に概ね一致。

B) **既定の tonal ramp から light=300相当 / dark=700相当を選ぶ** — ramp 前提（FD3=A の場合）。

C) **旧 DS の実測差分（ΔL/ΔC/ΔH）を seed 非依存の固定オフセットとして踏襲** — teal でのチューニングを他色にも適用（色によりズレ得る）。

X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question FD2 — tint / shadow の生成
tint（淡い塗り）と shadow（影色）はどう作りますか？

A) **seed の alpha 版（tint=α0.10 / shadow=α0.25）を踏襲 (推奨)** — 旧 DS と一致。surface に対し透過合成。

B) **seed と surface を OKLCH で mix（不透明値を生成）** — 透過に依存しない実色。重なり順に強いが計算増。

X) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question FD3 — tonal ramp（50–900 の階調）を作るか
signature に数値 ramp（50/100/.../900）を持たせますか？

A) **作る（50–900 の 9〜11 段・L 固定ステップ） (推奨)** — Tailwind/shadcn 互換・将来の表現幅。生成コストは中。

B) **作らない（base/light/dark/tint/shadow/on-color の機能変種のみ）** — 最小。今サイクルは機能変種で足りる。

C) **簡易 ramp（3〜5 段）に留める** — 中間。

X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question FD4 — status 色（success/warning/danger）の生成法則（AD5-2=B）
status を「生成メソッド化」する具体方式は？（a11y 必須）

A) **規定の status 基準色（緑/琥珀/赤の hue）に、signature と同じ L/tint/on-color 規則を適用して生成 (推奨)** — 意味の普遍性（緑=正常等）を保ちつつ、surface/tint/on-color/コントラストを seed と同じ品質規則で統一。a11y 検証必須。

B) **seed の hue を基準に status hue を相対回転して調和** — ブランド調和最優先。ただし「赤＝危険」等の普遍性が崩れる懸念・a11y 検証必須。

C) **A を基本に、各 status の最終色は a11y を満たす範囲で seed 寄りに微調整** — 普遍性＋調和の折衷。

X) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question FD5 — a11y（WCAG AA）不合格時の fallback
on-color や status が AA（コントラスト≥4.5、大テキスト≥3.0）を満たさない場合の挙動は？

A) **自動補正（背景の L を AA を満たすまで段階調整し、超えたら確定） (推奨)** — 生成は必ず AA 合格で返す。設計の決定性を保つ。

B) **不合格は生成失敗として停止し、手動調整を促す** — 厳格。意図しない自動変化を避ける。

C) **on-color は白/黒の二択から AA を満たす方を選ぶだけ（背景は変えない）** — 最小。背景由来の不足は別途。

X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question FD6 — seed の宣言場所（製品からの入力）
製品（LLocana）はメインカラー seed をどこで宣言して C-Palette に渡しますか？

A) **製品の設定（例 `project-settings` / CSS 変数 `--seed`）で1箇所宣言し、Core の生成を適用 (推奨)** — 単一入力・差替が容易（Taste 派生に直結）。

B) **ビルド時にスクリプト引数で渡す** — CI 連携向き。宣言が散る懸念。

X) Other (please describe after [Answer]: tag below)

[Answer]: A
