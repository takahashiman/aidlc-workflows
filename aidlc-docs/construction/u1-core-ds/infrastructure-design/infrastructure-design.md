# U1 Core DS — Infrastructure Design

> Core DS は git 中心の「配置」。クラウド計算/ストレージ/通信は N/A。

## リポジトリ確立（IDQ1=A：既存をリブランド/整理）
**対象**: `takahashiman/FIG-Universal-Design-System.git` を **FIG Core DS の正典リポジトリ**として整理。

### 整理タスク（Code Generation/実作業で実施）
1. **Core 内容（現 master 9ee445a）をデフォルトブランチに昇格**（Core を main/既定に）
2. **無関係系列の解消**: main(6f36074) の `extensions/busapp` を **`fig-ext-bus-*`（U3/U4）へ移設**。AI-DLC docs は本ポータル(aidlc-workflows)で管理済みのため重複を排除
3. **二重ネスト解消**: `fig-core` 自己参照 submodule(c263831) を解体し、内容を Core 本体に取り込み or 廃棄（既に master 系に push 済みの内容を正規化）
4. **ブランチ戦略**: 単一の既定ブランチ（Core）＋ Contribution PR ルール（`feat/core/*`, `fix/core/*`, `refactor/tokens/*` 等）

> ⚠️ 破壊的整理のため、実作業前に現状ブランチのバックアップ（タグ/退避ブランチ）を取得。

## 配布基盤
- **git submodule**: 拡張は特定タグに pin（＋`CORE-DS-VERSION`）、ポータルは rolling
- **ホスト**: GitHub（`takahashiman/`）。Core 自体は Pages 不要（Pages は U2 ポータル）

## バージョニング基盤（IDQ2=A）
- **SemVer git タグ**（`v1.0.0` 起点）
- **GitHub Actions ＋ git-cliff（既存 `cliff.toml`）**: タグ push 時に CHANGELOG 生成＋GitHub Release 自動作成
- 昇格=MINOR / 破壊=MAJOR / 修正=PATCH（business-rules BR-5）

## メタデータ配置（FQ1=A）
- リポジトリルートに **`registry.json`** / **`taxonomy.json`**（Core Maintainer 管理・単一正典）
- 新規拡張の登録 PR 先（U3 の auto-PR ガードレールのターゲット）

## CI フック（実装は U5）
- GitHub Actions ワークフロー配置: 三層 Lint・依存脆弱性スキャン（SECURITY-10）
- 共有 Lint 設定（CD-7）を本リポジトリから配布

## 監視（代替）
- サービス監視は N/A。代替＝CI（Lint/scan）＋VRT（U2 連携）の合否
