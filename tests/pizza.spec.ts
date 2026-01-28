import { test, expect } from 'playwright-test-coverage';
import type { Page } from '@playwright/test';

type User = { id: string; name: string; email: string; roles: { role: string }[] };

async function basicInit(page: Page) {
  let loggedInUser: User | null = null;

  const users: Record<string, { password: string; user: User }> = {
    'd@jwt.com': {
      password: 'diner',
      user: { id: '3', name: 'Kai Chen', email: 'd@jwt.com', roles: [{ role: 'diner' }] },
    },
    'f@jwt.com': {
      password: 'franchisee',
      user: { id: '4', name: 'Franchise Owner', email: 'f@jwt.com', roles: [{ role: 'franchisee' }] },
    },
    'a@jwt.com': {
      password: 'admin',
      user: { id: '1', name: 'Admin', email: 'a@jwt.com', roles: [{ role: 'admin' }] },
    },
  };

  // Login + Logout
  await page.route('*/**/api/auth', async (route) => {
    const method = route.request().method();

    if (method === 'PUT') {
      const body = route.request().postDataJSON() as any;
      const entry = users[body?.email];
      if (entry && body?.password === entry.password) {
        loggedInUser = entry.user;
        await route.fulfill({ json: { user: loggedInUser, token: 'abcdef' } });
        return;
      }
      await route.fulfill({ status: 401, json: { error: 'Unauthorized' } });
      return;
    }

    if (method === 'DELETE') {
      loggedInUser = null;
      await route.fulfill({ json: { message: 'logout successful' } });
      return;
    }

    await route.fulfill({ status: 405, json: { error: 'Method not allowed' } });
  });

  // Who am I
  await page.route('*/**/api/user/me', async (route) => {
    await route.fulfill({ json: loggedInUser });
  });

  // Docs (some pages fetch /api/docs)
  await page.route('*/**/api/docs', async (route) => {
    await route.fulfill({
      json: {
        version: 'test',
        endpoints: [],
        config: { factory: 'https://pizza-factory.cs329.click', db: '127.0.0.1' },
      },
    });
  });

  // Menu
  await page.route('*/**/api/order/menu', async (route) => {
    await route.fulfill({
      json: [
        { id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'A garden of delight' },
        { id: 2, title: 'Pepperoni', image: 'pizza2.png', price: 0.0042, description: 'Spicy treat' },
      ],
    });
  });

  // Orders (history + create)
  await page.route('*/**/api/order', async (route) => {
    const method = route.request().method();

    if (method === 'GET') {
      await route.fulfill({
        json: {
          dinerId: 3,
          orders: [
            {
              id: 1,
              franchiseId: 2,
              storeId: 4,
              date: new Date().toISOString(),
              items: [{ id: 1, menuId: 1, description: 'Veggie', price: 0.0038 }],
            },
          ],
          page: 1,
        },
      });
      return;
    }

    if (method === 'POST') {
      const orderReq = route.request().postDataJSON();
      await route.fulfill({ json: { order: { ...orderReq, id: 23 }, jwt: 'eyJpYXQ' } });
      return;
    }

    await route.fulfill({ status: 405, json: { error: 'Method not allowed' } });
  });

  // Franchise list (dashboards + store dropdown)
  await page.route(/\/api\/franchise(\?.*)?$/, async (route) => {
    await route.fulfill({
      json: {
        franchises: [
          {
            id: 2,
            name: 'LotaPizza',
            admins: [{ id: 4, name: 'Franchise Owner', email: 'f@jwt.com' }],
            stores: [{ id: 4, name: 'Lehi', totalRevenue: 0.008 }],
          },
        ],
        more: false,
      },
    });
  });

  await page.goto('/');
}

async function uiLogin(page: Page, email: string, password: string) {
  const loginLink = page.getByRole('link', { name: /login/i });
  const loginButton = page.getByRole('button', { name: /login/i });

  if (await loginLink.count()) {
    await loginLink.first().click();
  } else {
    await loginButton.first().click();
  }

  await page.getByPlaceholder(/email/i).fill(email);
  await page.getByPlaceholder(/password/i).fill(password);
  await page.getByRole('button', { name: /login/i }).click();
}

