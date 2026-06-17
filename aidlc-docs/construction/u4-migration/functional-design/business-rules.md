# U4 Migration — Business Rules

> 確定回答: FDQ1-8 = すべて A。各規則は ID 付与（CI/Lint で参照・U5 が実行基盤）。
> 凡例: 【強制】=CI/Lint で機械強制 / 【検証】=verify/レビューで確認 / 【ガバナンス】=Maintainer 判断。

## 取り込み規約（BR-MIG-*）— US-3.5 / FDQ1
- **BR-MIG-1**【強制】 既存製品の取り込みは `fig-ext-<category>-<product>` 命名の独立 repo として行う（U1 の registry/taxonomy 命名規約に従う）。busapp → `fig-ext-<cat>-busapp`。
- **BR-MIG-2**【検証】 取り込みは U3 `fig-ext-template` 派生 ＋ `init.mjs`（migrate-in 拡張）で行い、derive→duplicate→migrate-in→apply→pin→wire-ci→register→baseline→verify を完了する。
- **BR-MIG-3**【強制】 取り込み直後の旧実装は `legacy/` 隔離領域に置く。`legacy/` への新規追加は禁止（移行はそこから減らす方向のみ）。
- **BR-MIG-4**【検証】 migrate-in は冪等。同一資産の二重取り込みをハッシュ突合で防ぐ。
- **BR-MIG-5**【強制】 取り込み完了の前提として CorePin（submodule + `CORE-DS-VERSION`）と registry 登録 PR が存在する（U3 BR-PIN/BR-REG を継承）。

## 整合化規則（BR-CONV-*）— US-4.1 / FDQ2
- **BR-CONV-1**【強制】 移行後の UI は Core `.fig-*` クラスへ委譲する。生 hex/px 直書き・`--fig-*` 非経由・三層逆流（Primitive 直参照）は禁止（三層ガードレール US-4.1）。
- **BR-CONV-2**【強制】 製品固有の生 CSS・独自トークンは Core semantic トークン経由に置換する。製品で残す独自値は Extensions 層（BR-EXT-1）に限る。
- **BR-CONV-3**【検証】 旧コンポーネントの公開 props インターフェイスは移行期間中は維持する（呼び出し側改修の最小化）。内部実装のみ Core クラスへ差し替える。
- **BR-CONV-4**【強制】 ルート要素に製品既定の `.fig-profile-*` を付与し、デバイス最適化を Core に委譲する。
- **BR-CONV-5**【ガバナンス】 旧部品の Core 正典24 への存在有無を registry/taxonomy で照合する。存在＝Core 写像、不在＝ExtensionPart（BR-EXT-1）。

## 段階移行・画面内混在禁止（BR-SCR-*）— US-3.6 AC1 / FDQ3
- **BR-SCR-1**【強制】 移行の原子単位は画面（route/page）。`MIGRATED` を名乗れるのは「画面内の全 UI が Core `.fig-*`/Core 由来（Extensions層含む）で構成」される画面のみ。
- **BR-SCR-2**【強制】 **1画面内の新旧混在は禁止**。旧実装が1つでも残る画面は `IN_PROGRESS` であり、移行率にカウントしない。
- **BR-SCR-3**【検証】 画面間の新旧併存は `migrationDeadline` まで許容。期限超過は CI 警告（BR-WRAP-3 と同基盤）。
- **BR-SCR-4**【強制】 画面を `MIGRATED` にするには 三層 Lint 緑 ∧ VRT 緑（視覚回帰なし）を満たす（U5 がマージ条件化）。

## 完了判定（BR-DONE-*）— US-3.6 AC2 / FDQ4
- **BR-DONE-1**【強制】 移行完了ゲート = `criticalDone == true` AND `overallRatio >= 0.80`（二条件 AND）。
- **BR-DONE-2**【検証】 `criticalFlows` は MigrationProject の移行マニフェストで明示宣言する（未宣言では完了判定不可）。
- **BR-DONE-3**【強制】 移行率・完了状態は移行済み画面集合から自動算出する（手動入力での『完了』宣言は不可）。
- **BR-DONE-4**【検証】 MigrationChecklist は状態から導出した生成物として出力する。
- **BR-DONE-5**【強制】 Core の MAJOR 更新が未消化（BR-GUIDE-2）の場合、完了ゲートを通さない。

## 後方互換ラッパー／エイリアス（BR-WRAP-*）— US-4.5 AC1 / FDQ6
- **BR-WRAP-1**【検証】 ラッパーは二種を区別する: ①Core エイリアス（Core 側・改名追従） ②製品移行ラッパー（製品側・移行期の旧 API 橋渡し）。
- **BR-WRAP-2**【強制】 全ラッパー/エイリアスに `deprecatedSince` と `removeBy`（撤去期限）を必須付与する。
- **BR-WRAP-3**【強制】 `removeBy` を超過したラッパーが残存すると CI 警告（U5）。移行マニフェストに期限超過フラグを立てる。
- **BR-WRAP-4**【強制】 製品移行ラッパーは移行完了（BR-DONE-1）到達後に撤去する。`legacy/` が空であることを最終 verify で確認。

## Core 未満パーツ（BR-EXT-*）— US-2.5 / FDQ5
- **BR-EXT-1**【強制】 Core 正典24 に無い独自/仮パーツは製品 repo の Extensions 層（`extensions/`）に置く。Extensions 層は製品内の正規層であり、移行判定上『Core 適応』とみなす。
- **BR-EXT-2**【検証】 ExtensionPart は `core-promotion` ラベル/所定ディレクトリで Showcase(U6) に自動収集される（手動登録不要）。
- **BR-EXT-3**【ガバナンス】 ExtensionPart の Core 還元は昇格フロー（US-4.4・二段レビュー/リリース列車）に乗せる。
- **BR-EXT-4**【検証】 Core 昇格後は Extensions 層のローカル実装を撤去し、Core 版（pin/rolling）へ切替える。

## MAJOR 移行ガイド（BR-GUIDE-*）— US-4.5 AC2 / FDQ7
- **BR-GUIDE-1**【検証】 Core の MAJOR リリースには構造化 MigrationGuide（変更点・旧→新マッピング・手順・期限）を必須添付する（U1 リリース基盤）。
- **BR-GUIDE-2**【強制】 製品 repo は `CORE-DS-VERSION` の MAJOR 更新時、対応 MigrationGuide 参照を移行チェックリストの必須項目に組込む。未消化は BR-DONE-5 で完了をブロック。

## 進捗可視化・単一真実源（BR-VIS-*）— FDQ8
- **BR-VIS-1**【強制】 製品 repo に機械可読な移行マニフェスト（`migration-manifest.json`）を置く。手動更新は不可（状態から再生成）。
- **BR-VIS-2**【検証】 マニフェストは U5 の version 収集と同一クローリングでポータル運用ビュー（U2）に集約され、registry エントリと紐付く。
- **BR-VIS-3**【検証】 マニフェストには screens/criticalFlows/overallRatio/criticalDone/completed/wrappers/extensionParts/coreVersion を含む。

## スコープ分離（継承）（BR-SCOPE-*）— US-3.4 / U3 継承
- **BR-SCOPE-1**【検証】 移行作業/AI 生成で渡すコンテキストは Core ＋ 対象製品 repo のみ（U3 ScopeManifest を継承）。他事業製品は不可視。
