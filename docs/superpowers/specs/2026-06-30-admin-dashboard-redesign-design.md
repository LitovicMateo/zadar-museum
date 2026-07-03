# Admin Dashboard UI Redesign — Design Spec

**Date:** 2026-06-30  
**Status:** Approved

## Context

The admin dashboard is the last major section that hasn't been brought in line with the editorial sports-card design language used across the rest of the app. It currently uses a mix of custom CSS module components (`Fieldset`, `FormFieldsWrapper`, `FormLabel.module.css` grid classes) and an ad-hoc mix of `text-slate-*` hardcoded colors. The goal is to bring it fully into the shadcn + Tailwind + brand-color system used everywhere else: Court Navy (`--court`) headers, Record Gold (`--record`) accents, DM Mono labels, Archivo display font.

Scope covers three areas: the sidebar navigation, the shared entity list pages, and all 10 entity forms.

---

## Brand Tokens (reference)

| Token | Value | Usage |
|---|---|---|
| `--court` | Navy ~#0E1B3A | Header banners, sidebar background |
| `--court-foreground` | White | Text on court backgrounds |
| `--record` | Gold ~#F0B429 | Active indicators, primary CTA |
| `--record-foreground` | Navy | Text on gold backgrounds |
| `--chalk` | ~#F6F7F9 | Page background |
| `--muted-foreground` | Gray | Secondary/label text |
| `--font-display` | Archivo | Page titles, headings |
| `--font-mono` | DM Mono | Labels, counts, badges |

All token values are available as Tailwind utilities: `bg-court`, `text-record`, `text-court-foreground`, `bg-record`, etc.

---

## Section 1: Sidebar & Navigation

### Visual Design

The `DashboardSidebar` receives a `bg-court border-r border-white/15` className, turning the entire sidebar Court Navy. All text and UI inside flips to white-spectrum values.

**Title area (`SidebarTitle`):**
- Icon square: `bg-record text-court` (gold square, navy letter) — inverted from current
- "Dashboard" text: white
- Subtitle/tagline: `white/50`
- Bottom border: `white/12`

**Section labels (`DashboardSidebar.module.css`):**
- `.sectionLabel`: `color: rgba(255,255,255,0.42)`, `font-family: var(--font-mono)`, uppercase, 0.65rem
- `.divider`: `background-color: rgba(255,255,255,0.12)`

**Nav rows:**
- `.row`: `color: rgba(255,255,255,0.78)`, flex layout with icon + label, no border-bottom
- `.row:hover`: `background-color: rgba(255,255,255,0.07)`
- `.rowActive`: `background-color: rgba(255,255,255,0.10)`, `border-left: 3px solid var(--record)`, `padding-left: calc(0.75rem - 3px)`, full white text
- `.rowActive svg`: `color: var(--record)` — icon turns gold when active

**Toggle button (`SidebarToggle`):**
- Text/icon: `rgba(255,255,255,0.55)`, hover: `rgba(255,255,255,0.95)` with `rgba(255,255,255,0.10)` background
- Focus ring: `rgba(255,255,255,0.25)`

**ClearCacheButton:** Rendered inside `DashboardSidebar`, override button styling with `border-white/25 text-white/70 hover:bg-white/10 hover:text-white`.

### Icons (Lucide)

Each nav item gets a Lucide icon. `DashboardNavItem` type gains an `icon: LucideIcon` field.

| Entity | Icon |
|---|---|
| Player | `UserRound` |
| Staff | `Users` |
| Referee | `Scale` |
| Team | `Shield` |
| Coach | `ClipboardList` |
| Game | `Trophy` |
| Venue | `MapPin` |
| Competition | `Award` |
| Player Stats | `BarChart2` |
| Team Stats | `PieChart` |

Icon is rendered at `size={15}` with `.rowIcon` class (`color: rgba(255,255,255,0.52)`). Active state overrides via CSS to `var(--record)`.

### Mobile Navigation

**Remove:** React-Select dropdown nav, `isMobile` state + resize listener, `useMemo` options/currentOption, `handleChange`.

**Add:** shadcn `Sheet` (side="left") containing `DashboardSidebar`. A `mobileOpen: boolean` state drives it.

**Mobile top bar** (visible below `md` breakpoint, `md:hidden`):
- Hamburger icon button (`Menu` from Lucide) opens the Sheet
- "Dashboard" text in Archivo bold, `text-court`

