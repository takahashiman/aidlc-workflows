# U3 Code Gen — Step1〜7 要約

> 生成先: `aidlc-workflows/fig-ext-template/`。検証: `node scripts/init.mjs --dry-run`=成功。

## Step1 scaffold（US-3.1/TM-1）
- `fig-ext-template/`: project-settings.json（seed＋category 追加＋schema 参照をローカルへ）・project-settings.schema.json（Core 正典のローカル検証コピー）・index.html（Core を `core/` submodule 参照へ付替・data-testid）・styles/extensions.css（seed）・components/.gitkeep・core/.gitkeep（submodule 枠）・CORE-DS-VERSION（v1.0.0）

## Step2 init.mjs（US-3.2/3.3/TM-3）
- `scripts/init.mjs`: project-settings 駆動で signature 色/profile/表示名/CORE-DS-VERSION を冪等適用。`--dry-run`（差分プレビュー）/`--verify`（必須値・CORE-DS-VERSION↔submodule 整合 BR-PIN-3）。ステップ fail-stop・適用後再検証

## Step3 Interactive Prompt Generator（US-3.2/TM-2・正典移管）
- `tools/prompt-generator/{index.html,generator.js}`: vanilla・自己完結。フォーム→①project-settings.json ②セットアッププロンプト。入力検証（命名 NAME_RE/必須/preset/SemVer/owners）。signature presets は Core 正典のローカルコピー（出典明記）。CSP メタ・data-testid

## Step4 Runbook＋ScopeManifest（US-3.2/3.4）
- `AGENTS.md`: SetupRunbook（derive→duplicate→apply→pin→wire-ci→register→verify・冪等・禁止事項）
- `SKILL.md`: ScopeManifest（参照は Core＋本製品のみ・鶏卵回避/仮パーツ・昇格提案・Core pin）

## Step5 registry 自動 PR（ADQ3/TM-3）
- `.github/workflows/register.yml`: project-settings から registry エントリ生成→Core へ cross-repo PR（最小権限 REGISTRY_PR_TOKEN・Actions SHA pin・自動マージ禁止・taxonomy 追記案）

## Step6 CI 雛形（FDQ6）
- `.github/workflows/ci.yml`: 三層 Lint/VRT フック/CORE-DS-VERSION↔submodule 整合チェック（実体は U5 共有設定参照・Actions SHA pin・submodules recursive）

## Step7 docs
- `README.md`: 派生→入力→AI 実行→CI→登録 の手順、規約、要ユーザー操作（GitHub Template 化・最小権限トークン・SHA 更新）

## ストーリー網羅
US-3.1(Step1) / US-3.2(Step2,3,4) / US-3.3(Step2) / US-3.4(Step4) / registry PR(Step5) / CI(Step6)

## 要ユーザー操作
- fig-ext-template を独立 repo 化＋Template Repository 設定有効化
- REGISTRY_PR_TOKEN（Core への PR のみ許可の最小権限）登録
- ci.yml/register.yml の Actions SHA を最新化／U5 共有 Lint・VRT 配線
- 既存 portal/src/ai-co-creation.js は本 Generator が正典移管（将来ポータルから撤去し導線参照へ）
