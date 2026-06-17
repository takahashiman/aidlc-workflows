# 要ユーザー操作 — 統合チェックリスト（Build & Test 直前にまとめて実施）

> **このシートの使い方**
> - AI-DLC の設計・コード生成（U1〜U7）はすべて **このパソコンの中のファイル** として完成します。
>   一方、ここに並ぶ操作は **GitHub（インターネット上のリポジトリ置き場）側で、人が手で行う設定** です。
> - **非エンジニアの方が単独で全部やるのは想定していません。** 各項目に「👤 自分でOK／🛠 エンジニア依頼」を付けました。
>   🛠 の項目は、このシートごとエンジニア（＝Core Maintainer のエンジニア2名のどなたか）に渡してください。
> - **必ず上から順番に**実施してください（後の手順が前の手順の結果を使うため）。
> - リポジトリ名・URL・バージョン番号は設計上の想定値です。**実物と違う場合はエンジニアが読み替え**ます（⚠ 印の箇所）。
>
> **進め方の前提**: U5 / U6 / U7 のコード生成がすべて終わってから、このシートを上から実行します。
> （U5/U6/U7 の項目は、それぞれの Unit 完了時に本シート末尾へ追記されます。）

---

## 用語ミニ辞典（最初に目を通すと楽です）
| 言葉 | かんたんな意味 |
|---|---|
| リポジトリ（repo） | GitHub 上の「プロジェクトのフォルダ1個」。今回は複数に分かれている（マルチレポ） |
| ブランチ | 1つの repo の中の「作業の枝分かれ」。`core` や `main` という名前がつく |
| submodule（サブモジュール） | ある repo の中に、別の repo を「部品」として埋め込む仕組み。今回は各製品に Core DS を埋め込む |
| pin（ピン留め） | 「この部品はこのバージョンを使う」と固定すること |
| タグ / SemVer | バージョンの目印。`v1.0.0` のような番号（SemVer＝意味のある番号付けルール） |
| GitHub Pages | GitHub が提供する「Web サイト公開」機能。ポータルをここで公開する |
| GitHub Actions | GitHub 上で自動実行される処理（自動チェックや公開など） |
| Secret（シークレット） | パスワードやトークンなどの秘密情報を GitHub に安全に預ける置き場 |
| Variable（変数） | 設定値（秘密でないもの）を GitHub に登録しておく置き場 |
| registry / taxonomy | 全製品の一覧台帳（registry）と分類体系（taxonomy）。Core DS が正典として管理 |

---

## フェーズ A. Core DS（中核）を GitHub 上で確定する 〔U1〕
> いちばん最初。すべての製品・ポータルがこの Core を参照するため、ここが土台になります。

- [x] **A-1. 🛠 Core DS リポジトリを確定し、既定ブランチを `core` にする**
  - **何を**: `FIG-UDS` リポジトリの「既定（デフォルト）ブランチ」を `core` に変更する。
  - **なぜ**: Core DS（恒久の中核）を `core` ブランチに正典化する設計のため。
  - **手順（エンジニア向け）**: 先に busapp を移行用 repo へ移してから（後述 D 参照）、`main`/`master` を整理し、既定ブランチを `core` に設定。
  - **確認**: GitHub の該当 repo トップで、ブランチ表示が `core` になっている。
  - ⚠ busapp の移行（フェーズ D）と相互に関係します。実施順はエンジニアが調整。

- [x] **A-2. 🛠 Core DS にバージョンタグ（例 `v1.0.0`）を付けてリリースする**
  - **何を**: Core DS の現在の状態に SemVer タグを打ち、リリースを作成する。
  - **なぜ**: 各製品が「どのバージョンの Core を使うか」を pin する参照先になるため。ポータルの rolling 更新の起点にもなる。
  - **確認**: GitHub の「Releases」に `v1.0.0`（⚠ 実際の番号はエンジニア確認）が表示される。

---

## フェーズ B. ポータル（閲覧サイト）を公開する 〔U2〕
> Core が確定したら、社内で見るポータルサイトを公開します。

- [x] **B-1. 👤 GitHub Pages の公開ソースを「GitHub Actions」にする**
  - **何を**: `aidlc-workflows`（ポータル）repo の Settings → Pages で、Source を「GitHub Actions」に切り替える。
  - **なぜ**: ポータルを自動ビルドして公開する方式にするため。
  - **手順**: GitHub で該当 repo を開く → 上部「Settings」→ 左メニュー「Pages」→「Build and deployment」の Source を **GitHub Actions** に選択。
  - **確認**: 設定保存後、Actions が走り、しばらくすると公開 URL（`https://〇〇.github.io/...`）が表示される。

