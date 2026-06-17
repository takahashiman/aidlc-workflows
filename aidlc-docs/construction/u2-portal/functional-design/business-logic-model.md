# U2 Portal — Business Logic Model

> 技術非依存の詳細業務ロジック。確定済み回答: FDQ1-10 = すべて A。
> 対象: PT-1〜8 / US-2.1〜2.7。実装先 repo = `aidlc-workflows`（FDQ1=A、既存ポータル資産を移設）。

## 0. スコープと前提
- ポータルは **静的成果物（vanilla JS SPA）**。サーバ side のビジネスロジックを持たず、ビルド時に確定したデータ（JSON/CSS）とクライアント実行時のルーティング・描画ロジックのみで成立する。
- 入力データの「正典」は Core DS（rolling 取得）。ポータルは**読み取り専用ビュー**であり、registry/taxonomy を編集しない（編集は Core Maintainer が Core DS 側で行う）。
- 「ビルド時取り込み（FDQ5=A）」のため、rolling は **再ビルド＝最新反映** で実現する（実行時 fetch には依存しない）。

---

## 1. IA / ルーティングモデル

### 1.1 上位IA（FDQ2=A：4ルートへ再編）
| ルート | 役割 | 配下の供給源 |
|---|---|---|
| `#/overview/...` 概要 | Core DS そのもの（Foundations / Accessibility / Components / Patterns / Principles）。「最新の正解」 | 静的定義（既存 PAGES を移植・整理） |
| `#/projects/...` プロジェクト集 | 拡張製品（fig-ext-*）の一覧と Project View | **taxonomy.json 駆動**（FDQ3=A）＋ registry.json |
| `#/ops/...` 運用 | 版ダッシュボード・Showcase・昇格フロー・ガバナンス | version-matrix.json / showcase-index.json（契約消費・FDQ6=A）＋静的定義 |
| `#/usage/<topic>` 使い方 | 操作随伴ガイド（玄人最適化・再現可能手順） | UsageGuidePage 群（静的・FDQ8=A） |

> 既存の scope セレクタ（Core/Extensions/Developer）は廃し、上位4ルートに置換する（FDQ2=A）。Developer 相当は「運用」または各「使い方」に吸収。

### 1.2 ルート文法
```
route        := "#/" segment ("/" segment)*
overview     := "#/overview/" section "/" item
project      := "#/projects/" category ["/" subcategory ["/" product ["/" view]]]
ops          := "#/ops/" ("versions" | "showcase" | "promotion" | "governance")
usage        := "#/usage/" topic
view         := "component" | "page" | "demo"   // 閲覧3形態（US-2.2）
```
- 既定ルート: `#/overview/principles/vision`（既存踏襲）。未知ルートは Not-Found ビューへフォールバックし、最近接の有効祖先ルートを提案する。

### 1.3 ルーティング・アルゴリズム（PT-1 App Shell / Hash Router）
1. `hashchange` を受信 → ハッシュを `segment[]` に分解。
2. 第1セグメントで **ビュー種別を判定**（overview/projects/ops/usage）。
3. 対応するデータソースを解決（§4）し、対象ノード（page / project / ops-view / usage-topic）を lookup。
4. 見つかれば該当 View をレンダリングし、サイドナビの選択状態・パンくず・ドキュメントタイトルを同期。
5. 見つからなければ Not-Found（§6 エラー）。
6. レンダリング後、`localStorage` と URL クエリへ UI 状態（profile/version）を反映（§5、FDQ9=A）。

---

## 2. サイドナビ生成ロジック（PT-2 / US-2.1 即時到達）

### 2.1 生成方針（FDQ3=A：プロジェクト集のみ taxonomy 駆動）
- ナビツリー = **静的セクション定義**（概要/運用/使い方）∪ **動的サブツリー**（プロジェクト集）。
- 動的サブツリー生成: `taxonomy.json` を読み、`category > subcategory > product` を nav node に写像。各 product は registry.json の対応エントリ有無で「公開/準備中」を判定。

### 2.2 ナビツリー構築アルゴリズム
```
buildNav(staticSections, taxonomy, registry):
  tree = clone(staticSections)            // 概要/運用/使い方の固定枝
  projectsBranch = []
  for cat in taxonomy.categories (sorted by order, then name):
    catNode = node(cat)
    for sub in cat.subcategories:
      subNode = node(sub)
      for prodRef in sub.products:
        entry = registry.find(prodRef.id)
        prodNode = node(prodRef, status = entry ? "published" : "pending")
        subNode.children.push(prodNode)
      catNode.children.push(subNode)
    projectsBranch.push(catNode)
  tree.insertUnder("projects", projectsBranch)
  return tree
```

