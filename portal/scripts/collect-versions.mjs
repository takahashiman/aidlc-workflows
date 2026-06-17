#!/usr/bin/env node
/**
 * U5 CI-3 — version / migration 収集クローラ（US-4.3 / FDQ5・FDQ6）
 *
 * 単一クローラで version-matrix.json と migration-index.json を同一走査生成（BR-CI-1CRAWL-1）。
 *   - 探索対象 = Core registry.json（registry 駆動 / BR-CI-CRAWL-2）。
 *   - 各 repo の pin: GitHub API contents（submodule→CORE-DS-VERSION→package.json / BR-CI-CRAWL-3）。
 *   - latest = Core 最新 SemVer タグ（rolling 基準）。status = pinned vs latest。
 *   - fail-soft: 個別失敗は unknown/skip、全体失敗は直近結果据え置き（REL-3/4 / BR-CI-CRAWL-5）。
 *   - 出力は U2 確定スキーマ（version-matrix.schema.json）準拠（契約変更せず充足 / BR-CI-CRAWL-4）。
 *
 * 環境:
 *   GH_OWNER        各 repo の owner（registry は bare repo 名のため必要。無ければ pin は unknown）
 *   GITHUB_TOKEN    GitHub API read（無くても public は試行・rate-limit 回避に推奨）
 *   CORE_DS_PATH    ローカル Core（latest タグ/VERSION のローカル解決フォールバック）
 *   CORE_DS_REPO    Core の owner/name（latest タグ取得用・既定 GH_OWNER/FIG-Core-DS）
 *
 * 使い方:
 *   node scripts/collect-versions.mjs            # data/ に version-matrix.json + migration-index.json
 *   (build.mjs から collectVersions() を import して利用)
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORTAL = resolve(__dirname, '..');

const log = (...a) => console.log('[collect-versions]', ...a);

// ── GitHub API（fail-soft・トークン任意） ────────────────
async function ghGet(path, token) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'fig-collect-versions',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status} ${path}`);
  return res.json();
}
async function ghContentText(owner, repo, filePath, token) {
  const data = await ghGet(`/repos/${owner}/${repo}/contents/${filePath}`, token);
  if (data && data.content) return Buffer.from(data.content, 'base64').toString('utf8');
  return null;
}

function parseSemver(v) {
  const m = String(v || '').match(/(\d+)\.(\d+)\.(\d+)/);
  return m ? [+m[1], +m[2], +m[3]] : null;
}
function cmpSemver(a, b) {
  const pa = parseSemver(a), pb = parseSemver(b);
  if (!pa || !pb) return 0;
  for (let i = 0; i < 3; i++) if (pa[i] !== pb[i]) return pa[i] - pb[i];
  return 0;
}

/** Core 最新 SemVer（rolling 基準）。API → ローカル VERSION の順でフォールバック */
async function resolveLatestCore({ owner, coreRepo, token, corePath }) {
  if (owner && coreRepo) {
    try {
      const tags = await ghGet(`/repos/${owner}/${coreRepo}/tags?per_page=100`, token);
      const vs = (tags || []).map(t => t.name).filter(n => parseSemver(n));
      if (vs.length) return vs.sort(cmpSemver).at(-1);
    } catch (e) { log('⚠ latest タグ取得失敗（API）:', e.message); }
  }
  if (corePath) {
    for (const f of ['VERSION', 'CORE-DS-VERSION']) {
      const p = join(corePath, f);
      if (existsSync(p)) { try { return (await readFile(p, 'utf8')).trim(); } catch {} }
    }
  }
  return 'unknown';
}

/** 1 製品の pin を解決（submodule→CORE-DS-VERSION→package.json） */
async function resolvePin(owner, repo, token) {
  // ① .gitmodules + submodule の pin（簡易: CORE-DS-VERSION を優先するため後段）
  // ② CORE-DS-VERSION
  try {
    const txt = await ghContentText(owner, repo, 'CORE-DS-VERSION', token);
    if (txt && txt.trim()) return { pin: txt.trim(), source: 'CORE-DS-VERSION' };
  } catch {}
  // ③ package.json の devDependencies/dependencies に core 参照 or fig.coreVersion
  try {
    const txt = await ghContentText(owner, repo, 'package.json', token);
    if (txt) {
      const pkg = JSON.parse(txt);
      const cv = pkg.fig?.coreVersion || pkg.coreVersion;
      if (cv) return { pin: String(cv), source: 'package.json' };
    }
  } catch {}
  // ④ submodule（.gitmodules があれば core を submodule とみなす・実コミットは API では解決簡略化）
  try {
    const gm = await ghContentText(owner, repo, '.gitmodules', token);
    if (gm && /core/.test(gm)) return { pin: 'submodule', source: 'submodule' };
  } catch {}
  return { pin: null, source: 'unknown' };
}

