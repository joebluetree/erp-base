# Spec Delta

## Purpose

Defines the externally visible behavior of the backend HTTP host: API conventions, documentation, validation, error responses, logging and environment configuration.

## ADDED Requirements

### Requirement: RESTful API with OpenAPI documentation
The API SHALL expose RESTful endpoints with consistent route naming and appropriate HTTP status codes, and SHALL publish OpenAPI/Swagger documentation listing all endpoints in Development.

#### Scenario: Swagger lists endpoints
- **WHEN** a developer opens the Swagger UI in Development
- **THEN** all Todo endpoints are listed with request and response shapes

#### Scenario: Swagger hidden in Production
- **WHEN** the application runs in the Production environment
- **THEN** the Swagger UI is not exposed

### Requirement: Request validation
The API SHALL validate request bodies and return HTTP 400 with the validation errors, grouped by field, when validation fails.

#### Scenario: Invalid request
- **WHEN** a client sends a request that violates validation rules
- **THEN** the API returns 400 and lists each failing field with its message
- **AND** no data is changed

### Requirement: Consistent error responses
The API SHALL return all errors in a single consistent format (RFC 7807 problem details) and SHALL NOT expose stack traces or internal exception messages.

#### Scenario: Unhandled exception
- **WHEN** an unexpected exception occurs while handling a request
- **THEN** the API returns 500 with a generic problem-details body and a correlation identifier
- **AND** the full exception is written to the log

#### Scenario: Resource not found
- **WHEN** a client requests a resource that does not exist
- **THEN** the API returns 404 in the same error format

### Requirement: Structured logging
The application SHALL write structured logs including request and error information.

#### Scenario: Request logged
- **WHEN** a request is handled
- **THEN** a structured log entry is written containing method, path, status code and duration

### Requirement: Environment configuration
The application SHALL support Development, Testing and Production configuration and SHALL NOT contain hardcoded secrets.

#### Scenario: Environment selected
- **WHEN** the environment variable selects Testing
- **THEN** the Testing configuration values are applied over the base configuration
