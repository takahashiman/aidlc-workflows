# U1 Core DS — Tech Stack Decisions

| 項目 | 決定 | 根拠 |
|---|---|---|
| **トークン実装** | **プレーン CSS Custom Properties**（primitives.css / semantic.css ＋ `.fig-profile-*` 上書き）。プリプロセッサ不使用 | framework 非依存・最小依存・既存踏襲 |
| **コンポーネント実装** | **CSS クラス（`.fig-*`）が正典**（NRQ2 更新 2026-06-05）。`tokens/components.css` 等で `--fig-*`/`--color-*` を消費。JSX は Core に持たず各拡張の任意ラッパー | 既存実態＝framework 非依存。class 付与だけで全 framework 利用可。「拡張は必ずしも React でない」(ADQ1)に最適 |
| **配布形態** | **ソースのみ**（NRQ1=A）。ビルド成果物・バンドラを Core に持たない | submodule 整合・最小保守。消費側がビルド |
| **配布機構** | **git submodule**（拡張は特定版 pin＋`CORE-DS-VERSION`、ポータルは rolling）（ADQ6=A） | 既存方針 |
| **バージョニング** | **SemVer** git タグ ＋ CHANGELOG（既存 `cliff.toml`/git-cliff 活用） | 予測可能なリリース |
| **ブラウザ対象** | モダン・エバーグリーン（NRQ3=A） | レガシー保守コスト回避 |
| **Lint/品質** | 共有 **stylelint＋ESLint** 設定（CD-7）。三層・トークン経由を強制（実行は U5 CI） | 規約の機械担保 |
| **プレビュー** | 静的 **HTML preview**（`preview/*.html`、5状態以上） | 手動視覚確認を優先（既存方針） |
| **Storybook** | 後回し（Phase 4 以降で検討） | 1〜2名体制の保守コスト回避 |
| **メタデータ** | `registry.json` / `taxonomy.json`（JSON、Core DS 正典） | 単一正典（FQ1=A） |

## 非選択（明示）
- CSS-in-JS / プリプロセッサ（Sass等）: 不採用（Custom Properties で十分・framework 非依存）
- Web Components 化: 今回は不採用（NRQ2=A。将来 B を再評価可能）
- ビルド済み配布 / npm パッケージ: 不採用（submodule ソース配布）
