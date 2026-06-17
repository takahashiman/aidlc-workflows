# U7 Sandbox — 検証レポート（Verification Report）

> **実施日**: 2026-06-10／**対象**: `aidlc-projects/ProductA`（React 18 + CRACO）／**検証 Core**: `core`@`d9919f9`（ローカル正典実体）
> 設計・基準は [verification-design.md](verification-design.md) を参照。

## 結果サマリ: ✅ PASS（V1–V5 全合格）

| # | 検証項目 | 結果 | 証跡 |
|---|---|---|---|
| V1 | submodule 取り込み | ✅ | `git submodule status` → `d9919f9 design-system`（旧 `6f36074` から更新） |
| V2 | 参照解決 | ✅ | `@design-system/primitives.css` 他 6 CSS が alias 解決・ビルドエラーなし |
| V3 | ビルド成功 | ✅ | `craco build` → **Compiled successfully**（main.js 46.31 kB / main.css 10.56 kB gzip） |
| V4 | DS の実体取り込み | ✅ | bundle CSS に `.fig-*` クラス **64 種**を確認（`fig-button/card/input/fab/form-group/headline/profile-terminal` 等） |
| V5 | プロファイル適用 | ✅ | `.fig-profile-terminal` が bundle CSS に含まれる（Mobile-Terminal 適用） |

## 実施内容
1. **submodule 更新**: ProductA の submodule クローンはクローン時点（2026-06-04）が古く `core` ブランチ未取得だった。ローカル正典 Core（`aidlc-projects/FIG-Universal-Design-System` の `core` ブランチ）から `core` 先端を取り込み、working tree を `d9919f9` へチェックアウト。gitlink が旧 `6f36074`（busapp/`main`）→ `d9919f9`（`core`）へ更新。
2. **消費モデル再配線**: `src/App.jsx` を旧 JSX import（`extensions/busapp/components`）から、現行 Core の **CSS クラス方式**へ書き換え。
   - import: `primitives.css` / `semantic.css` / `tokens/{signature,base,profile-terminal,components}.css`
   - markup: `.fig-profile-terminal` ラッパー内に `.fig-card` / `.fig-form-group` + `.fig-input` / `.fig-button(--secondary)` / `.fig-fab`
3. **ビルド検証**: `CI=true npx craco build` で本番ビルド成功。`craco.config.js`（ModuleScopePlugin 除去 + `@design-system` alias）は無改修で CSS の submodule import を解決。

## 確認された配布機構の妥当性
- **submodule pin で Core 実体を製品に引き込める**（gitlink = SHA 固定で再現性確保）。
- **CSS クラス方式（`.fig-*`）の Core を React 製品が消費できる**（Core は JSX を持たない現行モデルで成立）。
- **プロファイル切替**（`.fig-profile-terminal`）が製品側 className 指定で機能する。

## 既知の制約（設計どおり・スコープ外へ委譲）
- 本検証は **ローカル Core 実体（`core`@`d9919f9`）** に対するもの。**本番の submodule pin（実 GitHub URL ＋ Core SemVer タグ）での再検証**は、Core のタグ未発行・「GitHub 操作は Build & Test 直前に一括」方針により **checklist フェーズ F（U7 項）** へ委譲。
- `craco.config.js` の babel-loader 拡張（旧 JSX 用）は現配線では未使用だが無害のため温存。将来 Core が JS ヘルパを提供する場合に再利用可。

## 結論と次アクション
- **US-X.1 AC1「正しくビルド・参照できる」を充足**。配布機構（submodule + CSS クラス消費）は妥当。
- **AC1 後段「検証完了後に ProductA を削除」** → 破壊的操作のため本 Unit では実行せず、checklist フェーズ F の 🛠 ユーザー操作として明記。本番 submodule 検証 OK を確認後に `aidlc-projects/ProductA` を削除する。

## 再現手順（参考）
```bash
cd aidlc-projects/ProductA
# 1) submodule に core を取り込み d9919f9 へ
git -C design-system fetch ../../FIG-Universal-Design-System core
git -C design-system checkout d9919f9
# 2) ビルド
CI=true npx craco build
# 3) bundle に .fig-* が含まれることを確認
grep -oE "\.fig-[a-z_-]+" build/static/css/main.*.css | sort -u | wc -l   # → 64
```
