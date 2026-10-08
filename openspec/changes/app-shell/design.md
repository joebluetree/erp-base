# Design

## Context

The frontend (`frontend/`, from the `frontend-foundation` change) is an Angular 22 standalone, zoneless app with Spartan UI (Tailwind CSS v4). Today `app.ts` holds only `hlm-toaster` and a `router-outlet`. `app.routes.ts` has `''` → `Home` (lazy), `todos` → lazy Todo routes, and a wildcard redirect to `''`. The Todo list and form templates and the Home page each wrap themselves in `<main class="page">`. `TodoService` is provided by the Todo routes (not root) and exposes `todos`, `loading`, `error` signals and `load()`; its failures are already reported once by the HTTP error interceptor. Spartan's `sheet` helm component (`@spartan-ng/helm/sheet`, generated into `shared/ui`) is available. See proposal.md for motivation and `kb/platform/app-shell.md` for requirements.

## Goals / Non-Goals

**Goals:**
- One layout around all pages, a one-list menu, a responsive sidebar, and a Dashboard landing page.
- Zero new dependencies and no backend change.

**Non-Goals:**
- Anything in the PRD's out-of-scope list; a generic layout or menu framework.

## Decisions

**Layout as a parent route.** A `Shell` component is the `component` of a root route whose `children` are Dashboard (`''`) and the lazy `todos` routes. The wildcard redirect stays outside the shell. `App` keeps `hlm-toaster` and now a `router-outlet` that renders `Shell`, so notifications stay independent of the layout. Alternative: wrap every page in a `<app-shell>` tag, rejected (each future page would have to remember it).

```
App: hlm-toaster, <router-outlet>
 `- Shell: header | sidebar(nav) | <main class="page"><router-outlet/></main>
      `- '' Dashboard      `- 'todos' ... (lazy)
