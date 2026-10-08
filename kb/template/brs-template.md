# Business Requirement Specification
## Customer Master

| Field | Value |
|---|---|
| **Domain** | Masters |
| **Capability** | Customer Master |
| **Current Version** | 1.2 |
| **Status** | Approved |
| **Owner** | TBD |
| **Last Updated** | 2026-10-05 |

## Document Use

This document is the business source of truth for Customer Master. It
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

Customer Master maintains the central customer information used throughout
the ERP application: customer identity, addresses, contacts, credit
information, and active status.


## Glossary

| Term | Meaning |
|---|---|
| Customer Code | Business identifier for a customer, entered by the user, unique |
| Active / Inactive | Whether the customer may be used in new transactions |
| Credit Limit | Maximum outstanding amount allowed for the customer |
| Credit Days | Maximum number of days allowed for payment |
| Deactivate | Mark a customer Inactive; the record is never physically deleted |

---

## Change History

### v1.0 — Initial Customer Master   [Status: Implemented]

- **Date:** 2026-08-01
- **Change Ref:** `master-customer-crud`
- **Affects:** BR-001 – BR-003, BR-005 – BR-007, all tables, all screens

**Changes:**

- ADDED customer create, modify, view, search.
- ADDED customer activation and deactivation.
- ADDED customer addresses and contacts.
- ADDED Customer List, Customer Form, Customer View.

---

### v1.1 — Added Credit Limit   [Status: Implemented]

- **Date:** 2026-09-10
- **Change Ref:** `master-customer-credit-limit`
- **Affects:** BR-004, CUSTOMER, Customer List, Customer Form

**Changes:**

- ADDED BR-004.1: Credit Limit cannot be negative.
- ADDED BR-004.S1: Negative Credit Limit scenario.
- ADDED column `CUSTOMER.CREDIT_LIMIT`.
- ADDED Credit Limit to Customer List and Customer Form.

---

### v1.2 — Added Credit Days   [Status: Implemented]

- **Date:** 2026-10-05
- **Change Ref:** `master-customer-credit-days`
- **Affects:** BR-004, CUSTOMER, Customer List, Customer Form

**Changes:**

- ADDED BR-004.2: Credit Days range 0–365.
- ADDED BR-004.S2, BR-004.S3: Credit Days range scenarios.
- ADDED column `CUSTOMER.CREDIT_DAYS`.
- ADDED Credit Days to Customer List and Customer Form.

---


## Scope

- Create, modify, view, and search customers
- Maintain customer addresses and contacts
- Maintain credit information
- Activate and deactivate customers

---

## Business Rules

### BR-001 — Customer Creation

- **BR-001.1 [v1.0]** Customer Code SHALL be mandatory.
- **BR-001.2 [v1.0]** Customer Name SHALL be mandatory.
- **BR-001.3 [v1.0]** Customer Code SHALL be unique.
- **BR-001.4 [v1.0]** A new customer SHALL be Active by default.

**Scenarios**

- **BR-001.S1 [v1.0]** WHEN a user saves a new customer with a code that already exists
  THEN the save is rejected with "Customer Code already exists".
- **BR-001.S2 [v1.0]** WHEN a user saves a new customer without changing Active
  THEN the customer is saved as Active.

### BR-002 — Customer Modification

- **BR-002.1 [v1.0]** Customer Code SHALL NOT be editable after creation.
- **BR-002.2 [v1.0]** Customer Name SHALL NOT be blank.
- **BR-002.3 [v1.0]** Changes to customer details SHALL NOT alter existing
  transactions. Transactions store their own copy of the customer details
  they need at the time they are created.

**Scenarios**

- **BR-002.S1 [v1.0]** WHEN a user edits an existing customer
  THEN Customer Code is shown read-only.
- **BR-002.S2 [v1.0]** WHEN a user clears Customer Name and saves
  THEN the save is rejected with "Customer Name is required".

### BR-003 — Customer Deactivation

- **BR-003.1 [v1.0]** Customers SHALL NOT be physically deleted.
- **BR-003.2 [v1.0]** A customer MAY be marked Inactive.
- **BR-003.3 [v1.0]** Historical transactions of an inactive customer SHALL remain available.
- **BR-003.4 [v1.0]** An inactive customer SHALL NOT be selectable for new transactions.

