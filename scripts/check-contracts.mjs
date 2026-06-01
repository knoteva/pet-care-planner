import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

function readProjectFile(relativePath) {
  const fullPath = resolve(root, relativePath);
  assert.ok(existsSync(fullPath), `Missing required file: ${relativePath}`);
  return readFileSync(fullPath, "utf8");
}

function assertIncludes(relativePath, expected, label = expected) {
  const content = readProjectFile(relativePath);
  assert.ok(content.includes(expected), `${relativePath} should include ${label}`);
}

const webScreens = [
  "pet-care-web/src/app/page.tsx",
  "pet-care-web/src/app/login/page.tsx",
  "pet-care-web/src/app/register/page.tsx",
  "pet-care-web/src/app/dashboard/page.tsx",
  "pet-care-web/src/app/admin/page.tsx",
  "pet-care-web/src/app/admin/users/[id]/page.tsx",
  "pet-care-web/src/app/pets/page.tsx",
  "pet-care-web/src/app/pets/new/page.tsx",
  "pet-care-web/src/app/pets/[id]/edit/page.tsx",
  "pet-care-web/src/app/groups/page.tsx",
  "pet-care-web/src/app/groups/new/page.tsx",
  "pet-care-web/src/app/groups/join/page.tsx",
  "pet-care-web/src/app/groups/[id]/page.tsx",
  "pet-care-web/src/app/events/new/page.tsx",
  "pet-care-web/src/app/events/[id]/page.tsx",
  "pet-care-web/src/app/events/suggest/page.tsx",
];

const mobileScreens = [
  "pet-care-mobile/app/(tabs)/index.tsx",
  "pet-care-mobile/app/(tabs)/auth.tsx",
  "pet-care-mobile/app/(tabs)/register.tsx",
  "pet-care-mobile/app/(tabs)/groups.tsx",
  "pet-care-mobile/app/(tabs)/pets.tsx",
];

const apiRoutes = [
  "pet-care-web/src/app/api/auth/login/route.ts",
  "pet-care-web/src/app/api/auth/register/route.ts",
  "pet-care-web/src/app/api/auth/logout/route.ts",
  "pet-care-web/src/app/api/me/route.ts",
  "pet-care-web/src/app/api/pets/route.ts",
  "pet-care-web/src/app/api/groups/route.ts",
  "pet-care-web/src/app/api/groups/join/route.ts",
  "pet-care-web/src/app/api/events/route.ts",
  "pet-care-web/src/app/api/events/[id]/join/route.ts",
  "pet-care-web/src/app/api/events/[id]/comments/route.ts",
  "pet-care-web/src/app/api/events/[id]/comments/[commentId]/route.ts",
];

const serviceFiles = [
  "pet-care-web/src/services/users/user-service.ts",
  "pet-care-web/src/services/auth/auth-service.ts",
  "pet-care-web/src/services/pets/pet-service.ts",
  "pet-care-web/src/services/groups/group-service.ts",
  "pet-care-web/src/services/events/event-service.ts",
  "pet-care-web/src/services/comments/comment-service.ts",
  "pet-care-web/src/services/pagination.ts",
];

for (const file of [...webScreens, ...mobileScreens, ...apiRoutes, ...serviceFiles]) {
  readProjectFile(file);
}

assert.ok(webScreens.length >= 10, "Web app should have at least 10 screens");
assert.ok(mobileScreens.length >= 5, "Mobile app should have at least 5 screens");

for (const file of [
  "pet-care-web/src/services/pets/pet-service.ts",
  "pet-care-web/src/services/groups/group-service.ts",
  "pet-care-web/src/services/events/event-service.ts",
  "pet-care-web/src/services/comments/comment-service.ts",
]) {
  assertIncludes(file, ".limit(options.limit ??", "database-level limit pagination");
  assertIncludes(file, ".offset(options.offset ??", "database-level offset pagination");
}

assertIncludes("pet-care-web/src/services/auth/auth-service.ts", "requireAdminUser");
assertIncludes("pet-care-web/src/services/auth/auth-service.ts", "requireGroupMember");
assertIncludes("pet-care-web/src/services/auth/auth-service.ts", "requireGroupManager");
assertIncludes("pet-care-web/src/components/app-labels.ts", "formatCommentCount");
assertIncludes("pet-care-mobile/src/utils/format.ts", "formatCommentCount");

console.log("Contract checks OK:");
console.log(`- Web screens: ${webScreens.length}`);
console.log(`- Mobile screens: ${mobileScreens.length}`);
console.log(`- API routes: ${apiRoutes.length}`);
console.log(`- Service files: ${serviceFiles.length}`);
console.log("- Pagination and authorization helpers detected");