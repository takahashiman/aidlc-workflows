#!/usr/bin/env node
/**
 * U2 Portal — ローカル開発サーバ（オフライン可・BUILD-5）
 * 取込済み Core（vendor/core）とポータル資産を素のまま静的配信する。
 *   node scripts/dev-serve.mjs           # portal/ をルートに配信
 *   PORT=4000 node scripts/dev-serve.mjs
 * 事前に `node scripts/build.mjs` で vendor/core と data/ を用意しておくこと。
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, extname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..'); // portal/
const PORT = Number(process.env.PORT) || 5173;

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
}).listen(PORT, () => console.log(`[portal-dev] http://localhost:${PORT}  (root: ${ROOT})`));
