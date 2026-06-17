# Services / Orchestration — Application Design

> 本システムの「サービス」は、複数コンポーネントを束ねる**オーケストレーション・フロー**（ビルド/CI/運用プロセス）として表現する。

## SV-1 Portal Build Service（ポータルビルド）
- **責務**: ポータルを最新 Core DS（rolling）で構築し、メタデータ・版・showcase を反映して Pages 公開
- **オーケストレーション**:
  1. Core DS（rolling）から `taxonomy.json`/`registry.json` 取得（PT-7）
  2. CI-3 Version Collector → `version-matrix.json`
  3. CI-4 Showcase Collector → `showcase-index.json`
  4. PT-2 ナビ生成・PT-4〜PT-6 ビュー構築（デモは iframe）
  5. CI-2 VRT 実行 → グリーンで GitHub Pages デプロイ
- **トリガ**: Core DS リリース / ポータル変更 / 定期

## SV-2 New Project Setup Service（新規派生）
- **責務**: template から製品 repo を立ち上げ、AI が初期設定し registry 登録まで完了
- **オーケストレーション**:
  1. TM-1 Template Repository を複製
  2. TM-2 でセットアッププロンプト生成（製品名/色/カテゴリ）
  3. TM-3：AI が変数置換・CI 配線・`CORE-DS-VERSION`・`.fig-profile-*` 設定
  4. **AI が Core DS `registry.json` へ追加 PR を自動起票**（ADQ3）
  5. CI-5 が登録を検査
- **アクター**: P2 エンジニア × P4 AI エージェント

## SV-3 Core Promotion Service（Core 昇格）
- **責務**: 拡張/ポータルの優れたパーツを Core へ昇格（既存 Contribution 準拠）
- **オーケストレーション**:
  1. 提案（`core-promotion` ラベル, 3行）— 低ハードル
  2. 3プロダクト基準確認（showcase が裏付け）
  3. 普遍化（Maintainer 伴走：ドメイン語彙除去・トークン階層準拠）
  4. レビュー（軽微＝1名即決／重大＝デザイナー＋エンジニア2名）＋リリース列車
  5. CD-6 次 MINOR で公開 → 各拡張は次回 pin 更新で取得、ポータルは rolling 反映
- **品質ゲート**: 3プロファイル成立／トークン階層遵守／WCAG AA／spec・preview 完備

## SV-4 Migration Service（既存取り込み・段階移行）
- **責務**: 既存製品を拡張枠へ取り込み、Core へ段階移行
- **オーケストレーション**:
  1. 既存コードを `fig-ext-*` として repo 化（EX）
  2. Core を submodule pin
  3. 画面単位で Core 適応（**画面内 100%**、新旧混在画面は不可）
  4. 完了判定：主要フロー100%＋全体≧80%（チェックリスト○）
- **後方互換**: 旧名→新名のエイリアス/ラッパー、破壊的は MAJOR＋移行ガイド

## SV-5 Guardrail CI Service（品質保証）
- **責務**: 三層遵守と表示安定を自動担保
- **構成**: CI-1 三層 Lint（全 repo）＋ CI-2 VRT（Core×ポータル、マージ条件）＋ CI-5 登録検査
- **配布**: CD-7 共有 Lint 設定を template/各 repo に同梱

## SV-6 Metadata Governance Service（taxonomy/registry 統治）
- **責務**: Core Maintainer が `taxonomy.json`/`registry.json`（Core DS 正典, FQ1=A）を管理
- **オーケストレーション**: カテゴリ追加/再編は Core Maintainer 承認 → Core DS へコミット → ポータルが rolling 反映
- **整合**: registry.category は taxonomy に存在必須（CI で検査）

## サービス↔ペルソナ↔ストーリー対応
| サービス | 主ペルソナ | 主ストーリー |
|---|---|---|
| SV-1 Portal Build | P5, P1 | US-2.1〜2.7, US-4.3, US-5.1 |
| SV-2 Setup | P2, P4 | US-3.1〜3.4 |
| SV-3 Promotion | P1, P2 | US-2.5, US-4.4, US-5.2 |
| SV-4 Migration | P3 | US-3.5, US-3.6, US-4.5 |
| SV-5 Guardrail CI | P2 | US-1.2, US-4.1, US-4.2 |
| SV-6 Metadata Gov | P1 | US-2.1, US-4.3 |
