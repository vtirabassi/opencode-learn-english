# OpenCode Learn English

Progressive Web App (PWA) for contextual English vocabulary practice with spaced repetition, AI-generated examples, and audio playback.

## Overview

This repository contains two applications:

- `app/`: Next.js frontend (App Router, TypeScript)
- `backend/`: .NET 8 Azure Functions API (isolated worker)

The frontend consumes the backend APIs for user settings, words, notes, review queue data, and example generation.

## Features

- Add and manage vocabulary words.
- Save study notes and learning preferences.
- Practice with spaced repetition flow.
- Generate example sentences with OpenAI.
- Listen to pronunciation with browser TTS.
- Installable PWA with manifest and service worker.

## Architecture

### Frontend (`app/`)

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS v4
- App Router pages in `app/src/app/`
- Domain/state logic in:
  - `app/src/lib/`
  - `app/src/store/`
  - `app/src/services/`

### Backend (`backend/`)

- .NET 8 Azure Functions (isolated worker)
- Layered projects:
  - `src/LearnEnglish.Functions` (HTTP functions)
  - `src/LearnEnglish.Application` (use cases/contracts)
  - `src/LearnEnglish.Domain` (domain models)
  - `src/LearnEnglish.Infrastructure` (OpenAI + persistence integrations)

## API Endpoints

Base URL in local dev is usually `http://localhost:7071/api`.

- `POST /v1/examples/generate`
- `GET /v1/settings`
- `PUT /v1/settings`
- `GET /v1/words`
- `PUT /v1/words`
- `GET /v1/notes`
- `PUT /v1/notes`
- `GET /v1/reviews`
- `PUT /v1/reviews`

## Prerequisites

- Node.js 20+ and npm
- .NET SDK 8
- (Optional) Azure Storage emulator or a real Azure Blob Storage account
- OpenAI API key for example generation

## Local Development

### 1. Backend setup

```bash
cd backend
dotnet restore opencode-learn-english.sln
dotnet build opencode-learn-english.sln
```

Create/update `backend/src/LearnEnglish.Functions/appsettings.Development.json`:

```json
{
  "AzureBlob": {
    "ConnectionString": "UseDevelopmentStorage=true",
    "ContainerName": "learn-english-dev"
  },
  "AppData": {
    "DefaultUserId": "default-user"
  },
  "OpenAI": {
    "ApiKey": "your_key_here"
  }
}
```

Run backend:

```bash
cd backend/src/LearnEnglish.Functions
dotnet run
```

### 2. Frontend setup

```bash
cd app
npm install
```

Create `app/.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:7071
```

Run frontend:

```bash
cd app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Common Commands

### Frontend

```bash
cd app
npm run dev
npm run build
npm run start
npm run lint
```

### Backend

```bash
cd backend
dotnet restore opencode-learn-english.sln
dotnet build opencode-learn-english.sln
```

Run functions app:

```bash
cd backend/src/LearnEnglish.Functions
dotnet run
```

Publish functions app:

```bash
dotnet publish backend/src/LearnEnglish.Functions/LearnEnglish.Functions.csproj --configuration Release --output backend/publish
```

## Testing Status

- Frontend: no test runner configured yet.
- Backend: no test project exists yet.

## CI/CD

Main workflow:

- `.github/workflows/azure-static-web-apps-gentle-flower-07edaed0f.yml`

Highlights:

- Frontend build/deploy for Azure Static Web Apps.
- Backend publish step for Azure Functions.
- PR close event triggers SWA close action.

## Deployment Notes

For Azure App Settings, use `__` for nested configuration keys, for example:

- `OpenAI__ApiKey`
- `OpenAI__Model`
- `AzureBlob__ConnectionString`
- `AzureBlob__ContainerName`
- `AppData__DefaultUserId`

## Project Structure

```text
.
├── app/
│   ├── src/app/
│   ├── src/components/
│   ├── src/lib/
│   ├── src/services/
│   └── src/store/
├── backend/
│   └── src/
│       ├── LearnEnglish.Functions/
│       ├── LearnEnglish.Application/
│       ├── LearnEnglish.Domain/
│       └── LearnEnglish.Infrastructure/
└── .github/workflows/
```

## Related Docs

- Frontend details: `app/README.md`
- Backend details: `backend/README.md`
- Agent instructions: `AGENTS.md`
