import { test, expect } from '@playwright/test';

test.describe('AI Chatbot & Security Tests', () => {
  test('opens and closes chat panel correctly', async ({ page }) => {
    await page.goto('/index.html');
    const toggleBtn = page.locator('#aiChatToggleBtn');
    const panel = page.locator('#aiChatPanel');
    const widget = page.locator('#aiChatWidget');

    await expect(widget).not.toHaveClass(/active/);

    await toggleBtn.click();
    await expect(widget).toHaveClass(/active/);

    const closeBtn = page.locator('#aiChatCloseBtn');
    await closeBtn.click();
    await expect(widget).not.toHaveClass(/active/);
  });

  test('displays user and AI messages as plain text, neutralising XSS payloads', async ({ page }) => {
    await page.goto('/index.html');
    await page.locator('#aiChatToggleBtn').click();

    // Check XSS payloads for user input and model output
    const payloads = [
      '<img src=x onerror=alert(1)>',
      '<script>alert(1)</script>',
      '"><svg/onload=alert(1)>',
    ];

    let alertTriggered = false;
    page.on('dialog', async dialog => {
      alertTriggered = true;
      await dialog.dismiss();
    });

    for (const payload of payloads) {
      await page.evaluate((text) => {
        // Call appendMessage directly
        window.appendMessage('user', text);
        window.appendMessage('assistant', text);
      }, payload);

      // Verify no img with onerror or script or svg element was created
      const imagesWithOnError = await page.locator('img[onerror]').count();
      expect(imagesWithOnError).toBe(0);

      const injectedScripts = await page.locator('.ai-message script').count();
      expect(injectedScripts).toBe(0);

      const injectedSvgs = await page.locator('.ai-message-content svg').count();
      expect(injectedSvgs).toBe(0);

      // Verify textContent matches verbatim
      const userMsg = page.locator('.ai-message.user .ai-message-content').last();
      await expect(userMsg).toHaveText(payload);

      const assistantMsg = page.locator('.ai-message.assistant .ai-message-content').last();
      await expect(assistantMsg).toHaveText(payload);
    }

    expect(alertTriggered).toBe(false);
  });

  test('handles mocked AI chatbot backend responses & errors gracefully', async ({ page }) => {
    // Mock the interactions endpoint
    await page.route('**/v1beta/interactions*', async route => {
      if (route.request().method() === 'POST') {
        const body = JSON.parse(route.request().postData() || '{}');
        if (body.input && body.input.includes('error-test')) {
          await route.fulfill({
            status: 403,
            contentType: 'application/json',
            body: JSON.stringify({ error: { message: 'Forbidden origin' } }),
          });
          return;
        }

        // Return mock reply with malicious output to test plain text rendering
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'mock-interaction-123',
            steps: [
              {
                type: 'model_output',
                content: [{ type: 'text', text: 'مرحبًا! <script>alert("xss")</script> أنا جاهز.' }],
              },
            ],
          }),
        });
        return;
      }

      // Mock GET /v1beta/interactions/{id}
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'mock-interaction-123' }),
      });
    });

    await page.goto('/index.html');
    await page.locator('#aiChatToggleBtn').click();

    // Send normal question
    const input = page.locator('#aiChatInput');
    await input.fill('ما هي لجان ألكساندرز؟');
    await page.locator('#aiChatSendBtn').click();

    // Verify assistant reply appeared and neutralised the script tag
    const reply = page.locator('.ai-message.assistant .ai-message-content').last();
    await expect(reply).toContainText('مرحبًا! <script>alert("xss")</script> أنا جاهز.');
    const scriptCount = await page.locator('.ai-message.assistant script').count();
    expect(scriptCount).toBe(0);

    // Send message that triggers 403
    await input.fill('error-test');
    await page.locator('#aiChatSendBtn').click();

    // Verify friendly system-error message
    const errorBubble = page.locator('.ai-message.system-error .ai-message-content').last();
    await expect(errorBubble).toBeVisible();
    await expect(errorBubble).toContainText('عذرًا، خدمة المساعد الذكي غير متاحة حاليًا');
  });
});
