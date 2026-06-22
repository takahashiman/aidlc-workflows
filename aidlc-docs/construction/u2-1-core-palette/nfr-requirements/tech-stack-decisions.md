# Tech Stack Decisions — U2-1 Core パレット基盤（C-Palette）

> 確定: NQ1=C / NQ2=A / NQ3=A＋。

## TSD-1 — 実行環境
- **Node（Core のビルド時実行）**。FIG-UDS Core のリポジトリ内ユーティリティとして配置。ランタイム配布は CSS のみ。

## TSD-2 — 色演算ライブラリ（NQ1=C：実装時 PoC で決定）
- **方針**: 実装時に **PoC で2案を比較**して確定（Code Gen の最初のサブステップ）。
  - **案A: ゼロ依存の自前実装** — OKLCH⇄sRGB 変換・相対輝度・WCAG コントラスト比を小ユーティリティで実装。SCA リスク最小・前サイクルの「最小依存」方針と一貫。
  - **案B: 小カラーライブラリ（例 culori）** — 変換精度・実装量で有利。依存・CVE 管理が増える。
- **判定基準（PoC で評価）**: ①OKLCH⇄sRGB の往復精度（既知色で誤差検証）②WCAG コントラスト値の正確性 ③依存追加の妥当性（CVE/サイズ）④旧 DS アンカー（seed=#2C6B5E → light≈#34796A / dark≈#1F5347）の再現度。
- **既定の傾き**: 精度が許容範囲なら **案A（ゼロ依存）を優先**。精度不足が判明した場合のみ案B。
- **記録先**: 決定は `dev-flow-journal.md`（配布/実装方針の確立として）にも残す。

## TSD-3 — 生成タイミング・出力（NQ2=A）
- **ビルド時スクリプト**が seed からトークンを生成し、**CSS（`--signature-*` / `--signature-50..900` / `--status-*`）を Core にコミット**。
- 利点: 決定性・diff レビュー・rolling 取込と整合。ランタイム生成（案B）は CSP/再現性懸念で不採用。

## TSD-4 — 出力形態
- Core の primitive/signature 層に CSS custom properties として出力。semantic 層がこれを参照（三層）。
- seed は製品の**単一設定**（`--seed` / project-settings・FD6=A）。Core 側は seed を入力にトークンを生成。

## TSD-5 — a11y（NQ3=A＋）
- **AA 必須**を生成側で保証（FD5 自動補正）。加えて **AAA 充足版を別出力**として生成・提示できる実装にする（製品が選択可能）。
- コントラスト計算は WCAG 2.1 定義（相対輝度ベース）に準拠。

## TSD-6 — テスト方針
- **PBT=No**（決定済）。代わりに**具体例ベースの単体テスト**＝既知 seed の期待トークン・a11y 合格・冪等・旧 DS アンカー一致を検証。
- Core CI（三層 Lint）に整合。

## TSD-7 — Security
- 依存は最小（案A なら 0）。採用時は SCA（HIGH/CRITICAL CVE を持ち込まない）。秘密情報なし。

## 決定サマリ
| 項目 | 決定 |
|---|---|
| 実行 | Node・Core ビルド時 |
| 色演算 | **PoC で案A(ゼロ依存)/案B(culori)を比較→確定**（既定は案A 傾き） |
| 生成/出力 | ビルド時生成→CSS トークンを Core にコミット |
| a11y | AA 必須＋AAA 充足版も提案出力 |
| テスト | 具体例ベース単体（PBT なし） |
| 依存/Security | 最小依存・SCA・秘密なし |
