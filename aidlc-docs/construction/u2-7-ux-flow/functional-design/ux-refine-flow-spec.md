# U2-7 UX 改修フロー — 代表フロー仕様 & Pencil/ポータル計画（FD）

> 代表1フロー（遅延アラート核心）の遷移仕様 FD ＋ 最小UX改善1点の候補/選定基準 ＋ Pencil 成果物計画 ＋ portal `ux-refine` ガイド構成案。
> 原則: Pencil＝設計参照／実装が正典／非回帰（BR-UX-1〜2）。

## 1. 代表フロー遷移仕様（as-is）

```
┌─────────────┐  カード tap   ┌──────────────────┐  通知導線    ┌────────────────────────┐
│   S1 Home    │ ───────────▶ │  S2 RouteDetail   │ ─────────▶ │ S3 SettingsNotifications │
│ 路線カード一覧 │ ◀─────────── │ 到着/遅延/運行位置  │ ◀───────── │   通知ルール編集          │
└─────────────┘  戻る(-1)     └──────────────────┘   保存→戻る  └────────────────────────┘
   route/payment              全画面オーバーレイ              NotificationRule
   タブ・地域ヘッダ            motion opacity+scale 0.3s        (departure/arrival/…)
```

| 遷移 | トリガ | 現状実装 | 観察された UX 余地 |
|---|---|---|---|
| S1→S2 | 路線カード tap | `navigate('/routes/detail/:busId')` | 良好（motion 遷移あり） |
| S2→S1 | 戻るボタン | **`navigate(-1)`** | 直リンク時に履歴が無くアプリ外へ抜けうる |
| S2→S3 | 通知導線 | 間接（Home 経由想定） | 詳細から通知設定への動線が弱い |
| S3→S1 | 保存 | Home へ復帰 | 良好 |

## 2. 最小UX改善1点（FDQ7-2=A）— 候補と選定

| 候補 | 内容 | 非回帰性 | リスク | 推し |
|---|---|---|---|---|
| **C1（主候補）** | RouteDetail 戻りの堅牢化＝履歴有=`navigate(-1)`／履歴無=`/`(Home) フォールバック（BR-FLOW-1） | ◎ 通常不変・エッジのみ | 低 | ★ |
| C2 | S1→S3 遷移に既存系モーション適用（BR-FLOW-2） | ○ 視覚のみ | 低〜中 | △ |
| C3 | 詳細→「この便の通知を設定」明示導線（BR-FLOW-4） | △ 新導線 | 中 | 見送り候補 |

### 選定基準（reviewFlow）
1. **非回帰最優先**（BR-UX-2）: 通常フローの振る舞いを変えないものを優先。
2. **最小・低リスク**（BR-UX-3）: 1 点に限定。実装影響が局所。
3. **dogfooding 価値**: 「あわよくば操作感改善」を体現し、Pencil の as-is/to-be で差分が説明できる。

→ **暫定第一候補＝C1**（戻り導線の堅牢化）。最終確定は NFR Requirements（非回帰の検証方式）/レビューを経る。

## 3. Pencil 成果物計画（captureScreenFlow）

- **配置**（BR-UX-6 / FDQ7-3=B）:
  - `.pen`: `BusDelayAlerts/design/llocana-ux.pen`（製品 repo・実装隣接）。
  - 書き出し画像: `aidlc-workflows/portal/`（公開素材・`ux-refine` ガイド用）。
- **.pen 構成（案）**:
  - フレーム群: `S1-Home` / `S2-RouteDetail` / `S3-Notifications`。
  - 遷移注記: カード tap / 戻る / 通知導線 / 保存。
  - **2 状態**: `as-is`（現状）と `to-be`（C1 改善案＝戻り導線の堅牢化）を並置（BR-REV-2）。
  - 状態色は Core トークン参照の見た目に合わせる（BR-UX-8・生 HEX を持ち込まない）。
- **手段**: pencil MCP（`get_editor_state`→schema 取得→`batch_design` 等）。`.pen` は MCP 経由のみ（BR-UX-5）。**実 .pen 生成は Code Generation 段で実施**。

## 4. portal `ux-refine` ガイド構成案（FDQ7-4=A / US-X2 AC-3）

usage に新規ガイド 1 本（`ux-refine`）。シナリオA「あわよくば」入口から導線。

