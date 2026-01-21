# ViaVia Deployment Instructions

## Required Before Deploy

### 1. Environment Variables (Add to Vercel)

```bash
NEXTAUTH_URL=https://viavia76.vercel.app
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
AUTH_RESEND_KEY=<get from https://resend.com/api-keys>
EMAIL_FROM=noreply@viavia76.vercel.app
```

### 2. Database Migration

The new schema has auth tables + new app models. Run migration:

```bash
# Generate migration SQL
npx prisma migrate dev --name add_auth_and_app_models

# Or in production
npx prisma migrate deploy
```

### 3. Vercel Build Command

Ensure `package.json` has:
```json
{
  "scripts": {
    "build": "prisma generate && next build"
  }
}
```

## Troubleshooting

If deployment fails with "Module not found" or database errors:

1. Check Vercel logs for specific error
2. Verify all env vars are set
3. Run migration manually on production DB
4. Check that Prisma Client is generated during build

## Testing Checklist

After deployment:
- [ ] `/` - Landing page loads
- [ ] `/login` - Email login works (requires Resend key)
- [ ] `/dashboard` - Redirects to login if not authenticated
- [ ] Database tables exist: User, Account, Session, GroupV2, Job, JobShare
