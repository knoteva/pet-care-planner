# Pet Care Planner Mobile App

Pet Care Planner mobile app: users log in, view pets, view groups, join events, leave events, comment and request new events. Admin and advanced manager workflows stay in the Web app unless explicitly requested.

## Tech Guidelines

- Technologies: React Native + Expo + Expo Router.
- Back-end: Pet Care Planner REST API, with Bearer token auth.
- Back-end API source code: `..\pet-care-web\src\app\api`.
- API client and auth storage helpers belong in `src/services`.
- Modular design: split screens and repeated UI into meaningful components.

## Mobile User Interface Guidelines

- User-facing text, validation messages and demo data must be in Bulgarian.
- Code identifiers, route names and service names must stay in English.
- Implement user-friendly UI, tab/stack navigation and responsive layout for smartphones and tablets.
- Mobile UI alerts should have a web fallback when running through Expo Web.
