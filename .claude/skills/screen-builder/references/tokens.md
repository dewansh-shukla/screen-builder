# Design Tokens Reference

Semantic color and typography tokens. Always use these instead of raw Tailwind color values.

---

## Text Colors

| Class | Usage |
|-------|-------|
| `text-primary` | Page headings, primary text |
| `text-secondary` | Labels, section headings |
| `text-tertiary` | Supporting text, paragraphs, descriptions |
| `text-quaternary` | Subtle text, footer headings |
| `text-disabled` | Disabled text |
| `text-placeholder` | Input placeholders |
| `text-white` | Always white text |
| `text-brand-primary` | Brand headings |
| `text-brand-secondary` | Brand buttons, accented text |
| `text-brand-tertiary` | Brand highlights, metric numbers |
| `text-error-primary` | Error text |
| `text-warning-primary` | Warning text |
| `text-success-primary` | Success text |

### On-brand variants (for solid brand backgrounds)
| Class | Usage |
|-------|-------|
| `text-primary_on-brand` | Primary text on brand bg |
| `text-secondary_on-brand` | Secondary text on brand bg |
| `text-tertiary_on-brand` | Tertiary text on brand bg |

---

## Background Colors

| Class | Usage |
|-------|-------|
| `bg-primary` | Main page background (white) |
| `bg-primary_alt` | Alt primary (switches to secondary in dark) |
| `bg-primary_hover` | Hover state for white backgrounds |
| `bg-primary-solid` | Dark bg (tooltips, dark sections) |
| `bg-secondary` | Contrast sections, card backgrounds |
| `bg-secondary_alt` | Alt secondary (switches to primary in dark) |
| `bg-secondary_hover` | Hover for gray-50 backgrounds |
| `bg-secondary_subtle` | Subtle secondary (banners) |
| `bg-tertiary` | Higher contrast (toggles) |
| `bg-quaternary` | Sliders, progress bars |
| `bg-active` | Active/selected items |
| `bg-disabled` | Disabled buttons, toggles |
| `bg-disabled_subtle` | Disabled inputs, checkboxes |
| `bg-overlay` | Modal overlays |
| `bg-brand-primary` | Brand check icons |
| `bg-brand-secondary` | Brand featured icons |
| `bg-brand-solid` | Solid brand bg (toggles, messages) |
| `bg-brand-solid_hover` | Hover for solid brand |
| `bg-brand-section` | Brand website sections (CTA, testimonials) |
| `bg-brand-section_subtle` | Brand section contrast (FAQ) |
| `bg-error-primary` | Error buttons |
| `bg-error-secondary` | Error featured icons |
| `bg-error-solid` | Dark error bg |
| `bg-warning-primary` | Warning bg |
| `bg-warning-secondary` | Warning featured icons |
| `bg-success-primary` | Success bg |
| `bg-success-secondary` | Success featured icons |
| `bg-success-solid` | Dark success bg |

---

## Border Colors

Use with `border-`, `ring-`, or `outline-` prefix.

| Class | Usage |
|-------|-------|
| `border-primary` | Inputs, checkboxes, button groups |
| `border-secondary` | Cards, tables, dividers (most common) |
| `border-tertiary` | Subtle dividers, chart axes |
| `border-disabled` | Disabled inputs |
| `border-brand` | Active input borders |
| `border-error` | Error state inputs |

---

## Foreground Colors (Icons)

Use with `text-` for icon color.

| Class | Usage |
|-------|-------|
| `text-fg-primary` | Highest contrast icons |
| `text-fg-secondary` | High contrast icons |
| `text-fg-tertiary` | Medium contrast icons |
| `text-fg-quaternary` | Low contrast (input icons, help icons) |
| `text-fg-white` | Always white icons |
| `text-fg-disabled` | Disabled icons |
| `text-fg-brand-primary` | Brand icons, progress bars |
| `text-fg-brand-secondary` | Brand accents, arrows |
| `text-fg-error-primary` | Error icons |
| `text-fg-error-secondary` | Error input icons |
| `text-fg-warning-primary` | Warning icons |
| `text-fg-success-primary` | Success icons |
| `text-fg-success-secondary` | Status dots, positive metrics |

---

## Typography Scale

| Class | Size |
|-------|------|
| `text-xs` | 12px / 18px line-height |
| `text-sm` | 14px / 20px line-height |
| `text-md` | 16px / 24px line-height |
| `text-lg` | 18px / 28px line-height |
| `text-xl` | 20px / 30px line-height |
| `text-display-xs` | 24px / 32px line-height |
| `text-display-sm` | 30px / 38px line-height |
| `text-display-md` | 36px / 44px line-height |
| `text-display-lg` | 48px / 60px line-height |
| `text-display-xl` | 60px / 72px line-height |
| `text-display-2xl` | 72px / 90px line-height |

### Font weights
`font-regular` (400), `font-medium` (500), `font-semibold` (600), `font-bold` (700)

### Common typography patterns
```tsx
// Page heading
<h1 className="text-display-xs font-semibold text-primary">Page Title</h1>

// Section heading
<h2 className="text-lg font-semibold text-primary">Section Title</h2>

// Card heading
<h3 className="text-md font-semibold text-primary">Card Title</h3>

// Body text
<p className="text-sm text-tertiary">Description text goes here.</p>

// Label
<span className="text-sm font-medium text-secondary">Label</span>

// Small/meta text
<span className="text-xs text-tertiary">Updated 2 days ago</span>
```

---

## Spacing

Base unit: `4px` (Tailwind spacing scale).

| Token | Value | Common use |
|-------|-------|------------|
| `gap-1` / `p-1` | 4px | Tight spacing |
| `gap-2` / `p-2` | 8px | Icon gaps |
| `gap-3` / `p-3` | 12px | Button gaps |
| `gap-4` / `p-4` | 16px | Form field gaps, card padding |
| `gap-5` / `p-5` | 20px | Card padding |
| `gap-6` / `p-6` | 24px | Section gaps, card padding |
| `gap-8` / `p-8` | 32px | Large section gaps |

### Page container
```tsx
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
```

---

## Shadows

| Class | Usage |
|-------|-------|
| `shadow-xs` | Subtle elevation (inputs) |
| `shadow-sm` | Cards, dropdowns |
| `shadow-md` | Modals, floating panels |
| `shadow-lg` | Tooltips, popovers |
| `shadow-xl` | Large modals |

---

## Border Radius

| Class | Usage |
|-------|-------|
| `rounded-md` | Inputs, buttons (8px) |
| `rounded-lg` | Cards (12px) |
| `rounded-xl` | Large cards (16px) |
| `rounded-full` | Avatars, pills |

---

## Transitions

Default for micro-interactions:
```tsx
className="transition duration-100 ease-linear"
```

---

## Breakpoints

| Prefix | Min width |
|--------|-----------|
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px |
| `2xl:` | 1536px |
