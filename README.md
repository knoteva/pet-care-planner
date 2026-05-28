# Pet Care Planner

Build a "Pet Care Planner" app: a software product for neighbors, friends and pet owners to organize shared pet care, walks, visits and event participation.

- The app holds pet care groups, where events are organized.
- Groups have managers and members.
- Pets belong to users and can be connected to group activities.
- Care events are announced in groups and members can create, join, leave and comment on events.
- The Web app includes the full management experience; the mobile app focuses on daily participation.

## Roles in the App

- **Visitor**: can view the public home page and register in the app.
- **User**: can manage own profile, pets and group memberships.
- **Group member**: can view group events, create events, join or leave events, comment and share event links.
- **Group manager**: can create groups, invite members, create/edit/cancel group events and moderate reported comments.
- **Admin**: can manage users, groups, events and reports in the Web app.

## Visitors

Visitors are anonymous actors who open the Web site before logging in.

- Visitors can see the app home page.
- Visitors can register with name, email and password.
- Visitors can use the demo login during project review.

## Registered Users

Registered users are pet owners or helpers who participate in pet care coordination.

- Users can create and edit their own pets.
- Users can join groups by invite link or invite code.
- Users can see upcoming events in their groups.
- Users can join or leave events and add comments.
- Users can create events in groups where they are members.

## Groups

Groups are shared spaces for organizing care around pets and neighborhoods.

- A group has a name, location, members and managers.
- Group members can see group events and participants.
- Group managers can invite members and manage group events.
- Invite links and codes are planned for controlled group access.

## Care Events

Care events represent planned activities such as walks, feeding, visits, play time or help requests.

- Events have title, type, date, location, capacity and status.
- Members can join or leave an event.
- Members can comment, for example: "Ще закъснея 10 мин.", "Ще донеса вода.", "Може ли да дойда като помощник?".
- Event comments are visible on the event details screen.

## Web App and Mobile App

- The Web app is the primary app for this project. It implements the full functionality: registration, login, dashboard, pets, groups, group details, events and admin views.
- The mobile app is a scope-limited companion app. It implements the most important daily-use functionality: login/register, dashboard, pets, groups and participation views.

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

Database setup after `DATABASE_URL` is configured:

```bash
npm run db:migrate
npm run db:seed
```

Useful database checks:

```bash
npm run db:ping
npm run db:check
```

## Environment Variables

Copy `.env.example` to `.env` locally and fill in real values before adding database or authentication features.

Required variables for the planned MVP:

- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `EXPO_PUBLIC_API_BASE_URL`

## Auth API Checks

After `DATABASE_URL` and `JWT_SECRET` are set in `pet-care-web/.env.local`, start the Web app:

```bash
npm run dev:web
```

Then test the auth endpoints from another terminal:

```bash
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"kate_manager@paws.bg\",\"password\":\"kate123\"}"
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d "{\"name\":\"Test User\",\"email\":\"test_user@example.com\",\"password\":\"test1234\"}"
```

The login/register response returns a `token` for mobile Bearer auth and also sets a `pet-care-session` httpOnly cookie for Web auth.

## Demo Credentials

```text
demo@paws.bg / demo123
admin@paws.bg / admin123
kate_admin@paws.bg / kate123
kate_manager@paws.bg / kate123
kate_user@paws.bg / kate123
```

Role notes:

- `kate_admin@paws.bg` has global `admin` role.
- `kate_manager@paws.bg` has normal `user` role, but is a `manager` in the South Park group.
- `kate_user@paws.bg` has normal `user` role and is a regular group member.

## Public Demo

The Web app can be deployed to Vercel for project review. See [DEPLOYMENT.md](./DEPLOYMENT.md) for the recommended settings and demo routes.
