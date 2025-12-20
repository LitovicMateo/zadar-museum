# Frontend Code Review — Proposed Changes

Repository area reviewed: `frontend/` (React + TypeScript + Vite)

Summary

- Overall the frontend is well-structured and uses modern patterns (Vite, TypeScript, Tailwind). The review below lists
  files / folders and concise, actionable proposed changes — grouped where files share concerns. These are proposals
  only; no code changed yet.

Files & proposed changes

- `frontend/.env.example`:
    - Ensure all required env vars (e.g., `VITE_API_ROOT`, `VITE_PUBLIC_URL`, auth cookie flags) are documented and
      example values are present.

- `frontend/package.json`:
    - Add/standardize scripts: `lint`, `format`, `type-check` (tsc --noEmit), `test` (vitest/jest), `analyze` (bundle
      analyzer).
    - Lock/add peer/dev dependency versions and remove unused packages.

- `frontend/Dockerfile`:
    - Use multi-stage build with a lightweight final image, set `NODE_ENV=production`, non-root user, and ensure build
      artifacts are minimal.

- `frontend/vite.config.ts`:
    - Ensure `VITE_API_ROOT` is used consistently and document base path behavior. Add build optimizations
      (esbuild/minify options) and enable dependency pre-bundling where beneficial.

- `frontend/tailwind.config.ts`:
    - Verify `content` paths cover all `src/**/*.{ts,tsx}` files. Add safelist for dynamic classes and confirm
      JIT/optimal config for production purge.

- `frontend/tsconfig.json` & `tsconfig.*`:
    - Enable stricter TypeScript options where feasible: `strict`, `noImplicitAny`, `noUncheckedIndexedAccess`. Keep
      `skipLibCheck` if third-party type issues occur.

- `frontend/src/main.tsx` / `frontend/src/App.tsx`:
    - Add a top-level `ErrorBoundary` (if not already present) and wrap lazy routes with `Suspense`.
    - Confirm providers order (auth -> router -> app) is correct and minimize work done at mount to improve TTI.

- `frontend/src/pages/*` and `frontend/src/components/*` (all UI components):
    - Add or tighten TypeScript interfaces for props (avoid `any`).
    - Memoize pure presentational components (`React.memo`) and expensive derived values (`useMemo`/`useCallback`) where
      appropriate.
    - Improve accessibility: ensure `alt` text for images, keyboard navigability for custom controls, proper use of
      `aria-*` attributes and semantic HTML.
    - Add unit/visual tests for complex components (forms, tables, pagination, filters).

- `frontend/src/hooks/*`:
    - Add explicit return types and avoid `any`.
    - Confirm `useEffect` dependency arrays are complete (satisfy `react-hooks/exhaustive-deps`).
    - Add unit tests for custom hooks (Vitest + React Testing Library / @testing-library/react-hooks).

- `frontend/src/services/*` (API clients):
    - Centralize fetch logic: single API client with exponential backoff/retry, consistent error-shaping, and a clear
      place to add caching.
    - Handle 401 refresh flow in one place; avoid duplicating token logic across services.

- `frontend/src/providers/auth-provider.tsx`:
    - Review token storage strategy: prefer Secure, HttpOnly cookies for production where possible (server-side), or
      secure local storage patterns. Implement refresh token flow and session expiry handling.
    - Ensure logout clears all auth state and sensitive storage.

- `frontend/src/utils/*`:
    - Add/verify TS types, remove dead code, and move generic helpers to a small, well-documented utilities module.

- `frontend/src/assets/`:
    - Optimize images (WebP/AVIF), add responsive `srcset`s and lazy-loading for offscreen images.

- `frontend/components.json`:
    - Confirm purpose (storybook/visual regression). If unused, archive or remove.

- `frontend/index.html` & `public/`:
    - Ensure meta tags (viewport, description, open graph), theme-color, favicon, and CSP headers (if applicable) are in
      place.

- `frontend/src/schemas/*` and form components:
    - Validate form schemas and add tests for validation rules (edge cases: empty values, boundary values).

- `frontend/src/services/*/` (endpoints specific files):
    - Add typed response shapes using generated types where possible (keep `types/generated` in sync with Strapi types).

- Testing & CI:
    - Add `vitest` (or Jest) with `@testing-library/react` for component tests. Add `type-check`, `lint`, `test`,
      `build` steps to CI (GitHub Actions).
    - Add basic E2E or integration tests for critical flows (login, navigating dashboards, key lists) if time allows.

- Performance & Observability:
    - Add bundle analysis step (`rollup-plugin-visualizer` or `webpack-bundle-analyzer` equivalent for Vite) and
      identify large deps.
    - Add Lighthouse checks or integrate `lighthouse-ci` into CI for baseline performance/accessibility metrics.

- Accessibility:
    - Integrate `axe-core` or `eslint-plugin-jsx-a11y` rules, add automated accessibility checks in PRs.

- Developer DX:
    - Add recommended VSCode settings in `.vscode` (optional) for consistent formatting and TypeScript behaviors.
    - Ensure `prettier` and `eslint` configs are aligned; add `lint-staged` + `husky` pre-commit hooks to run `format` +
      `type-check` + `lint`.

Notes / Prioritization suggestions

- High priority (should fix before major releases):
    - Auth storage and refresh flow (`auth-provider.tsx` & API client).
    - Centralize API error handling and retry logic (`services/`).
    - Add top-level ErrorBoundary and basic tests for auth and routing.

- Medium priority:
    - TypeScript strictness improvements and prop typings across components.
    - Accessibility fixes for interactive components and images.
    - Dockerfile and build optimizations.

- Low priority / Nice-to-have:
    - Storybook for key components and visual regression testing.
    - Lighthouse CI and bundle analysis additions.

Next steps

- Confirm which proposed changes you want implemented first (I can start with a single issue, e.g., central API client,
  or create PRs grouped by priority).

---

This review focused on `frontend/` per your request. If you'd like, I can now open PRs that implement the high-priority
items one-by-one.

Deep Dive — pages, services, components, hooks

I enumerated the project's pages, components, services, and hooks and ran a focused review by directory. Below are
detailed findings and per-file or per-folder proposed changes. The recommendations are conservative (no code changes
yet) and prioritize security, correctness, and maintainability.

1. Pages (frontend/src/pages)

- Files discovered (~60): e.g., `Home.tsx`, `Game.tsx`, `Games.tsx`, `Player.tsx`, `PlayerContent.tsx`, `Coach.tsx`,
  `CoachContent.tsx`, `TeamPage.tsx`, `TeamContent.tsx`, `Venue.tsx`, `VenueContent.tsx`, `LeaguesPage.tsx`,
  `RefereesPage.tsx`, `StaffsPage.tsx`, etc.

Findings & actions:

- Routing & data fetching: ensure pages use declarative data-loading (React Query / useEffect) with cancellation and
  loading/error states. Where pages call multiple queries, prefer parallel queries with aggregated loading state.
- Error handling: add per-page error boundaries or error UI components; avoid unhandled promise rejections from fetch
  logic.
- Accessibility & semantics: pages rendering lists/tables should use semantic markup, add captions/aria-labels for
  tables, and ensure pagination controls are keyboard-accessible.
- Performance: large tables/lists (boxscores, gamelogs, team-player lists) should use virtualization
  (react-window/react-virtual) or pagination. Avoid rendering full-season datasets in one render.
- Specific checks: `Game.tsx` / `GameContent.tsx` — ensure boxscore components are memoized and heavy calculations live
  in hooks with memoization.

2. Services (frontend/src/services)

- Files discovered (20): create/update endpoints across domains (players, teams, games, competitions, coaches, referees,
  staff, player-stats, team-stats, venue).

Findings & actions:

- Central API client: these service files appear scattered (createX/updateX). Propose introducing a central HTTP client
  (e.g., `src/services/apiClient.ts`) that handles base URL, headers, JSON parsing, retry/backoff, and auth token
  refresh. Replace duplicated fetch/axios calls with typed wrappers.
- Auth & 401 handling: implement single interceptor for 401 → attempt refresh once, then logout on failure. Avoid
  repeating refresh logic across each service file.
- Typing: annotate request and response payloads using `types/generated` where possible; add explicit return types
  (Promise<ResultType>) to all service functions.
- Error shaping: normalize errors to a consistent shape `{status, message, code, details}` so UI layers can react
  uniformly.

3. Components (frontend/src/components)

- Large set (~300 files). Major groups: `ui/` primitives, `forms/` (many domain forms), `team-page/`, `venue-page/`,
  `coach-stats`, `referee-stats`, `player-records`, `pagination`, `sidebar`, `header`, `dashboard-list`.

Findings & actions:

- UI primitives (`ui/*`): ensure consistent prop typings (size/variant enums), avoid `any`. Provide small stories or
  visual tests. Confirm keyboard and focus behaviors for `combobox`, `select`, `dialog`, `popover`, `sheet`, and
  `tooltip` components.
- Forms: form providers and content components should centralize validation schemas (zod/yup) and expose typed submit
  handlers. File names like `TeamFormProvider.tsx` and `PlayerFormProvider.tsx` imply context usage — ensure providers
  clean up subscriptions and don't leak state across instances.
- Tables and list components: `CoachStatsTable.tsx`, `TeamRecordsTable.tsx`, `PlayerRecordsTable.tsx` and many
  `use*Table.tsx` hooks — verify stable keys, memoized columns and cell renderers, and consider virtualization for long
  lists.
- Images: `image-preview` and `team-logo` — ensure `alt` text, `loading="lazy"`, and optimized formats. Add `srcset` for
  responsiveness where relevant.
- Performance: many presentational components should be `React.memo` (e.g., table rows, list items). For callbacks
  passed down, use `useCallback` or lift stable handlers to avoid re-renders.
- Accessibility: add `aria-*` attributes for custom controls, ensure form labels are associated with inputs, and ensure
  focus management in dialogs/sheets.
- Tests: add unit tests for complex components (filters, dialogs, file upload, pagination behavior) and snapshot tests
  for UI primitives.

4. Hooks (frontend/src/hooks)

- Files discovered (~93): app-level hooks like `use-mobile.ts`, table hooks (`usePlayerBoxscoreTable.tsx`,
  `useTeamStatsTable.tsx`), paging helpers (`usePagedSortedList.ts`), and many query hooks under `hooks/queries/*`
  (e.g., `useGameDetails.ts`, `usePlayers.ts`, `useTeamDetails.ts`, `useCoachDetails.ts`, etc.).

Findings & actions:

