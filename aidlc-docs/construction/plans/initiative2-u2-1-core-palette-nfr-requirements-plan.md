# NFR Requirements Plan — U2-1 Core パレット基盤（Part 1）

> Functional Design（OKLCH 生成・a11y 自動補正・トークン出力）を踏まえた非機能要件と tech stack。
> U2-1 は **ビルド時のトークン生成ユーティリティ**（ランタイムサービスでない）。確定済前提: Security Baseline=有効・PBT=No・a11y AA 必須（AD5-2）。
> `[Answer]:` 記入後に生成。推奨案に **(推奨)**。

## 既定（質問不要・確認のみ）
- **Scalability/Availability**: ビルド時実行のため対象外（N/A）。負荷/可用性の概念なし。
- **Performance**: seed 1 つから数十トークン生成＝軽量・即時。ビルドを遅延させない。
- **Reliability**: 決定性（seed 冪等）・a11y AA を必ず満たして返す／補正限界は生成失敗（BR-PAL-7）。
- **Security**: Security Baseline 有効だが、ランタイム攻撃面なし＝大半 N/A。該当は **SCA（依存 CVE）** と秘密情報非保持。
- **Maintainability**: 三層遵守・トークン契約（BR-PAL-6）・Core ドキュメント更新。
- **Usability/a11y**: WCAG 2.1 **AA 必須**（AD5-2）。

---

## 回答確定（NQ1-NQ3）
- **NQ1=C**（色演算 tech stack は実装時 PoC で案A ゼロ依存/案B culori を比較確定・既定は案A 傾き）。
- **NQ2=A**（ビルド時生成→CSS トークンを Core にコミット）。
- **NQ3=A＋**（AA 必須・AAA は可能な範囲。**加えて AAA 充足版も提案出力できる準備**）。
- 生成: `nfr-requirements.md` / `tech-stack-decisions.md`。

## 質問（Part 1）

## Question NQ1 — 色演算（OKLCH 変換・コントラスト）の tech stack
OKLCH 変換・mix・WCAG コントラスト計算をどう実装しますか？

A) **ゼロ依存の自前実装（OKLCH⇄sRGB 変換・相対輝度・コントラスト比を小さなユーティリティで） (推奨)** — 前サイクルの「最小依存・軽量 Node」方針と一貫。SCA リスク最小。

B) **小さなカラーライブラリ（例 culori）を依存に追加** — 変換精度・実装量で有利。依存・CVE 管理が増える。

C) **実装時に PoC で精度を比較して決定**

X) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question NQ2 — 生成のタイミングと出力形態
パレットトークンをどう生成・配布しますか？

A) **ビルド時スクリプトが CSS トークン（`--signature-*`/`--status-*`）を生成し、Core にコミット（差分レビュー可） (推奨)** — 決定性・diff で before↔after 明瞭・rolling 取込と整合。

B) **ランタイム（ブラウザ）で動的生成** — CSP/性能/再現性の懸念。非推奨。

C) **生成は手動実行（CI 非連携）で結果のみコミット** — 最小だが再現手順が属人化。

X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question NQ3 — a11y 目標レベル
コントラスト目標をどこに置きますか？

A) **AA 必須・AAA は可能な範囲で（必須にしない） (推奨)** — 実用性と網羅性のバランス（FD5 の自動補正は AA を保証）。

B) **AAA を必須** — 最高水準だが色選択の自由度が大きく下がる。

X) Other (please describe after [Answer]: tag below)

[Answer]: A, 但しAAAを満たした場合のパターンも提案できるよう準備して欲しい。
