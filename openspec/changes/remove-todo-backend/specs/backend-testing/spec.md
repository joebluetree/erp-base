# Spec Delta

## RENAMED Requirements

- FROM: `### Requirement: Unit tests for the sample feature`
- TO: `### Requirement: Unit tests for shared infrastructure`

## MODIFIED Requirements

### Requirement: Unit tests for shared infrastructure
The test suite SHALL include unit tests for shared infrastructure that does not depend on a business feature, such as the Oracle compatibility handling, runnable without a database.

#### Scenario: Run without Oracle
- **WHEN** unit tests are run on a machine without Oracle
- **THEN** they pass

## REMOVED Requirements

### Requirement: Integration tests
**Reason**: These tests exercised the Todo CRUD through the HTTP pipeline, and the Todo feature is removed from the foundation.
**Migration**: Replaced by the requirement "Pipeline and connectivity integration tests", which proves the same pipeline behavior with test-only endpoints.

## ADDED Requirements

### Requirement: Pipeline and connectivity integration tests
The test suite SHALL include integration tests that send requests through the real HTTP pipeline to prove validation, not-found and unexpected-error handling and API documentation, using endpoints that exist only in the test project, and SHALL include a test of Oracle connectivity that runs when a test schema is configured.

#### Scenario: Pipeline behavior
- **WHEN** the integration tests call the test-only endpoints
- **THEN** a not-found failure returns 404 problem details, an unexpected failure returns 500 without internal details, and an invalid body returns 400 with errors grouped by field

#### Scenario: Oracle connectivity
- **WHEN** the integration tests run with an Oracle test schema configured
- **THEN** the application connects to the database successfully
