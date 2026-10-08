# Proposal

## Why

The frontend shows each page bare: the Home page draws its own page frame, and there is no way to move between screens except typed links, which future feature screens would also need. Future ERP modules need one consistent frame, a navigation menu, and a landing page. `kb/platform/app-shell.md` defines it; the frontend foundation deliberately left it out.

## What Changes

- Add an application shell (header, sidebar, content area) that wraps every feature route. The header shows the app name and, on small screens, a menu button.
- Add a navigation menu defined as one static typed list, starting with the Dashboard only (each future module adds its own entry), with the current entry highlighted.
- Make the sidebar responsive: beside the content at 768px and wider; below that, hidden and opened as an overlay from the header button.
- Add a Dashboard as the landing page with a short welcome text and quick links built from the menu list (none yet besides the Dashboard itself). It shows no data of its own.
- **BREAKING (internal):** remove the Home page and its route. The Dashboard takes the root route and unknown paths redirect to it.
- Move the page frame (width and padding) from the individual feature pages into the shell.
- Add a dark theme and a header icon button that switches between light and dark. The first visit follows the operating system, the choice is remembered in the browser, and the right theme is applied before the first paint.
- Add tests for the menu, shell, responsive behavior, theme and Dashboard, and update `kb/architecture/frontend.md`.

Out of scope (see the PRD): user menu, auth, guards, breadcrumbs and page titles, icon-collapse sidebar, nested menu groups, Dashboard data of any kind (counts, charts, recent activity), a backend summary endpoint, the Todo feature (its own PRD), a "follow the system" third option, server-stored preferences. No new libraries and no backend changes.

Assumptions:
- Breakpoint: 768px (Tailwind's `md`). The sidebar stays visible via CSS at that width; the overlay is a Spartan `sheet` (side left), part of the Spartan UI components installed by `frontend-foundation`.
- Theme: two states only (light and dark). Dark colors already exist in `styles.css` (Spartan's generated `:root.dark` block), so no new colors are designed; the switch toggles the `dark` class on `<html>`. The choice is stored in `localStorage`; if storage is unavailable the switch still works for the visit.
- Active-entry highlighting uses the router's own active-link matching, with exact matching for the Dashboard root entry.
- The menu list lives in `core/navigation` so both the shell and the Dashboard's quick links read it without a cross-feature import.
- The Todo feature has been removed from the foundations (see `frontend-foundation`), so the menu and Dashboard start with nothing but the Dashboard. The Dashboard has no data and calls no backend until a feature PRD adds content to it.
- The `frontend-foundation` change is not archived yet. Its Home and unknown-route requirements are superseded by this change, so it should be archived first, and the corresponding delta is then applied to the synced `frontend-app-foundation` spec (see the final task).

## Capabilities

### New Capabilities
- `app-shell`: layout, navigation menu, responsive sidebar, routing inside the shell, removal of Home.
- `app-dashboard`: the Dashboard landing page with welcome text and quick links built from the menu list.

### Modified Capabilities
- `frontend-app-foundation`: the "Routing with lazy-loaded features" and "Home page" requirements are removed (the shell and Dashboard replace them) and a smaller "Lazy-loaded features" requirement is added.

## Impact

- Frontend only: `app.ts`, `app.routes.ts`, new `shell` and `features/dashboard` code, new `core/navigation`, removal of `features/home`.
- The Todo feature is not part of this change; its removal is handled in `frontend-foundation`.
- `kb/architecture/frontend.md` is updated. The backend is untouched.
- No new dependencies.
