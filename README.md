# Precious AI COO

> A world-class AI Chief Operating Officer that actually thinks, learns, and drives revenue for your agency.

## 🎯 What Makes This Different

This isn't a chatbot. This isn't a dashboard. This is a **true AI operating system** that:

✅ **Actually thinks** - Real Claude 3.5 Sonnet integration, analyzing your business continuously
✅ **Learns your business** - Understands positioning, case studies, team capabilities
✅ **Proactive intelligence** - Interrupts you ONLY when it matters (hot leads, risks, opportunities)
✅ **Generates real responses** - Drafts personalized emails based on your case studies and voice
✅ **Apple-level polish** - Spring physics, micro-interactions, sophisticated motion design

---

## 🚀 Quick Start

### 1. Get Your Anthropic API Key

1. Go to https://console.anthropic.com/
2. Create an account or sign in
3. Generate an API key
4. Copy it for the next step

### 2. Install & Run

```bash
# Clone or extract the project
cd precious-coo-v2

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your Anthropic API key to .env.local
# NEXT_PUBLIC_ANTHROPIC_API_KEY=sk-ant-...

# Run development server
npm run dev

# Open http://localhost:3000
```

### 3. Onboarding

The COO will guide you through a 3-minute onboarding where it learns:
- Your agency positioning
- Team size and capabilities
- Ideal client profile
- Core expertise areas
- Average project values

### 4. Let It Run

Once onboarded, the COO:
- Monitors your pipeline 24/7
- Analyzes business state every 30 seconds
- Proactively alerts you to opportunities
- Takes background actions automatically
- Surfaces strategic insights

---

## 🧠 How It Works

### The Intelligence Layer

```typescript
// COO continuously thinks about your business
const decision = await cooEngine.think();

// Analyzes pipeline, conversations, opportunities
// Decides: intervention | background_action | strategic_insight
```

### The Three Modes

1. **Ambient Monitoring** (Default)
   - Breathing presence orb
   - Real-time metrics
   - Passive observation

2. **Proactive Intervention** (When needed)
   - Hot lead replied → Draft response now
   - Deal at risk → Suggest rescue strategy
   - Opportunity spotted → Show analysis

3. **Background Actions** (Automatic)
   - Prioritize leads by intent score
   - Update CRM automatically
   - Draft initial responses

---

## 🎨 Design System

### Motion Design

Every animation uses **spring physics** (not linear easing):

```typescript
const springs = {
  gentle: { stiffness: 260, damping: 20 },
  snappy: { stiffness: 400, damping: 25 },
  bouncy: { stiffness: 300, damping: 15 },
}
```

### State Colors

Each COO state has semantic meaning:

- **Idle** (Indigo): Monitoring, everything normal
- **Thinking** (Purple): Analyzing current state
- **Alert** (Pink): Requires human attention
- **Success** (Green): Task completed successfully
- **Learning** (Purple gradient): Processing new information

### Micro-Interactions

- Button tap: `scale: 0.96`
- Hover: `scale: 1.02`
- All transitions: spring-based
- Breathing animation: 4s ease-in-out cycle
- Particle effects when thinking

---

## 📁 Project Structure

```
precious-coo-v2/
├── app/
│   ├── page.tsx           # Main app orchestration
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── IntelligentPresence.tsx  # The breathing orb
│   └── OnboardingFlow.tsx       # Business learning flow
├── lib/
│   ├── coo-engine.ts      # AI brain (Claude integration)
│   └── motion.ts          # Design system & animations
└── package.json
```

---

## 🔐 Environment Variables

Required:
- `NEXT_PUBLIC_ANTHROPIC_API_KEY` - Your Anthropic API key

---

## 🛠️ Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Framer Motion** - Spring physics animations
- **Tailwind CSS** - Utility-first styling
- **Anthropic SDK** - Claude 3.5 Sonnet integration
- **Zustand** - State management (if needed)

---

## 🎯 Key Features

### Real AI Intelligence

```typescript
// Analyze inbound messages
const analysis = await coo.analyzeInbound(message, lead);
// Returns: intentScore, sentiment, urgency, keySignals

// Generate personalized responses
const response = await coo.generateResponse(lead, conversation);
// Returns: Human-like email based on your case studies

// Continuous monitoring
const decision = await coo.think();
// Returns: What to do next based on full business state
```

### Proactive Interventions

COO only interrupts when it's worth your time:
- Hot lead with high intent score (85+)
- Deal at risk (no response in 48h)
- Urgent opportunity (budget mention, timeline)
- Strategic pattern detected

### Learning System

COO learns from:
- Your positioning and case studies
- Email conversation patterns
- Successful project outcomes
- Your communication style

---

## 📊 What Gets Analyzed

Every 30 seconds, COO reviews:
- Pipeline value and stage distribution
- Lead intent scores and recency
- Conversation sentiment
- Team availability
- Revenue patterns

Then decides:
- Should I alert the human?
- Can I handle this in background?
- Is there a strategic insight?

---

## 🚢 Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variable in Vercel dashboard
# NEXT_PUBLIC_ANTHROPIC_API_KEY = your_key
```

### Option 2: Netlify

```bash
npm run build
# Upload out/ folder to Netlify
# Add env var in Netlify settings
```

### Option 3: Docker

```bash
# Coming soon
```

---

## 🎨 Customization

### Change Colors

Edit `lib/motion.ts`:

```typescript
export const stateColors = {
  idle: {
    primary: "#6366F1",  // Your brand color
    secondary: "#8B5CF6",
    glow: "rgba(99, 102, 241, 0.6)",
  },
  // ...
}
```

### Adjust Thinking Frequency

Edit `app/page.tsx`:

```typescript
// Default: think every 30 seconds
thinkingIntervalRef.current = setInterval(think, 30000);

// More aggressive: every 10 seconds
thinkingIntervalRef.current = setInterval(think, 10000);
```

### Customize COO Personality

Edit `lib/coo-engine.ts` → `getSystemPrompt()`:

```typescript
Personality:
- Strategic and data-driven  // ← Customize these
- Proactive, not reactive
- Focused on high-value actions
```

---

## 🐛 Troubleshooting

### "COO not initializing"
- Check that `NEXT_PUBLIC_ANTHROPIC_API_KEY` is set in `.env.local`
- Verify API key is valid at https://console.anthropic.com/

### "Thinking loop not running"
- Check browser console for errors
- Ensure Anthropic API quota is available

### "Animations choppy"
- Disable browser dev tools
- Check GPU acceleration is enabled
- Reduce particle count in `IntelligentPresence.tsx`

---

## 📈 Roadmap

- [ ] Email integration (Gmail, Outlook)
- [ ] CRM sync (HubSpot, Pipedrive)
- [ ] Slack notifications
- [ ] Voice mode (speak with COO)
- [ ] Mobile app
- [ ] Multi-language support

---

## 🙌 Credits

Built with:
- Claude 3.5 Sonnet (the brain)
- Framer Motion (the motion)
- Next.js (the foundation)
- A lot of caffeine ☕

---

## 📄 License

MIT - Do whatever you want with it

---

## 💬 Support

Questions? Email: [your-email]
Issues? GitHub: [your-repo]

---

**Made with ❤️ for agencies that want a real AI COO, not another dashboard.**