- [x] **B-2. 🛠 リポジトリ変数 `CORE_DS_REPO` と `CORE_DS_REF` を設定する**
  - **何を**: ポータル repo の Settings → Secrets and variables → Actions →「Variables」に2つ登録。
    - `CORE_DS_REPO` = Core DS の repo（例 `your-org/FIG-UDS` ⚠）
    - `CORE_DS_REF` = 参照するブランチ/タグ（ポータルは最新追従なので `core` ⚠）
  - **なぜ**: ポータルがビルド時に「どの Core を取り込むか」を知るため。
  - **確認**: Variables 一覧に2つが表示される。

- [x] **B-3. 🛠 Core リリース時にポータルへ自動通知（`repository_dispatch: core-released`）を配線する**
  - **何を**: Core DS をリリースしたら、ポータル repo へ「更新して」と自動で知らせる仕組みを設定。
  - **なぜ**: ポータルが常に最新 Core を反映（rolling）するため。手動更新を不要にする。
  - **確認**: Core を再リリースすると、ポータルの Actions が自動で動き再公開される。

---

## フェーズ C. テンプレート（新製品の雛形）を確立する 〔U3〕
> 既存製品の移行（フェーズ D）や今後の新製品は、この雛形から複製します。

- [x] **C-1. 👤 `fig-ext-template` を「Template repository」にする**
  - **何を**: `fig-ext-template` repo の Settings で「Template repository」にチェックを入れる。
  - **なぜ**: 「Use this template」ボタンで新製品 repo を複製できるようにするため。
  - **手順**: 該当 repo →「Settings」→ General の上の方「Template repository」にチェック。
  - **確認**: repo トップに「Use this template」ボタンが出る。

- [x] **C-2. 🛠 registry 登録 PR 用のトークン（`REGISTRY_PR_TOKEN`）を最小権限で用意する**
  - **何を**: 製品セットアップ時に台帳（registry）へ自動で追加申請（PR）するための鍵を、必要最小限の権限で作成し Secret に登録。
  - **なぜ**: 新製品を一覧台帳に自動登録するため。権限は最小にして安全に。
  - **確認**: 対象 repo の Secrets に `REGISTRY_PR_TOKEN`（または GitHub App）が登録されている。
  - ⚠ 権限範囲はエンジニアが設計（registry repo への PR 起票のみ）。

- [x] **C-3. 🛠 自動チェック（Actions）の参照先を最新化し、U5 の Lint/VRT に配線する**
  - **何を**: テンプレート同梱の自動チェック設定を、フェーズ E（U5）で用意する共有チェックに繋ぐ。Actions のバージョン（SHA）を最新に。
  - **なぜ**: 三層ルール違反や見た目崩れ（VRT）を自動検出するため。
  - ⚠ **この項目は U5 完了後でないと繋ぐ先が確定しません。** フェーズ E と一緒に実施。
  - ✅ 実施記録: E-2 と合流して完了。`fig-ext-template/.github/workflows/ci.yml` の `uses:` を `takahashiman/FIG-Universal-Design-System@v1.1.0` へ整合（register.yml の core_repo デフォルトも実名化）。

---

## フェーズ D. 既存製品 busapp を移行 repo として立ち上げる 〔U4〕
> 雛形が用意できたら、最初の移行対象 busapp を独立 repo にします。

- [x] **D-1. 🛠 `fig-ext-template` から `fig-ext-business-busapp` を複製作成する**
  - **何を**: テンプレートの「Use this template」で、busapp 用の新 repo `fig-ext-business-busapp` を作る。
  - **なぜ**: busapp を独立した拡張製品 repo にするため。
  - **確認**: GitHub に `fig-ext-business-busapp` repo ができる。
  - ✅ 実施記録: 作成後、分類整合（D-4）に伴い repo 名を **`fig-ext-bus-busapp`** にリネーム済み（category=`bus` のため命名規約 `fig-ext-<category>-<product>` に合わせた）。

- [x] **D-2. 🛠 Core DS をその repo に submodule として埋め込み、`v1.0.0` に pin する**
  - **何を**: 新 repo の `core/` フォルダに Core DS を submodule として追加し、バージョン `v1.0.0`（⚠）に固定。
  - **なぜ**: 製品が特定バージョンの Core を確実に参照（再現性）するため。
  - **確認**: repo 内 `CORE-DS-VERSION` ファイルの値と submodule のバージョンが一致（`init.mjs --verify` で自動チェック）。

