# 🌍 Carbon Compass

Carbon Compass is an AI-powered, full-stack web application designed to help individuals track, simulate, and reduce their carbon footprint. It features an intelligent coaching assistant, real-time metrics, and a dynamic local environment simulator.

## ✨ Key Features

- **🤖 AI-Powered Coaching**: Integrated with Google's Gemini 1.5, offering highly personalized, context-aware advice on reducing carbon emissions based on your specific profile and city data.
- **🛡️ Secure & Scalable Architecture**:
  - Full Supabase integration with session-based authentication.
  - Strict Row Level Security (RLS) policies to protect user data.
  - API security headers (`CSP`, `X-Frame-Options`) for SSR responses.
- **⚡ Smart Fallback Engine**: A local, rule-based inference engine that handles unauthenticated traffic seamlessly without exhausting AI quota, protecting against cost-based attacks.
- **📊 Real-Time Simulation**: Interactive dashboards that dynamically load your profile data, calculate your progress, and adjust to your selected city metrics.
- **♿ 100% Accessible UI**: Built with modern web accessibility standards, including Radix UI Dialogs, `aria-live` regions, proper focus management, and screen-reader compliant progress bars.
- **🔒 Type-Safe End-to-End**: Fully typed with strict TypeScript configurations and Supabase-generated types, eliminating all `any` usage.

## 🚀 Tech Stack

- **Frontend**: React, TanStack Start, Tailwind CSS, Shadcn UI, Radix Primitives
- **Backend**: Supabase (PostgreSQL, Auth), Node.js server functions
- **AI Integration**: Google Gemini API (`@google/genai`)
- **Testing**: Vitest, React Testing Library

## 🛠️ Getting Started

### Prerequisites

Ensure you have Node.js and `npm` (or `bun`) installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rahoul-samantara/my-carbon-coach.git
   cd my-carbon-coach
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add your keys:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the local development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:5173` (or the port specified in your console).

## 🧪 Testing

The application includes a comprehensive test suite to verify routing, API fallbacks, and authentication layers.
Run tests using:
```bash
npm run test
```

## 🔒 Security Practices
- API keys are completely stripped from client-side bundles and are only injected via secure server headers (`x-goog-api-key`).
- All interactive forms use robust Zod validation.
- Database access is strictly governed by authenticated sessions.

---
*Built to make sustainable living accessible, interactive, and actionable for everyone.*
