# Business Rules — U2-6 Core 昇格実行（ドメインパターン）

> 昇格パイプラインの正典ルール（BR-PROMO-*）と、代表対象 arrival-card の契約ルール（BR-ARR-*）。
> 確定回答 FDQ6-1〜4＝全 A に基づく。Core 既存 BR（design-system.md の Design System Rules）を継承。

## 昇格パイプライン（C-Promo・AD2=C）

### BR-PROMO-1 — 昇格は1代表パターンをフル実証（FDQ6-1=A）
- 本ユニットは `arrival-card` 1点を抽出→形式化→导线→確認まで完走する。複数同時昇格はしない。
- 残るドメイン候補（route/notification-sheet 等）は U2-4/U2-5 で可視化した「閲覧余白」として次段に残す。

### BR-PROMO-2 — 他スタイル混入禁止（画像03・最重要）
- 抽出物は **Core 三層トークンと既昇格プリミティブ（card / status-pill 等）のみ**で再構成する。
- 製品固有の生 HEX・非 Core ユーティリティ（`bg-blue-100`/`text-gray-700`/`bg-white` 直書き等）を spec/preview に持ち込まない。
- 運行状態の配色は arrival-card 自身が持たず **status-pill に委譲**（責務分離）。

### BR-PROMO-3 — 成果物は spec.md＋preview.html（FDQ6-2=A）
- 昇格対象は Core 慣習に従い `components/<name>.spec.md`（契約）と `preview/components-<name>.html`（静的状態ギャラリー）を成果物とする。
- spec 冒頭で `design-system.md` の Design System Rules 参照を必須注記する（既存 spec と同一様式）。

### BR-PROMO-4 — AD2=C の二段导线（Issue→PR）
- 提案は `core-promotion` ラベルの Issue（背景・対象・受け入れ観点）で起票する。
- 実体は preview/spec を載せた PR（該当 Issue を参照）で提示する。
- **FDQ6-3=A**: 本ユニットでは Issue/PR の**本文ドラフトを成果物化**するに留め、実 push・実起票・実 PR 作成は**ユーザー承認後**に行う（Q8=C セルフ運用・他 repo commit 承認制と整合）。

### BR-PROMO-5 — 昇格は加算であり既存破壊でない（後方互換）
- 既存 component spec／preview を改変しない。新規ファイル追加と、ギャラリー/索引への登録のみを行う。
- transport-domain-tokens は既に Core preview に存在＝**昇格済として対象外**（FDQ6-4=A）。

### BR-PROMO-6 — 昇格確認の合格条件（confirmPromotion）
- マージ後、Core の components 一覧・`_core-gallery` に新規が載ること。
- Core の a11y 検査（AA：fg/bg ペア）と三層 lint を新規 token 利用箇所で error 0 で通ること（既存負債は対象外）。
- preview がブラウザで Core トークンを参照して描画できること（生 HEX ゼロ）。

## arrival-card 契約（BR-ARR-*）

### BR-ARR-1 — 到着予定の単一カード契約
- 1 件の `BusArrival` を1枚のカードで表す。複数到着はリスト（arrival-card の反復）で表現し、カード内に複数便を詰めない。

### BR-ARR-2 — 「到着まで」を主表示にする
- `remainingMinutes`（あと N 分）を最優先で大きく表示する。不明時は予定時刻ベースにフォールバック。

### BR-ARR-3 — 運行状態は status-pill に委譲（BR-PROMO-2 の具体）
- `status` は status-pill を合成して表示し、arrival-card は配色トークンを直接持たない。
- `BusArrival.status` → status-pill status の写像は business-logic-model §2 の表に従う。

### BR-ARR-4 — 色だけで意味を伝えない（a11y 継承）
- 運行状態はアイコン＋ラベル併記（status-pill の規約を継承）。`approaching`/`passed` 等の強調も文言で示す。
- 動的更新面では `aria-live="polite"` 相当の更新告知を consumer 側に許容する（spec に明記）。

### BR-ARR-5 — コンテナは card プリミティブを使う
- 背景・角丸・影・padding は `card`（variant=interactive）のトークン契約に従う。独自の面スタイルを作らない。

### BR-ARR-6 — 補助情報は任意・縮退可能
- `stopsAway`/`scheduleTypes`/予定時刻は任意表示。欠落時はその行を出さない（レイアウトを崩さない）。
- `status=passed` は淡色・非操作。`status=suspended` は arrival-card を生成しない（運休は便単位表示の責務）。

## C-Record（横断・US-X4）

### BR-REC-1 — 昇格フローを dev-flow-journal に記録
- 抽出→形式化→AD2=C 导线→確認の実証を Step 7 として記録し、セルフ検証（Q9=C）チェックリストを残す。
