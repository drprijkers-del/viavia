# Vercel Postgres Setup

## Stap 1: Database aanmaken in Vercel Dashboard

1. Ga naar: https://vercel.com/dennis-rijkers-projects/viavia76
2. Klik op **"Storage"** tab
3. Klik op **"Create Database"**
4. Selecteer **"Postgres"**
5. Naam: `viavia-db`
6. Region: **Europe (Frankfurt - fra1)** (dichtst bij Nederland)
7. Klik **"Create"**

## Stap 2: Connect database to project

Na het aanmaken:
1. Klik op je nieuwe database `viavia-db`
2. Ga naar **"Settings"**
3. Scroll naar **"Connect Project"**
4. Selecteer je project: `viavia76`
5. Klik **"Connect"**

Dit voegt automatisch de environment variables toe:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL` (dit gaan we gebruiken)
- `POSTGRES_URL_NON_POOLING`
- etc.

## Stap 3: Wacht even...

Ik ga nu:
1. Het Prisma schema updaten van SQLite naar PostgreSQL
2. Nieuwe migrations aanmaken
3. De code deployen

Je hoeft alleen stap 1 en 2 hierboven te doen! 🚀
