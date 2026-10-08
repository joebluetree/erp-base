# Design

## Context

Greenfield: no frontend exists. The backend (archived `backend-foundation`) exposes `GET /api/todos`, `GET /api/todos/{id}`, `POST /api/todos` (create when `id` is null, update otherwise; 201 or 200), and `DELETE /api/todos/{id}` (204). Errors are RFC 7807 problem details with `traceId`; validation failures are 400 with an `errors` map keyed by property name (`Title`, `Description`). The backend has no CORS and no fixed port. Node 24 and npm 11 are installed. Latest stable Angular CLI is 22.x; `@spartan-ng/brain` 1.6 supports Angular 21 to 22. See proposal.md for motivation and assumptions.

## Goals / Non-Goals

**Goals:**
- A buildable, tested Angular app whose Todo feature is the template for later features.
- The smallest set of conventions that the PRD requires, no framework-style abstractions.

**Non-Goals:**
- Anything in the PRD's out-of-scope list; any generic CRUD, table or form framework; changes to the backend.

## Decisions

**Location and tooling.** Generate with the Angular CLI (`ng new`) into `frontend/` itself so `package.json` sits at `frontend/` (FR-016), with the CLI's current defaults: standalone, strict TypeScript and templates, SCSS or CSS (default), routing on, its default test runner. Install Tailwind CSS v4 (Spartan requires it) through `@tailwindcss/postcss` and `.postcssrc.json`. Alternative: Nx or a workspace with several apps, rejected (not needed, FR-005 "avoid unnecessary abstractions").

**Folder structure** (inside `frontend/src/app`):
```
core/            app-wide singletons: api config, interceptors, notification + error services
shared/          reusable UI only; empty until a real reuse need appears
features/
  home/          Home page
  feature-template/
    todos/       pages, components, models, service, routes, tests
app.routes.ts    lazy routes
app.config.ts    providers
```
Features import from `core` and `shared`; `core` and `shared` never import from features; features never import from other features. Alternative: a barrel/layered folder-by-type layout, rejected for poor feature isolation.

**Routing.** `''` → Home, `'todos'` → `loadChildren` of the Todo feature routes (list, `new`, `:id/edit`), wildcard redirects to Home. Todo form is a routed page rather than a dialog so Add/Edit behave the same and the edit page is addressable. No guards or menu; Home carries a plain link to the list.

**Spartan UI.** Spartan is Tailwind CSS v4 plus Angular CDK, with two layers: `@spartan-ng/brain` (unstyled accessible primitives, an npm package) and `helm` (Tailwind-styled components that the Spartan CLI generates as source into the project). The theme (neutral) comes from `ng g @spartan-ng/cli:init` as CSS variables in `styles.css`. `components.json` points the CLI at `src/app/shared/ui`, so helm components are imported through the `@spartan-ng/helm/*` path aliases (`button`, `input`, `textarea`, `checkbox`, `label`, `card`, `table`, `sonner`, `alert-dialog`, `sheet`, `spinner`). Icons are Lucide through `ng-icon` (`@ng-icons/lucide`). Components are used directly, with Tailwind classes for layout; no wrappers. **Font.** Roboto, self-hosted through the `@fontsource/roboto` npm package (OFL license) at weights 400, 500 and 700. `styles.css` imports those weights and sets Roboto first in the theme's `--font-sans` variable, with `sans-serif` as the fallback; Tailwind and the Spartan components inherit it, so there is one place to change it. Alternative: the Google Fonts link, rejected because it makes an external request, fails offline and shares the visitor's IP with a third party. Alternative: a variable-font package, rejected as unnecessary for three weights. Alternative considered for the UI library: PrimeNG 22, dropped because it requires a PrimeUI license key (a banner is shown without one) and the key would ship in the client bundle.

