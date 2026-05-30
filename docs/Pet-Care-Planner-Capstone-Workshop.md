**Pet Care Planner**

Building a Full-Stack App – Custom Capstone Workshop

Course: Full-Stack Apps with AI

**This document defines a custom capstone project for a multi-platform full-stack application built with AI-assisted development.** The project is intentionally similar in structure to the workshop app, but it uses a different domain: pet care, dog walks and small neighborhood pet groups.

> **Language note**
>
> The project brief is written in English. The actual application should use Bulgarian user-facing text: navigation, buttons, validation messages, sample data, comments, event titles and admin labels. Code identifiers, folder names and API routes should stay in English for maintainability.

| **Author**                         | ...                       |
|------------------------------------|---------------------------|
| **Email**                          | ...                       |
| **GitHub Repo**                    | ...                       |
| **Web Project Live URL**           | ...                       |
| **Expo Project Live URL**          | ...                       |
| **Credentials for testing**        | demo@paws.bg / demo123    |
| **Recommended Bulgarian app name** | Лапички / Разходки с лапи |

# 1. Project Assignment

- Use AI-assisted development to implement and deploy a fully functional multi-platform full-stack app.

- Implement a Next.js backend, a Next.js Web client and a React Native / Expo mobile client.

- Use PostgreSQL hosted in Neon, Drizzle ORM migrations and a service-layer architecture.

- Use JWT-based authentication with secure password hashing and role-based access control.

- Deploy the Web app and backend together, and deploy the Expo app separately as a Web export.

- Keep a visible GitHub history with meaningful commits across multiple days.

# 2. Project Description: Pet Care Planner

**Build a "Pet Care Planner" app:** a software product for pet owners, neighbors and small friend groups to organize dog walks, pet sitting events and simple care coordination.

- The app holds private pet groups where users coordinate walks and care events.

- Groups have managers and members. Managers invite members and organize events.

- Members register their pets, join or leave events, select which pet is coming and comment on event details.

- The Web app implements the full management experience. The mobile app implements the most important end-user flows.

## Main domain objects

| **Object**          | **Meaning in the app**                                       | **Examples in Bulgarian**                           | **Main actions**                     |
|---------------------|--------------------------------------------------------------|-----------------------------------------------------|--------------------------------------|
| Pet Group           | A private community of pet owners or helpers.                | “Южен парк - разходки”, “Младост: помощ за любимци” | create, invite, view, manage members |
| Pet Profile         | A user-owned pet record.                                     | “Рая”, “Макс”, “Лора”                               | create, edit, add notes/photo        |
| Care Event          | A scheduled dog walk, pet sitting slot or pet playdate.      | “Съботна разходка”, “Вечерна грижа”                 | create, edit, cancel, join/leave     |
| Event Participation | A user joins an event with one of their pets or as a helper. | “Идвам с Макс”, “Ще помогна без куче”               | join, leave, update pet/notes        |
| Comment             | Short communication inside an event.                         | “Ще закъснея 10 мин.”                               | add, edit, delete                    |

## Roles in the App

- Visitor: can view the public home page and register.

- User / Pet Owner: can manage their profile, add pets, create a group and accept group invitations.

- Group Member: can view group events, join or leave events, select a pet, comment and share event links.

- Group Manager: can create, edit, cancel and delete events; invite members; promote or remove managers; remove members from a group.

- Admin: can view and manage all users, pet groups, pets, events and reported comments from a Web admin panel.

## Visitors

- Visitors are anonymous users of the public Web site.

- Visitors can see the landing page, read the app description and register with email + password.

- All other pages should require authentication.

## Registered Users and Pet Owners

- A registered user has a profile with name, email and optional photo.

- Users can add one or more pet profiles. Pet profile fields should be simple and user-friendly: name, type, breed, age, size, notes and optional photo.

- Users can create pet groups. The user who creates a group becomes the first group manager.

- Users can join existing groups through invite links or invite codes shared by group managers.

## Group Managers

