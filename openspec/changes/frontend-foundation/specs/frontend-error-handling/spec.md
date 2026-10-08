# Spec Delta

## Purpose

Defines how the frontend tells users what happened and how it responds to failed backend calls, in one consistent way for all features.

## ADDED Requirements

### Requirement: User notifications
The application SHALL show transient notifications for success, information, warning and error outcomes in a consistent place and style.

#### Scenario: Success notification
- **WHEN** a Todo create, update or delete succeeds
- **THEN** a success notification names the action that happened

#### Scenario: Notifications dismiss
- **WHEN** a notification has been visible for a few seconds
- **THEN** it disappears, and the user can also close it earlier

### Requirement: Central handling of HTTP errors
Failed backend calls SHALL be handled in one central place that turns them into user-friendly messages, without exposing technical details.

#### Scenario: Server error
- **WHEN** the backend responds with a 5xx status
- **THEN** an error notification says that something went wrong and to try again, and no status text, stack or internal message is shown

#### Scenario: Not found
- **WHEN** the backend responds with 404
- **THEN** an error notification says the item could not be found

#### Scenario: Network failure
- **WHEN** the request cannot reach the backend
- **THEN** an error notification says the server could not be reached

#### Scenario: Handled once
- **WHEN** a request fails
- **THEN** the user sees one notification for it, not one from the central handler and another from the feature

### Requirement: Backend validation errors
A 400 response that lists field errors SHALL be passed to the calling form so each message appears next to its field, instead of a generic error notification.

#### Scenario: Field errors reach the form
- **WHEN** the backend returns a 400 with an error for the `Title` field
- **THEN** the form shows that message under the title input

#### Scenario: Backend error with no known field
- **WHEN** the backend returns a 400 whose field has no matching input
- **THEN** its message is shown in a notification

### Requirement: No external monitoring
The frontend SHALL NOT require any external error-monitoring service.

#### Scenario: Offline development
- **WHEN** the application runs without internet access to third-party services
- **THEN** error handling works unchanged
