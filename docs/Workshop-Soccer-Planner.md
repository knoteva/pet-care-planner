# Soccer Planner: Building a Full-Stack App – Workshop

Practical **workshop** for the course “***Full Stack Apps with AI***” on building a multi-platform full-stack software product with Next.js, React, PostgreSQL and Expo, using Git and AI dev agents.

## Project Assignment

Using **AI-assisted development** implement and deploy a fully functional multi-platform **full-stack software system**:

- **Back-end**: TypeScript + Next.js + Drizzle ORM + PostgreSQL

- **Front-end**: TypeScript + Next.js + React + Tailwind

- **Mobile app**: React Native + Expo

## Project Description: Soccer Planner

Build a "**Soccer Planner**" app: a software product for friends to **plan and organize pickup soccer matches**.

- The app holds **groups**, where **matches** are organized.

- Groups have **managers** and **members** (invited by managers).

- **Matches** are announced in groups and members can **join** / **leave** / **comment**.

### Roles in the App

- **Visitor**: can view **home page** and **register** in the app.

- **User**: can manage own **profile**, **create group**, **join group**.

- **Group member**: can **view group matches**, **join** / **leave** a match, **comment** on match, **share** match link.

- **Group manager**: can **create a match**, **manage matches**.

- **Admins** (optional): can **view** / **manage** all users, groups and matches.

### Visitors

**Visitors** are anonymous actors who visit the app Web site.

- Visitors can **see the app home page** and can **register** (by email + password) in the app.

### Registered Users

**Registered users** in the app have a **profile** with **name**, **email** and **photo** (optional) and can **login** / **logout**.

- Registered users can **create groups** and **join existing groups** (by invitation).

- When user registers a **new group**, he becomes a **group manager** for this group.

- Once an invite link is accepted, a user joins the group and becomes a **group member**.

### Group Managers

**Group managers** manage their groups and organize matches.

- Group managers **organize soccer matches** in their groups:

  - **Create** / **edit** / **cancel** / **delete matches**.

  - **Share match** link (copy a shareable match URL).

  - **Matches** hold: date, time, location, capacity (number of participants, default 12), canceled (yes/no).

- Group managers can **invite** other users to join their groups, by sharing an **invite link**.

- Group managers can **promote** / **remove** other group members as **group managers**.

- Group managers can **remove users** from their groups.

### Group Members and Matches

**Group members** can **browse matches** in their groups: upcoming, current and past matches.

- Always display the **state of each match**: upcoming \| current \| past, note if canceled, full capacity \| under capacity \| over capacity.

- A match is **upcoming**, if its start time is not yet reached. Then, at its start time the match becomes **current** for 1 hour. After that, the match becomes **past**.

- A match can be **canceled** by a group manager, so it will not be played (for some reason).

- A match is **open to join / unjoin** when it is **upcoming** or **current** and is **not canceled**.

- Display the **list of players** for the match (group members currently joined).

Group members can **join** / **unjoin a match**:

- Group members can **join** a match (if not joined yet).

- Group members can **unjoin** (leave) a match after joining (optionally, leaving a comment).

- When joined, a group member can allocate **additional slots** (bring a friend: +1 / +2 / +3).

- **Don't limit group members to join** if a match is full (members will decide how to resolve such situations).

Group members can **post comments** on matches:

- Examples: "*I am coming 10 mins late*", "*Can I bring a friend?*", "*A rain is coming, shall we play?*", …

- **Comments** are listed after on the match screen.

- **Comments** can be **edited** / **deleted** by their owner and group managers.

### Web App and Mobile App

- The **Web app** is the primary app for this project. It implements entire app functionality: users, group management, group members, match management, etc.

- The **mobile app** is additional, scope-limited app, which implements only the most important group member functionality: **login** / **register**, **view matches**, **join** / **unjoin** match, **comment** on match.

## Project Requirements

These are the capstone project requirements, which all students should follow.

### Technologies

- **Backend**: Implement a back-end API with Next.js + PostgreSQL.

- **Database**: Neon serverless PostgreSQL + Drizzle ORM.

- **Frontend**: Implement a front-end Web app in Next.js + React + TypeScript + Tailwind.

- **Mobile app**: Implement a client mobile app with React Native + Expo.

- **Deployment**: serverless deployment at Netlify.

### Architecture

- Use a **client-server architecture**:

  - React frontend with Next.js backend, communicating via Server Actions.

  - React Native (Expo) mobile client with Next.js backend, communicating via RESTful API.

