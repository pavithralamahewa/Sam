# 🚀 Deployment Guide

## Prerequisites

1. **Anthropic API Key**
   - Get it from: https://console.anthropic.com/
   - You'll need this for the AI to work

2. **Node.js 18+**
   - Check: `node --version`
   - Install from: https://nodejs.org/

---

## 🎯 Fastest Deployment (5 minutes)

### Step 1: Install Dependencies

```bash
cd precious-coo-v2
npm install
```

### Step 2: Add Your API Key

```bash
# Create environment file
cp .env.example .env.local

# Edit .env.local and add your key:
# NEXT_PUBLIC_ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### Step 3: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (follow prompts)
vercel

# When asked "Set up and deploy?": Yes
# When asked "Link to existing project?": No
# When asked "Project name?": precious-coo (or your choice)

# After deployment, add environment variable:
# 1. Go to vercel.com dashboard
# 2. Select your project
# 3. Settings → Environment Variables
# 4. Add: NEXT_PUBLIC_ANTHROPIC_API_KEY = your_key
# 5. Redeploy: vercel --prod
```

### Step 4: Open Your Live App

```bash
# Vercel will give you a URL like:
# https://precious-coo.vercel.app

# Open it, complete onboarding, and your COO is live!
```

---

## 🏃 Local Development

```bash
# Install
npm install

# Add API key to .env.local

# Run
npm run dev

# Open http://localhost:3000
```

---

## 🌐 Alternative: Netlify

```bash
# Build static site
npm run build

# Deploy folder 'out/' to Netlify

# In Netlify dashboard:
# Site settings → Environment variables
# Add: NEXT_PUBLIC_ANTHROPIC_API_KEY
```

---

## ✅ Verify It Works

After deployment:

1. **Open the URL** → Should see onboarding flow
2. **Complete onboarding** → Takes ~3 minutes
3. **See breathing orb** → Indigo/purple gradient
4. **Wait 30 seconds** → COO should think (orb turns purple)
5. **Check console** → Should see "COO Decision" logs

---

## 🔥 Common Issues

### API Key Not Working

```bash
# Check format:
# NEXT_PUBLIC_ANTHROPIC_API_KEY=sk-ant-api03-...

# Must start with: sk-ant-
# No quotes needed
# No spaces
```

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### COO Not Thinking

```bash
# Check browser console for errors
# Verify API key is valid
# Check Anthropic dashboard for API quota
```

---

## 💰 Cost Estimate

### Anthropic API Pricing

- Claude 3.5 Sonnet: ~$3 per million input tokens
- Typical usage: ~5,000 tokens per "think" cycle
- Cost per think: ~$0.015 (1.5 cents)
- Thinks every 30 seconds = 120 per hour
- **Estimated cost: ~$1.80/hour of active use**

### Optimization Tips

- Increase think interval to 60s: `setInterval(think, 60000)`
- Use Claude Haiku for less critical tasks: ~75% cheaper
- Cache business context (already implemented)

---

## 🎯 Production Checklist

- [ ] API key added to environment
- [ ] Onboarding flow tested
- [ ] Thinking loop verified (check console)
- [ ] Mobile responsive checked
- [ ] Anthropic API quota confirmed
- [ ] Error handling tested

---

## 📞 Need Help?

1. Check README.md for detailed docs
2. Inspect browser console for errors
3. Verify Anthropic API key at console.anthropic.com

---

**Your AI COO should now be live and thinking! 🧠✨**
