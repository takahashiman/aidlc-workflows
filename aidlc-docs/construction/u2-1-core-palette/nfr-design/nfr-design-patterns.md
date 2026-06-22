# NFR Design Patterns — U2-1 Core パレット基盤（C-Palette）

> NFR Requirements を設計パターンへ落とす。U2-1 は決定的な**ビルド時純粋生成器**。

## P1 — Deterministic Pure Generation（決定的純粋生成）
- seed（＋surface）を入力に、副作用なく同一トークンを返す純関数として設計。グローバル状態・乱数・時刻に依存しない。
- **対応 NFR**: Reliability（冪等）・Maintainability。
- **検証**: 同 seed → バイト一致出力（単体テスト）。

## P2 — A11y Auto-Correction Loop（コントラスト自動補正ループ）
- `ensureAA(text, bg)`: コントラストが AA 未満の間、背景 L を AA 到達方向へ**段階調整**し、到達で確定。
- 大/通常テキストで閾値切替（3.0 / 4.5）。**生成は必ず AA 合格で返す**。
- **AAA 変種**: 同ループを AAA 閾値（4.5 / 7.0）でも回し、**別出力**として併産（NQ3=A＋）。
- **対応 NFR**: A11y（AD5-2）。

## P3 — Fail-Fast / Explicit Failure（明示的失敗）
- seed パース不可、または L が clamp（0/1 近傍）に達しても AA 未達 → **例外で失敗**（無音フォールバック禁止）。
- 失敗は呼び出し側（ビルド）で検知できるよう非ゼロ終了/throw。
- **対応 NFR**: Reliability（失敗の明示）。

## P4 — Build-Time Materialization（ビルド時実体化）
- 生成はビルド時スクリプトで実行し、**CSS トークンをコミット**（diff レビュー可）。ランタイム生成しない。
- **対応 NFR**: Performance（ランタイム0）・Reliability（再現性）・Security（CSP 非依存）。

## P5 — Dual-Conformance Output（AA／AAA 二系統出力）
- 既定出力＝AA 保証。加えて AAA 充足版を**別トークンセット/別ファイル**として出力し、製品が選択可能に。
- **対応 NFR**: A11y（NQ3=A＋）。

## P6 — Minimal-Dependency, PoC-Gated（最小依存・PoC 判定）
- 色演算は **PoC で案A(ゼロ依存)/案B(culori) を比較**し確定（既定は案A 傾き）。依存採用時は SCA。
- **対応 NFR**: Security（SCA）・Maintainability。

## P7 — Three-Layer Token Contract（三層トークン契約）
- 出力は primitive/signature・status トークン（`--signature-*`/`--status-*`）。semantic 層が参照、コンポーネントは semantic のみ。
- **対応 NFR**: Maintainability（三層遵守）。

## パターン × NFR マトリクス
| パターン | A11y | Reliability | Performance | Security | Maintainability |
|---|---|---|---|---|---|
| P1 決定的純粋生成 |  | ◎ | ○ |  | ○ |
| P2 a11y 自動補正 | ◎ | ○ |  |  |  |
| P3 fail-fast |  | ◎ |  | ○ |  |
| P4 ビルド時実体化 |  | ○ | ◎ | ○ |  |
| P5 AA/AAA 二系統 | ◎ |  |  |  |  |
| P6 最小依存/PoC |  |  | ○ | ◎ | ○ |
| P7 三層契約 |  |  |  |  | ◎ |

## 従来型基盤
- queue / cache / circuit breaker / load balancer / DB は **N/A**（ビルド時純粋生成器）。
