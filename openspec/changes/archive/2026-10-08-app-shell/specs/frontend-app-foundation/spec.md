# Spec Delta

## REMOVED Requirements

### Requirement: Routing with lazy-loaded features
**Reason**: The application shell now owns routing: all pages are displayed inside the shell, the root route shows the Dashboard, and unknown paths redirect to the Dashboard (see the `app-shell` capability, "Routing inside the shell"). The old requirement also forbade a shell, a dashboard and menus, which no longer applies.
**Migration**: Use "Routing inside the shell" in `app-shell` and the new "Lazy-loaded features" requirement below.

### Requirement: Home page
**Reason**: The Home page is replaced by the Dashboard (`app-dashboard` capability).
**Migration**: The Dashboard is the page shown at the application root.

## ADDED Requirements

### Requirement: Lazy-loaded features
The application SHALL support adding features as routes that are loaded on demand, and SHALL NOT introduce route guards in this change.

#### Scenario: Feature added on demand
- **WHEN** a developer adds a feature as a lazy-loaded route
- **THEN** the feature code is not part of the initial download and is fetched when the user first navigates to it
