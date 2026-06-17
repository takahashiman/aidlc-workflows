# U4 Migration — Business Logic Model

> 確定回答: FDQ1-8 = すべて A。対象ストーリー US-3.5 / US-3.6 / US-4.5。
> 移行対象の代表 = **busapp**（`extensions/busapp`: Card/Button/FAB/TextField + 三層トークン・JSX 実装）。
> 本書は技術非依存の振る舞いモデル（フロー・状態機械・判定アルゴリズム・ラッパー寿命）。

## 0. スコープと位置づけ
U4 は「Core 導入**前**の既存資産を、`fig-ext-<category>-<product>` として取り込み、画面単位で Core `.fig-*` 化し、定量基準で『移行完了』に到達させる」までのプロセスを定義する。新規製品の立ち上げ（U3）とは入口が異なる（既存資産が起点）が、**セットアップ以降の導線（init.mjs/CorePin/RegistryPR/ScopeManifest）は U3 を再利用**する。

```
[既存製品 (busapp)] ──(BLM-1 取り込み)──▶ fig-ext-<cat>-busapp (U3 template 派生)
        │                                          │
   LegacyAsset[]                              CorePin + ScopeManifest + RegistryPR
        │                                          │
        └──(BLM-2 ComponentMapping)──▶ Core `.fig-*` 写像表
                                                   │
                              (BLM-3 段階移行: 画面=原子単位の状態機械)
                                                   │
                              (BLM-4 完了判定: 主要フロー100% ∧ 全体≧80%)
                                                   │
                              (BLM-5 ラッパー/エイリアス寿命) (BLM-6 進捗マニフェスト収集)
```

---

## BLM-1. 取り込みフロー（既存 → 拡張 repo 化）— FDQ1=A / US-3.5
既存 busapp を U3 の `fig-ext-template` から派生して repo 化し、既存資産を移植する。U3 の `SetupRunbook`（derive→duplicate→apply→pin→wire-ci→register→verify）に **移植（migrate-in）** ステップを差し込む。

| 順 | ステップ | 内容 | 産物 |
|---|---|---|---|
| 1 | derive | 既存 `busapp/project-settings.json` を読み、不足項目（category/subcategory/coreVersion）を補完して新 `project-settings.json` を確定 | ProjectSettings |
| 2 | duplicate | `fig-ext-template` から `fig-ext-<cat>-busapp` を複製（GitHub Template） | ExtensionRepo 雛形 |
| 3 | **migrate-in** | 既存資産（components/tokens/preview/README）を `legacy/` 隔離領域へ取り込み、LegacyAsset として棚卸し | LegacyAsset[] |
| 4 | apply | project-settings 駆動で signature/profile/表示名を適用（U3 の変数置換） | テーマ適用 |
| 5 | pin | Core を submodule で pin ＋ `CORE-DS-VERSION` 記載 | CorePin |
| 6 | wire-ci | 三層 Lint/VRT/version チェック雛形を配線（U5 参照） | CI |
| 7 | register | registry へ登録 PR（CI-5＋Maintainer） | RegistryPR |
| 8 | baseline | 移行マニフェストを初期化（全画面棚卸し・移行率0%・critical flows 宣言） | MigrationManifest |
| 9 | verify | 必須値/pin/CI/registry/マニフェストの存在を検証（冪等） | verify report |

- **冪等性**: U3 init.mjs と同様、再実行で壊れない。migrate-in は既取り込み資産を二重取り込みしない（ハッシュ突合）。
- **legacy/ 隔離**: 旧実装は最初 `legacy/` に隔離し、画面移行が進むたび参照を Core 化して `legacy/` 依存を減らす。`legacy/` が空＝コード的移行完了の目安。

---

## BLM-2. 整合化ロジック（busapp JSX → Core `.fig-*`）— FDQ2=A / US-4.1
Core は CSS クラス方式（`.fig-*`、JSX なし）。移行は**「見た目・トークンを Core クラスへ全面委譲し、JSX は薄い presentational ラッパーに留める」**。