**Scenarios**

- **BR-003.S1 [v1.0]** WHEN a user deactivates a customer
  THEN the customer's status is Inactive and the record still exists.
- **BR-003.S2 [v1.0]** WHEN a user creates a new transaction
  THEN inactive customers are not offered for selection.

### BR-004 — Customer Credit

- **BR-004.1 [v1.1]** Credit Limit SHALL NOT be negative.
- **BR-004.2 [v1.2]** Credit Days SHALL be a whole number between 0 and 365 inclusive.

**Scenarios**

- **BR-004.S1 [v1.1]** WHEN a user enters Credit Limit -1 and saves
  THEN the save is rejected with "Credit Limit cannot be negative".
- **BR-004.S2 [v1.2]** WHEN a user enters Credit Days 366 and saves
  THEN the save is rejected with "Credit Days must be between 0 and 365".
- **BR-004.S3 [v1.2]** WHEN a user enters Credit Days 0 or 365 and saves
  THEN the value is accepted.

### BR-005 — Customer Address

- **BR-005.1 [v1.0]** A customer MAY have multiple addresses.
- **BR-005.2 [v1.0]** Address Type SHALL be one of: Billing, Shipping.
- **BR-005.3 [v1.0]** Each address SHALL belong to exactly one customer.

### BR-006 — Customer Contact

- **BR-006.1 [v1.0]** A customer MAY have multiple contact persons.
- **BR-006.2 [v1.0]** Each contact SHALL belong to exactly one customer.
- **BR-006.3 [v1.0]** Contact Name SHALL be mandatory; Email and Phone are optional.

### BR-007 — Customer Search

- **BR-007.1 [v1.0]** Customers SHALL be searchable by Customer Code and Customer Name.

---

## Data Model

### CUSTOMER

**Purpose:** Stores the main customer information.

| Ver | Column | Type | Key | Nullable | Default | Description |
|---|---|---|---|---|---|---|
| 1.0 | CUSTOMER_ID | BIGINT | PK | No | - | Internal customer ID |
| 1.0 | CUSTOMER_CODE | VARCHAR(20) | UK | No | - | Unique customer code |
| 1.0 | CUSTOMER_NAME | VARCHAR(100) | | No | - | Customer name |
| 1.1 | CREDIT_LIMIT | DECIMAL(18,2) | | Yes | 0 | Maximum credit allowed |
| 1.2 | CREDIT_DAYS | INTEGER | | Yes | 0 | Maximum credit period in days |
| 1.0 | ACTIVE | BOOLEAN | | No | TRUE | Customer active status |
| 1.0 | CREATED_AT | TIMESTAMP | | No | CURRENT_TIMESTAMP | Created date/time |
| 1.0 | UPDATED_AT | TIMESTAMP | | Yes | - | Last updated date/time |

### CUSTOMER_ADDRESS

**Purpose:** Stores customer addresses.

| Ver | Column | Type | Key | Nullable | Default | Description |
|---|---|---|---|---|---|---|
| 1.0 | CUSTOMER_ADDRESS_ID | BIGINT | PK | No | - | Address ID |
| 1.0 | CUSTOMER_ID | BIGINT | FK | No | - | References CUSTOMER |
| 1.0 | ADDRESS_TYPE | VARCHAR(20) | | No | - | Billing / Shipping |
| 1.0 | ADDRESS_LINE1 | VARCHAR(100) | | No | - | Address line 1 |
| 1.0 | ADDRESS_LINE2 | VARCHAR(100) | | Yes | - | Address line 2 |
| 1.0 | CITY | VARCHAR(50) | | Yes | - | City |
| 1.0 | STATE | VARCHAR(50) | | Yes | - | State |
| 1.0 | PIN_CODE | VARCHAR(10) | | Yes | - | Postal code |
| 1.0 | COUNTRY | VARCHAR(50) | | Yes | India | Country |

### CUSTOMER_CONTACT

**Purpose:** Stores customer contact persons.

