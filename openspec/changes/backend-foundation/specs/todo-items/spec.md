# Spec Delta

## Purpose

Defines the reference Todo Items feature that demonstrates the standard module and feature implementation for future business modules.

## ADDED Requirements

### Requirement: Save todo item
The API SHALL provide one save operation that creates a todo item when no identifier is supplied and updates the existing item when its identifier is supplied. A todo item SHALL have a title (required, at most 200 characters), an optional description, and a completed flag.

#### Scenario: Create
- **WHEN** a client saves a valid todo without an identifier
- **THEN** the API returns 201 with the new todo including a generated identifier

#### Scenario: Update
- **WHEN** a client saves a valid todo with the identifier of an existing item
- **THEN** the API returns 200 with the updated todo and the stored item reflects the changes

#### Scenario: Update unknown item
- **WHEN** a client saves a todo with an identifier that does not exist
- **THEN** the API returns 404

#### Scenario: Invalid title
- **WHEN** a client saves a todo with an empty or over-long title
- **THEN** the API returns 400 and nothing is stored

### Requirement: Get todo item by identifier
The API SHALL return a single todo item by its identifier.

#### Scenario: Found
- **WHEN** a client requests an existing todo
- **THEN** the API returns 200 with the todo

#### Scenario: Not found
- **WHEN** a client requests an unknown identifier
- **THEN** the API returns 404

### Requirement: List todo items
The API SHALL return all todo items.

#### Scenario: Items exist
- **WHEN** a client lists todos and items exist
- **THEN** the API returns 200 with all items

#### Scenario: No items
- **WHEN** a client lists todos and none exist
- **THEN** the API returns 200 with an empty list

### Requirement: Delete todo item
The API SHALL permanently delete a todo item by its identifier.

#### Scenario: Delete existing
- **WHEN** a client deletes an existing todo
- **THEN** the API returns 204 and the item can no longer be retrieved

#### Scenario: Delete unknown
- **WHEN** a client deletes an unknown identifier
- **THEN** the API returns 404
