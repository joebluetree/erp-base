## 1. Project setup

- [x] 1.1 Generate the Angular app with the CLI directly into `frontend/` (standalone, strict, routing, no SSR); confirm `package.json` is at `frontend/` root
- [x] 1.2 Install Tailwind CSS v4 and Spartan UI (brain, CLI, CDK, ng-icons Lucide), run the Spartan init for the theme, and generate the helm components into `src/app/shared/ui`; confirm versions resolve with no peer-dependency errors
- [x] 1.3 Verify `npm run build` and the test command pass on the untouched scaffold
- [x] 1.4 Create the folder structure (`core`, `shared`, `features/home`)
- [x] 1.5 Install `@fontsource/roboto`, import weights 400/500/700 in `styles.css`, set Roboto first in `--font-sans`, and check the build, that the font files are bundled, and that form controls inherit it

## 2. Core infrastructure

- [x] 2.1 Add environment files and the `API_BASE_URL` token
- [x] 2.2 Add `proxy.conf.json` for `/api` and wire it into `ng serve`
- [x] 2.3 Add `apiBaseUrlInterceptor`
- [x] 2.4 Add `ApiError` model and `toApiError` mapping (status 0, 400 with field errors, 404, 5xx, other)
- [x] 2.5 Add `httpErrorInterceptor` using `NotificationService`, leaving 400 field errors to callers
- [x] 2.6 Add `NotificationService` (success, info, warn, error) over Spartan Sonner (`toast`)
- [x] 2.7 Configure `app.config.ts`: router, `HttpClient` with interceptors, no UI-library providers needed (Spartan has none)
- [x] 2.8 Add `hlm-toaster` once in the root component

## 3. Routing and Home

- [x] 3.1 Add `app.routes.ts` with the Home route and a wildcard redirect to Home, structured so features are added as lazy routes
- [x] 3.2 Add the minimal Home page with a heading that identifies the application (no feature links)

## 4. Tests

- [x] 4.1 `toApiError` and interceptor tests (error handling and API base URL)
- [x] 4.2 Run the full suite and the production build; record results

## 5. Documentation and verification

- [x] 5.1 Write `frontend/README.md` (install, API URL and proxy, run, test, build)
- [x] 5.2 Write `kb/architecture/frontend.md` from the implemented code
- [x] 5.3 Walk the PRD acceptance checklist and confirm each item, noting any that could not be verified

## 6. Remove the Todo reference feature

- [x] 6.1 Delete `features/feature-template/todos` (models, service, routes, list and form pages) and its tests
- [x] 6.2 Remove the `todos` route from `app.routes.ts` and the link to Todos from the Home page
- [x] 6.3 Remove generated Spartan components that nothing uses any more (keep those used by the toaster, shell and theme), and their `tsconfig` path entries
- [x] 6.4 Update `frontend/README.md` and `kb/architecture/frontend.md`: remove the Todo feature, add the conventions-for-the-next-feature section marked as guidance, and update the testing and folder-structure sections
- [x] 6.5 Run the full suite and the production build; confirm no `todo` references remain in `frontend/src`
