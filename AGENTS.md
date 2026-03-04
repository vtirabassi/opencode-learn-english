# AGENTS.md

This guide is for coding agents working in `/Users/vinicius/code/opencode-learn-english`.
It covers build/lint/test commands and the code style conventions used in this repo.

## Repository Layout

- `README.md` - root guide for full-stack setup and workflows.
- `app/` - Next.js 16 + TypeScript frontend (App Router).
- `backend/` - .NET 8 Azure Functions backend (isolated worker).
- `.github/workflows/` - CI/CD for frontend and backend deploys.

## Tooling Snapshot

- Frontend package manager: `npm` (see `app/package.json`).
- Frontend linting: `eslint` with `eslint-config-next` and TypeScript config.
- Frontend tests: not configured yet.
- Backend runtime: .NET SDK 8 (`net8.0`).
- Backend solution: `backend/opencode-learn-english.sln`.
- Backend tests: no test project currently exists.

## Setup Commands

### Frontend

- Install deps: `cd app && npm install`
- Run dev server: `cd app && npm run dev`
- Build production bundle: `cd app && npm run build`
- Run production server: `cd app && npm run start`

Required env for frontend local run:

- `app/.env.local` must define `NEXT_PUBLIC_API_BASE_URL` (usually `http://localhost:7071`).

### Backend

- Restore solution: `cd backend && dotnet restore opencode-learn-english.sln`
- Build solution: `cd backend && dotnet build opencode-learn-english.sln`
- Run Functions app: `cd backend/src/LearnEnglish.Functions && dotnet run`
- Publish Functions app: `dotnet publish backend/src/LearnEnglish.Functions/LearnEnglish.Functions.csproj --configuration Release --output backend/publish`

Required backend local config:

- `backend/src/LearnEnglish.Functions/appsettings.Development.json`
- Configure `OpenAI:ApiKey`, and usually Azure Blob + AppData settings.

## Lint, Build, and Test Commands

### Frontend (app)

- Lint all: `cd app && npm run lint`
- Lint one file: `cd app && npx eslint src/app/page.tsx`
- Lint one folder: `cd app && npx eslint src/components`
- Build check: `cd app && npm run build`

### Backend (backend)

- Build all projects: `cd backend && dotnet build opencode-learn-english.sln`
- Restore + build quick check: `cd backend && dotnet restore && dotnet build`
- No dedicated linter is configured; rely on compiler warnings/errors from `dotnet build`.

### Tests

Current state:

- No frontend test runner configured in `app/package.json`.
- No backend test project (`*Tests.csproj`) currently present.

When tests are added, use these patterns:

- Frontend single test (Vitest example): `npm run test -- src/lib/spacedRepetition.test.ts`
- Frontend single test (Jest example): `npm test -- src/lib/spacedRepetition.test.ts -t "returns due items"`
- Backend single test by name: `dotnet test --filter "FullyQualifiedName~Namespace.ClassName.TestName"`
- Backend single test by class: `dotnet test --filter "FullyQualifiedName~Namespace.ClassName"`

## CI/CD Notes

Workflow file: `.github/workflows/azure-static-web-apps-gentle-flower-07edaed0f.yml`

- Frontend deploy uses Azure Static Web Apps action.
- Frontend build command in CI: `npm run build` with `app_location: ./app`.
- Backend deploy runs `dotnet publish` for `LearnEnglish.Functions.csproj`.
- PR close event triggers SWA close action.

## Code Style Guidelines

These conventions are inferred from the current codebase and should be preserved.

### General

- Prefer small, focused functions and explicit data flow.
- Avoid introducing new frameworks or architectural layers without clear need.
- Keep files cohesive: UI in components/pages, domain logic in lib/application services.
- Do not commit generated artifacts (`.next`, `build`, `bin`, `obj`, etc.).

### Frontend TypeScript/React

- Use TypeScript for all new app code (`.ts`/`.tsx`).
- Keep `strict` typing intact (`app/tsconfig.json` has `strict: true`).
- Prefer `type` aliases for object/data shapes (matches existing code).
- Use `import type` for type-only imports.
- Prefer `const`; use `let` only when reassignment is required.
- Use semicolons and double quotes.
- Prefer `@/` absolute imports for app-internal modules.
- Import ordering pattern: external packages, then `@/` aliases, then relative paths.
- Components use `PascalCase`; hooks use `useSomething`; variables/functions use `camelCase`.
- Route files in App Router follow Next.js conventions (`src/app/**/page.tsx`, `layout.tsx`).
- Add `"use client"` only when client-side hooks/browser APIs are needed.

### Frontend Formatting and Styling

- Follow ESLint defaults from Next.js core-web-vitals + TypeScript presets.
- Keep JSX readable; break long prop lists across lines.
- Keep Tailwind class strings readable and grouped logically.
- Reuse existing design tokens from `app/src/app/globals.css` where possible.
- Prefer existing shared components in `app/src/components` before adding new ones.

### Frontend Error Handling

- Check `response.ok` for fetch calls and throw meaningful errors on failure.
- Include server response text when safe/useful for debugging.
- Avoid swallowing errors silently; log context in client-side catch blocks.
- Do not leak secrets or sensitive config values in errors/logs.

### Backend C#/.NET

- Target `net8.0`; keep `Nullable` enabled.
- Prefer `record` types for DTO-style contracts (as used in Application layer).
- Use primary constructors where already established.
- Keep namespaces file-scoped (`namespace X.Y;`).
- Use async/await end-to-end for I/O and pass `CancellationToken` through calls.
- Validate inputs early and throw `ArgumentException`/`InvalidOperationException` appropriately.
- Keep function handlers thin; delegate logic to Application/Infrastructure services.
- Return HTTP responses through shared helpers in `Functions/Shared/FunctionHttp.cs`.
- Use dependency injection registrations from `Application.Extensions` and `Infrastructure.Extensions`.

### Backend Naming and Structure

- Functions classes: plural resource + `Functions` suffix (`WordsFunctions`, `NotesFunctions`).
- HTTP trigger methods use concise verbs (`Get`, `Put`, `Generate`).
- Option classes end with `Options` and expose `SectionName` where relevant.
- Keep domain models in `LearnEnglish.Domain`, use-cases in `LearnEnglish.Application`, integrations in `LearnEnglish.Infrastructure`.

### Backend Error Handling

- Use centralized exception-to-response mapping via `FunctionHttp.HandleExceptionAsync`.
- Map validation issues to 400, upstream failures to 502, unknown errors to 500.
- Log exceptions with context through `ILogger<T>`.
- Keep error payloads consistent (`application/problem+json` for failures).

## Cursor/Copilot Rule Files

Checked locations:

- `.cursor/rules/`
- `.cursorrules`
- `.github/copilot-instructions.md`

Result:

- No Cursor or Copilot instruction files were found in this repository.

## Agent Working Agreements

- Prefer minimal, targeted changes over broad refactors.
- Match existing style in each subproject (frontend vs backend).
- If you add a test framework, update this file with exact test commands, including single-test invocation.
- If you add rule files for Cursor/Copilot, update this file to summarize the new constraints.
- Keep `README.md`, `app/README.md`, and `backend/README.md` aligned with any setup, command, endpoint, or deployment changes.
