# U2 Code Gen — Step1: portal/ スキャフォールド

- 生成: `portal/package.json`（type:module・scripts: build/dev/test/validate・devDep: ajv[JSON Schema 検証]・engines node>=20）
- 更新: ルート `.gitignore` に `portal/vendor/core/`・`portal/site/`・`portal/node_modules/`（ビルド生成物・取込 Core）を追加
- ディレクトリ構成は後続ステップのファイル生成で具体化（src/ scripts/ data/ schema/ usage/ tests/ vendor/ assets/）
- 配置方針: `aidlc-workflows/portal/`（workspace root 直下サブツリー。フレームワーク fork のファイル群と非衝突、IDQ5=A の具体化）