- React Query / data layer: query hooks should declare `staleTime`/`cacheTime` appropriately and handle error/retry
  policies. Use `select` to map server responses to UI shapes to reduce component logic.
- Hook purity & types: ensure every hook has an explicit return type and clearly documented return shape (data,
  isLoading, isError, refetch). Avoid returning large untyped objects.
- Effect dependencies: fix any incomplete dependency arrays (run `eslint-plugin-react-hooks` rules). For callbacks
  returned from hooks, keep stable references where consumers depend on identity.
- Testing: add unit tests for non-UI hooks and integration tests that mock service responses for query hooks.

Examples of high-impact files to address first

- `frontend/src/providers/auth-provider.tsx` (if present) — centralize secure auth token handling and session expiry
  flows.
- `frontend/src/components/routes/app-routes.tsx` — confirm route lazy-loading and use of ErrorBoundary / Suspense.
- `frontend/src/services/*` (`create*` / `update*`) — replace ad-hoc calls with typed central client.
- `frontend/src/components/*/table` and `use*Table.tsx` hooks — optimize rendering and add virtualization where needed.

Testing & CI recommendations (repeat / expand from top-level review)

- Add `vitest` + `@testing-library/react` and basic mocks for `src/services`.
- Add `type-check` and `lint` CI steps. Run `build` and a lightweight `lighthouse-ci` step for PRs on staging.

Accessibility & security checks

- Integrate `eslint-plugin-jsx-a11y` and `axe-core` checks for critical pages during CI.
- Avoid storing tokens in localStorage without Secure/HttpOnly cookie alternatives for production. Review any direct DOM
  insertion of external HTML (prevent XSS).

Prioritization (repeated briefly)

- Urgent: auth refresh & central API client, page error handling, top-level ErrorBoundary.
- Important: types/strictness across hooks and services; table performance; forms validation.
- Nice-to-have: Storybook, Lighthouse CI, bundle analysis.

Next steps / options

- Option A (fast win): Implement central `apiClient`, update services to use it, and add a 401 refresh flow in
  `auth-provider`.
- Option B (UX / correctness): Add ErrorBoundary, improve page-level loading/error UIs, and add a small test suite for
  critical pages.
- Option C (longer): Increase TypeScript strictness, add comprehensive tests and CI automation.

If you want, I'll now:

- implement Option A and open a PR (I can start with `apiClient.ts` + migrate 4-6 service files), or
- implement Option B (ErrorBoundary + update routing) — tell me which.

---

Updated: inventory completed and deep-review notes added. Tell me which next step you want implemented and I'll start
making the code changes in small PR-sized batches.

**Components — Per-file review (part 1)**

- `frontend/src/components/image-preview/no-image.tsx`: Add `alt` text, ensure fallback is accessible, add unit test.
- `frontend/src/components/global-search/result.tsx`: Add prop types, memoize result row, ensure keyboard selection
  support.
- `frontend/src/components/global-search/result-container.tsx`: Ensure focus management, aria-live region for updates.
- `frontend/src/components/image-preview/image-preview.tsx`: Optimize images, add `loading="lazy"`, ensure types for
  props and test coverage.
- `frontend/src/components/global-search/portal.tsx`: Validate portal lifecycle cleanup and types; ensure SSR-safe
  checks.
- `frontend/src/components/global-search/global-search.tsx`: Debounce input, ARIA combobox roles, keyboard navigation
  and test.
- `frontend/src/components/dasboard-list/dashboard-list-content.tsx`: Memoize list, add virtualization if large,
  explicit prop types.
- `frontend/src/components/dasboard-list/dashboard-list.tsx`: Add keys, semantic list markup, tests for empty state.
- `frontend/src/components/header/MobileMenuPanel.tsx`: Keyboard focus trap for mobile panel, accessible close button,
  types.
- `frontend/src/components/dasboard-list/dashboard-list-wrapper.tsx`: Ensure wrapper passes stable callbacks, add prop
  types.
- `frontend/src/components/header/MobileInlineSearch.tsx`: Accessibility (label), debounce, test keyboard flows.
- `frontend/src/components/dasboard-list/dashboard-list-item.tsx`: Use `React.memo`, ensure unique `key`, add prop
  types.
- `frontend/src/components/header/header.tsx`: Minimize mount work, lazy-load heavy subcomponents, add a11y checks.
- `frontend/src/components/pagination/PaginationControls.tsx`: Verify keyboard support, aria-labels, unit tests for
  boundary pages.
- `frontend/src/components/sidebar/sidebar-item.tsx`: Ensure semantic nav structure, prop typing, memoize.
- `frontend/src/components/sidebar/sidebar-list.tsx`: Use `ul`/`li`, ensure correct roles for groups.
- `frontend/src/components/ui/calendar.tsx`: Add aria attributes and keyboard nav, validate timezones handling.
- `frontend/src/components/sidebar/sidebar-title.tsx`: Ensure heading semantics and types.
- `frontend/src/components/sidebar/sidebar-toggle.tsx`: Ensure accessible toggle (aria-pressed), keyboard support.
- `frontend/src/components/ui/combobox.tsx`: Confirm WAI-ARIA combobox pattern, handle keyboard selection and focus.
- `frontend/src/components/ui/date-picker.tsx`: Add accessible labels, keyboard navigation, timezone-aware parsing.
- `frontend/src/components/refresh-data-button/refresh-data-button.tsx`: Confirm throttling/debounce, visual feedback
  for loading, types.
- `frontend/src/components/routes/app-routes.tsx`: Use `Suspense` + `ErrorBoundary`, lazy-load routes, protect routes
  with `ProtectedRoute` where needed.
- `frontend/src/components/sidebar/sidebar.tsx`: Ensure role `navigation`, focus order, mobile collapse behavior tests.
- `frontend/src/components/ui/command.tsx`: Add keyboard shortcuts handling with cleanup, type props.
- `frontend/src/components/sidebar/sidebar-wrapper.tsx`: Ensure responsive behavior and proper DOM ordering for
  accessibility.
- `frontend/src/components/ui/button.tsx`: Standardize size/variant props, add explicit prop types and focus-visible
  styles.
- `frontend/src/components/sidebar/sidebar-group.tsx`: Use semantic grouping and headings, types.
- `frontend/src/components/routes/stats-routes.tsx`: Lazy-load large stats routes, add Suspense boundaries.
- `frontend/src/components/team-page/team-games/team-games.tsx`: Memoize rows, virtualization for long lists, types.

- `frontend/src/components/ui/error.tsx`: Standardize error shape and display, ensure localization-ready strings.
- `frontend/src/components/routes/dashboard-routes.tsx`: Ensure route splits and access control checks are centralized.
- `frontend/src/components/ui/dialog.tsx`: Focus trap, aria-modal, close-on-escape behavior tests.
- `frontend/src/components/sidebar/sidebar-content.tsx`: Semantic layout and skip-links for navigation.
- `frontend/src/components/ui/form-fields-wrapper.tsx`: Ensure labels/for associations and error-message linking
  (`aria-describedby`).
- `frontend/src/components/ui/input.tsx`: Standardize controlled/uncontrolled usage, add input validation helpers and
  types.
- `frontend/src/components/ui/heading.tsx`: Ensure heading hierarchy is preserved across pages.
- `frontend/src/components/ui/form-wrapper.tsx`: Validate submit handling, loading states, ARIA attributes for forms.
- `frontend/src/components/ui/fieldset.tsx`: Ensure `legend` usage, grouping and accessible descriptions.
- `frontend/src/components/team-page/team-games/team-season-stats.tsx`: Offload heavy calculations to hooks, memoize.
- `frontend/src/components/ui/navigation-menu.tsx`: Keyboard nav, aria roles, ensure focus styles.
- `frontend/src/components/ui/separator.tsx`: Decorative role if appropriate; ensure semantic markup.
- `frontend/src/components/ui/sheet.tsx`: Mobile sheet accessibility (focus trap, escape), animation performance.
- `frontend/src/components/ui/select.tsx`: Accessible select semantics, aria attributes, server-side fallbacks.
- `frontend/src/components/staff-page/staff-league-stats/staff-league-stats.tsx`: Memoize tables, type props.
- `frontend/src/components/venue-page/venue-gamelog/filter.tsx`: Ensure filter controls are labeled and
  keyboard-accessible.
- `frontend/src/components/ui/popover.tsx`: Focus management and hover vs click behavior clarity.
- `frontend/src/components/ui/page-content-wrapper.tsx`: Skip-link support and max-width/content containment.
- `frontend/src/components/venue-page/venue-header/venue-header.tsx`: Optimize images, types, ensure semantics for
  metadata.
- `frontend/src/components/referee-stats/table/RefereeStatsTable.tsx`: Memoize rows, stable keys, tests for
  sorting/pagination.
- `frontend/src/components/ui/table-cell.tsx`: Ensure correct semantics for table cells and colspan handling.
- `frontend/src/components/venue-page/venue-gamelog/venue-gamelog.tsx`: Paginate or virtualize, types, loading/error
  states.
- `frontend/src/components/ui/submit-button.tsx`: Disabled states, accessible labels, form association.
- `frontend/src/components/venue-page/venue-gamelog/useVenueSeasonStatsTable.tsx`: Memoize selectors, explicit return
  types, caching strategy.
- `frontend/src/components/venue-page/venue-gamelog/season-stats.tsx`: Offload transforms to hooks and add tests.
- `frontend/src/components/team-stats/filter/TeamStatsFilter.tsx`: Accessible labels, controlled inputs, prop typing.
- `frontend/src/components/ui/skeleton.tsx`: Ensure placeholders are non-interactive and inert for screen readers.
- `frontend/src/components/team-stats/table/TeamStatsTable.tsx`: Stable row keys, memoize columns,
  pagination/virtualization.
- `frontend/src/components/ui/table-wrapper.tsx`: Add table captions and responsive role handling.
- `frontend/src/components/referee-stats/table/useRefereeStatsTable.tsx`: Ensure hook returns typed data and stable
  memoized functions.
- `frontend/src/components/ui/constants/button-variants.ts`: Provide type-safe variants (union types) and document
  usage.
- `frontend/src/components/ui/constants/navigation-style.ts`: Consolidate into theme tokens if repeated.
- `frontend/src/components/ui/tabs.tsx`: Keyboard arrow navigation, aria-selected handling.
- `frontend/src/components/team-stats/table/useTeamStatsTable.tsx`: Memoize compute heavy selectors and expose typed
  API.
