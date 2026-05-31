# Submission Summary

## Project

Pet Care Planner is a monorepo capstone project with:

- Next.js Web app and backend API in `pet-care-web`.
- Expo Router mobile app in `pet-care-mobile`.
- Shared TypeScript package in `pet-care-shared`.
- Neon/Postgres database with Drizzle ORM migrations.

## Demo Credentials

```text
kate_admin@paws.bg    / kate123   admin
kate_manager@paws.bg  / kate123   group manager
kate_user@paws.bg     / kate123   regular user
```

## Implemented Web Functionality

- Register, login and logout.
- JWT token + httpOnly Web session cookie.
- Password hashing.
- User roles: `user`, `admin`.
- Group roles: `member`, `manager`.
- Admin-only admin panel.
- Pets list/create/edit/delete for current user.
- Groups list/create/details/join by invite code.
- Group creator becomes manager.
- Events list/create/details.
- Create event only for admin or group manager.
- Join/leave event for group members.
- Event comments list/create.
- Regular users can suggest an event through a lightweight request/comment flow.
- REST API routes for auth, me, pets, groups, events, join/leave and comments.
- Basic pagination for large Web lists.

## Implemented Database Tables

```text
users
pets
pet_groups
group_members
care_events
event_participants
event_comments
```

## Web Screen Count

The Web app has at least 19 page screens/routes, including public pages, dashboard, admin, pets, groups, events, API docs and legacy routes that redirect to database-backed sections.

## Mobile Screen Count

The Expo app has 5 main mobile screens:

```text
dashboard/home
login
register
pets
groups
```

The mobile app is intentionally scope-limited for this stage. The Web backend now exposes REST routes prepared for the mobile integration milestone.

## Architecture Notes

- Business logic is placed in `pet-care-web/src/services`.
- Server Actions and API route handlers call service-layer functions.
- Database schema is defined in Drizzle under `pet-care-web/src/db/schema.ts`.
- Migrations are generated and applied through Drizzle Kit only.
- Web UI text is Bulgarian-facing; code identifiers stay in English.

## Final Test Commands

```bash
npm run typecheck
npm run smoke:web
npm run db:ping
npm run db:check
npm run build:web
```

## Manual Test Checklist

1. Log in as `kate_user@paws.bg`.
2. Verify dashboard data loads from DB.
3. Create/edit/delete a pet.
4. View groups and group details.
5. Join a group by invite code from `/groups/join`.
6. Join and leave an event.
7. Add an event comment.
8. Submit an event suggestion as regular user.
9. Log in as `kate_manager@paws.bg` and create a group event.
10. Log in as `kate_admin@paws.bg` and open the admin panel.
11. Confirm non-admin users cannot access admin-only data.
