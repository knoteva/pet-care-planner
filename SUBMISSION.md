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
- JWT token plus httpOnly Web session cookie.
- Password hashing.
- User roles: `user`, `admin`.
- Group roles: `member`, `manager`.
- Admin-only admin panel.
- Pets list/create/edit/delete for the current user.
- Groups list/create/details/join by invite code.
- Group creator becomes manager.
- Events list/create/details.
- Create event only for admin or group manager.
- Join/leave event for group members.
- Event comments list/create/edit/delete.
- Regular users can suggest an event through a lightweight request/comment flow.
- REST API routes for auth, me, pets, groups, events, join/leave and comments.
- Pagination for large Web/API lists using Drizzle `limit` and `offset`.

## Implemented Mobile Functionality

- Login/register with Bearer JWT token.
- Logout from mobile header/profile.
- Events list from the REST API.
- Mobile events load more with `/api/events?page=...`.
- Join/leave event.
- Comments list/create/edit/delete.
- Pets read-only list.
- Groups read-only list and join by invite code.

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

## Scalability Evidence

- `pet-care-web/src/services/pagination.ts` centralizes page parsing and page windows.
- `event-service.ts`, `pet-service.ts`, `group-service.ts`, `admin-service.ts` and `comment-service.ts` accept `{ limit, offset }` and use Drizzle `.limit()` / `.offset()`.
- API routes return pagination metadata.
- Mobile events screen uses paged REST calls and a load-more action.

## Web Screen Count

The Web app has at least 17 page screens/routes, including public pages, dashboard, admin, pets, groups, events, API docs and dynamic detail/edit routes.

## Mobile Screen Count

The Expo app has 5 main mobile screens:

```text
dashboard/events
login/profile
register
pets
groups
```

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
7. Add, edit and delete an event comment.
8. Submit an event suggestion as regular user.
9. Log in as `kate_manager@paws.bg` and create a group event.
10. Log in as `kate_admin@paws.bg` and open the admin panel.
11. Confirm non-admin users cannot access admin-only data.
12. In mobile, log in, load events, join/leave, comment, edit/delete comment, open pets/groups and log out.
