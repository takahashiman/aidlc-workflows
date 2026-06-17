# U1 Core DS — Logical Components

> U1 の論理コンポーネント（基盤要素）。伝統的インフラ要素は適用判定で N/A を明示。

## 論理コンポーネント（適用）
| 論理要素 | 役割 | 対応パターン |
|---|---|---|
| **Token Layer**（primitives.css / semantic.css） | 三層トークンの実体 | P1 |
| **Profile Override Layer**（`.fig-profile-*`） | デバイス別上書き | P2 |
| **Component Source**（JSX 参照実装＋CSS） | 「正解の型」 | P1, P3, P4 |
| **A11y Tokens/Conventions** | コントラスト/フォーカス/タップ/aria | P3 |
| **Motion Tokens** | transition/reduced-motion | P4 |
| **Deprecation/Alias Map** | 旧名→新名の互換層 | P5 |
| **Metadata**（registry.json / taxonomy.json） | 拡張一覧＋カテゴリ正典 | — |
| **Shared Lint Config**（CD-7） | 三層/トークン経由の強制（実行は U5） | P1, P6 |
| **Preview Assets**（preview/*.html） | 状態可視化・手動視覚確認 | P3 |

## 伝統的インフラ要素（適用判定）
| 要素 | 判定 | 理由 |
|---|---|---|
| メッセージキュー | N/A | 非同期処理なし |
| キャッシュ層 | N/A | ランタイム不在（静的 source） |
| サーキットブレーカー/リトライ | N/A | 外部呼び出しなし |
| ロードバランサ/オートスケール | N/A | サービス稼働なし |
| データストア | N/A | 永続化なし（メタデータは JSON/git） |

## 連携（他 Unit）
- **U5 CI/CD**: Lint 設定（CD-7）・サプライチェーン・スキャンを実行
- **U2 Portal**: registry/taxonomy を rolling 読取、VRT 対象
- **U3 Template**: Core を pin、registry へ自動 PR
