# Spec Delta

## Purpose

Defines the baseline frontend application: how it is built, routed, themed and connected to the backend, so later features can be added by following one set of conventions.

## ADDED Requirements

### Requirement: Frontend project location and build
The frontend SHALL be a single Angular application located directly in the `frontend/` folder, using standalone components without NgModules and with strict type checking enabled. It SHALL build without errors and run locally.

#### Scenario: Project layout
- **WHEN** the `frontend/` folder is listed
- **THEN** the application's `package.json` and source folder are direct children and there is no nested application folder

#### Scenario: Build and run
- **WHEN** a developer installs dependencies and runs the production build
- **THEN** the build succeeds with no errors

#### Scenario: Strict typing
- **WHEN** code with a type error is added
- **THEN** the build fails

### Requirement: Routing with lazy-loaded features
The application SHALL define routes for a Home page and for the Todo reference feature, and features SHALL be loaded on demand. It SHALL NOT include navigation menus, an application shell, a dashboard or route guards.

#### Scenario: Home route
- **WHEN** a user opens the application root
- **THEN** the Home page is shown

#### Scenario: Todo route is lazy
- **WHEN** the application first loads
- **THEN** the Todo feature code is not part of the initial download and is fetched when the user navigates to it

#### Scenario: Unknown route
- **WHEN** a user opens a path that matches no route
- **THEN** the application redirects to Home

### Requirement: Home page
The Home page SHALL be minimal and SHALL confirm that the frontend loaded successfully.

#### Scenario: Home page content
- **WHEN** the Home page is displayed
- **THEN** it shows a short heading that identifies the application and a link to the Todo list

### Requirement: Themed component library
The application SHALL use the Spartan UI component library, styled with Tailwind CSS and Lucide icons, with one default (light) theme applied globally and a dark variant that the application shell can switch on.

#### Scenario: Theme applied
- **WHEN** any page with a Spartan UI component is displayed
- **THEN** the component is rendered with the default theme styles and icons display correctly

### Requirement: Application font
All text in the application SHALL be displayed in the Roboto font, served with the application itself and not from an external host, with a generic sans-serif fallback while it loads.

#### Scenario: Roboto applied
- **WHEN** any page is displayed
- **THEN** its text is rendered in Roboto, including text inside form controls and buttons

#### Scenario: Works offline
- **WHEN** the application is used without internet access
- **THEN** the text is still shown in Roboto because no external font request is made

### Requirement: Configurable API base URL
All backend requests SHALL be sent to a base URL taken from application configuration. Feature components SHALL NOT contain backend URLs, and only feature services SHALL call the backend.

#### Scenario: Base URL changed
- **WHEN** the configured API base URL is changed
- **THEN** every request goes to the new base without any change to feature code

#### Scenario: Development proxy
- **WHEN** the application runs under the development server
- **THEN** requests to the API path reach the backend without browser cross-origin errors

### Requirement: Small, focused HTTP interceptors
The application SHALL provide HTTP interceptor infrastructure for common request and response concerns. Interceptors SHALL NOT contain feature-specific logic and SHALL NOT implement authentication in this change.

#### Scenario: Interceptor applies to all requests
- **WHEN** any feature service sends a request
- **THEN** the registered interceptors process it without the feature opting in

### Requirement: Feature-based organization
Business functionality SHALL be organized by feature, with a separate `shared` area for reusable UI that contains no feature-specific logic. Shared components SHALL be added only where there is real reuse, and Spartan UI components SHALL be used directly unless a wrapper is justified.

#### Scenario: New feature added
- **WHEN** a developer adds a feature by following the FeatureTemplate conventions
- **THEN** no existing feature needs to change, other than adding its route
