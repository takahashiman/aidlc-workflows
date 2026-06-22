# Application Design 追加確認（clarification）— AD1 / AD5

> AD2=C・AD3=A・AD4=A は確定。AD1（相談）と AD5（相談＝パレット生成メソッド）を、具体案つきで確認します。
> `[Answer]:` に英字を記入し「done」とお知らせください。推奨案に **(推奨)**。

---

## Clarification AD5 — seed 駆動「パレット生成メソッド」（最重要・C-Signature / Taste）

### ご提案の咀嚼
「ブランドカラーを基点に派生させたパレット生成**法則**を確立し、**ブランドカラーの代わりにアプリ固有のメインカラー**を
seed にして同じ法則でパレットを生成するメソッド」＝ FIG-UDS の signature 機構を **seed パラメトリック化**する構想。
旧 DS の手動派生（`teal / -light / -dark / -tint / -shadow`）を**法則化**して再利用可能にする。

### 具体案（生成法則のドラフト）
- **入力**: seed＝アプリのメインカラー（例: LLocana `#2C6B5E`）。
- **色空間**: **OKLCH**（知覚均等・既存 `theme.css` も oklch 採用）で演算、出力は hex/oklch。
- **派生規則（旧 DS の teal-* を一般化）**:
  | 役割 | 生成規則（seed=基準） |
  |---|---|
  | base | seed そのもの |
  | light | L を +Δ（例 +0.08）, H 固定 |
  | dark | L を −Δ（例 −0.10）, H 固定 |
  | tint | seed を alpha 0.10（or surface と mix） |
  | shadow | seed を alpha 0.25 |
  | on-color（seed 上文字） | WCAG AA ≥4.5 を満たす white/dark を**自動選択**（a11y 担保） |
  | hover-overlay | state.hover 規約のオーバーレイ |
  | （任意）tonal ramp 50–900 | L を固定ステップで階段化（H 固定・端で C 調整） |
- **出力**: signature プリミティブ群（`--signature-*`）→ semantic 層（`--color-surface-brand` 等）が参照。
- **適用**: signature 機構を「**seed を差し替えれば派生一式が再生成**」へ。LLocana は seed=`#2C6B5E`。
  将来は各プロジェクトの main color を seed にした **Taste 派生**。

### Clarification Question AD5 — このメソッドをどのスコープで確立しますか？
A) **Core（FIG-UDS）の signature/Taste ユーティリティ＋法則ドキュメントとして確立し、LLocana を最初の適用例にする (推奨)**
   — goal① の「Core を都度修正」と整合。全アプリが恩恵。Core 昇格(US-X1)とも自然に繋がる。

B) **今サイクルは LLocana ローカルに method 確立、Core 一般化は次サイクル** — まず1アプリで実証。

C) **法則のドキュメント化のみ（生成コードなし）、LLocana へは手作業適用** — 最小。仕組みは作らない。

X) Other (please describe after [Answer]: tag below)

[Answer]: A

### Clarification Question AD5-2 — status 色（success/warning/danger）の扱い
状態色は seed パレットと別系統です。どうしますか？

A) **Core semantic の status をそのまま使う（seed と独立） (推奨)** — 可読性・意味の普遍性を優先。

B) **seed の色相に寄せて調和させる** — ブランド調和を優先（a11y 検証を追加で要する）。

X) Other (please describe after [Answer]: tag below)

[Answer]: B, status色についてもパレッド生成メソッドを確立させる（a11y 検証必須）

---

## Clarification AD1 — @theme トークンブリッジ層の置き場（A か C か）

### 相談メモ（AD5 との関係で整理）
AD5 で「パレット生成メソッド」を持つ場合、**生成されるのは signature/primitive のパレット**であり、
ブリッジ層が担うのは「**Core semantic → アプリ Tailwind `@theme`/変数**」の**対応づけ（小さく静的）**です。
つまり「生成」は AD5（パレット）に閉じ、ブリッジ（AD1）は手書きで十分という整理ができます。

| | A: 専用ブリッジ CSS 1枚 | C: 対応表＋生成スクリプト |
|---|---|---|
| 対象 | semantic→Tailwind の対応（静的・小） | 同左を表から生成 |
| 仕組みの重さ | 軽 | 重（スクリプト保守） |
| before↔after の明瞭さ | ◎（1枚に集約） | ○ |
| AD5 との重複 | なし（生成は AD5 に集約） | 生成が二重になりがち |

**推奨**: **A（専用ブリッジ CSS 1枚）**。生成が要るのは AD5 のパレットだけに留め、ブリッジは 1 枚に集約して
before↔after を明瞭にする。

### Clarification Question AD1
A) **A: 専用ブリッジ CSS 1枚に集約（生成は AD5 のパレットのみ） (推奨)**

B) **C: 対応表＋生成スクリプトでブリッジも生成**

X) Other (please describe after [Answer]: tag below)

[Answer]: A
