# Pet Care Planner Submission Summary

## Live Demo

- Web/backend: https://pet-care-web-rose.vercel.app
- Mobile Expo Web: https://pet-care-mobile.vercel.app
- Repository: GitHub `main` branch

## Demo Accounts

```text
kate_admin@paws.bg    / kate1234   admin user
kate_manager@paws.bg  / kate1234   group manager
kate_user@paws.bg     / kate1234   regular user/group member
```

## Implemented Scope

- Monorepo with npm workspaces: Next.js Web/backend, Expo mobile app and shared TypeScript package.
- Neon Postgres database with Drizzle ORM schema and migrations.
- Seed/demo data for users, pets, groups, events, participants and comments, including pagination demo groups/events for larger-list testing.
- JWT authentication with password hashing.
- Web session cookies and mobile Bearer token support.
- Role checks for admin, group manager and group member flows.
- Service layer for users, auth, pets, groups, events, comments, admin data, pagination and validation.
- Web UI connected to real database data for dashboard, pets, groups, events, participants and comments.
- Mobile app connected to REST API for login/register/logout, paged events/groups/pets, join/leave, comments and Expo Web static build support.
- Database-level pagination through Drizzle `limit` and `offset` in service queries.
- Optional `npm run db:seed:large` script for 10,000-row scalability/pagination proof without bloating normal demo setup.
- GitHub Actions CI for typecheck, smoke tests, contract tests, live API smoke testing and Playwright Web E2E tests.
- GitHub Actions workflow for scheduled/manual Neon Postgres backup artifacts.

## Screen Count

- Web screens/routes: 16+ user-facing screens, plus REST API routes.
- Mobile screens: 5 main tab screens/routes.

## Automated Checks

Run from the repository root:

```bash
npm test
npm run smoke:api
npm run build:web
```

`npm test` includes workspace typechecks, route smoke checks and contract checks for screens, API routes, services, pagination and auth helper presence.

`npm run smoke:api` checks the live REST API by logging in with a demo user, calling `/api/me`, checking paginated events/pets/groups/comments and confirming invalid login is rejected.

`npm run test:e2e` runs Playwright browser tests against the local Next.js app for login, admin access, regular-user restrictions and registration validation. It can also target the deployed app with `E2E_BASE_URL`.

## Manual Review Flow

1. Open the live Web app and log in with `kate_user@paws.bg / kate1234`.
2. Check dashboard, pets, groups and event details.
3. Join/leave an event and create/edit/delete a comment.
4. Log in with `kate_manager@paws.bg / kate1234` and create a group event.
5. Log in with `kate_admin@paws.bg / kate1234` and verify admin access.
6. Open the deployed Expo Web mobile app, or run Expo locally with `EXPO_PUBLIC_API_BASE_URL=https://pet-care-web-rose.vercel.app`, and test mobile login/events/comments.

## Known Limitations

- Mobile Expo Go may be blocked by local corporate network/firewall settings; Expo Web static deployment and the deployed REST API are available as a fallback.
- File/photo uploads and AI checklist generation are not implemented yet. Database backups are covered by the GitHub Actions backup workflow.
- The app uses demo seed data suitable for capstone review, not production content moderation or email verification.
