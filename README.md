# ViaVia - Freelance Opdrachten voor WhatsApp Groepen

Een ultra-lightweight, mobiele-first web-app voor het delen van freelance opdrachten in WhatsApp groepen.

## Hoe werkt het?

**Voor groep-beheerders (account vereist):**
1. Maak een account aan via magic link
2. Maak een groep aan
3. Deel de groepslink in je WhatsApp-groep

**Voor groepsleden (geen account nodig):**
1. Open de gedeelde link
2. Bekijk alle opdrachten
3. Plaats zelf opdrachten
4. Reageer direct via WhatsApp

## Features

- **Publieke groepen** - Iedereen met de link kan opdrachten bekijken en plaatsen
- **Geen account nodig** - Alleen groep-beheerders hebben een account nodig
- **WhatsApp integratie** - Direct contact via WhatsApp deep links
- **PWA** - Installeer als app op je homescreen
- **Mobiel-first** - Geoptimaliseerd voor smartphones

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js met magic link (Resend)
- **Styling**: TailwindCSS 4
- **Deployment**: Vercel

## Environment Variables

Maak een `.env.local` bestand met:

```bash
# Database (Vercel Postgres of andere PostgreSQL)
POSTGRES_URL="postgresql://user:password@host:5432/dbname"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"

# Email Provider (Resend)
AUTH_RESEND_KEY="re_..."
EMAIL_FROM="noreply@yourdomain.com"
```

### Resend Setup

1. Maak een account op [resend.com](https://resend.com)
2. Verifieer je domein of gebruik `onboarding@resend.dev` voor testen
3. Genereer een API key
4. Voeg `AUTH_RESEND_KEY` toe aan je environment

### NEXTAUTH_SECRET genereren

```bash
openssl rand -base64 32
```

## Quick Start

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Start development server
npm run dev
```

## Deployment (Vercel)

1. Push naar GitHub
2. Import in Vercel dashboard
3. Voeg environment variables toe:
   - `POSTGRES_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `AUTH_RESEND_KEY`
   - `EMAIL_FROM`
4. Deploy!

## PWA Installatie

### iPhone/iPad (Safari)
1. Tik op Deel (⬆️)
2. Scroll naar "Zet op beginscherm"
3. Tik op "Voeg toe"

### Android (Chrome)
1. Wacht op de install prompt, of:
2. Menu (⋮) → "App installeren"

## Project Structuur

```
app/
├── actions/          # Server actions
├── components/       # Shared components
├── dashboard/        # Authenticated pages
├── g/[slug]/         # Public group pages
├── login/            # Auth pages
├── download/         # PWA install page
└── page.tsx          # Landing page
```

## License

MIT

---

Built with ❤️ for WhatsApp freelance communities.
