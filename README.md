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

## Scavenger Hunt Codes (for QR generation)
Print/display these codes at the corresponding section:
- Section A → `SECTION-A`
- Section B → `SECTION-B`
- Section C → `SECTION-C`
- Section D → `SECTION-D`
- Section E → `SECTION-E`
