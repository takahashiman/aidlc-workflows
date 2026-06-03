/**
 * FIG Core DS — AI Co-creation Page Handler
 *
 * Developer Guide / AI Co-creation ページの Interactive Prompt Generator を駆動するスクリプト。
 * ページ本文は innerHTML 経由で描画されるため <script> が実行されない。
 * このファイルでグローバル `window.figAICoCreation` を公開し、
 * フォーム要素のインラインハンドラ (oninput / onclick) から呼び出される。
 *
 * 配信形態: 古典スクリプト（IIFE）。portal.js より後に index.html で読み込む。
 */
(function () {
  const PROFILE_SHORT = {
    'Mobile-Terminal': 'terminal',
    'Web-Admin':       'admin',
    'Mobile-Consumer': 'consumer',
  };

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function ownersToJsonArray(input) {
    const arr = (input || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    if (!arr.length) return '"@github-handle"';
    return arr.map(s => `"${s}"`).join(', ');
  }

  function buildPrompt(v) {
    const profileShort = PROFILE_SHORT[v.profile] || 'consumer';
    const ownersJson   = ownersToJsonArray(v.owners);
    const dateStr      = today();

    return `# AIへの指示プロンプト：新規プロジェクトUI基盤の生成 (Strict Mode)

【前提条件】
あなたはFIGグループのシニアフロントエンドエンジニアです。
全社共通の「FIG Universal Design System (Core)」の規律を厳格に守り、
リポジトリのルールに完全に適合した新規拡張サービス (Extensions) のUI基盤ファイル群を生成してください。
「引き算の美学」を徹底し、Core トークンのハードコード再定義や、不要なスタイル上書きは一切禁止します。

【プロジェクト基本情報】
- プロジェクト名 (projectName):                ${v.projectName}
- 表示名 (displayName):                        ${v.displayName}
- 概要 (description):                          ${v.description}
- 対象デバイスプロファイル (profile):          ${v.profile}
- 参照する Core バージョン (coreVersion):      ${v.coreVersion}
- シグネチャーカラー (signatureColor.value):   ${v.signatureValue}
- カラー名 (signatureColor.name):              ${v.signatureName}
- 調和ルール説明 (signatureColor.harmonization): ${v.harmonization}
- オーナー (owners):                           ${v.owners}

【実装ルール】

1. リポジトリ構造の遵守
   - リポジトリのルート直下にある \`extensions/template/\` の構造をベースとし、
     \`extensions/${v.projectName}/\` ディレクトリを新規作成すること。
   - 架空の \`/design-system/\` 等の親フォルダは作成しないこと。

2. project-settings.json の生成（厳格スキーマ）
   \`extensions/${v.projectName}/project-settings.json\` を以下スキーマで生成すること：

   {
     "$schema": "../../tokens/project-settings.schema.json",
     "projectName": "${v.projectName}",
     "displayName": "${v.displayName}",
     "description": "${v.description}",
     "designSystem": {
       "coreVersion": "${v.coreVersion}",
       "profile": "${v.profile}",
       "lockedAt": "${dateStr}"
     },
     "signatureColor": {
       "value": "${v.signatureValue}",
       "name": "${v.signatureName}",
       "harmonization": "${v.harmonization}"
     },
     "owners": [${ownersJson}],
     "createdAt": "${dateStr}"
   }

3. index.html の生成
   \`extensions/template/index.html\` を雛形として \`extensions/${v.projectName}/index.html\` を生成。
   - \`<body class="fig-profile-${profileShort}">\` を必ず付与すること。
   - \`<head>\` で以下を必ずこの順に読み込むこと：
       1) ../../primitives.css
       2) ../../semantic.css
       3) ../../tokens/base.css
       4) ../../tokens/profile-${profileShort}.css   ← 選択プロファイルに対応する1つのみ
       5) ../../tokens/components.css
       6) ./styles/extensions.css

4. プロジェクト固有スタイルの配置
   - プロジェクト固有スタイルは \`extensions/${v.projectName}/styles/extensions.css\` に記述。
   - 値は必ず \`--fig-*\` / \`--color-*\` 等のトークン経由で参照すること（生 px / 生 hex は禁止）。
   - クラス命名規約: \`.${v.projectName}-{component}\` 形式（プロジェクト名前置で衝突回避）。
   - Core 部品の \`.fig-*\` クラスは上書きしないこと。

5. シグネチャーカラーの取り扱い
   - シグネチャーカラーは \`project-settings.json\` の \`signatureColor.value\` にのみ記載すること。
   - Core ブランドの不変点（\`--color-brand-primary\` 等）を改変しないこと。
   - 機能色（Success / Warning / Error / Info）は Core 既定を継承し、独自定義しないこと。

6. ポータルへの登録
   \`assets/js/portal-content.js\` の \`SITEMAP.extensions.sections\` 配列に
   { id: '${v.projectName}', label: '${v.displayName} (${v.profile})', hint: '${v.description}', items: [{ id: 'overview', label: 'Overview' }] }
   を追加し、\`PAGES\` に \`'extensions/${v.projectName}/overview'\` エントリを定義すること。

【出力成果物】
1. \`extensions/${v.projectName}/\` ディレクトリ構造（ツリー表示）
2. \`project-settings.json\` の完全コード
3. \`index.html\` の完全コード（プロファイル CSS 読み込みを含む）
4. \`styles/extensions.css\` の初期スケルトン（コメントヘッダのみ可）
5. \`assets/js/portal-content.js\` への追記差分（SITEMAP と PAGES）
`;
  }

  function readForm(form) {
    return {
      projectName:    (form.elements.projectName.value    || '').trim() || 'your-project-name',
      displayName:    (form.elements.displayName.value    || '').trim() || 'Your Project Display Name',
      description:    (form.elements.description.value    || '').trim() || '1行でプロジェクト概要を記述',
      profile:        form.elements.profile.value         || 'Mobile-Consumer',
      coreVersion:    form.elements.coreVersion.value     || 'v1.2.0',
      signatureValue: form.elements.signatureValue.value  || '#26B7BC',
      signatureName:  (form.elements.signatureName.value  || '').trim() || 'Sample Color',
      harmonization:  (form.elements.harmonization.value  || '').trim() || 'FIG Brand Primary との関係を1行で記述',
      owners:         (form.elements.owners.value         || '').trim() || '@github-handle',
    };
  }

  function update(form) {
    if (!form) return;
    const output = document.getElementById('fig-ai-prompt-output');
    if (!output) return;
    output.value = buildPrompt(readForm(form));
  }

  function copy() {
    const output = document.getElementById('fig-ai-prompt-output');
    const btn    = document.getElementById('fig-ai-copy-btn');
    if (!output) return;

    const done = () => {
      if (!btn) return;
      const original = btn.getAttribute('data-original') || btn.textContent;
      btn.setAttribute('data-original', original);
      btn.setAttribute('data-copied', 'true');
      btn.textContent = '✓ コピーしました';
      setTimeout(() => {
        btn.removeAttribute('data-copied');
        btn.textContent = original;
      }, 2000);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(output.value).then(done).catch(() => {
        output.select();
        try { document.execCommand('copy'); done(); } catch (_) { /* noop */ }
      });
    } else {
      output.select();
      try { document.execCommand('copy'); done(); } catch (_) { /* noop */ }
    }
  }

  function init() {
    const form = document.getElementById('fig-ai-prompt-form');
    if (form) update(form);
  }

  // 公開: ページ本文のインラインハンドラから呼び出される
  window.figAICoCreation = { update, copy, init };

  // ルーティングと連動した自動初期化
  function maybeInit() {
    if (location.hash.indexOf('developer/guide/ai-co-creation') !== -1) {
      // portal.js の render() 完了後に DOM が揃うため、次の tick で実行
      setTimeout(init, 0);
    }
  }
  window.addEventListener('hashchange', maybeInit);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', maybeInit);
  } else {
    maybeInit();
  }
})();