- `frontend/src/components/referee-stats/filter/LeagueFilter.tsx`: Accessible select and controlled value handling.
- `frontend/src/components/venue-page/venue-all-time/venue-all-time.tsx`: Break into smaller components, add tests.
- `frontend/src/components/referee-stats/filter/LocationFilter.tsx`: ARIA labels and debounce search if present.
- `frontend/src/components/ui/upload-button-wrapper.tsx`: File size/type validation, accessible file input labeling.
- `frontend/src/components/ui/tooltip.tsx`: Ensure tooltips are accessible (not only hover), provide aria-describedby
  targets.
- `frontend/src/components/team-records/useTeamRecordsTable.tsx`: Add typed returns and memoize heavy calculations.
- `frontend/src/components/team-records/TeamRecordsTable.tsx`: Stable keys and virtualization for long datasets.
- `frontend/src/components/venue-page/venue-all-time/venue-stat-row.tsx`: `React.memo` row component, ensure numbers
  formatted and localized.
- `frontend/src/components/referee-stats/filter/RefereeStatsFilter.tsx`: Group filters with fieldset/legend and keyboard
  accessibility.
- `frontend/src/components/venue-page/venue-all-time/venue-stats.tsx`: Ensure consistent number formatting and tests.
- `frontend/src/components/referee-stats/filter/SeasonFilter.tsx`: Accessible select and default option behavior.
- `frontend/src/components/venue-page/season-data/player-league-stats.tsx`: Memoize and type props, add loading state.
- `frontend/src/components/venue-page/season-data/season-data.tsx`: Validate inputs and split into smaller hooks.
- `frontend/src/components/team-page/team-header/team-header.tsx`: Ensure semantic heading, optimize images and memoize.
- `frontend/src/components/venue-page/season-data/usePlayerSeasonLeagueStatsTable.tsx`: Explicit return types, caching,
  tests.

- `frontend/src/components/team-page/league-stats/TeamLeagueStats.tsx`: Stable keys and defensive checks for missing
  data.
- `frontend/src/components/staff-page/staff-header/staff-header.tsx`: Ensure avatar alt text and accessible metadata.
- `frontend/src/components/team-page/league-stats/database-select.tsx`: Accessible select, debounce, and types.
- `frontend/src/components/protected-route/protected-route.tsx`: Confirm auth redirect logic and tests for
  unauthenticated flows.
- `frontend/src/components/team-page/all-time-stats/useTeamAllTimeStatsTable.tsx`: Verify memoization and performance
  for large datasets.
- `frontend/src/components/team-page/team-leaders/radio-buttons.tsx`: Accessible radio group semantics and keyboard nav.
- `frontend/src/components/team-page/team-leaders/options.ts`: Export typed option shape and reuse across components.
- `frontend/src/components/player-records/PlayerRecordsTable.tsx`: Stable keys, pagination, add unit tests.
- `frontend/src/components/team-page/team-leaders/team-leaders.tsx`: Ensure filters don't recreate handlers each render.
- `frontend/src/components/no-content/no-content.tsx`: Provide semantic empty-state messaging for screen readers.
- `frontend/src/components/team-page/team-header/team-bio/team-bio.tsx`: Ensure heading levels and accessible
  descriptions.
- `frontend/src/components/player-records/usePlayerRecordsTable.tsx`: Typed API, memoize selectors and derived values.
- `frontend/src/components/team-page/team-header/team-logo/team-logo.tsx`: Optimize logos (srcset, lazy), ensure alt
  attribute.
- `frontend/src/components/mobile-filters/MobileFilters.tsx`: Focus management, accessible show/hide, tests.
- `frontend/src/components/team-page/team-leaders/leaders-table.tsx`: Virtualize rows if long, memoize columns.
- `frontend/src/components/team-page/all-time-stats/TeamAllTimeStats.tsx`: Split presentation and data logic, add tests.
- `frontend/src/components/team-page/team-leaders/filters.tsx`: Ensure filter controls are labeled and
  keyboard-accessible.
- `frontend/src/components/team-page/team-leaders/competition-select.tsx`: Accessible select with clear default
  behavior.
- `frontend/src/components/staff-page/staff-gamelog/staff-gamelog.tsx`: Ensure stable keys and performance for large
  gamelogs.
- `frontend/src/components/team-page/team-leaders/category-select.tsx`: Type-safe option lists and accessibility.
- `frontend/src/components/player-stats/table/PlayerStatsTable.tsx`: Stable row keys, memoize and test
  sorting/aggregation.
- `frontend/src/components/referee-page/referee-all-time/referee-all-time.tsx`: Pagination and memoization checks.
- `frontend/src/components/player-page/all-time-stats/all-time-stats.tsx`: Break heavy logic into hooks, add tests.
- `frontend/src/components/player-stats/table/usePlayerStatsTable.tsx`: Typed returns, memoize expensive calculations.
- `frontend/src/components/player-stats/filter/DatabaseFilter.tsx`: Debounce queries, accessible labels.
- `frontend/src/components/referee-page/referee-gamelog/useRefereeStatsTable.tsx`: Memoization and typed returns.
- `frontend/src/components/player-page/career-high/career-high.tsx`: Ensure stable keys and a11y for data rows.
- `frontend/src/components/player-page/menu/menu.tsx`: Keyboard navigation and focus management.
- `frontend/src/components/player-page/career-high/career-high-row.tsx`: `React.memo`, prop types, number formatting.
- `frontend/src/components/referee-page/referee-all-time/useRefereeStatsTable.tsx`: Typed returns and caching
  strategies.
- `frontend/src/components/player-stats/filter/LeagueFilter.tsx`: Accessible selects and test for filtering logic.
- `frontend/src/components/referee-page/referee-gamelog/referee-season-stats.tsx`: Memoize transforms and add tests.
- `frontend/src/components/referee-page/referee-header/referee-header.tsx`: Ensure alt text for images and proper
  metadata semantics.
- `frontend/src/components/referee-page/referee-gamelog/referee-gamelog.tsx`: Pagination, loading state and
  virtualization.
- `frontend/src/components/referee-page/referee-gamelog/referee-filter.tsx`: Accessible filter controls and typed
  callbacks.
- `frontend/src/components/player-stats/filter/LocationFilter.tsx`: Accessible and debounced input.
- `frontend/src/components/player-stats/filter/PlayerStatsFilter.tsx`: Group filters, add aria labels.
- `frontend/src/components/player-stats/filter/SeasonFilter.tsx`: Default handling and accessible labels.
- `frontend/src/components/player-stats/filter/StatsFilter.tsx`: Keyboard-friendly filter toggles and tests.
- `frontend/src/components/player-page/all-time-league-stats/all-time-league-stats.tsx`: Split into small components,
  memoize.
- `frontend/src/components/player-page/all-time-stats/stat-box/stat-box.tsx`: Accessible labeling and aria-live updates
  if values change.
- `frontend/src/components/country-select/country-select.tsx`: Ensure country list performance, keyboard nav, optgroups
  if needed.
- `frontend/src/components/games-page/games-list/games-item.tsx`: `React.memo`, stable keys, a11y for action buttons.
- `frontend/src/components/games-page/games-list/games-list.tsx`: Virtualize long lists and add loading placeholder
  states.
- `frontend/src/components/league-page/league-header/league-header.tsx`: Metadata, type props, and image optimization.
- `frontend/src/components/league-page/schedule/schedule.tsx`: Accessible time formatting and semantic table/list usage.
- `frontend/src/components/league-page/league-season/team-league-stats.tsx`: Memoize and type props, add tests.
- `frontend/src/components/player-page/player-header/player-bio/player-bio.tsx`: Ensure biographical data is labelled
  and accessible.

- `frontend/src/components/league-page/player-rankings/player-rankings.tsx`: Stable keys, sorting tests, and pagination.
- `frontend/src/components/league-page/league-season/useTeamLeagueStatsTable.tsx`: Typed returns and memoized selectors.
- `frontend/src/components/games-page/games-filter/competition-list.tsx`: Ensure list role and keyboard navigation.
- `frontend/src/components/league-page/player-rankings/league-leader-list.tsx`: `React.memo`, test for empty state.
- `frontend/src/components/game-page/game-header/game-info.tsx`: Ensure timezones and venue metadata are accessible.
- `frontend/src/components/forms/team-stats/TeamStatsForm.tsx`: Centralize validation schema and typed submit handlers.
- `frontend/src/components/games-page/games-filter/season-select.tsx`: Accessible select, default option handling.
- `frontend/src/components/forms/referee/RefereeForm.tsx`: Validation, typed form values, and tests for invalid input.
- `frontend/src/components/forms/staff/StaffForm.tsx`: Ensure role selection is accessible and validated.
- `frontend/src/components/forms/team/TeamForm.tsx`: Image upload validation and typed values.
- `frontend/src/components/forms/team-stats/Form/TeamStatsFormContent.tsx`: Extract business logic into hooks; ensure
  ARIA live regions for validation.
- `frontend/src/components/forms/staff/Fields/FirstName.tsx`: Input label association and required field handling.
- `frontend/src/components/forms/team-stats/Form/TeamStatsFormProvider.tsx`: Provider cleanup and typed context value.
- `frontend/src/components/coach-page/coach-league-stats/useCoachLeagueStatsTable.tsx`: Memoize selectors and test large
  datasets.
- `frontend/src/components/coach-page/coach-league-stats/location-filter.tsx`: Debounce and accessibility for location
  input.
- `frontend/src/components/coach-page/coach-league-stats/coach-role-filter.tsx`: Radio group semantics and keyboard
  navigation.
- `frontend/src/components/game-page/game-stats/game-stats.tsx`: Offload aggregates to hooks and memoize.
- `frontend/src/components/coach-page/coach-league-stats/coach-league-stats.tsx`: Stable keys and loading placeholders.
- `frontend/src/components/forms/staff/Fields/Role.tsx`: Ensure role options are accessible and typed.
- `frontend/src/components/forms/referee/Form/RefereeFormProvider.tsx`: Validate context typing and unmount cleanup.
- `frontend/src/components/forms/staff/Fields/LastName.tsx`: Label and validation.
- `frontend/src/components/forms/referee/Form/RefereeFormContent.tsx`: Centralize validation and show accessible error
  messages.
- `frontend/src/components/forms/venue/VenueForm.tsx`: Venue geolocation validation and typed submit.
- `frontend/src/components/player-page/player-boxscore/season-average/season-average.tsx`: Memoize computations and test
  numeric formatting.
