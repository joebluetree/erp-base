# Business Requirement Specification
## Company Master

| Field | Value |
|---|---|
| **Domain** | Admin |
| **Capability** | Company Master |
| **Current Version** | 1.0 |
| **Status** | Approved |
| **Owner** | Joyi John |
| **Last Updated** | 2026-10-08 |

## Document Use

This document is the business source of truth for Company Master. It
describes current behaviour plus any entry marked `[Status: Proposed]`.
A propose command should name the version or BR IDs to implement;
everything else here already exists.

**Tracking changes:**

- Rules use `BR-<group>.<n> [v<version>]`, e.g. `BR-004.2 [v1.2]`.
- Scenarios use `BR-<group>.S<n> [v<version>]`, e.g. `BR-004.S2 [v1.2]`.
- A modified rule or scenario keeps its ID and shows both versions, e.g. `[v1.0 → v1.3]`.
- A removed rule or scenario is deleted here and recorded in Change History. Its ID is never reused.
- Every change is listed in Change History as ADDED, MODIFIED, or REMOVED.

## Purpose

Company Master maintains the central company information used throughout the ERP application. 
This is a multi company, multi branch  application. When a user logged into
the software it should ask the user id, password and company code.  

## Glossary

| Term | Meaning |
|---|---|
| Company Code | business identifier for a company, unique |

---

## Change History

### v1.0 — Initial Company Master   [Status: Draft]

- **Date:** 2026-10-08
- **Change Ref:** `admin-company-crud`
- **Affects:** BR-001 – BR-003, BR-005 – BR-007, all tables, all screens

**Changes:**

- ADDED customer create, modify, view, search.

---

## Scope

- Create, modify, view, and search Company
- Activate and deactivate Company

---

## Data Model

### Table :MAST_COMPANY

**Purpose:** Stores the main company information.

| Ver | Column | Type | Key | Nullable | Default | Description |
|---|---|---|---|---|---|---|
| 1.0 | COMP_ID | BIGINT | PK1,UK1,UK2 | No | - | Internal  ID |
| 1.0 | COMPANY_CODE | VARCHAR(20) | UK1 | No | - | Unique code |
| 1.0 | COMPANY_NAME | VARCHAR(100) |UK2 | No | - | Unique Name |
| 1.0 | COMPANY_ADDRESS1 | VARCHAR(100) | | No | - | Address Line1 |
| 1.0 | COMPANY_ADDRESS2 | VARCHAR(100) | | No | - | Address Line1 |
| 1.0 | COMPANY_ADDRESS3 | VARCHAR(100) | | No | - | Address Line1 |
| 1.0 | ACTIVE | BOOLEAN | | No | TRUE | Active/inactive status |
| 1.0 | CREATED_BY | VARCHAR(20) |  | Yes | - | Created By |
| 1.0 | CREATED_DT | TIMESTAMP | | Yes| CURRENT_TIMESTAMP | Created date/time |
| 1.0 | EDITED_IBY | VARCHAR(20) |  | Yes | - | Edited By |
| 1.0 | EDITED_DT | TIMESTAMP | | Yes | - | Last updated date/time |
| 1.0 | DELETED_BY | VARCHAR(20) |  | Yes | - | Edited By |
| 1.0 | DELETED_DT | TIMESTAMP | | Yes | - | Last updated date/time |

### Constraints
|Key|Type|Columns|
|---|----|-------|
|PK1|Primary Key|COMP_ID|
|UK1|Composite Unique Key|COMP_ID,COMP_CODE|
|UK2|Composite Unique Key|COMP_ID,COMP_NAME|


### Relationships
---


## Business Rules

### BR-001 — Customer Creation

- **BR-001.1 [v1.0]** Code is mandatory and unique
- **BR-001.2 [v1.0]** Name is mandatory and unique
- **BR-001.3 [v1.0]** Address1 is mandatory
- **BR-001.3 [v1.0]** Address2 is mandatory
- **BR-001.3 [v1.0]** Address3 is mandatory
- **BR-001.4 [v1.0]** A new company shall be Active by default.

**Scenarios**

- **BR-001.S1 [v1.0]** 
WHEN a user saves a new company with a code that already exists
THEN the save is rejected with "Code already exists".
- **BR-001.S2 [v1.0]** 
WHEN a user saves a new company with a name that already exists
THEN the save is rejected with "Name already exists".
- **BR-001.S3 [v1.0]** 
WHEN a user saves a new company without Address Line 1
THEN the save is rejected with "Address Line1 Cannote Be Blank".
- **BR-001.S4 [v1.0]** 
WHEN a user saves a new company without Address Line 2
THEN the save is rejected with "Address Line1 Cannote Be Blank".
- **BR-001.S5 [v1.0]** 
WHEN a user saves a new company without Address Line 3
THEN the save is rejected with "Address Line1 Cannote Be Blank".
- **BR-001.S6 [v1.0]** 
WHEN a user saves a new company without Address Line 3
THEN the save is rejected with "Address Line1 Cannote Be Blank".

---


## User Interface

### Company List

Displays existing Company and lets users search, filter, sort, and maintain
company records.

#### List Columns

| Ver | Field | Description |
|---|---|---|
| 1.0 | Edit | An icon to edit the record |
| 1.0 | Code | Company code |
| 1.0 | Name | Company name |
| 1.0 | Address-1 | Company Address Line 1 |
| 1.0 | Address-2 | Company Address Line 2 |
| 1.0 | Address-3 | Company Address Line 3 |
| 1.0 | Status | Active / Inactive |
| 1.0 | Edit | An icon to edit the record |


#### Filters

| Ver | Filter | Type | Options | Default |
|---|---|---|---|---|
| 1.0 | Code | TextBox |  | |
| 1.0 | Name | TextBox |  | |
| 1.0 | Status | Dropdown | All / Active / Inactive | Active |

#### Sorting

| Ver | Sortable Field |
|---|---|
| 1.0 | Code |
| 1.0 | Name |
| 1.0 | Address-1 |
| 1.0 | Address-2 |
| 1.0 | Address-3 |

**Default Sort:** Name ascending.

#### Pagination

- Default page size: 10.
- Available page sizes: 5,10,15,25, 50, 100.

#### Actions

**Page Actions:**

| Ver | Action | Shown when |
|---|---|---|
| 1.0 | Add Company | Always |

**Record Actions:**

| Ver | Action | Shown when |
|---|---|---|
| 1.0 | Edit | Always |
| 1.0 | Delete | Always |

---

### Company Form

Used to create and modify company information.

#### General Information

| Ver | Field | Control | Required | Editable | Default 
|---|---|---|---|---|---|---|
| 1.0 | Code | Text Box | Yes | Create only | - |
| 1.0 | Name | Text Box | Yes | Yes | - | 
| 1.0 | Address-1 | Text Box | Yes | Yes | - | 
| 1.0 | Address-2 | Text Box | Yes | Yes | - | 
| 1.0 | Address-3 | Text Box | Yes | Yes | - | 
| 1.0 | Active | Checkbox | Yes | Yes | True | 


#### Form Actions

- **Save:** validates all rules above; on failure shows the messages from the BR scenarios.
- **Cancel:** discards changes and returns to the Company List.

---

