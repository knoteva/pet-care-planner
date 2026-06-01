# Pet Care Planner Submission Summary

## Live Demo

- Web/backend: https://pet-care-web-rose.vercel.app
- Repository: GitHub `main` branch

## Demo Accounts

```text
kate_admin@paws.bg    / kate123   admin user
kate_manager@paws.bg  / kate123   group manager
kate_user@paws.bg     / kate123   regular user/group member
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
- Mobile app connected to REST API for login/register/logout, events, join/leave, comments, pets and groups.
- Database-level pagination through Drizzle `limit` and `offset` in service queries.
- Optional `npm run db:seed:large` script for 10,000-row scalability/pagination proof without bloating normal demo setup.
- GitHub Actions CI for typecheck, smoke tests, contract tests and live API smoke testing.
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

## Manual Review Flow

1. Open the live Web app and log in with `kate_user@paws.bg / kate123`.
2. Check dashboard, pets, groups and event details.
3. Join/leave an event and create/edit/delete a comment.
4. Log in with `kate_manager@paws.bg / kate123` and create a group event.
5. Log in with `kate_admin@paws.bg / kate123` and verify admin access.
6. Run the Expo app with `EXPO_PUBLIC_API_BASE_URL=https://pet-care-web-rose.vercel.app` and test mobile login/events/comments.

## Known Limitations

- Mobile Expo Go may be blocked by local corporate network/firewall settings; mobile web and the deployed REST API are available as a fallback.
- File/photo uploads and AI checklist generation are not implemented yet. Database backups are covered by the GitHub Actions backup workflow.
- The app uses demo seed data suitable for capstone review, not production content moderation or email verification.