- Structure your app in a **Node.js monorepo**: Next.js Web app + Expo mobile app.

  - The Next.js app will hold your back-end APIs + Web client app.

  - The Expo app will hold your React Native mobile app.

- Structure the app **business logic** in a **service layer**, consumed by the Server Actions and the RESTful API.

- Use **modular design**: split the app into self-contained components (e.g. UI pages, UI components, services, route handlers, utils) to improve project maintenance. When reasonable, use separate files for the UI, business logic, and other app assets. Avoid big and complex monolith code.

- Define an **AGENTS.md** file containing agent instructions, architectural guidelines, technology standards, and project-wide conventions for the AI dev agents.

### User Interface (UI)

- Implement **modern** and **user-friendly UI design**.

- Implement **responsive design** for desktop and mobile browsers.

- Split the **UI** into **components** and sub-components. Avoid complex large components.

- Use **icons**, **effects** and **visual cues** to enhance user experience and make the app more intuitive.

- Use **server-side components in Next.js**, unless a browser interaction is needed.

### Backend

- Use **Neon DB** as a database to keep app data.

- Use **Drizzle ORM** to manage schema migrations and Drizzle APIs to access DB data.

- Implement the app's business logic as **services** (**a service layer**), which access the DB with Drizzle.

- Implement a **RESTful API** for the mobile app and **Server Actions** for the Web app, which use the **services**.

- Implement **server-side paging** to prevent performance degradation or UI freezing for large datasets.

- Use external **object storage** service (is needed) to upload **photos** and **files**, e.g. **Cloudflare R2**.

### Authentication and Authorization

- Use **bcrypt**, **argon2** or other secure **password hashing algorithm** to store passwords in the DB.

- Use **JWT tokens** to implement user sessions. Use **cookies** for the Web app and **"Bearer" auth header** in the RESTful API. Use a random **JWT_SECRET** key to sign JWT tokens.

### Database

- Use best practices to **design the PostgreSQL DB schema** (normalization, relationships, indexing).

- When changing the DB schema, always use **Drizzle Kit migrations**.

- **Seed** enough sample data in all major tables, to ensure performance.

### Deployment

- Your Web project should be **deployed live** on the Internet.

- **Serverless deployment** on a managed platform (like Netlify) with serverless database (like Neon).

- Provide **sample credentials** (e.g. demo / demo123) to simplify testing your app.

- First **deploy the Next.js project** and get its exposed **RESTful API endpoints URL**.

- Next, deploy the **Expo project** (as Web export).

- Optionally, build **Android APK** binary and publish it in your **GitHub Repo** 🡪 **Releases**.

### GitHub Repo

- Use a **GitHub repo** to hold your project assets.

- **Commit and push** each successful change during the development.

### Documentation

- Generate a **project documentation** in your GitHub repository.

- **Project description**: describe briefly your project (what it does, who can do what, etc.).

- **Architecture**: front-end, back-end, **technologies** used, **database**, etc.

- **Database schema** design: visualize the main DB tables and their relationships.

- Local **development setup** guide.

- Key **folders** and **files** and their purpose.

## Steps to Build the Project

Follow these **sample steps** (or similar) to build the app incrementally.

### Create a VS Code Project

Create a new **project workspace** in **VS Code**, e.g. `soccer-planner`.

### Define the Repo Structure

We shall use a **monorepo**, holding the following project assets:

- **package.json** → dependencies and scripts for the entire repo

