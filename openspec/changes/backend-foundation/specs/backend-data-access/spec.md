# Spec Delta

## Purpose

Defines how the backend stores and retrieves data in Oracle through a single shared context, with repository and unit-of-work behavior that modules can rely on.

## ADDED Requirements

### Requirement: Oracle database connectivity
The system SHALL use Oracle as its database and SHALL read the connection settings from configuration, with no credentials stored in source control.

#### Scenario: Connection from configuration
- **WHEN** the application starts with a valid connection string in configuration or user secrets
- **THEN** it connects to Oracle and database operations succeed

#### Scenario: Missing connection string
- **WHEN** the application starts without a connection string
- **THEN** startup fails with a clear configuration error that does not reveal secrets

### Requirement: Single shared context
All modules SHALL use one shared database context, and entity mappings SHALL be defined in code-based configuration classes discovered by that context.

#### Scenario: Module entity available
- **WHEN** a module's entity configuration exists in the Data project
- **THEN** the entity is persisted through the shared context with no extra context registration

### Requirement: GUID primary keys
Entity primary keys SHALL be GUIDs stored in an Oracle-compatible column type.

#### Scenario: GUID round trip
- **WHEN** an entity with a GUID key is saved and read back
- **THEN** the same GUID value is returned

### Requirement: Database migrations
The system SHALL support creating and applying schema migrations to Oracle.

#### Scenario: Apply migrations
- **WHEN** migrations are applied to an empty Oracle schema
- **THEN** all tables for the existing entities are created

### Requirement: Repository and unit of work
Data access SHALL go through repositories, and a unit of work SHALL commit changes and manage transactions so that a set of changes is saved together or not at all.

#### Scenario: Atomic save
- **WHEN** a unit of work commits several changes and one fails
- **THEN** none of the changes are persisted

### Requirement: Asynchronous data operations
All database operations SHALL be asynchronous and SHALL accept cancellation.

#### Scenario: Request cancelled
- **WHEN** a client cancels an in-flight request
- **THEN** the pending database operation is cancelled

### Requirement: Oracle 10g compatibility
The data layer SHALL work against Oracle Database 10.2, including applying migrations, inserting, updating, deleting, and reading a single row by key.

#### Scenario: Migrations on 10.2
- **WHEN** migrations are applied to an Oracle 10.2 schema
- **THEN** they complete without error and the tables exist

#### Scenario: Single-row lookup on 10.2
- **WHEN** an entity is looked up by key on an Oracle 10.2 database
- **THEN** the row is returned without a SQL syntax error
