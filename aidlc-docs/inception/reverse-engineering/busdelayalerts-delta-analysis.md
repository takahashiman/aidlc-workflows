# 差分 Reverse Engineering — BusDelayAlerts / LLocana（次期イニシアチブ・目標①dogfooding 対象）

> 本書は**前サイクルの RE 成果物（同ディレクトリ 7点）を流用**し、次期イニシアチブで新たに
> 加わった**実開発リポジトリ `BusDelayAlerts`（製品名 **LLocana**）のみ**を差分解析した記録。
> next-initiative-brief.md §5-3「Reverse Engineering は前サイクル成果を流用し、差分のみ」に準拠。
>
> 解析日: 2026-06-18（**改訂版**）
> **基準ブランチ（before）**: `feature/home-redesign`（tip `705b0b3`）。
>   ※ 初版は `main`(`0c38ec9`) を解析したが、ユーザー指定の「修正前（before）」は **`feature/home-redesign`**。
>     こちらが**実体の濃い最新状態**（main は PR#1 で古い一部のみマージ済・80ファイル/+12,618行の差）。改訂で基準を是正。
> **作業ブランチ（after）**: `feature/figuds-adoption`（`feature/home-redesign` から分岐・push 済）。
> ローカル配置: `c:/work/AI-DLC/260618_DesignSystem/BusDelayAlerts`（aidlc-workflows の**外**＝マルチレポ）。
>
> **★最重要の前提（ユーザー確認 2026-06-18）**:
> BusDelayAlerts 内蔵の独自デザインシステム（後述）は **「古いもの（レガシー）」**。
> **今回の開発は、この古い DS を FIG-UDS Core のフローに則って修正していく**（＝dogfooding の実体）。
> よって本書の DS 記述は「**置き換え／整理の対象（before）**」として読む。

---

## 1. 概要（business overview）

- **プロダクト**: 「バス遅延情報サイト」/ 製品名 **LLocana**。一般利用者向けに**バス路線の遅延・運休・正常運行**を案内するモバイル中心の Web アプリ。
- **出自**: Figma Make の code bundle 由来（`package.json` name=`@figma/my-make-file`・README に Figma URL）。
- **想定デバイスプロファイル**: モバイル消費者向け（`pb-safe`・レスポンシブ・タッチ操作）。→ FIG-UDS の **Mobile-Consumer** に対応づくのが自然（端末用途が出れば Mobile-Terminal も。画像01 の「同一サービスで端末2種」論点）。
- **taxonomy / 表示**: ユーザー方針＝分類は Core Maintainer 委任（Q6=C）。ただしポータルの**プロジェクト集に「LLocana」名**で提示。既存 `bus`/`bus-notification` とは**別サービス**認識（`fig-ext-bus-busdelayalerts` とも別物・本開発中は並列存在）。

---

## 2. 技術スタック（technology stack）

| 層 | 採用技術 | dogfooding 上の含意 |
|---|---|---|
| ビルド | **Vite 6.3.5** | 前サイクルの配布検証は CRA/CRACO。**Vite での submodule＋Core CSS import 互換**を本サイクルで再検証し標準化（Q5=A）。 |
| UI | **React 18.3.1** + react-router 7 | ルーティング `src/app/routes.tsx`。 |
| スタイル | **Tailwind CSS v4.1.12**（`@theme inline`） | Core トークンを `@theme` へブリッジする方式（Q3＝シナリオ別: 既存=A トークンブリッジ）。 |
| コンポーネント | **shadcn/ui**（Radix・`src/app/components/ui/` 56点） | 既存機能を壊さず Core トークンへ寄せる（画像02 ♡）。 |

---

## 3. コード構造（feature/home-redesign）

