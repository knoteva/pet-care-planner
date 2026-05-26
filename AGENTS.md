# Pet Care Planner Agent Instructions

This repository contains a Bulgarian-language capstone app for pet care coordination.

## Project Rules

- User-facing UI text, validation messages, demo data, event titles and admin labels must be in Bulgarian.
- Code identifiers, folder names, API routes, database tables and TypeScript types must stay in English.
- Use a service-layer architecture. Server Actions and REST API handlers should call shared business services instead of duplicating rules.
- Web uses Next.js Server Components and Server Actions where practical.
- Mobile uses REST API endpoints and Bearer JWT tokens.
- Database changes must always use Drizzle migrations. Do not edit production schema manually.
- Enforce authorization in services and route handlers, not only in UI components.
- Use server-side paging for large lists such as events, comments, pets, groups and users.

## Milestone Context

Milestone 1 only sets up the monorepo foundation. Database, auth and product screens come next.