- Group managers organize care events inside their groups: create, edit, cancel and delete events.

- Events hold: title, event type, date, time, location, capacity, notes and canceled state.

- Managers can invite users, promote other members as managers and remove members from the group.

- Managers can moderate comments in their group events.

- Managers can optionally generate a Bulgarian AI checklist for a care event.

## Group Members and Care Events

- Members can browse events in their groups: upcoming, current and past events.

- Always display the state of each event: upcoming, current, past, canceled, under capacity, full capacity or over capacity.

- An event is upcoming before its start time. It becomes current during the configured event duration. After that, it becomes past.

- An event can be canceled by a manager and then it is not open for joining.

- Members can join an active event and choose one of their pets, or join as a helper without a pet.

- Members can leave an event after joining. A short optional reason/comment can be added.

- Do not hard-block joining when capacity is reached. Show a clear over-capacity warning and let the group resolve it.

- Members can add comments such as: “Ще закъснея 10 мин.”, “Може ли да дойда с две кучета?”, “Ще донеса вода.”

- Comments can be edited or deleted by their owner, group managers and admins.

## Web App and Mobile App Scope

- The Web app is the primary app. It implements the full functionality: profile, pets, groups, event management, comments, admin panel and optional AI features.

- The mobile app is smaller. It focuses on the most important daily functionality: login/register, view upcoming events, event details, join/leave, select a pet and comment.

# 3. Project Requirements

## Technologies

- Backend: Next.js route handlers / server functions with TypeScript.

- Database: Neon serverless PostgreSQL, Drizzle ORM and Drizzle Kit migrations.

- Web app: Next.js + React + TypeScript + Tailwind.

- Mobile app: React Native + Expo + Expo Router.

- Deployment: managed serverless hosting such as Netlify or Vercel, plus Neon for the database.

## Architecture

- Use a client-server architecture.

- The Next.js Web app communicates with the backend through Server Actions and server-side components where possible.

- The Expo mobile client communicates with the Next.js backend through RESTful API endpoints and Bearer JWT tokens.

- Use a Node.js monorepo: one project for the Web/backend, one for the mobile app and one shared package for common TypeScript types.

- Keep business logic in services. Server Actions and API route handlers should call the same service-layer functions.

- Avoid large monolithic files. Split pages, components, services, DB code, validation helpers and API utilities into separate modules.

## User Interface (UI)

- The document is in English, but the final UI must be in Bulgarian.

- Use Bulgarian labels for user-facing screens, buttons, empty states, validation messages and seeded demo content.

- Use modern responsive design for desktop, mobile browsers and tablets.

- Use cards, badges, status labels and icons to make event state and capacity easy to understand.

- Use reusable UI components: Button, Card, Badge, FormField, EmptyState, Pagination, EventCard, PetAvatar, CommentList.

- Use server-rendered components in Next.js unless client-side interactivity is needed.

## Backend

- Use Drizzle to access and migrate the PostgreSQL schema.

- Implement authentication, profile, pet, group, event, participation and comment services.

- Expose RESTful API endpoints for the mobile app.

- Use server-side paging for large lists: events, pets, users, groups and comments.

- Use object storage only if file uploads are implemented. Suggested uploads: pet profile photos and group cover photos.

## Authentication and Authorization

- Use JWT tokens for sessions. Store tokens in cookies for the Web app and use Bearer tokens for the mobile API.

- Hash passwords with bcrypt or argon2.

- Implement register, login, logout and current-user/session retrieval.

- Enforce authorization in services, API endpoints, Server Actions and protected routes.

- Access rules must check group membership and manager status before allowing event or member management.

## Database

- Use normalized tables with clear foreign keys and indexes.

- Use Drizzle migrations for every schema change and commit generated SQL migrations in GitHub.

- Create a seed script with realistic Bulgarian demo data.

- Populate large tables with at least 10,000 records for paging and performance validation.

- Use indexes for common filters: events by group/date, memberships by user/group, comments by event/date.

## Scalability