### 写像の原則
1. **クラス委譲**: 旧コンポーネントの視覚定義（色/間隔/角丸/影/状態）を Core `.fig-*` クラスへ置換。JSX は `className="fig-button fig-button--primary"` のようにクラスを付与するだけ。
2. **トークン単一化**: 製品固有の生 CSS・独自トークンは廃し、Core semantic トークン（`--fig-*`）経由に統一（生 hex/px 直書き禁止＝三層ガードレール US-4.1）。
3. **API 保存**: 旧 JSX の props インターフェイス（例 `<Button variant size onClick>`）は維持し、内部実装のみ Core クラスに差し替える（呼び出し側の改修最小化）。
4. **profile 継承**: ルートに `.fig-profile-*`（busapp の既定 profile）を付与し、デバイス最適化を Core に委譲。

### busapp の具体写像（代表）
| 旧 (busapp JSX) | Core 写像 | 備考 |
|---|---|---|
| `Button.jsx`（独自 CSS） | `.fig-button` + variant/size 修飾子クラス | props→クラスのマッピング表で表現 |
| `Card.jsx` | `.fig-card`（＋必要なら slot 構造） | 生トークン→semantic 置換 |
| `TextField.jsx` | `.fig-input`（label/help/error 状態クラス） | a11y 属性は維持 |
| `FAB.jsx` | Core に **FAB あり**（existing-code 由来）→ `.fig-fab`／無ければ Extensions 層へ（BLM-5b） | Core 正典確認が前提 |

> ⚠️ **Core 正典との突合が前提**: 各旧部品が Core 正典24（registry/taxonomy）に存在するか照合。存在＝写像、不在＝ExtensionPart（BLM-5b）。FAB は existing-code カタログに存在するため Core 側の採否を要確認。

### 整合化の単位
写像は**コンポーネント単位**で行うが、移行『完了』判定は**画面単位**（BLM-3）。コンポーネントを写像しただけでは画面は移行済みにならない（画面内の全部品が Core 化されて初めて移行済み）。

---

## BLM-3. 段階移行の状態機械（画面＝原子単位）— FDQ3=A / US-3.6 AC1
移行の原子単位は **画面（route/page）**。「画面内 100% Core 適応」を満たして初めて『移行済み画面』。

### ScreenMigrationState（画面の状態遷移）
```
  NOT_STARTED ──▶ IN_PROGRESS ──▶ MIGRATED
       ▲              │ (旧実装が1つでも残る)
       └──────────────┘ (回帰検出/VRT赤で差し戻し)
```
| 状態 | 定義 | 判定 |
|---|---|---|
| `NOT_STARTED` | 画面が旧実装のみ | Core クラス0% |
| `IN_PROGRESS` | 一部 Core 化、旧実装残存 | **混在＝未移行（NG 扱い）** |
| `MIGRATED` | 画面内の全 UI が Core `.fig-*`/Core 由来（Extensions層含む）で構成・VRT グリーン | 混在ゼロ ∧ 三層 Lint 緑 ∧ VRT 緑 |

### 不変条件（混在禁止＝US-3.6 AC1）
- **BR で強制**: 1画面内に旧実装と Core 実装が同居する状態は『移行済み』を名乗れない。`IN_PROGRESS` は作業途中状態であり、リリース上は許容されるが『移行率』にカウントしない。
- **画面間**: 異なる画面の間では新旧併存を**移行期限内で許容**（MigrationProject の `migrationDeadline` まで）。期限超過は CI 警告。

### 移行の進め方（推奨手順）
1. critical flows の画面を優先キューに。
2. 1画面を選び、画面内の全部品を BLM-2 で Core 化（部分置換で止めない）。
3. VRT で視覚回帰を確認 → グリーンで `MIGRATED`。
4. マニフェスト更新（BLM-6）。

---

## BLM-4. 完了判定アルゴリズム（二指標ゲート）— FDQ4=A / US-3.6 AC2
```
INPUT:  screens[]            // 各 ScreenMigrationState
        criticalFlows[]      // MigrationProject 宣言の主要フロー（画面集合）
COMPUTE:
        criticalScreens = ⋃ criticalFlows[].screens
        criticalDone    = all(s ∈ criticalScreens : s.state == MIGRATED)
        overallRatio    = count(state==MIGRATED) / count(screens)
GATE (移行完了):
        criticalDone == true   AND   overallRatio >= 0.80
OUTPUT: MigrationChecklist（生成物・機械可読＋人可読）
```
- **二条件 AND**: 主要フロー 100%（`criticalDone`）と全体 ≧80%（`overallRatio`）の**両立**で初めて『移行完了』。片方のみでは未完。
- **critical flows の宣言**: MigrationProject のメタデータ（移行マニフェスト）で明示宣言。曖昧さを排除。
- **自動算出**: 移行済み画面集合から自動計算。U5 の version 収集と同じクローリング基盤で実行（手動チェック排除）。
- **チェックリストは生成物**: 人手で埋める表ではなく、状態から導出して出力。

