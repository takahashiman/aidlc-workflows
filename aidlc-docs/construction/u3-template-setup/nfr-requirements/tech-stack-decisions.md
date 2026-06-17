# U3 Template & Setup — Tech Stack Decisions

> 確定回答: NRQ1-7 = すべて A。U3（fig-ext-template ＋ Interactive Prompt Generator ＋ AI セットアップ）の技術選定。

## TSD-1. テンプレ: standalone GitHub Template Repository
- **決定**: `fig-ext-template` を GitHub Template Repository とし、Core を submodule で取り込む独立 repo 雛形にする（FDQ1=A）。seed は既存 `extensions/template/`。
- **根拠**: 目標マルチレポ・ADQ6 に整合。複製は GitHub 標準機能で確実（US-3.1）。

## TSD-2. Interactive Prompt Generator: vanilla JS（既存正典化）
- **決定**: `ai-co-creation.js`（vanilla JS・IIFE）を U3 側に正典として配置（FDQ8=A / NRQ1=A）。ポータルは導線参照。
- **根拠**: 既存資産活用・最小依存・ADQ1/U2 整合。フレームワーク非導入。

## TSD-3. 入力契約: project-settings.json ＋ JSON Schema
- **決定**: セットアップ単一入力契約を `project-settings.json` とし、Core 正典 `project-settings.schema.json` で検証（FDQ2=A / NRQ2=A）。
- **根拠**: 機械可読・検証可能。Generator 出力と AI 入力を一致させる。

## TSD-4. 変数適用: project-settings 駆動の Node 初期化スクリプト
- **決定**: 雛形にプレースホルダを持たせず、Node スクリプトが project-settings の値で signature/profile/版/表示名を冪等適用（FDQ3=A / NRQ7=A）。
- **根拠**: 既存 signature.css・`.fig-profile-*` 機構に整合。U2 build と同系・オフライン可。

## TSD-5. Core pin: submodule ＋ CORE-DS-VERSION
- **決定**: git submodule pin（再現性）＋ `CORE-DS-VERSION`（可視性）。整合は CI 検査（FDQ4=A / SEC-3）。
- **根拠**: version-matrix 収集（U5/CI-3）の入力。再現性と可視性を両立。

## TSD-6. registry 自動 PR: 最小権限・PR・CI・レビュー
- **決定**: AI が最小権限トークンでブランチ経由 PR を起票 → CI(U5/CI-5)＋Maintainer レビュー（FDQ5=A / NRQ3=A）。直接編集禁止。
- **根拠**: 単一正典の保全（ADQ4）。自動化と統制の両立。

## TSD-7. CI: 雛形配線（ロジックは U5 参照）
- **決定**: テンプレは三層 Lint/VRT/version チェックの workflow 雛形を同梱し、実体は U5 共有設定を参照（FDQ6=A / MAINT-3）。Actions は SHA pin（SEC-4）。
- **根拠**: 責務分界・二重管理回避。

## TSD-8. スコープ分離: マルチレポ＋ScopeManifest
- **決定**: 物理分離を主とし、SKILL.md/AGENTS.md に ScopeManifest を明文化（FDQ7=A / SCOPE-1/2）。
- **根拠**: ADQ 確定のマルチレポに整合。AI コンテキストを Core＋対象製品に限定。

## TSD-9. 供給チェーン安全性
- **決定**: submodule pin＋CORE-DS-VERSION 整合・Actions SHA pin・SCA・シークレット管理（NRQ4=A / SEC-3〜6）。
- **根拠**: Security Baseline の該当項目を enforce。

## TSD-10. ブラウザ対象: モダン・エバーグリーン
- **決定**: Chrome/Edge/Safari/Firefox 最新（NRQ6=A）。U2/Core と整合。

---

## 依存サマリ（最小化）
| 種別 | 採用 | 備考 |
|---|---|---|
| Generator UI | vanilla JS | TSD-2 |
| 入力検証 | JSON Schema（Core 正典） | TSD-3 |
| 初期化 | Node スクリプト（最小依存） | TSD-4 |
| Core 配布 | git submodule（pin） | TSD-5 |
| CI | U5 共有設定参照＋Actions SHA pin | TSD-7/9 |
> 実行時の第三者ランタイム依存を持たない（テンプレ＋静的 Generator＋ローカル/CI スクリプト）。
