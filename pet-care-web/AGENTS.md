# Pet Care Planner Next.js App

Pet Care Planner web app: manage users, pets, groups and care events. Users register and log in, create or join groups, manage pets, participate in events and comment. Group managers can create events and moderate group activity. Admin users manage users, groups and reports.

## Technologies

Next.js + React + Tailwind + Neon DB + Drizzle ORM.

## Architectural Guidelines

- **Service layer**: implement app business logic in `src/services`, used by REST API handlers and Server Actions.
- **Modular design**: split repeated UI into reusable components to avoid large, hard-to-maintain files.
- **Auth**: JWT tokens + bcrypt or argon2 password hashing.
- **Database**: Neon DB + Drizzle ORM. Use Drizzle migrations for all schema changes.
- **Authorization**: enforce role and group access checks in services and route handlers, not only in UI.

## User Interface Guidelines

- User-facing text, validation messages and demo data must be in Bulgarian.
- Code identifiers, folders, API routes, database objects and TypeScript types must stay in English.
- Prefer Server Components. Use Client Components only for browser interaction and forms.
- Use responsive layout for desktop and mobile browsers.