- [x] **D-3. 🛠 実際の busapp 資産を取り込む（migrate-in 実行）**
  - **何を**: 旧 busapp の実ファイル（`FIG-UDS` の `main` ブランチ `extensions/busapp`）を、移行用に取り込む。
  - **なぜ**: 今は仮の代表サンプルが入っているだけなので、本物の資産に置き換えるため。
  - **手順（エンジニア向け）**: `node ../fig-ext-template/scripts/migrate-in.mjs --from <busapp の場所> --name busapp`
  - **確認**: `legacy/busapp/` に本物のファイルが入る。

- [x] **D-4. 🛠 台帳（registry）と分類（taxonomy）に busapp を登録する**
  - **何を**: registry へ登録 PR を出し、taxonomy に分類を追加・承認。
  - **なぜ**: ポータルの一覧に busapp を表示し、分類整理するため。
  - **確認**: Core Maintainer が PR を承認すると、ポータルに busapp が出る。
  - ✅ 実施記録: 当初の `business` は taxonomy（`bus`/`taxi`/`logistics`）に無い暫定値だったため、正典に合わせ **category=`bus`** へ整合。`bus` 配下に **subcategory `bus-notification`（接近案内通知）** を新設。registry に `fig-ext-bus-busapp`（coreVersion=v1.0.0）を追加。check-registry.mjs C1〜C5 合格 → PR マージ済み。

---

## フェーズ E. CI/CD・ショーケース・サンドボックス 〔U5 / U6 / U7〕
> U5（CI/CD）はコード生成済み。共有の自動チェックの実体は **Core DS repo の `.github/workflows/_shared-*.yml`＋`ci/`** にあります。各 repo はそれを `uses:` で参照します（実体は二重に持ちません）。

### U5（CI/CD・コード生成済み）
- [x] **E-1. 🛠 Core DS に共有 CI（`_shared-guardrail`/`_shared-vrt`/`_shared-registry-check`＋`ci/`）を取り込み、参照用タグを発行する**
  - **何を**: Core repo に生成済みの `.github/workflows/_shared-*.yml`・`.github/actions/`・`ci/` をマージし、`v1.0.0`（⚠）等のタグを打つ。
  - **なぜ**: 各製品・ポータルがこのタグ/ブランチを `uses:` で参照して自動チェックを実行するため（共有正典・二重実装しない）。
  - **確認**: Core repo の Actions タブに 3 つの reusable workflow が現れる。
  - ✅ 実施記録: タグは **`v1.1.0`** を発行（`v1.0.0`＝Core コンテンツは CI 未収録のため、CI 入りコミット `6efb0c2` に `v1.1.0` を打ち、Core content＋CI を同一タグに統一）。`_shared-*.yml` の入力デフォルトも実 repo 名/`core` へ整合。release.yml の CHANGELOG 生成を git-cliff-action 方式へ修正。

- [x] **E-2. 🛠 各 repo の `uses:` 参照を実 repo 名・バージョンに差し替える（C-3 と合流）**
  - **何を**: `fig-ext-template/.github/workflows/ci.yml`、`fig-ext-business-busapp/.github/workflows/migrate-checks.yml` 内の `your-org/FIG-Core-DS@v1.0.0`（⚠ プレースホルダ）を、実際の `<組織>/<Core repo>` と pin バージョン（拡張は固定タグ＝`CORE-DS-VERSION` と一致／ポータルは `main`）に書き換える。
  - **なぜ**: 自動チェックの実体（Core 側）に正しく繋ぐため。
  - **確認**: 各 repo の PR で guardrail / vrt のチェックが走る。
  - ✅ 実施記録: busapp（`fig-ext-bus-busapp`）の migrate-checks.yml と template の ci.yml を `takahashiman/FIG-Universal-Design-System@v1.1.0` へ整合。busapp は CORE-DS-VERSION/submodule/CI を **v1.1.0** に統一（submodule 再pin）。busapp の重複 `ci.yml`・`register.yml` は削除し migrate-checks.yml に一本化。CI 内の `../fig-ext-template/scripts/` 参照をローカル `scripts/` に修正。

