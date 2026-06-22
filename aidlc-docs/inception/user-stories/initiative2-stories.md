# User Stories — イニシアチブ#2（実開発 dogfooding ＋ ポータル綿密化）

> 構成＝**ハイブリッド（S1=C）**: Epic D/P/X で構造化し、末尾に「旅（ジャーニー）の通し線」で並べ直す。
> 各ストーリーは INVEST 準拠・受け入れ条件（AC）付き。要件 `initiative2-requirements.md` の AC①/AC② に紐付け。
> 前サイクル `stories.md`（US-1〜5/US-X）とは重複させず、#2 差分のみ（必要箇所は参照）。
> ペルソナは `initiative2-personas.md`（DEV-A / UX-D / MAINT / VIEW-S / AI-AG）。

---

## Epic D — dogfooding（BusDelayAlerts / LLocana を FIG-UDS フローで整える）

### US-D1 配布機構の確立（submodule × Vite）
**As** DEV-A、**I want** Core DS を submodule で pin（＋`CORE-DS-VERSION`）して Vite アプリへ取り込み、Core CSS を import したい、**so that** 再現性ある配布を確立できる。
- **AC**（→AC①-4）:
  - [ ] `BusDelayAlerts` に Core が submodule として追加され、特定タグに pin されている。
  - [ ] `CORE-DS-VERSION` と submodule の版が一致する。
  - [ ] 製品から Core CSS（primitives/semantic/tokens）を import し、`vite build` が成功する。
  - [ ] 結果を `dev-flow-journal.md` に「Vite での配布標準」として記録（Q5=A）。

### US-D2 signature（ブランド色）集約
**As** DEV-A、**I want** ブランド teal `#2C6B5E` を signature トークン1本へ集約したい、**so that** 直書きの散在を解消しテーマ可能にする。
- **AC**（→AC①-1）:
  - [ ] `#2C6B5E` 直書きが signature トークン参照へ置換されている。
  - [ ] signature 再テーマ機構（Q4=B: template init 流用・既存改修視野）で色が一元管理される。
  - [ ] signature 以外のアプリ固有カラーは**プロジェクト集にカラーパレット資産**として提示（将来 Taste 派生）。

### US-D3 状態色の semantic トークン化
**As** DEV-A、**I want** 状態色（正常/遅延/運休）を semantic トークン経由にしたい、**so that** ドメインの状態表現が一貫する。
- **AC**（→AC①-2）:
  - [ ] 正常=success / 遅延=warning / 運休=danger 等の semantic トークンへ対応づけ。
  - [ ] `StatusBadge` 等の状態表示が Tailwind 直接色からトークン参照へ移行。

### US-D4 生 HEX 直書きの解消（未適用ギャップの解消）
**As** DEV-A、**I want** 主要画面の生 HEX 直書き（baseline 379）を 0 にし `var(--token)` 参照を標準化したい、**so that** 「契約は語るがコードが守れていない」状態を解消する。
- **AC**（→AC①-3）:
  - [ ] 主要画面（Home/RouteDetail/SettingsNotifications 等）で生 HEX 直書き 0。
  - [ ] 三層ガードレール（生 HEX/px 禁止・semantic 経由）に主要画面が準拠。
  - [ ] 全体の生 HEX 直書きが baseline 比で大幅減。

### US-D5 @theme トークンブリッジ（既存を壊さず整える）
**As** DEV-A、**I want** Core semantic トークンを Tailwind `@theme` へブリッジし、既存の shadcn/Radix 構造を保ったまま Core 色で描画したい、**so that** 既存機能を壊さずスタイルを Core へ寄せられる（Q3＝既存=A）。
- **AC**（→AC①, NFR2-3）:
  - [ ] 既存コンポーネントの大規模書換なしに、色・トークンが Core 由来になる。
  - [ ] 既存機能が非回帰（画面が壊れない・`vite build` 成功）。
  - [ ] 「既存=A / 新規=B」のシナリオ別方針を `dev-flow-journal.md` に明記。

### US-D6 Mobile-Consumer プロファイル適用
**As** DEV-A、**I want** `.fig-profile-*`（Mobile-Consumer）を適用したい、**so that** 消費者向けの操作性プロファイルで一貫させる。
- **AC**: [ ] Consumer プロファイルのトークン上書きが効く（端末2種＝Terminal 論点は将来）。