- **soccer-web/** → Next.js Web app (back-end + front-end)

  - **soccer-web/src/app/** → front-end client app

  - **soccer-web/src/app/api/** → backend API endpoints

  - **soccer-web/src/services/** → app business logic

  - **soccer-web/src/db/** → DB schema and scripts

  - **soccer-web/src/drizzle/** → Drizzle ORM migrations

  - **soccer-web/tests/** → Web app automated tests (optional)

  - **package.json** → dependencies and scripts for the Next.js Web app

- **soccer-mobile/** → Expo mobile app

  - **soccer-mobile/src/** → Expo mobile app code

  - **soccer-mobile/tests/** → mobile app automated tests (optional)

  - **package.json** → dependencies and scripts for the Expo mobile app

- **soccer-shared/** → shared TypeScript types (User, Match, Comment, ...)

Steps to follow:

1.  Initialize the **monorepo**: `npm init`.

2.  Initialize a **new Next.js app** in the `soccer-web/` folder:
    ```bash
    npx create-next-app@latest soccer-web
    ```

3.  Initialize a **new Expo app** in the `soccer-mobile/` folder:
    ```bash
    npx create-expo-app@latest soccer-mobile
    ```

4.  Create a folder `soccer-shared` to hold shared assets:
    ```bash
    mkdir soccer-shared
    ```

5.  Create `npm run build` and `npm run dev` scripts in the root project to build / run both projects (configure npm **workspaces**).

This is the repo structure in VS Code:

<img src="/mnt/data/markdown-ai-friendly/media/Workshop-Soccer-Planner/media/image1.png" style="width:2.13705in;height:2.27388in" />

### Create `src` Folders

We want to keep the project **code more structured**. Thus, we want to have `src/` folder to keep the source code for each project, separated from config / tooling files and generated artifacts.

- For projects `soccer-web`, `soccer-mobile` and `soccer-shared` move the source code to `src/` folder. Reconfigure project assets to match the new source code folder.

Using a separate `src/` folder is good practice for large projects with many files and folders.

### Setup GitHub Repo

Now we want to **commit** and **push** the project into a **GitHub repo**.

- We have a problem: sub-projects `soccer-web` and `soccer-mobile` already have their **own Git repos**. We need to **discard these repos** and create a new one in the root folder.

- We should **initialize a new Git monorepo** in the project root folder, holding all sub-projects and **remove the old, nested repos**.

- We should configure properly `.gitignore`.

**Restart VS Code** after creating the new monorepo, so that the **\[Source Control\]** toolbar reloads repo data correctly.

Once the new monorepo is configured, publish your project to **GitHub**.

### Setup AGENTS.md Instructions

Write a simple `AGENTS.md` **instructions file** to provide app context and general guidelines to the AI dev agent, based on the project requirements and technology stack:

- Brief project description

- Architecture and technology stack

- UI guidelines

- Pages and navigation guidelines

- Backend and database guidelines

- Authentication and authorization guidelines

Define 3 different `AGENTS.md` files:

- **AGENTS.md** – agent instructions for the entire project (web + mobile)

  - One line project description

  - Back-end, front-end, mobile apps

  - Folder structure

- **soccer-web/AGENTS.md** – agent instructions for the Next.js Web app

  - A soccer planner app: manage groups and matches (users create groups, group managers create matches in the groups, group members view matches and join matches)

  - Technologies: Next.js + Neon DB + Drizzle ORM + React + Tailwind

  - Architectural Guidelines: service layer, modular design, auth, database

  - User Interface Guidelines: modern UI, responsive design, server-rendered components

- **soccer-mobile/AGENTS.md** – agent instructions for the Expo mobile app

  - A soccer planner app: view groups and matches (users login, view matches, join / unjoin matches)

  - Technologies: Expo, React Native, Expo Router

  - Back-end: Soccer Planner RESTful API, with "Bearer token" auth

  - Architectural Guidelines: modular design, RESTful API backend

  - Mobile UI Guidelines: user-friendly UI, stack navigation, responsive layout

  - Mobile UI Alerts: ensure all native alerts, confirms and other system dialogs have a fallback for Web (implemented as modal popups)

Define `README.md` in the project root and put inside the project description.

- We may reference this file when implementing certain features in the apps.

## Steps to Build the Next.js Project

Start from the Next.js app and its basic functionalities.

### Open the Next.js Project

First, **open the Next.js project** `soccer-web` in **VS Code**. This will hide all other projects and will avoid confusion.

### Create Neon DB

Create a new **project in Neon DB**, e.g. `SoccerDB`.

Configure the Neon DB connection settings in `.env`:

```env
DATABASE_URL=<your_db_url_from_neon.com>
```

### Design the Database

Design the initial **database schema** for the app. This is a non-technical brief of what we want to hold in the DB:

- **Users** (email, password hash, name, photoUrl) – app users

- **Groups** (title, description, set of members, set of matches) – groups have info, group members and matches

  - **Groups Members** (group, user, is manager) – groups have **group members** and **group managers**

  - **Matches** (date, time, location, capacity (number of players), canceled (yes/no)) – matches are events for which players can join; matches belong to groups

- **Match Joins** (match, user, extra slots, join date) – group members can join group matches and reserve 1 or several slots (for friends)

- **Match Comments** for each match (date, user, text)

Use simple **numbers** as **IDs** for table rows, not long identifiers.

**Install libraries** from npm: **Drizzle ORM**, **Drizzle Kits**, **Neon DB** drivers, **dotenv**.

Create a **Drizzle schema** file to implement the DB schema in a technical way.

Generate a **migration** from the **Drizzle schema** using **Drizzle Kit**: `npm db:generate`.

Run the **Drizzle migration** to the DB using **Drizzle Kit**: `npm db:migrate`.

**Commit and push** to GitHub after the above functionality is implemented and works correctly.

### Seed Sample Data

Create a **script** `npm run db:seed` to seed sample data to DB.

Create sample **users**:

- steve@gmail.com / pass123

- peter@gmail.com / pass123

- dave@gmail.com / pass123

- john@gmail.com / pass123

- nick@gmail.com / pass123

- user1, user2, …, user9 / pass123

Create sample **groups**:

- **Sofia Derby** { members steve, dave, nick, user1, …, user9; managers: steve }

- **Sunday Heroes** { members steve, peter, john, user1, …, user9; managers: steve, peter }

Create sample **matches**:

- Date: today + 3 days, group: Sofia Derby, location: The School, capacity: 12 (upcoming match)

- Date: today + 5 days, group: Sofia Derby, location: Students Town, capacity: 12 (upcoming match)

- Date: today + 6 days, group: Sunday Heroes, location: Arena 111, capacity: 10 (upcoming match)

- Date: today - 20 days, group Sofia Derby, location: Students Town, capacity: 12 (past match)

- Date: today - 30 days, group: Sunday Heroes, location: Arena 111, capacity: 12 (past match)

Insert a few **match joins** in each of the matches (choose half of the group members).

Insert a few **comments** for each match by group members (generate meaningful comment messages).

**Run** the DB seed script.

**Commit and push** to GitHub after the above functionality is implemented and works correctly.

### Public Pages and Layout

Create the **public pages** of the app:

- **Home Page**: welcome note + login and register buttons.

- **Login Page**: login form (client component). Put the page in a route group **(auth)**.

- **Register Page**: login form (client component). Put the page in a route group **(auth)**.

- Define the **app layout**: header, main, footer.

- Insert **links** to the other pages in the header. Implement **responsive layout** for the header, to support smartphones and tablets.

**Commit and push** to GitHub after the above functionality is implemented and works correctly.

### Login / Logout

- **Implement users** (register, login, logout) using the best practices in Next.js

  - Use standard auth practices with **cookies** and **JWT**

  - Generate a random **JWT_SECRET** in `.env`

  - Keep user **passwords** hashed with `bcrypt`

  - Search in Internet if unsure how to implement auth forms, pages and logic

- **Implement pages** (server-rendered): **(auth)/login**, **(auth)/register**

  - Implement the interactive **auth forms** as **client components**

  - Implement **server-side** auth logic as **Server Actions**

- Show the **currently logged-in user** in the site **header**

  - When **no user is logged in**, show \[Login\] \| \[Register\] where relevant.

  - When a registered user is **logged in**, show user info + \[Logout\] where relevant.

- Protect **all routes except home + auth pages** to require logged-in users

**Commit and push** to GitHub after the above functionality is implemented and works correctly.

### User Dashboard

**Group members** can **browse matches** in their groups: **upcoming**, **current** and **past** matches.

- Always display the **state of each match**:

  - upcoming \| current \| past

  - note if canceled

  - full capacity \| under capacity \| over capacity

- A match is **upcoming**, if its start time is not yet reached. Then, at its start time the match becomes **current** for 1 hour. After that, the match becomes **past**.

- A match can be **canceled** by a group manager, so it will not be played (for some reason).

- A match is **active** (open to join / unjoin) when it is **upcoming** or **current** and is **not canceled**.

- Display the **list of players** for the match (group members currently joined).

Create a page **User Dashboard**: **/dashboard**

