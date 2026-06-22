# NFR Requirements Plan — U2-2 配布・ブリッジ（Part 1）

> 対象 Unit: U2-2（BusDelayAlerts・配布/ブリッジ）。FD 確定（FDQ1-5）を前提に NFR を評価。
> Extension: Security Baseline=Yes / PBT=No（#2 確定）。`[Answer]:` 記入後に Part 2 を生成。

## 回答確定（2026-06-21）
- **NQ1=A**: 非回帰＝`vite build` 成功＋主要画面の自己ビジュアルチェックリスト（セルフ試験整合）。
- **NQ2=A**: 性能は厳密予算なし・gzip 増分を監視（体感劣化なしが基準）。
- **NQ3=A**: Security は U2-2 が持ち込む供給面のみ enforce（submodule pin 整合＋Core 依存 SCA[ゼロ依存確認]＋秘密非保持）。製品既存依存の棚卸しは対象外。

## カテゴリ評価
| カテゴリ | 評価 | 論点 |
|---|---|---|
| **Reliability / 非回帰** | ◎ 中核 | `vite build` 非回帰＋既存機能保持。検証の深さを確認（NQ1）。 |
| **Performance** | ○ | ビルド時生成（毎ビルド `gen:palette`）＋ Core CSS import のバンドル影響。予算の要否（NQ2）。 |
| **Security（Baseline）** | ○ | submodule サプライチェーン（pin 整合）・Core 依存 SCA（U2-1 はゼロ依存）。範囲確認（NQ3）。 |
| **Maintainability** | ○（確定寄り） | ブリッジ 1 枚・`CORE-DS-VERSION`・生成物 gitignore。FD で確定済。 |
| **Accessibility** | ○（継承） | AA は U2-1 生成器が保証。製品は AA 済みトークンを消費。新規 a11y 要件なし。 |
| **Scalability / Availability** | N/A | ビルド時・静的配布（ランタイム無し）。 |

## 生成する成果物（Part 2）
- [ ] `construction/u2-2-distribution-bridge/nfr-requirements/nfr-requirements.md`
- [ ] `construction/u2-2-distribution-bridge/nfr-requirements/tech-stack-decisions.md`（Vite/Tailwind v4 共存・submodule・生成フック）

---

## 質問（Part 1）

## Question NQ1 — 非回帰の検証深度（S2=C セルフ検証前提）
「既存機能が壊れない」をどう担保しますか？

A) **`vite build` 成功 ＋ 主要画面の自己ビジュアルチェックリスト（frontend-components の項目）(推奨)** — 既存に自動テスト基盤が薄い前提。セルフ試験（Q8/Q9=セルフ）と整合。

B) **A ＋ 既存ユニット/コンポーネントテストがあれば実行して green を要件化** — テスト資産がある場合のみ上積み。

C) **A ＋ VRT（視覚回帰）を U2-2 で導入** — 厳密だが基盤構築コスト大（Core VRT は U5 で別途）。

[Answer]: A

## Question NQ2 — 性能/バンドル予算
ブリッジ＋Core CSS 取り込みのバンドル影響に予算を設けますか？

A) **厳密予算なし・増分を監視（CSS/JS の gzip 増を記録するに留める）(推奨)** — dogfooding 段階。実用上の体感劣化がなければ可。

B) **明示予算（例 追加 CSS ≤ N KB gzip・初回描画劣化なし）を要件化** — 後で締める。

[Answer]:

## Question NQ3 — Security Baseline の適用範囲（submodule / 依存）
本 Unit で enforce する Security 項目は？

A) **submodule pin 整合（CORE-DS-VERSION＝実 ref）＋ Core 依存の SCA（U2-1 ゼロ依存を確認）＋ 秘密非保持。製品既存依存(Radix/Tailwind 等)の棚卸しは対象外 (推奨)** — U2-2 が新規に持ち込む供給面だけを enforce。

B) **A ＋ 製品の全依存 SCA（既存 package の HIGH/CRITICAL 棚卸し）も U2-2 要件化** — 範囲拡大。既存負債を今サイクルで負う。

[Answer]: A
