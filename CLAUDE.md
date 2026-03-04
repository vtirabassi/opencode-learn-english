# CLAUDE.md

Full-stack PWA for English vocabulary learning with spaced repetition and AI-generated examples.

## Project Structure

- `app/` — Next.js 16 frontend (App Router, React 19, TypeScript, Tailwind CSS v4)
- `backend/` — .NET 8 Azure Functions API (isolated worker, layered architecture)
- See `AGENTS.md` for full code style guidelines and conventions.

## Quick Commands

### Frontend (`app/`)

```bash
cd app && npm install        # Install dependencies
cd app && npm run dev        # Dev server (http://localhost:3000)
cd app && npm run build      # Production build
cd app && npm run lint       # ESLint check
cd app && npx eslint <file>  # Lint single file
```

### Backend (`backend/`)

```bash
cd backend && dotnet build opencode-learn-english.sln           # Build all projects
cd backend/src/LearnEnglish.Functions && dotnet run              # Run Functions app (http://localhost:7071)
dotnet publish backend/src/LearnEnglish.Functions/LearnEnglish.Functions.csproj --configuration Release --output backend/publish  # Publish
```

### No tests configured yet

When tests are added: Vitest/Jest for frontend, xUnit for backend.

## Key Conventions

- **TypeScript**: strict mode, semicolons, double quotes, `@/` absolute imports, `import type` for type-only
- **React**: `"use client"` only when needed, PascalCase components, camelCase functions
- **C#**: file-scoped namespaces, record types for DTOs, async/await with CancellationToken, thin function handlers
- **Styling**: Tailwind CSS v4, design tokens in `app/src/app/globals.css`
- **State**: React Context via `useAppStore` hook, services layer for API calls

## Architecture Notes

- Frontend state: `app/src/store/useAppStore.tsx` (React Context + fetch)
- Backend DI root: `backend/src/LearnEnglish.Functions/Program.cs`
- Shared error handling: `backend/src/LearnEnglish.Functions/Shared/FunctionHttp.cs`
- Spaced repetition logic: `app/src/lib/spacedRepetition.ts`
- API client: `app/src/services/userDataApi.ts`

## Environment

- Frontend: `app/.env.local` with `NEXT_PUBLIC_API_BASE_URL=http://localhost:7071`
- Backend: `backend/src/LearnEnglish.Functions/appsettings.Development.json` (OpenAI key, Azure Blob, AppData)

## CI/CD

Azure Static Web Apps (frontend) + Azure Functions (backend). Workflow in `.github/workflows/`.
