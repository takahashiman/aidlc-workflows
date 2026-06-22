# U2-7 UX 改修フロー — NFR Requirements

> Unit U2-7 / C-UXFlow。主眼＝**既存非回帰**（AC①「既存機能を壊さない」）。
> 確定: **NQ7-1=B**（vitest 新規＋純粋ヘルパー単体＋e2e の二層）/ **NQ7-2=A**（既存 figuds-build.yml 同梱）。

## カテゴリ別該当性（事前判定）

| カテゴリ | 該当 | 理由 |
|---|---|---|
| Reliability / 非回帰 | ◎ 主眼 | 最小UX改善1点（C1）が既存挙動を壊さないことを二層で保証 |
| Maintainability | ○ | 純粋ヘルパー抽出＋vitest 土台＝今後の UX ロジック検証の基盤 |
| Accessibility | ○ | RouteDetail 戻りボタンの操作・フォーカスを非回帰維持 |
| Performance | N/A | クライアント側ルーティング分岐のみ＝無視可能 |
| Security | △（供給面のみ） | 新規ランタイム依存なし（vitest は devDependency）・秘密非保持・ネットワークなし |
| Scalability / Availability | N/A | 静的 SPA・該当せず |

## 非機能要件

### NRD7-REL（信頼性／非回帰）
- **NRD7-REL-1（通常フロー不変）**: Home→RouteDetail→戻る の通常経路は従来どおり前画面（Home）へ戻る。挙動・遷移・状態表示を変更しない（BR-UX-2 / BR-FLOW-1）。
- **NRD7-REL-2（直リンク堅牢化）**: アプリ内履歴が無い直接アクセス（`location.key === 'default'`）時の戻りは Home（`/`）へフォールバックし、アプリ外へ抜けない。
- **NRD7-REL-3（二層検証＝合格条件）**: 反映は **①vitest 単体**（純粋ヘルパー `decideBackTarget(locationKey)` の分岐＝履歴有→`back`／履歴無→`home`）＋ **②Playwright e2e**（戻り2経路を実ブラウザでアサート）＋ **③既存 main-routes VRT 緑**（視覚非回帰）が**すべて緑**であることを合格条件とする（BR-REV-1）。

### NRD7-MNT（保守性）
- **NRD7-MNT-1（純粋ロジック抽出）**: 戻り判定を React Router フックから切り離した**純粋関数 `decideBackTarget(locationKey: string): 'back' | 'home'`** として抽出し、単体テスト可能化する（実装が正典・モック最小）。
- **NRD7-MNT-2（テスト基盤の土台化）**: vitest を新規導入し、今後の UX ロジック検証の土台とする（NQ7-1=B のユーザー意図）。最小構成（設定＋1テスト）から開始。
- **NRD7-MNT-3（既存基盤再利用）**: e2e/VRT は U2-3 導入の Playwright（`test:vrt`・`tests/vrt`）を再利用し、新規ブラウザ基盤を増やさない。

### NRD7-A11Y（アクセシビリティ）
- **NRD7-A11Y-1（戻り操作の非回帰）**: 戻りボタンの role/ラベル/キーボード操作/フォーカス順を変更しない。フォールバック追加は視覚・意味を変えない。
- **NRD7-A11Y-2（状態表現不変）**: 遅延状態の色/ラベル（Core status-pill 委譲）を変更しない（BR-FLOW-3）。色だけで情報を伝えない既存実装を退行させない。

### NRD7-PERF（性能）
- **NRD7-PERF-1（予算なし・継承）**: 厳密な性能予算は設けない（U2-3 NQ 継承）。ルーティング分岐は定数時間で影響なし。

### NRD7-SEC（セキュリティ・供給面のみ）
- **NRD7-SEC-1（依存最小）**: 追加は **vitest（devDependency のみ）**。ランタイム依存・配布物に影響しない。新規ネットワーク呼び出し・秘密の保持なし。
- **NRD7-SEC-2（CI 継承）**: figuds-build.yml の既存方針（Actions SHA pin・最小 permissions）を継承する。

### N/A（明示）
- Scalability / Availability / 従来型インフラ要件＝該当なし（静的 SPA・クライアント改修）。
