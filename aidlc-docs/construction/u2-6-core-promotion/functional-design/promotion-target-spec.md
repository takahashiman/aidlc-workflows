# Promotion Target Spec (FD) — `arrival-card`

> 代表昇格対象 `arrival-card` の Core spec 契約（FD レベル）と、Issue/PR ドラフト構成。
> 本書は設計（WHAT）であり、Code Gen で Core repo に **`components/arrival-card.spec.md`** ＋
> **`preview/components-arrival-card.html`** として実体化する。FDQ6-2=A（spec＋preview）/ FDQ6-3=A（导线はドラフト）。

## A. `components/arrival-card.spec.md`（契約・FD ドラフト）

### 目的
バス便の**到着予定**を1枚のカードで提示する。利用者が「次の便があと何分で来るか・遅れていないか」を
最短で判断できるドメインコンポーネント。`card`（コンテナ）＋ `status-pill`（運行状態）の合成。

### バリエーション
| 種別 | 用途 | 構成 |
|---|---|---|
| Default | 通常の到着予定 | card(interactive) ＋ 到着まで ＋ status-pill(normal) |
| Delayed | 遅延あり | status-pill(delay)＋「約 N 分遅延」 |
| Approaching | まもなく到着 | remainingMinutes 小＝「まもなく」強調（文言） |
| Passed | 通過済 | 淡色・非操作（status-pill passed） |

### Props（契約・FD）
```ts
type ArrivalCardProps = {
  routeName: string;
  routeNumber: string;
  destination: string;            // 「◯◯ 行」
  remainingMinutes?: number;      // 主表示「あと N 分」。未指定時は scheduledTime にフォールバック
  stopsAway?: number;             // 「N 停留所先」
  status: 'normal' | 'delay' | 'possible' | 'passed';  // status-pill へ委譲
  delayMinutes?: number;          // status='delay' のとき必須
  scheduleTypes?: ('weekday' | 'saturday' | 'holiday')[];  // ダイヤ種別バッジ（任意）
  scheduledTime?: string;         // 予定時刻（補助・任意）
  onClick?: (e) => void;          // interactive 時
};
```
> 製品 `BusArrival.status`（ontime/delay/approaching/possible_delay/passed）→ 本 Props status の写像は
> business-logic-model §2 に従う（ontime→normal, approaching→normal＋強調, possible_delay→possible）。

### トークン参照（生 HEX ゼロ・既存トークンのみ）
| 役割 | トークン |
|---|---|
| コンテナ背景/角丸/影/padding | `card`（variant=interactive）の契約に委譲（`var(--color-surface-default)` / `var(--radius-card)` / `var(--surface-elevation-card)`） |
| 運行状態の配色 | `status-pill` に委譲（`var(--color-status-*)`）。arrival-card は配色トークンを直接持たない |
| 「あと N 分」主テキスト | `var(--color-text-primary)`＋大きめタイポトークン |
| 行先・系統名 | `var(--color-text-primary)` / 補助は `var(--color-text-tertiary)` |
| 系統番号バッジ | `badge`（中立）トークン |
| ダイヤ種別バッジ | 中立 `badge`（`var(--color-surface-...)` / `var(--color-text-...)`） |
| gap / 余白 | `var(--space-*)` |

### ルール
- 1 件 = 1 カード。複数到着はカードの反復で表す（BR-ARR-1）。
- 「到着まで」を最優先表示（BR-ARR-2）。
- 運行状態は **status-pill を合成**し配色を委譲（BR-ARR-3 / BR-PROMO-2）。
- 生 HEX・非 Core ユーティリティの持ち込み禁止（BR-PROMO-2）。
- 補助情報（stopsAway/scheduleTypes/予定時刻）は任意・欠落時は非表示（BR-ARR-6）。
- `passed` は淡色・非操作。`suspended` はカードを生成しない（便単位表示の責務）。

### アクセシビリティ
- 色だけで意味を伝えない（status-pill のアイコン＋ラベル併記を継承）。
- 「まもなく」「通過済」等の強調は文言でも示す。
- 動的更新面では `aria-live="polite"` 相当の告知を許容（consumer 側）。
- 配色は status-pill / card が AA 検証済みトークンを使うため arrival-card 単体で新規配色を導入しない。

### 実装現況（FD 注記）
Core 未収録（spec・preview とも無し＝閲覧余白）。製品 `RouteCard.tsx`/`BusLineCard.tsx`/`arrivalData.ts` に
到着表示の素材があるが製品側は一部 raw 値（`bg-blue-100` 等）が残存。**Core spec は理想形（プリミティブ合成・
生 HEX ゼロ）を正典として定義する**（製品 raw はそのまま持ち込まない）。

## B. `preview/components-arrival-card.html`（静的状態ギャラリー・FD ドラフト）
- 既存 preview（例: `components-status-pills.html` / `components-bus-card.html`）と同一の枠組み
  （`../primitives.css`＋`../semantic.css` 参照・lucide アイコン・eyebrow/h1/lede/section 構成）。
- 状態サンプル: Default(あと 5 分) / Delayed(約 15 分遅延) / Approaching(まもなく) / Passed(通過済) を並べる。
- status-pill・card のトークンを参照して描画（生 HEX ゼロ）。
- Code Gen で Core ギャラリー索引（`_core-gallery` / portal 取込対象）へ登録する。

## C. Issue ドラフト（`core-promotion` ラベル・FDQ6-3=A）
```
Title: [core-promotion] arrival-card（到着予定カード）の Core 昇格提案
Labels: core-promotion, temp-part
Body:
## 背景
製品（LLocana/BusDelayAlerts）で繰り返し使う「到着予定」表示を Core 正典へ昇格したい。
Core には到着系コンポーネントが未収録（閲覧余白）。

## 対象
- arrival-card = card（コンテナ）＋ status-pill（運行状態）＋ ドメインフィールド
  （到着まで/停留所先/行先/ダイヤ種別）の合成。

## 受け入れ観点
- [ ] 既存プリミティブ（card/status-pill/badge）の合成で再構成（他スタイル混入なし・生 HEX ゼロ）
- [ ] spec.md＋preview.html を Core 慣習通りに追加
- [ ] a11y AA（status-pill/card 委譲）・三層 lint error 0
- [ ] ギャラリー/索引へ登録（confirmPromotion 可能）
```

## D. PR ドラフト（preview/spec 実体・FDQ6-3=A）
```
Title: feat(components): add arrival-card spec & preview (#<issue>)
Body:
Closes #<issue>
## 追加
- components/arrival-card.spec.md（契約）
- preview/components-arrival-card.html（Default/Delayed/Approaching/Passed）
## 不変
- 既存 spec/preview は無改変（後方互換・加算のみ）
## 検証
- preview がブラウザで Core トークン参照描画（生 HEX ゼロ）
- a11y AA・三層 lint error 0（新規箇所）
SemVer: MINOR（コンポーネント追加）
```

> 実 push・実 Issue/PR 作成はユーザー承認後（BR-PROMO-4 / FDQ6-3=A）。
