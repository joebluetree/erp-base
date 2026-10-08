# Spec Delta

## Purpose

Defines the reference Todo screens in FeatureTemplate that future frontend features copy: list, create, edit and delete against the backend Todo API.

## ADDED Requirements

### Requirement: Todo list
The Todo list screen SHALL show all todos in a table with title, description and completed status, and SHALL provide pagination, sorting by column, text search on title and description, a loading indicator while fetching, and an empty-state message when there are none.

#### Scenario: Todos shown
- **WHEN** the user opens the Todo list and the backend returns todos
- **THEN** the table shows them, paginated

#### Scenario: Loading
- **WHEN** the list request is in flight
- **THEN** a loading indicator is shown

#### Scenario: Empty
- **WHEN** the backend returns no todos
- **THEN** an empty-state message is shown instead of rows

#### Scenario: Search
- **WHEN** the user types text in the search box
- **THEN** only todos whose title or description contain that text (ignoring case) are listed

#### Scenario: Sort
- **WHEN** the user selects a column header
- **THEN** the rows are ordered by that column, and selecting again reverses the order

### Requirement: Create and edit todo
The Todo form SHALL create a todo when opened from the list's add action and SHALL edit the existing todo when opened from a row's edit action, pre-filled with its current values. The form SHALL have a title (required, at most 200 characters), a description (optional, at most 2000 characters) and a completed flag, with Save and Cancel actions.

#### Scenario: Create
- **WHEN** the user fills a valid form from the add action and saves
- **THEN** the todo is created, a success notification is shown and the user returns to the list showing the new todo

#### Scenario: Edit
- **WHEN** the user opens a todo for editing, changes it and saves
- **THEN** the same todo is updated (not duplicated), a success notification is shown and the list shows the change

#### Scenario: Edit unknown todo
- **WHEN** the user opens the edit URL of a todo that does not exist
- **THEN** an error notification is shown and the user returns to the list

#### Scenario: Cancel
- **WHEN** the user cancels the form
- **THEN** nothing is saved and the user returns to the list

### Requirement: Form validation messages
The form SHALL show a validation message next to an invalid field once the field has been touched or a save has been attempted, and SHALL NOT send a request while the form is invalid.

#### Scenario: Empty title
- **WHEN** the user tries to save with an empty title
- **THEN** a "title is required" message is shown and no request is sent

#### Scenario: Title too long
- **WHEN** the title exceeds 200 characters
- **THEN** a maximum-length message is shown and the form cannot be saved

#### Scenario: Server-side validation errors
- **WHEN** the backend rejects a save with field errors
- **THEN** each error message is shown next to its field

#### Scenario: Save in progress
- **WHEN** a save request is in flight
- **THEN** the Save action is disabled so the form cannot be submitted twice

### Requirement: Delete todo
Deleting a todo SHALL require the user to confirm and, once confirmed, SHALL remove it and report the result.

#### Scenario: Confirm delete
- **WHEN** the user chooses delete on a row and confirms
- **THEN** the todo is deleted, a success notification is shown and it disappears from the list

#### Scenario: Decline delete
- **WHEN** the user chooses delete and declines the confirmation
- **THEN** nothing is deleted

#### Scenario: Delete fails
- **WHEN** the backend rejects the delete
- **THEN** an error notification is shown and the todo remains in the list

### Requirement: Feature-level state
The Todo feature SHALL keep its list, loading flag and error state in a feature service, so that screens always show the same data and the list reflects create, update and delete without a full page reload.

#### Scenario: List refreshed after change
- **WHEN** a todo is created, updated or deleted
- **THEN** the list shows the result without the user reloading the page
