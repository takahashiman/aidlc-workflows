# Business Logic Model — U2-6 Core 昇格実行（ドメインパターン）

> C-Promo（製品 ⇄ FIG-UDS Core）の昇格パイプラインと、代表昇格対象 `arrival-card` のドメイン挙動。
> 確定回答 FDQ6-1〜4＝全 A。AD2=C（Issue〔core-promotion〕导线＋preview/spec PR）。

## 1. 昇格パイプライン（C-Promo の振る舞い）

画像03③④（運用→Core 昇格）の具体化。製品で蓄積したドメインパターンを Core 正典へ載せる5段階。

| # | メソッド（C-Promo） | 振る舞い | 入出力 |
|---|---|---|---|
| ① | `extractPattern(name)` | 製品の主要導線から、繰り返し現れるドメイン UI を1つ抽出。spec 化に足る契約（状態・フィールド・構造）を同定 | in: パターン名 / out: 抽出記述（データモデル＋構造＋状態） |
| ② | `toLivePreview(artifact)` | 抽出物を **Core のトークン/プリミティブで理想形に再構成**。`components/<name>.spec.md`＋`preview/components-<name>.html` 化（生 HEX ゼロ・既存プリミティブ合成） | in: 抽出物 / out: spec.md＋preview.html |
| ③ | `openPromotionIssue(label)` | `core-promotion` ラベルで昇格提案 Issue を起票（背景・対象・受け入れ観点）。**FDQ6-3=A によりドラフト本文を成果物化**（実起票は承認後） | in: ラベル / out: Issue 本文ドラフト |
| ④ | `openPromotionPR()` | preview/spec を実体として PR 化（Issue 参照）。**ドラフト本文を成果物化**（実 push/PR は承認後） | in: preview/spec / out: PR 本文ドラフト |
| ⑤ | `confirmPromotion()` | マージ後、Core ギャラリー（`_core-gallery`）と components 一覧に新規が載り、a11y/三層 lint を通ることを確認 | in: merge 後 / out: 昇格確認チェックリスト |

### パイプライン不変条件

- **他スタイル混入禁止**: 抽出は Core トークン（三層）と既昇格プリミティブのみで再構成する。製品固有の
  生 HEX・非 Core ユーティリティ（`bg-blue-100` 等）は spec に持ち込まない（BR-PROMO-2）。
- **昇格は spec/preview の追加であって既存破壊ではない**: 既存コンポーネント spec を改変しない（後方互換）。
- **AD2=C 二段导线**: 提案（Issue）と実体（PR）を分離。Issue で合意 → PR で形式化物をレビュー。

## 2. 代表対象 `arrival-card`（到着予定カード）のドメイン挙動

製品 `BusArrival`（`arrivalData.ts`）を正典データモデルとし、到着予定を1枚のカードで提示する。

### 表示する情報（ドメインフィールド）

| 役割 | ソース（BusArrival） | 表示 |
|---|---|---|
| 系統名・系統番号 | `routeName` / `routeNumber` | 主見出し（番号バッジ＋名称） |
| 行先 | `destination` | 「◯◯ 行」 |
| 到着まで | `remainingMinutes` | 「あと N 分」（最優先・大きく） |
| 停留所先 | `stopsAway` | 「N 停留所先」 |
| 運行状態 | `status` | **`status-pill` を合成**（Core 既昇格プリミティブ） |
| 遅延 | `delayMinutes` | status=delay 時「約 N 分遅延」（status-pill 内） |
| ダイヤ種別 | `scheduleTypes` | 平日/土曜/祝日（補助バッジ・任意） |
| 発着時刻 | `scheduledTime`/`estimatedTime`/`arrivalTime` | 予定時刻（補助・任意） |

### 状態（status の写像）

製品 `BusArrival.status`（`ontime`/`delay`/`approaching`/`possible_delay`/`passed`）を Core `status-pill` の
状態（`normal`/`delay`/`possible`/`suspended`/`passed`）へ写像する。**arrival-card 自身は配色を持たず、運行状態の
配色契約は status-pill に委譲**（責務分離・混入回避）。

| BusArrival.status | status-pill status | 備考 |
|---|---|---|
| `ontime` | `normal` | 通常運行 |
| `delay` | `delay` | `delayMinutes` を表示 |
| `possible_delay` | `possible` | 遅延の可能性 |
| `approaching` | `normal`（＋「まもなく到着」強調） | remainingMinutes 小＝接近表示は arrival-card 側の強調 |
| `passed` | `passed` | 通過済（淡色・操作不可） |

> `suspended`（運休）は arrival-card では原則「到着なし」＝カード非表示 or 運休表示。status-pill の
> suspended は便単位の運行状態表示（BusLineCard 系）で使う。

### 構造（合成）

```
arrival-card  =  card（コンテナ／variant=interactive）
                 ├─ ヘッダ: 系統番号バッジ + 系統名 + 行先
                 ├─ 主表示: 「あと N 分」 + status-pill（運行状態）
                 ├─ 補助: N 停留所先 / ダイヤ種別バッジ / 予定時刻
                 └─ （任意）通知トグル等の操作は consumer 側責務（spec 外）
```

## 3. 入力・出力・例外

- **入力**: 製品 `BusArrival`（1 件）。`remainingMinutes`/`status`/`destination` は必須。補助フィールドは任意。
- **出力**: Core spec（契約）＋ preview（静的サンプル状態のギャラリー）＋ Issue/PR ドラフト。
- **例外/縮退**: `remainingMinutes` 不明 → 「予定時刻ベース」にフォールバック。`status=passed` → 淡色・非操作。
  `status=suspended` → 到着カードは出さない（運休は別表示）。

## 4. C-Record（横断記録）

- dev-flow-journal に Step 7（運用→Core 昇格フローの実証＝抽出→形式化→AD2=C 导线→確認）を追記する。
- 昇格確認チェックリスト（②③④）を残し、セルフ検証（Q9=C）の証跡とする。