### 2.3 即時到達の規則（US-2.1 AC1）
- 任意の葉ノードは **その route を直接アンカーに持つ**（中間ノード経由のクリック連打を不要にする）。
- 検索/絞り込み（任意）でも、結果は葉 route への直接リンクを返す。
- 「最小クリック」= 葉まで最大 (区分1) + (category) + (subcategory) + (product) の階層展開で到達。深さは taxonomy の階層に一致させ、人工的な中間ページを挟まない。

---

## 3. 閲覧3形態の描画ロジック（PT-4 Project View / US-2.2）

### 3.1 形態定義（FDQ4=A）
| view | 内容 | 供給源 |
|---|---|---|
| `component` | コンポーネント単体（カタログ的に1部品を表示） | registry エントリの `previewPath`（単体 preview）。拡張未整備時は **Core DS preview を暫定ソース** |
| `page` | 複数部品で構成された画面・ページ遷移例 | registry エントリの `pagePreviewPath` / 複数 preview の順送り |
| `demo` | 動作するデモ画面 | registry エントリの `demoUrl` を **iframe 埋め込み**（ADQ2=A） |

### 3.2 描画アルゴリズム
```
renderProjectView(project, view):
  entry = registry.find(project.id)
  if !entry: return PendingView(project)              // 準備中（§6）
  switch view:
    component: renderPreview(entry.previewPath)
    page:      renderPreview(entry.pagePreviewPath ?? entry.previewPath)
    demo:      if entry.demoUrl: renderIframe(entry.demoUrl, sandboxed)
               else:            renderFallbackLink(entry)   // FDQ4 注: デモ未整備時
```
- iframe は **同一プロファイル/版コンテキストを query で伝播**（profile, coreVersion）し、デモ側が同じ Core 表示になるよう整合。
- 暫定期（拡張 repo 不在）は、`projects` 直下に Core DS 自身を「リファレンス実装」として 1 エントリ提示し、3形態とも Core preview を指す（鶏卵回避・§7と連動）。

---

## 4. データソース契約とロード（PT-7 Metadata Reader / rolling）

### 4.1 データソース一覧（契約）
| データ | 由来 | 生成者 | U2 での扱い |
|---|---|---|---|
| `taxonomy.json` | Core DS（正典） | Core Maintainer(U1) | rolling 読込（ナビ駆動） |
| `registry.json` | Core DS（正典） | Core Maintainer(U1)/AI登録PR(U3) | rolling 読込（Project 解決） |
| Core トークン/コンポーネント CSS | Core DS | U1 | rolling 取込（バンドル） |
| `version-matrix.json` | CI 収集 | U5(CI-3) | **U2 がスキーマ確定**・スタブ消費（FDQ6=A） |
| `showcase-index.json` | CI 収集 | U6(CI-4) | **U2 がスキーマ確定**・スタブ消費（FDQ6=A） |
| UsageGuidePage 群 | ポータル内 | U2 | 静的同梱 |

### 4.2 rolling 取込アルゴリズム（FDQ5=A：ビルド時取り込み）
```
buildPortal():
  core = resolveCore(strategy = "latest-tag" || "core-HEAD")   // pin しない
  copy(core.tokens, core.componentsCss) -> portal/vendor/core/
  copy(core.registry, core.taxonomy)     -> portal/data/
  validate(registry, taxonomy)            // §below 整合検査
  bundle()
  // デプロイ（GitHub Pages）。Core 更新時は再ビルドで最新反映＝rolling
```
- **rolling 不変条件**: ポータルは Core を **バージョン pin しない**。`coreVersionDisplayed` は「ビルド時に取り込んだ実際の Core 版」を表示用に記録するだけで、参照を固定する意味は持たない。
- VRT（US-2.3 AC2 / US-4.2）は U5 の責務だが、U2 はビルド出力が VRT 可能な静的構成（決定的レンダリング）であることを満たす。

### 4.3 整合検査（ビルド時バリデーション）
- registry の各 product が taxonomy のいずれかの subcategory に属すること（孤児禁止）。
- taxonomy の product 参照が registry に無い場合は `status=pending`（エラーではなく準備中表示）。
- registry エントリの必須キー（id, name, category, repoUrl, coreVersion）の存在検査。欠落はビルド警告。

---

## 5. クライアント UI 状態モデル（FDQ9=A）

