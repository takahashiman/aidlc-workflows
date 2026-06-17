# U3 Template & Setup — NFR Requirements

> 確定回答: NRQ1-7 = すべて A。プロジェクト全体 NFR（WCAG 2.1 AA／Security Baseline／SemVer／三層／PBT 無効）を前提に U3 固有要件を定義。

## 1. 信頼性 / 冪等性要件（NRQ2/7=A）
| ID | 要件 |
|---|---|
| REL-1 | SetupRunbook の各ステップは冪等（再実行で重複・破壊しない / BR-IDEM-1） |
| REL-2 | 完了検証チェックリスト（必須値・Core pin・CI 配線・registry PR の存在 / BR-IDEM-2） |
| REL-3 | dry-run（差分プレビュー）を提供し、適用前に変更内容を確認できる |
| REL-4 | 失敗は当該ステップで停止し理由を提示（部分適用で放置しない） |
| REL-5 | 初期化は Node スクリプトでローカル/CI 双方から実行可・オフライン可（NRQ7=A） |

## 2. セキュリティ要件（Security Baseline・NRQ3/4=A）
| ID | 要件 | 区分 |
|---|---|---|
| SEC-1 | registry/taxonomy への書込は最小権限トークン＋ブランチ経由 PR のみ。直接 push 禁止 | enforce |
| SEC-2 | registry PR は CI 登録検査（U5/CI-5）＋ Core Maintainer 必須レビューを通過（自動マージ禁止） | enforce |
| SEC-3 | Core は submodule で pin＋`CORE-DS-VERSION` 整合検査（不一致で fail / BR-PIN-3） | enforce |
| SEC-4 | CI の GitHub Actions は SHA pin（タグ流動回避） | enforce |
| SEC-5 | 依存の脆弱性管理（SCA。npm audit 等。devDeps 最小化） | enforce |
| SEC-6 | 秘密はリポジトリに置かずシークレット管理（PR 起票トークン等） | enforce |
| SEC-7 | スコープ分離: AI コンテキストは Core＋対象製品のみ（他事業製品の混入禁止 / §5） | enforce |
| SEC-N1 | サーバ認証/認可/DB | N/A（テンプレ＋静的 Generator・サーバ無し） |

## 3. 保守性要件（NRQ1/2=A）
| ID | 要件 |
|---|---|
| MAINT-1 | Generator は vanilla JS・最小依存（既存 ai-co-creation.js 正典化 / FDQ8=A） |
| MAINT-2 | `project-settings.json` は Core 正典 `project-settings.schema.json` で検証（機械可読契約） |
| MAINT-3 | CI ロジックの実体は U5 共有設定を参照（テンプレは配線・二重実装しない / BR-CI-2） |
| MAINT-4 | signature presets は Core 正典を参照（乖離時 JSON が正典 / BR-GEN-3） |
| MAINT-5 | SetupRunbook・ScopeManifest は SKILL.md/AGENTS.md に明文化（ツール非依存表現） |

## 4. アクセシビリティ要件（NRQ6=A / Q8=A）
| ID | 要件 |
|---|---|
| A11Y-1 | Interactive Prompt Generator は WCAG 2.1 AA（フォームラベル/エラー関連付け・キーボード・コントラスト） |
| A11Y-2 | エラーは aria-describedby 等で入力に関連付け、ValidationSummary を支援技術に通知 |

## 5. スコープ分離要件（US-3.4・NRQ5=A）
| ID | 要件 |
|---|---|
| SCOPE-1 | マルチレポ物理分離を主とし、AI へ渡すコンテキストを Core＋対象製品 repo のみに限定 |
| SCOPE-2 | ScopeManifest を SKILL.md/AGENTS.md に明文化（BR-SCOPE-2） |
| SCOPE-3 | 他事業製品 repo は不可視（参照・混入禁止 / BR-SCOPE-3） |

## 6. ブラウザ対象（NRQ6=A）
- モダン・エバーグリーン（Chrome/Edge/Safari/Firefox 最新）。U2/Core と整合。

## 7. トレーサビリティ（NFR → Story）
| NFR | Story |
|---|---|
| REL | US-3.2 |
| SEC（PR/pin/scope） | US-3.2/3.3/3.4・ADQ3 |
| A11Y/MAINT | US-3.2 |
| SCOPE | US-3.4 |
