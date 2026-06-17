# Unit of Work — Story Map

> 全ストーリー（US-*）を Unit に割当。各 Unit が Construction（per-unit）で設計・実装される。

| Unit | ストーリー | 補足 |
|---|---|---|
| **U1 Core DS** | US-1.1 正典24確定 / US-1.2 三層トークン / US-1.3 3プロファイル / US-1.4 SemVer / US-4.4 Core昇格運用 / US-4.5 マイグレーション方針（ラッパー提供側） | 昇格資産・後方互換ラッパーは Core が提供 |
| **U2 Portal** | US-2.1 サイドナビ即時到達 / US-2.2 閲覧3形態 / US-2.3 rolling / US-2.4 3区分IA＋使い方 / US-2.5 ドッグフーディング/鶏卵回避 / US-2.6 Pages 公開 / US-2.7 操作随伴ガイド | メタデータは U1 から、版/showcase は U5/U6 出力を表示 |
| **U3 Template & Setup** | US-3.1 template 派生 / US-3.2 AI 自律セットアップ（+registry PR）/ US-3.3 Core pin＋版明示 / US-3.4 スコープ分離 | |
| **U4 Migration** | US-3.5 既存取り込み / US-3.6 段階移行・完了判定 / US-4.5 マイグレーション追従（受け側） | |
| **U5 CI/CD** | US-4.1 三層ガードレール Lint / US-4.2 VRT マージ条件 / US-4.3 バージョン自動収集 | |
| **U6 Showcase** | US-5.1 独自パーツ自動クローリング / US-5.2 発見・昇格提案 | |
| **U7 Sandbox** | US-X.1 Core 引込み検証 | 検証後削除 |

## 割当検証
- **全ストーリー割当済み**: US-1.1〜1.4, US-2.1〜2.7, US-3.1〜3.6, US-4.1〜4.5, US-5.1〜5.2, US-X.1 → すべて Unit に割当
- **横断ストーリーの扱い**: US-4.4/US-4.5（昇格・移行）は提供側=U1、受け側=U4 に分担記載
- **ペルソナ整合**: 各 Unit のオーナー（unit-of-work.md）と主ペルソナ（personas.md マトリクス）が一致

## Construction 進行順（per-unit loop）
①U1 → ②U2 ／③U3（並行可）→ ④U4 → ⑤U5 → ⑥U6（横断 U7 は U1 後随時）
各 Unit で Functional Design → NFR Req/Design → Infra Design → Code Generation → （全 Unit 後）Build & Test。
