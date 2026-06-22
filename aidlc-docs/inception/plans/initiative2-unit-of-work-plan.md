# Unit of Work Plan — イニシアチブ#2（Part 1: Planning）

> Application Design（8 component・5 service）と stories（Epic D/P/X）を Unit へ分解する計画。
> `[Answer]:` 記入後、`unit-of-work.md` 他を生成。推奨案に **(推奨)**。

## 分解の前提
- マルチレポ: **Core（FIG-UDS）/ BusDelayAlerts(LLocana) / aidlc-workflows(ポータル)**。
- per-unit に Functional/NFR/Infra/Code Gen を回す（execution-plan）。
- Critical Path（設計）: パレット基盤 → 配布・ブリッジ → スタイル適用 → 昇格。ポータル系は並行可。

## 回答確定（U1-U4）: 全て A
- U1=A（C-Palette 独立=U2-1）/ U2=A（配布U2-2 と 適用U2-3 を分割）/ U3=A（ポータル並行）/ U4=A（U2-1 着手）。
- Part2 生成済: `unit-of-work.md` / `unit-of-work-dependency.md` / `unit-of-work-story-map.md`（#2 接頭辞）。

## 暫定 Unit 案（質問 U1 で確定）
| 案 Unit | 内容 | 主 component | 主ストーリー | 主 repo |
|---|---|---|---|---|
| **U2-1 Core パレット基盤** | seed 駆動パレット生成（signature＋status・a11y）＝C-Palette を Core に新設 | C-Palette | US-D2/D3（基盤）・AD5 | FIG-UDS Core |
| **U2-2 配布・ブリッジ** | submodule×Vite 配布・@theme ブリッジ1枚・signature 注入適用・Consumer プロファイル | C-Distrib/C-Bridge/C-Signature | US-D1/D5/D6 | BusDelayAlerts |
| **U2-3 スタイル適用** | 状態色 semantic 化・生 HEX 解消・主要画面・before↔after | （C-Bridge 消費） | US-D3/D4/D7 | BusDelayAlerts |
| **U2-4 ポータル IA** | 役割別入口・2シナリオ・getting-started 責務分離・オンボ・閲覧余白 | C-PortalIA | US-P1〜P6 | ポータル/Core content |
| **U2-5 ポータル操作完結** | 主要4操作のポータル完結・GitHub 操作案内・セルフ検証 | C-PortalIA/C-Record | US-P7/US-X3 | ポータル |
| **U2-6 Core 昇格実行** | ドメインパターン抽出→LivePreview→Issue+PR→昇格確認 | C-Promo | US-X1 | Core⇄製品 |
| **U2-7 UX 改修フロー** | 画面遷移/UX を VSCode×Pencil で（既存非回帰） | C-UXFlow | US-X2 | 製品/Pencil |
| 横断 記録 | journal/session-log 継続・ポータル素材化 | C-Record | US-X4 | ポータル |

---

## 質問（Part 1）

## Question U1 — C-Palette（Core 新設）を独立 Unit にするか
seed 駆動パレット生成（C-Palette）は Core 側の新規実装で、配布・signature・状態色の**土台**かつ a11y 必須です。どう扱いますか？

A) **独立 Unit「U2-1 Core パレット基盤」にする (推奨)** — 全依存の根・Core 変更・a11y 検証を1 Unit に閉じ、先に固める。上表どおり（計7 Unit）。

B) **配布 Unit（U2-2）に内包する** — パレット生成と配布を同 Unit に。Unit 数は減るが Core 変更と製品変更が混在。

C) **昇格 Unit（U2-6）に寄せる** — Core 変更同士（パレット＋昇格）をまとめる。順序が後ろ倒しになる懸念。

X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question U2 — スタイル適用の分割（U2-2 配布 と U2-3 適用 を分けるか）
配布・ブリッジ（U2-2）と、状態色/生 HEX 解消（U2-3）を分けますか？

A) **分ける (推奨)** — 「土台が通る（build 非回帰）」を U2-2 で先に確定し、画面ごとの適用を U2-3 で進める。検証点が明確。

B) **1 Unit に統合** — 配布から適用まで一気通貫。Unit 数は減るが検証が大きくなる。

X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question U3 — ポータル系（U2-4 IA と U2-5 操作完結）の並行性
ポータル IA（U2-4）と操作完結/セルフ検証（U2-5）を、dogfooding 系と並行で進めますか？

A) **並行で進める (推奨)** — ポータル系は Core パレット/配布に依存しないため、dogfooding（U2-1〜3）と並行可。時間制約に有利。

B) **dogfooding 完了後に着手** — LLocana の実例が固まってからポータルに綴じる（順次・手戻り小だが遅い）。

X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question U4 — Construction の Unit 実行順
最初に着手する Unit はどれにしますか？

A) **U2-1 Core パレット基盤から (推奨)** — Critical Path の根。土台を先に。

B) **U2-2 配布・ブリッジから（パレットは仮値で並行）** — 配布の Vite 互換を最優先で潰す。

C) **ポータル U2-4 から** — 目標②を先に形にする。

X) Other (please describe after [Answer]: tag below)

[Answer]: A
