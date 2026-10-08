## 1. Project setup

- [x] 1.1 Generate the Angular app with the CLI directly into `frontend/` (standalone, strict, routing, no SSR); confirm `package.json` is at `frontend/` root
- [x] 1.2 Install Tailwind CSS v4 and Spartan UI (brain, CLI, CDK, ng-icons Lucide), run the Spartan init for the theme, and generate the helm components into `src/app/shared/ui`; confirm versions resolve with no peer-dependency errors
- [x] 1.3 Verify `npm run build` and the test command pass on the untouched scaffold
- [x] 1.4 Create the folder structure (`core`, `shared`, `features/home`, `features/feature-template/todos`)
- [x] 1.5 Install `@fontsource/roboto`, import weights 400/500/700 in `styles.css`, set Roboto first in `--font-sans`, and check the build, that the font files are bundled, and that form controls inherit it

## 2. Core infrastructure

- [x] 2.1 Add environment files and the `API_BASE_URL` token
- [x] 2.2 Add `proxy.conf.json` for `/api` and wire it into `ng serve`
- [x] 2.3 Add `apiBaseUrlInterceptor`
- [x] 2.4 Add `ApiError` model and `toApiError` mapping (status 0, 400 with field errors, 404, 5xx, other)
- [x] 2.5 Add `httpErrorInterceptor` using `NotificationService`, leaving 400 field errors to callers
- [x] 2.6 Add `NotificationService` (success, info, warn, error) over Spartan Sonner (`toast`)
- [x] 2.7 Configure `app.config.ts`: router, `HttpClient` with interceptors, no UI-library providers needed (Spartan has none)
- [x] 2.8 Add `hlm-toaster` once in the root component (the delete confirmation is a Spartan alert dialog in the Todo list)

## 3. Routing and Home

- [x] 3.1 Add `app.routes.ts`: Home, lazy `todos`, wildcard redirect to Home
- [x] 3.2 Add the minimal Home page with heading and link to the Todo list

## 4. Todo reference feature

- [x] 4.1 Add `Todo` and `TodoSaveRequest` models
- [x] 4.2 Add `TodoService` with signal state and `load`, `get`, `save`, `remove`; provide it in the feature routes
- [x] 4.3 Add Todo list page: Spartan table with client-side pagination, sorting, search, loading and empty state, edit and delete actions with confirmation and notifications
- [x] 4.4 Add Todo form page: typed Reactive Form, validation messages, server field-error mapping, Save and Cancel, saving state, create and edit modes, notifications
- [x] 4.5 Add Todo routes (`''`, `new`, `:id/edit`)
- [ ] 4.6 Run the app against the backend (or report why not) and exercise list, create, edit and delete

## 5. Tests

- [x] 5.1 `toApiError` and interceptor tests
- [x] 5.2 `TodoService` tests with `HttpTestingController`
- [x] 5.3 Todo list component tests (rows, empty, search, confirm delete)
- [x] 5.4 Todo form component tests (validation, invalid form not sent, save, cancel, server field errors)
- [x] 5.5 Run the full suite and the production build; record results

## 6. Documentation and verification

- [x] 6.1 Write `frontend/README.md` (install, API URL and proxy, run, test, build)
- [x] 6.2 Write `kb/architecture/frontend.md` from the implemented code
- [ ] 6.3 Walk the PRD acceptance checklist and confirm each item, noting any that could not be verified
