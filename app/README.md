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
- Backend API persistence
- OpenAI API via dedicated .NET backend

## Getting Started

Install dependencies:

```bash
npm install
```

Create a `.env.local` file for the frontend:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:7071
```

Run the frontend:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Backend (.NET 8)

Backend API lives in `../backend/src/` with layered responsibilities:

- `LearnEnglish.Functions` - Azure Functions HTTP entrypoints, DI composition root
- `LearnEnglish.Application` - use cases, validation, prompt orchestration
- `LearnEnglish.Domain` - domain models
- `LearnEnglish.Infrastructure` - external integrations (OpenAI client)

Create `../backend/src/LearnEnglish.Functions/appsettings.Development.json` with your key:

```json
{
  "OpenAI": {
    "ApiKey": "your_key_here"
  }
}
```

Run the backend:

```bash
cd ../backend/src/LearnEnglish.Functions
dotnet run
```

## Scripts

- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - lint codebase
- Tests: no test runner configured yet

## Project Structure

- `src/app/` - routes, pages, layouts
  - `src/app/words/page.tsx` - word capture and list UI
  - `src/app/practice/page.tsx` - daily practice flow
  - `src/app/settings/page.tsx` - user preferences
- `src/components/` - UI building blocks (header, buttons, selects)
- `src/lib/` - domain logic (types, storage, spaced repetition, translations)
- `src/store/` - app state and hooks (context, persistence sync)
- `src/services/` - external integrations (TTS + API client)
- `public/` - static assets and PWA files (icons, `sw.js`)

## Data Flow

1. User adds a word in `src/app/words/page.tsx` and submits the form.
2. `addWord` in `src/store/useAppStore.tsx` creates a `Word` + optional `Example`.
3. The store persists `AppData` to LocalStorage via `src/lib/storage.ts`.
4. `src/app/practice/page.tsx` reads `data.words`, filters due items with
   `src/lib/spacedRepetition.ts`, and renders the current example.
5. Rating an example updates its review state and persists the new schedule.

## Roadmap Ideas

- Auth + cloud sync for multi-device learning
- Gamification: streaks, levels, and achievements
- Personalized review schedules
- Azure deployment (Static Web Apps + Azure Functions)

## Notes

All app data persistence is handled by the backend endpoints (`/api/v1/settings`, `/api/v1/words`, `/api/v1/notes`, `/api/v1/reviews`) backed by Azure Blob Storage.
