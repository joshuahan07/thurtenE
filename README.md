# ThurtenE Carnival App

## Setup

```bash
# Install dependencies (requires pnpm, or use npm/yarn)
pnpm install
# or: npm install

# Run dev server
pnpm dev
# or: npm run dev
```

## Project Notes

- **Framework**: React + Vite + TypeScript
- **Styling**: Tailwind CSS v4 (configured via `src/styles/`)
- **Icons**: Lucide React

## Assets
All images live in `src/assets/`:
- `thurtene-hero-mark.png` — Hero mark (shown inside a full circular primary ring)
- `thurtene-logo.jpeg` — legacy logo asset (unused unless swapped back in code)
- `carnival-hero.jpg` — Hero background photo
- `thurtene-site-map.jpeg` — Interactive map image

## Themes
Two palettes in the theme picker: **Day** (default, cream + black/yellow + orange accent) and **Night** (black & yellow). Theme choice is stored in `localStorage` under `thurtene-theme`.

## Color Palette (legacy notes)
The original design referenced a warm dark palette:
| Token | Value | Use |
|---|---|---|
| Background | `#180C04` | Page backgrounds |
| Card | `#231208` | Card surfaces |
| Primary (orange-red) | `#E85B1A` | CTAs, borders, active state |
| Accent (gold) | `#F5A921` | Labels, active nav, headings |
| Muted text | `#C8A884` | Secondary text |
| Border | `#4A2010` | Card/input borders |

## Analytics (Supabase)

Optional lightweight counts (opens, screen views, QR completions) go to table **`analytics_events`**.

1. In **Supabase → SQL Editor**, run the script in **`supabase/analytics_events.sql`** (creates table, index, RLS: **anon can INSERT only** — visitors cannot read rows; you see them in **Table Editor** or SQL as project owner).
2. Deploy the app with the same `VITE_SUPABASE_*` env vars as the rest of the app.

**Event types**

| `event_type` | Meaning |
|---|---|
| `app_session` | **Once per browser tab** until the tab closes (`sessionStorage`); **reload does not** add another |
| `page_load` | **Every** full load of the app (first open **and** reload); use `count(*)` for “total loads” |
| `screen_view` | Navigation; `metadata.screen` = `home` \| `map` \| `scavenger` \| `schedule` \| `signup` \| `info`; QR landings may include `via: "qr_hash"` |
| `qr_section_complete` | Section marked complete; `metadata.section` = `A`–`E`, `metadata.source` = `hash_link` \| `camera` |

**Example SQL**

```sql
select event_type, count(*) as n
from public.analytics_events
group by 1
order by n desc;

select metadata->>'source' as src, count(*) as n
from public.analytics_events
where event_type = 'qr_section_complete'
group by 1;
```

**Caveats:** Client-side events can be duplicated (reloads) or spoofed; they are **not** unique users unless you add auth or stricter tracking.

## Scavenger Hunt Codes (for QR generation)
Print/display these codes at the corresponding section:
- Section A → `SECTION-A`
- Section B → `SECTION-B`
- Section C → `SECTION-C`
- Section D → `SECTION-D`
- Section E → `SECTION-E`
