# AGENTS.md - Developer & Agent Instructions

## Project Overview
Prof Dammy's Professional Portfolio Platform is a Next.js (App Router) project built with TypeScript, Tailwind CSS, Supabase, and Framer Motion. It includes a public responsive portfolio and a private /admin CMS dashboard.

## Coding Standards & Conventions
- **Language**: TypeScript with strict typing. Avoid `any` types wherever possible.
- **Components**: Functional components in React using React Server Components by default; add `'use client'` only when interactive state, hooks, or browser APIs are required.
- **Styling**: Tailwind CSS utility classes and CSS custom variables for dynamic accent/theme customizer functionality.
- **Icons**: `lucide-react` icons.
- **State & Data Handling**: Supabase JS client for authentication and database operations.
- **Directory Structure**:
  - `src/app/`: Next.js pages, layouts, and API routes.
  - `src/components/`: Modular React components (divided into `public`, `admin`, `ui`, `common`).
  - `src/lib/`: Helper utilities, Supabase client setup (`client.ts`, `server.ts`), database types.
  - `src/types/`: TypeScript definitions and database models.
  - `supabase/`: Database schema, migrations, and seed SQL.

## Quality Assurance & Verification
Before marking tasks as complete, ensure:
1. `npx tsc --noEmit` returns zero errors.
2. `npm run lint` passes without critical issues.
3. `npm run test` executes vitest tests successfully.
4. `npm run build` completes with clean output.
