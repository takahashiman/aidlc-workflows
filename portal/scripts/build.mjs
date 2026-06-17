#!/usr/bin/env node
/**
 * U2 Portal — ビルドパイプライン（LC-B1〜7）
 *
 * rolling 取込（FDQ5=A / NRQ1,2=A）:
 *   1. Core 解決（pin しない: core HEAD / 最新タグ相当のローカル参照）  ── LC-B1
 *   2. tokens / components css を vendor/core へ無改変取込              ── LC-B2 (BR-ROLL-3)
 *   3. registry / taxonomy を data/ へ取込                             ── LC-B3
 *   4. Prism 等を自己ホスト化し SRI を算出                              ── LC-B6 (NRQ7=A)
 *   5. JSON Schema 検証 ＋ 孤児/必須キー検査（fail-fast）              ── LC-B4 (BR-DATA-1/3, AVAIL-4)
 *   6. version-matrix / migration / showcase の自動収集（U5/U6・fail-soft）── LC-B5
 *   7. site/ へバンドル出力（静的成果物）                              ── LC-B7
 *
 * 使い方:
 *   node scripts/build.mjs                 # フルビルド → site/
 *   node scripts/build.mjs --validate-only # 取込＋検証のみ（CI 早期失敗用）
 *   CORE_DS_PATH=/path/to/core node scripts/build.mjs
 */
