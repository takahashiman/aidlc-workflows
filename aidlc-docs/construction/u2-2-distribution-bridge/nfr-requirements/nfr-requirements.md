# NFR Requirements — U2-2 配布・ブリッジ

> 対象: BusDelayAlerts（配布/ブリッジ）。確定: NQ1=A / NQ2=A / NQ3=A。Security Baseline=Yes / PBT=No。
> ID 規約: NRD-* (U2-2)。

## Reliability / 非回帰（◎ 中核）
- **NRD-REL-1**: 製品の `vite build` が**成功**する（配布・ブリッジ導入後も）。CI/ローカルで確認。
- **NRD-REL-2**: 既存機能が**非回帰**＝主要画面（ホーム/到達カード/遅延バナー/通知）が崩れず描画。
  - 検証＝**自己ビジュアルチェックリスト**（frontend-components の項目・S2=C セルフ試験）。自動テストが存在すれば併用（NQ1=A）。
- **NRD-REL-3**: ブリッジは既存 shadcn/Radix・JSX を**書き換えず**変数の指す先のみ Core へ（破壊的変更なし）。
- **NRD-REL-4**: 配布の再現性＝submodule pin タグ（`v1.2.0`）＋`CORE-DS-VERSION` 一致＋決定的生成（同 seed→同トークン）。

## Performance（○）
- **NRD-PERF-1**: バンドルは**厳密予算なし**。ブリッジ＋Core CSS import による **CSS/JS gzip 増分を記録・監視**（NQ2=A）。
- **NRD-PERF-2**: 体感劣化なし（初回描画・操作応答が現行同等）。明確な劣化が出た場合のみ予算化を再検討。
- **NRD-PERF-3**: ビルド時生成（`gen:palette`）はビルド時間に過大な影響を与えない（軽量 Node・U2-1 ゼロ依存）。

## Security（Baseline=Yes・○）
- **NRD-SEC-1**: **submodule サプライチェーン整合**＝Core を SemVer タグに pin（rolling 禁止）、`CORE-DS-VERSION`＝submodule 実 ref を CI 検査。
- **NRD-SEC-2**: **Core 依存の SCA**＝U2-1 生成器が**ゼロ依存**であることを確認（HIGH/CRITICAL を持ち込まない）。
- **NRD-SEC-3**: **秘密非保持**（seed/トークンは公開可能なデザイン値・機密なし）。
- **対象外（NQ3=A）**: 製品の既存依存（Radix/Tailwind 等）の HIGH/CRITICAL 棚卸しは U2-2 スコープ外（既存負債は別途）。

## Accessibility（○・継承）
- **NRD-A11Y-1**: 製品は **AA 済みトークンを消費**するのみ（AA 保証は U2-1 生成器）。U2-2 で新規 a11y 要件は設けない。状態色の semantic 化に伴う本格 a11y 適用は U2-3。

## Maintainability（○・FD 確定寄り）
- **NRD-MNT-1**: ブリッジは**専用 CSS 1 枚**（AD1=A）。対応表は宣言的・一覧性を保つ。
- **NRD-MNT-2**: 生成物は **gitignore**（毎ビルド再生成）。配布版は pin タグ＋`CORE-DS-VERSION` で一意。
- **NRD-MNT-3**: シナリオ別方針（既存=A / 新規=B）を `dev-flow-journal.md` に記録（US-D5 AC）。

## N/A（明示）
- **Scalability / Availability / 運用監視**: いずれも N/A（ビルド時生成・静的配布・ランタイム/サーバ無し）。

## トレーサビリティ
- AC①-4（submodule×Vite build）= NRD-REL-1/4。NFR2-3（非回帰）= NRD-REL-2/3。
- Security Baseline = NRD-SEC-1/2/3。a11y = NRD-A11Y-1（U2-1 継承）。