/** 移行マニフェストの要約（FDQ6 / BR-VIS-2） */
async function resolveMigration(owner, repo, token) {
  try {
    const txt = await ghContentText(owner, repo, 'migration/migration-manifest.json', token);
    if (!txt) return null;
    const m = JSON.parse(txt);
    return {
      migratedScreens: m.migratedScreens ?? m.summary?.migratedScreens ?? null,
      totalScreens: m.totalScreens ?? m.summary?.totalScreens ?? null,
      overallRatio: m.overallRatio ?? m.summary?.overallRatio ?? null,
      criticalFlowComplete: m.criticalDone ?? m.summary?.criticalDone ?? null,
      completed: m.completed ?? m.summary?.completed ?? null,
      wrapperDeadlines: (m.wrappers || []).map(w => ({ name: w.name, removeBy: w.removeBy })).filter(w => w.removeBy),
    };
  } catch { return null; }
}

/**
 * 収集本体。data/registry.json を駆動に version-matrix.json + migration-index.json を生成。
 * @returns {{version:object, migration:object}}
 */
export async function collectVersions({ dataDir, corePath } = {}) {
  dataDir = dataDir || join(PORTAL, 'data');
  await mkdir(dataDir, { recursive: true });
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
  const owner = process.env.GH_OWNER || (process.env.CORE_DS_REPO || '').split('/')[0] || '';
  const coreRepo = (process.env.CORE_DS_REPO || '').split('/')[1] || 'FIG-Core-DS';

  const registryPath = join(dataDir, 'registry.json');
  if (!existsSync(registryPath)) { log('⚠ registry.json 不在 → 空収集'); }
  const registry = existsSync(registryPath) ? JSON.parse(await readFile(registryPath, 'utf8')) : { projects: [] };
  const projects = registry.projects || [];

  const latest = await resolveLatestCore({ owner, coreRepo, token, corePath });
  log(`registry 製品 ${projects.length} 件 / Core latest = ${latest}${owner ? '' : ' / GH_OWNER 未設定 → pin は unknown'}`);

  const collectedAt = new Date().toISOString();
  const entries = [];
  const migrationItems = [];

  // 並列収集（PERF-2）。個別失敗は fail-soft で unknown（BR-CI-CRAWL-5）
  await Promise.all(projects.map(async (p) => {
    const projectId = p.repo || p.name;
    let pin = { pin: null, source: 'unknown' };
    let migration = null;
    if (owner && p.repo) {
      try { pin = await resolvePin(owner, p.repo, token); } catch (e) { log(`⚠ pin 取得失敗 ${projectId}:`, e.message); }
      try { migration = await resolveMigration(owner, p.repo, token); } catch {}
    }
    const pinned = pin.pin || p.coreVersion || null;
    let status = 'unknown';
    if (pinned && latest && latest !== 'unknown' && parseSemver(pinned) && parseSemver(latest)) {
      status = cmpSemver(pinned, latest) >= 0 ? 'up-to-date' : 'behind';
    }
    entries.push({
      projectId, projectName: p.name || projectId,
      coreVersionPinned: pinned || 'unknown',
      coreVersionLatest: latest,
      status, source: pin.source, collectedAt,
    });
    if (migration) migrationItems.push({ projectId, ...migration, collectedAt });
  }));

  entries.sort((a, b) => a.projectId.localeCompare(b.projectId));

  const version = { _generatedBy: 'collect-versions (U5/CI-3)', collectedAt, coreVersionLatest: latest, entries };
  const migration = { _generatedBy: 'collect-versions (U5/CI-3·FDQ6)', collectedAt, items: migrationItems };

  await writeFile(join(dataDir, 'version-matrix.json'), JSON.stringify(version, null, 2));
  await writeFile(join(dataDir, 'migration-index.json'), JSON.stringify(migration, null, 2));
  log(`✓ version-matrix.json（${entries.length} 件）/ migration-index.json（${migrationItems.length} 件）生成`);
  return { version, migration };
}

