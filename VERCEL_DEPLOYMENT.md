# 🚀 Vercel Deployment Guide - ViaVia

Dit document gaat je stap-voor-stap door de deployment naar Vercel.

## Optie 1: Vercel CLI (Snelste)

### 1. Installeer Vercel CLI
```bash
npm install -g vercel
```

### 2. Login in Vercel
```bash
vercel login
# Je wordt naar browser geleid, log in met je Vercel account
```

### 3. Deploy
```bash
cd /Users/dennisrijkers/your-matrix
vercel
```

Volg de prompts:
- "Set up and deploy?" → **y**
- "Which scope?" → Jouw account
- "Link to existing project?" → **n**
- "Project name?" → `viavia` (of iets anders)
- "What's the root?" → `./` (Enter)
- "Overwrite settings?" → **n**

### 4. Configure Environment Variable

Na deployment, ga naar [vercel.com/dashboard](https://vercel.com/dashboard):
1. Selecteer je project (`viavia`)
2. Settings → Environment Variables
3. Add: 
   - **Name**: `DATABASE_URL`
   - **Value**: `file:./.vercel/data.db`
4. Save & Redeploy (meer op Deployments)

Done! ✅

---

## Optie 2: GitHub + Vercel Web

### 1. Push naar GitHub

```bash
# Create new repo on github.com first, then:
cd /Users/dennisrijkers/your-matrix
git remote add origin https://github.com/YOUR_USERNAME/viavia.git
git branch -M main
git push -u origin main
```

### 2. Import in Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Paste your GitHub URL: `https://github.com/YOUR_USERNAME/viavia`
4. Click "Import"
5. **Project Settings**:
   - Root Directory: `./` (default)
   - Framework: `Next.js` (auto-detected)
6. **Environment Variables**:
   - Add `DATABASE_URL = file:./.vercel/data.db`
7. Click "Deploy" ✅

Vercel will auto-redeploy on every push to main!

---

## Optie 3: Production Database (Vercel Postgres)

Als je SQLite te basic vind, use Vercel Postgres:

### 1. Create Database

1. In Vercel dashboard → Project Settings → Storage
2. Click "Create Database" → "Postgres"
3. Name: `viavia-db`
4. Select Region: Europe (nl)
5. Create

### 2. Get Connection String

Copy the connection string (looks like: `postgresql://user:pass@...`)

### 3. Update Environment

In Vercel:
- Replace `DATABASE_URL` with the Postgres connection string
- Redeploy

### 4. Migrate Database

```bash
export DATABASE_URL="postgresql://..." # From Vercel
npx prisma migrate deploy
```

---

## Domain Setup (Optional)

1. Buy domain (Vercel Domains, Namecheap, etc.)
2. In Vercel: Project Settings → Domains
3. Add domain
4. Follow DNS instructions

Example: `viavia.yourdomain.com`

---

## Troubleshooting

### Build fails with "DATABASE_URL not found"
- Check: Settings → Environment Variables
- Ensure `DATABASE_URL` is added
- Redeploy

### Database file not persisting
- Vercel ephemeral filesystems lose files between deploys
- Solution: Use Vercel Postgres (above) OR accept data loss
- For MVP: OK to use SQLite, reset on deploy

### 500 errors after deploy
- Check Vercel Logs: Deployments → View Logs
- Often: missing env vars or database issues
- Fix env vars → Redeploy

---

## Quick Commands

```bash
# Check deployment status
vercel ls

# Open project dashboard
vercel open

# View logs
vercel logs [project-name]

# Redeploy latest commit
vercel --prod
```

---

## URLs After Deploy

- **Production**: `https://viavia.vercel.app`
- **Dashboard**: `https://vercel.com/dashboard`
- **Domain (if added)**: `https://viavia.yourdomain.com`

---

## Share with WhatsApp Group

Once deployed, share the production URL:
```
🚀 ViaVia is live! Check it out:
https://viavia.vercel.app

Post je freelance opdrachten, vind talent, direct contact! ✨
```

---

Enjoy! 🎉

