# Infrastructure Design — U2-2 配布・ブリッジ

> LC-*（NFR Design）を BusDelayAlerts の実配置へマッピング。確定: IDQ1=A / IDQ2=A / IDQ3=A。
> 製品の静的フロント・ビルド時生成のため、クラウド/ランタイム基盤は大半 N/A。

## 実行基盤
- **repo**: BusDelayAlerts（`feature/figuds-adoption`）。**runner**: GitHub-hosted（ubuntu + Node LTS）。
- **ランタイム基盤**: なし（静的フロント・配備は既存方法）。compute/storage/messaging/networking/DB = **N/A**。

## コンポーネント配置（製品 repo 内・想定パス）
| 論理要素 | 配置 |
|---|---|
| LC-Submodule | `vendor/core`（submodule・pin `v1.2.0`）＋ ルート `CORE-DS-VERSION` |
| LC-Generator-Hook | `package.json` scripts `prebuild`/`predev`（`node vendor/core/tools/palette-gen/generate.mjs --seed=#2C6B5E --out src/styles/generated`）|
| LC-Generated 出力 | `src/styles/generated/{signature,status}.css`（＋`-aaa`）＝**`.gitignore` 新設で除外** |
| LC-Bridge | `src/styles/figuds-bridge.css`（1枚・後勝ち） |
| LC-Profile | ルート要素 `class="fig-profile-consumer"`＋`vendor/core/tokens/profile-consumer.css` import |
| LC-Legacy-Shim | 既存 `src/styles/tokens/{primitives,semantic}.css`（委譲・段階無効化） |
| スタイル入口 | `src/styles/index.css`（import 連鎖・読込順は NFR Design 参照） |

## ビルド結線（IDQ1=A）
- `scripts.prebuild` / `scripts.predev` で生成器を実行 → `src/styles/generated/` を更新。
- 生成器は `vendor/core` 内（submodule）＝Core 正典の生成法則を製品ビルドで実行。生成物は gitignore（毎回再生成）。
- `generate.mjs` に `--out` 受け口が必要（現状は Core `tokens/` 直書き）→ **Code Gen で `--out` オプション追補**（製品の出力先指定）。

## CI（IDQ2=A・新規 workflow）
- `.github/workflows/figuds-build.yml`（新設・GitHub-hosted）:
  1. checkout（`submodules: recursive`・IDQ3=A・public・トークン不要）。
  2. Node setup（lts）。
  3. **submodule pin 整合**: `CORE-DS-VERSION` と `vendor/core` の実 ref（`git -C vendor/core describe --tags`）が一致（不一致で fail・NRD-SEC-1）。
  4. `npm ci` → `npm run build`（prebuild が生成器を実行 → `vite build` 成功＝NRD-REL-1）。
- **三層 Lint（guardrail）は U2-3 で接続**（今は raw hex 379 で赤になるため見送り・IDQ2=A）。
- permissions 最小（`contents: read`）。Actions は SHA pin（Core 既存方針に倣う）。

## バージョニング
- 製品は Core を `v1.2.0` に pin（rolling しない）。Core 更新時は pin タグ＋`CORE-DS-VERSION` を更新して追従。

## セキュリティ（NQ3=A）
- submodule pin 整合の CI 検査・Core 依存ゼロ確認（U2-1）・秘密非保持。製品既存依存 SCA は対象外。

## 監視
- 専用 observability 不要。CI（build＋pin 整合）の合否で十分。性能は gzip 増分を記録（厳密予算なし）。
