#!/usr/bin/env node
/**
 * U2-4/U2-5 — ビルド出力（site/）静的配信サーバ（VRT/a11y 用・IDQ45-2=A）
 * Playwright の webServer から起動し、Pages artifact と同一出力（site/）を本番同等に配信する。
 *   node scripts/serve-site.mjs           # site/ をルートに配信
 *   PORT=4173 node scripts/serve-site.mjs
 * 事前に `npm run build` で site/ を生成しておくこと。
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, extname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', 'site'); // portal/site
const PORT = Number(process.env.PORT) || 4173;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.map': 'application/json',
};

createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(req.url.split('?')[0]);
    if (path === '/' || path === '') path = '/index.html';
    let fsPath = join(ROOT, path);
    // SPA フォールバック: 拡張子なし & ファイル不在 → index.html（ハッシュルータが解決）
    if (!existsSync(fsPath) || (statSync(fsPath).isDirectory())) {
      if (!extname(path)) fsPath = join(ROOT, 'index.html');
    }
    if (!existsSync(fsPath)) { res.writeHead(404); res.end('Not Found: ' + path); return; }
    const body = await readFile(fsPath);
    res.writeHead(200, { 'Content-Type': TYPES[extname(fsPath)] || 'application/octet-stream' });
    res.end(body);
  } catch (e) {
    res.writeHead(500); res.end('Server Error: ' + e.message);
  }
}).listen(PORT, () => console.log(`[portal-site] http://localhost:${PORT}  (root: ${ROOT})`));
