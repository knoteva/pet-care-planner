# Deployment Guide

The Web app is deployed to Vercel. The repository is a monorepo, so Vercel must point to the Web workspace.

## Vercel Settings

Use these settings for the Web project:

```text
Framework Preset: Next.js
Root Directory: pet-care-web
Install Command: npm install
Build Command: npm run build
Output Directory: .next
```

## Required Environment Variables

Add these variables in Vercel Project Settings -> Environment Variables -> Production:

```text
DATABASE_URL=postgresql://...
JWT_SECRET=long_random_secret
NEXT_PUBLIC_APP_URL=https://pet-care-web-rose.vercel.app
EXPO_PUBLIC_API_BASE_URL=https://pet-care-web-rose.vercel.app
```

`DATABASE_URL` should point to the Neon pooled connection string with SSL enabled.

Do not commit `.env.local` or real secrets to GitHub.

## Deploy From VS Code Terminal

From the repository root:

```bash
npm run typecheck
npm run smoke:web
npm run build:web

git status
git add <changed-files>
git commit -m "docs: polish submission documentation"
git push
```

Then deploy the Web app:

```bash
cd pet-care-web
npx.cmd --yes vercel --prod --yes
cd ..
```

Stable production URL used during development:

```text
https://pet-care-web-rose.vercel.app
```

## Demo Routes To Share

```text
/
/login
/register
/dashboard
/admin
/pets
/pets/new
/groups
/groups/new
/groups/join
/events/new
/events/suggest
/api/docs
```

Dynamic detail pages are created from database IDs, for example:

```text
/events/1
/groups/1
/pets/1/edit
```

## Mobile Demo

Run the Expo app locally:

```bash
npm run dev:mobile
```

For mobile API calls against production, configure:

```text
EXPO_PUBLIC_API_BASE_URL=https://pet-care-web-rose.vercel.app
```

The mobile app uses the deployed Web/backend REST API with Bearer tokens.

## Troubleshooting

If Vercel fails with missing database configuration:

1. Check that `DATABASE_URL` exists in Vercel Production environment variables.
2. Check that `JWT_SECRET` exists in Vercel Production environment variables.
3. Redeploy from `pet-care-web`.

If Vercel fails during dependency install, confirm that the project uses `pet-care-web` as Root Directory and that `Install Command` is exactly `npm install`.

Useful pre-deploy checks:

```bash
npm run typecheck
npm run smoke:web
npm run build:web
```
