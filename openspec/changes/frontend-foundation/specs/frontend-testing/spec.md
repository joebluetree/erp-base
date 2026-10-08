# Spec Delta

## Purpose

Defines the automated frontend tests the foundation ships with, so later features have a working test pattern to follow.

## ADDED Requirements

### Requirement: Todo feature service tests
The test suite SHALL cover the Todo feature service: loading the list, creating, updating and deleting against a faked HTTP layer, and the resulting state, including failure cases.

#### Scenario: Run without a backend
- **WHEN** the tests run on a machine without the backend or a database
- **THEN** they pass

#### Scenario: State after delete
- **WHEN** the service deletes a todo successfully
- **THEN** the test confirms the todo is gone from the list state

### Requirement: Todo component tests
The test suite SHALL cover the Todo list and form components' important behavior: rows rendered, empty state, search filtering, confirmation before delete, save and cancel navigation, and not sending an invalid form.

#### Scenario: Invalid form not submitted
- **WHEN** a test submits the form with an empty title
- **THEN** the validation message is displayed and the service is not called

### Requirement: Form validation tests
The test suite SHALL cover the form validation rules: title required, title at most 200 characters, description at most 2000 characters, and display of server-side field errors.

#### Scenario: Length boundary
- **WHEN** a test sets a 200-character title and then a 201-character title
- **THEN** the first is valid and the second is invalid

### Requirement: Error handling tests
The test suite SHALL cover the central error handling for server errors, not found, network failure, and validation errors passed through to the form.

#### Scenario: Validation error passthrough
- **WHEN** a test simulates a 400 with field errors
- **THEN** no generic error notification is raised and the errors are available to the caller

### Requirement: Tests pass in one command
All frontend tests SHALL run to completion with one documented command and no manual setup.

#### Scenario: Single command
- **WHEN** a developer runs the documented test command
- **THEN** all tests run non-interactively and the command exits successfully