### 5.1 状態項目
| 状態 | 既定 | 永続先 | 共有 |
|---|---|---|---|
| `profile`（Web-Admin/Consumer/Terminal） | Web-Admin（ポータル既定） | localStorage + URL query | URL で共有可 |
| `coreVersionLabel`（表示用） | ビルド取込版 | localStorage | URL で共有可 |
| 現在 route | – | URL hash | URL で共有可 |
| ナビ展開状態 | route から復元 | （導出・非永続） | – |

### 5.2 状態解決順序（再現性）
1. URL（hash + query）が最優先（共有リンクを開いた相手が同じ表示になる）。
2. URL に無い項目は localStorage から復元（再訪時の継続）。
3. どちらも無ければ既定値。
- 変更時は URL と localStorage の双方へ書き戻す（双方向同期）。

---

## 6. 空状態・エラーハンドリングのロジック
| 状況 | 挙動 |
|---|---|
| 未知 route | Not-Found ビュー＋最近接有効祖先への誘導 |
| product が registry 未登録（pending） | 「準備中」ビュー（taxonomy 上は見えるが内容無し）。鶏卵回避の文脈を表示 |
| `demoUrl` 不在 | デモ形態をフォールバック（リンク/「デモ準備中」）。component/page は preview で成立 |
| version-matrix/showcase が空/欠落 | 空状態ビュー（「収集待ち（U5/U6）」）。クラッシュしない |
| Core データ読込失敗（ビルド時） | ビルド失敗（fail-fast）。実行時 fetch に依存しない（FDQ5=A）ため実行時の取得失敗は原則発生しない |

---

## 7. ドッグフーディング / 鶏卵回避フロー（PT-6 連動 / US-2.5・FDQ7=A）

### 7.1 状態遷移（仮パーツのライフサイクル）
```
[必要発生] --(Coreに無い)--> [仮パーツ作成: Extensions層に実装]
   |                                   |
   |                          (専用ラベルIssue自動起票: temp-part)
   v                                   v
[ポータルで"仮パーツ"明示マーキング表示] --(昇格検討)--> [core-promotion Issue]
   |                                                          |
   |                                              (Core昇格・リリース)
   v                                                          v
[rolling で最新Core取得] --(撤去判定OK)--> [仮コード撤去・マーキング解除]
```

### 7.2 判定ロジック
- **仮パーツ表示判定**: showcase-index/registry エントリに `temp:true` または `kind:"temp-part"` を持つものは UI 上で「仮パーツ」バッジを付す。
- **撤去判定（撤去可能か）**: 当該パーツ名が Core DS の registry に `kind:"core"` として出現したら「Core 昇格済み → 撤去推奨」を提示。
- Issue 自動起票（temp-part / core-promotion）のトリガ条件は business-rules に明文化。実起票機構（CI）は U5 が担うが、U2 は **起票テンプレと条件・ポータル側の導線**を設計に含める（FDQ7=A）。

---

## 8. 使い方ページのロジック（PT-8 / US-2.7・FDQ8=A）
- UsageGuidePage は独立エンティティ。各操作箇所（セットアップ/昇格提案/版確認/フィードバック等）は `#/usage/<topic>` への導線を**必ず**持つ（業務規則: business-rules §使い方必須）。
- 玄人最適化: メインビューは一面完結（要点のみ）、詳細 how-to は使い方ページへ遷移して分離。
- 表現はツール非依存テンプレ「目的 → 前提 → 手順（抽象ステップ）→ 確認」。各チーム標準の Git ツール/AI アシスタントに読み替え可能な抽象度を保つ。

---

## 9. 既存 JS 資産の責務分界（FDQ10=A）
| 資産 | U2 での扱い |
|---|---|
| `portal.js` / `portal-content.js` / `portal.css` | U2 の中核。移設＋IA再編（§1）・taxonomy 駆動化（§2）の対象 |
| `ai-co-creation.js`（Interactive Prompt Generator） | **U3(TM-2) 管轄**。U2 では現状維持（壊さない）。使い方ページから導線のみ |
| `feedback.js` | U2 の「使い方/運用」導線として再評価（昇格提案・仮パーツ起票 UI の母体候補） |

---

## 10. ストーリー → ロジック対応表
| Story | 主担当ロジック |
|---|---|
| US-2.1 即時到達 | §2 ナビ生成・葉直リンク |
| US-2.2 閲覧3形態 | §3 Project View |
| US-2.3 rolling | §4.2 ビルド時取込・rolling 不変条件 |
| US-2.4 3区分IA＋使い方 | §1 IA・§8 使い方 |
| US-2.5 ドッグフーディング | §7 仮パーツライフサイクル |
| US-2.6 Pages 公開 | §4.2 build→deploy（詳細は infrastructure-design で） |
| US-2.7 操作随伴ガイド | §8 UsageGuidePage |