**API base URL.** An `API_BASE_URL` injection token read from `environment` files (`apiBaseUrl: '/api'` in all environments for now). A tiny functional interceptor prefixes relative request URLs with it, so services call `http.get('todos')` and components never see a URL. In development `ng serve` uses `proxy.conf.json` mapping `/api` to the backend URL (default `http://localhost:5000`, adjustable in that file). This avoids touching backend CORS. Alternative: add CORS to the backend, rejected for this change.

**Interceptors.** Two functional interceptors registered with `provideHttpClient(withInterceptors([...]))`: `apiBaseUrlInterceptor` and `httpErrorInterceptor`. The error interceptor maps failures to a typed `ApiError { status, message, fieldErrors? }` and rethrows it. It shows the notification for everything except 400-with-field-errors, which it leaves to the caller. Callers that surface their own message are not needed: the Todo service lets errors propagate and does not notify on failure, so each failure yields one notification.

**Error messages.** `core/errors` has `toApiError(HttpErrorResponse)` (pure function, unit-tested): status 0 → "could not reach the server", 404 → "not found", 5xx → generic "something went wrong, try again", 400 with `errors` → `fieldErrors` keyed by lower-camel property, other 4xx → the problem `title` when present else generic. Raw `detail`, exceptions and stack traces are never shown.

**State.** `TodoService` (`providedIn: 'root'` is avoided; provided in the feature route's `providers` so state lives with the feature) holds `todos = signal<Todo[]>([])`, `loading`, and exposes readonly signals plus `load()`, `get(id)`, `save(request)`, `remove(id)`. `save` calls the single backend `POST`, then updates the signal (insert or replace); `remove` removes from the signal on success. Components read signals directly. No RxJS stores, no NgRx.

**Todo list.** The Spartan table (`hlmTable` and friends) over signals: a search text box (`computed` filter over `title` and `description`), clickable column headers that sort (second click reverses, `aria-sort` set), a `computed` page of 10 rows with Previous/Next buttons and "Page x of y", a loading indicator (`hlm-spinner`) and an empty-state row. Row actions: edit (router link) and delete, which opens a Spartan alert dialog and only then calls `remove`. Spartan's table is styling only, so paging, sorting and filtering are plain signal code. Backend returns everything, so client-side paging is correct for now; server paging is a future PRD.

**Todo form.** Typed Reactive Form with `title` (required, max 200), `description` (max 2000), `isCompleted`. Route `new` creates; `:id/edit` loads the todo (from state, else `get`) and patches the form. Save sends `{ id?, title, description, isCompleted }` through `TodoService.save`. A small helper in the feature maps backend `fieldErrors` onto form control errors (`serverError`), shown beneath each field with one shared message pattern; invalid forms mark all controls touched and send nothing; Save is disabled while saving. Success: notification, navigate to list.

**Models.** `Todo` and `TodoSaveRequest` interfaces mirror the backend DTOs.

**Testing.** Angular's default runner with `HttpTestingController` for `TodoService` and `toApiError`/interceptor tests, and component tests for list and form using the testing router and a stubbed `TodoService`. `npm test` runs headless and once.

**Docs.** Written last from the implemented code at `kb/architecture/frontend.md`, plus `frontend/README.md` with setup commands.

## Risks / Trade-offs

- [Spartan helm components are generated source that the project then owns, and Spartan's APIs change between versions] → Pin the CLI and brain versions, read the generated source before using a component, and verify with a build before writing features.
- [Backend port is not fixed, so the proxy default can be wrong] → Keep it in `proxy.conf.json`, document it in the README.
- [Backend needs Oracle 10g access to serve real data] → Component and service tests use fakes; the end-to-end check needs the backend running and is reported separately if it can't be run.
- [Client-side paging does not scale] → Accepted; the PRD defers advanced paging and the backend lists everything.
- [Error interceptor skipping 400 field errors couples it to the form flow] → Single, documented rule, covered by tests.

## Open Questions

- Backend URL to put in `proxy.conf.json` (assumed `http://localhost:5000`); easily changed later.
