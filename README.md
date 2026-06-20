# 🌍 Carbon Compass — AI Carbon Footprint Coach

> An AI-powered, full-stack web application that helps individuals track, simulate, and meaningfully reduce their personal carbon footprint through intelligent coaching and real-time analytics.

[![Tests](https://img.shields.io/badge/Tests-35%20passing-brightgreen)](./src/tests/carbon.test.ts)
[![Security](https://img.shields.io/badge/Security-99%2F100-green)](./src/integrations/firebase)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.1-blue)](./src/components)
[![License](https://img.shields.io/badge/License-MIT-yellow)](./LICENSE)

---

## 👥 Target Users

**Urban Professionals** who are busy, use daily commutes, food delivery, and online shopping, and want to reduce their environmental impact but need actionable, personalized guidance.

## 🎯 Chosen Vertical

**Sustainability & Personal Climate Action**

Carbon Compass targets the growing gap between individual awareness of climate change and actionable, personalized steps users can take in their daily lives. The app acts as a smart, dynamic AI coach that ingests the user's real lifestyle habits and transforms them into a personalized carbon budget, actionable weekly goals, and real-time AI-driven recommendations.

---

## 🧠 Approach and Logic

The solution is built around a **three-layer Agentic AI architecture**:

### Layer 1 — Intelligent Onboarding & Carbon Profiling

Users answer 6 lifestyle questions (commute mode, diet, household size, WFH days, shopping frequency, travel distance). A deterministic calculation engine converts these inputs into a precise **monthly carbon budget in kg CO₂e** broken down by category (Transport, Food, Energy, Shopping).

**Core formula logic (see [`use-carbon-data.tsx`](./src/hooks/use-carbon-data.tsx)):**

```
transScore  = distance × emission_factor × 4.33 weeks
foodScore   = diet_tier (vegan=60 → meat=200)
energyScore = (120 / household_size) + (wfh_days × 3)
shopScore   = shopping_frequency_tier (rare=15 → often=120)
monthlyBudget = sum of all scores
```

### Layer 2 — Agentic AI Coach (Gemini 2.5 Flash + Local Fallback Engine)

For authenticated users, questions are routed to **Google Gemini 2.5 Flash** with the user's full carbon profile injected into the system prompt. The AI operates as an agentic planner:

- It **analyzes the sentiment** of the user's query.
- It formulates an **action plan** (step-by-step).
- It returns **structured JSON** validated via Zod, which renders rich recommendation cards.
- It includes rate-limiting (15 requests/hour) and CSRF protection on the server to prevent API abuse.

For unauthenticated/guest users, a **local rule-based inference engine** provides meaningful, keyword-intent-matched recommendations (transport/food/energy/shopping) without any API calls — protecting quota and enabling offline use.

### Layer 3 — Real-time Tracking & Persistence

Activity logging updates both local state and Firebase Firestore in real time. The dashboard reflects live progress against the user's monthly budget. All data is protected by Firebase Auth and Firebase Security Rules.

---

## ⚙️ How the Solution Works

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          Carbon Compass                                  │
├─────────────────────────────────────────────────────────────────────────┤
│  1. Onboarding Wizard → Calculates baseline carbon budget               │
│  2. Dashboard → Real-time gauge showing budget used vs. remaining       │
│  3. Activity Logger → Log daily activities (commute, meals, shopping)   │
│  4. AI Coach → Agentic Gemini 2.5 powered Q&A with action plans         │
│  5. Simulator → What-if scenarios (e.g., "What if I go vegan?")        │
│  6. Progress → Monthly trend charts and impact breakdown                │
└─────────────────────────────────────────────────────────────────────────┘
```

### User Flow

1. **Sign Up / Guest Mode** → Auth via Firebase Email/Password
2. **Onboarding** → Answer 6 lifestyle questions
3. **Dashboard** → See your personal carbon budget and current usage
4. **Log Activities** → Add daily transport, food, energy, or shopping actions
5. **Ask the AI Coach** → Get context-aware, actionable agentic recommendations
6. **Simulate Changes** → Model the impact of lifestyle changes before committing
7. **Track Progress** → Weekly goals and monthly trend charts

---

## ☁️ Google Services Usage

- **Gemini 2.5 Flash**: Provides personalized coaching and carbon reduction recommendations.
- **Firebase Auth**: Manages user identity securely.
- **Firestore**: Stores user profiles, carbon budgets, and progress tracking data.
- **Cloud Functions (via TanStack Server Functions)**: Handles secure carbon calculations and serves as the backend for the AI recommendation engine.

## ✨ Key Features

| Feature                     | Description                                                                |
| --------------------------- | -------------------------------------------------------------------------- |
| 🤖 **Agentic AI Coach**     | Gemini 2.5 Flash calculates sentiment, plans actions, and returns JSON     |
| 🔄 **Smart Fallback**       | Local rule-based engine for guests — zero API cost, zero downtime          |
| 🛡️ **Rate Limiting & CSRF** | Robust server-side protection to stop API key abuse and attacks            |
| 📊 **Live Dashboard**       | Modular, real-time carbon budget gauge with category breakdowns            |
| 🎯 **Simulator**            | Interactive what-if scenario modeling                                      |
| ♿ **Accessible**           | Radix UI primitives, `aria-live`, `role="progressbar"`, WCAG 2.1 compliant |
| 🔒 **Secure**               | Firebase Auth, Firestore Rules, API key in server-only env vars            |
| 🧪 **Tested**               | 35 unit tests covering all `calculateBudget` branches and edge cases       |
| 📱 **Responsive**           | Mobile-first design with adaptive sidebar navigation                       |

---

## 🏆 Hackathon Differentiators

1. **Carbon Budget Framework**: Treats carbon like money, making it immediately understandable.
2. **Personalized AI Carbon Coach**: Uses Gemini to provide practical, context-aware recommendations instead of generic advice.
3. **What-If Simulator**: Gives users immediate visibility into the impact of lifestyle changes before they commit.

## 🚀 Tech Stack

| Layer              | Technology                                            |
| ------------------ | ----------------------------------------------------- |
| Frontend Framework | React 19, TanStack Start (SSR)                        |
| Routing            | TanStack Router with file-based routes                |
| Styling            | Tailwind CSS v4, Radix UI, Shadcn/UI                  |
| Backend            | TanStack Server Functions (Node.js edge)              |
| Database           | Firebase Firestore (NoSQL Document Store)             |
| Auth               | Firebase Authentication                               |
| AI                 | Google Gemini 2.5 Flash via REST API                  |
| Input Validation   | Zod (both client and server)                          |
| Testing            | Vitest + @testing-library/react + @vitest/coverage-v8 |
| Build Tool         | Vite 7                                                |

---

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm
- A [Firebase](https://firebase.google.com/) project
- A [Google AI Studio](https://aistudio.google.com) Gemini API key (free tier works)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/rahoul-samantara/my-carbon-coach.git
cd my-carbon-coach

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
```

Edit `.env` with your credentials:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
FIREBASE_CLIENT_EMAIL=your_firebase_admin_email
FIREBASE_PRIVATE_KEY=your_firebase_admin_private_key
GEMINI_API_KEY=your_gemini_api_key
```

```bash
# 4. Start the development server
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) to view the app.

### Running Tests

```bash
# Run all 35 unit tests
npm run test

# Run tests with coverage report
npm run test:coverage

# Run the linter
npm run lint
```

---

## 🗄️ Database Models (Firestore)

The app uses 5 Firestore collections:

- **`profiles`** — User display name, email, city (Document ID: `user_id`)
- **`carbon_profiles`** — Onboarding answers (commute, diet, wfh, etc.)
- **`carbon_budgets`** — Monthly budget and current usage tracking
- **`activities`** — Log of all user-recorded carbon activities
- **`goals`** — Weekly goals with progress tracking

---

## 📐 Assumptions Made

1. **Carbon factors are approximations.** The emission coefficients used (e.g., `car = 0.2 kg CO₂e/km`) are based on widely cited averages and are not regionally adjusted. A production app would use a geo-IP database to apply local grid emissions factors.

2. **Monthly budget resets on the 1st.** The current implementation tracks a rolling monthly total from the user's last onboarding date. A production system would use a scheduled Cloud Function to reset `current_usage` each calendar month.

3. **Guest mode uses localStorage.** Unauthenticated users can still use the full app; their data is persisted in browser localStorage. This enables a "try before you sign up" flow but is cleared on browser data reset.

4. **AI responses are cached per session.** To avoid re-triggering the Gemini API on identical questions, responses are memoized in React state for the duration of the session. A Redis layer would handle this in production.

5. **Household energy is simplified.** The `energyScore` formula uses national average household energy, divided by household size. It does not account for regional climate (heating vs. cooling), building type (apartment vs. house), or renewable energy sources.

---

## 🔒 Security Practices

- **Zero client-side secrets** — `GEMINI_API_KEY` and Firebase Admin keys are only accessed in server functions.
- **CSRF & Rate Limiting** — Middleware protects all `coach.functions.ts` server executions.
- **Prompt injection protection** — Server validates and sanitizes all AI inputs against known jailbreak patterns before sending to Gemini.
- **Firebase Auth** — End-to-end user identity verification passing tokens through middleware.
- **Security headers** — All SSR responses include `Content-Security-Policy`, `X-Frame-Options: DENY`, and `X-Content-Type-Options: nosniff`.
- **Input validation** — All server function inputs are validated with Zod schemas before processing.

---

## 📁 Project Structure

```
src/
├── routes/          # TanStack file-based routes
│   ├── _app.index.tsx      # Dashboard (Modularized)
│   ├── _app.coach.tsx      # AI Coach interface
│   ├── _app.simulator.tsx  # Lifestyle simulator
│   ├── _app.progress.tsx   # Progress & trends
│   ├── onboarding.tsx      # Onboarding wizard
│   └── auth.tsx            # Authentication
├── components/      # Reusable UI components (including modular dashboard parts)
├── hooks/           # useCarbonData context + calculateBudget
├── lib/api/         # Server functions (AI Coach, rate limiting, sentiment)
├── integrations/    # Firebase client & admin SDK setup + middleware
└── tests/           # Vitest unit tests
```

---

_Built with ❤️ for PromptWars by Hack2Skill — demonstrating that AI-native applications can be both technically rigorous and meaningfully impactful._