- Section "**Active Matches**" (the main section)

  - Display all **active matches** (upcoming or current, not canceled)

  - Display matches as **cards** (date, location, group, state, no players, no comments)

  - **Ordered** matches by date (most recent first)

  - Clicking on a match card opens the "**Match**" page: **/matches/\[id\]**

- Section "**Archive Matches**" (the secondary, less important section)

  - Display all **past** and **canceled** matches (upcoming or current, not canceled), ordered by date

Link the User Dashboard page:

- Display **\[Dashboard\] link** in the header **navigation** for logged-in users.

- After user login, go to the **User Dashboard**, instead of the **Home page**.

**Commit and push** to GitHub after the above functionality is implemented and works correctly.

### View / Join Match

Create a page **Match**: **/matches/\[id\]**

- This page is available only for **group members** of the match group.

  - If the user is not a member of the group which owns the match, display an error.

- Display the **full match info**: date, location, state, capacity, players joined, comments, etc.

- Implement \[**Join**\] / \[**Leave**\] buttons (when joined).

- When joined, user can enter **reserve / edit additional slots** for friends (+1, -1, …).

- Update the **match state** and **players joined** after joining / leaving / reserving a slot.

- Implement "**Share match link**" (copy a shareable match URL).

**Commit and push** to GitHub after the above functionality is implemented and works correctly.