When a nav item is clicked inside the mobile Sheet, the Sheet closes via `onLinkClick={() => setMobileOpen(false)}` threaded through `DashboardSidebar` → `DashboardSidebarRow`.

**Note on SidebarWrapper inside Sheet:** `SidebarWrapper` has `position: sticky; height: 100vh`. These properties are irrelevant inside the fixed `SheetContent`. Solution: add `isEmbedded?: boolean` prop to `DashboardSidebar`. When true, skip `SidebarWrapper` and render the sidebar content in a plain `<div className="h-full flex flex-col overflow-y-auto">`.

### Modified Files (Section 1)

- `src/components/Sidebar/SidebarWrapper.tsx` — add `className` prop passthrough
- `src/components/Sidebar/DashboardSidebar.module.css` — full color retheme
- `src/components/Sidebar/DashboardSidebarRow.tsx` — add icon, `onLinkClick` prop
- `src/components/Sidebar/DashboardSidebar.tsx` — pass `bg-court` className, `isEmbedded` prop, thread `onLinkClick`
- `src/components/Sidebar/SidebarTitle.module.css` — invert colors for dark bg
- `src/components/Sidebar/SidebarToggle.module.css` — invert colors for dark bg
- `src/components/Dashboard/Dashboard.tsx` — add icons, Sheet mobile nav, remove React-Select nav
- `src/components/Dashboard/Dashboard.module.css` — remove `.mobileNav` class

---

## Section 2: Entity List Pages

### EntityListPage Header

Replace the current flex header div with a Court Navy banner that matches all other app pages:

```tsx
<div className="-mx-6 -mt-6 mb-4 px-6 py-4 bg-court flex items-center justify-between">
  <div>
    <h1 className="font-display text-xl font-bold text-white">{config.title}</h1>
    <span className="font-mono text-[11px] text-white/60 uppercase tracking-wider">
      {total} records
    </span>
  </div>
  <Button
    onClick={() => navigate(config.createPath)}
    className="bg-record text-record-foreground hover:bg-record/90 font-semibold text-sm"
  >
    + Create {config.title.replace(/s$/, '')}
  </Button>
</div>
```

The outer wrapper changes from `<div className="p-6 space-y-4">` to two layers: the banner sits outside padding, and `<div className="px-6 pb-6 space-y-4">` wraps the search/table/pagination below.

### Color Token Cleanup

Replace all `text-slate-*` and `bg-slate-*` hardcoded classes with design tokens throughout `EntityListPage.tsx` and all 10 `configs/*.tsx` files:

| Old class | Replacement |
|---|---|
| `text-slate-100` | `text-white` (in banner) |
| `text-slate-500` | `text-muted-foreground` |
| `text-slate-400` | `text-muted-foreground` |
| `text-slate-200` | `text-foreground font-semibold` |
| `bg-slate-700` | `bg-muted` |

### Modified Files (Section 2)

- `src/components/Dashboard/EntityListPage/EntityListPage.tsx`
- `src/components/Dashboard/configs/playerListConfig.tsx`
- `src/components/Dashboard/configs/staffListConfig.tsx`
- `src/components/Dashboard/configs/coachListConfig.tsx`
- `src/components/Dashboard/configs/refereeListConfig.tsx`
- `src/components/Dashboard/configs/teamListConfig.tsx`
- `src/components/Dashboard/configs/gameListConfig.tsx`
- `src/components/Dashboard/configs/venueListConfig.tsx`
- `src/components/Dashboard/configs/competitionListConfig.tsx`
- `src/components/Dashboard/configs/playerStatsListConfig.tsx`
- `src/components/Dashboard/configs/teamStatsListConfig.tsx`

---

## Section 3: Forms

### shadcn Install (prerequisite)

```bash
cd frontend && npx shadcn@latest add form
```

Adds `src/components/ui/form.tsx` and `src/components/ui/label.tsx`. After generation, fix the auto-generated import `from "@/lib/utils"` → `from "@/lib/Utils"` in both files (project-wide casing convention).

No other installs needed. `Card`, `Badge`, `Sheet`, `Table`, `AlertDialog`, `Input`, `Button`, `Select`, `Checkbox` are all already present.

### New Shared Primitives

**`src/components/forms/shared/FormCard.tsx`** — replaces `Fieldset`

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/Utils';

type FormCardProps = { label: string; children: React.ReactNode; className?: string };