- `frontend/src/components/forms/team/Fields/Country.tsx`: Ensure country select accessibility and typed option list.
- `frontend/src/components/forms/team/Fields/City.tsx`: Validation and label association.
- `frontend/src/components/forms/team/Fields/AlternateNames.tsx`: Ensure array inputs are keyboard-accessible.
- `frontend/src/components/forms/team/Form/TeamFormProvider.tsx`: Context typing and provider cleanup on unmount.
- `frontend/src/components/forms/team/Form/TeamFormContent.tsx`: Move heavy transforms to hooks and validate submit
  flow.
- `frontend/src/components/games-page/games-filter/search-bar.tsx`: Debounce, accessible label, and clear button.
- `frontend/src/components/forms/referee/Fields/LastName.tsx`: Label and validation.
- `frontend/src/components/forms/referee/Fields/Nationality.tsx`: Ensure country options are typed and accessible.
- `frontend/src/components/forms/player-stats/PlayerStatsForm.tsx`: Typed form state and validation schema.
- `frontend/src/components/forms/team/Fields/ShortName.tsx`: Enforce maxlength and validation rules.
- `frontend/src/components/forms/team/Fields/Name.tsx`: Required field validation and a11y.
- `frontend/src/components/forms/player-stats/Form/PlayerStatsFormProvider.tsx`: Provider typing and cleanup.
- `frontend/src/components/forms/player-stats/Filter/PlayerFilter.tsx`: Filter semantics and performance for large
  lists.
- `frontend/src/components/forms/player-stats/Form/PlayerStatsFormContent.tsx`: Move heavy mapping into hooks, typed
  submit handler.
- `frontend/src/components/forms/referee/Fields/FirstName.tsx`: Label and validation.
- `frontend/src/components/forms/team/Fields/Logo.tsx`: File input accessibility and size/type checks.
- `frontend/src/components/game-page/game-header/game-header.tsx`: Timezone display and aria descriptions for scores.
- `frontend/src/components/games-page/games-filter/right-controls.tsx`: Ensure controls are keyboard-accessible and
  touch-friendly.
- `frontend/src/components/league-page/player-rankings/ranking-options.ts`: Typed option interface and defaults.
- `frontend/src/components/games-page/games-filter/games-filter.tsx`: Combine controlled inputs into a single reducer to
  avoid prop drilling and unnecessary re-renders.
- `frontend/src/components/games-page/games-filter/competition-select.tsx`: Async options loading should show loading
  state and be ARIA friendly.
- `frontend/src/components/forms/team-stats/Filter/GameFilter.tsx`: Ensure clear button and accessible labels.

- `frontend/src/components/forms/player-stats/Fields/Captain.tsx`: Toggle semantics and aria-pressed handling.
- `frontend/src/components/forms/player-stats/Fields/Competition.tsx`: Select accessibility and typed options.
- `frontend/src/components/forms/venue/Fields/Name.tsx`: Required validation and label.
- `frontend/src/components/forms/venue/Fields/Country.tsx`: Country select performance and a11y.
- `frontend/src/components/forms/venue/Fields/City.tsx`: Label and validation.
- `frontend/src/components/forms/team-stats/Filter/TeamFilter.tsx`: Ensure options memoized and accessible.
- `frontend/src/components/forms/player-stats/Fields/Game.tsx`: Ensure game selector handles missing data gracefully.
- `frontend/src/components/forms/player-stats/Fields/Minutes.tsx`: Numeric input constraints and accessible labels.
- `frontend/src/components/forms/venue/Form/VenueFormProvider.tsx`: Provider typing and validation flow.
- `frontend/src/components/forms/player-stats/Fields/Defense.tsx`: Input validation and typing.
- `frontend/src/components/forms/player-stats/Fields/Passing.tsx`: Numeric formatting and validation.
- `frontend/src/components/forms/player-stats/Fields/Player.tsx`: Player selector performance and aria labeling.
- `frontend/src/components/forms/player-stats/Fields/Number.tsx`: Input type=number handling and validation.
- `frontend/src/components/forms/player-stats/Fields/Misc.tsx`: Document purpose and types for misc fields.
- `frontend/src/components/forms/team-stats/Fields/Score.tsx`: Numeric validation and edge-case handling (OT, forfeits).
- `frontend/src/components/coach-page/coach-all-time-stats/useCoachAllTimeStatsTable.tsx`: Memoize and add typed return
  values and caching.
- `frontend/src/components/forms/competition/CompetitionForm.tsx`: Centralize validation and typed values.
- `frontend/src/components/coach-page/coach-gamelog/coach-season-stats.tsx`: Memoize and tests for season aggregation.
- `frontend/src/components/game-page/game-gallery/game-gallery.tsx`: Lazy-load images and optimize formats; add aria
  labels for gallery controls.
- `frontend/src/components/coach-page/coach-gamelog/coach-gamelog.tsx`: Pagination/virtualize for long lists and a11y.
- `frontend/src/components/game-page/game-gallery/game-gallery.css`: Confirm CSS is scoped and doesn't conflict with
  Tailwind.
- `frontend/src/components/forms/game/GameForm.tsx`: Validate fields and centralize submission logic into hooks.
- `frontend/src/components/forms/player/PlayerForm.tsx`: Ensure date fields use consistent parsing and validation.
- `frontend/src/components/coach-page/coach-all-time-stats/radio-buttons.tsx`: Keyboard nav and aria-checked semantics.
- `frontend/src/components/coach-page/coach-gamelog/filters.tsx`: Group filters accessibly and memoize option lists.
- `frontend/src/components/coach-page/coach-header/coach-header.tsx`: Avatar alt text and heading semantics.
- `frontend/src/components/coach-page/coach-all-time-stats/coach-all-time-stats.tsx`: Large dataset performance and
  tests.
- `frontend/src/components/forms/team-stats/Fields/Team.tsx`: Team selector a11y and typed options.
- `frontend/src/components/forms/team-stats/Fields/Shooting.tsx`: Numeric inputs validation and formatting.
- `frontend/src/components/game-page/boxscore/team-stats.tsx`: Memoize cell renderers and avoid expensive recompute each
  render.
- `frontend/src/components/forms/game/Fields/NeutralVenue.tsx`: Checkbox semantics and label pairing.
- `frontend/src/components/forms/game/Fields/Nulled.tsx`: Clear status semantics and tests.
- `frontend/src/components/forms/game/Fields/Round.tsx`: Input validation and aria labeling.
- `frontend/src/components/player-page/all-time-league-stats/main-table/main-table.tsx`: Virtualize body for large rows
  and memoize columns.
- `frontend/src/components/league-page/all-time/league-all-time.tsx`: Pagination and memoization.
- `frontend/src/components/player-page/player-header/player-number/player-number.tsx`: Ensure number formatting and
  aria-labels for jersey number.
- `frontend/src/components/forms/game/Fields/MainReferee.tsx`: Referee selector accessibility and fallback when not
  present.
- `frontend/src/components/player-page/all-time-league-stats/table-footer/table-footer.tsx`: Pagination controls
  accessibility and tests.
- `frontend/src/components/coach-stats/filter/SeasonFilter.tsx`: Default options and aria labeling.
- `frontend/src/components/coach-stats/filter/RoleFilter.tsx`: Radio group a11y and typed options.
- `frontend/src/components/forms/game/Fields/HomeTeamName.tsx`: Input validation and a11y.
- `frontend/src/components/coach-stats/table/useCoachStatsTable.tsx`: Memoize columns and return typed results.
- `frontend/src/components/coach-stats/table/CoachStatsTable.tsx`: Stable keys, virtualization for large outputs.
- `frontend/src/components/forms/coach/Fields/ProfileImagePreview.tsx`: Image alt text and lazy-loading.
- `frontend/src/components/forms/game/Fields/Season.tsx`: Season selector defaults and validation.
- `frontend/src/components/forms/game/Fields/Gallery.tsx`: File upload validation and accessible captions.
- `frontend/src/components/game-page/boxscore/boxscore.tsx`: Ensure heavy math happens in hooks, memoize.

**All components checklist (1/4)**

For completeness, below is a checklist entry for each component file: verify TypeScript prop typings, ensure
accessibility (labels/aria/semantic HTML), add unit tests for behavior, memoize heavy/pure components, and confirm
effect dependencies.

- `frontend/src/components/dasboard-list/dashboard-list-content.tsx`: Check types, a11y, tests, memoize.
- `frontend/src/components/global-search/result-container.tsx`: Check types, a11y, tests, memoize.
- `frontend/src/components/global-search/result.tsx`: Check types, a11y, tests, memoize.
- `frontend/src/components/image-preview/no-image.tsx`: Check types, a11y, tests, memoize.
- `frontend/src/components/global-search/portal.tsx`: Check lifecycle cleanup, types, a11y, tests.
- `frontend/src/components/image-preview/image-preview.tsx`: Check image optimization, types, a11y, tests.
- `frontend/src/components/global-search/global-search.tsx`: Check debounce, keyboard nav, types, tests.
- `frontend/src/components/header/MobileMenuPanel.tsx`: Check focus trap, a11y, types, tests.
- `frontend/src/components/coach-stats/filter/RoleFilter.tsx`: Check radio group semantics, types, tests.
- `frontend/src/components/sidebar/sidebar-item.tsx`: Check nav semantics, types, tests.
- `frontend/src/components/sidebar/sidebar-group.tsx`: Check grouping semantics, types, tests.
- `frontend/src/components/coach-stats/filter/LocationFilter.tsx`: Check debounce, a11y, types, tests.
- `frontend/src/components/sidebar/sidebar-content.tsx`: Check structure, skip links, types.
- `frontend/src/components/coach-stats/filter/LeagueFilter.tsx`: Check select a11y, types, tests.
- `frontend/src/components/coach-stats/filter/DatabaseFilter.tsx`: Check select a11y and debounce.
- `frontend/src/components/sidebar/sidebar-wrapper.tsx`: Check responsive behavior and a11y.
- `frontend/src/components/sidebar/sidebar.tsx`: Check role navigation and focus.
- `frontend/src/components/forms/team-stats/TeamStatsForm.tsx`: Check validation schema and typed submit.
- `frontend/src/components/ui/calendar.tsx`: Check keyboard nav and aria attributes.
- `frontend/src/components/ui/combobox.tsx`: Check ARIA combobox pattern and types.
- `frontend/src/components/ui/date-picker.tsx`: Check label, keyboard support, timezone parsing.
- `frontend/src/components/ui/form-wrapper.tsx`: Check form ARIA attributes and submit handling.
- `frontend/src/components/ui/heading.tsx`: Check heading levels and semantics.
- `frontend/src/components/ui/input.tsx`: Check controlled/uncontrolled patterns and types.
- `frontend/src/components/forms/venue/Form/VenueFormContent.tsx`: Check provider integration and validation.
- `frontend/src/components/ui/form-fields-wrapper.tsx`: Check label associations and aria-describedby.
- `frontend/src/components/referee-page/referee-header/referee-header.tsx`: Check image alt text and metadata semantics.
- `frontend/src/components/ui/fieldset.tsx`: Check `legend` and grouping semantics.
- `frontend/src/components/ui/error.tsx`: Check standardized error display and tests.
- `frontend/src/components/forms/staff/Fields/LastName.tsx`: Check label and validation.

