<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions and file structure may differ from older examples. Read the relevant guide in `node_modules/next/dist/docs/` before writing code and heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Pet Care Web Instructions

This package contains the Next.js Web app and backend API for Pet Care Planner.

- Keep user-facing UI text in Bulgarian.
- Keep code identifiers, API route names, file names and database identifiers in English.
- Prefer Server Components. Use Client Components only for browser-only interaction.
- Put business rules in `src/services` and call those services from Server Actions and API route handlers.
- Put database schema, client setup and seed scripts in `src/db`.
- Put mobile REST endpoints under `src/app/api`.
- Protect private routes server-side and enforce authorization in services.
- All future database changes must use Drizzle migrations.
