import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * a11y — Home / 余白 / 使い方インデックス（NQ2=B / NRD45-A11Y-2）。
 * WCAG 2.1 A/AA 相当の serious/critical 違反 0 を合否ゲートとする。
 */
const TARGETS = [
  { name: 'home', hash: '#/home', wait: '[data-testid="home"]' },
  { name: 'coverage', hash: '#/overview/components/coverage', wait: 'h1' },
  { name: 'usage-index', hash: '#/usage/portal-basics', wait: 'h1' },
];

for (const t of TARGETS) {
  test(`a11y: ${t.name}`, async ({ page }) => {
    await page.goto(`/${t.hash}`);
    await page.waitForSelector(t.wait);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const severe = results.violations.filter(v => v.impact === 'serious' || v.impact === 'critical');
    expect(severe, severe.map(v => `${v.id}: ${v.help}`).join('\n')).toEqual([]);
  });
}
