# Screen Builder

A Next.js app where a PM creates mockup screens using Claude Code. Claude generates real pages using the Zapigo design system (Untitled UI Pro). PM views screens live at `localhost:3000`.

## How it works

1. PM describes a screen in Claude Code
2. Claude reads the `screen-builder` skill (`.claude/skills/screen-builder/SKILL.md`) and its references
3. Claude writes the screen to `mockups/[feature]/[screen]/current.tsx`
4. PM opens `localhost:3000/mockups/[feature]/[screen]` to see it live
5. PM iterates; dev pulls `current.tsx` into the main app

## Commands

```bash
npm run dev    # Start Next.js dev server (localhost:3000)
npm run build  # Production build
```

## Project structure

```
screen-builder/
├── src/app/
│   ├── page.tsx                        # Home: lists all mockups
│   └── mockups/[...slug]/page.tsx      # Dynamic route: renders any mockup
├── src/components/                     # DS components (synced from main app)
│   ├── base/                           # Primitives (Button, Input, Select, etc.)
│   ├── application/                    # Composed (Table, Tabs, Modal, etc.)
│   └── foundations/                    # FeaturedIcon, ratings, etc.
├── mockups/                            # PM's screens live here
│   ├── _index.json
│   └── [feature]/[screen]/current.tsx
└── .claude/skills/screen-builder/      # Skill + reference files
    ├── SKILL.md                        # Full generation instructions
    └── references/
        ├── component-catalog.md        # All components, props, examples
        ├── patterns.md                 # Layout patterns
        └── tokens.md                   # Colors, typography, spacing
```

## Critical rules

### Import naming convention
All imports from `react-aria-components` MUST be prefixed with `Aria*`:
```typescript
import { Button as AriaButton } from "react-aria-components"; // correct
import { Button } from "react-aria-components"; // WRONG
```

### File naming
All files use **kebab-case**: `date-picker.tsx`, not `DatePicker.tsx`.

### Semantic colors only
Never use raw Tailwind colors. Always use semantic tokens:
```
text-primary, text-secondary, text-tertiary    (not text-gray-900)
bg-primary, bg-secondary, bg-brand-solid       (not bg-white, bg-blue-700)
border-primary, border-secondary, border-brand (not border-gray-300)
fg-primary, fg-quaternary, fg-brand-primary    (for icons)
```
Full token reference: `.claude/skills/screen-builder/references/tokens.md`

### CSS transitions
Default micro-interactions: `transition duration-100 ease-linear`

## Component quick reference

Full catalog with props and examples: `.claude/skills/screen-builder/references/component-catalog.md`

### Key imports
```typescript
// Base
import { Button } from '@/components/base/buttons/button'
import { Input, InputBase } from '@/components/base/input/input'
import { Select } from '@/components/base/select/select'
import { Checkbox } from '@/components/base/checkbox/checkbox'
import { Toggle } from '@/components/base/toggle/toggle'
import { Badge, BadgeWithDot, BadgeWithIcon } from '@/components/base/badges/badges'
import { Avatar } from '@/components/base/avatar/avatar'
import { AvatarLabelGroup } from '@/components/base/avatar/avatar-label-group'
import { Card, CardContent } from '@/components/base/card'
import { Dropdown } from '@/components/base/dropdown/dropdown'
import { TextArea } from '@/components/base/textarea/textarea'
import { RadioGroup, RadioButton } from '@/components/base/radio-buttons/radio-buttons'
import { TagGroup, TagList, Tag } from '@/components/base/tags/tags'

// Application
import { Table, TableCard } from '@/components/application/table/table'
import { Tabs } from '@/components/application/tabs/tabs'
import { DialogTrigger, ModalOverlay, Modal, Dialog } from '@/components/application/modals/modal'
import { Breadcrumbs } from '@/components/application/breadcrumbs/breadcrumbs'
import { PaginationPageDefault } from '@/components/application/pagination/pagination'
import EmptyState from '@/components/application/empty-state/empty-state'
import { DatePicker } from '@/components/application/date-picker/date-picker'
import { SlideoutMenu } from '@/components/application/slideout-menus/slideout-menu'
import { FileUpload } from '@/components/application/file-upload/file-upload-base'

// Foundations
import { FeaturedIcon } from '@/components/foundations/featured-icon/featured-icon'

// Icons (1,100+ available)
import { Plus, SearchSm, ChevronDown, Trash02 } from '@untitledui/icons'
```

### Component patterns
- **Sizes:** most support `"sm" | "md" | "lg"`
- **States:** `isDisabled`, `isLoading`, `isInvalid`, `isRequired`
- **Icons:** pass as FC ref `iconLeading={Plus}` or JSX `iconLeading={<Plus data-icon />}`
- **Compounds:** `Select.Item`, `Dropdown.Item`, `Tabs.List`, `Table.Row`, etc.
- **Links:** use `<Button href="..." color="link-color">` (no separate Link component)

### Icon usage
```typescript
import { Home01, Settings01 } from '@untitledui/icons'
<Button iconLeading={Home01}>Home</Button>       // as component ref
<Home01 className="size-5 text-fg-quaternary" />  // standalone
```

## Mockups data model

Each screen: `current.tsx`, `_screen.json` (metadata), `versions/v1.json` (snapshots)
Each feature: `_feature.json` (name, description, screen list)
Root: `_index.json` (feature list)

## Screen generation rules

- Use `export default function` — dynamic route imports the default export
- Use `'use client'` only when interactivity is needed
- Use DS components only — never raw `<button>`, `<input>`, `<table>`
- Include realistic placeholder data
- Make screens responsive (mobile-first)
- Update `_screen.json` after every generation

## Architecture details

- **React 19** with TypeScript
- **Tailwind CSS v4.1** for styling
- **React Aria Components** as accessibility foundation
- **Next.js App Router** with Turbopack
- Components follow compound component pattern
- `cx()` utility from `@/utils/cx` for class names
- `sortCx()` for organized style objects
- Theme in `src/styles/theme.css`, typography in `src/styles/typography.css`
- Providers: `src/providers/theme.tsx`, `src/providers/router-provider.tsx`
