# app-shell Specification

## Purpose
Defines the frame around every frontend screen: header, sidebar navigation menu and content area, and how they behave on small and large screens.

## Requirements

### Requirement: Shell layout on every page
Every page SHALL be displayed inside a layout with a header, a sidebar and a content area. The header SHALL show the application name. The content area SHALL display the current page, and the layout SHALL supply the page width and padding so feature pages do not provide their own frame.

#### Scenario: Page inside shell
- **WHEN** the user opens any page
- **THEN** the header, sidebar and content area are shown and the page appears in the content area

#### Scenario: Notifications unaffected
- **WHEN** an action raises a notification or a confirmation dialog on any page
- **THEN** it is shown over the page as before, independent of the layout

#### Scenario: No user menu
- **WHEN** the header is displayed
- **THEN** it contains no user or account menu

### Requirement: Navigation menu
The sidebar SHALL list navigation entries, each with a label, an icon and a destination, taken from one static list. The initial entry SHALL be Dashboard, and each future module adds its own entry. The entry matching the current page SHALL be visibly highlighted, and choosing an entry SHALL navigate to its destination. The menu SHALL NOT vary by permissions.

#### Scenario: Initial entries
- **WHEN** the menu is displayed
- **THEN** it lists Dashboard with an icon

#### Scenario: Navigate
- **WHEN** the user chooses an entry
- **THEN** its destination is shown in the content area

#### Scenario: Highlight current entry
- **WHEN** the user is on a page beneath an entry's destination
- **THEN** that entry is highlighted and Dashboard is not

#### Scenario: Dashboard highlight is exact
- **WHEN** the user is on any page other than the application root
- **THEN** the Dashboard entry is not highlighted

#### Scenario: Adding an entry
- **WHEN** a developer adds one item to the list and a route for a new module
- **THEN** the entry appears in the menu without changes to the shell layout

### Requirement: Responsive sidebar
At a width of 768 pixels or more the sidebar SHALL be visible beside the content. Below 768 pixels the sidebar SHALL be hidden and a header button SHALL open it as an overlay over the content. Choosing an entry in the overlay SHALL close it, and the overlay SHALL also be closable without choosing an entry.

#### Scenario: Wide screen
- **WHEN** the window is 768 pixels wide or more
- **THEN** the sidebar is displayed next to the content and the header menu button is not shown

#### Scenario: Open overlay
- **WHEN** the window is narrower than 768 pixels and the user activates the header menu button
- **THEN** the menu opens as an overlay

#### Scenario: Close after choosing
- **WHEN** the user chooses an entry in the overlay
- **THEN** the overlay closes and the chosen page is shown

#### Scenario: Close without choosing
- **WHEN** the overlay is open and the user dismisses it
- **THEN** it closes and the current page stays shown

### Requirement: Keyboard and screen reader access
The menu entries and the header menu button SHALL be operable with the keyboard and SHALL have accessible names.

#### Scenario: Keyboard navigation
- **WHEN** the user tabs to a menu entry and presses Enter
- **THEN** the destination is opened

#### Scenario: Button name
- **WHEN** a screen reader reads the header menu button
- **THEN** it announces a name that describes opening the menu

### Requirement: Routing inside the shell
All feature routes SHALL be displayed inside the shell. The root route SHALL show the Dashboard, and a path matching no route SHALL redirect to the Dashboard. The Home page and its route SHALL NOT exist. No route guard SHALL be introduced.

#### Scenario: Root shows Dashboard
- **WHEN** the user opens the application root
- **THEN** the Dashboard is shown in the shell

#### Scenario: Unknown path
- **WHEN** the user opens a path that matches no route
- **THEN** the application redirects to the Dashboard

#### Scenario: Home removed
- **WHEN** the application is searched for a Home page or Home route
- **THEN** neither exists

### Requirement: Light and dark theme
The application SHALL provide a light theme and a dark theme, and the header SHALL contain an icon button that switches between them. The button SHALL show the theme the user will switch to, SHALL have an accessible name that states the action, and SHALL be operable with the keyboard. All screens and components SHALL follow the selected theme. The theme SHALL NOT depend on a backend call.

#### Scenario: Switch to dark
- **WHEN** the application is in light mode and the user activates the theme button
- **THEN** every screen and component is shown in the dark theme, the button now shows a sun, and its accessible name is "Switch to light theme"

#### Scenario: Switch back to light
- **WHEN** the application is in dark mode and the user activates the theme button
- **THEN** the light theme is shown, the button shows a moon, and its accessible name is "Switch to dark theme"

#### Scenario: Choice remembered
- **WHEN** the user chooses dark and later reloads the application or opens it again in the same browser
- **THEN** the dark theme is shown

#### Scenario: First visit follows the system
- **WHEN** the user opens the application for the first time and the operating system prefers a dark color scheme
- **THEN** the dark theme is shown

#### Scenario: First visit with no preference
- **WHEN** the user opens the application for the first time and the operating system has no dark preference
- **THEN** the light theme is shown

#### Scenario: No flash
- **WHEN** the application loads with dark chosen
- **THEN** the page is never shown in the light theme before the dark theme is applied

#### Scenario: Storage unavailable
- **WHEN** the browser does not allow storing the choice
- **THEN** the switch still changes the theme for the current visit and nothing fails

#### Scenario: Overlays follow the theme
- **WHEN** the dark theme is active and the user opens a dialog, the mobile menu or triggers a notification
- **THEN** each is shown in the dark theme

### Requirement: Comfortable dark-mode text
In the dark theme, normal text SHALL be a softened light gray rather than near-white, SHALL keep a contrast ratio of at least 4.5:1 against the dark backgrounds, and secondary text SHALL remain dimmer than normal text. Light-mode colors SHALL be unchanged.

#### Scenario: Softened text
- **WHEN** the dark theme is active
- **THEN** body, card, dialog, menu and table text uses a light gray that is visibly dimmer than white

#### Scenario: Still readable
- **WHEN** the dark theme is active
- **THEN** normal text against the page background has a contrast ratio of at least 4.5:1

#### Scenario: Light mode unchanged
- **WHEN** the light theme is active
- **THEN** its text and background colors are the same as before this requirement

### Requirement: Shell stays out of feature lazy loading
The shell and menu SHALL be part of the initial download, and feature code SHALL remain loaded on demand.

#### Scenario: Feature code not in initial download
- **WHEN** the application first loads
- **THEN** the code of lazy-loaded features is not part of the initial download
