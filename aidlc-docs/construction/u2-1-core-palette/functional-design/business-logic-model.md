# Business Logic Model — U2-1 Core パレット基盤（C-Palette）

> 技術非依存の業務ロジック。確定: FD1=A（OKLCH L シフト）/ FD2=B（surface と mix・不透明）/ FD3=A（tonal ramp 50–900）/
> FD4=C（status は規定 hue＋共通規則＋a11y 範囲で seed 寄り微調整）/ FD5=A（a11y 自動補正）/ FD6=A（製品の単一設定で seed 宣言）。

## 目的
アプリのメインカラー（seed）から、**signature パレット**・**status パレット**・**tonal ramp** を **OKLCH** 演算で生成し、
すべての文字／背景ペアが **WCAG AA** を満たすことを保証して、`--signature-*` / `--status-*` トークンを出力する。
seed を差し替えれば派生一式が再生成される（= Taste 派生）。

## 入力・出力
- **入力**: `seed`（製品の単一設定＝`--seed` / project-settings・FD6=A）／任意で `surface`（合成相手・既定=白）。
- **出力**: トークン集合（CSS custom properties）＝ signature 変種・status 群・ramp。semantic 層がこれを参照。

## 生成パイプライン
```text
seed(hex/oklch)
   │ 1. OKLCH へ正規化（L,C,H）
   ▼
2. signature 変種を生成
   ├ base   = seed
   ├ light  = L+ΔL_light（H 固定・端で C 抑制）           … FD1=A
   ├ dark   = L−ΔL_dark
   ├ tint   = mix(seed, surface, w_tint)  ※不透明           … FD2=B
   ├ shadow = mix(seed, shadowBase, w_shadow) ※不透明
   ├ ramp   = {50..900} を L 固定ステップで生成             … FD3=A
   └ on-base= pickOnColor(base)（後段 a11y で確定）
   ▼
3. status パレットを生成                                     … FD4=C
   ├ 規定 hue（success=緑 / warning=琥珀 / danger=赤）を基準
   ├ signature と同じ L/tint/on-color 規則を適用
   └ a11y を保てる範囲で seed の hue へ微回転（調和）
   ▼
4. a11y 検証 & 自動補正                                       … FD5=A
   └ 各 (text, bg) ペアの contrast を算出
      → AA 未満なら bg の L を段階調整し、AA 到達で確定（必ず合格で返す）
   ▼
5. emit: --signature-* / --status-* / --signature-ramp-* を出力
```

## 主アルゴリズム（擬似コード）
```text
generatePalette(seed, surface=WHITE):
    s = toOKLCH(seed)
    sig = {
        base:   s,
        light:  clampOklch(L=s.L + DL_LIGHT, C=taperChroma(s, +), H=s.H),
        dark:   clampOklch(L=s.L - DL_DARK,  C=taperChroma(s, -), H=s.H),
        tint:   mixOklch(s, toOKLCH(surface), W_TINT),     # 不透明
        shadow: mixOklch(s, SHADOW_BASE,      W_SHADOW),
        ramp:   [ rampStep(s, i) for i in RAMP_STEPS ],    # 50..900
    }
    sig.onBase = ensureAA(text=pickWhiteOrDark(sig.base), bg=sig.base)

    status = {}
    for name, baseHue in {success:H_GREEN, warning:H_AMBER, danger:H_RED}:
        st = applySignatureRules(baseHue, s)               # 同じ L/tint/on 規則
        st = nudgeHueToward(st, s.H, limit=HUE_NUDGE_MAX)  # FD4=C 調和（a11y 内）
        st.on = ensureAA(text=pickWhiteOrDark(st.surface), bg=st.surface)
        status[name] = ensureAA_all(st)
    return emitTokens(sig, status)

ensureAA(text, bg):                                         # FD5=A 自動補正
    while contrast(text, bg) < AA_THRESHOLD(text.size):
        bg = shiftL(bg, towardContrast(text))              # L を段階調整
        if reachedClamp(bg): break
    return {text, bg, ratio: contrast(text,bg), passAA: true}
```

## データフロー（U2-2 以降への接続）
- 出力トークン → Core **semantic 層**（`--color-surface-brand` 等）が参照 → C-Bridge（U2-2）で Tailwind `@theme` へ。
- status トークン → U2-3 の状態色（正常/遅延/運休）適用で消費。

## エラー/境界シナリオ
- seed が不正（パース不可）→ 生成失敗（明示エラー）。
- 自動補正が clamp（L=0/1 近傍）に達しても AA 未達 → **生成失敗**として報告（採用不可・BR で規定）。
- surface 未指定 → 既定（白）で合成。
