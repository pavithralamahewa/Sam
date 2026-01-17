# 🚀 Deploy to GitHub + Get Live Link

## Option 1: Automatic (Fastest - 2 minutes)

### Step 1: Create GitHub Repo
1. Go to https://github.com/new
2. Repository name: `precious-ai-coo`
3. Description: "World-class AI COO with real Claude intelligence"
4. Select: **Public**
5. **DO NOT** initialize with README (we have files already)
6. Click "Create repository"

### Step 2: Push Code
```bash
cd precious-coo-v2

# Add GitHub as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/precious-ai-coo.git

# Push code
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel (Get Live Link)
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `precious-ai-coo` repo
4. Click "Import"
5. **Important:** Add environment variable:
   - Name: `NEXT_PUBLIC_ANTHROPIC_API_KEY`
   - Value: Your Anthropic API key (from console.anthropic.com)
6. Click "Deploy"

**You'll get a live URL in ~2 minutes!**
Example: `https://precious-ai-coo.vercel.app`

---

## Option 2: Using GitHub CLI (If installed)

```bash
cd precious-coo-v2

# Create and push repo
gh repo create precious-ai-coo --public --source=. --remote=origin --push

# Deploy to Vercel
vercel

# Add environment variable in Vercel dashboard
# Then redeploy: vercel --prod
```

---

## Option 3: Manual Upload

1. Go to https://github.com/new
2. Create repo: `precious-ai-coo`
3. Download the tar.gz file from Claude Code
4. Extract it on your computer
5. Upload files to GitHub using web interface
6. Then deploy to Vercel (see Step 3 above)

---

## After Deployment

### Enable Auto-Deploy
Vercel will automatically deploy on every git push:
```bash
# Make changes
git add .
git commit -m "Updated feature"
git push

# Vercel auto-deploys in ~1 minute
```

### Get Custom Domain (Optional)
1. In Vercel dashboard → Settings → Domains
2. Add your domain: `coo.precious.com`
3. Follow DNS setup instructions

---

## Verify Deployment

After deploying, check:

1. ✅ URL loads (should see onboarding)
2. ✅ Complete onboarding flow
3. ✅ See breathing orb
4. ✅ Open browser console
5. ✅ Wait 30 seconds
6. ✅ Should see "COO thinking..." and purple glow
7. ✅ Check console for "COO Decision:" logs

If you see errors:
- Check Vercel logs
- Verify API key is set correctly
- Check browser console for details

---

## Share Your Live Link!

Once deployed, you'll have:
- **GitHub Repo:** `https://github.com/YOUR_USERNAME/precious-ai-coo`
- **Live App:** `https://precious-ai-coo.vercel.app`
- **Auto-Deploy:** Every push updates live site

Ready to go! 🚀
