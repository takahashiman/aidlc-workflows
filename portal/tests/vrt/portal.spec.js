import { test, expect } from '@playwright/test';

/**
 * VRT — Home / 未整備可視化「余白」/ 使い方インデックス（IDQ45-1=B / NRD45-VRT-1/2）。
 * ベースラインは CI(Linux) で初回生成（--update-snapshots）・以後差分検出。
 */
const TARGETS = [
  { name: 'home', hash: '#/home', wait: '[data-testid="home"]' },
  { name: 'coverage', hash: '#/overview/components/coverage', wait: 'h1' },
  { name: 'usage-index', hash: '#/usage/portal-basics', wait: 'h1' },
];

for (const t of TARGETS) {
  test(`VRT: ${t.name}`, async ({ page }) => {
    await page.goto(`/${t.hash}`);
    await page.waitForSelector(t.wait);
    // フォントや遅延描画の安定待ち
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot(`${t.name}.png`, { fullPage: true });
  });
}
