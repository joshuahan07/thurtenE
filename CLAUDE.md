# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ThurtenE Carnival App — a mobile-first React SPA for the WashU ThurtenE carnival event. Features: home/hero screen, interactive map, scavenger hunt (QR-code based with sections A–E), event schedule, email signup, and info/FAQ.

## Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — Production build (output in `dist/`)

No test runner or linter is configured.

## Architecture

**Single-page app with manual screen routing** — `App.tsx` manages a `currentScreen` state (`home | map | scavenger | schedule | signup | info`) and conditionally renders the corresponding screen component. There is no React Router; navigation is done via `handleNavigate()` callbacks passed as `onNavigate` props.

**Key directories:**
- `src/app/components/` — Screen components (`HomeScreen`, `InteractiveMapScreen`, `ScavengerHuntScreen`, `EventScheduleScreen`, `EmailSignupScreen`, `InfoFaqScreen`) and shared UI
- `src/app/components/ui/` — shadcn/ui component library (Radix-based primitives)
- `src/services/` — Supabase client, analytics event tracking, and keepincontact signup service
- `src/styles/` — CSS entry point (`index.css` → `fonts.css` + `tailwind.css` + `theme.css`)
- `public/` — Static assets including nav icon PNGs referenced via CSS masks

**Supabase backend** — Two tables: `analytics_events` (fire-and-forget client analytics) and `keepincontact_signups` (email/phone collection with dedup logic). Schema lives in `supabase/analytics_events.sql`. Requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` env vars. App gracefully degrades if these are missing.

**Styling:**
- Tailwind CSS v4 via `@tailwindcss/vite` plugin (no PostCSS config needed)
- Theme tokens defined as CSS custom properties in `src/styles/theme.css` and mapped to Tailwind via `@theme inline`
- Day theme only (cream background `#f7f2e8`, yellow primary `#fbee08`, orange accent `#f07b3d`)
- Fonts: Playfair Display (headings), Inter (body), loaded via Google Fonts in `fonts.css`
- Custom utilities: `.carnival-gradient`, `.carnival-stripe`, `.safe-bottom`

**Path alias:** `@` maps to `src/` (configured in `vite.config.ts`)

**QR deep linking:** URL hash `#scavenger-section-[A-E]` auto-navigates to the scavenger hunt screen.
