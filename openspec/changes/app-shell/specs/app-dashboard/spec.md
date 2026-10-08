# Spec Delta

## Purpose

Defines the Dashboard, the landing page that gives a quick summary of Todos and links to the available features.

## ADDED Requirements

### Requirement: Todo summary cards
The Dashboard SHALL show three cards for Todos: the total number, the number open (not completed), and the number completed. The counts SHALL be calculated from the list the Todo API already returns.

#### Scenario: Counts shown
- **WHEN** the Todo API returns five todos of which two are completed
- **THEN** the cards show total 5, open 3 and completed 2

#### Scenario: No todos
- **WHEN** the Todo API returns no todos
- **THEN** the cards show 0, 0 and 0

### Requirement: Dashboard loading and failure states
The Dashboard SHALL show a loading indicator while the counts are loading. If the counts cannot be loaded, it SHALL show a friendly message in place of the cards, and the failure SHALL be reported to the user once through the existing error handling.

#### Scenario: Loading
- **WHEN** the Todo request is in flight
- **THEN** a loading indicator is shown instead of the cards

#### Scenario: Load failure
- **WHEN** the Todo request fails
- **THEN** a friendly message replaces the cards, one error notification is shown, and no technical detail is displayed

### Requirement: Quick links
The Dashboard SHALL show quick links to the available features, currently Todos, taken from the same list as the navigation menu, and they SHALL work even when the counts failed to load.

#### Scenario: Link to Todos
- **WHEN** the user chooses the Todos quick link
- **THEN** the Todo list is shown

#### Scenario: Links after failure
- **WHEN** the counts failed to load
- **THEN** the quick links are still shown and usable

#### Scenario: New module link
- **WHEN** a menu entry is added for a new module
- **THEN** the Dashboard shows a quick link for it without further changes

### Requirement: Dashboard content limits
The Dashboard SHALL NOT show charts, recent-activity lists or data other than the Todo counts, and SHALL NOT modify Todo data.

#### Scenario: Read only
- **WHEN** the Dashboard is used
- **THEN** no create, update or delete request is sent to the Todo API
