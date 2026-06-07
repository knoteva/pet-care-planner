# Pet Care Planner

## Reviewer Links

- Live Web/backend demo: https://pet-care-web-rose.vercel.app
- Live Mobile Expo Web demo: pending separate Vercel deployment from repo root
- API documentation route: https://pet-care-web-rose.vercel.app/api/docs
- Submission summary: [SUBMISSION.md](./SUBMISSION.md)
- Deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)

Pet Care Planner is a full-stack capstone project for coordinating shared pet care in neighborhood and friend groups. Users can manage pets, join groups, create or join care events, and discuss event details through comments.

## Demo Credentials

Use these accounts for review:

```text
kate_admin@paws.bg    / kate1234   admin user
kate_manager@paws.bg  / kate1234   group manager
kate_user@paws.bg     / kate1234   regular group member
```

Additional seed accounts:

```text
demo@paws.bg  / demo1234
admin@paws.bg / admin1234
```

## Repository Structure

```text
pet-care-planner/
  pet-care-web/       Next.js Web app, backend API routes and Server Actions
  pet-care-mobile/    Expo Router mobile app
  pet-care-shared/    Shared TypeScript types
```

## Tech Stack

- Next.js 16, React 19 and TypeScript
- Tailwind CSS
- Expo Router and React Native
- Neon Postgres
- Drizzle ORM and Drizzle Kit migrations
- JWT authentication with password hashing
- npm workspaces
- Vercel deployment for the Web/backend app and Expo Web mobile build

## Architecture

The Web app is the primary application and backend surface. It contains both the user interface and REST API route handlers.

Business logic is implemented in service modules under `pet-care-web/src/services`. Web Server Actions and mobile REST API endpoints call the same services, so validation and authorization rules stay in one place.

Important services:

```text
admin/admin-service.ts
auth/auth-service.ts
auth/session.ts
auth/tokens.ts
comments/comment-service.ts
events/event-service.ts
groups/group-service.ts
pets/pet-service.ts
users/user-service.ts
pagination.ts
validation.ts
```

## Roles

- Visitor: can open the landing page and register.
- User: can manage own pets, join groups, join/leave events and comment.
- Group member: can view group events and participate.
- Group manager: can create events for managed groups.
- Admin: can access the admin panel and create events in any group.

## Database

The database is PostgreSQL on Neon and is managed only through Drizzle migrations.

Implemented tables:

```text
users
pets
pet_groups
group_members
care_events
event_participants
event_comments
```

The schema includes relations, role enums, event status enums, soft-delete fields and indexes for common lookup paths.

## Scalability

Pagination is implemented at database query level with Drizzle `limit` and `offset`.

- `pet-care-web/src/services/pagination.ts` defines page parsing and page windows.
- `event-service.ts`, `pet-service.ts`, `group-service.ts`, `admin-service.ts` and `comment-service.ts` accept `{ limit, offset }` options.
- API routes such as `/api/events?page=1`, `/api/pets?page=1`, `/api/groups?page=1` and `/api/events/[id]/comments?page=1` return pagination metadata.
- Web list screens and mobile events/groups/pets screens use paged data instead of loading unlimited rows.
- `npm run db:seed:large` is an optional reviewer/staging script that creates a 10,000-row load-test event dataset for pagination proof. It is not run during normal demo setup.

## Web Screens

The Web app has more than 10 screens/routes:

```text
/
/login
/register
/dashboard
/admin
/admin/users/[id]
/api/docs
/pets
/pets/new
/pets/[id]/edit
/groups
/groups/new
/groups/join
/groups/[id]
/events/new
/events/[id]
/events/suggest
```

Legacy demo slug routes redirect to real database-backed sections.

## Mobile Screens

The Expo app has at least 5 main screens:

```text
/(tabs)           events/dashboard
/(tabs)/auth      login/profile
/(tabs)/register  registration
/(tabs)/pets      pets read-only list
/(tabs)/groups    groups list and join by invite code
```

Mobile uses the REST API with Bearer JWT tokens. Implemented mobile flows include login, register, logout, paged event/group/pet lists, join/leave event, comments list/create/edit/delete, pets read-only and groups read-only/join.

## REST API Routes

Implemented API routes include:

