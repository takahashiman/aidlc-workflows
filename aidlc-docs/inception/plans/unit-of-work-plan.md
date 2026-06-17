# Unit of Work Plan（Units Generation — Part 1 Planning）

> Application Design（components/services）と execution-plan のフェーズ①〜⑤を Unit へ分解。
> Unit ＝開発単位（ここでは概ね 1 Unit = 1 リポジトリ/独立成果）。下部 `[Answer]:` にご記入ください。

## 生成する Unit 成果物（チェックリスト）
- [x] `unit-of-work.md` — Unit 定義・責務・対応リポジトリ・含むコンポーネント
- [x] `unit-of-work-dependency.md` — Unit 間依存マトリクス・更新順序
- [x] `unit-of-work-story-map.md` — ストーリー（US-*）→ Unit マッピング（全ストーリー割当）
- [x] Unit 境界・依存の妥当性検証

## 提案 Unit セット（推奨）
| Unit | 名称 | リポジトリ | フェーズ | 含むコンポーネント |
|---|---|---|---|---|
| U1 | Core DS | `FIG-Core-DS` | ① | CD-1〜8 |
| U2 | Portal | `aidlc-workflows` | ② | PT-1〜8 |
| U3 | Template & Setup | `fig-ext-template` ＋ Generator | ③a | TM-1〜3 |
| U4 | Migration（既存取り込み） | （各既存→`fig-ext-*`） | ③b | EX-*、SV-4、移行チェックリスト |
| U5 | CI/CD Automation | 共有/各 repo | ④ | CI-1〜3, CI-5 |
| U6 | Showcase | CI-4 ＋ PT-6 | ⑤ | CI-4, Showcase View |
| U7 | Sandbox | `ProductA` | 横断 | SB-1（検証後削除） |

---

## 確認質問

### UQ1. Unit 粒度
A) **7 Unit（上記のとおり）**（推奨：フェーズ＋関心で自然分割）
B) **6 Unit**：U3 Template と U4 Migration を「拡張オンボーディング」1 Unit に統合
C) **5 Unit**：さらに U6 Showcase を U5 CI/CD に統合
X) Other

[Answer]: 

### UQ2. Unit オーナー（チーム整合・2名体制）
A) **U1 Core DS＝Core Maintainer 主導＋エンジニア／U2,U3,U5,U6＝エンジニア主導／U4 Migration＝移行担当／メタデータ（registry/taxonomy）＝Core Maintainer**（推奨）
B) 全 Unit エンジニア主導（Maintainer はレビューのみ）
X) Other

[Answer]: 

### UQ3. 横断 Sandbox（ProductA）の扱い
A) **独立小 Unit（U7）**（推奨：使い捨て・削除予定が明確）
B) U1 Core DS の検証タスクとして内包（独立 Unit にしない）
X) Other

[Answer]: 
