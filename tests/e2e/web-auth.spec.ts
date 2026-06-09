import { expect, test } from "@playwright/test";


type ApiLogin = {
  user: { id: number; email: string; name: string; role: "user" | "admin" };
  token: string;
};

async function apiLogin(page, email: string, password = "kate1234") {
  const response = await page.request.post("/api/auth/login", {
    data: { email, password },
  });

  expect(response.ok()).toBeTruthy();

  return (await response.json()) as ApiLogin;
}

async function apiGetGroups(page, token: string) {
  const response = await page.request.get("/api/groups?page=1", {
    headers: { Authorization: `Bearer ${token}` },
  });

  expect(response.ok()).toBeTruthy();

  return (await response.json()) as {
    groups: Array<{
      id: number;
      title: string;
      role: "member" | "manager" | null;
      inviteCode: string | null;
    }>;
  };
}

function nextEventStartIso() {
  const start = new Date();
  start.setDate(start.getDate() + 7);
  start.setHours(10, 0, 0, 0);
  return start.toISOString();
}
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


  test("group API hides invite codes from non-managers", async ({ page }) => {
    const { token } = await apiLogin(page, "kate_user@paws.bg");
    const { groups } = await apiGetGroups(page, token);
    const nonManagerGroups = groups.filter((group) => group.role !== "manager");

    expect(nonManagerGroups.length).toBeGreaterThan(0);
    expect(nonManagerGroups.every((group) => group.inviteCode === null)).toBeTruthy();
  });

  test("member can create, edit and delete own event", async ({ page }) => {
    const { token } = await apiLogin(page, "kate_user@paws.bg");
    const { groups } = await apiGetGroups(page, token);
    const memberGroup = groups.find((group) => group.role);

    expect(memberGroup).toBeTruthy();

    const createResponse = await page.request.post("/api/events", {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        groupId: memberGroup!.id,
        title: `E2E разходка ${Date.now()}`,
        eventType: "dog_walk",
        startsAt: nextEventStartIso(),
        durationMinutes: 30,
        location: "Южен парк",
        capacity: 8,
        notes: "Автоматичен permission тест.",
      },
    });

    expect(createResponse.ok()).toBeTruthy();
    const { event } = (await createResponse.json()) as { event: { id: number } };

    const updateResponse = await page.request.patch(`/api/events/${event.id}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { title: `E2E редактирано ${Date.now()}` },
    });

    expect(updateResponse.ok()).toBeTruthy();

    const deleteResponse = await page.request.delete(`/api/events/${event.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(deleteResponse.ok()).toBeTruthy();
  });

  test("non-member cannot create event in another group", async ({ page }) => {
    const { token } = await apiLogin(page, "kate_user@paws.bg");
    const { groups } = await apiGetGroups(page, token);
    const outsideGroup = groups.find((group) => group.role === null);

    expect(outsideGroup).toBeTruthy();

    const response = await page.request.post("/api/events", {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        groupId: outsideGroup!.id,
        title: `Forbidden event ${Date.now()}`,
        eventType: "dog_walk",
        startsAt: nextEventStartIso(),
        durationMinutes: 30,
        location: "Южен парк",
        capacity: 8,
        notes: "Този тест трябва да бъде спрян.",
      },
    });

    expect(response.status()).toBe(403);
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
