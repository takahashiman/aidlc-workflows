# NFR Requirements — U2-1 Core パレット基盤（C-Palette）

> U2-1 は **ビルド時のトークン生成ユーティリティ**（ランタイムサービスでない）。
> 確定: NQ1=C（色演算 tech stack は実装時 PoC で決定）/ NQ2=A（ビルド時生成・CSS をコミット）/
> NQ3=A＋（**AA 必須・AAA は可能な範囲。加えて AAA 充足版も提案できる準備**）。Security Baseline=有効・PBT=No。

## NFR-PAL-A11y（最重要・AD5-2）
- **AA 必須**: 全 on-color / status の (text,bg) が WCAG 2.1 AA（通常 ≥4.5・大 ≥3.0）。生成は必ず AA 合格で返す（FD5=A）。
- **AAA 提案準備（NQ3 追加）**: メソッドは AA 版に加え、**AAA（通常 ≥7・大 ≥4.5）を満たす代替パレットも生成・提示できる**こと。
  - AAA は既定では必須化しない（色選択の自由度確保）。製品が選択可能なオプション出力とする。
- **検証の決定性**: 同 seed → 同検証結果（冪等）。

## NFR-PAL-Reliability
- **決定性/冪等**: 同 seed・同パラメータで同一トークン出力（BR-PAL-7）。
- **失敗の明示**: seed パース不可／補正限界で AA 未達 → 生成失敗（無音フォールバック禁止）。
- **回帰防止**: 生成出力をコミットし、差分（diff）でレビュー可能（NQ2=A）。

## NFR-PAL-Performance
- ビルド時に seed 1 つから数十〜百程度のトークン生成＝**軽量・即時**。ビルド時間を実質増やさない。
- ランタイムコストは 0（CSS 変数の静的出力）。

## NFR-PAL-Security（Security Baseline サブセット）
- **攻撃面**: ランタイム入力なし＝大半 **N/A**（認証/認可/入力検証/インジェクション等は非該当）。
- **該当**:
  - **SCA（依存 CVE）**: 色演算ライブラリを採用する場合（NQ1=C の PoC 次第）、依存を最小化し HIGH/CRITICAL CVE を持ち込まない。ゼロ依存ならリスク最小。
  - **秘密情報非保持**: seed・トークンは公開情報。秘密は扱わない。
- compliance: 既存 Core CI（三層 Lint・将来 VRT）に整合。

## NFR-PAL-Maintainability
- **三層遵守**: 出力は primitive/signature/status トークン。semantic 層が参照し、コンポーネントは semantic のみ参照。
- **トークン契約**: 命名は BR-PAL-6 に固定（`--signature-*` / `--signature-50..900` / `--status-*`）。
- **ドキュメント**: 生成法則を Core の design-system ドキュメントへ記載（コードのみ更新は禁止＝旧 DS 契約と同思想）。
- **再現手順**: 生成はビルド時スクリプト化（属人化しない・NQ2=A）。

## NFR-PAL-Scalability / Availability
- **N/A**（ビルド時ユーティリティ・負荷/可用性の概念なし）。

## トレーサビリティ
- AC①-1/2（signature/status トークン化）・AD5/AD5-2（生成メソッド・a11y）・NFR2-5（a11y AA）・NFR2-1（Security Baseline サブセット）。
