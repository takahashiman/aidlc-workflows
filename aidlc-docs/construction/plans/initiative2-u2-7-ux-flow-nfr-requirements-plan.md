# U2-7 UX 改修フロー — NFR Requirements 実行プラン（回答記録）

> per-unit ループ NFR Requirements 段。主眼＝既存非回帰（AC①）。

## 質問ゲート回答（2026-06-22 確定）

| ID | 論点 | 確定 | 内容 |
|---|---|---|---|
| **NQ7-1** | 非回帰の検証方式 | **B（相談の上）** | **vitest 新規＋e2e の二層**。戻り判定を純粋ヘルパー `decideBackTarget(locationKey)` に抽出して vitest 単体＋Playwright e2e（戻り2経路）＋既存 main-routes VRT 緑。ユーザー意図＝テスト基盤の土台化。 |
| **NQ7-2** | CI 統合 | **A** | 既存 `figuds-build.yml` に同梱（unit step 追加＋VRT job に戻り e2e・1 workflow 集約・U2-3 整合）。 |

## 相談記録（NQ7-1）

ユーザー「できればテスト基盤を新規導入したいが、e2e 機能で十分なのか確認したい」。
- AI 整理: C1 改修の契約は**到達先（戻り先画面）**＝ルーティング統合の境界。`location.key` 分岐を unit でモックすると「モックを試す」になりがちで、実 history スタックでの戻り先は e2e が確実。e2e のみでも C1 には十分。一方 vitest は純ロジック検証の土台として将来価値あり。
- ユーザー決定: **vitest 新規＋e2e の二層**（B）。純粋ヘルパー抽出で「テスト可能化＝実装が正典」と両立。

## 事前判定（カテゴリ該当性）

Reliability/非回帰=◎主眼・Maintainability=○・A11y=○・Performance=N/A・Security=△供給面（vitest devDep のみ）・Scal/Avail=N/A。

## 生成成果物（nfr-requirements/）

1. **nfr-requirements.md** — NRD7-REL-1〜3（通常不変/直リンク堅牢化/二層検証＝合格条件）・MNT-1〜3（純粋ロジック抽出/vitest 土台/既存基盤再利用）・A11Y-1〜2・PERF-1・SEC-1〜2・Scal/Avail N/A。
2. **tech-stack-decisions.md** — TSD7-1〜8（二層検証/純粋ヘルパー `decideBackTarget`/vitest 最小導入/Playwright 再利用/CI 同梱/Pencil 配置/非回帰スコープ/Security 供給面）＋不採用記録＋後続申し送り。

**次**: NFR Requirements 承認待ち（承認で NFR Design へ＝二層検証の論理コンポーネント分割）。
