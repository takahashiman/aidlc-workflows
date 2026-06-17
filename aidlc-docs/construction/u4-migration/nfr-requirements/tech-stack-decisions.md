# U4 Migration — Tech Stack Decisions

> 質問ゲート無し（FD で確定）。U3 の技術選定（GitHub Template / project-settings / Node init / submodule pin / U5 CI 参照）を**継承**し、U4 固有の移行技術を加える。

## TSD-1. 取り込み形態: U3 fig-ext-template 派生 ＋ migrate-in
- **決定**: 既存 busapp は `fig-ext-template`（GitHub Template）から `fig-ext-<cat>-busapp` を派生し、`init.mjs` に **migrate-in / baseline** ステップを追加して既存資産を `legacy/` へ取り込む（FDQ1=A）。
- **根拠**: U3 導線（duplicate/apply/pin/wire-ci/register/verify）を再利用し、移行固有処理のみ追加。マルチレポ・ADQ5/6 整合。

## TSD-2. 整合化方式: Core `.fig-*` クラス委譲（JSX は薄ラッパー）
- **決定**: busapp の JSX は presentational ラッパーに留め、視覚定義は Core `.fig-*` クラスへ全面委譲。生 CSS/独自トークンは Core semantic 経由に置換（FDQ2=A）。
- **根拠**: Core は CSS クラス方式（JSX なし・NRQ2 確定）。三層ガードレール（US-4.1）適合・「画面内 100% Core 適応」を満たせる。props 維持で呼び出し側改修を最小化。

## TSD-3. 写像表: 機械可読 ComponentMapping
- **決定**: 旧→Core 写像（coreClass/propsMap/tokenMap）を機械可読な対応表として保持し、Code Generation の入力とする（FDQ2=A / MAINT-2）。
- **根拠**: 再現性・自動化。busapp 4部品（Button/Card/TextField/FAB）の初期表を FD で確定。

## TSD-4. 段階移行の判定: 画面=原子＋自動算出
- **決定**: 画面（route）を移行単位とし、混在検出・移行率・完了ゲートを移行マニフェストから自動算出（FDQ3/4=A）。算出は U5 version 収集と同一クローリング基盤（FDQ8=A）。
- **根拠**: US-3.6 AC1/AC2 の機械化。手動宣言を排除。

## TSD-5. VRT: 旧 preview をベースライン
- **決定**: busapp `preview/*.html` を VRT ベースライン候補とし、写像前後の視覚差分を検証（MIG-Q1）。実行基盤は U5 VRT。
- **根拠**: 移行が破壊でないことを保証。既存資産の再利用。

## TSD-6. 後方互換: ラッパー＋期限メタ＋CI 警告
- **決定**: CompatibilityWrapper（core-alias / product-wrapper）に `deprecatedSince`/`removeBy` を必須付与し、期限超過を CI 警告（FDQ6=A / COMPAT-1/2）。Core エイリアスは U1 既存 alias 機構を流用。
- **根拠**: US-4.5 の可逆性と寿命可視化の両立。

## TSD-7. MAJOR 移行ガイド: 構造化 MigrationGuide
- **決定**: Core MAJOR に構造化ガイド（renameMap/steps/deadline）を必須添付し、製品は CORE-DS-VERSION MAJOR 更新時に参照消化を完了必須項目化（FDQ7=A / COMPAT-4）。
- **根拠**: US-4.5 AC2・自動チェック可能。

## TSD-8. 進捗可視化: migration-manifest.json ＋ ポータル集約
- **決定**: 製品 repo に `migration-manifest.json`（機械可読・状態から再生成）を置き、U5 収集でポータル運用ビュー（U2）に集約・registry 紐付け（FDQ8=A / MAINT-1/4）。
- **根拠**: 単一真実源・手動更新排除・既存 version-matrix 基盤再利用。

## TSD-9. Core pin / スコープ分離 / 供給チェーン（U3 継承）
- **決定**: submodule pin＋CORE-DS-VERSION 整合（SEC-3）、ScopeManifest（SEC-6）、Actions SHA pin・SCA・シークレット管理（SEC-4/5）。
- **根拠**: Security Baseline 該当項目を enforce。U3 と一貫。

## TSD-10. ブラウザ対象: モダン・エバーグリーン
- **決定**: Chrome/Edge/Safari/Firefox 最新。Core/U2/U3 と整合。

---

## 依存サマリ（最小化）
| 種別 | 採用 | 備考 |
|---|---|---|
| 取り込み/初期化 | Node スクリプト（init.mjs 拡張・最小依存） | TSD-1 |
| 整合化 | Core `.fig-*` CSS クラス（実行時ランタイム無し） | TSD-2 |
| 写像/マニフェスト | JSON（機械可読・状態から生成） | TSD-3/8 |
| VRT/Lint/収集 | U5 共有基盤参照 | TSD-4/5 |
| Core 配布 | git submodule（pin） | TSD-9 |
> 移行成果物は実行時の第三者ランタイム依存を持たない（Core クラス委譲＋静的資産）。
