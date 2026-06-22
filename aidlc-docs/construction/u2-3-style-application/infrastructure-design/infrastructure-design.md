# Infrastructure Design — U2-3 スタイル適用

> LC-*（NFR Design）を BusDelayAlerts の実配置へマッピング。確定: IDQ1=A / IDQ2=A / IDQ3=C。
> U2-2 配置（vendor/core・prebuild 生成・`figuds-build.yml`・GitHub-hosted runner）を**前提継承**。U2-3 は検証/ガードを追加。

## 実行基盤
- **repo**: BusDelayAlerts（`feature/figuds-adoption`）。**runner**: GitHub-hosted（ubuntu + Node LTS）。
- **VRT 実行環境**: CI(Linux) を**真実源**（IDQ1=A）。ベースライン画像は Linux で生成・repo 管理。
- **ランタイム基盤**: なし（静的フロント）。compute/storage/messaging/networking/DB = **N/A**。

## コンポーネント配置（製品 repo 内・想定パス）
| 論理要素 | 配置 |
|---|---|
| LC-StatusTheme | `src/styles/figuds-bridge.css` の `@theme`（`--color-success/-warning/-danger`＋`-foreground` = `var(--status-*-surface)`/`-on`） |
| LC-StatusMapping | `src/components/**`（StatusBadge 等）の className 置換＋`src/constants/statusConfigs.ts`（文言/アイコン維持） |
| LC-BrandSubstitution | 主要導線 `src/app/**`・`src/components/**` の `[#2C6B5E]`→`primary` 機械置換 |
| LC-RawHexGuard | `scripts/check-raw-hex.mjs`（または同等）＋`figuds-build.yml` の検出 step（主要導線 glob 限定） |
| LC-VRT | `tests/vrt/**`（Playwright spec）＋`tests/vrt/__screenshots__/**`（Linux ベースライン・repo 管理）＋`playwright.config.ts` |
| LC-LegacyRemoval | `src/styles/tokens/{primitives,semantic}.css` 削除＋`src/styles/index.css` 参照除去 |
| LC-Verify | `figuds-build.yml`（build＋pin 整合[U2-2 継承]＋raw-hex step＋VRT job）＋gzip 記録 |

## ビルド/検証結線

### 生成（U2-2 継承・不変）
- `scripts.prebuild`/`scripts.predev` で `generate.mjs --seed=#2C6B5E --out src/styles/generated`（生成物 gitignore）。

### 生 HEX ガード（IDQ2=A）
- `figuds-build.yml` に**スコープ付き検出 step**を追加。主要導線 glob（例: `src/app/**`＋主要 `src/components/**`）に対して `#RRGGBB`／`[#...]` arbitrary を検出し、ヒットで **fail**（NRD3-MNT-1）。
- 周辺画面（Profile/Settings/Onboarding 等）は glob から**除外**（緑維持・FDQ3=A）。
- 既存三層 lint（Core lint-rules）と役割分担: 三層 lint＝CSS の層規約 / 本 step＝tsx の生 HEX・arbitrary。U2-2 持越「三層 Lint 接続」を本 step で完了（NRD3-MNT-2）。

### VRT（IDQ1=A・IDQ3=C）
- **tool**: Playwright（`@playwright/test`・`toHaveScreenshot`）。devDependency 追加。
- **CI job**: `figuds-build.yml` に VRT job 追加。`npx playwright install --with-deps chromium` → 製品をビルド/プレビュー起動 → spec 実行。
- **ベースライン**: Linux 生成・`tests/vrt/__screenshots__/**` を repo 管理（CI 真実源）。意図的更新時は `--update-snapshots` で再生成しレビュー承認。
- **対象（IDQ3=C・両方）**:
  - ページ単位: Home / RouteDetail（主要ルートの遷移先）。
  - コンポーネント単位: StatusBadge（success/warning/danger 各状態）/ RouteCard / BusSelector 等。
  - ※ 具体リスト・ビューポートは Code Gen で確定（FDQ3=A 主要導線に限定・周辺除外）。
- **しきい値**: `maxDiffPixelRatio`（小）で軽微なレンダ差を許容（Code Gen で調整）。

### 旧 DS 撤去（FDQ4=A）
- `src/styles/tokens/{primitives,semantic}.css` 削除＋`index.css` 参照除去。撤去後 build 成功＋VRT 非回帰を必須（LC-Verify）。

## CI（`figuds-build.yml` 拡張・1 workflow に集約）
1. checkout（`submodules: recursive`・public・トークン不要・U2-2 継承）。
2. Node setup（lts）。
3. **submodule pin 整合**（U2-2 継承・`CORE-DS-VERSION`＝`vendor/core` 実 ref 一致・不一致 fail）。
4. `npm ci` → `npm run build`（prebuild 生成 → `vite build` 成功＝NRD3-REL-1）。
5. **raw-hex guard step**（主要導線 glob・ヒット fail＝NRD3-MNT-1）。
6. **VRT job**（Playwright install → build/preview → スクショ比較・ベースライン差分で fail＝NRD3-VRT-2）。
- permissions 最小（`contents: read`）。Actions は SHA pin（U2-2 方針継承）。

## バージョニング
- 製品は Core を `v1.2.1` に pin（U2-2 継承）。Core 更新時は pin タグ＋`CORE-DS-VERSION` 更新で追従。

## セキュリティ（NQ3=A 継承）
- submodule pin 整合の CI 検査・Core 依存ゼロ確認・秘密非保持。VRT ベースライン画像に機密なし。製品既存依存 SCA は対象外。

## 監視
- 専用 observability 不要。CI（build＋pin 整合＋raw-hex＋VRT）の合否で十分。性能は gzip 増分を記録（厳密予算なし・NQ3=A）。