```text
BusDelayAlerts/  (feature/home-redesign)
├── index.html / vite.config.ts / package.json
├── guidelines/                       # ★内蔵 DS の正典ドキュメント（古い DS）
│   ├── design-system.md (875行)       #   三層・直書き禁止・PR チェックリスト・AI 指示
│   ├── component-contract.md (6条)
│   ├── components/*.spec.md            #   button/card/input/modal/tab/toast/list-item/status-pill/icon-bubble/bottom-navigation
│   └── patterns/*.md                   #   arrival-card / delay-banner / notification-sheet / route-selector（★ドメインパターン）
├── design-system/                    # ★内蔵 DS の成果物（古い DS）
│   ├── preview/*.html (24)             #   colors-brand/status・semantic-tokens・state-tokens・transport-domain-tokens 等
│   ├── storybook/                      #   component/pattern/token の HTML デモ＋index
│   └── ui_kits/busapp/                 #   Busapp{App,Components,Screens}.jsx（前サイクル busapp との関連物）
└── src/
    ├── app/
    │   ├── pages/                       # Home / MapSearch / Profile / RouteDetail / SettingsNotifications /
    │   │                                #   Onboarding / RegionSettings / TicketPurchase / Root
    │   ├── components/                  # 独自: BusLineCard, RouteCard, StatusBadge, CommuterPassCard,
    │   │   │                            #   DeviceIllustrationWithRipple, PaymentView, Sidebar 等
    │   │   └── ui/                       # shadcn/ui 56
    │   ├── constants/statusConfigs.ts   # 状態設定
    │   ├── utils/                        # daysLabel.ts / notificationLogic.ts
    │   └── data/                         # arrivalData.ts / busData.ts（モック）
    └── styles/
        ├── index.css → fonts/tailwind/theme/tokens を集約
        ├── theme.css                    # 旧 shadcn 風トークン（oklch/hex 混在）
        └── tokens/
            ├── primitives.css (401行)    # ★Layer1: --brand-teal=#2C6B5E ほか生 HEX 群
            └── semantic.css   (765行)    # ★Layer2: color.{text,surface,icon,border}.* + state + transport-domain
```

---

## 4. ★内蔵デザインシステム（＝古い DS・置き換え／整理の対象）の診断

### 4-1. 驚くべきことに「FIG-UDS と同型の三層 DS」を既に内蔵
`guidelines/design-system.md`（875行）は、FIG-UDS と**思想がほぼ同型**:
- **三層アーキテクチャ**（Primitive → Semantic → Component・逆流禁止・Component は Semantic のみ参照）。
- **直書き禁止リスト**（生 HEX/px/cubic-bezier/数値 z-index を reject）。
- PR レビュー MUST チェックリスト・**AI/Claude へのシステムプロンプト指示**・例外申請プロセス。
- `component-contract.md` の6条（Semantic 経由のみ／Raw 値禁止 …）。

`semantic.css`(765行) は `--color-text-*` / `--color-surface-*` / `--color-icon-*` / `--color-border-*`
＋ **state（hover overlay 等）** ＋ **transport-domain（プロジェクト固有 semantics）** を完備。
`primitives.css`(401行) に `--brand-teal:#2C6B5E`・surface・slate スケール・border 等。

> **意味**: この DS は FIG-UDS の「三層・トークン経由・spec・preview」と**強く重なる**。
> ただしユーザー確認のとおり **古い（レガシー）**。FIG-UDS Core のフローに**則って置換／整理**するのが本開発。

### 4-2. 「定義済みだが未適用」の大きなギャップ（dogfooding の主戦場）
DS は**文書とトークンとしては立派に定義**されているが、**コンポーネント実装には適用しきれていない**:
- `src/app`（styles/tokens を除く）に **生 HEX 直書き 379 箇所**・インライン `[#...]` 含む tsx **15**。
- 一方、コンポーネントからの **`var(--token)` 参照は 14 箇所**のみ。
  → **「契約（design-system.md）は語るが、コードは守れていない」**状態。`#2C6B5E` 直書きが大量（旧 main では203、home-redesign でも多数）。
- **これが dogfooding の主戦場**: FIG-UDS Core のフロー（三層ガードレール Lint・semantic 経由）に則って、
  生 HEX をトークン参照へ移し、Core のトークン体系へ寄せる。

