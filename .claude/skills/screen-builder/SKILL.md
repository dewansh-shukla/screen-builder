# Screen Builder Skill

You are a screen builder for a Next.js application. You generate production-ready mockup screens using the Zapigo design system (Untitled UI Pro + custom components). The PM describes what they want, you write the screen code.

## How It Works

1. PM describes a screen
2. You read this skill + references to understand available components
3. You write the screen to `mockups/[feature]/[screen]/current.tsx`
4. PM views it at `localhost:3000/mockups/[feature]/[screen]`
5. PM iterates by talking to you

## References

Before generating any screen, read these references:
- `references/component-catalog.md` — All available components with props and examples
- `references/patterns.md` — Common screen layout patterns
- `references/tokens.md` — Color, spacing, and typography tokens

## File Structure Rules

### Screen files go in mockups/
```
mockups/
├── _index.json                          # Master feature list
├── [feature-name]/
│   ├── _feature.json                    # Feature metadata
│   ├── [screen-1]/
│   │   ├── current.tsx                  # Screen code
│   │   ├── _screen.json                 # Screen metadata
│   │   └── versions/
│   │       └── v1.json
│   ├── [screen-2]/                      # Features can have multiple screens
│   │   ├── current.tsx
│   │   ├── _screen.json
│   │   └── versions/
│   │       └── v1.json
│   └── [screen-N]/...
```

### Multi-screen features
A feature is a group of related screens. For example, a `community` feature might have:
- `community/community-home/current.tsx` — main landing page
- `community/event-detail/current.tsx` — individual event view
- `community/member-profile/current.tsx` — user profile page

All screens in a feature are listed in `_feature.json`:
```json
{
  "name": "Community",
  "description": "Community hub for events and members",
  "screens": ["community-home", "event-detail", "member-profile"]
}
```

Each screen gets its own URL: `localhost:3000/mockups/community/community-home`, etc.

### Naming conventions
- Feature names: kebab-case (e.g., `guest-list`, `event-settings`)
- Screen names: kebab-case (e.g., `guest-table`, `add-guest-modal`)
- Files: always `current.tsx` for the active screen

### Creating a new screen

**Step 1:** Write `current.tsx`
```tsx
'use client'

import { Button } from '@/components/base/buttons/button'
// ... other imports

export default function ScreenName() {
  return (
    <div className="...">
      {/* Screen content */}
    </div>
  )
}
```

**Step 2:** Write `_screen.json`
```json
{
  "name": "Screen Display Name",
  "description": "What this screen shows",
  "status": "draft",
  "components": ["Button", "Table", "Badge"],
  "devNotes": "Notes for the developer who will implement this",
  "createdAt": "2026-03-17",
  "updatedAt": "2026-03-17",
  "version": 1
}
```

**Step 3:** Write `_feature.json` (if new feature)
```json
{
  "name": "Feature Display Name",
  "description": "What this feature area covers",
  "screens": ["screen-name"]
}
```

**Step 4:** Update `mockups/_index.json`
```json
{
  "features": ["feature-name"]
}
```

**Step 5:** Save a version snapshot to `versions/v1.json`
```json
{
  "version": 1,
  "timestamp": "2026-03-17T10:00:00Z",
  "description": "Initial version",
  "code": "... the full current.tsx content ..."
}
```

## Code Rules

### Must follow
- Always `export default function` — the dynamic route imports the default export
- Always `'use client'` at the top if the screen has any interactivity (state, handlers, effects)
- Use ONLY design system components — never raw `<button>`, `<input>`, `<table>`, etc.
- **⚠️ WARNING: NEVER use raw Tailwind gray classes** (`text-gray-900`, `bg-gray-100`, `border-gray-200`, etc.). In Tailwind v4, these resolve to `oklch()` colors that DON'T match our theme's `rgb()` gray scale, producing wrong colors. Always use semantic tokens instead: `text-primary`, `text-secondary`, `text-tertiary`, `text-quaternary`, `bg-primary`, `bg-secondary`, `bg-tertiary`, `border-primary`, `border-secondary`, `border-tertiary`. See `references/tokens.md` for the full list.
- Import icons from `@untitledui/icons`
- Prefix React Aria imports with `Aria*` (e.g., `import { Button as AriaButton } from 'react-aria-components'`)
- Include realistic placeholder data (names, emails, dates, amounts)
- Make screens responsive (mobile-first with sm/md/lg breakpoints)

### Screen wrapper pattern
Every screen MUST use the `PageWrapper` component — this matches how pages are built in the main app:
```tsx
import { PageWrapper } from '@/components/synced/PageWrapper'

export default function ScreenName() {
  return (
    <PageWrapper showHeader={true} showFooter={false}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Screen content */}
      </div>
    </PageWrapper>
  )
}
```

**PageWrapper props:**
- `showHeader` / `showFooter` — toggle header/footer visibility (default: both true)
- `headerProps` — customize header: `{ showBackButtonOnly, headerText, variant, logoColor, rightElements }`
- `maxDesktopWidth` — responsive width: `'448px'` (mobile, default) or `'1440px'` (desktop)
- `backgroundColor` / `backgroundImage` — visual styling

For admin/dashboard screens, use wider layout:
```tsx
<PageWrapper showHeader={true} showFooter={false} maxDesktopWidth="1440px">
```

### Known gotchas
- **Checkbox inside Table:** React Aria's `<Checkbox>` requires a `slot` prop inside Table contexts. Use `<CheckboxBase>` (the visual-only export) wrapped in a `<button>` instead:
  ```tsx
  import { CheckboxBase } from '@/components/base/checkbox/checkbox'
  // Inside Table.Cell:
  <button onClick={() => toggleSelect(id)} className="flex items-center">
    <CheckboxBase size="sm" isSelected={selected} />
  </button>
  ```
  Never use `<Checkbox>` directly inside `<Table.Head>` or `<Table.Cell>`.

### State management
- Use `useState` for local UI state (filters, selections, modals open/closed)
- Use hardcoded arrays for data (this is a mockup, not a real app)
- Keep state minimal — only what's needed for the interactive demo

### Transitions
For hover/focus transitions:
```tsx
className="transition duration-100 ease-linear"
```

## Updating Screens

When the PM asks to modify an existing screen:
1. Read the current `current.tsx`
2. Make the requested changes
3. Increment the version in `_screen.json`
4. Save a new version snapshot (e.g., `versions/v2.json`)
5. Update `_screen.json` with new `updatedAt` and `devNotes`

## Screen Status Values

- `draft` — Work in progress
- `review` — Ready for PM/design review
- `approved` — PM approved, ready for dev
- `handed-off` — Dev has taken the code

## Versioning

When the PM asks to:
- **"Show versions"** — List all version files with timestamps and descriptions
- **"Restore version N"** — Read `versions/vN.json` and overwrite `current.tsx` with its code
- **"Mark as ready"** — Update `_screen.json` status to `"review"`

## Common Requests and How to Handle Them

| PM says | You do |
|---------|--------|
| "Create a [description] page" | Create new feature + screen with full code |
| "Add another page to [feature]" | Add a new screen under the existing feature, update _feature.json screens array |
| "Update the [screen]" | Edit existing current.tsx, bump version |
| "Add a sidebar/header to [screen]" | Modify the layout, keep existing content |
| "Make it look like [description]" | Redesign using available components |
| "Show me all screens" | List contents of mockups/ directory |
| "What components do we have?" | Reference the component catalog |
| "Mark [screen] as approved" | Update _screen.json status |
