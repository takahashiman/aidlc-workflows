# Business Rules — U2-1 Core パレット基盤（C-Palette）

> 派生規則・a11y 制約・fallback の正典。値（Δ/重み/しきい値）は実装初期値（Code Gen で微調整可）。

## BR-PAL-1 — 色空間は OKLCH
- 全演算は **OKLCH**（L:0–1, C:0–~0.4, H:0–360）で行い、出力は hex（必要に応じ oklch 併記）。
- 理由: 知覚均等で L シフトが視覚的に安定（FD1=A）。

## BR-PAL-2 — signature 変種の導出（FD1=A / FD2=B）
| 変種 | 規則（seed=base 基準） | 初期値 |
|---|---|---|
| base | seed そのもの | — |
| light | L を +ΔL_light（H 固定）。C は高 L 端で過飽和回避に逓減（taper） | ΔL_light = **+0.08** |
| dark | L を −ΔL_dark（H 固定）。C は低 L 端で逓減 | ΔL_dark = **−0.10** |
| tint | seed と surface を **mix（不透明）** | W_tint = **0.10**（seed 比） |
| shadow | seed と shadowBase を **mix（不透明）** | W_shadow = **0.25**, shadowBase=やや暗い中立 |
- **検証アンカー**: seed=`#2C6B5E` で light≈`#34796A`・dark≈`#1F5347` に概ね一致すること（旧 DS 実測）。
- **不透明化（FD2=B）**: tint/shadow は α を使わず、重ね順非依存の実色を出す。

## BR-PAL-3 — tonal ramp（FD3=A）
- ramp = {50,100,200,300,400,500,600,700,800,900}（必要なら 950 を追加）。
- 各段は L を**固定ステップ**で配置（H 固定・端で C を taper）。500 を seed 近傍に対応づける。
- 用途: Tailwind/shadcn 互換の階調参照。semantic は原則 base/light/dark を使い、ramp は補助。

## BR-PAL-4 — status 生成（FD4=C）
- 規定基準 hue: success=緑系 / warning=琥珀系 / danger=赤系（意味の普遍性を保持）。
- 各 status に **signature と同じ L/tint/on-color 規則**を適用（surface/tint/on を統一品質で生成）。
- その後、**a11y を保てる範囲**で hue を seed 方向へ微回転（`HUE_NUDGE_MAX` 以内）して調和（FD4=C）。
  - 微回転で AA を割るなら回転量を縮小（a11y 優先）。
- status は「正常/遅延/運休」（U2-3）へ写像される（success/warning/danger）。

## BR-PAL-5 — a11y（WCAG AA）必須・自動補正（FD5=A / AD5-2=B）
- しきい値: 通常テキスト **≥4.5**、大テキスト（>=18.66px bold / >=24px）**≥3.0**。
- **on-color**: まず白/濃色から AA を満たす方を選ぶ。なお不足なら**背景の L を AA 到達まで段階調整**して確定。
- **生成は必ず AA 合格で返す**（決定性）。
- **fallback の限界**: L が clamp（0 または 1 近傍）に達しても AA 未達なら **生成失敗**（採用不可）として報告（BR-PAL-7）。

## BR-PAL-6 — 出力契約（トークン命名）
- signature: `--signature-base/-light/-dark/-tint/-shadow/-on`、ramp: `--signature-50 … --signature-900`。
- status: `--status-success/-warning/-danger` と各 `-surface/-tint/-on`。
- これらを Core **semantic 層**が参照（コンポーネントは semantic のみ参照＝三層遵守）。

## BR-PAL-7 — 不変条件 / 失敗時
- すべての (text,bg) 出力ペアは **AA 合格**であること（不変条件）。
- seed パース不可・補正限界で AA 未達 → 生成失敗（明示エラー・無音フォールバックしない）。
- seed 差替で**冪等**（同 seed→同出力＝決定性）。

## BR-PAL-8 — seed 入力（FD6=A）
- seed は製品の**単一設定**（`--seed` / project-settings）で宣言。C-Palette はそれを唯一の入力とする。
- 1 製品 1 seed（Taste 派生＝seed 差替で別プロジェクトのパレット）。

## トレーサビリティ
- AC①-1（signature 集約）= BR-PAL-2/6/8。AC①-2（状態色 semantic）= BR-PAL-4/6。
- a11y（NFR2-5 / AD5-2）= BR-PAL-5/7。決定性（NFR）= BR-PAL-7。