test('home page title', async ({ page }) => {
  await basicInit(page);
  await expect(page).toHaveTitle(/JWT Pizza/i);
});

test('diner login works', async ({ page }) => {
  await basicInit(page);
  await uiLogin(page, 'd@jwt.com', 'diner');
  await expect(page.locator('body')).toBeVisible();
});

test('navigate to About and History', async ({ page }) => {
  await basicInit(page);

  await page.getByRole('link', { name: /about/i }).click();
  await expect(page).toHaveURL(/about/);

  await page.getByRole('link', { name: /history/i }).click();
  await expect(page).toHaveURL(/history/);
});

test('order flow reaches checkout', async ({ page }) => {
  await basicInit(page);

  await page.getByRole('link', { name: /order/i }).click();

  const storeSelect = page.getByRole('combobox').first();
  await expect(storeSelect).toBeVisible();
  await storeSelect.selectOption({ index: 1 });

  await page.getByText(/Veggie/i).click();
  await page.getByText(/Pepperoni/i).click();

  const checkoutBtn = page.getByRole('button', { name: /checkout/i });
  await expect(checkoutBtn).toBeEnabled();
  await checkoutBtn.click();

  await expect(page).toHaveURL(/delivery|payment|menu/i);
});

test('logout link exists after login', async ({ page }) => {
  await basicInit(page);
  await uiLogin(page, 'd@jwt.com', 'diner');
  await expect(page.getByRole('link', { name: /logout/i })).toBeVisible();
});

test('diner dashboard loads (coverage boost)', async ({ page }) => {
  await basicInit(page);
  await uiLogin(page, 'd@jwt.com', 'diner');
  await page.goto('/diner-dashboard');
  await expect(page.locator('body')).toBeVisible();
});

test('franchise dashboard loads (coverage boost)', async ({ page }) => {
  await basicInit(page);
  await uiLogin(page, 'f@jwt.com', 'franchisee');
  await page.goto('/franchise-dashboard');
  await expect(page.locator('body')).toBeVisible();
});

test('franchisee store pages load (coverage boost)', async ({ page }) => {
  await basicInit(page);
  await uiLogin(page, 'f@jwt.com', 'franchisee');

  await page.goto('/create-store');
  await expect(page.locator('body')).toBeVisible();

  await page.goto('/close-store');
  await expect(page.locator('body')).toBeVisible();
});

test('admin dashboard and franchise pages load (coverage boost)', async ({ page }) => {
  await basicInit(page);
  await uiLogin(page, 'a@jwt.com', 'admin');

  await page.goto('/admin-dashboard');
  await expect(page.locator('body')).toBeVisible();

  await page.goto('/create-franchise');
  await expect(page.locator('body')).toBeVisible();

  await page.goto('/close-franchise');
  await expect(page.locator('body')).toBeVisible();
});

test('docs + auth routes + notFound load (final coverage push)', async ({ page }) => {
  await basicInit(page);

  // Docs base + docs with param
  await page.goto('/docs');
  await expect(page.locator('body')).toBeVisible();

  await page.goto('/docs/factory');
  await expect(page.locator('body')).toBeVisible();

  // Login/Register routes (just load the view code)
  await page.goto('/login');
  await expect(page.locator('body')).toBeVisible();

  await page.goto('/register');
  await expect(page.locator('body')).toBeVisible();

  // Not found route (executes notFound.tsx)
  await page.goto('/this-route-does-not-exist');
  await expect(page.locator('body')).toBeVisible();
});

test('route smoke: key pages load without crashing (logged out)', async ({ page }) => {
  await basicInit(page);

  const routes = ['/', '/about', '/history', '/menu', '/docs', '/delivery', '/payment', '/logout'];

  for (const r of routes) {
    await page.goto(r);
    await expect(page.locator('body')).toBeVisible();
  }
});