## Minimalistic RESTful API

Build a minimalistic **RESTful API** in the Next.js project for mobile app clients. Start from the **very basic functionality**: **login**, **list matches**, **join** / **leave match**. More functionalities will be added later.

- **POST /api/auth/login** – login by email + password 🡪 return JWT token

- **GET /api/matches** – list active matches (open for joining), with JWT auth, with paging

- **GET /api/matches/\[id\]** – list match details (date, location, state, capacity, is joined, players joined, comments)

- **POST /api/matches/\[id\]/join** – join a match (if not joined)

- **POST /api/matches/\[id\]/leave** – leave a match (if joined)

- **POST /api/matches/\[id\]/slots** – reserve additional slots (0, 1, or more)

- **GET /api/docs** – display the API documentation as HTML (needed for the Expo app)

**Commit and push** to GitHub after the above functionality is implemented and works correctly.

## Steps to Build the Expo Project

Now, let's build the expo app with minimalistic functionality: **login**, **list matches**, **join** / **leave match**.

### Add PI Docs to AGENTS.md

Add API docs URL to AGENTS.md.

```md
# API Docs
- Back-end API documentation: http://localhost:3000/api/docs
- Back-end API source code: `..\soccer-web\src\app\api`
```

### Home Page

In the mobile app, build the app **layout**, **navigation** and **home page**:

- **Empty the project**: remove all pages, styles, themes, color schemes, components, hooks and other assets, which come from the Expo startup project template. Start from an **empty project**, without any pages, styles and layouts. Just an **empty Expo project**.

- Create empty screens: **Home** \| **Login** \| **Matches** \| **Match Details**

- Implement **stack navigation** between the screens.

- Implement the **Home page**: welcome message + login link.

**Commit and push** to GitHub after the above functionality is implemented and works correctly.

### Login / Logout

In the mobile app, configure the **RESTful API URL** in the `.env` config file:

