# PeopleFlow HCM — Product Requirements Document (PRD)

**Product Name:** PeopleFlow HCM  
**Tagline:** One platform. Every employee. Smarter decisions.  
**Target Market:** Pakistan first (FBR, EOBI, SESSI/PESSI, local labor laws), architected for multi-country expansion.  
**Target Customer Segments:** Small businesses, mid-market companies, and large distributed enterprises.  
**Version:** 1.0.0 (Phase 0 Foundation)

---

## 1. Executive Summary & Vision

PeopleFlow HCM is a multi-tenant, cloud-native Human Capital Management platform engineered to provide end-to-end employee lifecycle management. Drawing functional depth inspired by leading regional HCM solutions like Resourceinn, PeopleFlow HCM features a clean, resilient, tenant-isolated architecture that guarantees strict data privacy, zero data leakage, separation of duties, and compliance with statutory frameworks (specifically starting with Pakistan FBR tax brackets, EOBI pension contributions, and provincial social security schemes like PESSI/SESSI).

---

## 2. Target Personas & Portals

### 2.1 Platform Super Admin
- **Role:** Global SaaS platform operator.
- **Key Needs:** Provision new customer tenants, manage subscription tiers (Starter, Professional, Enterprise), toggle modular entitlements, inspect health metrics and system logs, provide time-bounded audit-logged customer support sessions.
- **Access Boundary:** Can manage tenants and global configurations. Strictly prohibited from querying tenant employee personal records or payroll runs by default.

### 2.2 Company HR / Operations Admin
- **Role:** Organizational Administrator, HR Director, HR Generalist, Payroll Manager.
- **Key Needs:** Configure organizational hierarchy (legal entities, branches, departments, designations), manage employee profiles, execute onboarding/offboarding, configure shifts and work schedules, manage leave policies and approvals, calculate and verify payroll runs, review compliance reports.
- **Access Boundary:** Scoped strictly to their assigned Tenant and authorized branches/departments.

### 2.3 People Managers (Department / Line Managers)
- **Role:** Functional supervisors and team leads.
- **Key Needs:** Review and approve team member leave requests, approve attendance correction punches, view team calendar availability, conduct probation and annual performance appraisals.
- **Access Boundary:** Scoped strictly to reporting subordinates within the tenant.

### 2.4 Employee Self-Service (ESS)
- **Role:** Individual workforce members (office-based, remote, factory/field workers).
- **Key Needs:** View personal profile, submit profile correction requests, punch clock-in/out (web/mobile), request attendance correction for missed punches, check leave balances and apply for leaves, download digital payslips, access assigned HR policies/letters, raise HR inquiries.
- **Access Boundary:** Scoped strictly to their own employee record (`auth.uid() == employee.user_id`).

### 2.5 Auditors & External Accountants
- **Role:** Internal/external financial auditors and external bookkeepers.
- **Key Needs:** Read-only access to finalized payroll runs, tax deduction schedules, audit trail logs, and workforce variance reports.
- **Access Boundary:** Read-only access, cannot initiate changes or view draft payroll calculations unless explicitly granted.

---

## 3. Modular Functional Requirements

### Module 1: Multi-Tenancy, RBAC & Core HR
- **Tenant Isolation:** Every customer is an isolated tenant. Support for multi-entity structures (e.g., parent conglomerate with multiple legal entities and branches).
- **Granular RBAC:** Server-enforced permissions (e.g., `employees.read`, `employees.create`, `employees.compensation.read`, `payroll.prepare`, `payroll.approve`).
- **Employee Directory:** Searchable, filterable directory with employee number generation (`EMP-{YYYY}-{0000}`) with tenant-level uniqueness.
- **Lifecycle & History:** Personal, contact, identification (CNIC/Passport), emergency contacts, employment contract, effective-dated designation and compensation history.
- **Asset & Document Management:** Track company assets (laptops, SIM cards, keys) and secure document storage (signed contracts, CNIC copies, degrees) via private object storage.

