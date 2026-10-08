# iErp frontend

Angular 22 standalone app with Spartan UI (Tailwind CSS v4). Architecture and conventions: `kb/architecture/frontend.md`.

## Setup

Requires Node.js 22 or later and npm.

```bash
npm install
```

## Point the app at the backend

The app calls the API at the base URL in `src/environments/environment*.ts` (`apiBaseUrl`, default `/api`).

In development, `ng serve` proxies `/api` to the backend using `proxy.conf.json` (default `http://localhost:5000`). Change the `target` there if your backend runs elsewhere. The backend must be running, with its database configured (see `backend/README.md`), for the Todo screens to load data:

```bash
dotnet run --project backend/iErp.Api --urls http://localhost:5000
```

For a deployment, set `apiBaseUrl` in `environment.ts` to the real API URL (and allow the origin in the backend's CORS settings if the API is on a different origin).

## Run, test, build

```bash
npm start                  # dev server at http://localhost:4200
npm test -- --no-watch     # unit and component tests, once
npm run build              # production build into dist/
```

## Spartan UI

Spartan has no license key. Its styled components (helm) are generated into `src/app/shared/ui` and owned by this project. Add one with:

```bash
npx ng g @spartan-ng/cli:ui <name>     # e.g. dialog, select, tabs
```

Generated components are imported through the `@spartan-ng/helm/<name>` path aliases.

## Theme

The header has a button that switches between light and dark. The first visit follows the operating system, and the choice is remembered in the browser (`localStorage` key `ierp-theme`). The logic is in `src/app/core/theme/theme.service.ts`, and `src/index.html` applies the saved theme before the app starts.

## Font

The app font is Roboto, self-hosted via `@fontsource/roboto` (imported in `src/styles.css`). To change it, replace the imports and the `--font-sans` variable there.
