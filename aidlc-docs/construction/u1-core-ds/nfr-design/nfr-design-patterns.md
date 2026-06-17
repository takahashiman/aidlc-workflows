# U1 Core DS — NFR Design Patterns

## P1. 三層トークンカスケード（保守性・一貫性）
- Primitive（生値）→ Semantic（役割）→ Component（参照のみ）
- Component は Semantic のみ参照。変更は Semantic 差し替えで全体波及
- 強制: U5 Lint（生値直書き・層逆流を fail）

## P2. プロファイル上書きカスケード（usability・デバイス最適化）
- `:root` 既定 Semantic → `.fig-profile-{admin|consumer|terminal}` が全トークン種を上書き
- Component 不変のまま 3デバイス最適化（再レンダリングで反映）

## P3. アクセシビリティ・パターン（WCAG 2.1 AA）
- コントラスト: Semantic color トークンが AA 比率（4.5:1+）を満たす値で定義
- フォーカス: `:focus-visible` トークン（リング色/太さ）を全インタラクティブ要素に
- タップ領域: `--fig-touch-target`（44px+）をプロファイル別に
- aria: コンポーネント spec に必須記載（BR-8）
- `prefers-reduced-motion`: P4 と連動

## P4. モーション予算パターン（性能・a11y）
- transition は Semantic motion トークン（`motion.enter` 等）経由
- `prefers-reduced-motion: reduce` 時は `0.01ms`（`onTransitionEnd` 維持）に縮退
- 過剰アニメーション禁止（予算内）

## P5. 後方互換エイリアス・パターン（信頼性＝Resilience 代替）
- 改名時: 旧トークン/コンポーネント名 → 新名への**エイリアス層**を一定期間維持（非破壊）
- 非推奨は `@deprecated` 注記＋削除予定バージョン明記
- 破壊的削除は MAJOR＋移行ガイド

## P6. サプライチェーン・セキュリティ・パターン（SECURITY-10/13）
- 依存は lock 固定・公式レジストリのみ・未使用排除
- 脆弱性スキャンを CI（U5）に組込・`latest` タグ禁止
- 外部 CDN 利用時は SRI ハッシュ・CI 定義のアクセス制御

## P7. ソースのみ配布パターン（性能・保守）
- Core はビルド成果物/バンドラを持たず、source（CSS＋JSX＋spec＋preview）を submodule 配布
- 最適化・ツリーシェイクは消費側ビルドに委譲

## 非適用（明示）
- リトライ/サーキットブレーカー/キャッシュ/キュー/オートスケール: **N/A**（ランタイムサービス不在）
