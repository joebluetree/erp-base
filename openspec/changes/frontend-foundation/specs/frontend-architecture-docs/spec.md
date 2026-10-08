# Spec Delta

## Purpose

Defines the architecture document that records the implemented frontend design so contributors add features consistently.

## ADDED Requirements

### Requirement: Frontend architecture document
The repository SHALL contain `kb/architecture/frontend.md` describing the implemented frontend: architecture overview, standalone approach, project and folder structure, feature organization, the Home page, routing, Spartan UI and Tailwind configuration and conventions, API integration, interceptors, shared component rules, notifications and error handling, testing, dependency and boundary rules, and guidelines for adding a feature. Conventions for forms, data tables and feature state SHALL appear under a heading that states they are guidance for the next feature and are not yet implemented in code.

#### Scenario: Document complete
- **WHEN** the foundation is finished
- **THEN** the document exists and covers every listed topic

#### Scenario: Describes only what exists
- **WHEN** a reviewer compares the document with the code
- **THEN** every documented structure exists in the code, and conventions that are not yet implemented are marked as guidance

#### Scenario: No removed feature described
- **WHEN** the document is read
- **THEN** it does not describe a Todo feature as part of the application

### Requirement: Frontend setup instructions
The repository SHALL include instructions to install dependencies, point the app at the backend, run the app, run the tests and build.

#### Scenario: New developer setup
- **WHEN** a developer follows the instructions on a fresh machine with Node.js available
- **THEN** the app runs and the Home page loads
