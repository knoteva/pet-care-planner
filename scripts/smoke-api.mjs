import assert from "node:assert/strict";

const baseUrl = (process.env.SMOKE_API_BASE_URL ?? "https://pet-care-web-rose.vercel.app").replace(/\/$/, "");
const email = process.env.SMOKE_USER_EMAIL ?? "kate_user@paws.bg";
const password = process.env.SMOKE_USER_PASSWORD ?? "kate123";

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const text = await response.text();
  let body = null;
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  return { response, body };
}

function assertOk(result, label) {
  assert.ok(
    result.response.ok,
    `${label} failed with ${result.response.status}: ${typeof result.body === "string" ? result.body : JSON.stringify(result.body)}`,
  );
}

function assertPagination(body, label) {
  assert.ok(body.pagination, `${label} should return pagination metadata`);
  assert.equal(typeof body.pagination.page, "number", `${label} pagination.page should be a number`);
  assert.equal(typeof body.pagination.hasNext, "boolean", `${label} pagination.hasNext should be a boolean`);
}

console.log(`API smoke target: ${baseUrl}`);

const login = await request("/api/auth/login", {
  method: "POST",
  body: JSON.stringify({ email, password }),
});
assertOk(login, "login");
assert.equal(login.body.user.email, email, "login should return the requested user");
assert.equal(typeof login.body.token, "string", "login should return a Bearer token");

const token = login.body.token;
const authHeaders = { Authorization: `Bearer ${token}` };

const me = await request("/api/me", { headers: authHeaders });
assertOk(me, "me");
assert.equal(me.body.user.email, email, "me should return the authenticated user");

const events = await request("/api/events?page=1", { headers: authHeaders });
assertOk(events, "events");
assert.ok(Array.isArray(events.body.events), "events should be an array");
assertPagination(events.body, "events");

const pets = await request("/api/pets?page=1", { headers: authHeaders });
assertOk(pets, "pets");
assert.ok(Array.isArray(pets.body.pets), "pets should be an array");
assertPagination(pets.body, "pets");

const groups = await request("/api/groups?page=1", { headers: authHeaders });
assertOk(groups, "groups");
assert.ok(Array.isArray(groups.body.groups), "groups should be an array");
assertPagination(groups.body, "groups");

if (events.body.events.length > 0) {
  const firstEventId = events.body.events[0].id;
  const comments = await request(`/api/events/${firstEventId}/comments?page=1`, { headers: authHeaders });
  assertOk(comments, "event comments");
  assert.ok(Array.isArray(comments.body.comments), "comments should be an array");
  assertPagination(comments.body, "comments");
}

const badLogin = await request("/api/auth/login", {
  method: "POST",
  body: JSON.stringify({ email, password: "wrong-password" }),
});
assert.equal(badLogin.response.status, 401, "invalid login should be rejected with 401");

console.log("API smoke OK:");
console.log("- login returns user and token");
console.log("- /api/me accepts Bearer token");
console.log("- events, pets, groups and comments expose paged API data");
console.log("- invalid login is rejected");