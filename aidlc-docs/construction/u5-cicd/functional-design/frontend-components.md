# U5 CI/CD Automation — Frontend Components

> 確定: FDQ1-8 全 A。U5 は **CI 基盤中心の Unit で固有 UI を持たない**。提供するのは portal（U2）運用ビューへの**入力契約の充足**と、収集失敗時の空状態/fallback 契約のみ。
> 関連: [domain-entities.md](domain-entities.md)（VersionMatrixEntry/MigrationManifest）、[business-rules.md](business-rules.md)（BR-CI-CRAWL）。

---

## 1. U5 が UI を持たない理由
U5 の成果は ①各 repo の CI ジョブ（Lint/VRT/registry 検査）と ②収集クローラ（version/migration）。表示する画面は **portal（U2）が既に実装済み**で、U5 はその**入力データ契約を満たす**役割。CI 結果自体は GitHub の PR チェック UI（required check / PR コメント / アーティファクト）で提示され、独自フロントは作らない。

---

## 2. portal 版ダッシュボード（PT-5）への入力契約 — CI-3
U5 の `collect-versions.mjs` が生成し、portal が読む。
- **契約ファイル**: `portal/data/version-matrix.json`（U2 スタブを実体収集に差替え）
- **スキーマ**: `portal/schema/version-matrix.schema.json`（U2 確定・変更しない）
- **充足項目**: `entries[]`＝`projectId / projectName / coreVersionPinned / coreVersionLatest / status / source / collectedAt`、トップに `collectedAt`・`_generatedBy: "collect-versions (U5/CI-3)"`
- **表示ロジック（portal 側・既存）**: `status` で色分け（up-to-date/behind/unknown）。U5 は値を埋めるだけで描画ロジックは変更しない。

## 3. portal 移行進捗ビューへの入力契約 — FDQ6（U4 BR-VIS-2 履行）
- **契約ファイル**: `portal/data/migration-index.json`（同一クローラ生成）
- **内容**: 各製品の `{projectId, migratedScreens/totalScreens, criticalFlowComplete, ratio, completed, wrapperDeadlines[]}` 要約（MigrationManifest からの抽出）
- registry エントリと `projectId` で紐付け、運用ビューで version-matrix と並置。

## 4. showcase 契約（U6 へ前送り・参考）
`showcase-index.json` の収集は **U6 の責務**（CI-4）。U5 はクローラ基盤（registry 駆動・同一走査）を提供し、U6 が同基盤を拡張する想定（[business-logic-model](business-logic-model.md) §4）。U5 では実装しない。

---

## 5. 空状態 / fallback の入力契約（BR-CI-CRAWL-5 fail-soft）
収集の頑健性を portal の表示品質に直結させる規則：
| 状況 | U5 出力 | portal 表示（既存挙動を尊重） |
|---|---|---|
| registry 空 | `entries: []` | 「登録製品なし」空状態 |
| 個別 repo 取得失敗 | 当該 entry を `status: "unknown"` / `source: "unknown"` | 当該行のみ unknown 表示・他行は正常 |
| pin 未設定（未 GitHub 化） | `coreVersionPinned: null` 相当→`unknown` | unknown（移行前製品を壊さない） |
| 収集全体失敗 | 直近の version-matrix.json を据え置き（上書きしない） | 最後に成功した版を表示・`collectedAt` で鮮度提示 |

- **原則**: 収集は **fail-soft**。portal ビルドを fail-fast にしない（版ダッシュボードの可用性 > 完全性）。これは U2 NFR（build fail-fast＋空状態/fallback）と整合し、収集系のみ soft 扱い。

---

## 6. CI 結果の提示面（GitHub ネイティブ・新規 UI なし）
| CI | 提示面 |
|---|---|
| CI-1 Lint | PR の required check（失敗時 `LintViolation` を job log/annotation に出力） |
| CI-2 VRT | required check ＋ 差分画像アーティファクト ＋ PR コメント |
| CI-5 registry 検査 | registry PR の required check ＋ 失敗注記 |

U5 は上記いずれにも独自フロントエンドを追加しない（GitHub の標準 UI を活用）。
