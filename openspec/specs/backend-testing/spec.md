# backend-testing Specification

## Purpose

Defines the automated test coverage the backend foundation must ship with, so later modules have a working testing pattern to follow.

## Requirements

### Requirement: Unit tests for the sample feature
The test suite SHALL include unit tests for the Todo service and validator covering create, update, not-found and validation-failure paths, runnable without a database.

#### Scenario: Run without Oracle
- **WHEN** unit tests are run on a machine without Oracle
- **THEN** they pass

### Requirement: Integration tests
The test suite SHALL include integration tests that call the Todo endpoints through the real HTTP pipeline against an Oracle database, covering save, get, list and delete.

#### Scenario: End-to-end CRUD
- **WHEN** integration tests run against a configured Oracle test schema
- **THEN** a todo can be created, updated, retrieved, listed and deleted via HTTP

### Requirement: Architecture tests
The test suite SHALL include tests that fail when project dependency rules are violated.

#### Scenario: Rule violation detected
- **WHEN** a forbidden project reference exists
- **THEN** the architecture test run fails and names the offending project
