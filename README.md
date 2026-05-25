# Base Viewer Unturned

3D base planner for the Unturned game. Everything runs client-side (browser GPU). Save/load via local JSON export/import — no backend, no database.

## Stack

- Next.js 15 (App Router) + React 19
- Strict TypeScript
- Tailwind v4
- three + @react-three/fiber + @react-three/drei
- Zustand (global state)
- lucide-react (icons)

## Features

- 5 base piece types: floor, triangle_floor (triangular prism), wall, doorway, window
- Attachments: standard_door, double_door, garage_door, garage_frame
- Multi-floor (PageUp/PageDown to navigate floors with dynamic Y)
- 4×4 grid snap + edge-snap (snap to the edges of existing pieces, triangles included)
- Green ghost preview while placing
- Select Mode (S): 3D marquee on the floor for batch selection
- Selection panel: change color, edit comment, move, copy, paste and delete in batch
- Undo (Ctrl+Z) with a 50-action history covering add/remove/move/paste
- Floating comment on every piece (visible without clicking)
- JSON export/import with a customizable file name
- Welcome modal on first visit explaining the project

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Useful scripts:

| Command | What it does |
|---|---|
| `npm run dev` | Dev server (Next.js) |
| `npm run build` | Production build |
| `npm run start` | Run the build in production |
| `npm run lint` | ESLint (Next 15 config) |
| `npm run typecheck` | `tsc --noEmit` |

## Structure

```
src/
├── app/                  Layout, page, globals.css
├── components/           React components (3D + UI)
├── store/                Zustand (useBaseStore)
├── utils/                JSON export/import
├── constants/            Dimensions, default colors, geometries
└── types/                ItemType, BuildItem, HistoryAction, etc
```

## Shortcuts

| Key | Action |
|---|---|
| `S` | Toggle Select Mode |
| `PageUp` / `PageDown` | Floor up / down |
| `Ctrl+Z` | Undo |
| `Delete` / `Backspace` | Delete selected pieces |
| `Esc` | Cancel tool / clear selection |
| `Shift+click` | Add/remove piece from selection |

## CI

GitHub Actions run on every push and PR to `main`:
- `npm run lint` (Next ESLint)
- `npm run typecheck` (strict TypeScript)
- `npm run build` (Next production build)

Workflow at [.github/workflows/ci.yml](.github/workflows/ci.yml).

## Deploy on Vercel

The free Hobby tier covers this app without any setup:

1. Go to [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
2. Click **Import** next to the `base-viewer-unturned` repo.
3. Vercel auto-detects Next.js — no configuration needed.
4. Click **Deploy**.

Every push to `main` triggers a production deploy. Every PR gets an automatic preview URL.

Environment variables: none (everything is client-side).
