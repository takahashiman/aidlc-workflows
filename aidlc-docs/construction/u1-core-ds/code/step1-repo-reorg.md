# U1 Code — Step 1: リポジトリ整理（要約）

## 実施（Phase 1a・ローカル・可逆）
- バックアップ tag: `backup/pre-reorg-main`(6f36074) / `backup/pre-reorg-master`(9ee445a)
- `core` ブランチを `origin/master`(9ee445a) 起点で作成 → Core 実体を作業ブランチ化
- **fig-core 自己参照 submodule(c263831) を解体**（deinit＋`git rm`＋`.gitmodules` 削除）→ 二重ネスト解消
- **`extensions/busapp` を Core から分離**（`git rm`。内容は backup/origin に保全、後日 `fig-ext-bus-*` へ移設）
- 旧 main の空 `existing-code` 残骸を除去
- コミット: `dc9cd69 chore(core): Core DS 正規化 — fig-core二重ネスト解消・busapp分離`

## 整理後の Core DS 構成（core ブランチ）
```
primitives.css / semantic.css
tokens/ (base.css, components.css, profile-admin.css, profile-consumer.css, profile-terminal.css)
components/ (10 spec.md)
extensions/template
preview/ patterns/ storybook/ assets/ screenshots/ uploads/
README.md SKILL.md component-contract.md design-system.md accessibility-guidelines.md ほか
```

## 保留（Phase 1b・リモート・不可逆／別途確認）
- [ ] `git push -u origin core`
- [ ] GitHub UI で**デフォルトブランチを `core` に変更**（ユーザー操作）
- [ ] busapp 移設完了後に旧 `main`/`master` を整理

## 重要な発見（brownfield 再利用）
master に既に **三層トークン・3プロファイルCSS・template・component spec** が存在。Step2〜5 は「新規生成」ではなく **既存の採用・整備・補完**が主。
