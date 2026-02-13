import { test, expect } from 'playwright-test-coverage';

/**
 * Wait for a "logged in" signal without relying on a specific avatar link.
 * 1) Prefer localStorage token (most reliable)
 * 2) Fallback: Logout link/button becomes visible
 */
async function waitUntilLoggedIn(page: any) {
  // Try token-based signal first (adjust keys if your app uses something else)
  try {
    await page.waitForFunction(() => {
      const keys = ['token', 'jwt', 'accessToken', 'authToken'];
      return keys.some((k) => window.localStorage.getItem(k));
    }, { timeout: 15000 });
    return;
  } catch {
    // Fallback if your app doesn't store tokens in localStorage
  }

  // Fallback: look for logout in UI
  await expect(
    page.getByRole('link', { name: /logout/i }).or(page.getByRole('button', { name: /logout/i }))
  ).toBeVisible({ timeout: 15000 });
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

  await Promise.all([
    page.waitForLoadState('networkidle'),
    page.getByRole('button', { name: /register/i }).click(),
  ]);

  await waitUntilLoggedIn(page);

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