### US-D7 before↔after の可視化
**As** DEV-A、**I want** `feature/figuds-adoption` と `feature/home-redesign` の diff で修正前後を確認したい、**so that** dogfooding の成果を客観的に示せる。
- **AC**（→AC①-5）: [ ] 2ブランチ diff／PR で before↔after が一望できる（push 済）。

---

## Epic P — ポータル綿密化（§4-4 IA 全項目）

### US-P1 役割別入口
**As** VIEW-S、**I want** 入口で「自分は何者か（開発者/利用者/管理者）」と「まずどこを読むか」が即わかりたい、**so that** 迷わず始められる（FR2-9・画像01）。
- **AC**: [ ] トップ/概要に役割別入口（カード等）。[ ] 各役割の「最初に読む順番」へ誘導。

### US-P2 シナリオA フロー（既存あり・★最優先）をポータルだけで辿る
**As** VIEW-S、**I want** 既存アプリを整える流れ（公開サイト閲覧→Developer ガイド→必要 repo を clone・既存コード配置→スタイル修正開始[テンプレ/開始宣言でほぼ自動]→「最低でも自社デザイン資産化」達成で通知・終了）をポータルだけで辿りたい、**so that** 口頭補足なしに着手できる（FR2-10・画像02-A・AC②-1）。
- **AC**: [ ] 各ステップがポータル導線として連続して読める。[ ] BusDelayAlerts(LLocana) を実例ウォークスルーとして参照できる。

### US-P3 シナリオ② フロー（新規開発）をポータルだけで辿る
**As** VIEW-S、**I want** 新規開発の流れ（AI-DLC の Construction で FIG-UDS スタイル＋UI 実装）をポータルだけで辿りたい、**so that** 既存なしの場合も迷わない（FR2-10・画像02-②）。
- **AC**: [ ] 新規シナリオの導線が独立して読める。[ ] 「既存=A / 新規=B」の使い分けが説明されている。

### US-P4 getting-started の責務分離
**As** DEV-A、**I want** `developer/getting-started` が「導入」に絞られ、運用（Core 昇格等）は別ページへ分離されていてほしい、**so that** はじめての人が運用情報で迷わない（FR2-11）。
- **AC**: [ ] getting-started に運用内容が混在しない。[ ] 運用系は `#/ops/*`・`version-management`・`integration` へ相互リンク。

### US-P5 オンボーディング/ランディング
**As** VIEW-S、**I want** トップ/概要に「はじめに読む順番」やオンボーディング導線がほしい、**so that** 初訪問でも全体像と次の一歩が掴める（FR2-13）。
- **AC**: [ ] 初訪問者向けランディング（順番・役割別カード）がある。

### US-P6 未整備コンポーネント閲覧の「余白」
**As** VIEW-S、**I want** 既リリース済で未整備のコンポーネント群を閲覧できる余白がほしい、**so that** 昇格前の資産も見渡せる（FR2-15・画像01/03）。
- **AC**: [ ] 未整備/蓄積中の資産を閲覧できるビュー（実装範囲は設計で確定）。

### US-P7 主要4操作のポータル完結（セルフ検証）
**As** VIEW-S、**I want** 主要4操作（①新製品セットアップ ②既存製品の移行 ③Core 昇格提案 ④バージョン参照）をポータル参照のみで完遂したい、**so that** ポータルが単一エントリポイントとして機能する（AC②-1）。
- **AC**（→AC②-1/2）:
  - [ ] 4操作それぞれがポータルだけで辿れる（口頭補足不要）。
  - [ ] ユーザー1人の**セルフ試験チェックリスト**で完遂を確認（招待の代替・Q8/Q9=C）。

---

## Epic X — 横断（Core 昇格・UX 改修・記録）

### US-X1 ドメインパターンの Core 昇格を実行（S4=B）
**As** MAINT（＋DEV-A の提案）、**I want** LLocana のドメインパターン（arrival-card/delay-banner/notification-sheet/route-selector 等）を抽出し FIG-UDS Live Preview 形式化→Core へ提案・マージして昇格を完了したい、**so that** 自社資産が Core へ循環する（FR2-7 拡張・画像03①〜④）。
- **AC**:
  - [ ] 昇格候補を抽出し、即時 FIG-UDS Live Preview に使える形式へ整える。
  - [ ] FIG-UDS Core へ提案（PR/Issue）→ レビュー → マージ。
  - [ ] Core 側で昇格され、新規コンポーネントが確認できる（画像03④）。
  - [ ] 他スタイル/旧 DS スタイルを混入させない（画像03 注意）。

