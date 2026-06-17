# Story Generation Plan（User Stories — Part 1 Planning）

> 役割: プロダクトオーナー。requirements.md（FR-1〜8/NFR）と business-overview.md を入力に、利用者視点のストーリーへ翻訳する計画。
> 下部の確認質問（`[Answer]:`）にご記入ください。記入後に Part 2（生成）へ進みます。

## 生成方法論（Part 2 実行チェックリスト）
- [x] 確定したペルソナ集合を `personas.md` に生成（アーキタイプ・目的・課題・技術文脈）
- [x] FR-1〜8 を INVEST 準拠のストーリーへ分解し `stories.md` に生成
- [x] 各ストーリーに受け入れ基準（確定形式）を付与
- [x] ペルソナ ↔ ストーリーをマッピング
- [x] 各ストーリーに構築フェーズ（①〜⑤）タグを付与（質問で確定する場合）
- [x] 受け入れ基準を自動化要件（VRT/三層Lint/移行チェックリスト/バージョン収集）と接続
- [x] Independent / Negotiable / Valuable / Estimable / Small / Testable を満たすか自己検証

## 提案ペルソナ（確認・調整してください）
1. **Core Maintainer（デザイナー）** — Core DS 正典管理・昇格レビュー・taxonomy 承認
2. **Core Engineer** — Core DS 実装・トークン・CI/CD・三層ガードレール・VRT
3. **拡張プロジェクト開発者（プロダクトエンジニア）** — template から新規派生、Core を pin して製品 UI 構築
4. **既存プロジェクト移行担当** — 既存製品を取り込み、段階移行（画面内混在禁止）
5. **AI エージェント（各チーム標準: Cursor/Claude 等）** — 使い方ページ＋プロンプトに従い自律的に複製/生成
6. **ポータル閲覧者（社内デザイナー/PdM/新規参加者）** — カテゴリからプロジェクト/コンポーネント/デモ/使い方を閲覧

## ストーリー分解アプローチ（選択肢）
- **A) Persona-Based（ペルソナ別）**：利用者ごとに必要な機能をまとめる
- **B) User Journey-Based（ジャーニー別）**：行動フロー（派生→構築→昇格 等）に沿う
- **C) Feature-Based（機能別）**：Core/拡張/ポータル/運用/CI 等の機能で整理
- **D) Epic-Based（エピック階層）**：FR をエピック、配下にストーリー
- **E) Hybrid（推奨）**：**エピック=構築フェーズ①〜⑤、その中をペルソナ×ジャーニーで分解**

---

## 確認質問

### SQ1. ペルソナ集合
上記6ペルソナで過不足ありませんか。

A) 6ペルソナで確定（推奨）
B) 統合する（例: Core Maintainer と Core Engineer を「Core チーム」に集約）
C) 追加する（X に記載）
X) Other

[Answer]: Core Engineerと拡張プロジェクト開発者（プロダクトエンジニア）を統合。それ以外は問題ない。よって5ペルソナとなる。

### SQ2. ストーリー分解アプローチ
A / B / C / D / E（Hybrid 推奨）から選択。

[Answer]: E

### SQ3. 粒度
A) エピック（FR/フェーズ）→ ストーリー の2階層（推奨）
B) エピック → ストーリー → タスクまで細分
C) ストーリーのみ（フラット）
X) Other

[Answer]: A

### SQ4. 受け入れ基準の形式
A) **Given/When/Then**（Gherkin 風・推奨。VRT/Lint と接続しやすい）
B) 箇条書きチェックリスト
C) 両方併記
X) Other

[Answer]: A

### SQ5. 構築フェーズ（①Core→②ポータル→③template/既存取り込み→④CI/CD→⑤showcase）タグ付け
A) 各ストーリーにフェーズタグを付与（推奨。Workflow Planning と接続）
B) 付与しない
X) Other

[Answer]: A

### SQ6. 今回のストーリー化の範囲
A) FR-1〜8 を**全網羅**（フェーズタグで優先度表現）（推奨）
B) フェーズ①②（Core DS＋ポータル）を優先し、③〜⑤は概略のみ
C) その他
X) Other

[Answer]: A

---

## Finalized Decisions（回答反映）
- **ペルソナ＝5種**（SQ1: Core Engineer と 拡張プロジェクト開発者 を「エンジニア」に統合）:
  1. Core Maintainer（デザイナー）
  2. **エンジニア**（Core 実装＋拡張開発を兼務）
  3. 既存プロジェクト移行担当
  4. AI エージェント（各チーム標準）
  5. ポータル閲覧者
- **分解アプローチ＝E (Hybrid)**（SQ2）: エピック＝構築フェーズ①〜⑤、配下をペルソナ×ジャーニーで分解
- **粒度＝2階層**（SQ3）: エピック → ストーリー
- **受け入れ基準＝Given/When/Then**（SQ4）
- **フェーズタグ付与**（SQ5）
- **範囲＝FR-1〜8 全網羅**（SQ6）