```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/me
GET    /api/pets?page=1
POST   /api/pets
GET    /api/pets/[id]
PUT    /api/pets/[id]
DELETE /api/pets/[id]
GET    /api/groups?page=1
POST   /api/groups
GET    /api/groups/[id]
POST   /api/groups/join
GET    /api/events?page=1
POST   /api/events
GET    /api/events/[id]
POST   /api/events/[id]/join
DELETE /api/events/[id]/join
GET    /api/events/[id]/comments?page=1
POST   /api/events/[id]/comments
PATCH  /api/events/[id]/comments/[commentId]
DELETE /api/events/[id]/comments/[commentId]
GET    /api/docs
```

The API supports Web session cookies and mobile Bearer tokens.

## Local Setup

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
copy .env.example pet-care-web\.env.local
```

Fill `DATABASE_URL` and `JWT_SECRET` in `pet-care-web/.env.local`. Do not commit real secrets.

Run database setup. The seed script also creates extra pagination demo groups/events so reviewers can immediately see paged Web/API/Mobile data:

```bash
npm run db:migrate
npm run db:seed
```

Optional large-dataset proof for pagination/scalability:

```bash
npm run db:seed:large
```

Run the Web app:

```bash
npm run dev:web
```

Run the mobile app locally:

```bash
npm run dev:mobile
```

For mobile API calls, `EXPO_PUBLIC_API_BASE_URL` can point to the Web/backend root URL. If it is not set, the mobile app falls back to the deployed backend:

```text
https://pet-care-web-rose.vercel.app
```

## GitHub Actions

The repository includes two GitHub Actions workflows:

```text
.github/workflows/ci.yml          typecheck, smoke, contract, live API tests and Playwright Web E2E tests
.github/workflows/db-backup.yml   scheduled/manual Neon Postgres backup artifact
```

For the optional Web build and DB backup workflow, add repository secrets in GitHub:

```text
DATABASE_URL
JWT_SECRET
```

## Useful Scripts

```bash
npm run dev:web
npm run dev:mobile
npm run build:web
npm run build:mobile:web
npm run typecheck
npm run db:ping
npm run db:check
npm run db:migrate
npm run db:seed
npm run db:seed:large
npm run smoke:web
npm run smoke:api
```

## Final Test Plan

Automated checks:

```bash
npm run typecheck
npm run db:ping
npm run db:check
npm run smoke:web
npm run smoke:api
npm run build:web
npm run build:mobile:web
```

Optional scalability proof:

```bash
npm run db:seed:large
npm run smoke:api
```

Web E2E notes:

- `npm run test:e2e` uses Playwright against `https://pet-care-web-rose.vercel.app` by default.
- To test another URL, set `E2E_BASE_URL`, for example `set E2E_BASE_URL=http://localhost:3000` on Windows cmd.
- The E2E suite covers login, admin access, regular-user admin restrictions and registration validation.
  Manual Web checks:

1. Open `/` and log in with `kate_user@paws.bg / kate1234`.
2. Open `/dashboard` and verify events, pets and groups load from the database.
3. Open an event page, join/leave the event and add a comment.
4. Edit and delete your own comment.
5. Open `/groups/join` and join with invite code `PAWS-SOUTH`.
6. Open `/events/suggest` as a regular user and submit a suggestion.
7. Log in as `kate_manager@paws.bg / kate1234` and create a group event.
8. Log in as `kate_admin@paws.bg / kate1234` and open `/admin`.
9. Confirm non-admin users cannot access admin-only data.

Manual Mobile checks:

1. Run `npm run dev:mobile`.
2. Log in with `kate_user@paws.bg / kate1234`.
3. Load events and use `Load more` if available.
4. Join and leave an event.
5. Open comments, create a comment, edit it and delete it.
6. Open pets and groups screens.
7. Join a group by invite code.
8. Log out from the mobile header/profile screen.

See `DEPLOYMENT.md` for deployment instructions and `SUBMISSION.md` for a short evaluator-facing summary.

## API Smoke Check

The live API smoke test uses the deployed Web/backend by default:

```bash
npm run smoke:api
```

To test another API base URL:

```bash
set SMOKE_API_BASE_URL=http://localhost:3000
npm run smoke:api
```

The script logs in with `kate_user@paws.bg / kate1234`, checks `/api/me`, paged events, pets, groups, comments and invalid-login handling.
