# Screen Builder — Implementation Plan v3

## What changed

The PM uses Claude Code directly in the terminal. No separate web UI, no API keys, no chat interface to build. Claude Code IS the interface. The Next.js app just serves the generated screens so the PM can see them live in the browser.

This cuts the scope by ~70%. No API routes, no iframe sandbox, no builder UI components.

---

## Architecture

```
PM opens terminal in screen-builder/ project
        │
        ▼
claude "Create a guest list page with search and filters"
        │
        ▼
Claude Code reads:
  .claude/skills/screen-builder/SKILL.md
  .claude/skills/screen-builder/references/component-catalog.md
  .claude/skills/screen-builder/references/patterns.md
  .claude/skills/screen-builder/references/tokens.md
        │
        ▼
Claude Code writes:
  mockups/guest-list/guest-table/current.tsx
  mockups/guest-list/guest-table/_screen.json
  mockups/guest-list/guest-table/versions/v1.json
        │
        ▼
PM opens browser → localhost:3000/mockups/guest-list/guest-table
        │
        ▼
Sees the actual screen rendered with real DS components (hot-reloads)
```

---

## Folder structure

```
screen-builder/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                            # Index: lists all mockups
│   │   └── mockups/
│   │       └── [...slug]/
│   │           └── page.tsx                    # Dynamic: renders any mockup
│   ├── components/
│   │   ├── base/                               # Synced from main app
│   │   ├── application/                        # Synced from main app
│   │   ├── foundations/                         # Synced from main app
│   │   └── shared/                             # Synced from main app
│   └── lib/
│       └── mockups.ts                          # Reads mockups/ dir for index
│
├── mockups/                                    # All PM work lives here
│   ├── _index.json
│   ├── guest-list/
│   │   ├── _feature.json
│   │   └── guest-table/
│   │       ├── _screen.json                    # Metadata + dev notes
│   │       ├── current.tsx                     # The screen code
│   │       └── versions/
│   │           └── v1.json
│
├── .claude/
│   ├── CLAUDE.md
│   └── skills/screen-builder/
│       ├── SKILL.md
│       └── references/
│           ├── component-catalog.md
│           ├── patterns.md
│           └── tokens.md
│
├── scripts/
│   ├── setup.sh
│   ├── sync.sh
│   └── generate-catalog.sh
│
└── setup.config.sh
```

---

## What to build (in order)

### Task 1: Project scaffolding + component sync (30 min)
- Run quick-start.sh
- Verify components synced from main app

### Task 2: Component catalog generation (30 min)
- Write generate-catalog.sh
- Scan base/, application/, foundations/
- Output component-catalog.md

### Task 3: Write the Claude Code skill (2-3 hours) — MOST IMPORTANT
- SKILL.md with full instructions for screen generation + file mgmt + versioning
- patterns.md with Zapigo-specific screen patterns
- tokens.md with theme reference

### Task 4: Dynamic mockup renderer (1 hour)
- src/app/mockups/[...slug]/page.tsx (catch-all route)
- Dynamically imports current.tsx from matching mockups/ path

### Task 5: Index page (1 hour)
- src/app/page.tsx listing all features/screens with links and status

### Task 6: CLAUDE.md project instructions (30 min)

### Task 7: Test end-to-end (1 hour)

Total: ~6-7 hours

---

## PM cheat sheet

```
STARTING WORK
  Terminal 1: cd screen-builder && npm run dev
  Terminal 2: cd screen-builder && claude

CREATING SCREENS
  "Create a [description] page for the [feature] feature"

EDITING
  "Update the guest list — add bulk actions"

VIEWING
  Open browser: localhost:3000 (click any screen)

VERSIONS
  "Show me versions of [screen]"
  "Restore version 2"

STATUS
  "Mark [screen] as ready for review"
```