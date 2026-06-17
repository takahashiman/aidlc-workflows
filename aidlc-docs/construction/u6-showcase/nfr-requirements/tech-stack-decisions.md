# U6 Showcase — Tech Stack Decisions

> 確定: FDQ1-7 全A。U6 は新規スタックを足さず、U5 クローラ基盤と U2 portal ビュー基盤を再利用する。

| TSD | 決定 | 根拠 |
|---|---|---|
| **TSD-1 収集基盤** | U5 `portal/scripts/collect-versions.mjs` の**単一クローラ基盤を拡張**（`collectShowcase()` 追加・同一走査） | BR-CI-1CRAWL / FDQ1=A / 二重実装回避 |
| **TSD-2 データ源** | **GitHub API**（`contents`=`extensions/` 列挙 / `issues?labels=temp-part`）。チェックアウト不要・**read-only token** | US-5.1 AC1 / SEC-1 / FDQ2=A |
| **TSD-3 駆動** | **registry.json 駆動**（登録製品のみ走査）。`ownerProjectId` の単一正典 | BR-SC-SRC-2/OWNER / FDQ3=A |
| **TSD-4 昇格照合** | Core 正典（`CORE_DS_REPO` registry/コンポーネント一覧）と名前正規化照合で `promotedToCore` | BR-SC-PROMOTED / FDQ4=A |
| **TSD-5 ビュー** | portal **vanilla JS**（既存 `renderShowcase()` を実データ駆動化・新フレームワーク無し） | U2 ADQ1 / FDQ5=A |
| **TSD-6 契約** | **`showcase-index.schema.json` 不変**で充足（U2 確定） | BR-SC-CONTRACT / FDQ7=A |
| **TSD-7 耐障害** | **fail-soft**（個別 skip・全体失敗で据え置き）。U5 REL-3/4 規約継承 | BR-SC-FAILSOFT / FDQ6=A |
| **TSD-8 配線** | `build.mjs` の showcase スタブ生成を `collectShowcase()` 呼出へ差替え（version 収集と同一箇所） | FDQ6=A |
| **TSD-9 実行環境** | **GitHub-hosted runner・Node LTS**（U2/U5 と同一・追加依存ゼロ志向） | U2/U5 継承 |
| **TSD-10 セキュリティ** | 描画時エスケープ（`esc()`）・iframe sandbox/SRI/CSP（U2 継承）・最小権限トークン | SEC-1〜4 |

## 非選択（明示的に採らない）
- 各 repo への showcase 専用マニフェスト必須化（FDQ3=B）→ 改修負荷・陳腐化で不採用。
- 独立 showcase クローラ新設（FDQ1=B）→ BR-CI-1CRAWL に反するため不採用。
- ビューへの Issue 起票フォーム埋め込み（FDQ5=B）→ 静的 Pages・サーバ機能なしで不採用、使い方ページ経由。
- 外部 VRT/スクショ SaaS への依存 → U2/U5 の自己ホスト方針と不整合で不採用。
