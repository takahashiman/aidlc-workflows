/**
 * FIG Core DS — AI Co-creation Page Handler
 *
 * Developer Guide / AI Co-creation ページの Interactive Prompt Generator を駆動するスクリプト。
 * ページ本文は innerHTML 経由で描画されるため <script> が実行されない。
 * このファイルでグローバル `window.figAICoCreation` を公開し、
 * フォーム要素のインラインハンドラ (oninput / onclick / onchange) から呼び出される。
 *
 * 配信形態: 古典スクリプト（IIFE）。portal.js より後に index.html で読み込む。
 *
 * シグネチャーカラーのプリセット表は tokens/signature-presets.json と
 * 一致させること（ランタイム同期コピー）。乖離した場合は JSON 側が正典。
 */
(function () {
  const PROFILE_SHORT = {
    'Mobile-Terminal': 'terminal',
    'Web-Admin':       'admin',
    'Mobile-Consumer': 'consumer',
  };

  /* ════════════════════════════════════════════════
     Signature Presets — Hue × Taste matrix
     正典: tokens/signature-presets.json
     ════════════════════════════════════════════════ */
  const HUES = {
    turquoise: { label: 'Turquoise（FIG準拠）', relation: 'monochromatic', baseToken: '--color-brand-primary'   },
    blue:      { label: 'Sky Blue（FIG準拠）',  relation: 'monochromatic', baseToken: '--color-brand-secondary' },
    red:       { label: 'Red（緊急・情熱）',     relation: 'complementary', baseToken: '--color-brand-primary'   },
    orange:    { label: 'Orange（活発）',        relation: 'complementary', baseToken: '--color-brand-primary'   },
    mono:      { label: 'Mono（静謐）',          relation: 'neutral-mono',  baseToken: '--color-neutral-dark'    },
  };

  const TASTES = {
    pop:   { label: 'Pop（明・親しみ）' },
    trust: { label: 'Trust（深・業務）' },
    calm:  { label: 'Calm（淡・静謐）' },
  };

  const PRESETS = {
    'turquoise-pop':   { value: '#26B7BC', name: 'Brand Turquoise'  },
    'turquoise-trust': { value: '#1A8589', name: 'Deep Turquoise'   },
    'turquoise-calm':  { value: '#5CCED2', name: 'Light Turquoise'  },
    'blue-pop':        { value: '#38A1DB', name: 'Brand Sky'        },
    'blue-trust':      { value: '#2378A8', name: 'Operations Blue'  },
    'blue-calm':       { value: '#6BB8E4', name: 'Light Sky'        },
    'red-pop':         { value: '#E5484D', name: 'Signal Red'       },
    'red-trust':       { value: '#B91C1C', name: 'Deep Crimson'     },
    'red-calm':        { value: '#FECDD3', name: 'Petal Rose'       },
    'orange-pop':      { value: '#F97316', name: 'Energetic Orange' },
    'orange-trust':    { value: '#C2410C', name: 'Burnt Amber'      },
    'orange-calm':     { value: '#FED7AA', name: 'Soft Apricot'     },
    'mono-pop':        { value: '#64748B', name: 'Slate Mid'        },
    'mono-trust':      { value: '#595757', name: 'FIG Sub-2'        },
    'mono-calm':       { value: '#B5B5B6', name: 'FIG Sub-1'        },
  };

  function presetIdOf(hue, taste) { return `${hue}-${taste}`; }

  /* ════════════════════════════════════════════════
     projectName slug 化 + 検証
     正典パターン: tokens/project-settings.schema.json の
     properties.projectName.pattern → ^[a-z][a-z0-9-]*$
     ════════════════════════════════════════════════ */
  const PROJECT_NAME_PATTERN = /^[a-z][a-z0-9-]*$/;

  function slugifyProjectName(s) {
    let v = (s || '').toLowerCase();
    try { v = v.normalize('NFKD'); } catch (_) { /* IE 等 */ }
    v = v
      .replace(/[^a-z0-9]+/g, '-')   // 非対象文字を全て - に置換
      .replace(/-+/g, '-')            // 連続 - を 1 つに圧縮
      .replace(/^-+|-+$/g, '');       // 端の - を除去
    if (/^[0-9]/.test(v)) v = 'p-' + v; // 先頭数字を回避
    return v;
  }

  function renderProjectNameValidation(input) {
    const slot = document.getElementById('fig-ai-projectName-validation');
    if (!slot) return;
    const value = input.value;
    const valid = PROJECT_NAME_PATTERN.test(value);
    input.setAttribute('aria-invalid', valid ? 'false' : 'true');
    if (value.length === 0) {
      slot.innerHTML = '<span class="fig-ai-form__validation-state" data-state="error">✗ 必須項目です</span>';
      return;
    }
    if (valid) {
      slot.innerHTML = '<span class="fig-ai-form__validation-state" data-state="valid">✓ 有効な slug</span>';
      return;
    }
    const suggested = slugifyProjectName(value) || 'my-project';
    const escAttr = suggested.replace(/'/g, "\\'");
    slot.innerHTML =
      '<span class="fig-ai-form__validation-state" data-state="error">' +
      '✗ 英小文字・数字・ハイフンのみ（先頭は英字）' +
      '</span>' +
      '<button type="button" class="fig-ai-form__auto-fix" ' +
        'onclick="window.figAICoCreation && window.figAICoCreation.autoFixProjectName(\'' + escAttr + '\')">' +
        '→ ' + suggested + ' に自動変換' +
      '</button>';
  }

  function autoFixProjectName(suggested) {
    const input = document.getElementById('fig-ai-projectName');
    if (!input) return;
    input.value = suggested;
    renderProjectNameValidation(input);
    const form = document.getElementById('fig-ai-prompt-form');
    if (form) update(form);
  }

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

  /**
   * フォームの hue / taste セレクトから対応プリセットを引いて
   * signatureValue / signatureName / 内部 hidden を一括で書き換える。
   * 元の value を手で上書きしていた場合は preset を "custom" 扱いに切り替える。
   */
  function applyPreset(form, opts) {
    if (!form) return;
    opts = opts || {};
    const hue   = form.elements.hue   ? form.elements.hue.value   : 'turquoise';
    const taste = form.elements.taste ? form.elements.taste.value : 'pop';
    const id    = presetIdOf(hue, taste);
    const p     = PRESETS[id];
    if (!p) return;

    // hidden プリセット ID は常に最新を保持
    if (form.elements.presetId) form.elements.presetId.value = id;

    // value / name は「プリセット選択時のみ」上書き。
    // (色相 / テイストを切り替えた瞬間のみ書き換える。手動編集を尊重する)
    if (opts.fillValueAndName) {
      if (form.elements.signatureValue) {
        form.elements.signatureValue.value = p.value;
      }
      const textPreview = document.getElementById('fig-ai-signatureValueText');
      if (textPreview) textPreview.value = p.value.toUpperCase();
      if (form.elements.signatureName) {
        form.elements.signatureName.value = p.name;
      }
    }
    update(form);
  }

  function readForm(form) {
    const hue   = (form.elements.hue   && form.elements.hue.value)   || 'turquoise';
    const taste = (form.elements.taste && form.elements.taste.value) || 'pop';
    const presetId      = presetIdOf(hue, taste);
    const preset        = PRESETS[presetId] || PRESETS['turquoise-pop'];
    const signatureVal  = (form.elements.signatureValue.value || preset.value).toUpperCase();
    const signatureName = (form.elements.signatureName.value || '').trim() || preset.name;
    // value が preset から離れていたら custom 扱い（プリセット選択は intent として残す）
    const isCustomValue = signatureVal.toUpperCase() !== preset.value.toUpperCase();
    const hueMeta   = HUES[hue]   || HUES.turquoise;
    const harmonizationNote = (form.elements.harmonizationNote && form.elements.harmonizationNote.value || '').trim();

    return {
      projectName:    (form.elements.projectName.value    || '').trim() || 'your-project-name',
      displayName:    (form.elements.displayName.value    || '').trim() || 'Your Project Display Name',
      description:    (form.elements.description.value    || '').trim() || '1行でプロジェクト概要を記述',
      profile:        form.elements.profile.value         || 'Mobile-Consumer',
      coreVersion:    form.elements.coreVersion.value     || 'v1.0.0',
      signatureValue: signatureVal,
      signatureName:  signatureName,
      harmonization: {
        preset:    isCustomValue ? 'custom' : presetId,
        hue:       hue,
        taste:     taste,
        relation:  hueMeta.relation,
        baseToken: hueMeta.baseToken,
        note:      harmonizationNote || (isCustomValue
                     ? `${presetId} プリセットを微調整した独自値`
                     : `tokens/signature-presets.json の ${presetId} プリセット適用`),
      },
      owners:         (form.elements.owners.value         || '').trim() || '@github-handle',
    };
  }

  /**
   * harmonization オブジェクトを生成プロンプトの JSON ブロックに展開する。
   * インデントは 6 スペース（buildPrompt 内の signatureColor の階層に揃える）。
   */
  function harmonizationJson(h) {
    const lines = [
      '{',
      `         "preset":    "${h.preset}",`,
      `         "hue":       "${h.hue}",`,
      `         "taste":     "${h.taste}",`,
      `         "relation":  "${h.relation}",`,
      `         "baseToken": "${h.baseToken}",`,
      `         "note":      ${JSON.stringify(h.note)}`,
      '       }',
    ];
    return lines.join('\n');
  }

  function buildPrompt(v) {
    const profileShort = PROFILE_SHORT[v.profile] || 'consumer';
    const ownersJson   = ownersToJsonArray(v.owners);
    const dateStr      = today();
    const h            = v.harmonization;

    return `# AIへの指示プロンプト：新規プロジェクトUI基盤の生成 (Strict Mode)

【前提条件】
あなたはシニアフロントエンドエンジニアです。
社内共通の「FIG Universal Design System (Core)」の規律を厳格に守り、
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
- 調和プリセット (harmonization.preset):       ${h.preset}（${h.hue} × ${h.taste}）
  - relation:  ${h.relation}
  - baseToken: ${h.baseToken}
  - note:      ${h.note}
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
       "harmonization": ${harmonizationJson(h)}
     },
     "owners": [${ownersJson}],
     "createdAt": "${dateStr}"
   }

3. パレット生成（手で色を決めない・生成物は DO NOT EDIT）
   \`project-settings.json\` の \`signatureColor.value\` を seed として、本プロジェクト専用の
   signature.css / status.css を決定的に生成すること（静的 hex・WCAG AA 保証）：

       node tools/palette-gen/generate.mjs --seed=${v.signatureValue} --out extensions/${v.projectName}/styles/generated

   - 出力された signature.css / status.css は生成物。手で編集しないこと。
   - 色を変えたいときは seed を変えて本コマンドを再実行する（再生成）。
   - 多色パレット（第二ブランド／アクセント）が要るときは \`--scheme=<dyad|triad|tetrad|pentad|hexad|
     complementary|split-complementary|analogous>\` を付けて accent.css も生成し、\`--accent-{n}-*\`
     （accent-1 は \`--color-brand-secondary\` に委譲）を使う。seed と L 統一・AA 保証で調和する。
     既定は monochromatic（単色・accent なし）。

4. index.html の生成
   \`extensions/template/index.html\` を雛形として \`extensions/${v.projectName}/index.html\` を生成。
   - \`<body class="fig-profile-${profileShort}">\` を必ず付与すること。
   - \`<head>\` で以下を必ずこの順に読み込むこと：
       1) ../../primitives.css
       2) ../../semantic.css
       3) ./styles/generated/signature.css            ← 手順3の生成物（本PRJの seed・DO NOT EDIT）
       4) ./styles/generated/status.css               ← 同上（機能色・AA保証）
       5) ../../tokens/base.css
       6) ../../tokens/profile-${profileShort}.css    ← 選択プロファイルに対応する1つのみ
       7) ../../tokens/components.css
       8) ./styles/extensions.css

5. プロジェクト固有スタイルの配置
   - プロジェクト固有スタイルは \`extensions/${v.projectName}/styles/extensions.css\` に記述。
   - 値は必ず \`--fig-*\` / \`--color-*\` / \`--signature-*\` / \`--status-*\` 等のトークン経由で参照すること（生 px / 生 hex は禁止）。
   - クラス命名規約: \`.${v.projectName}-{component}\` 形式（プロジェクト名前置で衝突回避）。
   - Core 部品の \`.fig-*\` クラスは上書きしないこと。
   - \`extensions.css\` に \`--color-signature\` 等のシグネチャー変数を手書きしないこと
     （手順3の生成物が定義済み。手書き上書きは派生値 light/dark/tint/shadow と不整合になる）。

6. シグネチャーカラーの取り扱い（生成物・手書き禁止）
   - seed の正典は \`project-settings.json\` の \`signatureColor.value\` のみ。
   - その seed から手順3の palette-gen が \`signature.css\` / \`status.css\` を決定的に生成する
     （静的 hex・WCAG AA 保証・先頭に DO NOT EDIT）。手で書かない／light・dark を選ばないこと。
   - 色変更は seed を変えて手順3を再実行する（再生成）。
   - \`--color-signature-light\` / \`-dark\` / \`-tint\` / \`-shadow\` / ramp は生成物が確定値で持つ。直接定義しないこと。
   - Core ブランドの不変点（\`--color-brand-primary\` 等）は生成物が委譲済み。改変しないこと。
   - 機能色（Success / Warning / Error / Info）は生成物 \`status.css\` を使い、独自定義しないこと。
   - \`harmonization\` は \`tokens/signature-presets.json\` のプリセット ID を正典とする。

7. ポータルへの登録
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

  function update(form) {
    if (!form) return;
    const projectInput = form.elements.projectName;
    if (projectInput) renderProjectNameValidation(projectInput);
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
    if (form) {
      // 初期表示時はプリセットを value/name に反映してから描画
      applyPreset(form, { fillValueAndName: true });
    }
  }

  // 公開: ページ本文のインラインハンドラから呼び出される
  window.figAICoCreation = { update, copy, init, applyPreset, autoFixProjectName };

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
