# Pet Care Planner

Pet Care Planner is a capstone full-stack project for coordinating pet groups, dog walks, pet sitting events, participants, pets and comments.

The application uses Bulgarian user-facing text in the UI and demo data. Code identifiers, folders, API routes and database objects stay in English.

## Repository Structure

```text
pet-care-planner/
  pet-care-web/       Next.js Web app and backend API
  pet-care-mobile/    Expo mobile app
  pet-care-shared/    Shared TypeScript types
```

## Local Setup

```bash
npm install
npm run dev:web
npm run dev:mobile
```

The Web app runs as the main management experience. The mobile app consumes the Web backend through REST API endpoints.

## Environment Variables

Copy `.env.example` to `.env` locally and fill in real values before adding database or authentication features.

Required variables for the planned MVP:

- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `EXPO_PUBLIC_API_BASE_URL`

## Demo Credentials

Planned demo account:

```text
demo@paws.bg / demo123
```

## Development Notes

- Use Drizzle migrations for all database schema changes.
- Keep business rules in services shared by Server Actions and REST API route handlers.
- Use server-side paging for large lists.
- Keep the Web app as the full management surface and the mobile app as the daily-use client.