- All list screens must use server-side paging or cursor-based pagination.

- Avoid loading all events/comments/users at once.

- Test dashboard and admin lists with generated large datasets.

- Use database indexes and avoid unnecessary N+1 queries.

## Deployment

- Deploy the Next.js backend + Web app as one live project.

- Configure production environment variables: DATABASE_URL, JWT_SECRET, API base URL and storage credentials if used.

- Deploy the Expo mobile app as a Web export and point it to the production RESTful API URL.

- Optionally build an Android APK using Expo EAS and publish it in GitHub Releases.

- Provide demo credentials for easy testing.

## GitHub Repo and AI Agent Instructions

- Use a public GitHub repository with meaningful commit history.

- Create at least 15 commits on at least 3 different days.

- Add AGENTS.md files with project-specific instructions for AI coding agents.

- Document the architecture, database schema, repo structure and local setup in README.md.

# 4. Steps to Build the Project

- Follow the steps below incrementally. After each working milestone, run the app, test the behavior and commit the change.

## Create a VS Code Project

- Create a new project workspace, for example `pet-care-planner`.

- Use English folder names and code identifiers even though the UI is in Bulgarian.

## Define the Repo Structure

- Use a monorepo with npm workspaces or another simple workspace setup.

```text
pet-care-planner/
├── package.json
├── AGENTS.md
├── README.md
├── pet-care-web/        # Next.js Web app + backend API
│   ├── src/app/         # Web pages, layouts and route groups
│   ├── src/app/api/     # RESTful API endpoints for mobile
│   ├── src/components/  # Reusable Web UI components
│   ├── src/services/    # Business logic and authorization checks
│   ├── src/db/          # Drizzle schema, DB client and seed scripts
│   ├── src/drizzle/     # Drizzle migrations
│   ├── tests/           # Optional Web/backend tests
│   ├── AGENTS.md
│   └── package.json
├── pet-care-mobile/     # Expo mobile app
│   ├── src/app/         # Expo Router screens
│   ├── src/components/  # Reusable mobile UI components
│   ├── src/services/    # API client and auth storage
│   ├── tests/           # Optional mobile tests
│   ├── AGENTS.md
│   └── package.json
└── pet-care-shared/     # Shared TypeScript types
    ├── src/types.ts
    └── package.json
```

1.  Initialize the monorepo in the root folder.

2.  Create the Next.js app in `pet-care-web`.

3.  Create the Expo app in `pet-care-mobile`.

4.  Create `pet-care-shared` for shared types such as User, Pet, PetGroup, CareEvent and EventComment.

5.  Add root scripts to build, lint and run both apps.

## Create `src` Folders

- Keep source code under `src/` in each project to separate application code from configuration and generated files.

- Move default generated files from the starter projects only when this does not break framework conventions.

## Setup GitHub Repo

- Remove nested Git repositories if the starter projects created them.

- Initialize Git in the root folder and configure `.gitignore` for Node, Next.js, Expo and environment files.

- Commit early: initial monorepo, Web app setup, mobile app setup, shared types and documentation skeleton.

## Setup AGENTS.md Instructions

- Create root `AGENTS.md` with project context, architecture rules and technology choices.

- Create `pet-care-web/AGENTS.md` for Next.js, Drizzle, services, Server Actions, REST API and Bulgarian UI guidance.

- Create `pet-care-mobile/AGENTS.md` for Expo Router, API client, Bearer tokens, responsive mobile UI and Web fallback dialogs.

- Important instruction: DB changes must always use Drizzle migrations, not manual production SQL edits.

Suggested AGENTS.md note:
The app is a Bulgarian-language Pet Care Planner. Keep user-facing text in Bulgarian. Keep code identifiers, API routes and folder names in English. Use service-layer business logic shared by Server Actions and RESTful API route handlers. Do not bypass authorization checks in UI-only code.

## Define README.md

- Describe what the app does and who can do what.

- Document local setup, environment variables, database migrations, seed script, deployment and demo credentials.

