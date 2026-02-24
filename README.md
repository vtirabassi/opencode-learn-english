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
- Tests: no test runner configured yet

## Project Structure

- `app/` - routes, pages, layouts, and API handlers
  - `app/api/generate/route.ts` - OpenAI example generation endpoint
  - `app/words/page.tsx` - word capture and list UI
  - `app/practice/page.tsx` - daily practice flow
  - `app/settings/page.tsx` - user preferences
- `components/` - UI building blocks (header, buttons, selects)
- `lib/` - domain logic (types, storage, spaced repetition, translations)
- `store/` - app state and hooks (context, persistence sync)
- `services/` - external integrations (TTS)
- `public/` - static assets and PWA files (icons, `sw.js`)

## Data Flow

1. User adds a word in `app/words/page.tsx` and submits the form.
2. `addWord` in `store/useAppStore.tsx` creates a `Word` + optional `Example`.
3. The store persists `AppData` to LocalStorage via `lib/storage.ts`.
4. `app/practice/page.tsx` reads `data.words`, filters due items with
   `lib/spacedRepetition.ts`, and renders the current example.
5. Rating an example updates its review state and persists the new schedule.

## Roadmap Ideas

- Auth + cloud sync for multi-device learning
- Gamification: streaks, levels, and achievements
- Personalized review schedules
- Azure deployment (App Service + Key Vault + Cosmos DB)

## Notes

All data is stored locally in the browser for the MVP. The OpenAI integration runs server-side via `/api/generate`.
