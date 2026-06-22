# U2-7 UX 改修フロー — Functional Design 実行プラン（回答記録）

> Unit: **U2-7 — UX 改修フロー（VSCode×Pencil）** / 主 component **C-UXFlow** / 主ストーリー **US-X2（S3=C）** / repo **BusDelayAlerts ⇄ Pencil**
> per-unit ループ: Functional Design（本書）→ NFR Requirements → NFR Design → Infrastructure Design → Code Generation。
> 原則（AD4=A）: **Pencil（.pen）＝設計参照／実装が正典／既存非回帰が大前提**（AC①「既存機能を壊さない」厳守）。

## 質問ゲート回答（2026-06-22 確定）

| ID | 論点 | 確定 | 内容 |
|---|---|---|---|
| **FDQ7-1** | 改修スコープ（代表） | **A** | **代表1フロー＝遅延アラート核心**: Home（路線一覧）→ RouteDetail（到着/遅延）→ SettingsNotifications（通知設定）。U2-6「代表1パターンをフル実証」と整合。 |
| **FDQ7-2** | reflectToCode の範囲 | **A** | **最小UX改善1点を実コードに反映**（Pencil 設計参照→レビュー→非回帰確認のうえ BusDelayAlerts working tree に反映）。commit/push は承認後。dogfooding「あわよくば操作感改善」を実証。 |
| **FDQ7-3** | 成果物（.pen）配置 | **B** | **.pen は製品 repo**（`BusDelayAlerts/design/`）／**ポータル導線用の書き出し画像は aidlc-workflows `portal/`**。設計と公開素材を分離。Pencil は MCP 経由のみ。 |
| **FDQ7-4** | ポータル導線の形式 | **A** | **portal に UX 改修ガイドを新規 1 本**（usage `ux-refine`＝確認→差替→反映＋VSCode×Pencil 手順＋Pencil 書き出し参照）。シナリオA「あわよくば」入口から導線。 |

## 代表フロー現状調査（接地）

- **Home**（`src/app/pages/Home.tsx`・328行）: route/payment タブ・地域選択ヘッダ・路線カード一覧。カード → RouteDetail へ遷移。
- **RouteDetail**（`src/app/pages/RouteDetail.tsx`・27行 + `components/RouteDetailScreen.tsx`・761行相当）: **全画面オーバーレイ**（`fixed inset-0 z-[100]`）・motion 遷移（`opacity` + `scale` 0.3s ease）・戻るは **`navigate(-1)`**。
- **SettingsNotifications**（`src/app/pages/SettingsNotifications.tsx`・761行）: 通知ルール（departure/arrival/first_bus/last_bus/between）編集。
- **★最小UX改善の主候補（FDQ7-2=A）**: RouteDetail の戻り導線 `navigate(-1)` は**直リンク/直接アクセス時にアプリ外へ抜ける**エッジを持つ。履歴が無い場合は Home へフォールバックする**堅牢な戻り**＝通常フロー不変（非回帰）／エッジのみ改善＝低リスク。レビューで最終確定。

## 生成成果物（functional-design/）

1. **business-logic-model.md** — C-UXFlow 3段階パイプライン（captureScreenFlow → reviewFlow → reflectToCode）＋遅延アラート核心フローのドメインモデル（画面・遷移・状態）。
2. **business-rules.md** — BR-UX-1〜（Pencil=設計参照/実装正典/非回帰/最小改善1点/ポータル導線）＋BR-FLOW-1〜（核心フローの遷移規則）。
3. **ux-refine-flow-spec.md** — 代表フローの遷移仕様 FD ＋ 最小UX改善1点の候補と選定基準 ＋ Pencil 成果物計画（.pen 構成・書き出し）＋ ポータル `ux-refine` ガイド構成案。

## スコープ境界

- **対象**: 代表1フロー（Home→RouteDetail→SettingsNotifications）のみ。他画面（MapSearch/Profile/TicketPurchase/RegionSettings/Onboarding）は本ユニット対象外。
- **非対象**: 機能仕様の変更・新機能追加（UX/遷移/操作感の改善に限定）。スタイル整理は U2-2/U2-3 で完了済（本ユニットは触らない）。
- **承認後**: 実コード変更の commit/push・Pencil .pen の最終確定。

**次**: 本 FD 承認待ち（承認で NFR Requirements＝非回帰の検証方式へ）。