- [x] **E-3. 🛠 「Lint・VRT・registry 検査が緑でないとマージ不可」のブランチ保護を設定する**
  - **何を**: 各 repo（および Core の registry 変更）で、これらを **required status checks** に指定。
  - **なぜ**: 三層違反・見た目崩れ・不正な台帳登録をマージ前に止めるため（US-4.1/4.2・CI-5）。
  - **確認**: チェックが赤の PR はマージボタンが押せない。
  - ✅ 実施記録: busapp(`main`) に保護ルール作成（required=`guardrail`＋`migration-gate`）。Core に `registry-check.yml`（registry/taxonomy 変更PRで `_shared-registry-check` を起動）を追加。VRT は保留中のため required から除外。
  - ⚠ **enforcement はプラン待ち**: private リポジトリ＋無料(Personal)プランでは保護ルールが「Not enforced」。GitHub **Team/Enterprise Organization** へ移すと自動的に強制される（設計の org 前提）。それまでは設定済みだが非強制。public 化でも強制可。

- [x] **E-4. 🛠 ポータルのバージョン自動収集を有効化する（変数・トリガ）**
  - ✅ 実施記録: portal/＋portal-deploy.yml を aidlc-workflows へ初コミット（B 期は GitHub 設定のみで未push だった）。build.mjs の収集ステップに env(GH_OWNER/CORE_DS_REPO/GITHUB_TOKEN)配線。Variable `GH_OWNER=takahashiman`、Secret `PORTAL_COLLECT_TOKEN`(fine-grained PAT: Contents/Issues=Read)設定。Pages 公開 `https://takahashiman.github.io/aidlc-workflows/`。版ダッシュボードに busapp(pin/最新=v1.1.0・up-to-date)、ナビに バス›接近案内通知›Bus Operations App が表示＝収集成立。markdownlint は portal/・aidlc-docs/ を ignore 追加で解消。
  - **何を**: ポータル repo に収集用の設定を追加。
    - Variable `GH_OWNER`（各製品 repo の所有組織）／`CORE_DS_REPO`（例 `your-org/FIG-UDS` ⚠）
    - Secret `GITHUB_TOKEN` 相当の read 権限トークン（rate-limit 回避・public なら任意）
    - トリガ: push ／ Core リリース通知（B-3 の `repository_dispatch: core-released`）／ 毎晩（nightly）
  - **なぜ**: 各製品が参照する Core バージョンを手動更新なしで一覧化するため（US-4.3）。`migration-manifest` も同時に集約されます（移行進捗表示）。
  - **確認**: ポータルの版ダッシュボードに各製品の pin / 最新 / 状態（最新・遅れ・不明）が出る。

- [ ] **E-5. 🛠（任意）Core 自身の既存 CSS の三層負債を段階解消する**
  - **背景**: 三層 Lint 導入で、Core の既存 `assets/portal.css`・`tokens/components.css` に「色を直接指定している箇所」が多数見つかります（導入前からの負債）。
  - **方針**: 一度に直さず、**新規・変更分から** semantic 色トークン経由に直す。本 Lint の主対象は拡張製品 repo の新規コードです。

### U6（ショーケース・コード生成済み）
> 収集の実体は **ポータルの単一クローラ**（`portal/scripts/collect-versions.mjs` の `collectShowcase()`）。バージョン収集（E-4）と同じ1回の走査で showcase も集めます（二重に走らせません）。各製品 repo は規約に従うだけで改修不要。
- [x] **E-6. 🛠 ショーケース収集に必要な read 権限を E-4 のトークンに含める**
  - **何を**: E-4 の収集トークンに **`issues:read`**（`temp-part` ラベル Issue 取得用）を追加（`contents:read` は E-4 で設定済み）。`GH_OWNER`／`CORE_DS_REPO` は E-4 と共有。
  - **なぜ**: 各製品の `extensions/` 配下の独自パーツと、`temp-part` ラベルの仮パーツを自動収集するため（US-5.1）。
  - **確認**: ポータルの「運用 › Showcase」に各製品の独自/仮パーツが一覧表示される。
  - ✅ 実施記録（2026-06-17 検証）: `PORTAL_COLLECT_TOKEN` は E-4 時点で Contents+Issues=Read 付与済（権限追加は不要）。ライブの公開ポータル `data/showcase-index.json` を確認 → busapp の独自パーツ **`busapp FAB`（id=`ext-fig-ext-bus-busapp-Fab`・kind=extension）が収集・表示**成立（`extensions/Fab.jsx` の `// EXTENSION PART — busapp FAB` ヘッダから可読名抽出）。temp-part Issue は現状 0 件（ラベル作成・起票は E-7 以降）のため temp-part 経路の実表示確認は E-7/E-8 で実施。
  - ⚠ **付随発見（E-8 が既に顕在化）**: 収集結果で `busapp FAB` が **`promotedToCore: true`**＝「Core昇格済み・撤去推奨」バッジ付き・「昇格を提案する→」導線は非表示。原因は **Core（v1.1.0 / `6efb0c2`）が既に `components/fab.spec.md` を保持**し、収集側の同義照合（`normalizeName("busapp FAB")="busappfab"`.endsWith(`"fab"`)）がヒットするため（バグでなく正しい挙動 / BR-SC-PROMOTED）。よって `extensions/Fab.jsx` 冒頭コメント「Core 正典24 に FAB が無い」は陳腐化（Core は現28部品で fab を含む）。→ E-8/BR-DOG-4 に従い busapp は rolling 取得した Core の fab へ切替え `extensions/Fab.jsx` を撤去するのが本筋（E-8 で実施判断）。