const FormCard = ({ label, children, className }: FormCardProps) => (
  <Card className={cn('shadow-xs gap-0', className)}>
    <CardHeader className="px-5 py-3 border-b border-border">
      <CardTitle className="text-[11px] font-semibold font-mono uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </CardTitle>
    </CardHeader>
    <CardContent className="px-5 py-4 flex flex-col gap-3">
      {children}
    </CardContent>
  </Card>
);

export default FormCard;
```

**`src/components/forms/shared/FormGrid.tsx`** — replaces `statsGrid2/3/5` CSS classes

```tsx
import { cn } from '@/lib/Utils';

type FormGridProps = { cols?: 2 | 3 | 5; children: React.ReactNode; className?: string };

const colsMap = { 2: 'grid grid-cols-2 gap-2', 3: 'grid grid-cols-3 gap-2', 5: 'grid grid-cols-5 gap-2' };

const FormGrid = ({ cols = 2, children, className }: FormGridProps) => (
  <div className={cn(colsMap[cols], className)}>{children}</div>
);

export default FormGrid;
```

### Field Component Update Patterns

~50 field component files updated across five categories:

#### Category A — Labeled text / number / date inputs using `register()`
~29 files (FirstName, LastName, Height, DateOfBirth, Name, City, Country, etc.)

Replace `<label>` + `<span className={styles.label}>` with `FormField` → `FormItem` → `FormLabel` + `FormControl` + `FormMessage`.

> **Note on date inputs:** `FormField` uses `Controller` internally, which returns the raw RHF-stored value via `field.value`. For `<Input type="date">`, verify that the stored string format is preserved exactly as before (RHF stores what the `<input>` emits). If a date field pre-populates incorrectly in edit mode, add `value={field.value ?? ''}` explicitly.

```tsx
// Before
const { register } = useFormContext<T>();
return (
  <label>
    <span className={styles.label}>First Name: <span className={styles.required}>*</span></span>
    <Input type="text" {...register('first_name', { required: '...' })} />
  </label>
);

