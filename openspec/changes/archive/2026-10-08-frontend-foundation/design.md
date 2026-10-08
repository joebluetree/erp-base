# Design

## Context

Greenfield: no frontend existed. The backend (archived `backend-foundation`) uses RFC 7807 problem details with `traceId`; validation failures are 400 with an `errors` map keyed by property name. The backend has no CORS and no fixed port. Node 24 and npm 11 are installed. Latest stable Angular CLI is 22.x; `@spartan-ng/brain` 1.6 supports Angular 21 to 22. See proposal.md for motivation and assumptions, including the removal of the Todo reference feature.

## Goals / Non-Goals

**Goals:**
- A buildable, tested Angular app with the shared infrastructure every feature needs.
- The smallest set of conventions that the PRD requires, no framework-style abstractions.

**Non-Goals:**
- Anything in the PRD's out-of-scope list; the Todo feature; any generic CRUD, table or form framework; changes to the backend.

## Decisions

**Location and tooling.** Generate with the Angular CLI (`ng new`) into `frontend/` itself so `package.json` sits at `frontend/` (FR-016), with the CLI's current defaults: standalone, strict TypeScript and templates, routing on, its default test runner. Install Tailwind CSS v4 (Spartan requires it) through `@tailwindcss/postcss` and `.postcssrc.json`. Alternative: Nx or a workspace with several apps, rejected (not needed, FR-005 "avoid unnecessary abstractions").

**Folder structure** (inside `frontend/src/app`):
```
core/            app-wide singletons: api config, interceptors, notification + error services
shared/          reusable UI only (Spartan helm components in shared/ui)
features/
  home/          Home page
app.routes.ts    lazy routes
app.config.ts    providers
```
Features import from `core` and `shared`; `core` and `shared` never import from features; features never import from other features. A business feature is a folder under `features/<area>/<feature>/` with its model, service, routes, pages and tests. Alternative: a barrel/layered folder-by-type layout, rejected for poor feature isolation.

**Routing.** `''` → Home, and a wildcard that redirects to Home. Features are added as lazy `loadChildren` routes, so their code is not part of the initial download. No guards or menu.

**Spartan UI.** Spartan is Tailwind CSS v4 plus Angular CDK, with two layers: `@spartan-ng/brain` (unstyled accessible primitives, an npm package) and `helm` (Tailwind-styled components that the Spartan CLI generates as source into the project). The theme (neutral) comes from `ng g @spartan-ng/cli:init` as CSS variables in `styles.css`. `components.json` points the CLI at `src/app/shared/ui`, so helm components are imported through the `@spartan-ng/helm/*` path aliases. Only components that are used are generated. Icons are Lucide through `ng-icon` (`@ng-icons/lucide`). Components are used directly, with Tailwind classes for layout; no wrappers. **Font.** Roboto, self-hosted through the `@fontsource/roboto` npm package (OFL license) at weights 400, 500 and 700. `styles.css` imports those weights and sets Roboto first in the theme's `--font-sans` variable, with `sans-serif` as the fallback; Tailwind and the Spartan components inherit it, so there is one place to change it. Alternative: the Google Fonts link, rejected because it makes an external request, fails offline and shares the visitor's IP with a third party. Alternative: a variable-font package, rejected as unnecessary for three weights. Alternative considered for the UI library: PrimeNG 22, dropped because it requires a PrimeUI license key (a banner is shown without one) and the key would ship in the client bundle.

**API base URL.** An `API_BASE_URL` injection token read from `environment` files (`apiBaseUrl: '/api'` in all environments for now). A tiny functional interceptor prefixes relative request URLs with it, so services call `http.get('customers')` and components never see a URL. In development `ng serve` uses `proxy.conf.json` mapping `/api` to the backend URL (default `http://localhost:5000`, adjustable in that file). This avoids touching backend CORS. Alternative: add CORS to the backend, rejected for this change.

**Interceptors.** Two functional interceptors registered with `provideHttpClient(withInterceptors([...]))`: `apiBaseUrlInterceptor` and `httpErrorInterceptor`. The error interceptor maps failures to a typed `ApiError { status, message, fieldErrors? }` and rethrows it. It shows the notification for everything except 400-with-field-errors, which it leaves to the caller. A feature service lets errors propagate and does not notify on failure, so each failure yields one notification.

**Error messages.** `core/errors` has `toApiError(HttpErrorResponse)` (pure function, unit-tested): status 0 → "could not reach the server", 404 → "not found", 5xx → generic "something went wrong, try again", 400 with `errors` → `fieldErrors` keyed by lower-camel property, other 4xx → the problem `title` when present else generic. Raw `detail`, exceptions and stack traces are never shown.

**Conventions for the next feature** (guidance only, to be demonstrated by the first feature PRD; nothing in the code implements these yet):
- State: a feature service provided by the feature's routes (not `providedIn: 'root'`) holding signals (`items`, `loading`, `error`) with `load`, `save`, `remove`; no NgRx or RxJS stores.
- Lists: the Spartan table components over those signals, with client-side search, sorting and paging when the backend returns the full list, plus loading and empty states.
- Forms: typed Reactive Forms (`FormBuilder.nonNullable`), validation messages under a field once it is touched, an invalid form marks all controls touched and sends nothing, backend `fieldErrors` mapped onto the matching controls, Save disabled while saving.
- Delete: a Spartan alert dialog before the request.

**Testing.** Angular's default runner with `HttpTestingController` for the interceptors and `toApiError`. `npm test` runs headless and once.

**Docs.** Written last from the implemented code at `kb/architecture/frontend.md`, plus `frontend/README.md` with setup commands. The conventions above appear in the doc under a heading that says they are guidance and not yet implemented.

## Risks / Trade-offs

- [Spartan helm components are generated source that the project then owns, and Spartan's APIs change between versions] → Pin the CLI and brain versions, read the generated source before using a component, and verify with a build before writing features.
- [Backend port is not fixed, so the proxy default can be wrong] → Keep it in `proxy.conf.json`, document it in the README.
- [With no feature in the code, the conventions and the Spartan table, alert dialog and form pieces are untested in a real screen] → Unused generated components are removed (regenerating one is a single CLI command), the first feature PRD generates what it needs and proves the conventions, and the architecture doc marks them as guidance.
- [Error interceptor skipping 400 field errors couples it to the form flow] → Single, documented rule, covered by interceptor tests.

## Open Questions

- Backend URL to put in `proxy.conf.json` (assumed `http://localhost:5000`); easily changed later.