| 節 | 内容 |
|---|---|
| ねらい | スタイル整理に加え操作感まで改善する「あわよくば」フロー（画像02-A） |
| 前提 | VSCode×Pencil（.pen は MCP 経由）・実装が正典・既存非回帰 |
| ① 確認 | 主要フローを `.pen` で表現（as-is）。Pencil 書き出し画像を掲示 |
| ② 差替 | 改善案（to-be）を `.pen` で差替・レビューで非回帰境界を線引き |
| ③ 反映 | 最小改善1点を実コードへ（実装が正典）・非回帰テスト緑を確認 |
| 記録 | dev-flow-journal に UX 改修フローを記録（US-X4） |
| 参照 | `.pen`（製品 repo `design/`）への参照・本フローの再利用手順 |

> ポータル実装は本 repo `portal/`（usage.js GUIDES へ `ux-refine` 追加・index 結線）。詳細は NFR/Infra/Code Gen で確定。

## 5. 検証観点（後続ステージへの申し送り）

- **非回帰の検証方式**（NFR Requirements）: 既存テスト（lint/build/VRT・該当ユニットテスト）で C1 反映の非回帰をどう保証するか。
- **Pencil 運用**（Infra）: `.pen` の版管理（暗号化・MCP 経由）・書き出しの portal 取込手順。
- **ポータル結線**（Code Gen）: `ux-refine` ガイドの GUIDES 追加・既存 nav/usage テストの非回帰。

## 6. UX 蓄積・還元ループ（2026-06-22 ユーザー方針追記）

> 方針: スタイル（トークン／生 HEX 解消）と同様に、**UX 知見も FIG-UDS Core で蓄積・還元**する。
> 必要に応じて開発フローに「UX ブラッシュアップ」を組み込み、**Core の UX 契約を基準に `.pen` で評価者へ修正項目を提案→承認**し、最終 UX を次回開発に活用＋ポータルで確認できるようにする。

### 6.1 UX 基準のソース（Core の形式知＝判断基準）

製品の UX 改修は Core にトークン化された UX 契約を**基準**とする（実在確認済み）:

| Core ソース | 内容 | 製品消費の例 |
|---|---|---|
| `patterns/transition-budget.md` | 体感バジェット 200ms＋`--motion-experience-*` / `--motion-duration-budget-*` | 生 motion 値（0.3s）→ `--motion-duration-budget-nav`(200ms) |
| `patterns/page-transition.md` | forward/back/modal/tab の遷移規約 | 戻り遷移のバジェット・方向演出 |
| `patterns/feedback-contract.md` | 視覚/触覚/聴覚の三位一体・`prefers-reduced-motion` 縮退 | CTA/トグルのフィードバック束 |
| `accessibility-guidelines.md` / `component-contract.md` | a11y・コンポーネント手続きガード | 戻りボタンの操作・フォーカス |

### 6.2 循環（スタイル循環と同型）

```
消費(consume)  : 製品 UX 改修で Core UX 契約トークンを参照（生 motion 値 → --motion-duration-budget-*）
                 ＝「生 HEX」の UX 版負債を解消（C1 で RouteDetail 300ms→Core nav 200ms トークンへ）
提案→承認      : Core 契約に照らし .pen で as-is/to-be を作図→評価者へ修正項目提案→承認（AD4=A）
反映(reflect)  : 承認分を実コードへ（実装が正典）・判定は純粋関数化・二層テストで非回帰固定
還元(promote)  : 製品で得た UX 知見を Core の pattern/遷移規約へ昇格提案（U2-6 と同型・AD2=C Issue+PR）
活用・確認     : 最終 UX（画面遷移等）を次回開発で再利用＋ portal ux-refine ガイドで確認
```

### 6.3 本ユニットでの実証（C1 拡張）

- **生 motion 負債の発見と解消**: RouteDetail の遷移は `duration: 0.3`（300ms）の生値＝Core 体感バジェット（nav 200ms）超過。
  C1 にトークン消費を追加＝`src/app/lib/motion.ts`（`parseMsToSeconds`/`motionDurationSec`）で `--motion-duration-budget-nav` を参照（未ロード時 200ms 縮退）。
- **昇格候補（還元）**: C1「履歴なし（`location.key==='default'`）時は Home へフォールバック」は、Core `page-transition.md` の **back 規約への追補候補**（堅牢な戻り先規定）。実起票は承認後。
- **ポータル提示**: `ux-refine` ガイドを「Core UX 契約＝基準 → .pen 提案→承認 → 反映 → 還元 → 次回活用/確認」の6手順へ拡充。
