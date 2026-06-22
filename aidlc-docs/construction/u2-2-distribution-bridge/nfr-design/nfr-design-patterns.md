# NFR Design Patterns — U2-2 配布・ブリッジ

> NRD-*（NFR-Req）を実現する設計パターン。確定回答（FDQ/NQ）に基づく。従来型インフラは N/A。

## P1 — Pinned Submodule Distribution（固定版配布）
- **解決**: NRD-REL-4 / SEC-1 / TSD-2。
- **方式**: Core を `vendor/core` に submodule、**SemVer タグ `v1.2.0` に pin**（rolling 禁止）。`CORE-DS-VERSION`＝submodule 実 ref を**単一の真実**として CI 検査。
- **効果**: 再現性ある配布・供給チェーンの固定。Core の意図せぬ変化から製品を隔離。

## P2 — Build-time Deterministic Generation（ビルド時決定的生成）
- **解決**: NRD-REL-4 / PERF-3 / TSD-3。
- **方式**: prebuild フックで `gen:palette --seed=#2C6B5E`。出力は **gitignore**（毎ビルド再生成）。同 seed＋同 pin→バイト一致（U2-1 が保証）。
- **効果**: 生成物をリポジトリに溜めず、Core 法則更新へ自動追従。決定性は seed＋pin＋生成器で担保。

## P3 — Declarative Token Bridge（宣言的トークンブリッジ・後勝ち）
- **解決**: NRD-REL-2/3 / MNT-1 / TSD-4（AD1=A・FDQ2=B）。
- **方式**: 専用 CSS **1 枚** `figuds-bridge.css` が Core semantic → shadcn `@theme` 変数を**静的対応**（ランタイム JS 無し）。Core 読込後・既存 theme.css の後に読み込み、CSS 後勝ちで上書き。
- **範囲**: 中核（signature→`--primary` / status→`--destructive`）＋面/線（background/foreground/card/popover/border/input/ring）。secondary/accent/muted/sidebar/chart は据え置き。
- **効果**: 既存コンポーネント/JSX を書き換えず色を Core 由来へ（非回帰）。

## P4 — Non-destructive Legacy Delegation（旧DS 委譲・段階無効化）
- **解決**: NRD-REL-3 / TSD-5（FDQ3=A）。
- **方式**: 旧内蔵 DS `tokens/{primitives,semantic}.css` は即削除せず、ブリッジ経由で Core へ委譲し**段階的に無効化**。生 HEX 解消・撤去は U2-3。
- **効果**: 回帰リスクを抑えつつ正典を Core へ移す。

## P5 — Self-verified Non-regression（セルフ非回帰検証）
- **解決**: NRD-REL-1/2 / PERF-1/2 / TSD-7（NQ1=A / NQ2=A）。
- **方式**: `vite build` 成功 ＋ 主要画面の**自己ビジュアルチェックリスト**。CSS/JS の gzip 増分を記録（厳密予算なし）。既存自動テストがあれば併用。VRT は U2-2 で導入しない。
- **効果**: 軽量にデグレを検出。セルフ試験運用（Q8/Q9）と整合。

## P6 — Supply-surface Security（持込供給面のみ enforce）
- **解決**: NRD-SEC-1/2/3（NQ3=A）。
- **方式**: submodule pin 整合の CI 検査・Core 依存ゼロ確認・秘密非保持。製品既存依存の SCA は対象外。
- **効果**: U2-2 が新規に増やす攻撃面だけを締め、既存負債を今サイクルで負わない。

## P7 — Inherited Accessibility（a11y 継承）
- **解決**: NRD-A11Y-1（P7・U2-1 連携）。
- **方式**: 製品は AA 済みトークンを消費するのみ。状態色 semantic 化に伴う本格適用は U2-3。

## パターン × NFR マトリクス
| NFR | 充足パターン |
|---|---|
| 非回帰（REL-1/2/3） | P3・P4・P5 |
| 配布再現性（REL-4） | P1・P2 |
| 性能（PERF） | P2・P5 |
| Security（SEC） | P1・P6 |
| a11y（A11Y） | P7 |
| 保守性（MNT） | P3・P2 |

## 従来型基盤（N/A）
- Queue / Cache / Circuit Breaker / Load Balancer / DB / オートスケール / ランタイム監視：**いずれも N/A**（ビルド時生成・静的 CSS 配布・ランタイム/サーバ無し）。