### Module 2: Attendance & Shift Management
- **Schedules & Shifts:** Configurable shifts (standard, rotational, overnight/cross-midnight shifts, flexible hours).
- **Punch Logging:** Clock-in / clock-out logging with IP/geo verification placeholders and missing punch detection.
- **Calculations:** Grace period tolerance, late arrival deduction rules, early departure flags, overtime policy calculations (standard vs. rest-day overtime).
- **Corrections & Audits:** Employee correction request workflow with manager approval and full audit trail.
- **Import Engine:** CSV attendance file import with duplicate record detection.

### Module 3: Leave Management
- **Policy Engine:** Paid annual leave, casual leave, sick leave, maternity/paternity leave, and unpaid leave (LWP).
- **Accrual & Carry Forward:** Pro-rata monthly/annual accruals, maximum carry-over caps, tenure-based entitlement scaling.
- **Leave Applications:** Multi-day and half-day applications, document attachment for medical leave, overlapping conflict detection.
- **Approval Chains:** Multi-tier approvals (Line Manager -> HR Admin) with automatic balance deduction upon final approval.
- **Payroll Integration:** Approved unpaid leave automatically propagates into the payroll calculation cycle.

### Module 4: Payroll & Statutory Compliance (Pakistan First)
- **Deterministic Calculation Engine:** Stateless, pure-function payroll service operating on decimal arithmetic (no floating-point rounding errors).
- **Salary Components:** Base salary, house rent allowance, medical allowance, conveyance allowance, utility allowances, project bonuses, and one-time deductions.
- **Statutory Rules:**
  - **Income Tax (FBR):** Progressive annual tax slabs with monthly withholding calculation, tax exemptions (e.g., medical allowance exempt up to 10% of basic).
  - **EOBI (Employees' Old-Age Benefits Institution):** Mandatory employer and employee contributions based on statutory minimum wage benchmarks.
  - **Social Security (SESSI / PESSI):** Provincial caps and wage ceiling thresholds.
  - **Provident Fund:** Defined contribution scheme with matching employer contribution and interest ledger tracking.
- **Separation of Duties:** Distinct actors for `payroll.prepare` and `payroll.approve`. The preparer cannot approve their own payroll run.
- **Immutability:** Finalized payroll runs are cryptographically hashed and locked. Adjustments require explicit supplementary reconciliation runs.
- **Payslips & Banking:** Generation of encrypted digital PDF payslips and automated bank disbursement advice CSV files (1Link / standard banking formats).

### Module 5: Employee Self-Service (ESS)
- **Responsive Web Portal:** Mobile-first layout for viewing notifications, requesting leaves, clocking in/out, and viewing historical payslips.

### Module 6–12 (Roadmap Modules)
- **Recruitment (ATS):** Requisitions, candidate pipelines, interview scorecards, automated offer letters, 1-click candidate to employee conversion.
- **Performance Management:** OKRs, KPIs, 360-degree reviews, probation evaluation checkpoints.
- **Learning & Development (L&D):** Course catalog, mandatory compliance training, completion tracking.
- **Analytics & Executive Dashboards:** Attrition analytics, gender diversity metrics, overtime cost tracking, headcount forecasting.
- **Workflows & Notifications:** Configurable event triggers (e.g., contract renewal alerts, birthday alerts) with in-app and email dispatch.
- **AI HR Copilot:** Policy inquiry assistant, job description generator, report synthesis, strictly sandboxed within tenant boundaries.
- **SaaS Platform Super Admin:** Multi-tenant provisioning, subscription plans, seat billing, support impersonation auditing.

---

## 4. Non-Functional & Operational Requirements

- **Tenant Isolation:** Enforced via `tenant_id` foreign keys, PostgreSQL Row Level Security (RLS), and application-level middleware verification.
- **Security & Privacy:** AES-256 encryption at rest for sensitive PII (CNIC, bank accounts), HTTPS in transit, short-lived signed URLs for documents.
- **Reliability:** 99.9% uptime target, immutable database audit logs, atomic database transactions for leave and payroll actions.
- **Auditability:** Every mutation records `actor_user_id`, `tenant_id`, `ip_address`, `action`, `resource_type`, `resource_id`, and `diff_summary`.
