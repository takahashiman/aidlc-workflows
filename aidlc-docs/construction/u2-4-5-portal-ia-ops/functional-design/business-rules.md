# Business Rules — U2-4/U2-5 ポータル IA・操作完結

> ポータル IA・操作完結導線の正典ルール。確定回答（PQ1〜4＝全 A）に基づく。
> 既存ポータルの BR-IA-*/BR-USE-*/BR-NAV-* を継承し、本ユニット分は **BR-PIA-*** で採番。

## 入口・ランディング（US-P1/P5）

### BR-PIA-1 — Home をランディング正典に（PQ2=A）
- 新ルート `#/home`（kind=`home`）を追加し `DEFAULT_ROUTE` を `#/home` とする。ハッシュ未指定時・ブランドロゴ遷移先も Home。
- Home は3つの役割別入口（開発者/利用者/管理者）と「はじめに読む順番」とシナリオ入口とクイックリンクを提示する。
- 既存の深いルート（`#/overview/...` 等）は**後方互換で直接到達可能**（Home 追加は導線追加であって既存導線の破壊ではない）。

### BR-PIA-2 — 役割と誘導先の固定対応
- 開発者→シナリオ別ガイド／Developer getting-started。利用者→使い方（歩き方/閲覧3形態）／プロジェクト集。
  管理者→運用（版/Showcase/昇格/ガバナンス）。
- 権利者向けの詳細 GitHub 操作（非エンジニア）は**ポータルに載せない**＝`aidlc-docs/` リポジトリ内ドキュメントへ誘導する注記のみ（§4-2・security by obscurity を避ける）。

### BR-PIA-3 — オンボーディングは順序提示に徹する
- 「はじめに読む順番」はリンクの順序提示であり、本文を複製しない（本文正典は Core/各ページ）。

## シナリオ別ガイド（US-P2/P3）

### BR-PIA-4 — シナリオは使い方ガイドとして実装（PQ3=A）
- 2シナリオ（A=既存・②=新規）を `usage.js GUIDES` に追加し、テンプレ（目的→前提→手順→確認）で記述する。
- 各シナリオは getting-started→次の一歩→参照 を順序立て、関連使い方/Developer/運用へ相互リンクする。

### BR-PIA-5 — シナリオA を最優先表示（画像02-A）
- シナリオA（既存）に★最優先を示すバッジを付け、使い方インデックス先頭・Home シナリオ入口先頭に置く。

### BR-PIA-6 — LLocana を実例導線に（AC②-3）
- シナリオA は LLocana/BusDelayAlerts を実例として参照（プロジェクト集の該当製品へリンク）。

## getting-started 責務分離（US-P4・ポータル IA のみ）

### BR-PIA-7 — 導入と運用を IA で分離（本文不変）
- Core 本文（`developer/*` PAGES）は rolling のまま改変しない（§4-4）。
- ポータルは Home/シナリオ/nav で「導入（getting-started 系）」と「運用（昇格/版管理/配布）」を別系統として誘導し、
  Developer ガイド描画時に運用話題は運用ビューへの相互リンク注記を IA レベルで添える。
- Core 本文そのものの組み替えは本ユニット スコープ外（将来 Core repo 側・注記のみ）。

## 未整備閲覧「余白」（US-P6）

### BR-PIA-8 — 余白は可視化に徹する（PQ4=A・スコープ尊重）
- 未整備可視化ビューは Core カタログの整備状況（整備済/未整備＝preview 未収録）を一覧・バッジ・整備率で示す。
- **22 件 preview の作成は本サイクル スコープ外**（state §スコープ外）。本ビューはそれらを作らず「余白」を俯瞰させるのみ。

### BR-PIA-9 — 整備判定はデータ駆動
- 判定は `core-content.json` PAGES（template=component/pattern）と `page.preview` の有無による（build が実体なき
  preview 参照を prune 済）。Core 側で preview を足せば自動で「整備済」へ切替わる（ポータル改修不要）。

## 主要4操作のポータル完結（US-P7）＋ GitHub 案内（US-X3）

### BR-PIA-10 — 4操作は使い方ガイドで完結（AC②-1）
- 新製品セットアップ／移行／Core 昇格提案／バージョン参照の各操作は、対応する使い方ガイドで
  目的→前提→手順→確認 まで**ポータル内リンクのみで完遂**できること。昇格提案=`promotion`・バージョン参照=
  `core-version`（既存）、新製品セットアップ=`new-product-setup`・移行=`migration`（新規追加）。

### BR-PIA-11 — GitHub 操作はツール非依存（US-X3・BR-USE-2 継承）
- `github-operations` ガイドは clone/branch/submodule pin/Issue（temp-part・core-promotion ラベル）/PR を
  ツール非依存表現で案内。シークレット/PAT 等の権利者専用操作は載せない（§4-2）。

### BR-PIA-12 — セルフ検証（AC②-2・Q8=C/Q9=C）
- 4操作それぞれが Home/シナリオ→該当ガイド→確認まで到達できることをセルフレビュー チェックリストで確認。
  Code Gen で結線テスト（ルート/ガイド存在・リンク到達）を追加する。

## 横断記録

### BR-PIA-13 — IA 改修を journal に記録（US-X4・FR-4.10）
- 本ユニットの IA/操作完結改修を `dev-flow-journal.md` に追記しポータル素材化する。

## トレーサビリティ
- US-P1/P5=BR-PIA-1/2/3。US-P2/P3=BR-PIA-4/5/6。US-P4=BR-PIA-7。US-P6=BR-PIA-8/9。
- US-P7=BR-PIA-10/12。US-X3=BR-PIA-11。US-X4=BR-PIA-13。
- AC②-1=BR-PIA-10 / AC②-2=BR-PIA-12 / AC②-3=BR-PIA-6。