- `frontend/src/components/referee-page/referee-gamelog/referee-filter.tsx`: Check types, a11y, tests.
- `frontend/src/components/ui/page-content-wrapper.tsx`: Check skip links and layout semantics.
- `frontend/src/components/team-stats/filter/TeamStatsFilter.tsx`: Check labels, controlled inputs, types.
- `frontend/src/components/forms/staff/Fields/FirstName.tsx`: Check label and validation.
- `frontend/src/components/ui/navigation-menu.tsx`: Check keyboard navigation and roles.
- `frontend/src/components/forms/venue/Form/VenueFormProvider.tsx`: Provider typing and cleanup.
- `frontend/src/components/ui/popover.tsx`: Check focus management and visibility semantics.
- `frontend/src/components/forms/team-stats/Form/TeamStatsFormContent.tsx`: Move logic to hooks and add tests.
- `frontend/src/components/ui/dialog.tsx`: Check focus trap and escape behavior.
- `frontend/src/components/ui/select.tsx`: Check accessible select behavior and fallback.
- `frontend/src/components/forms/team-stats/Form/TeamStatsFormProvider.tsx`: Provider cleanup and types.
- `frontend/src/components/referee-page/referee-gamelog/referee-gamelog.tsx`: Check pagination and virtualization.
- `frontend/src/components/venue-page/season-data/player-league-stats.tsx`: Check memoization and typing.
- `frontend/src/components/forms/staff/Fields/Role.tsx`: Check accessibility of role selection.
- `frontend/src/components/ui/command.tsx`: Check keyboard shortcut cleanup and conflicts.
- `frontend/src/components/venue-page/season-data/season-data.tsx`: Split into hooks and add tests.
- `frontend/src/components/ui/separator.tsx`: Check semantic usage for decorative elements.
- `frontend/src/components/referee-page/referee-gamelog/useRefereeStatsTable.tsx`: Check typed returns and memoization.
- `frontend/src/components/referee-page/referee-gamelog/referee-season-stats.tsx`: Add memoization and tests.
- `frontend/src/components/ui/button.tsx`: Standardize variants and accessible focus styles.
- `frontend/src/components/forms/staff/StaffForm.tsx`: Validation and role accessibility.
- `frontend/src/components/ui/sheet.tsx`: Check mobile sheet accessibility and focus trap.
- `frontend/src/components/ui/submit-button.tsx`: Check disabled states and accessible text.
- `frontend/src/components/venue-page/venue-all-time/venue-stat-row.tsx`: Check memoization and localization.
- `frontend/src/components/ui/table-cell.tsx`: Verify colspan and semantics.
- `frontend/src/components/venue-page/venue-all-time/venue-stats.tsx`: Check formatting and tests.
- `frontend/src/components/ui/skeleton.tsx`: Ensure inertness for screen readers.
- `frontend/src/components/venue-page/venue-all-time/venue-all-time.tsx`: Break into smaller components and tests.
- `frontend/src/components/venue-page/season-data/usePlayerSeasonLeagueStatsTable.tsx`: Check caching and return types.
- `frontend/src/components/venue-page/venue-gamelog/filter.tsx`: Check labels and keyboard accessibility.
- `frontend/src/components/staff-page/staff-gamelog/staff-gamelog.tsx`: Check stable keys and performance.
- `frontend/src/components/ui/tooltip.tsx`: Ensure non-hover access (keyboard) and aria-describedby.
- `frontend/src/components/venue-page/venue-gamelog/useVenueSeasonStatsTable.tsx`: Typed returns and memoization.
- `frontend/src/components/ui/tabs.tsx`: Check keyboard arrow behavior and aria-selected.
- `frontend/src/components/venue-page/venue-gamelog/season-stats.tsx`: Offload transforms to hooks.
- `frontend/src/components/ui/table-wrapper.tsx`: Add captions and responsive handling.
- `frontend/src/components/forms/venue/VenueForm.tsx`: Validation, geolocation, typed submit.
- `frontend/src/components/sidebar/sidebar-toggle.tsx`: Accessible toggle logic.
- `frontend/src/components/forms/team/TeamForm.tsx`: Upload handling and validation.
- `frontend/src/components/sidebar/sidebar-title.tsx`: Check heading hierarchy.
- `frontend/src/components/venue-page/venue-gamelog/venue-gamelog.tsx`: Pagination, types, loading states.
- `frontend/src/components/ui/upload-button-wrapper.tsx`: File validation and accessible labels.
- `frontend/src/components/sidebar/sidebar-list.tsx`: Semantic list and roles.
- `frontend/src/components/coach-stats/filter/SeasonFilter.tsx`: Accessible defaults.
- `frontend/src/components/staff-page/staff-league-stats/staff-league-stats.tsx`: Memoize tables and type props.
- `frontend/src/components/coach-stats/filter/CoachStatsFilter.tsx`: Combine filters accessibly and test.
- `frontend/src/components/team-stats/table/TeamStatsTable.tsx`: Stable keys and virtualization.
- `frontend/src/components/ui/constants/navigation-style.ts`: Consolidate tokens if repeated.
- `frontend/src/components/team-stats/table/useTeamStatsTable.tsx`: Memoize and typed returns.
- `frontend/src/components/forms/staff/Form/StaffFormProvider.tsx`: Provider typing and cleanup.
- `frontend/src/components/ui/constants/button-variants.ts`: Use union types and document variants.
- `frontend/src/components/venue-page/venue-header/venue-header.tsx`: Meta semantics and image optimization.
- `frontend/src/components/forms/staff/Form/StaffFormContent.tsx`: Validate content and error display.
- `frontend/src/components/header/MobileInlineSearch.tsx`: Keyboard nav and aria labels.
- `frontend/src/components/country-select/country-select.tsx`: Performance and keyboard nav.
- `frontend/src/components/forms/team-stats/Filter/GameFilter.tsx`: Ensure clear button and labels.

- `frontend/src/components/dasboard-list/dashboard-list.tsx`: Check memoization and empty state handling.
- `frontend/src/components/forms/team-stats/Filter/TeamFilter.tsx`: Verify controlled inputs and a11y.
- `frontend/src/components/header/header.tsx`: Minimize mount work and ensure a11y.
- `frontend/src/components/dasboard-list/dashboard-list-wrapper.tsx`: Stable callbacks and types.
- `frontend/src/components/forms/team-stats/Fields/Misc.tsx`: Clarify types and purpose.
- `frontend/src/components/forms/team-stats/Fields/Passing.tsx`: Numeric validation and formatting.
- `frontend/src/components/forms/team/Fields/AlternateNames.tsx`: Ensure array input accessibility.
- `frontend/src/components/forms/team-stats/Fields/HeadCoach.tsx`: Selector a11y and types.
- `frontend/src/components/staff-page/staff-header/staff-header.tsx`: Avatar alt text and metadata semantics.
- `frontend/src/components/forms/venue/Fields/Name.tsx`: Ensure label and required validation.
- `frontend/src/components/forms/team/Form/TeamFormProvider.tsx`: Provider typing/cleanup.
- `frontend/src/components/forms/team-stats/Fields/Game.tsx`: Ensure game selection a11y.
- `frontend/src/components/forms/venue/Fields/Country.tsx`: Country select performance.
- `frontend/src/components/forms/team/Form/TeamFormContent.tsx`: Move transforms to hooks and type values.
- `frontend/src/components/forms/team-stats/Fields/Defense.tsx`: Numeric input validation.
- `frontend/src/components/forms/venue/Fields/City.tsx`: Input label and validation.
- `frontend/src/components/forms/team-stats/Fields/Competition.tsx`: Competition select typing and a11y.
- `frontend/src/components/forms/team-stats/Fields/AssistantCoach.tsx`: Selector typing and accessibility.
- `frontend/src/components/dasboard-list/dashboard-list-item.tsx`: Memoize items and stable keys.
- `frontend/src/components/team-records/TeamRecordsTable.tsx`: Virtualize and test sorting.
- `frontend/src/components/forms/team/Fields/City.tsx`: Validate and label.
- `frontend/src/components/forms/team-stats/Fields/Rebounds.tsx`: Numeric validation.
- `frontend/src/components/forms/team-stats/Fields/Shooting.tsx`: Format and validate numbers.
- `frontend/src/components/forms/team/Fields/LogoPreview.tsx`: Image preview alt text and lazy-load.
- `frontend/src/components/forms/team/Fields/ShortName.tsx`: Length validation.
- `frontend/src/components/referee-page/referee-all-time/referee-all-time.tsx`: Pagination and tests.
- `frontend/src/components/forms/team/Fields/Name.tsx`: Required field handling and tests.
- `frontend/src/components/forms/team-stats/Fields/Team.tsx`: Team select accessibility.
- `frontend/src/components/forms/team/Fields/Logo.tsx`: File input validation and accessibility.
- `frontend/src/components/forms/team-stats/Fields/Season.tsx`: Season defaults and a11y.
- `frontend/src/components/team-records/useTeamRecordsTable.tsx`: Memoize and typed returns.
- `frontend/src/components/forms/team/Fields/Country.tsx`: Country select optimization.
- `frontend/src/components/forms/team-stats/Fields/Score.tsx`: Edge-case numeric handling.
- `frontend/src/components/referee-page/referee-all-time/useRefereeStatsTable.tsx`: Typed cacheable returns.
- `frontend/src/components/forms/player-stats/PlayerStatsForm.tsx`: Typed form schema and tests.
- `frontend/src/components/forms/game/GameForm.tsx`: Centralize submit logic in hooks.
- `frontend/src/components/forms/player/PlayerForm.tsx`: Date parsing and validation.
- `frontend/src/components/forms/competition/CompetitionForm.tsx`: Validation and typed submission.
- `frontend/src/components/coach-stats/table/useCoachStatsTable.tsx`: Memoize selectors and type returns.
- `frontend/src/components/refresh-data-button/refresh-data-button.tsx`: Throttle and loading states.
- `frontend/src/components/coach-stats/table/CoachStatsTable.tsx`: Virtualize and memoize rows.
- `frontend/src/components/routes/stats-routes.tsx`: Lazy-load routes and Suspense for heavy pages.
- `frontend/src/components/routes/dashboard-routes.tsx`: Ensure protected routes and lazy-loading.
- `frontend/src/components/routes/app-routes.tsx`: ErrorBoundary and Suspense wrapping.
- `frontend/src/components/forms/player/Form/PlayerFormProvider.tsx`: Provider typing and cleanup.
- `frontend/src/components/forms/game/Form/EditGameWarning.tsx`: Accessible warning text and confirm flows.

