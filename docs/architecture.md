# Architecture Overview

## Application Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS v4
- **Routing**: TanStack Router (File-based routing)
- **Data Fetching**: TanStack Query (React Query)
- **State & Storage**: Firebase Firestore (Migrated from Supabase)
- **Authentication**: Firebase Auth
- **Bundler**: Vite

## Core Components
- **Dashboard**: Aggregates user carbon usage against their predefined budget. Utilizes `Recharts` for SVGs.
- **AI Coach**: Interfaces with a conversational agent to generate suggestions. Includes Web Speech API for voice recognition.
- **Simulator**: Calculates predictive analytics on habit changes in real-time.

## Data Flow
1. **Onboarding**: Captures initial answers, calculating a baseline `monthlyBudgetKg`.
2. **State Context**: `useCarbonData.tsx` acts as the global provider, abstracting Firestore `getDocs` and `writeBatch` commands from UI components.
3. **Optimistic Updates**: The UI assumes local state correctness and falls back on error to ensure a smooth, low-latency perceived experience.
