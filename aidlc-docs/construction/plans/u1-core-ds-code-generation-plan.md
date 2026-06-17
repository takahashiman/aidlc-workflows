# U1 Core DS — Code Generation Plan（Part 1）

> **これが Code Generation の単一の正典**。Part 2 はこの番号順に実行する。
> 対象 Unit: U1 Core DS（stories: US-1.1〜1.4, US-4.4/4.5 提供側）。

## コード生成先・方針
- **アプリコード生成先（workspace）**: `aidlc-projects/FIG-Universal-Design-System/`（Core DS リポジトリ。独立 repo・親は gitignore）
- **ドキュメント要約**: `aidlc-docs/construction/u1-core-ds/code/`（markdown のみ）
- **Brownfield 方針**: master(9ee445a) の既存資産（primitives.css / semantic.css / components / tokens / preview 等）を**再利用・in-place 修正**。複製（`*_new`）禁止
- **実行スタイル**: 縦切り増分（トークン→基盤3コンポーネント→残り）。各ステップ後にチェックボックス更新
- **UI 自動化対応**: インタラクティブ要素に安定した `data-testid`（`{component}-{role}`）

## 依存・前提
- 依存 Unit: なし（U1 は基盤）。後続（U2/U3/U5）が本成果に依存
- インフラ前提（U1 Infra Design）: 既存 FIG-UDS.git を Core 既定化、busapp は別 repo へ（**busapp 移設は U3/U4 の作業**＝本 Unit では「Core から busapp を分離」までを範囲とする）

## 生成ステップ（番号順・チェックボックス）

### Step 1: リポジトリ整理準備（brownfield）
- [x] 現ブランチをバックアップ（退避タグ backup/pre-reorg-*）
- [x] Core 内容（master 9ee445a 系）を `core` ブランチに確定、`fig-core` 二重ネスト submodule を解体（※デフォルトブランチ化は Phase 1b・GitHub操作）
- [x] `extensions/busapp` を分離（Core から除外、backup保全、後日 fig-ext-bus-* へ）
- [x] 要約 → `code/step1-repo-reorg.md`
- [x] **Phase 1b**: `git push -u origin core` 完了（remote に core ブランチ作成）
- [ ] **要ユーザー操作**: GitHub UI で**デフォルトブランチを `core` に変更**／busapp 移設後に main・master 整理

### Step 2: トークン層（Primitive / Semantic）`[US-1.2]` ✅
- [x] `primitives.css` 既存採用（生値、`--color-*`/`--fg-*`）
- [x] `semantic.css` 既存採用（役割トークン、Primitive のみ参照、層規約明文化済）
- [x] 要約 → `code/step2-tokens.md`（BR-2 を多接頭辞規約に修正）

### Step 3: プロファイル層（3プロファイル）`[US-1.3]` ✅
- [x] `.fig-profile-{admin,consumer,terminal}` 既存採用（`tokens/profile-*.css`）
- [x] 既定 = admin（Web-Admin）
- [x] 要約 → `code/step3-profiles.md`

### Step 4: 基盤コンポーネント（縦切り: card / button / input）`[US-1.2, BR-8]` ✅ ※NRQ2更新=CSSクラス方式
- [x] `.fig-button`/`.fig-card`/`.fig-input` 既存採用（`tokens/components.css`）
- [x] spec（button/card/input.spec.md）既存・preview（components-buttons/inputs/bus-card.html）既存
- [x] 要約 → `code/step4-base-components.md`

### Step 5: 残りコンポーネント（〜28種）`[US-1.1, BR-8]` ※CSSクラス方式 ⏳進行中
- [x] バッチ1 feedback（commit 2ffee42）
- [x] バッチ2-6 コンテナ/アクション/入力/ナビ/残（commit e428405）= **CSS 30クラスで28部品を全カバー**
- [x] 要約 → `code/step5-components.md`
- [x] 不足 spec.md(16件) 整備完了 → **全28 spec 揃う**（commit d336715）
- [ ] 継続(任意): preview の各部品 5状態の追補（既存 preview を活用、Build&Test 前まで）

### Step 6: メタデータ（正典）`[FQ1-A]` ✅
- [x] `registry.json`（空 projects[]＋スキーマ）、`taxonomy.json`（バス/タクシー/物流）
- [x] 要約 → `code/step6-8-metadata-alias-release.md`

### Step 7: 後方互換・エイリアス機構 `[US-4.5, P5]` ✅
- [x] `deprecated-aliases.css`（雛形）

### Step 8: バージョニング/リリース基盤 `[US-1.4]` ✅
- [x] `cliff.toml` / `CHANGELOG.md` / `.github/workflows/release.yml`（タグ時自動リリース）
- コミット: `6b5a6fc`

### Step 9: CI フック（雛形・実装は U5）→ **U5 に委譲**
- [ ] lint.yml / 共有 Lint 設定 = **U5 CI/CD Unit で実装**（Core にフック追加）

### Step 10: ドキュメント ✅
- [x] `README.md` を Core DS 版に刷新（三層/3プロファイル/CSSクラス/SemVer/利用/昇格）commit d336715

## ストーリー網羅
US-1.1(Step5/4) / US-1.2(Step2,4,5) / US-1.3(Step3) / US-1.4(Step8) / US-4.4(昇格資産=既存Contribution流用, Step10参照) / US-4.5(Step7)

## スコープ・見積
- **総ステップ**: 10。最大は Step5（25コンポーネント整備）
- 増分実行（Step1〜4 でトークン＋基盤を通し、以降コンポーネントを順次）を推奨
