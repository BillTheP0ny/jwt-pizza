import { test, expect } from 'playwright-test-coverage';

async function waitForToken(page: any) {
  await page.waitForFunction(() => {
    const t = window.localStorage.getItem('token');
    return typeof t === 'string' && t.length > 10;
  }, { timeout: 15000 });
}

test('diner can update name and see it on screen', async ({ page }) => {
  const email = `user${Math.floor(Math.random() * 100000)}@jwt.com`;
  const password = 'diner';

  await page.goto('/');

  // Register
  await page.getByRole('link', { name: /register/i }).click();
  await page.getByRole('textbox', { name: /full name/i }).fill('pizza diner');
  await page.getByRole('textbox', { name: /email address/i }).fill(email);
  await page.getByRole('textbox', { name: /password/i }).fill(password);

  await page.getByRole('button', { name: /register/i }).click();

  // ✅ Wait for logged in signal
  await waitForToken(page);

  // Go to diner dashboard
  await page.goto('/diner-dashboard');

  // Wait for the dashboard to hydrate (avoids "Loading user..." race)
  await expect(page.getByRole('main')).toContainText('Your pizza kitchen', { timeout: 15000 });
  await expect(page.getByRole('main')).not.toContainText('Loading user...', { timeout: 15000 });

  // Confirm starting name
  await expect(page.getByRole('main')).toContainText('pizza diner', { timeout: 15000 });

  // Open edit modal
  await page.getByRole('button', { name: /^edit$/i }).click();
  await expect(page.getByRole('heading', { name: /edit user/i })).toBeVisible({ timeout: 15000 });

  // Change name (first textbox inside modal = name)
  const dialog = page.locator('#hs-jwt-modal');
  await expect(dialog).toBeVisible({ timeout: 15000 });

  await dialog.getByRole('textbox').first().fill('pizza dinerx');
  await dialog.getByRole('button', { name: /^update$/i }).click();

  // Modal should close (hs-overlay adds .hidden)
  await page.waitForSelector('#hs-jwt-modal.hidden', { state: 'attached', timeout: 15000 });

  // Confirm UI updated
  await expect(page.getByRole('main')).toContainText('pizza dinerx', { timeout: 15000 });
});
