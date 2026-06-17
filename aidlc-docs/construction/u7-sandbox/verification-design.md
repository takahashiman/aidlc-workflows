# U7 Sandbox — 検証設計（Verification Design）

> **Unit**: U7 Sandbox（横断）／**ストーリー**: US-X.1 Core 引込み検証 `[FR-8.1]` `[P2]`／**リポジトリ**: `ProductA`（`aidlc-projects/ProductA`）
> **性質**: throwaway サンドボックス。配布機構（submodule）の妥当性を確認するためだけに存在し、**検証完了後に削除**する（US-X.1 AC1）。
> 他 Unit のような 5 ステージ（Functional/NFR/Infra/Code）は持たず、本書1枚を設計、`verification-report.md` を結果とする軽量構成。

## 1. 目的（Why）
新規/既存の製品リポジトリが **FIG Core DS を git submodule として正しく引き込み、ビルド・参照できるか**を、独立した最小アプリ（ProductA = React/CRACO の業務端末アプリ想定）で検証する。配布機構（submodule pin ＋ CSS クラス方式消費）を本運用前に確証するのがゴール。

## 2. 検証対象の前提整理（重要な認識の更新）
ProductA は **2026-06-04 時点の旧配線**のまま残っていた：
- submodule = 旧 `main`@`6f36074`（busapp 拡張ブランチ）を指し、`extensions/busapp/components` の **JSX** を import
- これは U1 で Core を **CSS クラス方式（`.fig-*`）・`core` ブランチ正典**へ再設計する前のモデル。busapp 自体は U4 で `fig-ext-business-busapp` へ分離済み

→ U7 検証は「**現行の正典 Core を、現行の消費モデルで引けるか**」へ更新する必要がある。これが U7 の実作業の中心。

## 3. 「正しくビルド・参照できる」の定義（AC1 の操作的定義）
| # | 検証項目 | 合格基準 |
|---|---|---|
| V1 | submodule 取り込み | `design-system/` に Core `core` ブランチ先端（`d9919f9`）の実体が存在し、gitlink がその SHA を指す |
| V2 | 参照解決 | 製品コードから Core の CSS（`primitives/semantic/tokens/*`）を alias `@design-system/*` 経由で import 解決できる |
| V3 | ビルド成功 | `craco build` が `Compiled successfully` で完了 |
| V4 | DS の実体取り込み | 生成された bundle CSS に Core の `.fig-*` クラス定義が実際に含まれる（空 import でない） |
| V5 | プロファイル適用 | 製品が選んだプロファイル（ProductA=Mobile-Terminal）の `.fig-profile-terminal` が解決される |

## 4. 検証アプローチ（How）
1. **submodule を現行 Core へ更新**: ローカル Core repo（`aidlc-projects/FIG-Universal-Design-System` の `core` ブランチ・実体の正典）から `core` 先端を取り込み、submodule working tree を `d9919f9` にチェックアウト。
   - ※ 本番（GitHub URL ＋ SemVer タグでの pin）は **要ユーザー操作（checklist フェーズ F）** に委譲。Core に SemVer タグ未発行のため、ローカル `core` 実体に対し配布機構の妥当性のみ先行検証する。本プロジェクトの方針「GitHub 操作は Build & Test 直前に一括」と整合。
2. **消費モデルを CSS クラス方式へ再配線**: `src/App.jsx` を Core CSS の import ＋ `.fig-*` className 利用へ書き換え（JSX import を撤去）。Core は JSX を持たないため、これが現実の消費パス。
3. **ビルド実行・bundle 検証**: `craco build` → 生成 CSS に `.fig-*` が含まれることを確認。
4. **結果を `verification-report.md` に記録。**

## 5. ビルド設定の要点（変更不要だった点）
- `craco.config.js`: `ModuleScopePlugin` 除去により `src/` 外（submodule）からの import が可能 → CSS import に必要。alias `@design-system → ./design-system`。**そのまま流用**（旧 JSX 用の babel-loader 拡張は無害なため温存）。
- `jsconfig.json`: `@design-system/*` パス解決。変更不要。

## 6. スコープ外 / 委譲事項
- **本番 submodule 検証**（実 GitHub URL ＋ Core SemVer タグへ pin）→ checklist フェーズ F（U7 項）。
- **ProductA の削除**（AC1 後段）→ 破壊的操作のため checklist の 🛠 ユーザー操作に委譲（本 Unit では削除推奨を明記するのみ）。
- 機能網羅・E2E・VRT は対象外（配布機構の妥当性確認に限定）。

## 7. AC トレーサビリティ
- **US-X.1 AC1**「ProductA で Core を submodule で取り込む → 正しくビルド・参照でき → 検証完了後に削除」
  - 「取り込み・ビルド・参照」= V1–V5（本 Unit で実施・`verification-report.md`）
  - 「検証完了後に削除」= checklist フェーズ F（U7 項）の 🛠 操作として明記
