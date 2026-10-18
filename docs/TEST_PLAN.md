# PeopleFlow HCM — Test Plan & Quality Assurance Strategy

## 1. Quality Objectives

PeopleFlow HCM is a mission-critical enterprise HR and payroll system. Our testing strategy ensures:
1. **Zero Multi-Tenant Data Leakage:** Mathematical certainty that no tenant can read or mutate another tenant's data.
2. **Deterministic Financial Accuracy:** 100% reproducible payroll math with strict decimal precision down to the exact paisa (0.01 PKR).
3. **Robust Workflow State Transitions:** State transitions (pending -> approved -> finalized) cannot be bypassed or duplicated.
4. **Resilient Failure Handling:** Malformed inputs, missing punches, or race conditions fail safely without data corruption.

---

## 2. Test Pyramid & Automation Levels

```
                     / \
                    /   \
                   / E2E \       Playwright Browser Tests (Critical user paths)
                  /-------\
                 /  Integ  \     API & DB Isolation Tests (Tenant scoping, RLS)
                /-----------\
               /    Unit     \   Pure Domain Engines (Payroll math, Leave accruals, RBAC)
              /---------------\
```

### 2.1 Unit Tests (Vitest)
- **Payroll Engine:**
  - Standard monthly calculation with allowances and deductions.
  - Mid-month joiner proration (e.g., joining on 18th of a 31-day month).
  - Mid-month leaver proration.
  - Pakistan FBR progressive tax brackets for salaried individuals.
  - EOBI statutory thresholds and employer matching.
  - Unpaid leave day deductions.
  - Decimal rounding rules and negative adjustment protection.
- **Leave Engine:**
  - Monthly accrual calculations.
  - Carry-forward caps and expiration dates.
  - Overlapping request rejection logic.
  - Balance deduction and reversal upon cancellation.
- **Attendance Engine:**
  - Shift grace period tolerance calculations.
  - Overnight cross-midnight shift punch duration.
  - Missing in/out punch detection.
  - Overtime threshold logic.

### 2.2 Integration & Security Tests
- **Tenant Isolation:**
  - Direct database queries with mismatched `tenant_id` return 0 records.
  - API requests with forged query params or headers for Tenant B rejected with `403/404`.
- **Role-Based Authorization:**
  - Unauthenticated requests rejected (`401 Unauthorized`).
  - Employees requesting `/api/employees` cannot view other employees' base salaries.
  - Employees requesting `/api/payroll/runs` receive `403 Forbidden`.
  - Separation of duties test: User who created a payroll run fails when attempting to approve it.

### 2.3 End-to-End (E2E) Browser Tests (Playwright)
- **Flow 1: Employee Directory Lifecycle:**
  - Admin logs in -> creates legal entity & department -> creates new employee -> employee appears in directory.
- **Flow 2: Leave Application & Approval:**
  - Employee logs in -> checks balance -> submits leave request -> Line manager logs in -> reviews and approves request -> Employee balance updates.
- **Flow 3: Attendance Punch & Correction:**
  - Employee clocks in -> requests correction -> Manager approves correction -> Attendance status reflects update.
- **Flow 4: Payroll Run Preparation & Approval:**
  - Payroll Manager drafts month run -> verifies calculation lines -> submits for approval -> Company Admin logs in and approves -> finalizes run -> Employee views payslip in ESS portal.

---

## 3. Mandatory Security Verification Checkpoints

1. **IDOR Check:** User A accessing `/api/employees/[User-B-ID]` receives authorized data only if possessing `employees.read` permission within the same tenant.
2. **Cross-Tenant ID Check:** User in Tenant 1 requesting `/api/employees/[Tenant-2-Employee-ID]` receives `404 Not Found`.
3. **Storage Security Check:** Direct URL to document bucket without valid signed token fails with `403 Access Denied`.
4. **CSRF / Injection Check:** SQL injection payloads in search filters sanitized by Prisma parameterized queries.
