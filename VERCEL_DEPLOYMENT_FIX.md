# 🚀 Vercel Deployment Fix

## Problem
Vercel build failed with React version dependency conflict:
```
npm error peer react@"^18.2.0 || 19.0.0-rc-02c0e824-20241028" from next@15.0.2
npm error   react@"^19.0.0-rc-66855b96-20241106" from the root project
```

## Solution

### Option 1: Use .npmrc (Recommended) ✅

I've already created `.npmrc` file with:
```
legacy-peer-deps=true
```

This tells npm to ignore peer dependency conflicts during installation.

**Vercel will automatically use this file during deployment.**

###Option 2: Update package.json versions

Update to Next.js 15.0.3 and matching React version:

```json
{
  "dependencies": {
    "next": "15.0.3",
    "react": "19.0.0-rc-66855b96-20241106",
    "react-dom": "19.0.0-rc-66855b96-20241106"
  },
  "devDependencies": {
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint-config-next": "15.0.3"
  }
}
```

### Option 3: Downgrade to Stable React 18

Most reliable for production:

```json
{
  "dependencies": {
    "next": "15.0.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18",
    "@types/react-dom": "^18"
  }
}
```

## What I've Done ✅

1. ✅ Created `.npmrc` with `legacy-peer-deps=true`
2. ✅ Updated `package.json` to Next.js 15.0.3
3. ✅ Updated React types to ^19

## Next Steps

### If Using `.npmrc` (Current Setup)
1. Commit changes:
   ```bash
   git add .npmrc package.json
   git commit -m "fix: Add .npmrc for Vercel deployment"
   git push origin main
   ```

2. Redeploy on Vercel
   - Vercel will use `.npmrc` automatically
   - Build should succeed

### If You Prefer Stable React 18
1. Update `package.json` to React 18 (see Option 3 above)
2. Delete `.npmrc`
3. Run `npm install`
4. Commit and push
5. Redeploy on Vercel

## Recommendation

**For Production: Use React 18 (Option 3)**

React 19 is still in RC (release candidate) and may have instability issues.

Steps to switch:
```bash
# 1. Update package.json dependencies
# (manually edit to React 18 versions)

# 2. Delete .npmrc
del .npmrc

# 3. Clean install
npm install

# 4. Test locally
npm run dev
npm run build

# 5. Commit
git add package.json package-lock.json
git commit -m "fix: Downgrade to stable React 18 for production"
git push origin main
```

## Vercel Environment Variables

Don't forget to set these in Vercel dashboard:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_NAME=Lydia's Lechon
```

## Testing the Fix

### Locally
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Test build
npm run build

# If build succeeds, you're good to deploy
```

### On Vercel
1. Push changes to GitHub
2. Vercel auto-deploys
3. Check build logs
4. If successful, test the live site

## Current Status

✅ `.npmrc` created - Vercel will use legacy-peer-deps  
✅ `package.json` updated to Next.js 15.0.3  
⬜ Needs commit and push  
⬜ Needs Vercel redeploy  

## Quick Fix Commands

```bash
# Commit the fix
git add .
git commit -m "fix: Resolve React dependency conflict for Vercel"
git push origin main

# Vercel will auto-redeploy
# Or manually trigger redeploy in Vercel dashboard
```

---

**Status:** Fix ready, needs deployment  
**Recommended:** Switch to React 18 for production stability  
**Current:** Using `.npmrc` workaround  