- `frontend/src/components/forms/player/Fields/ActivePlayer.tsx`: Checkbox semantics and labels.
- `frontend/src/components/forms/player/Form/PlayerFormContent.tsx`: Move transforms to hooks and type outputs.
- `frontend/src/components/team-page/league-stats/TeamLeagueStats.tsx`: Defensive checks and memoization.
- `frontend/src/components/forms/game/Form/GameFormContent.tsx`: Typed submit handler and validation.
- `frontend/src/components/forms/player/Fields/DateOfBirth.tsx`: Date picker accessibility and validation.
- `frontend/src/components/team-page/league-stats/database-select.tsx`: Accessible async select and loading states.
- `frontend/src/components/forms/referee/Form/RefereeFormContent.tsx`: Centralize validation and error display.
- `frontend/src/components/forms/game/Filters/CompetitionFilter.tsx`: Accessible filter options and keyboard nav.
- `frontend/src/components/team-page/team-leaders/category-select.tsx`: Typed options and a11y.
- `frontend/src/components/forms/game/Form/GameFormProvider.tsx`: Provider cleanup and typed context.
- `frontend/src/components/forms/player/Fields/DateOfDeath.tsx`: Optional date handling and accessibility.
- `frontend/src/components/forms/player/Fields/Height.tsx`: Numeric input and validation.
- `frontend/src/components/forms/player/Fields/LastName.tsx`: Label and validation.
- `frontend/src/components/team-page/team-leaders/leaders-table.tsx`: Virtualize and memoize.
- `frontend/src/components/team-page/team-leaders/filters.tsx`: Group filters and accessibility.
- `frontend/src/components/forms/game/Filters/SeasonFilter.tsx`: Default behavior and a11y.
- `frontend/src/components/forms/player/Fields/FirstName.tsx`: Label and validation.
- `frontend/src/components/forms/referee/Form/RefereeFormProvider.tsx`: Provider typing and cleanup.
- `frontend/src/components/team-page/team-leaders/competition-select.tsx`: Async select loading state and a11y.
- `frontend/src/components/forms/game/Filters/GameFilter.tsx`: Ensure labels and clear actions.
- `frontend/src/components/team-page/team-leaders/options.ts`: Typed option shape and reuse.
- `frontend/src/components/forms/player/Fields/Nationality.tsx`: Country select performance and typing.
- `frontend/src/components/forms/referee/RefereeForm.tsx`: Validation schema and typed returns.
- `frontend/src/components/forms/competition/Fields/WinningSeasons.tsx`: Multi-select a11y and validation.
- `frontend/src/components/forms/competition/Fields/ShortName.tsx`: Length validation.
- `frontend/src/components/forms/competition/Fields/Name.tsx`: Required validation and labels.
- `frontend/src/components/team-page/team-leaders/team-leaders.tsx`: Ensure handler stability and memoization.
- `frontend/src/components/forms/player/Fields/SecondaryPosition.tsx`: Option list a11y and typing.
- `frontend/src/components/forms/competition/Fields/AlternateNames.tsx`: Array input accessibility.
- `frontend/src/components/team-page/team-leaders/radio-buttons.tsx`: Radio group semantics and keyboard nav.
- `frontend/src/components/forms/player/Fields/PrimaryPosition.tsx`: Option typing and a11y.
- `frontend/src/components/forms/game/Fields/AwayTeamName.tsx`: Label and validation.
- `frontend/src/components/forms/game/Fields/Competition.tsx`: Select a11y and typed options.
- `frontend/src/components/forms/competition/Form/CompetitionFormProvider.tsx`: Provider typing and cleanup.
- `frontend/src/components/forms/game/Fields/CompetitionName.tsx`: Label and validation.
- `frontend/src/components/forms/player-stats/Form/PlayerStatsFormContent.tsx`: Extract logic to hooks and add tests.
- `frontend/src/components/forms/game/Fields/ForfeitedBy.tsx`: Selection fallback and typing.
- `frontend/src/components/forms/game/Fields/Gallery.tsx`: File upload a11y and validation.
- `frontend/src/components/forms/player-stats/Filter/PlayerFilter.tsx`: Performance for large option lists.
- `frontend/src/components/forms/game/Fields/GalleryPreview.tsx`: Image alt text and lazy-loading.
- `frontend/src/components/forms/game/Fields/HomeTeam.tsx`: Team selection accessibility.
- `frontend/src/components/team-page/team-header/team-header.tsx`: Heading semantics and image alt text.
- `frontend/src/components/forms/player-stats/Form/PlayerStatsFormProvider.tsx`: Provider typing and cleanup.
- `frontend/src/components/forms/game/Fields/HomeTeamName.tsx`: Validation and a11y.
- `frontend/src/components/forms/player-stats/Fields/Captain.tsx`: Toggle semantics and aria-pressed.
- `frontend/src/components/forms/game/Fields/Forfeited.tsx`: Status handling and labels.
- `frontend/src/components/forms/game/Fields/Date.tsx`: Use standard date picker and timezone handling.
- `frontend/src/components/forms/player-stats/Fields/Competition.tsx`: Typed options and select a11y.
- `frontend/src/components/team-page/team-games/team-season-stats.tsx`: Memoize heavy aggregations.
- `frontend/src/components/forms/game/Fields/NeutralVenue.tsx`: Checkbox label pairing.
- `frontend/src/components/forms/game/Fields/MainReferee.tsx`: Referee select fallback and a11y.
- `frontend/src/components/team-page/team-games/team-games.tsx`: Virtualize and memoize rows.
- `frontend/src/components/forms/competition/Form/CompetitionFormContent.tsx`: Centralize validation and types.
- `frontend/src/components/forms/game/Fields/AwayTeam.tsx`: Team select a11y.
- `frontend/src/components/forms/coach/CoachForm.tsx`: Validate dates and profile image handling.
- `frontend/src/components/forms/game/Fields/Attendance.tsx`: Numeric input constraints and labels.
- `frontend/src/components/forms/player/Constants/player-positions.ts`: Add types and document values.
- `frontend/src/components/forms/game/Fields/Nulled.tsx`: Clear status semantics and tests.
- `frontend/src/components/forms/game/Fields/Round.tsx`: Validation and labeling.
- `frontend/src/components/forms/game/Fields/Season.tsx`: Season selector defaults and a11y.
- `frontend/src/components/team-page/all-time-stats/useTeamAllTimeStatsTable.tsx`: Memoize and typed returns.
- `frontend/src/components/forms/player-stats/Fields/Game.tsx`: Game select behavior and a11y.
- `frontend/src/components/forms/referee/Fields/LastName.tsx`: Label and validation.
- `frontend/src/components/forms/referee/Fields/Nationality.tsx`: Country select a11y.
- `frontend/src/components/forms/player-stats/Fields/Defense.tsx`: Numeric validation.
- `frontend/src/components/forms/referee/Fields/FirstName.tsx`: Label and validation.
- `frontend/src/components/team-page/all-time-stats/TeamAllTimeStats.tsx`: Virtualize and memoize heavy data.
- `frontend/src/components/forms/game/Fields/Staffers.tsx`: Multi-select handling and a11y.
- `frontend/src/components/forms/player-stats/Fields/Misc.tsx`: Clarify purpose, types, and tests.
- `frontend/src/components/forms/game/Fields/SecondReferee.tsx`: Optional select a11y.
- `frontend/src/components/forms/player-stats/Fields/Minutes.tsx`: Numeric constraints and formatting.
- `frontend/src/components/forms/game/Fields/Stage.tsx`: Input validation and labels.
- `frontend/src/components/forms/game/Fields/ThirdReferee.tsx`: Optional select a11y.
- `frontend/src/components/protected-route/protected-route.tsx`: Auth redirect behavior and tests.
- `frontend/src/components/forms/coach/Form/CoachFormProvider.tsx`: Provider typing and cleanup.
- `frontend/src/components/forms/player-stats/Fields/Passing.tsx`: Numeric validation.
- `frontend/src/components/forms/player-stats/Fields/Player.tsx`: Player selector performance.
- `frontend/src/components/forms/player-stats/Fields/Number.tsx`: Numeric input handling.
- `frontend/src/components/forms/coach/Fields/DateOfBirth.tsx`: DOB validation and accessibility.
- `frontend/src/components/pagination/PaginationControls.tsx`: Keyboard navigation and aria-labels.
- `frontend/src/components/forms/coach/Fields/Nationality.tsx`: Country select accessibility.
- `frontend/src/components/forms/coach/Fields/ProfileImage.tsx`: Image upload validation and previews.
- `frontend/src/components/forms/coach/Fields/ProfileImagePreview.tsx`: Alt text and lazy-load.
- `frontend/src/components/forms/coach/Fields/LastName.tsx`: Label and validation.
- `frontend/src/components/player-stats/table/PlayerStatsTable.tsx`: Virtualize and stable keys.
- `frontend/src/components/player-records/usePlayerRecordsTable.tsx`: Typed returns and caching.
- `frontend/src/components/player-records/PlayerRecordsTable.tsx`: Stable keys and pagination.
- `frontend/src/components/player-stats/table/usePlayerStatsTable.tsx`: Memoize and type outputs.
- `frontend/src/components/forms/coach/Fields/FirstName.tsx`: Label and validation.
- `frontend/src/components/forms/player-stats/Fields/Team.tsx`: Team selector a11y.
- `frontend/src/components/player-page/career-high/career-high.tsx`: Memoize and a11y.
- `frontend/src/components/player-page/career-high/career-high-row.tsx`: Memoize and type props.
- `frontend/src/components/forms/player-stats/Fields/Status.tsx`: Status select semantics.
- `frontend/src/components/forms/player-stats/Fields/Shooting.tsx`: Numeric validation.
- `frontend/src/components/team-page/team-header/team-bio/team-bio.tsx`: Heading semantics and a11y.
- `frontend/src/components/player-page/player-header/player-header.tsx`: Heading hierarchy and image alt.
- `frontend/src/components/forms/player-stats/Fields/Seconds.tsx`: Numeric constraints.
- `frontend/src/components/forms/player-stats/Fields/Season.tsx`: Season selector behavior.
- `frontend/src/components/forms/player-stats/Fields/Rebounds.tsx`: Numeric validation.
- `frontend/src/components/forms/player-stats/Fields/Points.tsx`: Numeric validation and formatting.
- `frontend/src/components/player-page/all-time-stats/all-time-stats.tsx`: Memoize and tests.
- `frontend/src/components/forms/coach/Form/CoachFormContent.tsx`: Centralize validation and error display.
- `frontend/src/components/player-page/menu/menu.tsx`: Keyboard navigation and focus.
- `frontend/src/components/player-page/player-boxscore/player-boxscore.tsx`: Optimize heavy calculations and memoize.
- `frontend/src/components/player-stats/filter/PlayerStatsFilter.tsx`: Filter semantics and performance.
- `frontend/src/components/referee-stats/filter/LeagueFilter.tsx`: Accessible select and tests.
- `frontend/src/components/player-stats/filter/SeasonFilter.tsx`: Default behavior and a11y.
- `frontend/src/components/referee-stats/filter/LocationFilter.tsx`: Debounce and accessibility.
- `frontend/src/components/player-stats/filter/StatsFilter.tsx`: Keyboard-accessible toggles and tests.
- `frontend/src/components/player-stats/filter/LocationFilter.tsx`: (duplicate path) ensure debounce and accessibility.
- `frontend/src/components/player-stats/filter/LeagueFilter.tsx`: (duplicate path) ensure a11y and tests.
- `frontend/src/components/referee-stats/filter/RefereeStatsFilter.tsx`: Group filters accessibly.
- `frontend/src/components/player-stats/filter/DatabaseFilter.tsx`: Debounce and async loading behavior.
- `frontend/src/components/referee-stats/filter/SeasonFilter.tsx`: Default options and a11y.
- `frontend/src/components/player-page/all-time-stats/stat-box/stat-box.tsx`: Accessible labeling.
- `frontend/src/components/team-page/team-header/team-logo/team-logo.tsx`: srcset and lazy-load.
- `frontend/src/components/referee-stats/table/RefereeStatsTable.tsx`: Memoize and virtualization.
- `frontend/src/components/player-page/player-header/player-number/player-number.tsx`: Ensure aria-label and formatting.
- `frontend/src/components/forms/game/Fields/Venue.tsx`: Venue select accessibility and fallback.
- `frontend/src/components/referee-stats/table/useRefereeStatsTable.tsx`: Memoize and type returns.
- `frontend/src/components/player-page/player-boxscore/season-average/season-average.tsx`: Memoize and test formatting.
- `frontend/src/components/player-page/player-boxscore/filter/boxscore-filter.tsx`: Filter a11y and performance.
- `frontend/src/components/no-content/no-content.tsx`: Screen reader friendly empty state.
- `frontend/src/components/player-page/all-time-league-stats/table-footer/table-footer.tsx`: Pagination accessibility.
- `frontend/src/components/mobile-filters/MobileFilters.tsx`: Focus management and show/hide semantics.
- `frontend/src/components/player-page/player-boxscore/boxscore/boxscore.tsx`: Ensure heavy math in hooks and memoize.
- `frontend/src/components/player-page/all-time-league-stats/all-time-league-stats.tsx`: Optimize and memoize.
- `frontend/src/components/league-page/player-rankings/league-leader-list.tsx`: Stable keys and virtualization.
- `frontend/src/components/league-page/player-rankings/player-rankings.tsx`: Sorting tests and pagination.
- `frontend/src/components/player-page/all-time-league-stats/buttons/buttons.tsx`: Button accessibility and focus.
- `frontend/src/components/league-page/league-header/league-header.tsx`: Meta data and image optimization.
- `frontend/src/components/player-page/player-header/player-bio/player-bio.tsx`: Biographical data a11y.
- `frontend/src/components/games-page/games-filter/competition-list.tsx`: List role and keyboard nav.
- `frontend/src/components/league-page/league-season/useTeamLeagueStatsTable.tsx`: Memoize and typed results.
- `frontend/src/components/league-page/schedule/schedule.tsx`: Semantic schedule markup and a11y.
- `frontend/src/components/league-page/league-season/team-league-stats.tsx`: Virtualize and type props.
- `frontend/src/components/league-page/player-rankings/ranking-options.ts`: Typed options and defaults.
- `frontend/src/components/games-page/games-filter/competition-select.tsx`: Async loading state and a11y.
- `frontend/src/components/player-page/player-header/player-image/player-image.tsx`: Lazy-load and alt text.
- `frontend/src/components/games-page/games-filter/games-filter.tsx`: Consolidate form state and memoize.
- `frontend/src/components/player-page/all-time-league-stats/main-table/main-table.tsx`: Virtualize and memoize columns.
- `frontend/src/components/player-page/all-time-league-stats/main-table/tbody.tsx`: Virtualized tbody and memoized rows.
- `frontend/src/components/games-page/games-filter/season-select.tsx`: Accessible defaults.
- `frontend/src/components/games-page/games-filter/search-bar.tsx`: Debounce and screen-reader label.
- `frontend/src/components/games-page/games-filter/right-controls.tsx`: Ensure controls keyboard-friendly.
- `frontend/src/components/player-page/all-time-league-stats/main-table/thead.tsx`: Column headers and sort a11y.
- `frontend/src/components/coach-page/coach-league-stats/coach-role-filter.tsx`: Radio group semantics.
- `frontend/src/components/coach-page/coach-league-stats/useCoachLeagueStatsTable.tsx`: Memoize and type returns.
- `frontend/src/components/coach-page/coach-league-stats/location-filter.tsx`: Debounce and accessibility.
- `frontend/src/components/coach-page/coach-gamelog/useCoachSeasonStatsTable.tsx`: Memoize and typed returns.
- `frontend/src/components/coach-page/coach-league-stats/coach-league-stats.tsx`: Virtualize and memoize.
- `frontend/src/components/coach-page/coach-all-time-stats/useCoachAllTimeStatsTable.tsx`: Typed returns and caching.
- `frontend/src/components/coach-page/coach-gamelog/filters.tsx`: Group filters and memoize options.
- `frontend/src/components/game-page/game-stats/game-stats.tsx`: Memoize aggregates and move heavy math to hooks.
- `frontend/src/components/coach-page/coach-all-time-stats/radio-buttons.tsx`: Keyboard nav and aria-checked.
- `frontend/src/components/coach-page/coach-all-time-stats/coach-all-time-stats.tsx`: Optimize rendering and tests.
- `frontend/src/components/coach-page/coach-gamelog/coach-season-stats.tsx`: Memoize and test season aggregates.
- `frontend/src/components/game-page/game-referees/game-referees.tsx`: Accessible list and fallback handling.
- `frontend/src/components/coach-page/coach-gamelog/coach-gamelog.tsx`: Virtualize and paginate long lists.
- `frontend/src/components/coach-page/coach-header/coach-header.tsx`: Avatar alt and heading semantics.
- `frontend/src/components/coach-page/coach-header/coach-bio/coach-bio.tsx`: Heading levels and accessible bio.
- `frontend/src/components/coach-page/coach-header/coach-image/coach-image.tsx`: Lazy-load and alt text.
- `frontend/src/components/games-page/games-list/games-list.tsx`: Virtualization and placeholders.
- `frontend/src/components/games-page/games-list/games-item.tsx`: Memoize items and stable keys.
- `frontend/src/components/game-page/game-header/game-info.tsx`: Timezone-aware display and aria labels.
- `frontend/src/components/game-page/game-header/game-header.tsx`: Ensure semantic header and metadata.
- `frontend/src/components/game-page/game-gallery/game-gallery.css`: Scope CSS and avoid conflicts.
- `frontend/src/components/game-page/game-gallery/game-gallery.tsx`: Lazy-load gallery images and keyboard nav.
- `frontend/src/components/league-page/all-time/useLeagueAllTimeTable.tsx`: Memoize and typed returns.
- `frontend/src/components/league-page/all-time/league-all-time.tsx`: Virtualize and test.
- `frontend/src/components/game-page/error-page/error-page.tsx`: Accessible error messaging and retry actions.
- `frontend/src/components/game-page/boxscore/team-stats.tsx`: Memoize and avoid expensive re-renders.
- `frontend/src/components/game-page/boxscore/boxscore.tsx`: Ensure heavy math happens in hooks, memoize.
- `frontend/src/components/game-page/boxscore/boxscore-container.tsx`: Separate container/presentation and avoid prop
  churn.