```env
# .env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

Build a **login** / **logout** functionality, using the API endpoints:

- Implement correctly a **login form** (with **error handling**).

- Implement a **\[Logout\] button** on the home page.

- Make **all app screens** (except Home and Login) to require **logged-in user**.

Note: in case of "***CORS policy error***", fix the API in the backend project first.

**Commit and push** to GitHub after the above functionality is implemented and works correctly.

### Matches Dashboard

In the mobile app, implement the **Matches Dashboard** screen:

- List active matches (with paging)

- Display matches with clickable cards.

**Commit and push** to GitHub after the above functionality is implemented and works correctly.

### Matches Details

In the mobile app, implement the **Match Details** screen:

- Display the **full match info**: date, location, state, capacity, players joined, comments, etc.

- Implement \[**Join**\] / \[**Leave**\] buttons (when joined).

- When joined, user can enter **reserve / edit additional slots** for friends (+1, -1, …).

- Update the **match state** after joining / leaving / reserving a slot.

**Commit and push** to GitHub after the above functionality is implemented and works correctly.

## Deploy the Next.js App to Netlify

**Deploy** the **Next.js app** from GitHub to **Netlify**.

Make sure to configure **environment variables** correctly.

## Deploy the Expo App to Netlify

**Deploy** the **Expo app** from GitHub to **Netlify**.

Make sure to configure **environment variables** correctly.

## Advanced Web App Functionality

This is **advanced functionality** for the Next.js Web app, to be built as next steps, at some moment later.

### Dashboard Paging

Implement **server-side paging** for matches in the User Dashboard page, to prevent UI freezing when a matches are too much.

### Match Comments

Implement **add** / **edit** / **delete** match **comments** in the Matches page.

**Commit and push** to GitHub after the above functionality is implemented and works correctly.

### View Groups

Implement **view groups** (for logged-in users):

- **/groups/** – list user's groups

- **/groups/\[id\]** – view group details (group info, group managers, group members, group matches)

  - Only available for members of the target group

Implementation notes:

- Users can see a group only **when a member** of this group.

- Display **\[Groups\] link** in the header **navigation** for logged-in users.

**Commit and push** to GitHub after the above functionality is implemented and works correctly.

### Manage Groups

Implement **list** / **create** / **edit** groups (for logged-in users):

- **/groups/** – list user's groups

  - Insert **\[New\]** button and **\[Edit\]** / **\[Delete\]** buttons for group managers

- **/groups/\[id\]** – view group details (group info, group managers, group members, group matches)

  - Only available for members of the target group

  - Insert **\[Edit\]** / **\[Delete\]** buttons for group managers

- **/groups/new** – create a new group

- **/groups/\[id\]/edit** – edit existing group (for group managers)

- **/groups/\[id\]/delete** – delete existing group (with confirm / cancel, for group managers)

Implementation notes:

- Users can **see** a group only **when a member** of this group.

- Users can **edit** / **delete** a group only **when a manager** of this group.

- Use **server-rendered pages** + **server actions** + **client forms** (when needed).

**Commit and push** to GitHub after the above functionality is implemented and works correctly.

### Create / Edit Match

Implement **create** / **edit** / **cancel match** (for group managers):

- **/groups/** – list user's groups

- **/groups/\[id\]** – **view group details**, and list matches in a group (for group members)

  - Display **\[Create\]** / **\[Edit\]** / **\[Delete\]** links for the matches in the group (for group managers)

- **/groups/\[id\]/matches/new** – **create** a new match (for group managers)

- **/groups/\[id\]/matches/\[id\]/edit** – **edit** existing match (for group managers), can also **cancel** the match

- **/groups/\[id\]/matches/\[id\]/delete** – **delete** existing match (with confirm / cancel, for group managers)

Implementation notes:

- Users can **see** a match only **when a member** of the group where the match belongs.

- Users can **edit** / **delete** / **cancel** a match only **when a manager** of the group where the match belongs.

- Use **server-rendered pages** + **server actions** + **client forms** (when needed).

**Commit and push** to GitHub after the above functionality is implemented and works correctly.

### Invite to Group

Group managers can **invite users** to join their groups by sharing an **invite link**.

- Implement **\[Create Invite Link\]** in the group details page (for group managers only).

  - **Invite links** look like this: **/groups/\[id\]/join?code=…**

  - Group invitations are valid only for a **certain group** and hold a random-generated **invite code**.

  - Invitations codes are **valid for one person only**, regardless of who uses the code.

- Modify the database schema to **add a new DB table**:

  - **Group Invitations** (group id, invite code, used date, user id).

  - When an invitation is **valid**, the **date** and **user id** fields are **empty**.

  - When an invitation is **used**, the **date** and **user id** are filled with the joined user and date.

- **Accept Invite** page: **/groups/\[id\]/join?code=…**

  - When user is **logged into the app** and opens an **invite link**, if the link is **valid**, the user **joins** the group: a welcome message is shown and a link to the new group is shown.

  - If the **link is invalid** or **joining is not successful**, display an **error message** (e.g. "invalid link", or "this link is already used by another user", or "you are already a member of this group").

  - If the user is **not logged in**, redirect to the **login page**, and after login, **redirect back** to the "Accept Invite" page.

- Implement "**redirect after user login**" in the Login page:

  - The login page may have a **URL parameter** named `redirect`, like this: **/login?redirect=%2Fgroups%2F\[id\]%2Fjoin%3Fcode%3D...**

**Commit and push** to GitHub after the above functionality is implemented and works correctly.

### Leave a Group

Implement "**Leave a Group**" feature in the **group details page** for logged-in users.

**Commit and push** to GitHub after the above functionality is implemented and works correctly.

### Manage Group Members

Implement "**Manage Group Members**" page:

- **View** / **remove** members, **promote** / **demote** as group managers.

**Commit and push** to GitHub after the above functionality is implemented and works correctly.

## Advanced Mobile App Functionality

Additional functionality, for further work on the mobile app.

### Comments on Matches

- Extend the **RESTful API** to support **view** / **add** / edit **comments**.

- Implement **comments** for matches in the mobile app.

### Registration

- Extend the **RESTful API** to support **view** / **add** / edit **comments**.

- Add **user registration** to the **mobile app**.

## Performance Test

Implement a **performance test** with large datasets:

- Seed the database with 500 groups.

- Seed the database with 5,000 matches in the first 3 groups.

- Seed the database with 3,000 users.

- Test the app UI to see where the UI hangs or works slowly.

- Implement paging, DB indexes and other optimizations.