// After
const { control } = useFormContext<T>();
return (
  <FormField control={control} name="first_name" rules={{ required: '...' }}
    render={({ field }) => (
      <FormItem>
        <FormLabel>First Name <span className="text-destructive text-xs">*</span></FormLabel>
        <FormControl><Input type="text" placeholder="First Name" {...field} /></FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
```

`FormField` uses `Controller` under the hood — behavior is equivalent to `register()` for simple inputs. `FormMessage` auto-renders validation errors from RHF context.

#### Category B — Labeled `Controller` + React-Select fields
~28 files (PrimaryPosition, Nationality, Competition, Team, Stage, ForfeitedBy, etc.)

Outer `Controller` import removed; `FormField` handles it. Pattern:

```tsx
<FormField control={control} name="primary_position"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Primary Position</FormLabel>
      <FormControl>
        <Select
          options={positionOptions}
          value={positionOptions.find(o => o.value === field.value) || null}
          onChange={(selected) => field.onChange(selected?.value ?? null)}
          isClearable
          styles={selectStyle()}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

#### Category C — Grid numeric inputs (stats forms)
~16 files (Shooting, Defense, Passing, Rebounds, Score, Minutes, Points, etc.)

No labels — use bare `register()` inside `FormGrid`. Only remove the `FormLabel.module.css` import and the `styles.statsGrid*` class reference:

```tsx
// Before
<div className={styles.statsGrid2}>
  <Input {...register('fieldGoalsMade')} placeholder="FGM" />
  <Input {...register('fieldGoalsAttempted')} placeholder="FGA" />
</div>

// After
<FormGrid cols={2}>
  <Input {...register('fieldGoalsMade')} placeholder="FGM" />
  <Input {...register('fieldGoalsAttempted')} placeholder="FGA" />
</FormGrid>
```

#### Category D — Dynamic field arrays (`useFieldArray`)
~6 files (AlternateNames, WinningSeasons, Staffers, Gallery, GalleryPreview, etc.)

`useFieldArray` logic is unchanged. Section heading updated:

```tsx
// Before
<span className={styles.label}>Alternate Names:</span>

// After
<Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
  Alternate Names
</Label>
```

#### Category E — Checkbox fields
~5 files (ActivePlayer, NeutralVenue, Nulled, Forfeited, IsMainTeam)

Use `FormItem` with horizontal flex layout. Override `FormLabel`'s default `mb-1.5` to `mb-0`:

```tsx
<FormItem className="flex flex-row items-center gap-2">
  <FormControl>
    <Input type="checkbox" {...register('active_player')} className="w-4 h-4 cursor-pointer"
      onChange={() => setValue('active_player', !watch('active_player'))} />
  </FormControl>
  <FormLabel className="font-normal text-sm cursor-pointer mb-0">Active Player</FormLabel>
</FormItem>
```

### FormContent Files (10 files)

Replace `Fieldset` with `FormCard` in all 10 `*FormContent.tsx` files:

```tsx
// Before
import Fieldset from '@/components/UI/Fieldset';
<Fieldset label="Player Bio">...</Fieldset>

// After
import FormCard from '@/components/forms/shared/FormCard';
<FormCard label="Player Bio">...</FormCard>
```

Replace `<div className={styles.centerWrapper}>` with `<div className="flex justify-center pt-2">`.

Remove `import styles from '@/components/forms/shared/FormLabel.module.css'` from FormContent files where it was only used for `centerWrapper` or grid classes (those are now inline Tailwind / `FormGrid`).

**Special case — `PlayerStatsFormContent.tsx`:** Inline `statsGrid3` replaced with `<FormGrid cols={3}>`.

**Special case — `TeamStatsFormContent.tsx`:** Inline `<span className="text-sm text-gray-400">` helper text → `<p className="text-xs text-muted-foreground">`.

### React-Select Styles

One change in `src/constants/ReactSelectStyle.ts`:

```ts
// control() — change background from:
background: 'var(--background)'
// to:
background: 'var(--card)'
```

This matches the control's background to the `FormCard` (which uses `var(--card)`) rather than the page background. All other styles are already correct.

### Cleanup

After all FormContent files are migrated:
- `src/components/forms/shared/FormLabel.module.css` — verify no remaining references, then delete
- `src/components/UI/Fieldset.tsx` + `Fieldset.module.css` — verify no remaining references, then delete
- `src/components/UI/FormFieldsWrapper.tsx` + `.module.css` — can be deleted or left to deprecate

---

## Implementation Order

1. **Install shadcn `form`** — `npx shadcn@latest add form`, fix `@/lib/utils` → `@/lib/Utils` in both generated files
2. **Create `FormCard.tsx` + `FormGrid.tsx`** — new files, no dependencies
3. **`SidebarWrapper.tsx`** — add `className` prop passthrough
4. **Sidebar CSS files** — `DashboardSidebar.module.css`, `SidebarTitle.module.css`, `SidebarToggle.module.css`
5. **`DashboardSidebarRow.tsx`** — add `icon: LucideIcon`, `onLinkClick` props
6. **`DashboardSidebar.tsx`** — pass `bg-court` className, `isEmbedded` prop, thread `onLinkClick`
7. **`Dashboard.tsx`** — add icons to navItems, replace mobile React-Select with Sheet
8. **`EntityListPage.tsx` + 10 configs** — Court Navy header, color token cleanup
9. **~50 field components** — shadcn Form primitives (A/B/C/D/E categories)
10. **10 FormContent files** — `Fieldset` → `FormCard`
11. **`ReactSelectStyle.ts`** — background token tweak
12. **Cleanup** — delete `FormLabel.module.css`, `Fieldset.tsx`, `FormFieldsWrapper.tsx` after verification

---

## Verification

After implementation:

1. **Sidebar**: Visit `/dashboard` — confirm Court Navy background, Record Gold active state on current nav item, icons visible, toggle collapses/expands correctly
2. **Mobile**: Resize to <768px — confirm hamburger appears, Sheet slides in from left, tapping a nav item closes the Sheet and navigates
3. **List pages**: Visit `/dashboard/player/list`, `/dashboard/game/list` — confirm Court Navy header, Record Gold create button, table rows render correctly, delete dialog works
4. **Forms**: Visit `/dashboard/player/create` and `/dashboard/game/create` — confirm FormCard sections render, all inputs styled, React-Select dropdowns match palette, validation errors appear via `FormMessage`, submit works
5. **Stats forms**: Visit `/dashboard/player-stats/create` — confirm numeric grid inputs render in correct column layout via `FormGrid`
6. **Edit flow**: Click Edit on any list row — form pre-populates correctly (RHF + FormField compatibility with existing default values)
7. **TypeScript**: `npm run build` passes with no errors