- `frontend/src/components/game-page/boxscore/team-name/team-name.tsx`: Link semantics and accessible names.
- `frontend/src/components/game-page/boxscore/coaches/coaches.tsx`: Memoize coach cells and stable keys.

---

Deep Dive — hooks, pages, services, types

I'll review every file under `frontend/src/hooks`, `frontend/src/pages`, `frontend/src/services`, and
`frontend/src/types` and list concise, actionable proposed changes per file.

Hooks — summary findings

- General: ensure explicit return types, correct `useEffect` dependency arrays, memoize expensive derived data, add
  tests for pure hooks, and use React Query `select`/options where appropriate.
- Data/query hooks: set sensible `staleTime`/`cacheTime`, handle errors uniformly, and use `select` to map server
  payloads to UI shapes.

All hooks — per-file checklist (verify types, deps, memoization, a11y where applicable, tests)

- `frontend/src/hooks/use-mobile.ts`: Add return types, debounce resize logic, test.
- `frontend/src/hooks/usePlayerBoxscoreTable.tsx`: Memoize columns, typed returns, unit tests for transforms.
- `frontend/src/hooks/useTeamLeagueStats.tsx`: Memoize selectors and typed outputs.
- `frontend/src/hooks/useSearch.tsx`: Debounce, cancel previous requests, typed returns.
- `frontend/src/hooks/useScheduleTable.tsx`: Stable keys, memoize transforms.
- `frontend/src/hooks/context/useBoxscore.ts`: Context types, provider cleanup.
- `frontend/src/hooks/context/useTeamContext.ts`: Ensure context typing and unmount cleanup.
- `frontend/src/hooks/context/useGamesContext.ts`: Typed context API and memoized values.
- `frontend/src/hooks/useTeamStatsTable.tsx`: Memoize heavy selectors, typed returns.
- `frontend/src/hooks/usePlayerLeagueStatsTable.tsx`: Typed outputs and performance checks.
- `frontend/src/hooks/usePlayerGamelogTable.tsx`: Virtualize or paginate large lists and memoize.
- `frontend/src/hooks/usePagedSortedList.ts`: Explicit generic types, stable comparator identity, unit tests.
- `frontend/src/hooks/usePlayerLeagueStatsTable.tsx`: (possible duplicate) ensure typed returns and memoization.

