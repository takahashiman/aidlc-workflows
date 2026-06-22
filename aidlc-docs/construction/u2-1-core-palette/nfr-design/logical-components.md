# Logical Components — U2-1 Core パレット基盤（C-Palette）

> 生成器の内部論理分割（技術非依存）。従来型インフラ要素は N/A。

## LC-SeedInput — seed 入力
- **責務**: 製品の単一設定（`--seed`/project-settings）から seed を読み取り正規化（FD6=A）。
- **出力**: 正規化 Color（OKLCH）。不正は P3 fail-fast。

## LC-ColorMath — 色演算（PoC 確定）
- **責務**: OKLCH⇄sRGB 変換・mix・相対輝度・WCAG コントラスト比。
- **実装**: 案A ゼロ依存 or 案B culori（PoC・既定 A）。**LC 内に隔離**し他要素は本 LC のみ依存（差替容易）。

## LC-Deriver — signature 変種導出
- **責務**: base/light(L+0.08)/dark(L−0.10)/tint(mix)/shadow(mix)/ramp(50–900) を生成（BR-PAL-2/3）。
- **依存**: LC-ColorMath。

## LC-StatusDeriver — status 導出
- **責務**: 規定 hue（緑/琥珀/赤）＋共通規則を適用し、a11y 内で seed 方向へ hue 微回転（BR-PAL-4・FD4=C）。
- **依存**: LC-ColorMath・LC-A11y。

## LC-A11y — コントラスト検証・自動補正
- **責務**: `validateA11y` と `ensureAA`（P2）。AA 保証＋AAA 変種算出（P5）。補正限界で P3 失敗。
- **依存**: LC-ColorMath。

## LC-Emitter — トークン出力
- **責務**: signature/status/ramp を CSS custom properties（`--signature-*`/`--status-*`）として出力（BR-PAL-6・P4）。
- **出力**: Core にコミットされる CSS（AA 既定＋AAA 別出力）。

## LC-Orchestrator — 生成器本体
- **責務**: LC-SeedInput → LC-Deriver / LC-StatusDeriver → LC-A11y → LC-Emitter を決定的に統合（P1）。ビルド時エントリ。

## 依存図
```text
LC-SeedInput ─► LC-Orchestrator
                   ├─► LC-Deriver ──► LC-ColorMath
                   ├─► LC-StatusDeriver ──► LC-ColorMath / LC-A11y
                   ├─► LC-A11y ──► LC-ColorMath
                   └─► LC-Emitter ──► (Core CSS tokens)
```

## 従来型基盤（N/A）
- Queue / Cache / Circuit Breaker / Load Balancer / DB / 外部 API：**いずれも N/A**（ビルド時純粋生成器・外部 I/O なし）。

## テスト観点（具体例ベース・PBT なし）
- 既知 seed（#2C6B5E）→ light≈#34796A / dark≈#1F5347（アンカー一致）。
- 全 on/status ペア AA 合格・AAA 変種も AAA 合格。
- 同 seed 冪等（バイト一致）。LC-ColorMath 差替で出力不変（精度許容内）。
