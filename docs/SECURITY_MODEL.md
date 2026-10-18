# PeopleFlow HCM — Security Model & Threat Assessment

## 1. Security Tenets

1. **Defense in Depth:** Security is verified across HTTP headers, middleware routing, server domain services, and database row-level policies.
2. **Never Trust the Client:** Identifiers (`tenant_id`, `user_id`, `role`, `employee_id`) are resolved server-side from cryptographically signed session tokens. Form/API payloads containing forged IDs are rejected.
3. **Principle of Least Privilege:** Users only receive access to the minimal set of records necessary to perform their operational duties.
4. **Separation of Duties (SoD):** A single actor cannot prepare, approve, and finalize sensitive actions like payroll runs or their own leave applications.
5. **Zero Data Leakage:** PII (CNICs, tax IDs, bank accounts, medical records) is redacted by default and exposed only under explicit, audited permission scopes.

---

## 2. Threat Modeling & Mitigations (STRIDE Matrix)

| Threat Category | Potential Attack Vector | PeopleFlow HCM Mitigation |
|---|---|---|
| **Spoofing** | Forged user session or impersonation of high-privilege tenant. | Cryptographically signed, `HttpOnly`, `SameSite=Lax`, `Secure` session cookies; server-validated JWT signatures with short lifetimes; revocable refresh tokens. |
| **Tampering** | Parameter manipulation (e.g., editing another employee's salary or leave request via forged UUIDs). | Mandatory Zod schema validation; server-side lookup verifies `resource.tenant_id == session.tenant_id`; Row Level Security prevents multi-tenant tampering. |
| **Repudiation** | An admin modifies payroll deductions or deletes an employee and denies the action. | Append-only `audit_logs` table tracking `actor_user_id`, `timestamp`, `ip_address`, `resource_id`, and JSON diff of modified attributes. Finalized payroll runs are locked with cryptographic hashes. |
| **Information Disclosure (IDOR)** | Direct Object Reference to view competitor tenant's employee directory or another employee's payslip. | Strict tenant context injection; employee self-service endpoints enforce `employee.user_id == session.user_id`. Direct URL ID tampering returns `404 Not Found` or `403 Forbidden`. |
| **Denial of Service** | Volumetric abuse of login endpoints or bulk export jobs. | Distributed rate limiting (IP-based and user-based); pagination limits on data tables (max 100 rows per page); asynchronous worker processing for heavy export jobs. |
| **Elevation of Privilege** | Tenant admin attempts to assign Platform Super Admin permissions to themselves. | Hard separation between SaaS Platform roles and Tenant roles. Tenant role editing is constrained to roles created within that specific `tenant_id`. |

---

## 3. Role-Based Access Control (RBAC) Matrix

| Permission Key | Platform Super Admin | Tenant Owner / Company Admin | HR Manager | Payroll Manager | Department Manager | Employee (Self) | Auditor / Accountant |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `platform.tenants.manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `platform.plans.manage` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `tenant.settings.manage` | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `users.roles.manage` | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `employees.read` | ❌ | ✅ | ✅ | ✅ | Team Only | Self Only | ✅ (Masked PII) |
| `employees.create` | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `employees.update` | ❌ | ✅ | ✅ | ❌ | ❌ | Profile Correction | ❌ |
| `employees.compensation.read` | ❌ | ✅ | ❌ | ✅ | ❌ | Own Payslip | ✅ |
| `attendance.record` | ❌ | ✅ | ✅ | ❌ | Team Only | Self Clock-in | Read-only |
| `attendance.correct.request` | ❌ | ❌ | ❌ | ❌ | ❌ | Self Only | ❌ |
| `attendance.correct.approve` | ❌ | ✅ | ✅ | ❌ | Team Subordinates | ❌ | ❌ |
| `leave.request` | ❌ | ❌ | ❌ | ❌ | ❌ | Self Only | ❌ |
| `leave.approve` | ❌ | ✅ | ✅ | ❌ | Team Subordinates | ❌ | ❌ |
| `payroll.prepare` | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `payroll.approve` | ❌ | ✅ | ❌ | ❌ (SoD rule) | ❌ | ❌ | ❌ |
| `payroll.finalize` | ❌ | ✅ | ❌ | ❌ (SoD rule) | ❌ | ❌ | ❌ |
| `audit_logs.read` | Platform Logs | ✅ (Tenant) | ❌ | ❌ | ❌ | ❌ | ✅ (Tenant) |

---

## 4. Separation of Duties (SoD) Rules

1. **Payroll Rule:** A user who triggers `payroll.prepare` cannot be the same user who executes `payroll.approve` or `payroll.finalize` for the exact same payroll run period.
2. **Leave Rule:** A manager cannot approve their own leave request. The approval must escalate to the next hierarchical supervisor or HR Manager.
3. **Compensation Rule:** Changes to an employee's base salary or recurring allowances require approval from a secondary HR Admin before becoming effective in the payroll calculation engine.

---

## 5. Document & PII Security

- **Storage Engine:** Private object store bucket with public access completely blocked.
- **Access URL Scheme:** Documents are never served via public static URLs. The API issues short-lived pre-signed URLs (15-minute TTL) following authorization verification.
- **Data Masking:** National Identity Numbers (CNIC: `XXXXX-XXXXXXX-X`) and Bank Account numbers (IBAN) are masked (`*****1234`) in standard employee list views and revealed only with explicit administrative permission.
