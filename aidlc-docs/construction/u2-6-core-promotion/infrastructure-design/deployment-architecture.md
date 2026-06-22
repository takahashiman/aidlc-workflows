# Deployment Architecture — U2-6 Core 昇格実行（ドメインパターン）

> arrival-card 昇格の配備・品質ゲート・ロールバック。確定回答 IDQ6-1=A / IDQ6-2=A。
> 実 push/PR/タグはユーザー承認後（FDQ6-3=A）。

## 配備図（Core repo CI ゲート群）

```
Core repo（FIG-Universal-Design-System @core）
└─ .github/workflows/（Core 自己ゲート）
   ├─ palette-check.yml      （既存・tokens/palette）
   ├─ registry-check.yml     （既存・registry/taxonomy）
   └─ component-check.yml     ★新規（components/preview/semantic）
        ├─ lint  → _shared-guardrail.yml → ci/lint/three-layer-lint.mjs   （生HEX/層違反 0）
        ├─ vrt   → _shared-vrt.yml       → ci/vrt/vrt-runner.mjs          （preview 視覚回帰・ベースライン CI Linux）
        └─ a11y  → _shared-a11y.yml ★新規 → ci/a11y/a11y-runner.mjs ★新規  （axe serious/critical 0）

reusable（拡張/portal からも参照可）
   _shared-guardrail.yml / _shared-vrt.yml / _shared-a11y.yml★
```

## 昇格フローの配備手順（承認後・AD2=C）

1. Core 作業ブランチに `components/arrival-card.spec.md`＋`preview/components-arrival-card.html`＋`ci/a11y/*`＋`_shared-a11y.yml`＋`component-check.yml` を追加。
2. `core-promotion` ラベルで Issue 起票（提案）→ PR（Issue 参照・preview/spec 実体）。
3. PR で `component-check`（lint/VRT/a11y）が走る。**VRT ベースライン初回は CI Linux で生成しコミット**。
4. 全ゲート緑 ＆ **Core Maintainer 承認**でマージ（自動マージ禁止・SEC-3）。
5. `release.yml` がタグ（**MINOR**）で CHANGELOG 自動更新。
6. confirmPromotion＝components 索引/`_core-gallery` 掲載・ポータル rolling 取込で arrival-card 閲覧可を確認。

## 品質ゲート一覧

| ゲート | 機構 | 合格条件 | ブロック |
|---|---|---|---|
| 三層 lint | `_shared-guardrail` | 生HEX/層違反 0（新規箇所） | マージ |
| VRT | `_shared-vrt`（preview） | ベースライン差分 ≤ threshold | マージ |
| a11y | `_shared-a11y`（新規・axe） | serious/critical 0 | マージ |
| Maintainer 承認 | レビュー | 承認必須（自動マージ禁止） | マージ |

## ベースライン更新フロー
- 初回: PR の CI（Linux）で `preview/__baseline__/components-arrival-card.*` を生成しコミット（真実源）。
- 意図的な見た目変更時のみ `vrt:update` 相当で更新し、差分理由を PR に明記。a11y はベースライン不要（規則違反検出）。

## ロールバック
- 昇格は加算（既存無改変）のため、revert は新規ファイル削除＝既存コンポーネントに影響なし。
- component-check.yml/_shared-a11y.yml/ci/a11y の追加も独立＝revert で既存ゲート（palette/registry）に影響なし。

## N/A
- Compute/Storage/Network/DB/オートスケール/マルチ AZ/DR：CI 検査追加のみ＝該当なし。
- 配布バンドル/Pages 成果物：追加依存は CI devtool のみで非影響。
