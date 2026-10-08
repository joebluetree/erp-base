# Proposal

## Why

The frontend shows each page bare: Home and the Todo screens each draw their own page frame, and there is no way to move between screens except typed links. Future ERP modules need one consistent frame, a navigation menu, and a landing page. `kb/platform/app-shell.md` defines it; the frontend foundation deliberately left it out.

## What Changes

- Add an application shell (header, sidebar, content area) that wraps every feature route. The header shows the app name and, on small screens, a menu button.
- Add a navigation menu defined as one static typed list, starting with Dashboard and Todos, with the current entry highlighted.
- Make the sidebar responsive: beside the content at 768px and wider; below that, hidden and opened as an overlay from the header button.
- Add a Dashboard as the landing page with Todo total, open and completed cards (computed from the existing list API) and quick links.
- **BREAKING (internal):** remove the Home page and its route. The Dashboard takes the root route and unknown paths redirect to it.
- Move the page frame (width and padding) from the individual feature pages into the shell.
- Document one exception to the "features never import other features" rule: the Dashboard may read Todo data.
- Add a dark theme and a header icon button that switches between light and dark. The first visit follows the operating system, the choice is remembered in the browser, and the right theme is applied before the first paint.
- Add tests for the menu, shell, responsive behavior, theme and Dashboard, and update `kb/architecture/frontend.md`.

Out of scope (see the PRD): user menu, auth, guards, breadcrumbs and page titles, icon-collapse sidebar, nested menu groups, Dashboard charts and recent activity, a backend summary endpoint, a "follow the system" third option, server-stored preferences. No new libraries and no backend changes.

Assumptions:
- Breakpoint: 768px (Tailwind's `md`). The sidebar stays visible via CSS at that width; the overlay is a Spartan `sheet` (side left), part of the Spartan UI components installed by `frontend-foundation`.
- Theme: two states only (light and dark). Dark colors already exist in `styles.css` (Spartan's generated `:root.dark` block), so no new colors are designed; the switch toggles the `dark` class on `<html>`. The choice is stored in `localStorage`; if storage is unavailable the switch still works for the visit.
- Active-entry highlighting uses the router's own active-link matching, with exact matching for the Dashboard root entry.
- The menu list lives in `core/navigation` so both the shell and the Dashboard's quick links read it without a cross-feature import.
- Dashboard counts load the full list, as the PRD allows. The Dashboard keeps its own `TodoService` instance, so it does not share state with the Todo screens and each reloads on entry.
- The `frontend-foundation` change is not archived yet. Its Home and unknown-route requirements are superseded by this change, so it should be archived first, and the corresponding delta is then applied to the synced `frontend-app-foundation` spec (see the final task).

## Capabilities

### New Capabilities
- `app-shell`: layout, navigation menu, responsive sidebar, routing inside the shell, removal of Home.
- `app-dashboard`: the Dashboard landing page, Todo counts and quick links, and its read-only access to Todo data.

### Modified Capabilities
<!-- None yet. `frontend-app-foundation` (Home page, routing, feature organization) is still in the unarchived frontend-foundation change; its delta is added after that change is archived. -->

## Impact

- Frontend only: `app.ts`, `app.routes.ts`, new `shell` and `features/dashboard` code, new `core/navigation`, edits to the Todo list and form templates (remove their page wrapper), removal of `features/home`.
- Existing Todo behavior and tests are unchanged apart from the markup wrapper.
- `kb/architecture/frontend.md` is updated. The backend is untouched.
- No new dependencies.
