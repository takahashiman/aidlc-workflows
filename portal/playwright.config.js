// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * U2-4/U2-5 — ポータル VRT＋a11y（IDQ45-1/2=B/A・NQ1=B/NQ2=B）
 * webServer は build 出力 site/ を静的配信（Pages artifact と同一＝本番同等）。
 * ベースラインは CI(Linux) で生成・repo 管理（tests/vrt/__screenshots__/・NRD45-VRT-3）。
 */
const PORT = 4173;

export default defineConfig({
  testDir: 'tests',
  // node:test の *.test.js を拾わないよう Playwright は *.spec.js のみ対象
  testMatch: '**/*.spec.js',
  snapshotDir: 'tests/vrt/__screenshots__',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run serve:site',
    url: `http://localhost:${PORT}`,
    timeout: 60_000,
    reuseExistingServer: !process.env.CI,
  },
});
