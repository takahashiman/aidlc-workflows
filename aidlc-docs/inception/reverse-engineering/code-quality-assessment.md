# Code Quality Assessment

> Reverse Engineering 成果物 — 既存資産の品質・技術的負債

## Test Coverage
- **Overall**: None（デザイン資産側に自動テストなし）
- **Unit Tests**: なし
- **Integration Tests**: なし
- 方針: 旧 project-settings.json は「手動視覚確認（Live Preview）優先、CI は最小限」

## Code Quality Indicators
- **Linting**: 大元（ポータル）は整備（markdownlint, pre-commit, semgrep 等）。デザイン資産側は未整備
- **Code Style**: 三層アーキテクチャ・インラインスタイル禁止の規律は文書化済み（実コードでの遵守度は未検証）
- **Documentation**: 良好〜過多（spec.md, 各種ガイド、project-settings.json が充実）。一方で散在による不整合あり

## Technical Debt（再設計で解消すべき項目）
1. **コンポーネント spec の散在/重複** — master:10件 / existing-code:約28件（重複含む）/ busapp:実装4件。正典が未確定（`component-inventory.md` 参照）
2. **2系列同居（main/master 無関係履歴）** — FIG-UDS.git 内でブランチが分裂、参照混乱の温床
3. **自己参照 submodule（fig-core）による二重ネスト** — `dependencies.md` 参照
4. **バージョン管理の不在** — SemVer タグ未採用、参照バージョンの可読な追跡不可
5. **スコープ分離の未実装** — 製品単位独立 repo 化が未完
6. **既存プロジェクト取り込み導線の不在** — Core 導入前資産を格納するフローが未定義

## Patterns and Anti-patterns
- **Good Patterns**:
  - 三層アーキテクチャ（Primitive/Semantic/Component）の明確な思想
  - CSS Custom Properties によるプロファイル上書き方式
  - submodule による中央配布の意図
  - ディレクトリ単位複製（extensions/[project]）の再利用戦略
- **Anti-patterns**:
  - 同一リポジトリへの無関係2系列同居（main/master）
  - 自己参照 submodule（fig-core）
  - 正典の多重化（spec の散在）
  - バージョン pin がコミットハッシュのみで可読性低
