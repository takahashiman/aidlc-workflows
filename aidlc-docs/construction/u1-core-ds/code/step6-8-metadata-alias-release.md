# U1 Code — Step 6-8: メタデータ・エイリアス・リリース基盤（要約）

コミット: `6b5a6fc feat(core): メタデータ・エイリアス・リリース基盤を追加`（core ブランチ）

## Step 6 — メタデータ（正典）
- `registry.json`: 拡張登録簿（`projects: []` 初期、スキーマ説明付き）。新規拡張の auto-PR ターゲット（US-3.2）
- `taxonomy.json`: 分類階層（初期カテゴリ＝バス＞バスロケーションシステム / タクシー / 物流＞iMESH）。サイドナビ・スコープ分離の単一正典（FQ1=A）

## Step 7 — 後方互換エイリアス（BR-7 / NFR P5）
- `deprecated-aliases.css`: 旧名→新名エイリアス層の雛形（v1.0.0 起点・現状空）。改名時に `@deprecated`＋削除予定MAJORを明記して追記

## Step 8 — リリース基盤（US-1.4）
- `cliff.toml`: git-cliff 設定（Conventional Commits → グループ化。feat=MINOR/fix=PATCH/BREAKING=MAJOR）
- `CHANGELOG.md`: 初期化（Unreleased に整理作業を記載）
- `.github/workflows/release.yml`: `v*.*.*` タグ push 時に git-cliff で CHANGELOG 生成＋GitHub Release 作成（actions はバージョン pin、SECURITY-10 配慮）

## 残（U1）
- Step 5（〜28部品拡充）、Step 9（CIフック=U5と整合）、Step 10（README更新）
- Phase 1b（push＋GitHubデフォルトブランチ変更）
