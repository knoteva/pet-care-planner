# Public Demo Deployment

## Recommended Web Demo

Use Vercel for the public review link.

1. Push the latest code to GitHub.
2. Open Vercel and choose **Add New Project**.
3. Import `knoteva/pet-care-planner`.
4. Use the Web app as the Vercel root:

```text
Framework Preset: Next.js
Root Directory: pet-care-web
Install Command: npm install
Build Command: npm run build
Output Directory: .next
```

5. Add environment variables only if Vercel asks for them. For the current static demo, no real secrets are required.
6. Deploy and copy the generated `https://...vercel.app` URL.

## Demo Pages To Share

```text
/
/dashboard
/events/sabotna-razhodka
/events/suggest
/groups
/groups/yuzhen-park
/pets
/pets/raya/edit
/admin
/api/docs
```

## Mobile Demo

The Expo mobile app is included as a visual prototype in the repository. For quick review today, share the Web link. The mobile app can be run locally with:

```bash
npm run dev:mobile
```

Later, the mobile app should consume the Web backend through REST API endpoints.
