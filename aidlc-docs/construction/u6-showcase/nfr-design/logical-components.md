# U6 Showcase — Logical Components

> 確定: FDQ1-7 全A。NFR Requirements を論理コンポーネントへ。実装は `portal/scripts/collect-versions.mjs`（拡張）＋ `portal/src/views.js`（renderShowcase 実体化）＋ `portal/scripts/build.mjs`（配線）。

## LC-C 収集層（ShowcaseCollector）
| ID | コンポーネント | 責務 | NFR |
|---|---|---|---|
| LC-C1 | `collectShowcase()` | registry 駆動で全製品を1パス走査し `items[]` 生成 | SC-Q-1 / PERF-1 |
| LC-C2 | extensions アダプタ | `GET contents/extensions` 列挙→部品抽出（除外フィルタ・ヘッダ name） | SC-Q-2 / BR-SC-SRC-3/4 |
| LC-C3 | issues アダプタ | `GET issues?labels=temp-part` 列挙→仮パーツ抽出 | SC-Q-1 / BR-SC-SRC-1 |
| LC-C4 | 昇格判定器 | `promotable`（既定 true）/ `promotedToCore`（Core 正典照合） | SC-Q-4 / BR-SC-PROMOTED |
| LC-C5 | fail-soft ラッパ | 個別 try/skip・全体失敗で exit0 据え置き | REL-1/2 |
| LC-C6 | 正規化名照合 | name 正規化＋別名表で Core 同義判定 | SC-Q-4 |

## LC-D データ層
| ID | コンポーネント | 責務 | NFR |
|---|---|---|---|
| LC-D1 | registry ローダ（共有） | `data/registry.json` を駆動源に（version 収集と共有） | TSD-3 / PERF-1 |
| LC-D2 | showcase-index 生成 | schema 充足 JSON 出力・安定ソート | SC-Q-3 / BR-SC-CONTRACT |
| LC-D3 | schema 検証（既存 build） | `showcase-index.schema.json` で検証（build パイプライン通過） | MAINT-2 |
| LC-D4 | Core 正典ローダ | `CORE_DS_REPO` registry/components 取得（照合用・fail-soft） | SC-Q-4 |

## LC-V ビュー層（renderShowcase 実体化）
| ID | コンポーネント | 責務 | NFR |
|---|---|---|---|
| LC-V1 | 状態機械 | 未収集 / 収集済み0件 / 一覧 の3分岐 | OBS-2 / BR-SC-EMPTY |
| LC-V2 | カード描画 | name＋kind バッジ＋ownerProjectId＋preview | US-5.2 AC1 / A11Y-1 |
| LC-V3 | 昇格導線 | `promotable && !promotedToCore`→「昇格を提案する →」(#/usage/promotion) | US-5.2 / BR-SC-PROMOTE-LINK |
| LC-V4 | 撤去推奨バッジ | `promotedToCore`→「Core昇格済み・撤去推奨」 | BR-DOG-4 |
| LC-V5 | 出力エスケープ | 外部由来文字列を `esc()` | SEC-2 |
| LC-V6 | 空状態説明 | 原因＋次アクション（使い方リンク）をテキスト | A11Y-2 / OBS-2 |

## LC-X 境界
| ID | 境界 | 扱い |
|---|---|---|
| LC-X1 | GitHub API 境界 | read-only token・fail-soft・レート配慮（PERF-2/SEC-1） |
| LC-X2 | Core 正典境界 | 照合不能時スキップ・`promotedToCore=false` 据置（SC-Q-4） |
| LC-X3 | portal build 境界 | `collectAndStub()` の showcase スタブ→`collectShowcase()` 差替え（FDQ6） |
| LC-X4 | 使い方ページ境界 | 昇格導線は `#/usage/promotion` 経由（サーバ機能なし／FR-6） |

## 従来型基盤の N/A（U2 踏襲）
- queue/cache/circuit-breaker/LB/DB は不要（静的ビルド＋静的サイト）。収集はビルド時バッチ・ビューはクライアント描画。
