# Spec Delta

## Purpose

Defines the automated frontend tests the foundation ships with, so later features have a working test pattern to follow.

## ADDED Requirements

### Requirement: Error handling tests
The test suite SHALL cover the central error handling for server errors, not found, network failure, other client errors, and validation errors passed through to the caller.

#### Scenario: Validation error passthrough
- **WHEN** a test simulates a 400 with field errors
- **THEN** no generic error notification is raised and the errors are available to the caller, keyed by lower-camel field name

#### Scenario: No technical details
- **WHEN** a test simulates a 500 whose body contains internal details
- **THEN** the message the user would see contains none of those details

#### Scenario: Notified once
- **WHEN** a test simulates a failed request
- **THEN** exactly one error notification is raised

### Requirement: API base URL tests
The test suite SHALL cover prefixing relative URLs with the configured base URL, changing the base, and leaving absolute URLs untouched.

#### Scenario: Base prefixed
- **WHEN** a test sends a relative request with the base set to `/api`
- **THEN** the request goes to `/api/<path>`

### Requirement: Tests need no backend
The tests SHALL run without the backend, a database or a browser.

#### Scenario: Run without a backend
- **WHEN** the tests run on a machine without the backend or a database
- **THEN** they pass

### Requirement: Tests pass in one command
All frontend tests SHALL run to completion with one documented command and no manual setup.

#### Scenario: Single command
- **WHEN** a developer runs the documented test command
- **THEN** all tests run non-interactively and the command exits successfully