---

## BLM-5. Core 未満パーツ ＆ 後方互換ラッパー

### BLM-5a. CompatibilityWrapper / エイリアス（寿命管理）— FDQ6=A / US-4.5 AC1
二種類のラッパーを区別する。
| 種別 | 所在 | 目的 | 寿命 |
|---|---|---|---|
| **Core エイリアス** | Core(U1) 側 | Core の普遍化（改名等）で旧名→新名を一定期間提供 | Core が `deprecatedSince`/`removeBy` を宣言（既存 alias 機構流用） |
| **製品移行ラッパー** | 製品 repo 側 | 移行期に旧 API（旧 JSX props）を新 Core 実装へ橋渡し | **移行完了で削除**。`deprecatedSince`/`removeBy` 必須 |

- **期限メタ必須**: 各ラッパー/エイリアスに `deprecatedSince`（導入日）と `removeBy`（撤去期限）を必須付与。
- **CI 警告**: `removeBy` 超過のラッパーが残存すると CI 警告（U5）。移行マニフェストにも期限超過フラグ。
- **可逆性**: ラッパー経由で旧呼び出しを維持しつつ内部を Core 化 → 段階移行を安全に進められる（呼び出し側を後追いで撤去）。

### BLM-5b. ExtensionPart（Core 未満の独自/仮パーツ）— FDQ5=A / US-2.5
busapp 固有で Core 正典24 に無い部品。
- **配置**: 製品 repo の **Extensions 層（`extensions/` 配下）**。製品内の正規層として扱う。
- **移行判定上の扱い**: Extensions 層の部品で構成された画面も『Core 適応』とみなす（鶏卵回避・US-2.5 と一貫）。
- **Showcase 収集**: `core-promotion` ラベル/所定ディレクトリで Showcase(U6) に自動収集 → Core 還元は昇格フロー（US-4.4）に乗せる。
- **昇格後**: Core に昇格したら Extensions 層のローカル実装を撤去し、rolling/pin 更新で Core 版へ切替（US-2.5 AC3 と同型）。

---

## BLM-6. 進捗マニフェスト ＆ 収集（単一の真実源）— FDQ8=A
製品 repo に機械可読な **移行マニフェスト**（`migration-manifest.json` 想定）を置き、U5 の version 収集と同じクローリングでポータル運用ビュー（U2）に集約。
| フィールド | 内容 |
|---|---|
| `screens[]` | 画面 id・state・所属フロー・残存旧部品数 |
| `criticalFlows[]` | 主要フロー宣言（画面集合） |
| `overallRatio` / `criticalDone` | BLM-4 の算出結果 |
| `completed` | 移行完了ゲートの真偽 |
| `wrappers[]` | ラッパー/エイリアスと `deprecatedSince`/`removeBy`・期限超過フラグ |
| `extensionParts[]` | Core 未満パーツ（Showcase 連携） |
| `coreVersion` | 参照 Core 版（registry エントリと紐付け） |

- **収集の一元化**: ビルド時クローリングで集約（手動入力なし）。registry エントリと結合して「製品×Core版×移行率」を一覧化。
- **読み手**: Core Maintainer（移行進捗監視）・移行担当（残作業把握）・閲覧者（運用ビュー）。

---

## BLM-7. MigrationGuide（MAJOR 追従）— FDQ7=A / US-4.5 AC2
Core の MAJOR リリースに構造化移行ガイドを必須添付（§domain-entities MigrationGuide）。製品 repo は `CORE-DS-VERSION` の MAJOR 更新時、ガイド参照を移行チェックリストの必須項目に組込む（参照未消化なら完了ゲートを通さない）。

---

## ストーリー網羅
| Story | 反映箇所 |
|---|---|
| US-3.5 既存取り込み | BLM-1（migrate-in / legacy 隔離 / U3 導線再利用） |
| US-3.6 段階移行・完了判定 | BLM-3（画面=原子・混在禁止）・BLM-4（二指標ゲート） |
| US-4.5 マイグレーション方針 | BLM-5a（エイリアス/ラッパー寿命）・BLM-7（MAJOR ガイド） |
| US-2.5（鶏卵回避・横断） | BLM-5b（ExtensionPart/Showcase） |