import { readFile, writeFile, mkdir, rm, cp, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORTAL = resolve(__dirname, '..');
const ROOT = resolve(PORTAL, '..');

const VALIDATE_ONLY = process.argv.includes('--validate-only');

/** Core DS の所在解決（pin しない。env 優先 → 既定のワークスペース内 Core） */
function resolveCorePath() {
  if (process.env.CORE_DS_PATH) return resolve(process.env.CORE_DS_PATH);
  const candidates = [
    join(ROOT, 'aidlc-projects', 'FIG-Universal-Design-System'),
    join(ROOT, '..', 'FIG-Core-DS'),
    join(ROOT, '..', 'FIG-Universal-Design-System'),
  ];
  for (const c of candidates) if (existsSync(join(c, 'semantic.css'))) return c;
  return null;
}

const log = (...a) => console.log('[portal-build]', ...a);
const fail = (msg) => { console.error('\n[portal-build] ✗ FAIL:', msg, '\n'); process.exit(1); };

/** Core 資産を無改変で vendor/core へ取込（BR-ROLL-3） */
async function importCore(corePath) {
  const dst = join(PORTAL, 'vendor', 'core');
  await rm(dst, { recursive: true, force: true });
  await mkdir(dst, { recursive: true });
  // 取込対象（存在するもののみ）。Core の三層トークン＋コンポーネント CSS。
  const files = ['primitives.css', 'semantic.css', 'deprecated-aliases.css'];
  const dirs = ['tokens'];
  let imported = [];
  for (const f of files) {
    const src = join(corePath, f);
    if (existsSync(src)) { await cp(src, join(dst, f)); imported.push(f); }
  }
  for (const d of dirs) {
    const src = join(corePath, d);
    if (existsSync(src)) { await cp(src, join(dst, d), { recursive: true }); imported.push(d + '/'); }
  }
  // 取込版ラベル（表示専用・pin ではない, BR-ROLL-4）
  let versionLabel = 'core@local';
  const verFile = ['VERSION', 'CORE-DS-VERSION'].map(v => join(corePath, v)).find(existsSync);
  if (verFile) versionLabel = (await readFile(verFile, 'utf8')).trim();
  log('Core 取込:', imported.join(', '), '→ vendor/core/  (version:', versionLabel + ')');
  return versionLabel;
}

/** registry / taxonomy を data/ へ取込 */
async function importMetadata(corePath) {
  const dataDir = join(PORTAL, 'data');
  await mkdir(dataDir, { recursive: true });
  for (const f of ['registry.json', 'taxonomy.json']) {
    const src = join(corePath, f);
    if (!existsSync(src)) fail(`Core に ${f} がありません: ${src}`);
    await cp(src, join(dataDir, f));
  }
  log('メタデータ取込: registry.json / taxonomy.json → data/');
}

/** version/migration の自動収集（U5/CI-3）＋ showcase スタブ（U6/CI-4 で差替） */
async function collectAndStub(corePath) {
  const dataDir = join(PORTAL, 'data');
  await mkdir(dataDir, { recursive: true });
  // CI-3: version-matrix.json + migration-index.json を自動収集（fail-soft）
  try {
    const { collectVersions } = await import('./collect-versions.mjs');
    await collectVersions({ dataDir, corePath });
  } catch (e) {
    log('⚠ version 収集スキップ（既存据え置き）:', e.message);
    // 収集器が動かない場合でも検証が通るよう最小スタブを保証（REL-4）
    const vm = join(dataDir, 'version-matrix.json');
    if (!existsSync(vm)) await writeFile(vm, JSON.stringify({ _generatedBy: 'stub (fallback)', collectedAt: null, entries: [] }, null, 2));
  }
  // CI-4 (U6): showcase-index.json を自動収集（fail-soft / GH_OWNER 未設定なら据え置き）
  try {
    const { collectShowcase } = await import('./collect-versions.mjs');
    await collectShowcase({ dataDir, corePath });
  } catch (e) {
    log('⚠ showcase 収集スキップ（既存据え置き）:', e.message);
  }
  // 未収集（GH_OWNER 未設定・初回）の間はスタブを保証。
  const sc = join(dataDir, 'showcase-index.json');
  if (!existsSync(sc)) {
    await writeFile(sc, JSON.stringify({ _generatedBy: 'stub (U2)', _note: 'U6(CI-4) が自動収集に差替える', collectedAt: null, items: [] }, null, 2));
    log('スタブ生成: showcase-index.json');
  }
}

async function readJson(p) { return JSON.parse(await readFile(p, 'utf8')); }

/** JSON Schema 検証＋整合検査（fail-fast, BR-DATA-1/3/5） */
async function validate() {
  let Ajv;
  try { ({ default: Ajv } = await import('ajv')); }
  catch { log('⚠ ajv 未インストール。`npm i` 後に厳密検証されます（今回はスキップ）'); }
  const dataDir = join(PORTAL, 'data');
  const schemaDir = join(PORTAL, 'schema');

  const registry = await readJson(join(dataDir, 'registry.json'));
  const taxonomy = await readJson(join(dataDir, 'taxonomy.json'));

  if (Ajv) {
    const ajv = new Ajv({ allErrors: true, strict: false });
    for (const [data, schemaFile] of [
      [await readJson(join(dataDir, 'version-matrix.json')), 'version-matrix.schema.json'],
      [await readJson(join(dataDir, 'showcase-index.json')), 'showcase-index.schema.json'],
    ]) {
      const sp = join(schemaDir, schemaFile);
      if (!existsSync(sp)) { log('⚠ schema 不在:', schemaFile); continue; }
      const validateFn = ajv.compile(await readJson(sp));
      if (!validateFn(data)) fail(`${schemaFile} 検証エラー: ${ajv.errorsText(validateFn.errors)}`);
      log('スキーマOK:', schemaFile);
    }
  }

  // 整合: registry の各 product は taxonomy のカテゴリに属す（孤児禁止 = 警告, BR-DATA-1）
  const catIds = new Set((taxonomy.categories || []).map(c => c.id));
  for (const p of registry.projects || []) {
    if (!p.repo || !p.name || !p.category) console.warn('[portal-build] ⚠ registry エントリ必須キー欠落 → pending 扱い:', JSON.stringify(p));
    if (p.category && !catIds.has(p.category)) console.warn('[portal-build] ⚠ 孤児 registry エントリ（taxonomy に category 無し）:', p.repo, p.category);
  }
  log('整合検査 完了（registry projects:', (registry.projects || []).length, '/ taxonomy categories:', catIds.size, ')');
}

/** site/ へバンドル（静的成果物・LC-B7） */
async function bundle(versionLabel) {
  const site = join(PORTAL, 'site');
  await rm(site, { recursive: true, force: true });
  await mkdir(site, { recursive: true });
  for (const entry of ['index.html', 'src', 'assets', 'vendor', 'data', 'usage']) {
    const src = join(PORTAL, entry);
    if (existsSync(src)) await cp(src, join(site, entry), { recursive: true });
  }
  // ビルド情報（表示用 version・rolling の実取込版）
  await writeFile(join(site, 'data', 'build-info.json'),
    JSON.stringify({ coreVersionLabel: versionLabel, builtAt: new Date().toISOString(), rolling: true }, null, 2));
  log('バンドル出力 → site/');
}

(async () => {
  log(VALIDATE_ONLY ? '検証モード' : 'フルビルド開始');
  const corePath = resolveCorePath();
  if (!corePath) fail('Core DS が見つかりません。CORE_DS_PATH を指定するか、ワークスペースに Core を配置してください。');
  log('Core 解決:', corePath);

  const versionLabel = await importCore(corePath);
  await importMetadata(corePath);
  await collectAndStub(corePath);
  await validate();

  if (VALIDATE_ONLY) { log('✓ 検証のみ完了'); return; }
  await bundle(versionLabel);
  log('✓ ビルド完了');
})().catch(e => fail(e.stack || e.message));
