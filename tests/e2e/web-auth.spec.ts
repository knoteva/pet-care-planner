import { expect, test } from "@playwright/test";

async function login(page, email: string, password = "kate1234") {
  const response = await page.request.post("/api/auth/login", {
    data: { email, password },
  });

  expect(response.ok()).toBeTruthy();

  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/dashboard(?:\?|$)/);
}

test.describe("Pet Care Planner Web E2E", () => {
  test("regular user can log in and open the dashboard", async ({ page }) => {
    await login(page, "kate_user@paws.bg");

    await expect(page.locator('a[href="/pets"]').first()).toBeVisible();
    await expect(page.locator('a[href="/groups"]').first()).toBeVisible();
    await expect(page.locator('a[href="/events/new"]').first()).toBeVisible();
  });

  test("admin can open admin data", async ({ page }) => {
    await login(page, "kate_admin@paws.bg");
    await page.goto("/admin");

    await expect(page).toHaveURL(/\/admin(?:\?|$)/);
    await expect(
      page.locator('a[href^="/admin/users/"]').first(),
    ).toBeVisible();
  });

  test("regular user cannot see admin user links", async ({ page }) => {
    await login(page, "kate_user@paws.bg");
    await page.goto("/admin");

    await expect(page.locator('a[href^="/admin/users/"]')).toHaveCount(0);
  });

  test("logout clears the web session", async ({ page }) => {
    await login(page, "kate_user@paws.bg");

    await page.locator('form[action^="/api/auth/logout"] button').click();
    await expect(page).toHaveURL(/\/(?:\?|$)/);

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login\?redirect=/);
  });

  test("registration shows validation without creating a user", async ({
    page,
  }) => {
    await page.goto("/register");
    await page.locator('input[name="name"]').fill("E2E Test User");
    await page
      .locator('input[name="email"]')
      .fill(`e2e-${Date.now()}@example.com`);
    await page.locator('input[name="password"]').fill("kate1234");
    await page.locator('input[name="confirmPassword"]').fill("kate1235");
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/\/register(?:\?|$)/);
    await expect(page.getByTestId("auth-error")).toBeVisible();
  });
});
