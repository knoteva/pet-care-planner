import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

const requiredFiles = [
  "src/app/page.tsx",
  "src/app/login/page.tsx",
  "src/app/register/page.tsx",
  "src/app/dashboard/page.tsx",
  "src/app/admin/page.tsx",
  "src/app/pets/page.tsx",
  "src/app/pets/new/page.tsx",
  "src/app/groups/page.tsx",
  "src/app/groups/new/page.tsx",
  "src/app/groups/join/page.tsx",
  "src/app/events/new/page.tsx",
  "src/app/events/suggest/page.tsx",
  "src/app/api/auth/login/route.ts",
  "src/app/api/auth/register/route.ts",
  "src/app/api/auth/logout/route.ts",
  "src/app/api/me/route.ts",
  "src/app/api/pets/route.ts",
  "src/app/api/groups/route.ts",
  "src/app/api/groups/join/route.ts",
  "src/app/api/events/route.ts",
];

const missing = requiredFiles.filter(
  (file) => !existsSync(resolve(root, file)),
);

if (missing.length > 0) {
  console.error("Smoke check failed. Missing files:");
  for (const file of missing) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

console.log(
  `Smoke check OK. Verified ${requiredFiles.length} route/page files.`,
);
