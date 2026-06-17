# U6 Showcase — Code Generation Summary

> 確定 FDQ/NFR/Infra 全A。U6 は「U2/U5 が残したスタブ」を実体化。新概念ゼロ・契約（schema）不変・二重実装なし（BR-CI-1CRAWL）。

## 生成物の所在（すべて portal 配下 / aidlc-docs 外）
```
portal/scripts/collect-versions.mjs   # ★ collectShowcase() を追加（単一クローラ拡張・CI-4）
portal/scripts/build.mjs              # ★ showcase スタブ生成 → collectShowcase() 実体へ配線
portal/src/views.js                   # ★ renderShowcase() 実体化（空状態2種/拡張バッジ/preview/昇格導線/撤去推奨/esc）
portal/assets/portal-app.css          # ★ .fig-badge--ext / .fig-showcase-item__preview 追補
portal/schema/showcase-index.schema.json  # 不変（U2 確定契約を充足）
portal/data/showcase-index.json       # 収集出力（GH_OWNER 設定時に実体化・未設定はスタブ据え置き）
```

## collectShowcase() の要点（CI-4 / US-5.1）
- **駆動**: `data/registry.json` の登録製品（registry 単一正典・BR-SC-SRC-2）。
- **収集源2系統**: ①各 repo `extensions/` 配下の部品（`compat`/`index`/`README`/隠し除外）→ `kind: extension`、②`temp-part` ラベルの open Issue（PR 除外）→ `kind: temp-part`。
- **メタ抽出**: `ownerProjectId`=registry projectId（BR-SC-OWNER）／`name`=ヘッダ `// EXTENSION PART — <name>` or stem / Issue タイトル／`previewPath`=repo `preview/<stem>.html` 一致時／`screenshotUrl`=Issue URL。
- **昇格判定**: `promotable` 既定 true（US-5.2 AC1）／`promotedToCore`=Core `components/*.spec.md` に同名/同義出現（正規化＋別名表＋製品プレフィックス吸収）。照合不能は false 据置（BR-SC-PROMOTED/FAILSOFT）。
- **fail-soft**: 個別 repo/項目失敗は skip・全体失敗は exit0 で据え置き・`GH_OWNER` 未設定は収集スキップ（未収集スタブ維持）。
- **単一走査**: CLI 既定で `collectVersions` と並走、`build.mjs` は version 収集と同じ箇所で呼出（BR-CI-1CRAWL）。

## Showcase View の要点（PT-6 / US-5.2）
- 空状態を **未収集（スタブ/未実行）** と **収集済み0件** で文言区別（BR-SC-EMPTY）。
- カード: `name`＋kind バッジ（拡張/仮パーツ）＋`ownerProjectId`＋preview 導線。
- `promotedToCore` → 「Core昇格済み・撤去推奨」バッジ（昇格導線抑止）。
- `promotable && !promotedToCore` → 「昇格を提案する →」（`#/usage/promotion` 経由・FR-6）。
- 外部由来文字列は `esc()` でエスケープ（SEC-2）。

## 検証結果
- `node scripts/build.mjs` → 成功（収集 fail-soft・schema OK: showcase-index.schema.json・バンドル）。
- `npm test` → **16 pass / 0 fail**（既存 router/nav テスト回帰なし）。
- collectShowcase モック機能テスト（GitHub API 差替え）→ **10 アサーション PASS**:
  extensions 2＋temp-part 1 収集・compat/README/PR 除外・ヘッダ name 抽出・Fab→Core(fab) で `promotedToCore=true`・StepperBar は false・previewPath 付与・Issue URL→screenshotUrl・promotable 既定 true・collectedAt 実時刻。
- renderShowcase 分岐スモーク → 未収集/0件区別・拡張バッジ・撤去推奨・昇格導線（Fab 抑止/temp 表示）・XSS エスケープ・preview すべて ✓。

## 要ユーザー操作（user-actions-checklist フェーズ E へ追記済み）
- **E-6** 収集トークンに `issues:read` 追加（`contents:read` は E-4 既設・`GH_OWNER`/`CORE_DS_REPO` 共有）。
- **E-7** 各製品 repo に `temp-part` / `core-promotion` ラベル作成。
- **E-8** Core 昇格時の「撤去推奨」表示確認＋仮コード撤去。
