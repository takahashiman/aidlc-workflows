# Infrastructure Design Plan — U2-2 配布・ブリッジ（Part 1）

> 対象: BusDelayAlerts（配布/ブリッジ・◎ submodule/Vite/CI）。FD/NFR/NFR-Design 確定を実配置へ。
> `[Answer]:` 記入後に Part 2 を生成。推奨案に **(推奨)**。

## 回答確定（2026-06-21）
- **IDQ1=A**: 生成は npm `prebuild`＋`predev` script（最小・Vite 非依存）。
- **IDQ2=A**: 製品 CI は最小（`vite build` 成功＋submodule pin 整合）。三層 Lint 接続は U2-3。
- **IDQ3=A**: CI は public 前提 `submodules: recursive`（トークン不要）。

## 現状（実測）
- scripts: `build`=`vite build` / `dev`=`vite` のみ（**prebuild なし・test なし**）。
- **CI 無し**（`.github/workflows` 不在）。**`.gitignore` 不在**。
- Vite: `@tailwindcss/vite` + `@vitejs/plugin-react`。依存に MUI/Radix/emotion（重）。

## 確定済（FD/NFR）
- 配布=submodule `vendor/core` × pin `v1.2.0` ＋ `CORE-DS-VERSION`。生成=ビルド時 `gen:palette --seed=#2C6B5E`・出力 `src/styles/generated/`（**gitignore 新設**）。ブリッジ=`src/styles/figuds-bridge.css` 1枚（後勝ち）。プロファイル=`.fig-profile-consumer`。

## カテゴリ評価
- Deployment/Compute/Storage/Messaging/Networking/DB: **N/A**（製品の静的フロント・ビルド時生成）。
- Shared Infra: Core 共有 CI（`_shared-guardrail` 等）への接続可否＝**論点 IDQ2**。
- 生成フックの実装方式＝**論点 IDQ1**。

## 生成する成果物（Part 2）
- [ ] `construction/u2-2-distribution-bridge/infrastructure-design/infrastructure-design.md`
- [ ] `construction/u2-2-distribution-bridge/infrastructure-design/deployment-architecture.md`

---

## 質問（Part 1）

## Question IDQ1 — 生成フックの実装方式
`gen:palette --seed=#2C6B5E` をいつ・どう実行しますか？（`npm run dev` は prebuild を起動しない点に注意）

A) **npm `prebuild` ＋ `predev` script（package.json）(推奨)** — 最小・Vite バージョン非依存・手順が明示的。他開発者が真似しやすい。

B) **Vite プラグイン（`buildStart` で生成）** — dev/build を単一箇所でカバー・自動。vite.config 依存。

C) **両方（プラグイン＋明示 script）** — 冗長。

[Answer]:

## Question IDQ2 — 製品 CI の範囲（新規 workflow）
BusDelayAlerts に新設する CI の範囲は？（現状 CI 無し）

A) **最小＝`vite build` 成功 ＋ submodule pin 整合（`CORE-DS-VERSION`＝実 ref）チェック (推奨)** — 三層 Lint（guardrail）は **U2-3（生 HEX 解消後）で接続**。今 guardrail を入れると既存 raw hex 379 で赤になるため。

B) **A ＋ Core `_shared-guardrail`（三層 Lint）を今接続（`strict:false`／警告止まり）** — 負債を可視化しつつ赤を回避。U2-3 で error 化。

C) **A ＋ guardrail を即 error 化（赤前提で可視化）** — 厳格。今サイクルで赤を許容。

[Answer]:

## Question IDQ3 — submodule の CI チェックアウト/認証
CI で Core submodule をどう取得しますか？

A) **public 前提で `submodules: recursive`（トークン不要）(推奨)** — Core は public（ポータル rolling 取込実績）。

B) **private 化に備え deploy key / PAT を用意** — 会社 org 移設後を見据える（現サイクルは個人 repo 継続のため過剰）。

[Answer]:
