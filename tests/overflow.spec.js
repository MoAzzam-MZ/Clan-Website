import { test, expect } from '@playwright/test';

const SIZES = [320, 360, 375, 390];
const PAGES = ['/index.html', '/about.html', '/story.html', '/gallery.html'];

test.describe('Mobile Horizontal Overflow Verification', () => {
  for (const pagePath of PAGES) {
    for (const width of SIZES) {
      test(`verifies NO horizontal scroll on ${pagePath} at width ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 700 });
        await page.goto(pagePath, { waitUntil: 'domcontentloaded' });

        // Evaluate scrollWidth vs clientWidth
        const dimensions = await page.evaluate(() => {
          return {
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
            bodyScrollWidth: document.body.scrollWidth,
            bodyClientWidth: document.body.clientWidth,
          };
        });

        expect(
          dimensions.scrollWidth,
          `document.documentElement.scrollWidth (${dimensions.scrollWidth}) exceeded clientWidth (${dimensions.clientWidth}) on ${pagePath} at ${width}px`
        ).toBeLessThanOrEqual(dimensions.clientWidth);

        expect(
          dimensions.bodyScrollWidth,
          `document.body.scrollWidth (${dimensions.bodyScrollWidth}) exceeded bodyClientWidth (${dimensions.bodyClientWidth}) on ${pagePath} at ${width}px`
        ).toBeLessThanOrEqual(dimensions.bodyClientWidth);
      });
    }
  }
});