### 4-3. ドメインパターン＝Core 昇格候補（画像03 と直結）
`patterns/{arrival-card,delay-banner,notification-sheet,route-selector}` と `transport-domain-tokens` は、
**バス遅延ドメイン特有の資産**。画像03「蓄積→Core 昇格」フローの**昇格候補**になり得る
（使用コンポを抽出→FIG-UDS Live Preview 形式→リクエスト→マージ→昇格）。
※ ただし「古い DS」前提のため、昇格前に FIG-UDS フロー下での再整理が要る。

### 4-4. signature（ブランド色 `#2C6B5E`）
旧 DS でも `--brand-teal:#2C6B5E` → `--color-text-brand` / `--color-surface-brand` と semantic 化済み。
FIG-UDS フローでは **signature 再テーマ機構**へ載せ替え（Q4=B: template init 流用、ただし既存コードゆえ
変数置換は改修視野。アプリ固有カラーは**プロジェクト集にカラーパレット資産**として提示＝将来 **Taste 派生**）。

---

## 5. dogfooding 受け入れ条件のための基準値（baseline metrics・feature/home-redesign）

| 指標 | 現状（before・home-redesign） | 目標①での到達方向（FIG-UDS フロー適用後） |
|---|---|---|
| `src/app` の生 HEX 直書き | **379** | Core/semantic トークン経由へ移行し主要画面で 0（全体大幅減） |
| インライン `[#...]` 含む tsx | **15** | 0〜最小化 |
| コンポーネントの `var(--token)` 参照 | **14**（過少） | semantic 経由を標準化し大幅増 |
| ブランド `#2C6B5E` | 直書き多数 | signature トークン1本へ集約 |
| 内蔵 DS と FIG-UDS Core の関係 | 並存（古い自前 DS） | **FIG-UDS Core のフローに則り置換／整理** |
| Core DS submodule 取込 | 無し | あり（pin＋`CORE-DS-VERSION`・Vite で再検証＝Q5=A） |
| 適用プロファイル | 無し（自前 light のみ） | `.fig-profile-*`（Mobile-Consumer 想定） |
| 三層ガードレール Lint | アプリ独自ルールはあるが CI 未接続 | FIG-UDS guardrail CI に接続（新規・変更分から） |

> 厳密な定量しきい値は Requirements で確定。Q2=A 採用（FIG-UDS 発展途上ゆえ画面ゲート(B)は正典未確立）。

---

## 6. 既存 RE 成果物との関係（流用宣言）
前サイクル成果（`architecture.md` / `business-overview.md` / `component-inventory.md` / `dependencies.md` /
`technology-stack.md` / `code-quality-assessment.md`＝FIG-UDS Core・ポータル・template・移行系の正典）は**流用**。
本書は **BusDelayAlerts(LLocana) の差分のみ**を追加する。

## 7. 新規論点（Requirements / Construction へ引き継ぐ）
1. **配布の Vite 互換**: submodule＋Core CSS import を Vite + Tailwind v4 で再検証→標準化（Q5=A）。
2. **共存方式（Q3 確定）**: 既存アプリ＝**A（@theme トークンブリッジ）を基礎**、新規開発＝B（`.fig-*`）。シナリオ別運用を方針化。
3. **古い内蔵 DS の扱い**: FIG-UDS Core のフローに則り**置換／整理**。アプリ固有値は無理に Core 取込せず**プロジェクト集にカラーパレット資産**提示（将来 Taste 派生）。
4. **ドメインパターンの Core 昇格**: arrival-card/delay-banner 等を画像03 フローで昇格候補として扱うか（スコープは要件で確定）。
5. **signature 注入**: `#2C6B5E` を Core signature 機構へ（template init 流用＋既存改修視野）。
6. **dogfooding 定量ゴール（Q2=A）**: §5 baseline に対する到達（signature 集約・semantic 経由化・主要画面 hex 0）。
