# Prof Dammy's Professional Portfolio & CMS Platform

A modern, high-performance portfolio website and custom content management system for **Damilola Miracle Oluwagbamila** (Prof Dammy) — Data Analysis Instructor, AI/Software Developer, Researcher, and Community Leader.

## Tech Stack
- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + Framer Motion
- **Icons**: Lucide React
- **Backend & Auth**: Supabase (PostgreSQL, Row Level Security, Supabase Auth, Storage)
- **Testing**: Vitest + React Testing Library

## Getting Started

### Prerequisites
- Node.js >= 20.0.0
- npm / pnpm / yarn

### Environment Setup
Copy `.env.example` to `.env.local` and configure your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### Installation
```bash
npm install
```

### Testing & Verification
```bash
npx tsc --noEmit
npm run test
npm run build
```
