# U2 Portal — NFR Requirements Plan

> プロジェクト全体 NFR（WCAG 2.1 AA／Security Baseline 有効／SemVer／三層／PBT 無効）は確定済み。
> ここでは **U2 Portal 固有の技術選択・非機能要件**を確定する。FD 確定: FDQ全A（vanilla JS SPA・ビルド時 rolling 取込・GitHub Pages・aidlc-workflows へ移設）。
> 下部 `[Answer]:` にご記入ください。A=推奨。

## 生成する成果物（チェックリスト）
- [x] `nfr-requirements.md` — U2 の性能/可用性/保守性/アクセシビリティ/セキュリティ/ビルド要件
- [x] `tech-stack-decisions.md` — ポータルの技術選定（ビルド方式・依存・ホスティング）と根拠

## 確認質問

### NRQ1. ビルド/バンドル方式（FDQ5=A ビルド時 rolling 取込の実現基盤）
ポータルは静的 SPA。Core のトークン/CSS/registry/taxonomy をビルド時に取り込む（PT-7）。ビルドツールの方針。
- A) **軽量ビルド（Node スクリプト＋最小依存）**: フレームワーク/バンドラを増やさず、既存 vanilla JS 構成を維持。Core 取込・データ検証・version-matrix/showcase スタブ生成・Pages 出力をスクリプト化（推奨：保守最小・ADQ1 整合）
- B) **本格バンドラ導入（Vite 等）**: HMR/最適化を享受（依存増・既存 vanilla 構成の作り替え）
- C) ノービルド（全て手置き・素の静的ファイル）: 取込/検証も手動（rolling 自動化と相反）
- X) Other

[Answer]: A

### NRQ2. Core 取込元（rolling のソース解決）
ビルド時に Core を取り込む元（FDQ5=A）。
- A) **同一ワークスペースの Core（core ブランチ/最新タグ）をローカル参照**して取込。CI 環境では Core を checkout/submodule で供給（推奨：現行モノレポ的構成に整合、オフラインビルド可）
- B) Core DS の公開 URL（GitHub raw / Pages）から取得（ネットワーク依存）
- C) npm パッケージ化した Core を依存として取得（Core のパッケージ公開が前提＝U1 範囲外）
- X) Other

[Answer]: A

### NRQ3. 性能予算（静的サイトのロード/操作）
ポータルの体感性能目標。
- A) **初回ロード ≦ 2.5s（標準回線・Web-Admin/PC）、ルート遷移は即時（SPA・<100ms）、Lighthouse Performance ≧ 90**＋既存 motion 予算/`prefers-reduced-motion` 踏襲（推奨）
- B) 数値目標は設けず「軽快であればよい」（定性）
- X) Other

[Answer]: A

### NRQ4. ブラウザ対象
- A) **モダン・エバーグリーン**（Chrome/Edge/Safari/Firefox 最新）。Core(NRQ3=A) と整合（推奨）
- B) レガシー（IE 等）も対象
- X) Other

[Answer]: A

### NRQ5. 可用性/配信（GitHub Pages・US-2.6）
- A) **GitHub Pages（静的ホスティング）に一本化**。可用性は Pages SLA に委ね、ポータル側は静的成果物のみで成立（実行時バックエンド無し）。更新は再ビルド→デプロイ（推奨）
- B) Pages ＋ ミラー/CDN を併用
- X) Other

[Answer]: A

### NRQ6. セキュリティ（Security Baseline の静的 SPA への適用範囲）
Security Baseline 有効（Q9=A）。ポータルは認証なし・読み取り専用の社内公開静的サイト。
- A) **静的サイトに該当する項目のみ enforce**: 依存の脆弱性管理(SCA)、iframe の `sandbox`/`referrerpolicy`、外部スクリプトの SRI/最小化、（可能なら）CSP メタ、機密を URL/localStorage に置かない（BR-STATE-3）。サーバ系項目（認証/認可/暗号化通信の自前実装等）は N/A 明記（推奨）
- B) フル Baseline をそのまま適用（静的サイトに非該当でも形式上チェック）
- X) Other

[Answer]: A

### NRQ7. 外部依存（CDN スクリプト）の方針
現行 index.html は Prism.js を unpkg CDN から読込。
- A) **重要依存はローカルにベンダリング（自己ホスト）＋SRI**、サードパーティ CDN への実行時依存を必須経路から排除（オフライン/可用性/セキュリティ向上・推奨）
- B) 現行どおり CDN 参照を許容（SRI 付与のみ）
- X) Other

[Answer]: A

### NRQ8. 保守性/テスト（vanilla JS SPA の品質担保）
PBT は無効（Q10=C）。U2 のテスト/品質方針。
- A) **データ契約のスキーマ検証＋ルーティング/ナビ生成のユニットテスト＋VRT（U5 連動）＋ビルド時バリデーション（孤児/必須キー）**を品質ゲートに（推奨）
- B) ビルド時バリデーション＋手動確認のみ（自動テストは最小）
- X) Other

[Answer]: A

### NRQ9. データ契約スキーマの表現（version-matrix/showcase・FDQ6=A）
U2 が確定する2契約のスキーマ定義形式。
- A) **JSON Schema で定義し、ビルド時に実データ/スタブを検証**（機械検証可能・U5/U6 への明確な契約・推奨）
- B) ドキュメント（例示 JSON＋表）のみで定義（軽量・機械検証なし）
- X) Other

[Answer]: A
