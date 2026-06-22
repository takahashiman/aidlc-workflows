# 要件 追加確認（clarification）— イニシアチブ#2

> Q3（相談希望）・Q10（PBT 判断不可）・補足（ブランチ）について、判断材料と推奨を添えて確認します。
> 各 `[Answer]:` に英字を記入し、終わったら「done」等とお知らせください。
> 推奨案には **(推奨)** を付けています（最終判断はご自由に）。

---

## Clarification 1 — Tailwind v4 と FIG-UDS 三層の共存方式（元 Q3）

### 判断材料（相談メモ）
BusDelayAlerts は **Tailwind v4 の `@theme` + shadcn/ui** が土台で、`theme.css` に独自の semantic 風変数
（`--primary` 等）を持ち、加えてブランド teal `#2C6B5E` が **203 箇所直書き**されています。
ここに Core DS（三層トークン＋`.fig-*` クラス）をどう載せるか、選択肢は「**トークンを寄せる**」か
「**クラス/コンポーネントごと寄せる**」かの度合いの違いです。

| 観点 | A: @theme トークンブリッジ | B: `.fig-*` クラス置換 | C: ハイブリッド |
|---|---|---|---|
| 既存機能を壊すリスク | **低**（構造維持・色だけ Core へ） | 高（shadcn を Core クラスへ書換） | 中 |
| dogfooding する対象 | Core の**トークン**（三層） | Core の**クラス/コンポーネント** | 両方（段階） |
| Vite 検証の確実性 | 高（CSS import で完結） | 中 | 中 |
| 「既存は壊さず整える」(画像02 ♡) との相性 | ◎ | △ | ○ |
| 作業量 | 小〜中 | 大 | 中〜大 |

**相談の結論（私の推奨と理由）**:
- **既存があるアプリ（BusDelayAlerts＝シナリオA）では A（@theme トークンブリッジ）を基礎**にするのが、
  「既存機能を壊さず・最低でも自社デザイン資産化」という方針（画像02）に最も合致します。
  signature と状態色の**トークン集約**（Q2=A のゴール）も A で達成できます。
- **新規開発（シナリオ②）では B（`.fig-*`/コンポーネント）**で実装、という**シナリオ別の使い分け**を
  「今後の方針」として確立するのが綺麗です（dev-flow-journal にも反映済の考え方）。
- 余力があれば、BusDelayAlerts でも signature 系の主要部品を1〜2個だけ `.fig-*` 化して
  「クラス採用」も実演（＝実質 C）すると、ポータルの説明素材として手厚くなります。

### Clarification Question 1
BusDelayAlerts（既存あり）での共存方式をどうしますか？

A) **A: @theme トークンブリッジを基礎にする (推奨)** — 既存構造を保ち Core トークンへ寄せる。新規開発は別途 B 方式、というシナリオ別運用を方針化。

B) **C: ハイブリッド** — A を基礎にしつつ、主要部品 1〜2 個を `.fig-*` 化してクラス採用も実演。

C) **B: `.fig-*` クラスへ全面的に寄せる** — リスクは上がるが Core クラスの dogfooding を最大化。

X) Other (please describe after [Answer]: tag below)

[Answer]: シナリオ別の使い分けを方針化します。今回の開発ではA、将来的な新規開発ではBを採用。その旨を今後の開発でも確認できるようdev-flow-journal.mdなどに残す。

---

## Clarification 2 — Property-Based Testing（PBT）の有無（元 Q10）

### PBT とは（違いの説明）
- **通常のテスト**: 「入力 X のとき結果 Y」と**具体例**を1つずつ書く。
- **PBT（プロパティベーステスト）**: 「どんな入力でも成り立つ**性質**」（例: 並べ替えても要素数は不変／
  JSON にして戻すと元に一致＝直列化ラウンドトリップ）を宣言し、**ツールが多数のランダム入力で自動検証**する。
- **効く場面**: 計算ロジック・データ変換・直列化・状態遷移が**多い**プロジェクト。
- **効きにくい場面**: **UI 表示中心**でロジックが薄いプロジェクト（見た目の正しさは VRT 等の方が適切）。

### この案件での評価
BusDelayAlerts は**バス遅延情報の表示が中心**で、データはモック（`busData.ts`/`arrivalData.ts`）、
本格的なビジネスロジック・直列化はほぼありません。今回の主眼も**スタイル整理（見た目）**です。
前サイクルも同理由で PBT=No を選択しています。

**私の推奨: C（No）**。UI 中心ゆえ PBT の費用対効果が低く、品質はガードレール Lint＋（将来）VRT で担保。

### Clarification Question 2
PBT ルールを強制しますか？

A) **C: No — PBT をスキップ (推奨)** — UI 中心・ロジック薄のため。品質は Lint/VRT で担保。

B) **B: Partial — 純粋関数・直列化ラウンドトリップのみ** — もし遅延計算等の純粋関数を入れる場合に限り軽く担保。

C) **A: Yes — 全面強制** — 後でロジックが増える前提で最初から厳格に。

X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Clarification 3 — BusDelayAlerts の修正前後比較用ブランチ（補足対応）

### 方針案
現状 `main = 0c38ec9`（PR#1 home-redesign マージ済）。修正前後を比較できるよう、
**`main` を「修正前（before）」の基準として温存**し、**本開発の作業を新規ブランチで行う**のが明快です
（最後に `新ブランチ vs main` の diff／PR で before↔after を一覧できる）。
※ ブランチ作成・push は**ユーザーご自身の repo への外向き操作**のため、命名確定後に実行し、push 可否も確認します。

### Clarification Question 3
作業ブランチの命名・運用をどうしますか？（製品名は LLocana）

A) **`feature/figuds-adoption` を作成（main=before を温存）(推奨)** — 役割が明快。main との diff で before/after 比較。

B) **`llocana/figuds-style` を作成** — 製品名（LLocana）を冠した命名。

C) **`develop` を作成して以後の作業はそこへ** — 一般的な develop 運用。

X) Other（ブランチ名やタグ運用の希望を記述）

[Answer]: 「修正前（before）」はfeature/home-redesignです。ブランチ名はお任せします。

### Clarification Question 3-2
作成したブランチを GitHub（origin）へ push しますか？

A) **はい、push する (推奨)** — リモートでも before/after を比較・共有できる。

B) **いいえ、当面ローカルのみ** — push は後で判断。

X) Other (please describe after [Answer]: tag below)

[Answer]: A