### US-X2 UX 改修フローの確立（VSCode×Pencil・S3=C）
**As** UX-D、**I want** 既存機能を壊さず画面遷移図の確認/差替を VSCode×Pencil で行い、UX 改修フローを確立したい、**so that** スタイルに加え操作感まで改善できる（FR2-14 拡張・画像02 あわよくば）。
- **AC**:
  - [ ] 主要画面の画面遷移/UX を Pencil（.pen）で表現・差替できる。
  - [ ] 既存機能が非回帰（機能を壊さない）。
  - [ ] UX 改修フロー（確認→差替→反映）がポータルに導線として残る。

### US-X3 GitHub 操作の案内（昇格・移行）
**As** VIEW-S、**I want** Core 昇格や移行の GitHub 操作（PR 作成・ブランチ・マージ等）をポータルの案内だけで実施したい、**so that** 非専門でも手順どおりに操作できる（FR2-12・画像03）。
- **AC**: [ ] 昇格/移行の GitHub 操作が手順として案内されている（スクショ/コマンド/クリック手順）。

### US-X4 開発フローの記録とポータル素材化
**As** AI-AG（＋チーム）、**I want** 開発フロー（dev-flow-journal）・セッション（session-log）を継続記録し、ポータル素材化したい、**so that** 開発フロー自体が再利用資産になる（FR-4.10 循環）。
- **AC**: [ ] 各ステップで journal/session-log を更新。[ ] ポータル反映候補が棚卸しされている。

---

## 旅（ジャーニー）の通し線（S1=C のハイブリッド・補助マップ）

### 旅1「既存アプリを整える」（DEV-A / AI-AG・シナリオA）
公開ポータル閲覧（US-P2）→ Developer ガイドで clone・配置（US-P2）→ 配布確立 US-D1 → @theme ブリッジ US-D5 →
signature 集約 US-D2 → 状態色 US-D3 → 生 HEX 解消 US-D4 → プロファイル US-D6 →（あわよくば UX 改修 US-X2）→
before↔after 確認 US-D7 →（蓄積→昇格 US-X1）→ 記録 US-X4。

### 旅2「ポータルだけで操作する」（VIEW-S・goal②セルフ検証）
役割別入口 US-P1 → オンボーディング US-P5 → シナリオ選択（A=US-P2 / ②=US-P3）→ getting-started 責務分離 US-P4 →
主要4操作の完遂 US-P7（移行・バージョン参照・昇格提案）→ GitHub 操作案内 US-X3 → 未整備閲覧余白 US-P6。

---

## ペルソナ × ストーリー マッピング
| ストーリー | DEV-A | UX-D | MAINT | VIEW-S | AI-AG |
|---|---|---|---|---|---|
| US-D1〜D7 | ◎ |  |  |  | ○ |
| US-P1,P3,P5,P6 |  |  |  | ◎ | ○ |
| US-P2 | ○ |  |  | ◎ | ○ |
| US-P4 | ◎ |  |  | ○ |  |
| US-P7 |  |  |  | ◎ |  |
| US-X1 | ○ |  | ◎ |  |  |
| US-X2 |  | ◎ |  |  |  |
| US-X3 |  |  | ○ | ◎ |  |
| US-X4 | ○ |  |  |  | ◎ |

## 受け入れ条件カバレッジ（要件 AC との対応）
- **AC①-1**=US-D2 / **AC①-2**=US-D3 / **AC①-3**=US-D4 / **AC①-4**=US-D1 / **AC①-5**=US-D7（＋NFR2-3=US-D5）。
- **AC②-1**=US-P2/P3/P7・US-X3 / **AC②-2**=US-P7（セルフ検証）/ **AC②-3**=US-P2（LLocana 実例）。
- **スコープ拡張**: US-X1（S4=B 昇格実行）・US-X2（S3=C UX 改修実装）。
