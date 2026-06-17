# U3 Template & Setup — Business Rules

> 確定回答: FDQ1-8 = すべて A。検証可能な規則。MUST/MUST NOT/SHOULD。

## A. テンプレ構造規約（TM-1・FDQ1=A）
- **BR-TPL-1 (MUST)**: テンプレは standalone `fig-ext-template`（GitHub Template Repository）として提供する。複製は GitHub Template 機能で行う（US-3.1）。
- **BR-TPL-2 (MUST)**: 複製直後の repo は三層構造・`.fig-profile-*`・CI 雛形・Core submodule 枠が揃っていること。
- **BR-TPL-3 (MUST)**: テンプレは Core のトークン/コンポーネントを**複製・改変しない**。Core は submodule で取り込む（単一正典・重複排除）。
- **BR-TPL-4 (SHOULD)**: 雛形は `extensions/template/` の既存資産（project-settings.json・index.html・styles・README）を seed にする。

## B. 命名規約（ADQ5=A）
- **BR-NAME-1 (MUST)**: 拡張製品 repo 名は `fig-ext-<category>-<product>`。category は taxonomy のカテゴリ id に一致。
- **BR-NAME-2 (MUST)**: `project-settings.json.projectName` と repo 名・パスは整合する。

## C. 入力契約 / 変数（FDQ2/3=A）
- **BR-VAR-1 (MUST)**: セットアップの単一入力契約は `project-settings.json`。AI はこれを読んで runbook を実行する。
- **BR-VAR-2 (MUST)**: `project-settings.json` は Core 正典 `project-settings.schema.json` に準拠する（検証可能）。
- **BR-VAR-3 (MUST)**: 必須キー: projectName, displayName, designSystem.coreVersion, designSystem.profile, signatureColor.value, owners。欠落はセットアップ不可（fail）。
- **BR-VAR-4 (MUST)**: 変数適用は project-settings 駆動（雛形にプレースホルダ文字列を残さない）。signature は Core `signature-presets.json` のプリセットに整合する。
- **BR-VAR-5 (MUST)**: profile は admin/consumer/terminal のいずれか。

## D. Core pin / 版明示（US-3.3 / ADQ6=A・FDQ4=A）
- **BR-PIN-1 (MUST)**: Core は git submodule で特定コミットに pin する（再現性）。
- **BR-PIN-2 (MUST)**: ルート `CORE-DS-VERSION` に参照 SemVer を明記する（可視性）。
- **BR-PIN-3 (MUST)**: `CORE-DS-VERSION` と submodule コミットは一致する（CI 整合検査・不一致は fail）。
- **BR-PIN-4 (MUST)**: 製品は Core を **pin する**（ポータルの rolling とは異なる / BR-ROLL 群と対）。

## E. registry / taxonomy ガードレール（ADQ3=A+ / ADQ4・FDQ5=A）
- **BR-REG-1 (MUST)**: セットアップ末尾で Core DS `registry.json` へ登録 PR を自動起票する。
- **BR-REG-2 (MUST)**: registry エントリは repo/category/name/coreVersion を必須に持つ（demoUrl/subcategory は任意）。
- **BR-REG-3 (MUST)**: category（必要なら subcategory）が taxonomy に存在しない場合、PR に taxonomy 追記案を含める（Core Maintainer 承認前提）。
- **BR-REG-4 (MUST)**: registry/taxonomy の編集は本 PR 経由のみ（単一正典・Core Maintainer 承認）。製品/ポータルは直接書込まない。
- **BR-REG-5 (MUST)**: PR は CI 登録検査（U5/CI-5）＋ Maintainer レビューを通過して初めてマージされる。

## F. CI 配線（FDQ6=A）
- **BR-CI-1 (MUST)**: テンプレは CI workflow 雛形（三層 Lint・VRT フック・version 明示チェック）を同梱し、新 repo へ配線する。
- **BR-CI-2 (MUST)**: CI のロジック・閾値の実体は U5 の共有設定を参照する（テンプレに二重実装しない）。
- **BR-CI-3 (MUST)**: version 明示チェックは BR-PIN-3（CORE-DS-VERSION↔submodule 整合）を含む。

## G. スコープ分離（US-3.4・FDQ7=A）
- **BR-SCOPE-1 (MUST)**: 開発/AI 生成に渡すコンテキストは「Core＋対象製品 repo のみ」。他事業の製品 repo を含めない。
- **BR-SCOPE-2 (MUST)**: `fig-ext-template` の SKILL.md/AGENTS.md にスコープ分離方針（ScopeManifest）を明文化する。
- **BR-SCOPE-3 (MUST NOT)**: AI セットアップ/生成時に無関係製品の情報を参照・混入してはならない。

## H. Interactive Prompt Generator（TM-2・FDQ8=A）
- **BR-GEN-1 (MUST)**: Generator の正典は U3 側（fig-ext-template / Core 配布物）に置く。ポータル（U2）は導線参照のみ（重複排除）。
- **BR-GEN-2 (MUST)**: Generator は入力検証（命名規約・必須・preset 整合）を行い、`project-settings.json`＋セットアッププロンプトを出力する。
- **BR-GEN-3 (MUST)**: signature presets は Core 正典 `signature-presets.json` を参照する（乖離時は JSON が正典）。
- **BR-GEN-4 (SHOULD)**: 出力プロンプトはツール非依存（各チーム標準の AI アシスタントに読み替え可能・US-2.7 整合）。

## I. 冪等性・検証
- **BR-IDEM-1 (MUST)**: runbook 各ステップは冪等（再実行で重複・破壊しない）。
- **BR-IDEM-2 (MUST)**: セットアップ完了の検証＝必須値・Core pin・CI 配線・registry PR の存在を満たすこと（US-3.2 AC2）。
