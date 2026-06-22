# NFR Design Plan — U2-3 スタイル適用

> 対象: BusDelayAlerts（`feature/figuds-adoption`）。NFR Requirements 承認済（NQ1=B/NQ2=A/NQ3=A）。

## 質問ゲートなしの justification
- 設計論点は **FD（FDQ1-4）＋ NFR-Req（NQ1-3）で確定済**。NFR Design は確定要件をパターン／論理コンポーネントへ写像するのみ。
- カテゴリ評価（ルール Step3 準拠）:
  - **Resilience**: 非回帰中心。VRT（NQ1=B）＋スコープ付き lint（NQ2=A）＋build 成功で担保＝確定。新たな fault tolerance 機構は不要（静的・ビルド時）。
  - **Scalability**: N/A（静的配布・ランタイム無し）。
  - **Performance**: 厳密予算なし（NQ3=A）＝確定。最適化機構は導入しない。
  - **Security**: U2-2 供給面整合の継承＋削除のみ（旧 tokens 撤去）＝確定。
  - **Logical Components**: VRT・lint ガードの**配置粒度**のみ残るが、これは Infrastructure Design（CI 結線・ファイル glob・ベースライン運用）で確定する性質＝NFR Design では論理要素として表現。
- 以上より**新規の意思決定質問なし**。

## NFR 設計ステップ（チェックボックス）
- [x] NFR-Req（NRD3-*）を分析
- [x] 設計パターン（P*）へ写像
- [x] 論理コンポーネント（LC-*）へ分解
- [ ] `nfr-design-patterns.md` / `logical-components.md` 生成
- [ ] 承認ゲート

## 生成物
- `nfr-design-patterns.md` — P 群＋パターン×NFR マトリクス。
- `logical-components.md` — LC 群＋依存図＋検証観点。
