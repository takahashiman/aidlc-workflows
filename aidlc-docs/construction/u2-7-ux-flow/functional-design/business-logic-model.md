# U2-7 UX 改修フロー — Business Logic Model（C-UXFlow）

> Component **C-UXFlow**（BusDelayAlerts / Pencil）。原則 **AD4=A: Pencil＝設計参照／実装が正典／既存非回帰**。
> 主ストーリー **US-X2**（既存機能を壊さず画面遷移図の確認/差替を VSCode×Pencil で行い UX 改修フローを確立）。

## 1. C-UXFlow パイプライン（3 段階）

`captureScreenFlow(screens)` → `reviewFlow()` → `reflectToCode()`

```
[製品の主要画面コード]
        │ captureScreenFlow(screens)
        ▼
[Pencil .pen に画面遷移/UX を表現]  ← BusDelayAlerts/design/llocana-ux.pen（MCP 経由）
        │ reviewFlow()  （既存非回帰の線引き・改善候補の確認）
        ▼
[レビュー結果＝採用する最小UX改善1点 + 非回帰境界]
        │ reflectToCode()  （実装が正典）
        ▼
[BusDelayAlerts working tree に最小改善を反映]  ← commit/push は承認後
        │ （横断）harvestForPortal / 書き出し
        ▼
[portal の ux-refine ガイド＋Pencil 書き出し画像]
```

| 段階 | メソッド | 入力 | 出力 | 本ユニットでの具体 |
|---|---|---|---|---|
| 1 | `captureScreenFlow(screens)` | 代表フロー3画面 | `.pen`（製品 repo `design/`）＋書き出し | 遅延アラート核心フローを Pencil 表現。**現状（as-is）と改善案（to-be）**の2状態。 |
| 2 | `reviewFlow()` | `.pen` | レビュー結果 | 既存非回帰の線引き（機能・遷移は不変）／採用する**最小UX改善1点**を確定。 |
| 3 | `reflectToCode()` | レビュー結果 | コード変更 | 実装が正典。最小改善を製品 working tree に反映（非回帰テスト緑が条件）。 |
| 横断 | （C-Record / harvest） | レビュー結果・書き出し | portal 素材 | `.pen` 書き出し画像を portal へ・`ux-refine` ガイド化（US-X4 横断記録）。 |

## 2. 代表フロー＝遅延アラート核心（ドメインモデル）

LLocana（BusDelayAlerts）の中核ジョブ＝「狙った便の遅延を見逃さず通知を仕込む」。その最短ジャーニーを代表フローとする。

| # | 画面 | 役割 | 実体（現状） | 主要遷移 |
|---|---|---|---|---|
| S1 | **Home** | 登録路線カードの一覧・状態把握 | `pages/Home.tsx`（route/payment タブ・地域ヘッダ・路線カード） | カード tap → S2（RouteDetail） |
| S2 | **RouteDetail** | 到着予定・遅延・運行位置の詳細 | `pages/RouteDetail.tsx` → `components/RouteDetailScreen.tsx`（全画面オーバーレイ `fixed inset-0 z-[100]`・motion `opacity`+`scale` 0.3s） | 戻る `navigate(-1)` → S1 ／ 通知導線 → S3 |
| S3 | **SettingsNotifications** | 通知ルール（出発/到着/始発/終発/区間）設定 | `pages/SettingsNotifications.tsx`（`NotificationRule` 編集） | 保存 → S1 へ戻る |

### 2.1 ドメイン状態（遅延の写像 — U2-6 arrival-card と同源）

RouteDetail/カードは `arrivalData.ts`（行先/到着まで N分/N停留所先/ダイヤ種別/遅延分/5状態）を表示。状態色は **Core status-pill へ委譲**（U2-3 で生HEX0 化済）。本ユニットは**この状態表現を変更しない**（非回帰）。UX 改修は**遷移・操作感・導線**に限定する。

## 3. 改善対象の所在（reviewFlow の入力候補）

| 候補 | 現状 | 改善の方向 | 非回帰性 |
|---|---|---|---|
| **C1（主候補）** RouteDetail の戻り導線 | `navigate(-1)`（履歴依存） | 履歴が無い直リンク時は **Home へフォールバック**する堅牢な戻り | ◎ 通常フロー不変・エッジのみ改善 |
| C2 画面遷移の一貫性 | RouteDetail は motion 遷移あり／S1→S3 は即時 | S3 遷移にも同系モーションを適用し連続性を出す | ○ 視覚のみ・機能不変 |
| C3 通知導線の発見性 | RouteDetail から通知設定への動線が間接 | 詳細画面に「この便の通知を設定」明示導線 | △ 新導線＝要レビュー（過剰なら見送り） |

> reviewFlow で**最小UX改善1点**を選定（FDQ7-2=A）。主候補は C1（最小・低リスク・非回帰）。最終確定は NFR/レビューを経る。

## 4. メソッド契約（FD レベル）

- `captureScreenFlow(screens: Screen[]) -> PenArtifact`: 代表3画面の as-is/to-be を `.pen` 化。副作用＝製品 repo `design/` に `.pen`＋書き出し。**MCP（pencil）経由のみ**・`.pen` は暗号化（Read/Grep 不可）。
- `reviewFlow(pen: PenArtifact) -> ReviewResult`: 改善候補×非回帰境界を評価し、採用1点と「触らない範囲」を確定。
- `reflectToCode(review: ReviewResult) -> CodeChange`: 採用改善を製品コードへ反映。**実装が正典**＝Pencil と差異が出たらコードを真とする。非回帰テスト緑が反映の合格条件。

## 5. 完了条件（Unit 定義との対応）

- [ ] 代表フローの画面遷移/UX が Pencil（.pen）で表現・差替できる（US-X2 AC-1）。
- [ ] 既存機能が非回帰（US-X2 AC-2／AC①厳守）。
- [ ] UX 改修フロー（確認→差替→反映）が portal に導線として残る（US-X2 AC-3）。
- [ ] dev-flow-journal に Step（UX 改修フロー確立）を記録（US-X4 横断）。
