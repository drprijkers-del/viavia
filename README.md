# ViaVia - Freelance Opdrachtenboard voor WhatsApp Groepen

Een ultra-lightweight, mobiele-first web-app voor het plaatsen en vinden van freelance opdrachten in WhatsApp groepen. **Geen inloggen. Geen gedoe. Direct contact.**

## 🎯 Features

✅ **Opdrachten plaatsen** - Minimale invoer, maximale duidelijkheid  
✅ **Live board** - Filters op status, locatie, search op titel/skills  
✅ **Reacties** - Zie wie geïnteresseerd is + aantal reacties  
✅ **Directe contact** - Contacteer plaatser via WhatsApp  
✅ **Status beheer** - Markeer opdrachten als ingevuld (via token)  
✅ **Delen** - Share naar WhatsApp of copy link  
✅ **Responsief** - Perfect op mobiel (375px+)  

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: SQLite + Prisma ORM
- **Styling**: TailwindCSS 4
- **Language**: TypeScript
- **Deployment**: Vercel

## 🚀 Quick Start

### 1. Install
```bash
npm install
```

### 2. Database
```bash
export DATABASE_URL="file:./prisma/dev.db"
npx prisma migrate dev --name init
```

### 3. Run
```bash
npm run dev
# Open http://localhost:3000
```

## 📋 Features Implemented

- ✅ Create opdracht (form with validation)
- ✅ List board with filters (status, locatie)
- ✅ Search by title/tags
- ✅ Detail page with all opdracht info
- ✅ Reactions with counter
- ✅ Contact plaatser via WhatsApp (wa.me deep link)
- ✅ Share opdracht to WhatsApp (native share + fallback copy)
- ✅ Mark as filled (token-protected, only for plaatser)
- ✅ Responsive mobile-first design
- ✅ All UI in Dutch (Nederlands)

## 📦 Environment

Create `.env.local`:
```env
DATABASE_URL="file:./prisma/dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## 🔧 Useful Commands

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Run production
npm run lint             # ESLint

npx prisma studio       # Visual DB editor
npx prisma migrate dev  # Create migration
```

## 🌐 Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel dashboard
3. Add env var: `DATABASE_URL = file:./.vercel/data.db`
4. Deploy!

## 📂 Project Structure

```
your-matrix/
├── app/
│   ├── actions/
│   │   ├── opdracht.ts      # Create/update
│   │   └── queries.ts        # Read queries
│   ├── components/
│   │   ├── OpdrachtenList.tsx
│   │   ├── ReactieForm.tsx
│   │   ├── ReactieList.tsx
│   │   ├── ShareButton.tsx
│   │   └── MarkAsFilledButton.tsx
│   ├── opdracht/
│   │   ├── [id]/page.tsx    # Detail
│   │   └── nieuw/page.tsx   # Create
│   ├── layout.tsx
│   ├── page.tsx             # Home/board
│   └── globals.css
├── lib/
│   ├── db.ts               # Prisma client
│   └── utils.ts            # Helpers
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── .env.local
└── package.json
```

## 🔐 How It Works

**No authentication** - Anyone with the link can post & react.

**Edit Token** - Each opdracht gets a random 32-char hex token on creation. It's passed in the URL:
```
/opdracht/abc123?token=xyz789def456...
```
Only with the token can you mark the opdracht as "INGEVULD" (filled).

**Phone Numbers** - Stored as +31612345678 format. Auto-normalized from 0612345678 (assumes NL).

## 📱 Mobile First

- Responsive from 375px (iPhone SE) to desktop
- Touch-friendly button sizing (44px+)
- Native share API (fallback: copy-to-clipboard)
- WhatsApp deep links (wa.me)

## 📝 Data Model

### Opdracht
- titel, omschrijving, locatie (Remote/OnSite/Hybride)
- plaats, hybride_dagen_per_week (if Hybride)
- uurtarief_min/max (in cents), valuta
- startdatum, duur, inzet
- tags (JSON array, max 5)
- plaatser_naam, plaatser_whatsapp
- status (OPEN | INGEVULD), edit_token
- created_at, updated_at

### Reactie
- opdracht_id (FK)
- naam, bericht, whatsapp_nummer
- created_at

## 🚀 Ready to Use!

The MVP is fully functional. You can:
1. Post opdrachten with all relevant details
2. Search & filter on the board
3. See reactions + contact details
4. Share opdrachten to WhatsApp
5. Mark as filled (with token)

Enjoy! 🎉

---

Built with ❤️ for WhatsApp freelance communities.
