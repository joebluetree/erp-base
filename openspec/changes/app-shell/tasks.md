## 1. Navigation list

- [x] 1.1 Add `core/navigation/nav-items.ts` with `NavItem` and `NAV_ITEMS` (Dashboard `/`, Todos `/todos`, icons)
- [x] 1.2 Test the list: entries, labels, destinations, icons

## 2. Shell

- [x] 2.1 Add `shell/app-nav` component: `<nav>` with a router link per item, active highlighting (exact for Dashboard), `navigated` output
- [x] 2.2 Add `shell/shell` component: header (name, menu button with accessible label), desktop sidebar, Spartan `hlm-sheet` overlay bound to `menuOpen`, content `<main class="page">` with router outlet
- [x] 2.3 Add the shell layout with Tailwind classes, including the 768px (`md`) breakpoint (sidebar shown, button hidden at 768px and wider; reverse below)
- [x] 2.4 Close the sheet on `navigated` and on its own dismiss

## 3. Dashboard and routing

- [x] 3.1 Add `features/dashboard/dashboard` with its own `TodoService`, total/open/completed cards, loading spinner, failure message, and quick links from `NAV_ITEMS`
- [x] 3.2 Update `app.routes.ts`: shell as parent route with Dashboard at `''` and lazy `todos` as children; wildcard redirects to `''`
- [x] 3.3 Update `app.ts` to keep toast and confirm dialog and render the shell through the router outlet
- [x] 3.4 Remove `<main class="page">` from the Todo list and form templates
- [x] 3.5 Delete `features/home`

## 4. Tests

- [x] 4.1 `app-nav` tests: entries and links, highlighting, exact Dashboard match, `navigated` emitted
- [x] 4.2 `Shell` tests: shows menu, renders routed page, button opens the overlay, choosing an entry closes it, dismiss closes it
- [x] 4.3 `Dashboard` tests: counts, zero, loading, failure message with one notification, quick links, no write requests
- [x] 4.4 Run the full suite (existing tests included) and the production build; record results

## 5. Documentation and verification

- [x] 5.1 Update `kb/architecture/frontend.md` (structure, routing, shell, menu and how to add an entry, responsive behavior, Dashboard and its exception, Home removed, boundary rule)
- [ ] 5.2 Run the app, check the layout at wide and narrow widths, and walk the PRD acceptance checklist, noting anything that could not be verified (for example Todo data while the database table is missing)
- [ ] 5.3 After `frontend-foundation` is archived, add the delta for `frontend-app-foundation` (Home page, routing, feature-organization requirements) so its specs match this change before this one is archived

## 6. Light and dark theme

- [x] 6.1 Add `core/theme/theme.service.ts`: `theme` signal, `toggle()`, stored-else-system-else-light initial value, `dark` class and `color-scheme` on `<html>`, storage access inside try/catch
- [x] 6.2 Add the inline script to `index.html` that applies the same decision before the app starts
- [x] 6.3 Add the header icon button to `Shell` (moon/sun, accessible name that states the action) wired to the service
- [ ] 6.4 Confirm Tailwind's `dark:` variant follows the `.dark` class, and check the table, form, cards, alert dialog, sheet and toaster in dark mode; fix any that stay light
- [x] 6.5 Tests: service (initial from storage, from system, default light, toggle, persistence, storage failure, class on `<html>`) and `Shell` (button present with accessible name, click toggles theme, icon and name change)
- [x] 6.6 Run the full suite and the production build; update `kb/architecture/frontend.md` and `frontend/README.md` for the theme
- [x] 6.7 Soften the dark-mode text color tokens in `styles.css` (near-white `0.985` to `0.87`), confirm at least 4.5:1 contrast with the dark background, leave light mode unchanged, and rebuild
