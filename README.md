# Ledyim Farm Livestock Tracker

A small full-stack livestock record tool for cattle and goats, built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Features

- Dashboard with cattle/goat counts, upcoming treatment reminders, and recently added animals
- Animal listing with photo cards, species/sex/status filters, and name/tag search
- Add and edit animal details with photo uploads
- Unique ear tag validation backed by the database
- Treatment records with add, edit, delete, and next due dates
- Pedigree view showing parents, grandparents, and great-grandparents where data exists
- Offspring list for animals linked as sire or dam
- Birth records data model and API for multi-offspring events

## Requirements

- Node.js 20+
- PostgreSQL database. The app can use Neon or the local Docker database below.
- Docker Desktop or another Docker runtime, only if you want local PostgreSQL.

## Setup With Neon

1. Configure environment variables in `.env`:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=require&channel_binding=require"
BLOB_READ_WRITE_TOKEN=""
```

The current local `.env` is configured to use your Neon database. `BLOB_READ_WRITE_TOKEN` is optional locally; without it, uploads are stored under `public/uploads`.

2. Install dependencies:

```bash
npm install
```

3. Apply the Prisma migration:

```bash
npx prisma migrate deploy
```

4. Seed sample livestock and treatments:

```bash
npm run prisma:seed
```

5. Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Deploy To Vercel

1. Import `https://github.com/danmuendo/ledyim-farm.git` in the Vercel dashboard.
2. Keep the framework preset as Next.js.
3. Add these Environment Variables for Production and Preview:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST/neondb?sslmode=require&channel_binding=require"
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

4. Create or connect a Vercel Blob store for persistent animal photos.
5. Deploy. Future pushes to `main` will create production deployments.

The database migration has already been applied to your Neon database, and the seed script has already been run once. Do not run the seed script on production again unless you want it to reset the animal, treatment, and birth-record tables.

## Optional Local PostgreSQL

Start the local database:

```bash
docker compose up -d
```

Then set `.env` to match `.env.example` and run:

```bash
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

## Common Commands

```bash
npm run build
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

For a hosted database, prefer `npx prisma migrate deploy` when applying checked-in migrations.

## Image Uploads

In local development without `BLOB_READ_WRITE_TOKEN`, uploaded animal photos are stored under `public/uploads`. On Vercel, set `BLOB_READ_WRITE_TOKEN` so uploaded files are stored in Vercel Blob and remain available after deployments.

## Notes

The seed script resets the livestock, treatment, and birth-record tables before inserting sample data. Use it only for local development data you are comfortable replacing.