Query hooks (each should have typed returns, sensible caching, and error handling):

- `frontend/src/hooks/queries/useSeasonSchedule.ts`
- `frontend/src/hooks/queries/coach/useCoaches.ts`
- `frontend/src/hooks/queries/coach/useCoachGamelog.ts`
- `frontend/src/hooks/queries/coach/useCoachLeagueStats.ts`
- `frontend/src/hooks/queries/coach/useCoachDetails.ts`
- `frontend/src/hooks/queries/team-stats/useSingleTeamStats.ts`
- `frontend/src/hooks/queries/dasboard/useSeasons.ts`
- `frontend/src/hooks/queries/dasboard/useSeasonCompetitions.ts`
- `frontend/src/hooks/queries/dasboard/useCompetitions.ts`
- `frontend/src/hooks/queries/player/useAllTimeStats.ts`
- `frontend/src/hooks/queries/coach/useCoachSeasons.ts`
- `frontend/src/hooks/queries/game/useGameReferees.ts`
- `frontend/src/hooks/queries/league/useLeagueDetails.ts`
- `frontend/src/hooks/queries/coach/useCoachSeasonCompetitions.ts`
- `frontend/src/hooks/queries/game/useGameDetails.ts`
- `frontend/src/hooks/queries/player/useAllTimeLeagueStats.ts`
- `frontend/src/hooks/queries/coach/useCoachSeasons.ts` (duplicate): dedupe and ensure consistent naming.
- `frontend/src/hooks/queries/coach/useSeasonLeagueStats.ts`
- `frontend/src/hooks/queries/league/useLeagueSeasons.ts`
- `frontend/src/hooks/queries/game/useGameTeams.ts`
- `frontend/src/hooks/queries/player/usePlayerCompetitions.ts`
- `frontend/src/hooks/queries/game/useGameTeamCoaches.ts`
- `frontend/src/hooks/queries/league/useLeaguePlayerRankings.ts`
- `frontend/src/hooks/queries/player/usePlayerCareerHigh.ts`
- `frontend/src/hooks/queries/coach/useSeasonTotalStats.ts`
- `frontend/src/hooks/queries/game/useGameScore.ts`
- `frontend/src/hooks/queries/league/useLeagueGames.ts`
- `frontend/src/hooks/queries/league/useLeagueTeamRecord.ts`
- `frontend/src/hooks/queries/player/usePlayerNumber.ts`
- `frontend/src/hooks/queries/game/useGameTeamStats.ts`
- `frontend/src/hooks/queries/player/usePlayerDetails.ts`
- `frontend/src/hooks/queries/league/useTeamLeagueStats.ts`
- `frontend/src/hooks/queries/stats/useCoachAllTimeStats.ts`
- `frontend/src/hooks/queries/venue/useVenues.ts`
- `frontend/src/hooks/queries/player/usePlayerSeasonAverage.ts`
- `frontend/src/hooks/queries/team/useTeamCompetitions.ts`
- `frontend/src/hooks/queries/venue/useVenueGamelog.ts`
- `frontend/src/hooks/queries/player/usePlayers.ts`
- `frontend/src/hooks/queries/venue/useVenueDetails.ts`
- `frontend/src/hooks/queries/player/usePlayerProfileDatabase.ts`
- `frontend/src/hooks/queries/league/usePlayerLeagueStats.ts`
- `frontend/src/hooks/queries/team/useTeamDetails.ts`
- `frontend/src/hooks/queries/player/usePlayerSeasonLeagueAverage.ts`
- `frontend/src/hooks/queries/stats/useTeamRecords.ts`
- `frontend/src/hooks/queries/venue/useVenueTeamRecord.ts`
- `frontend/src/hooks/queries/team/useTeamSeasonCompetitions.ts`
- `frontend/src/hooks/queries/venue/useVenueSeasonStats.ts`
- `frontend/src/hooks/queries/stats/useTeamAllTimeStats.ts`
- `frontend/src/hooks/queries/stats/usePlayerAllTimeStats.ts`
- `frontend/src/hooks/queries/team/useTeamSeasons.ts`
- `frontend/src/hooks/queries/team/useTeamLeaders.ts`
- `frontend/src/hooks/queries/venue/useVenueSeasonCompetitions.ts`
- `frontend/src/hooks/queries/stats/usePlayerRecords.ts`
- `frontend/src/hooks/queries/referee/useRefereeDetails.ts`
- `frontend/src/hooks/queries/referee/useRefereeSeasonStats.ts`
- `frontend/src/hooks/queries/referee/useRefereeTeamRecord.ts`
- `frontend/src/hooks/queries/referee/useRefereeSeasons.ts`
- `frontend/src/hooks/queries/referee/useRefereeSeasonLeagueStats.ts`
- `frontend/src/hooks/queries/player-stats/usePlayerStats.ts`
- `frontend/src/hooks/queries/referee/useReferees.ts`
- `frontend/src/hooks/queries/player-stats/useGamePlayerStats.ts`

Proposed hook priorities

- High: `use*Table` hooks (table performance, memoization), query hooks that power main lists (`usePlayers`, `useGames`,
  `useTeamDetails`).
- Medium: context hooks and provider cleanup.
- Low: utility hooks and small convenience hooks.

Pages — summary findings

- General: ensure loading, empty and error states; use Suspense/ErrorBoundary for lazy routes; lazy-load heavy
  subcomponents; ensure semantic layout and a11y (headings, landmarks), and pagination/virtualization for large lists.

All pages — per-file checklist (verify data-loading patterns, error handling, accessibility, performance)

- `frontend/src/pages/Home/Home.tsx`: Add concise data loading states, hero semantics, and a11y checks.
- `frontend/src/pages/Games/Games.tsx`: Virtualize long lists, debounce filters, keyboard accessibility.
- `frontend/src/pages/Game/Game.tsx` & `frontend/src/pages/Game/GameContent.tsx`: Ensure boxscore memoization,
  loading/error boundaries, timezone handling.
- `frontend/src/pages/Player/Player.tsx` & `frontend/src/pages/Player/PlayerContent.tsx`: Split heavy transforms into
  hooks, memoize, paginate gamelogs.
- `frontend/src/pages/Coach/Coach.tsx` & `frontend/src/pages/Coach/CoachContent.tsx`: Memoize table columns, ensure
  provider usage is correct.
- `frontend/src/pages/Coaches/CoachesPage.tsx`: Add search debounce, aria labels, pagination.
- `frontend/src/pages/Leagues/LeaguesPage.tsx` & `frontend/src/pages/League/League.tsx`/`LeagueContent.tsx`: Ensure
  schedule uses semantic table and accessible date formatting.
- `frontend/src/pages/Venue/Venue.tsx` & `VenueContent.tsx`: Paginate venue gamelog and memoize season stats.
- `frontend/src/pages/Venues/VenuesPage.tsx`: Optimize list rendering and add loading placeholders.
- `frontend/src/pages/Teams/TeamsPage.tsx` & `frontend/src/pages/Team/TeamPage.tsx`/`TeamContent.tsx`: Memoize leaders,
  avoid prop churn from parent filters.
- `frontend/src/pages/Referees/RefereesPage.tsx`, `frontend/src/pages/Referee/RefereeContent.tsx`: Ensure gamelog
  pagination and accessible filters.
- `frontend/src/pages/Staffs/StaffsPage.tsx`: Accessible tables and search.
- plus other pages: confirm consistent patterns for loading/error/empty states across all pages.

Services — summary findings

- General: many small create/update service files; propose central `apiClient.ts` to manage base URL, headers, JSON
  parsing, error shaping, retries, and auth-refresh interceptor. Add types to all service functions and normalized error
  shape.

All services — per-file checklist (typed request/response, use central client)

- `frontend/src/services/teams/createTeam.ts`: Use typed payload & response, use `apiClient.post`.
- `frontend/src/services/teams/updateTeam.ts`: Use central client, handle validation errors.
- `frontend/src/services/games/createGame.ts`: Validate date formats and payload types.
- `frontend/src/services/games/updateGame.ts`: Ensure idempotency, typed returns.
- `frontend/src/services/coaches/createCoach.ts`
- `frontend/src/services/coaches/updateCoach.ts`
- `frontend/src/services/competitions/createCompetition.ts`
- `frontend/src/services/competitions/updateCompetition.ts`
- `frontend/src/services/players/createPlayer.ts`
- `frontend/src/services/players/updatePlayer.ts`
- `frontend/src/services/referees/createReferee.ts`
- `frontend/src/services/referees/updateReferee.ts`
- `frontend/src/services/staff/createStaff.ts`
- `frontend/src/services/staff/updateStaff.ts`
- `frontend/src/services/player-stats/createPlayerStats.ts`
- `frontend/src/services/player-stats/updatePlayerStats.ts`
- `frontend/src/services/team-stats/createTeamStats.ts`
- `frontend/src/services/team-stats/updateTeamStats.ts`
- `frontend/src/services/venue/createVenue.ts`
- `frontend/src/services/venue/updateVenue.ts`

Service priorities and changes

- High: create `src/services/apiClient.ts`, migrate 4-6 core services (`players`, `teams`, `games`, `coaches`) to it,
  add centralized 401-refresh logic.
- Medium: add typed response interfaces via `types/generated`.
- Low: add retries/backoff and request batching where needed.

Types — summary findings

- `frontend/src/types/generated/components.d.ts` and `contentTypes.d.ts` exist. Keep these generated from Strapi
  content-types and export domain-level types for services and hooks.
- Actions:
    - Ensure generation step is documented (where/how to run `strapi-to-typescript` or equivalent).
    - Re-export selected types from `src/types/index.ts` to avoid importing deep `generated` paths across the codebase.
    - Replace ad-hoc `any` in services/hooks with generated types.

Next steps (implementation options)

- Option A (fast win): Implement `src/services/apiClient.ts`, migrate a small set of services (`createPlayer`,
  `updatePlayer`, `createTeam`, `updateTeam`, `createGame`) and add tests.
- Option B (stability): Add top-level ErrorBoundary, standardize page loading/error UI, and update a few `use*Table`
  hooks for memoization/virtualization.
- Option C (types): Add `src/types/index.ts`, re-export generated types, and update a few service signatures to use
  them.

I can start with Option A and open a PR migrating 4-6 services to a central client. Which option do you want me to
implement first?
