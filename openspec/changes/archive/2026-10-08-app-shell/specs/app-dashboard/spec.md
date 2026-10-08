# Spec Delta

## Purpose

Defines the Dashboard, the landing page that welcomes the user and links to the available features.

## ADDED Requirements

### Requirement: Dashboard landing page
The Dashboard SHALL be the page shown at the application root. It SHALL show a heading and a short welcome text.

#### Scenario: Landing page content
- **WHEN** the user opens the application root
- **THEN** the Dashboard is shown with its heading and welcome text

### Requirement: Quick links
The Dashboard SHALL show quick links to the available features, built from the same list as the navigation menu and excluding the Dashboard itself. While there are no such entries, the quick-links section SHALL NOT be shown.

#### Scenario: No features yet
- **WHEN** the menu contains only the Dashboard entry
- **THEN** the Dashboard shows no quick-links section

#### Scenario: New module link
- **WHEN** a menu entry is added for a new module
- **THEN** the Dashboard shows a quick link for it without further changes

#### Scenario: Link navigates
- **WHEN** the user chooses a quick link
- **THEN** the linked page is shown inside the shell

### Requirement: Dashboard content limits
The Dashboard SHALL NOT show charts, recent-activity lists or counts, and SHALL NOT send any request to the backend.

#### Scenario: No backend calls
- **WHEN** the Dashboard is displayed
- **THEN** no request is sent to the backend