| Ver | Column | Type | Key | Nullable | Default | Description |
|---|---|---|---|---|---|---|
| 1.0 | CUSTOMER_CONTACT_ID | BIGINT | PK | No | - | Contact ID |
| 1.0 | CUSTOMER_ID | BIGINT | FK | No | - | References CUSTOMER |
| 1.0 | CONTACT_NAME | VARCHAR(100) | | No | - | Contact person name |
| 1.0 | EMAIL | VARCHAR(150) | | Yes | - | Email address |
| 1.0 | PHONE | VARCHAR(30) | | Yes | - | Phone number |

### Relationships

```
CUSTOMER
├── CUSTOMER_ADDRESS (1:N)
└── CUSTOMER_CONTACT (1:N)
```

---

## User Interface

### Customer List

Displays existing customers and lets users search, filter, sort, and maintain
customer records.

#### List Columns

| Ver | Field | Description |
|---|---|---|
| 1.0 | Customer Code | Customer code |
| 1.0 | Customer Name | Customer name |
| 1.1 | Credit Limit | Customer credit limit |
| 1.2 | Credit Days | Allowed credit period |
| 1.0 | Status | Active / Inactive |
| 1.0 | Actions | Available record actions |

#### Search

As defined in BR-007.

#### Filters

| Ver | Filter | Type | Options | Default |
|---|---|---|---|---|
| 1.0 | Status | Dropdown | All / Active / Inactive | All |

#### Sorting

| Ver | Sortable Field |
|---|---|
| 1.0 | Customer Code |
| 1.0 | Customer Name |

**Default Sort:** Customer Name ascending.

#### Pagination

- Default page size: 25.
- Available page sizes: 25, 50, 100.

#### Actions

**Page Actions:**

| Ver | Action | Shown when |
|---|---|---|
| 1.0 | Add Customer | Always |

**Record Actions:**

| Ver | Action | Shown when |
|---|---|---|
| 1.0 | View | Always |
| 1.0 | Edit | Always |
| 1.0 | Deactivate | Customer is Active |
| 1.0 | Activate | Customer is Inactive |

---

### Customer Form

Used to create and modify customer information.

#### General Information

| Ver | Field | Control | Required | Editable | Default | Rule |
|---|---|---|---|---|---|---|
| 1.0 | Customer Code | Text Box | Yes | Create only | - | BR-001.1, BR-001.3, BR-002.1 |
| 1.0 | Customer Name | Text Box | Yes | Yes | - | BR-001.2, BR-002.2 |
| 1.1 | Credit Limit | Number (2 decimals) | No | Yes | 0 | BR-004.1 |
| 1.2 | Credit Days | Number (integer) | No | Yes | 0 | BR-004.2 |
| 1.0 | Active | Checkbox | Yes | Yes | True | BR-001.4 |

#### Address

The user can maintain multiple addresses for a customer (BR-005).

| Ver | Field | Control | Required | Default |
|---|---|---|---|---|
| 1.0 | Address Type | Dropdown (Billing / Shipping) | Yes | - |
| 1.0 | Address Line 1 | Text Box | Yes | - |
| 1.0 | Address Line 2 | Text Box | No | - |
| 1.0 | City | Text Box | No | - |
| 1.0 | State | Text Box | No | - |
| 1.0 | PIN Code | Text Box | No | - |
| 1.0 | Country | Dropdown | No | India |

#### Contacts

The user can maintain multiple contact persons for a customer (BR-006).

| Ver | Field | Control | Required |
|---|---|---|---|
| 1.0 | Contact Name | Text Box | Yes |
| 1.0 | Email | Text Box | No |
| 1.0 | Phone | Text Box | No |

#### Form Actions

- **Save:** validates all rules above; on failure shows the messages from the BR scenarios.
- **Cancel:** discards changes and returns to the Customer List.

---

### Customer View

Read-only display of general information, credit information, addresses,
contacts, and active status.

**Actions:** Edit, Back.

---

## Permissions

| Action | Roles |
|---|---|
| View / Search | TBD |
| Create / Edit | TBD |
| Activate / Deactivate | TBD |
