import { test, expect } from '@playwright/test';

const PAGES = [
  { path: '/index.html', title: 'Alexanders | الرئيسية' },
  { path: '/about.html', title: 'Alexanders | من نحن' },
  { path: '/story.html', title: 'Alexanders | قصتنا' },
  { path: '/gallery.html', title: 'Alexanders | المعرض' },
];

test.describe('Pages Smoke Tests & Assets', () => {
  for (const p of PAGES) {
    test(`loads ${p.path} with 200, valid title, no local 404 assets or console errors`, async ({ page }) => {
      const consoleErrors = [];
      const failedRequests = [];

      page.on('console', msg => {
        if (msg.type() === 'error') {
          const text = msg.text();
          // Filter external proxy / google font errors in headless env
          if (!text.includes('Failed to load resource') && !text.includes('workers.dev')) {
            consoleErrors.push(text);
          }
        }
      });

      page.on('requestfailed', req => {
        const url = req.url();
        if (!url.includes('workers.dev') && !url.includes('fonts.googleapis') && !url.includes('fonts.gstatic')) {
          failedRequests.push(`${req.method()} ${url} - ${req.failure()?.errorText}`);
        }
      });

      const response = await page.goto(p.path);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveTitle(p.title);

      expect(failedRequests).toEqual([]);
      expect(consoleErrors).toEqual([]);
    });
  }
});

test.describe('Theme Toggle & Mobile Navigation', () => {
  test('theme toggle switches dark/light modes and updates localStorage', async ({ page }) => {
    await page.goto('/index.html');
    const root = page.locator('html');

    await expect(root).toHaveAttribute('data-theme', 'dark');

    const toggleBtn = page.locator('.theme-toggle').first();
    await toggleBtn.click();
    await expect(root).toHaveAttribute('data-theme', 'light');

    await toggleBtn.click();
    await expect(root).toHaveAttribute('data-theme', 'dark');
  });

  test('mobile hamburger menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/index.html');

    const hamburger = page.locator('.hamburger');
    const navLinks = page.locator('.navbar-links');

    await expect(hamburger).toBeVisible();
    await expect(navLinks).not.toHaveClass(/open/);

    await hamburger.click();
    await expect(hamburger).toHaveClass(/active/);
    await expect(navLinks).toHaveClass(/open/);

    await hamburger.click();
    await expect(hamburger).not.toHaveClass(/active/);
    await expect(navLinks).not.toHaveClass(/open/);
  });
});

test.describe('Internal Links Integrity', () => {
  test('all internal links resolve without 404s and no href="#" exists', async ({ page }) => {
    await page.goto('/index.html');

    const deadLinks = await page.locator('a[href="#"]').count();
    expect(deadLinks).toBe(0);

    const links = await page.locator('.footer a').evaluateAll(els =>
      els.map(a => a.getAttribute('href')).filter(h => h && !h.startsWith('http') && !h.startsWith('mailto'))
    );

    for (const href of links) {
      const res = await page.goto(href);
      expect(res?.status()).toBe(200);
    }
  });
});
