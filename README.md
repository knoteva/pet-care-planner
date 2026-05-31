# Pet Care Planner

Pet Care Planner is a full-stack capstone project for organizing shared pet care between neighbors, friends and pet owners.

The application supports groups, pets, care events, event participation and comments. The Web app is the primary client and backend surface. The Expo mobile app is a scope-limited companion client for the most important daily flows.

## Main Features

- Public landing page with login and registration.
- JWT-based authentication with an httpOnly Web session cookie.
- Demo users with regular user, group manager and admin scenarios.
- Neon/Postgres database managed through Drizzle ORM migrations.
- Service-layer business logic for users, auth, pets, groups, events and comments.
- Web dashboard connected to real database data.
- Pets create/edit/delete for the logged-in user.
- Groups create/view/join by invite code with creator assigned as group manager.
- Events create/view for admins and group managers.
- Event join/leave and comments for group members.
- Regular members can suggest an event through a lightweight request/comment flow.
- Admin panel reads real users and aggregate stats with basic pagination.
- Expo mobile app includes 5 visual screens and is prepared for REST API integration.

## Demo Credentials

Use these accounts for project review:

```text
kate_admin@paws.bg    / kate123   global admin
kate_manager@paws.bg  / kate123   group manager in the South Park group
kate_user@paws.bg     / kate123   regular group member
```

Additional seed users:

```text
demo@paws.bg  / demo123
admin@paws.bg / admin123
```

## Roles

- Visitor: can view the public home page and register.
- User: can manage own pets and see joined groups.
- Group member: can view group events, join/leave events, comment and suggest events.
- Group manager: can create group events and manage group-level activity.
- Admin: can access the Web admin panel and create events in any group.

## Repository Structure

```text
pet-care-planner/
  pet-care-web/       Next.js Web app, Server Actions and REST API routes
  pet-care-mobile/    Expo Router mobile app
  pet-care-shared/    Shared TypeScript types
```

## Tech Stack

- Next.js 16 + React + TypeScript
- Tailwind CSS
- Expo + Expo Router
- Neon Postgres
- Drizzle ORM + Drizzle Kit migrations
- JWT auth with password hashing
- npm workspaces

## Local Setup

Install dependencies:

```bash
npm install
```

Create local Web environment file:

```bash
copy .env.example pet-care-web\.env.local
```

Fill in real values for `DATABASE_URL` and `JWT_SECRET`.

Run database migrations and seed data:

```bash
npm run db:migrate
npm run db:seed
```

Run the Web app:

```bash
npm run dev:web
```

Open:

```text
http://localhost:3000
```

Run the mobile app locally:

```bash
npm run dev:mobile
```

## Useful Scripts

```bash
npm run dev:web        # Start Next.js Web app
npm run dev:mobile     # Start Expo web/mobile dev server
npm run smoke:web
npm run build:web      # Build Web app
npm run typecheck      # Type-check all workspaces where available
npm run db:ping        # Check database connection
npm run db:check       # Check Drizzle schema/migrations
npm run db:migrate     # Apply Drizzle migrations
npm run db:seed        # Seed demo data
npm run db:studio      # Open Drizzle Studio
npm run smoke:web      # Verify important Web routes/files exist
```

## Web Screens

The Web app currently has 19 page screens:

```text
/
/login
/register
/dashboard
/admin
/api/docs
/pets
/pets/new
/pets/[id]/edit
/pets/raya/edit
/groups
/groups/new
/groups/join
/groups/[id]
/groups/yuzhen-park
/events/new
/events/[id]
/events/sabotna-razhodka
/events/suggest
```

The dynamic pages are the real database-driven versions. Legacy slug demo routes now redirect to the real database-backed sections.

## Mobile Screens

The Expo app currently has 5 main mobile screens:

```text
/(tabs)          dashboard/home
/(tabs)/auth     login
/(tabs)/register registration
/(tabs)/pets     pets
/(tabs)/groups   groups
```

The mobile app is intentionally scope-limited for this milestone. REST API integration is planned after the Web/backend flows are fully stable.

## REST API Routes

Implemented routes:

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/me
GET  /api/pets
POST /api/pets
GET  /api/pets/[id]
PUT  /api/pets/[id]
DELETE /api/pets/[id]
GET  /api/groups
POST /api/groups
GET  /api/groups/[id]
POST /api/groups/join
GET  /api/events
POST /api/events
GET  /api/events/[id]
POST /api/events/[id]/join
DELETE /api/events/[id]/join
GET  /api/events/[id]/comments
POST /api/events/[id]/comments
GET  /api/docs
```

The REST routes accept the Web session cookie and Bearer tokens, so the mobile app can use the same backend services.

## Reusable Components and Services

Key reusable Web components:

```text
app-shell.tsx
auth-form.tsx
auth-page.tsx
app-ui.tsx
event-ui.tsx
ui-primitives.tsx
logout-button.tsx
delete-pet-button.tsx
```

Service layer:

```text
admin-service.ts
auth-service.ts
comment-service.ts
event-service.ts
group-service.ts
pet-service.ts
user-service.ts
validation.ts
pagination.ts
forms/form-errors.ts
```

## What Is Real vs Demo

Real database-backed features:

- Register/login/logout.
- Users and roles.
- Admin panel user list and stats.
- Pets list/create/edit/delete.
- Groups list/create/details.
- Events list/create/details.
- Event join/leave.
- Event comments.
- Demo seed accounts.

Still demo or scope-limited:

- Legacy static slug pages redirect to the real database-backed sections.
- Invite code join flow is implemented for logged-in users.
- Mobile app is visual/scope-limited and not yet fully connected to REST API.
- Advanced moderation and AI checklist generation are placeholders.

## Final Test Plan

Recommended local checks before submission:

```bash
npm run typecheck
npm run db:ping
npm run db:check
npm run smoke:web
npm run build:web
```

Manual Web checks:

1. Open `/` and log in with `kate_user@paws.bg / kate123`.
2. Open `/dashboard` and verify events, pets and groups load from the database.
3. Open an event details page, join/leave the event and add a comment.
4. Open `/groups/join` and test an invite code, for example `PAWS-SOUTH`.
5. Open `/events/suggest` as a regular user and submit a suggestion.
6. Log out, then log in as `kate_manager@paws.bg / kate123`.
7. Open `/events/new` and create an event for a managed group.
8. Log in as `kate_admin@paws.bg / kate123` and open `/admin`.
9. Verify a non-admin user cannot access admin-only data.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel deployment instructions and [SUBMISSION.md](./SUBMISSION.md) for a short evaluator-facing summary.