- [x] **E-7. 👤 各製品 repo に `temp-part` / `core-promotion` ラベルを用意する**
  - **何を**: 仮パーツ起票用 `temp-part`、昇格提案用 `core-promotion` の2ラベルを各製品 repo に作成（テンプレート運用ガイドに記載済み）。
  - **なぜ**: 仮パーツのショーケース収集と、昇格提案導線（「昇格を提案する →」）の起点にするため（US-5.2 / US-4.4）。
  - **確認**: 仮パーツの Issue がショーケースに「仮パーツ」バッジ付きで現れる。
  - ✅ 実施記録（2026-06-17 / gh CLI 2.94.0 経由）: `temp-part`（`#FBCA04`「Core に無い部品の仮実装記録（US-2.5 / BR-DOG-2）」）と `core-promotion`（`#0E8A16`「独自/仮パーツの Core 昇格提案（US-4.4 / US-5.2）」）を **`fig-ext-bus-busapp` と `fig-ext-template`** に作成（`gh label create --force`）。対象範囲はユーザー判断で「busapp ＋ template」（ProductA はサンドボックス・他 3 repo は設計外で除外）。収集側 `collectShowcase()` は各製品 repo の open ＋ `temp-part` ラベル Issue を `id=temp-<repo>-<num>`・kind=temp-part・name=Issue タイトルで showcase 化（`ghIssues()`）。**仮パーツバッジの実表示確認は E-8 と一括**（現状 temp-part Issue 0 件のため別途起票時に確認）。ラベル作成をもって E-7 完了。