- Include a database relationship diagram or Mermaid ER diagram.

# 5. Steps to Build the Next.js Project

## Open the Next.js Project

- Start with the Web/backend app because the mobile client depends on the RESTful API.

- Open `pet-care-web` separately in VS Code when implementing Web/backend features to reduce confusion.

## Create Neon DB

- Create a new Neon project, for example `PetCareDB`.

- Configure the local `.env` file with `DATABASE_URL`, `JWT_SECRET` and any optional storage variables.

```env
DATABASE_URL=postgresql://...
JWT_SECRET=replace_with_random_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Design the Database

The first schema should be simple enough to implement quickly, but rich enough to support roles, events, comments and pets.

| **Table**          | **Purpose**                                      | **Important fields**                                                                          | **Relationships / indexes**                    |
|--------------------|--------------------------------------------------|-----------------------------------------------------------------------------------------------|------------------------------------------------|
| users              | Registered app users.                            | id, email, passwordHash, name, role, photoUrl, createdAt                                      | unique email; admin flag or role               |
| pets               | Pets owned by users.                             | id, ownerId, name, type, breed, age, size, notes, photoUrl                                    | ownerId -\> users.id; index ownerId            |
| pet_groups         | Private groups for walks and care coordination.  | id, title, description, area, inviteCode, createdById, createdAt                              | createdById -\> users.id; unique inviteCode    |
| group_members      | Memberships and manager permissions.             | id, groupId, userId, isManager, joinedAt                                                      | unique groupId + userId; index userId          |
| care_events        | Walks, pet sitting slots and playdates.          | id, groupId, title, eventType, startsAt, durationMinutes, location, capacity, canceled, notes | index groupId + startsAt                       |
| event_participants | Users joined to events with selected pet.        | id, eventId, userId, petId, helperOnly, joinedAt, note                                        | unique eventId + userId + petId; index eventId |
| event_comments     | Comments on events.                              | id, eventId, userId, text, createdAt, updatedAt, deletedAt                                    | index eventId + createdAt                      |
| event_checklists   | Optional AI-generated Bulgarian checklist items. | id, eventId, text, completed, createdAt                                                       | eventId -\> care_events.id                     |

- Use simple numeric IDs for rows unless there is a strong reason to use UUIDs.

- Keep event types controlled: dog_walk, pet_sitting, playdate, training, vet_support, other.

- Store dates in UTC and format them for Bulgarian users in the UI.

- Use soft deletion only if needed. For the MVP, canceled events can simply be marked with `canceled = true`.

## Generate and Run Drizzle Migrations

- Install Drizzle ORM, Drizzle Kit, Neon driver, dotenv and auth-related packages.

- Create a Drizzle schema file and generate the first migration.

```bash
npm install drizzle-orm @neondatabase/serverless
npm install -D drizzle-kit dotenv tsx
npm run db:generate
npm run db:migrate
```

- Commit the schema, migration SQL and migration configuration after the migration works.

## Seed Sample Data

- Create `npm run db:seed` to insert demo data.

- Use Bulgarian sample content because the app UI is Bulgarian.

- Create sample users: demo@paws.bg / demo123, maria.petkova@example.com / pass123, ivan.georgiev@example.com / pass123, elena.dimitrova@example.com / pass123, plus generated users user1...user50.

- Create sample pets: Рая, Макс, Бела, Арчи, Лора, Роки, Моли.

- Create sample groups: “Южен парк - разходки”, “Младост: помощ за любимци”, “Квартални лапички - Лозенец”.

- Create sample events: “Съботна разходка в Южния парк”, “Вечерна грижа за Рая”, “Игри в кучешката градинка”, “Помощ за ветеринарен час”.

- Insert comments in Bulgarian, for example: “Ще закъснея 10 мин.”, “Ще донеса вода.”, “Макс е малко притеснителен с големи кучета.”

- Generate at least 10,000 care events and comments for paging/performance tests.

## Public Pages and Layout

- Create a public Home page with Bulgarian marketing text, Login and Register buttons.

- Create Login and Register pages in an auth route group.

- Create a global layout with header, main area and footer.

- Header navigation should change based on whether the user is logged in.

- Use responsive header behavior for phone-width screens.

## Login / Logout

- Implement register, login and logout with Server Actions for the Web app.

- Store the signed JWT in an HTTP-only cookie.

- Show the currently logged-in user in the header.

- Redirect logged-in users to the Dashboard after login.

- Protect all routes except Home, Login and Register.

## User Dashboard

- Create `/dashboard` as the main logged-in page.

- Section “Предстоящи събития”: active events from the user’s groups, ordered by date.

- Section “Архив”: past and canceled events, displayed with paging.

- Display event cards: title, date, group, location, status badge, capacity badge, participant count and comment count.

- Clicking an event card opens `/events/\[id\]`.

## View / Join Care Event

- Create `/events/\[id\]` for event details.

- Only group members can view events from their group.

- Display full event info: title, type, date/time, duration, location, status, capacity, participants, pets and comments.

- Implement Join / Leave behavior. When joining, the user selects one of their pets or chooses helper-only participation.

- Update participants and capacity indicators after join/leave.

- Implement “Share event link” to copy a shareable event URL.

# 6. Minimalistic RESTful API

- Build a small RESTful API in the Next.js project for the Expo mobile app.

- The Web app should use Server Actions. The mobile app should use HTTP endpoints.

- All protected API endpoints must read and validate Bearer JWT tokens.

| **Endpoint**                     | **Purpose**                                          | **Notes**                                       |
|----------------------------------|------------------------------------------------------|-------------------------------------------------|
| POST /api/auth/register          | Register a new user and return a token.              | Used by mobile app if registration is included. |
| POST /api/auth/login             | Login with email + password and return a JWT token.  | Used by mobile app.                             |
| GET /api/me                      | Return the current user profile.                     | Requires Bearer token.                          |
| GET /api/pets                    | List the current user’s pets.                        | Use paging if needed.                           |
| POST /api/pets                   | Create a pet profile.                                | MVP optional for mobile, required for Web.      |
| GET /api/events                  | List active care events from the user’s groups.      | Requires paging.                                |
| GET /api/events/\[id\]           | Return event details, participants and comments.     | Check group membership.                         |
| POST /api/events/\[id\]/join     | Join an event with selected pet or helper-only mode. | Reject if canceled/past.                        |
| POST /api/events/\[id\]/leave    | Leave an event.                                      | Only current participant can leave.             |
| POST /api/events/\[id\]/comments | Add a comment.                                       | Bulgarian text in demo UI.                      |
| PATCH /api/comments/\[id\]       | Edit a comment.                                      | Owner/manager/admin only.                       |
| DELETE /api/comments/\[id\]      | Delete a comment.                                    | Owner/manager/admin only.                       |
| GET /api/docs                    | Display simple API documentation as HTML.            | Useful while building Expo client.              |

- Commit and push after the first API version works with a manual API client or browser testing.

# 7. Steps to Build the Expo Project

## Add API Docs to AGENTS.md

\# API Docs
- Local backend API documentation: http://localhost:3000/api/docs
- Production backend API base URL: https://\<your-web-app\>.netlify.app/api
- API source code: ../pet-care-web/src/app/api

## Home Page and Navigation

- Start from a clean Expo project and remove unnecessary template screens/assets.

- Create stack navigation with screens: Home, Login, Register, Events, Event Details, My Pets, Profile.

- Home page should have Bulgarian text and a Login/Register entry point.

- Implement Web-compatible replacements for native alerts/confirm dialogs when needed.

## Login / Logout

- Configure the API base URL in Expo environment variables.

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

- Implement a login form with Bulgarian validation messages.

- Store the JWT token securely enough for the course scope. For Web export, use local storage or a documented abstraction; for native, use SecureStore if added.

- Make all screens except Home, Login and Register require a logged-in user.

- Implement Logout and clear the stored token.

## Events Dashboard

- List active upcoming/current events with paging.

- Display clickable cards with title, date, group, location, status and participant count.

- Use a loading state, empty state and error state in Bulgarian.

## Event Details

- Display full event info: title, date, location, notes, participants, pets, capacity and comments.

- Implement Join / Leave. When joining, allow pet selection.

- Refresh event details after any join/leave/comment action.

- Keep manager/admin-only functionality out of the mobile MVP unless there is extra time.

## My Pets Screen

- Display the user’s pets with cards.

- For the MVP, pet creation can be Web-only. If time allows, add Create/Edit Pet in mobile as well.

- Show a clear empty state: “Все още нямате добавени любимци.”

# 8. Deploy the Next.js App

- Deploy the Next.js Web/backend project from GitHub to Netlify, Vercel or another supported hosting provider.

- Configure production environment variables: DATABASE_URL, JWT_SECRET, NEXT_PUBLIC_APP_URL and storage variables if file uploads are used.

- Run production migrations against the Neon database before final testing.

- Test public pages, login, dashboard, event details, group pages and admin pages on the deployed URL.

# 9. Deploy the Expo App

- Deploy the Expo app as a Web export to Netlify or another static hosting provider.

- Configure `EXPO_PUBLIC_API_BASE_URL` to point to the deployed Next.js API.

- Test login, events list, event details, join/leave and comments against the production API.

- Optional: create an Android APK with EAS and upload it to GitHub Releases.

# 10. Advanced Web App Functionality

- The following features can be implemented after the MVP is working. They make the project feel complete and help cover assessment criteria.

| **Feature**                 | **Description**                                                                           | **Priority** |
|-----------------------------|-------------------------------------------------------------------------------------------|--------------|
| Dashboard paging            | Add server-side paging to archive events and large group lists.                           | High         |
| Event comments              | Add/edit/delete comments with ownership and manager moderation.                           | High         |
| View groups                 | List user groups and show group details with members and events.                          | High         |
| Manage groups               | Create/edit/delete groups, generate invite link, manage members and managers.             | High         |
| Pet profiles                | Create/edit pets, add notes, optional photo upload.                                       | High         |
| Event management            | Create/edit/cancel/delete events for group managers.                                      | High         |
| Admin panel                 | Manage users, groups, pets, events and comments.                                          | Medium       |
| Bulgarian localization pass | Review all UI text and validation messages for consistent Bulgarian wording.              | Medium       |
| File uploads                | Upload pet photos and group cover images through object storage.                          | Bonus        |
| AI checklist generator      | Generate a Bulgarian checklist for care events. Keep it non-medical and clearly advisory. | Bonus        |
| Automated tests             | Add service tests and selected end-to-end tests for auth and event join flows.            | Bonus        |
| Backups                     | Automate DB/storage backups with GitHub Actions if time allows.                           | Bonus        |

## AI Feature: Bulgarian Care Checklist Generator

- This feature is optional but thematically useful for a course involving AI-assisted apps.

- A group manager can click “Генерирай списък” on an event page.

- The app sends event type, location, date/time, weather note if manually entered, and pet notes to an AI service.

- The generated checklist is saved in `event_checklists` and displayed in Bulgarian.

- Avoid medical or veterinary claims. Add a small disclaimer: “Това е помощен списък, не ветеринарен съвет.”

# 11. Suggested Web Screens

| **\#** | **Screen / route**                                               | **Purpose**                                  |
|--------|------------------------------------------------------------------|----------------------------------------------|
| 1      | Home /                                                           | Public landing page in Bulgarian.            |
| 2      | Register /(auth)/register                                        | Create user account.                         |
| 3      | Login /(auth)/login                                              | Login form.                                  |
| 4      | Dashboard /dashboard                                             | Upcoming/current events and archive.         |
| 5      | My Pets /pets                                                    | List current user’s pets.                    |
| 6      | Add/Edit Pet /pets/new, /pets/\[id\]/edit                        | Create or update pet profile.                |
| 7      | Groups /groups                                                   | List user’s groups.                          |
| 8      | Group Details /groups/\[id\]                                     | Group info, members, events.                 |
| 9      | Create/Edit Group /groups/new, /groups/\[id\]/edit               | Manager group management.                    |
| 10     | Event Details /events/\[id\]                                     | Details, participants, comments, join/leave. |
| 11     | Create/Edit Event /groups/\[id\]/events/new, /events/\[id\]/edit | Manager event creation and editing.          |
| 12     | Admin Panel /admin                                               | Admin overview and management.               |
| 13     | API Docs /api/docs                                               | HTML API docs for mobile development.        |

# 12. Suggested Mobile Screens

| **\#** | **Screen**         | **Purpose**                                    |
|--------|--------------------|------------------------------------------------|
| 1      | Home               | Bulgarian welcome screen and auth entry point. |
| 2      | Login / Register   | Authentication through REST API.               |
| 3      | Events             | Paged list of active events.                   |
| 4      | Event Details      | View details, join/leave, comments.            |
| 5      | My Pets            | List user pets for event join selection.       |
| 6      | Profile / Settings | Logout and basic user info.                    |

# 13. Suggested Bulgarian UI Text

| **English concept** | **Bulgarian UI text**  | **Where used**    |
|---------------------|------------------------|-------------------|
| Dashboard           | Табло                  | Header/navigation |
| My Pets             | Моите любимци          | Header/navigation |
| Groups              | Групи                  | Header/navigation |
| Upcoming events     | Предстоящи събития     | Dashboard         |
| Past events         | Архив                  | Dashboard         |
| Join event          | Ще участвам            | Event details     |
| Leave event         | Откажи участие         | Event details     |
| Select pet          | Избери любимец         | Join modal/form   |
| Helper only         | Ще помогна без любимец | Join form         |
| Add comment         | Добави коментар        | Comments form     |
| Canceled            | Отменено               | Event badge       |
| Full capacity       | Запълнен капацитет     | Capacity badge    |
| Over capacity       | Над капацитета         | Capacity warning  |
| Generate checklist  | Генерирай списък       | AI feature        |

# 14. Project Assessment Checklist

| **Area**              | **Target**                                       | **Evidence to show**                 | **Done** |
|-----------------------|--------------------------------------------------|--------------------------------------|----------|
| GitHub commits        | 15+ meaningful commits                           | Commit history over several days     |          |
| Commit days           | 3+ different days                                | GitHub activity graph / commits page |          |
| Architecture          | Monorepo, Web/backend, mobile app, shared types  | Repo structure and README            |          |
| Backend               | Services, Server Actions, REST API, auth         | Source code and deployed API docs    |          |
| Database              | 4+ related tables, migrations and seed           | Drizzle schema and migration SQL     |          |
| Users and roles       | User, group manager, admin, authorization checks | Demo credentials and protected pages |          |
| Scalability           | Paging and large seeded dataset                  | Paged UI and DB seed script          |          |
| Web app               | 10+ screens and responsive UI                    | Live Web URL                         |          |
| Admin / special panel | Admin or manager dashboard                       | Admin page or group manager tools    |          |
| Mobile app            | 5+ screens, consumes REST API                    | Expo Web URL and optional APK        |          |
| Deployment            | Live Web/backend + live Expo app                 | Production URLs                      |          |
| Documentation         | README, architecture, schema, setup guide        | GitHub README                        |          |
| Bonus: file uploads   | Pet photos / group cover photos                  | Object storage integration           |          |
| Bonus: tests          | Selected backend/Web/mobile tests                | Test scripts / GitHub Actions        |          |
| Bonus: backups        | Automated DB/storage backups                     | GitHub Actions workflow              |          |

> **Recommended MVP scope**
>
> Implement authentication, pets, groups, group membership, events, join/leave, comments, paging, mobile event flow and a basic admin/manager panel first. Add AI checklist and file uploads only after the core app works and is deployed.
