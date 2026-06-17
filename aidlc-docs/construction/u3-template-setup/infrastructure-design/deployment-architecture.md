# U3 Template & Setup — Deployment Architecture

> 確定回答: IDQ1-5 = すべて A。「派生 → セットアップ → 登録 PR」の運用アーキ。

## 1. 全体フロー
```
[fig-ext-template (GitHub Template Repository)]
        │ "Use this template"（US-3.1）
        ▼
[新規製品 repo: fig-ext-<category>-<product>]
        │ ① Interactive Prompt Generator（tools/prompt-generator）
        │    → project-settings.json ＋ セットアッププロンプト
        │ ② AI エージェントが SetupRunbook 実行（SKILL/AGENTS）
        │    scripts/init.mjs（dry-run→apply・冪等）
        │      - signature/profile/版/表示名 適用
        │      - Core submodule pin ＋ CORE-DS-VERSION
        │      - CI 雛形 有効化（U5 参照）
        ▼
[register.yml] --最小権限/App, cross-repo PR--> [Core DS registry.json (+ taxonomy.json)]
        ▼
[CI: U5/CI-5 登録検査] + [Maintainer レビュー] → マージ
        ▼
[ポータル(U2) が rolling で registry/taxonomy 反映 → サイドナビ/版ダッシュボードに出現]
```

## 2. 環境
| 環境 | 用途 |
|---|---|
| Template Repository | 雛形の単一供給源（GitHub Template） |
| 製品 repo（派生先） | 製品開発・CI・デモ公開（Pages） |
| Core DS repo | registry/taxonomy 正典（PR 受け） |
| Local | `scripts/init.mjs` をオフライン実行（dry-run/apply） |

## 3. トリガ
| 契機 | 動作 |
|---|---|
| Template 複製 | 新製品 repo 作成（三層/CI/submodule 枠込み） |
| セットアップ実行（手動/`workflow_dispatch`） | init.mjs 適用＋pin＋CI 配線 |
| セットアップ完了 | register.yml が Core へ registry PR 起票 |
| Core リリース | 製品は pin（追従は意図的更新）。ポータルは rolling |

## 4. 冪等性・検証・ロールバック
- init.mjs は冪等（再実行で破壊しない）。`--dry-run` で差分プレビュー（REL-3）。
- 完了検証: 必須値・pin 整合・CI 配線・registry PR の存在（REL-2）。
- ロールバック: PR 未マージなら閉じる／submodule pin を前コミットへ戻す。

## 5. コスト / 運用
- GitHub Template＋Actions＋submodule のみ。追加インフラコストなし。
- 運用は「PR レビュー（Maintainer）」と「pin 整合 CI」に集約。

## 6. 要ユーザー操作（GitHub 側）
- [ ] `fig-ext-template` を実 repo 化し **Template Repository 設定**を有効化
- [ ] registry PR 用の最小権限トークン/GitHub App を発行・Secrets 登録
- [ ] Core DS repo のブランチ保護＋ registry/taxonomy のレビュールール（Maintainer 必須）
- [ ] （実体作業は本 Unit Code Generation で雛形を scaffold 済み／GitHub 化は手動）