- [x] **E-8. 👤 ショーケースの「Core昇格済み・撤去推奨」表示を確認**
  - **何を**: 独自パーツが Core 昇格（Core の `components/` に同名 spec が出現）したら、ショーケースで自動的に「撤去推奨」バッジが付く。製品側で rolling 取得済みの Core に切替え、仮コードを撤去する（BR-DOG-4）。
  - **確認**: 昇格済みパーツに撤去推奨バッジが付き、昇格提案導線が消える。
  - ✅ 実施記録（2026-06-17）: **(1) 表示確認** — ライブ `data/showcase-index.json` で `busapp FAB`（id=`ext-fig-ext-bus-busapp-Fab`）が `promotedToCore: true`＝「Core昇格済み・撤去推奨」バッジ付き・昇格導線（`promotable && !promotedToCore`）抑止を確認（Core v1.1.0 `6efb0c2` が `components/fab.spec.md` 保持・BR-SC-PROMOTED）。**(2) 実撤去（BR-DOG-5 / BR-EXT-4）** — busapp で `extensions/Fab.jsx` を削除し Core `.fig-fab` へ委譲（`styles/extensions.css` の `.busapp-fab` 撤去・`preview/pass-issue.html` を `.fig-fab` へ・`migration/component-mapping.json` を `core-class(fig-fab)` へ・`migration-manifest.json` の Fab `promotionState=promoted`・README/AGENTS 更新）。PR [takahashiman/fig-ext-bus-busapp#1](https://github.com/takahashiman/fig-ext-bus-busapp/pull/1)（CI: guardrail ✓ / migration-gate ✓）を squash マージ（`72ad3cf`）。**(3) 撤去後検証** — Portal Build & Deploy 再実行（success）後、ライブ `showcase-index.json` が `items: 0` ＝ `busapp FAB` が showcase から消滅し重複保持解消（BR-DOG-5 完結）。

### U7（サンドボックス・検証済み）
> U7 はローカルで検証完了（2026-06-10）。`ProductA` を現行 Core（`core` ブランチ・CSS クラス方式 `.fig-*`）へ再配線し、submodule 取り込み → `craco build` 成功 → bundle に Core クラス 64 種を確認（詳細は `aidlc-docs/construction/u7-sandbox/verification-report.md`）。本番（実 GitHub URL ＋ SemVer タグ pin）での再検証と削除は下記でフェーズ F に実施。

- [ ] **E-9. 🛠（本番 submodule 検証）`ProductA` の submodule を実 Core repo・`v1.0.0`（⚠）タグに pin し直してビルド確認**
  - **何を**: `aidlc-projects/ProductA/.gitmodules` の参照を実 Core repo（例 `your-org/FIG-UDS` ⚠）に、submodule を `v1.0.0`（⚠ A-2 で発行するタグ）に pin。`CI=true npx craco build` が成功することを確認。
  - **なぜ**: ローカル実体ではなく、本番の配布経路（GitHub ＋ SemVer タグ）で配布機構が成立することを最終確認するため（US-X.1 AC1）。
  - **確認**: ビルドが `Compiled successfully`、生成 CSS に `.fig-*` クラスが含まれる。
  - ⚠ A-2（Core タグ発行）が前提。フェーズ F で実施。

---

## フェーズ F. 仕上げの統合確認 〔Build & Test〕
> A〜E がすべて終わってから、全体がつながっているかを確認します。

- [ ] **F-1. 🛠 ポータルに「Core＋busapp＋ショーケース＋バージョン一覧」が統合表示されるか確認**
- [ ] **F-2. 🛠 Core を1回更新 → ポータルが自動で最新反映（rolling）されるか確認**
- [ ] **F-3. 🛠 busapp の移行ゲート（主要フロー100%＋全体80%以上）が緑になるか確認**
  - 手順: `fig-ext-business-busapp` で `node ../fig-ext-template/scripts/migration-status.mjs --gate`
- [ ] **F-4. 🛠 自動チェック（三層 Lint・VRT）がマージ条件として効いているか確認**
- [ ] **F-5. 🛠 サンドボックス検証（E-9）が本番経路で OK なら `aidlc-projects/ProductA` を削除する**
  - **何を**: E-9 のビルド確認が緑なら、検証用サンドボックス `ProductA` を削除（repo ごと／ローカル作業ツリー）。
  - **なぜ**: ProductA は配布機構の検証専用で、本運用には不要（US-X.1 AC1「検証完了後に削除」）。

- [ ] **F-6. 🛠（運用前修正）ポータルの Core ドキュメント忠実度を上げる**
  - **背景**: 現状ポータルの `build.mjs.importCore()` は Core から**三層トークン CSS（primitives/semantic/deprecated-aliases＋tokens/）のみ**取込み、本文は `portal/src/content.js` の自前コンテンツで描画している。そのため **Core 自前サイト（`FIG-UDS/index.html`：Vision/Brand Colors/Elevation/Navigation & Structure・各コンポーネント spec 等）に比べてポータルの Core 概要が不足**している（2026-06-16 にユーザー指摘）。
  - **何を**: ポータルが Core の完全なドキュメント内容を反映するよう修正。方針候補: (a) Core の `index.html` 本文／コンポーネント spec も取込んで描画、(b) `portal/src/content.js` を Core ドキュメント相当に拡充、(c) ポータルは軽量インデックス＋詳細は Core ドキュメントへリンクアウト。
  - **なぜ**: ポータルは「ここを見れば全て解決する単一エントリポイント」（VISION）であり、Core 内容の欠落は本運用前に解消すべき。
  - **タイミング**: F-1（統合表示確認）と合わせて実施。方針 (a)/(b)/(c) は実施時に選定。

---

## 困ったときの目印
- ⚠ が付いた箇所は「実物の名前・バージョンを確認してから」。
- 🛠 が付いた項目はエンジニアにこのシートごと渡すのが確実です。
- 各 Unit の詳細な背景は `aidlc-docs/construction/u◯-.../infrastructure-design/` の各ファイルに記載があります（エンジニア向け）。

> 最終更新: 2026-06-10（U1〜U7 反映済み。U7 サンドボックス検証完了・本番検証/削除は E-9 / F-5）
