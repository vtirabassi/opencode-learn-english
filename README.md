# OpenCode Learn English

Progressive Web App (PWA) for contextual English vocabulary practice with spaced repetition, short daily sessions, and audio support.

## Features

- Add words with optional translation, part of speech, and difficulty.
- Create manual examples or generate contextual sentences with OpenAI.
- Daily practice flow with a simple spaced repetition schedule.
- Audio pronunciation using the Web Speech API.
- PWA-ready with offline caching of core pages and assets.

## Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- LocalStorage persistence
- OpenAI API (server-side route)

## Getting Started

Install dependencies:

```bash
npm install
```

Create a `.env.local` file with your OpenAI key:

```bash
OPENAI_API_KEY=your_key_here
```

Run the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - lint codebase

## Project Structure

- `app/` - routes, pages, and API
- `components/` - UI building blocks
- `lib/` - data types, spacing repetition logic, helpers
- `services/` - TTS and other external services
- `store/` - local app state and hooks

## Roadmap Ideas

- Auth + cloud sync for multi-device learning
- Gamification: streaks, levels, and achievements
- Personalized review schedules
- Azure deployment (App Service + Key Vault + Cosmos DB)

## Notes

All data is stored locally in the browser for the MVP. The OpenAI integration runs server-side via `/api/generate`.
