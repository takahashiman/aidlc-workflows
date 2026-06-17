# U6 Showcase — Infrastructure Design Plan

> 対象 Unit: **U6 Showcase**。方針: **質問ゲート無し**（FDQ7=A で物理配置確定・U2/U5 のインフラ確定事項を継承）。
> U6 は新規インフラを足さない。U2 portal（GitHub Pages・Actions ビルド）＋ U5 収集トリガ（push/repository_dispatch/nightly）に**収集対象の追加（showcase）を相乗り**させる。

## 生成する成果物（チェックリスト）
- [ ] `infrastructure-design.md` — 実行基盤（portal build 内 collectShowcase・GitHub-hosted runner・Node LTS）／環境変数（GH_OWNER/GITHUB_TOKEN[read-only]/CORE_DS_REPO・U5 と共有）／GitHub API 権限（contents:read + issues:read）／トリガ（U5 collect と同一・push/repository_dispatch(core-released)/nightly/手動）／成果物配置（portal/scripts・portal/src・契約不変）
- [ ] `deployment-architecture.md` — データフロー（registry→単一クローラ→showcase-index.json→Pages 配信→ビュー）／rolling 反映（Core 昇格→次ビルドで promotedToCore 反映→撤去推奨）／fail-soft 配備（収集失敗で据え置き・ビルド継続）／所有境界（portal 内完結）

## インフラ確定事項（IDQ 無し・継承）
| 項目 | 決定 | 由来 |
|---|---|---|
| 実行 | portal build の一部（collectShowcase） | U5 FDQ5/8 継承 |
| runner | GitHub-hosted ubuntu・Node LTS | U2 IDQ4 |
| 配信 | GitHub Pages（Actions artifact） | U2 IDQ1 |
| トリガ | push/repository_dispatch(core-released)/nightly/手動 | U2/U5 |
| token | read-only（contents+issues）最小権限 | SEC-1 |
| 配置 | portal/scripts・portal/src（aidlc-docs 外） | FDQ7=A |