// ════════════════════════════════════════════════════════════════════════
// U6 CI-4 — showcase 収集（US-5.1 / US-5.2）
//   単一クローラ基盤の一部（BR-CI-1CRAWL）。registry 駆動で各製品 repo の
//   ①extensions/ 配下の独自パーツ（kind=extension）②temp-part ラベル Issue
//   （kind=temp-part）を GitHub API で収集し、showcase-index.schema.json を
//   変更せず充足する showcase-index.json を生成する。fail-soft。
// ════════════════════════════════════════════════════════════════════════
const SC = (...a) => console.log('[collect-showcase]', ...a);
const PART_EXT = /\.(jsx|tsx|js|css|html)$/i;
const EXCLUDE_PART = /^(index|compat|README|\.)/i;
/** Core 別名表（正規化名 → 別名。製品プレフィックスは endsWith で吸収するため最小限） */
const CORE_ALIASES = {
  fab: ['floatingactionbutton', 'floatingaction'],
  input: ['textfield', 'textinput'],
  toast: ['snackbar'],
  modal: ['dialog'],
};

function normalizeName(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/\.(jsx|tsx|js|css|html|spec|md)$/g, '')
    .replace(/[\s_\-./（）()]+/g, '');
}

/** ディレクトリ列挙（fail-soft で [] / 404=未設置） */
async function ghList(owner, repo, path, token) {
  try {
    const data = await ghGet(`/repos/${owner}/${repo}/contents/${path}`, token);
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}
/** ラベル付き open Issue 列挙（PR は除外） */
async function ghIssues(owner, repo, label, token) {
  const data = await ghGet(
    `/repos/${owner}/${repo}/issues?labels=${encodeURIComponent(label)}&state=open&per_page=100`, token);
  return (Array.isArray(data) ? data : []).filter(is => !is.pull_request);
}

/** 部品ヘッダ `// EXTENSION PART — <name>` から可読名を抽出（無ければ stem / BR-SC-SRC-4） */
function extractPartName(text, fallback) {
  const m = String(text || '').match(/EXTENSION PART\s*[—\-:：]\s*([^\n（(]+)/i);
  return m ? m[1].trim() : fallback;
}

/** Core 正典のコンポーネント名集合（components/*.spec.md）。ローカル優先→API フォールバック */
async function loadCoreCanon({ owner, coreRepo, token, corePath }) {
  const canon = new Set();
  if (corePath) {
    const dir = join(corePath, 'components');
    if (existsSync(dir)) {
      try {
        const { readdir } = await import('node:fs/promises');
        for (const f of await readdir(dir)) {
          const m = f.match(/^(.+)\.spec\.md$/i);
          if (m) canon.add(normalizeName(m[1]));
        }
      } catch {}
    }
  }
  if (canon.size) return canon;
  if (owner && coreRepo) {
    for (const e of await ghList(owner, coreRepo, 'components', token)) {
      const m = (e.name || '').match(/^(.+)\.spec\.md$/i);
      if (m) canon.add(normalizeName(m[1]));
    }
  }
  return canon;
}

/** Core 正典に同名/同義が在るか（promotedToCore / BR-SC-PROMOTED）。照合不能なら false 据置 */
function coreHasEquivalent(name, canon) {
  if (!canon || !canon.size) return false;
  const n = normalizeName(name);
  if (!n) return false;
  for (const c of canon) {
    if (!c) continue;
    if (n === c) return true;
    if (c.length >= 3 && n.endsWith(c)) return true; // 製品プレフィックス吸収: busappfab → fab
    const al = CORE_ALIASES[c];
    if (al && al.some(a => n.includes(a))) return true;
  }
  return false;
}

function mkShowcaseItem({ id, name, projectId, kind, previewPath, screenshotUrl, canon, collectedAt }) {
  const promotedToCore = coreHasEquivalent(name, canon);
  const it = {
    id, name, ownerProjectId: projectId, kind,
    promotable: true,         // extension/temp-part は原則 true。導線は view が promotable && !promotedToCore で判定（BR-SC-PROMOTABLE）
    promotedToCore, collectedAt,
  };
  if (previewPath) it.previewPath = previewPath;
  if (screenshotUrl) it.screenshotUrl = screenshotUrl;
  return it;
}

/**
 * showcase 収集本体。registry 駆動で全製品を1パス走査し showcase-index.json を生成。
 * GH_OWNER 未設定時は収集不能 → 既存/スタブを据え置き（未収集のまま）。
 * @returns {object|null} 生成した showcase オブジェクト（収集不能時は null）
 */
export async function collectShowcase({ dataDir, corePath } = {}) {
  dataDir = dataDir || join(PORTAL, 'data');
  await mkdir(dataDir, { recursive: true });
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
  const owner = process.env.GH_OWNER || (process.env.CORE_DS_REPO || '').split('/')[0] || '';
  const coreRepo = (process.env.CORE_DS_REPO || '').split('/')[1] || 'FIG-Core-DS';

  const registryPath = join(dataDir, 'registry.json');
  const registry = existsSync(registryPath) ? JSON.parse(await readFile(registryPath, 'utf8')) : { projects: [] };
  const projects = registry.projects || [];

  if (!owner) { SC('⚠ GH_OWNER 未設定 → showcase 収集スキップ（既存/スタブ据え置き）'); return null; }

  const canon = await loadCoreCanon({ owner, coreRepo, token, corePath });
  const collectedAt = new Date().toISOString();
  const items = [];
  let skipped = 0;
  SC(`registry 製品 ${projects.length} 件 / Core 正典 ${canon.size} 部品で昇格照合`);

  // 並列収集（PERF-2）。個別失敗は fail-soft で skip（BR-SC-FAILSOFT）
  await Promise.all(projects.map(async (p) => {
    const projectId = p.repo || p.name;
    if (!p.repo) return;
    // ① extensions/ ディレクトリ（kind=extension）
    try {
      const [entries, prev] = await Promise.all([
        ghList(owner, p.repo, 'extensions', token),
        ghList(owner, p.repo, 'preview', token),
      ]);
      const prevNames = new Set(prev.filter(e => e.type === 'file').map(e => e.name));
      for (const e of entries) {
        if (e.type !== 'file' || !PART_EXT.test(e.name) || EXCLUDE_PART.test(e.name)) continue;
        const stem = e.name.replace(PART_EXT, '');
        let name = stem;
        try { name = extractPartName(await ghContentText(owner, p.repo, `extensions/${e.name}`, token), stem); } catch {}
        const previewName = `${stem}.html`;
        items.push(mkShowcaseItem({
          id: `ext-${p.repo}-${stem}`, name, projectId, kind: 'extension',
          previewPath: prevNames.has(previewName) ? `preview/${previewName}` : undefined,
          canon, collectedAt,
        }));
      }
    } catch (e) { skipped++; SC(`⚠ extensions 収集失敗 ${projectId}:`, e.message); }
    // ② temp-part ラベル Issue（kind=temp-part）
    try {
      for (const is of await ghIssues(owner, p.repo, 'temp-part', token)) {
        items.push(mkShowcaseItem({
          id: `temp-${p.repo}-${is.number}`, name: is.title || `Issue #${is.number}`, projectId,
          kind: 'temp-part', screenshotUrl: is.html_url, canon, collectedAt,
        }));
      }
    } catch (e) { skipped++; SC(`⚠ temp-part Issue 収集失敗 ${projectId}:`, e.message); }
  }));

  items.sort((a, b) =>
    a.ownerProjectId.localeCompare(b.ownerProjectId) ||
    a.kind.localeCompare(b.kind) ||
    a.name.localeCompare(b.name));

  const out = { _generatedBy: 'collect-showcase (U6/CI-4)', collectedAt, items };
  await writeFile(join(dataDir, 'showcase-index.json'), JSON.stringify(out, null, 2));
  const nExt = items.filter(i => i.kind === 'extension').length;
  SC(`✓ showcase-index.json（${items.length} 件 / extension ${nExt}・temp-part ${items.length - nExt}・skip ${skipped}）生成`);
  return out;
}

// CLI
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('collect-versions.mjs')) {
  const corePath = process.env.CORE_DS_PATH ? resolve(process.env.CORE_DS_PATH) : null;
  const showcaseOnly = process.argv.includes('--showcase');
  const run = showcaseOnly
    ? collectShowcase({ corePath })
    : Promise.all([collectVersions({ corePath }), collectShowcase({ corePath })]);
  run.catch(e => {
    // 全体失敗でも portal ビルドは止めない（既存結果を据え置き / REL-4 / BR-SC-FAILSOFT）
    console.error('[collect] ✗ 収集失敗（既存結果を据え置き）:', e.message);
    process.exit(0);
  });
}
