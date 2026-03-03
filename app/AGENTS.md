# AGENTS.md

Purpose
This repository is a Next.js (App Router) + TypeScript PWA for English vocabulary practice.
Use this guide when making changes so automation, linting, and style remain consistent.

Repo Quick Facts
- Framework: Next.js 16 App Router
- Language: TypeScript + React
- Styling: Tailwind CSS (className strings)
- State: local store hooks in `src/store/`
- Data: backend API + in-memory state
- API: dedicated .NET backend in `../backend/src/LearnEnglish.Api`

Setup
- Install: `npm install`
- Dev server: `npm run dev` (http://localhost:3000)
- Requires: `.env.local` with `NEXT_PUBLIC_API_BASE_URL`

Build, Lint, Test
- Build: `npm run build`
- Start prod server: `npm run start`
- Lint: `npm run lint`
- Tests: no test runner configured in `package.json`

Single File Linting
- Lint a file: `npx eslint app/page.tsx`
- Lint a folder: `npx eslint app/components`
- Lint with npm: `npm run lint -- app/page.tsx`

Single Test Guidance
- There is no unit/integration test framework configured.
- If you add tests later, document the single-test command here.

Cursor/Copilot Rules
- No `.cursor/rules/*`, `.cursorrules`, or `.github/copilot-instructions.md` found.

Code Style Overview
- Use TypeScript everywhere (`.ts`/`.tsx`).
- Prefer explicit types for public data shapes in `src/lib/types.ts`.
- Use `type` aliases for object shapes (no `interface` in this codebase so far).
- Keep functions small and pure in `src/lib/` helpers.
- Use Tailwind utility classes; avoid inline styles.
- Use `const` for values and functions; `let` only when reassignment is needed.
- Stick to double quotes for strings.
- Semicolons are used consistently.
- Prefer arrow functions for inline handlers and helpers.

Formatting
- JSX attributes wrap at ~80-100 chars when needed.
- Multiline props/args are indented 2 spaces and trailing commas are used.
- Keep tailwind class strings ordered by general layout -> spacing -> typography.
- Use React fragment only when required.

Imports
- Order: external imports, then absolute `@/` imports, then relative imports.
- Use `import type` for type-only imports.
- Keep imports alphabetized within the same group when adding new ones.
- Prefer `@/` alias for internal absolute paths (see `tsconfig.json`).

Naming
- Components: `PascalCase` and named exports (e.g. `export const Button`).
- Hooks: `useSomething` in `src/store/`.
- Files: `PascalCase.tsx` for components, `camelCase.ts` for libs.
- Variables: `camelCase` and descriptive.
- Constants: `SCREAMING_SNAKE_CASE` only for truly global constants.

React/Next.js Patterns
- App Router pages live in `src/app/` and default export the page component.
- Client components include `"use client"` at the top.
- Use `next/font` for font loading (see `src/app/layout.tsx`).

State & Storage
- State hooks live in `src/store/`.
- API clients live in `src/services/`.
- Update types in `src/lib/types.ts` when data model changes.

Error Handling
- Validate input early and return `NextResponse.json` with proper status codes.
- When calling external APIs, check `response.ok` and surface response text.
- Prefer narrow error messages; do not leak secrets.

Styling Conventions
- Use Tailwind classes and existing design tokens from `src/app/globals.css`.
- For reusable patterns, create components in `src/components/`.
- Keep className strings readable; wrap on multiple lines for complex layouts.

PWA Assets
- Manifest lives in `src/app/manifest.ts`.
- Icons are in `public/icons/`.
- Service worker registration is in `src/components/ServiceWorkerRegister.tsx`.

API & Environment
- `NEXT_PUBLIC_API_BASE_URL` points to backend `/api/v1/examples/generate`.
- Never log or hard-code secrets.

When Adding Features
- Update translations in `src/lib/translations.ts` if UI text changes.
- Keep locale keys stable to avoid breaking existing content.
- Prefer new components over large page files.

When Modifying UI
- Keep the typography and brand feel consistent with existing pages.
- Reuse `Button`, `AppHeader`, and `LanguageSelect` where possible.

If You Add Tests (Future)
- Document the command in this file.
- Use deterministic fixtures; avoid external API calls.

Notes for Agents
- Do not add build artifacts (`.next/`, `out/`, `build/`) to git.
- Avoid changing ESLint config unless necessary.
- Keep the codebase TypeScript strict-safe.
