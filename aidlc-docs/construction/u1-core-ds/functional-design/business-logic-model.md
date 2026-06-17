# U1 Core DS — Business Logic Model

> 技術非依存の詳細ロジック。対象 stories: US-1.1〜1.4, US-4.4/4.5（提供側）。

## 1. 三層トークン解決モデル（US-1.2）
```
Primitive（生値: HEX/px/数値）
   ▲ 参照（下層のみ）
Semantic（役割: color.text.*, spacing.*, typography.*, motion.*, a11y.* ...）
   ▲ 参照（下層のみ）
Component（UI: Semantic のみ参照、生値・Primitive 直参照は禁止）
```
- **解決順**: Component が参照する Semantic トークン → （プロファイル上書きがあればその値）→ なければ既定 Semantic → Primitive 実値
- **不変条件**: 上位は下位のみ参照。逆流・横断・生値直書きは規約違反（U5 Lint が検出）

## 2. プロファイル上書きロジック（US-1.3, FDQ2=A 全種）
- `.fig-profile-{admin|consumer|terminal}` を文書ルートに付与
- **全トークン種**（color/spacing/typography/radius/motion/touch-target）が Semantic 層でプロファイル別に上書き可能
- カスケード: `:root` 既定 Semantic 値 → `.fig-profile-*` が該当トークンを上書き → Component は無改変で再レンダリング
- 既定プロファイル: ポータルは **admin**（Web-Admin）

## 3. バージョニング・ロジック（US-1.4）
- **SemVer**: `MAJOR.MINOR.PATCH`
  - **MINOR**: コンポーネント/トークン追加・Core 昇格（後方互換）
  - **MAJOR**: 破壊的変更（トークン改名・契約変更）→ 移行ガイド必須
  - **PATCH**: バグ修正・微調整
- リリース成果: git タグ＋CHANGELOG。拡張は pin で選択取得、ポータルは rolling で最新反映

## 4. Core 昇格ロジック（US-4.4）
1. 提案（`core-promotion` ラベル, 3行）— 提案者ハードル最小
2. 3プロダクト基準（showcase の利用実績が裏付け）
3. 普遍化（Maintainer 伴走：ドメイン語彙除去＋トークン階層準拠＋プロファイル非依存）
4. レビュー（軽微=1名即決／重大=2名）＋リリース列車
5. 次 MINOR で公開 → registry/各拡張へ波及
- **昇格判定**（全✓で対象）: 3プロファイル成立／トークン階層遵守（Primitive/Semantic 直ハードコード禁止）／`--fig-*` 経由／WCAG AA／reduced-motion／spec・preview 完備

## 5. 後方互換・マイグレーション・ロジック（US-4.5 提供側）
- 改名時: Core が **旧名→新名のエイリアス/ラッパー** を一定期間提供（非破壊）
- 破壊的変更: **MAJOR** ＋移行ガイド
- 目的: 拡張・ポータルが安心して追従できる

## 6. メタデータ整合ロジック（registry / taxonomy, Core DS 正典）
- `registry.entry.category/subcategory` は `taxonomy` に**存在必須**（CI 検査）
- 新規拡張立ち上げ時、AI セットアップが registry へ**追加 PR を自動起票**（U3 連携）
- taxonomy のカテゴリ追加/再編は Core Maintainer 承認 → Core DS へコミット → ポータル rolling 反映