```

**Page frame moves into the shell.** The shell renders `<main class="page">` around its outlet. The Todo list and form templates (and the deleted Home) drop their own `<main class="page">` wrapper and keep the heading and content. Only markup changes.

**Menu list.** `core/navigation/nav-items.ts` exports `interface NavItem { label; icon; route }` and `const NAV_ITEMS: readonly NavItem[]` with Dashboard (`/`, Lucide `lucideHouse`) and Todos (`/todos`, `lucideSquareCheck`). The icons are registered once in a `NAV_ICONS` map in the same file, which the menu and the Dashboard pass to `provideIcons`. `core` is importable by shell and features alike, so the Dashboard reads it for quick links without a cross-feature import. Alternative: route `data` driving the menu, rejected as a second place to register a screen.

**Nav component.** `shell/app-nav` renders `<nav aria-label="Main">` with one `<a routerLink routerLinkActive="active ...">` per item and a Lucide `ng-icon`. Dashboard uses `routerLinkActiveOptions: { exact: true }`; others use prefix matching, so the form under `/todos/...` highlights Todos. It emits `navigated` on link click. Plain anchors keep keyboard activation and accessible names for free. Spartan has no menu component that fits a simple router-driven sidebar, so the links are styled with Tailwind classes directly.

**Responsive sidebar.** The same `app-nav` is rendered twice: in a desktop `<aside>` and inside a Spartan `hlm-sheet` (`side="left"`, modal). Tailwind's `md` breakpoint (768px) hides the `<aside>` below it (`hidden md:block`) and shows the header's menu button below it (`md:hidden`). The sheet's open state is a `menuOpen` signal in `Shell`, bound to the sheet's `state` input and `stateChanged` output: the button sets it true, `navigated` and the sheet's own dismiss (close button, overlay click, Escape) set it false. Doing the breakpoint with Tailwind classes avoids `matchMedia` code and keeps tests simple, since jsdom does not apply media queries and tests drive the signal and the buttons directly. Alternative: a resize listener with a signal, rejected as more code and test setup.

**Header.** App name "iErp" and a button with `aria-label="Open menu"` (Lucide `lucideMenu`). No user slot.

**Dashboard.** `features/dashboard/dashboard.ts` with providers `[TodoService]` so it owns its own instance, calls `load()` in the constructor, and computes `total`, `open`, `completed` from `todos()`. States: `loading()` shows a Spartan `hlm-spinner` in place of the cards; `error()` shows a friendly message in place of the cards; otherwise three Spartan cards (`hlmCard`). Quick links come from `NAV_ITEMS` excluding the Dashboard entry itself. It never calls `save` or `remove`. Importing `TodoService` is the one documented cross-feature exception. Alternative: move `TodoService` to shared, rejected because it is feature state and would blur the boundary rules the foundation established.

**Home removal.** Delete `features/home`. Root route becomes the Dashboard, wildcard redirects to `''`. Nothing else references Home.

**Tests.** Menu list; `app-nav` (entries, links, highlighting, exact match, `navigated`); `Shell` with a test router (menu shown, routed page rendered, button opens the sheet, choosing an entry closes it, dismissing closes it); `Dashboard` with `HttpTestingController` (counts, zero, loading, failure message with one error notification, links, read-only). All existing tests keep passing.

**Theme.** `core/theme/theme.service.ts` (`providedIn: 'root'`) holds `theme = signal<'light' | 'dark'>`, with `toggle()`. The initial value is the stored choice (`localStorage` key `ierp-theme`, read and written inside try/catch so a blocked storage only disables remembering), else `matchMedia('(prefers-color-scheme: dark)')`, else light. An `effect` sets or removes the `dark` class on `document.documentElement` and sets `color-scheme` to match, which is what the generated `:root.dark` block in `styles.css` already keys on. To avoid a flash, a short inline script in `index.html` applies the same stored-or-system decision to `<html>` before the app bootstraps; both use the same rule (stored choice, else system preference, else light), so they cannot disagree; the service then re-applies the class itself. The header gets an icon button (`lucideMoon` in light, `lucideSun` in dark) with `aria-label` "Switch to dark theme" / "Switch to light theme", placed at the right end of the header, in the shell component. Dark-mode text is softened in the same `:root.dark` block of `styles.css`: the near-white text tokens (`--foreground`, `--card-foreground`, `--popover-foreground`, `--secondary-foreground`, `--accent-foreground`, `--sidebar-foreground`, `--sidebar-accent-foreground`, all `oklch(0.985 0 0)`) become `oklch(0.87 0 0)` (about `#d4d4d4`). Contrast against the dark background (`oklch(0.145 0 0)`) is about 13:1, well above AA (4.5:1). Muted text stays at `0.708`, so it is still dimmer than normal text. Backgrounds, borders, the primary button and light mode are unchanged; every component follows because they all use these tokens. Alternatives: a lower value (about 0.80) if 0.87 is still too bright. Alternatives: a third "system" option, rejected for now (the PRD asks for light and dark). Tailwind's `dark:` variant must be tied to the `.dark` class (`@custom-variant dark`), which Spartan's preset should already provide; check this when implementing.

**Docs.** Update `kb/architecture/frontend.md`: folder structure, routing, the shell, menu list and how to add an entry, responsive behavior, Dashboard and its exception, the removed Home, and the adjusted boundary rule.

## Risks / Trade-offs

- [Spartan's overlays (sheet, alert dialog) and the Sonner toaster render in portals and may not pick up the dark class or theme] → The class is on `<html>`, so portals inherit it; check the toaster, which has its own `theme` input, and fix it explicitly if it stays light.
- [The inline script and the service could disagree on the initial theme] → One shared rule (stored value, else system, else light) in both, and the service starts from the class the script set.
- [A strict Content-Security-Policy would block the inline script] → None is configured today; note it in the architecture doc.
- [Sheet rendering in jsdom may behave differently from a browser] → Keep assertions on the `menuOpen` signal and rendered nav; verify visually by running the app.
- [Two `app-nav` instances in the DOM may confuse queries and screen readers] → The desktop one is hidden with CSS (`display: none`) below 768px and the sheet content is only rendered when open; test by scoping queries.
- [Dashboard's own `TodoService` instance means a second request when going Dashboard → Todos] → Accepted; each screen loads fresh data, and sharing state would couple the two features.
- [Dashboard failure and a missing database] → The Oracle `TODO_ITEMS` table is currently absent, so the Dashboard shows its failure state until the migration is reapplied; this also exercises the failure path.
- [Removing the Home page and its route changes the app's root] → Only the Dashboard replaces it; no links to Home exist besides the foundation's own docs, which this change updates.

## Open Questions

None blocking.
