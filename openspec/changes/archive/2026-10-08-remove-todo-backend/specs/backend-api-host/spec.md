# Spec Delta

## MODIFIED Requirements

### Requirement: RESTful API with OpenAPI documentation
The API SHALL expose RESTful endpoints with consistent route naming and appropriate HTTP status codes, and SHALL publish OpenAPI/Swagger documentation listing all endpoints in Development.

#### Scenario: Swagger lists endpoints
- **WHEN** a developer opens the Swagger UI in Development
- **THEN** the documentation is served and lists every endpoint the application exposes, with request and response shapes

#### Scenario: Swagger hidden in Production
- **WHEN** the application runs in the Production environment
- **THEN** the Swagger UI is not exposed
