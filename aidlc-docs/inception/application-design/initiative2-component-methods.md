# Application Design — Component Methods（イニシアチブ#2）

> 主要メソッド/手順の signature・入出力（高レベル）。詳細ビジネスルールは各 Unit の Functional Design。

## C-Palette（Core / FIG-UDS）★中核
| メソッド | 入力 | 出力 | 目的 |
|---|---|---|---|
| `generateSignaturePalette(seed, opts)` | seed: Color（hex/oklch）, opts: {lightΔ, darkΔ, tintα, shadowα, ramp?} | `{ base, light, dark, tint, shadow, onColor, ramp[]? }` | seed から signature 派生一式を OKLCH 演算で生成 |
| `generateStatusPalette(opts)` | opts: {mode: 'independent'\|'harmonized', seedHue?} | `{ success, warning, danger, onSuccess, onWarning, onDanger }` | status 色を法則生成（AD5-2=B・調和 or 独立） |
| `validateA11y(fg, bg)` | fg, bg: Color | `{ ratio: number, passAA: bool, passAAA: bool }` | WCAG コントラスト検証（**status/on-color で必須**） |
| `emitTokens(palette)` | palette | CSS custom props（`--signature-*` / `--status-*`） | semantic 層が参照する CSS 変数を出力 |

- **規則（draft）**: base=seed / light=L+0.08 / dark=L−0.10（H 固定）/ tint=α0.10 / shadow=α0.25 /
  on-color=コントラスト≥4.5 を満たす white/dark を自動選択 / tonal ramp=L 固定ステップ（任意）。
- **不変条件**: 生成した on-color・status は **AA 不合格なら採用不可**（生成失敗として再調整 or fallback）。

## C-Signature（製品）
| メソッド | 入力 | 出力 | 目的 |
|---|---|---|---|
| `injectSignature(seed)` | seed=`#2C6B5E` | 製品 signature/status トークンセット | C-Palette を呼び旧 DS の手動派生 teal-* を置換 |

## C-Distrib（製品）
| メソッド | 入力 | 出力 | 目的 |
|---|---|---|---|
| `addCoreSubmodule(repo, ref)` | Core repo, tag | submodule | Core を pin 取込 |
| `pinVersion(tag)` | tag | `CORE-DS-VERSION` | 参照版を明示 |
| `importCoreCss(entry)` | css エントリ | import 文 | primitives/semantic/tokens を Vite で読込 |
| `verifyViteBuild()` | — | pass/fail | `vite build` 非回帰確認 |

## C-Bridge（製品・宣言的 CSS）
- 実体は CSS。`@theme { --color-primary: var(--fig-color-surface-brand); ... }` の**対応表**。メソッドなし。
- 入出力: Core semantic 変数 → アプリ Tailwind/`@theme` 変数。

## C-PortalIA（ポータル）
| メソッド | 出力 | 目的 |
|---|---|---|
| `renderRoleEntry()` | 役割別入口ビュー | 開発者/利用者/管理者の入口（FR2-9） |
| `renderScenarioFlow(scenario)` | シナリオ別フロービュー | A 既存/② 新規（FR2-10） |
| `renderOnboarding()` | ランディング | 「はじめに読む順番」（FR2-13） |
| `renderBrowseMargin()` | 閲覧余白ビュー | 未整備コンポ閲覧（FR2-15） |
| `renderGithubGuide()` | GitHub 操作案内 | 昇格/移行の操作手順（FR2-12・US-X3） |

## C-Promo（製品 ⇄ Core）
| メソッド | 入力 | 出力 | 目的 |
|---|---|---|---|
| `extractPattern(name)` | パターン名 | 抽出成果物 | 使用ドメインパターンを抽出（画像03①②） |
| `toLivePreview(artifact)` | 成果物 | `preview/*.html`＋`spec.md` | Core Live Preview 形式化 |
| `openPromotionIssue(label)` | temp-part/core-promotion | Issue | 提案导线（AD2=C） |
| `openPromotionPR()` | preview/spec | PR | 実体提案（AD2=C） |
| `confirmPromotion()` | merge 後 | 確認 | 昇格・新規コンポ確認（画像03④） |

## C-UXFlow（製品 / Pencil）
| メソッド | 入力 | 出力 | 目的 |
|---|---|---|---|
| `captureScreenFlow(screens)` | 主要画面 | .pen / 書き出し | 画面遷移/UX を Pencil 表現 |
| `reviewFlow()` | .pen | レビュー結果 | 確認（既存非回帰の線引き） |
| `reflectToCode()` | レビュー結果 | コード変更 | 実装へ反映（実装が正典） |

## C-Record（ポータル）
| メソッド | 目的 |
|---|---|
| `appendJournalStep(step)` | dev-flow-journal を各ステップで更新 |
| `appendSessionLog(entry)` | session-log に対話/生成を記録 |
| `harvestForPortal()` | ポータル反映候補を棚卸し |
