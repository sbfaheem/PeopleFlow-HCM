# PeopleFlow HCM — Implementation Roadmap

This roadmap details the engineering execution strategy for PeopleFlow HCM, divided into sequential, independently testable phases.

---

## Phase 0: Foundations, Architecture & Specifications (Current Phase)
- [x] Workspace & environment inspection.
- [x] Product Requirements Document (`docs/PRODUCT_REQUIREMENTS.md`).
- [x] System Architecture Document (`docs/ARCHITECTURE.md`).
- [x] Database Schema Specification (`docs/DATABASE_SCHEMA.md`).
- [x] Security Model & RBAC Matrix (`docs/SECURITY_MODEL.md`).
- [x] Test Plan & Quality Gates (`docs/TEST_PLAN.md`).
- [x] Implementation Roadmap (`docs/IMPLEMENTATION_ROADMAP.md`).
- [ ] Initialize clean Next.js 15 TypeScript project with Tailwind CSS, Lucide, and Vitest.

---

## Phase 1: Multi-Tenancy, RBAC & Core HR Foundation
- [ ] Multi-tenant Prisma schema migrations and seed scripts.
- [ ] Authentication middleware and tenant-context session resolver.
- [ ] Granular permission evaluation engine (`hasPermission(session, 'employees.read')`).
- [ ] Organization structure management:
  - Legal entities, branches, departments, and designations.
- [ ] Employee directory:
  - Unique employee number generation (`EMP-{YYYY}-{SEQ}`).
  - Employee list view with search, pagination, status and department filters.
  - Comprehensive employee detail profile (Personal, Contact, Job, Manager hierarchy).
  - Private document metadata tracking and emergency contact cards.
- [ ] Comprehensive Unit & Integration tests for Tenant isolation and Employee CRUD.

---

## Phase 2: Attendance, Work Schedules & Leave Management
- [ ] Work shifts configuration (regular, flexible, overnight cross-midnight shifts).
- [ ] Shift assignment engine and company holiday calendar.
- [ ] Clock-in / Clock-out logging with punch validation and missing-punch detection.
- [ ] Attendance correction request workflow (submit, review, approve/reject).
- [ ] Leave types and policy configuration (annual, casual, sick, maternity, unpaid).
- [ ] Leave accrual and balance calculation engine.
- [ ] Leave application and multi-level approval workflow with conflict detection.
- [ ] Employee Self-Service (ESS) portal view for attendance and leaves.
- [ ] Unit tests for overnight punch tracking, leave balance math, and overlap prevention.

---

## Phase 3: Deterministic Payroll Engine & Statutory Compliance (Pakistan First)
- [ ] Salary structures, base pay, and allowance components (fixed & percentage-based).
- [ ] Effective-dated employee compensation records.
- [ ] Pure-function deterministic calculation engine (zero floating-point math):
  - FBR Tax withholding calculation (progressive annual tax brackets).
  - EOBI employer and employee statutory contributions.
  - Provincial social security deductions (PESSI/SESSI).
  - Unpaid leave deductions based on approved leave history.
  - Proration for mid-period joining and exit dates.
- [ ] Payroll runs management:
  - Drafting, calculation, review, and separation-of-duties approval.
  - Finalization lock (immutable audit record and variance detection).
- [ ] Digital payslip generation and download.
- [ ] Unit tests for rounding precision, tax bracket thresholds, and proration formulas.

---

## Phase 4: Dashboards, Imports/Exports, Hardening & Enterprise Polish
- [ ] Executive & HR Analytics Dashboards:
  - Headcount composition, departmental distribution, absenteeism, overtime trends, payroll costs.
- [ ] CSV bulk import engine with validation and preview:
  - Employee bulk onboarding import.
  - Biometric device raw attendance punch import.
- [ ] CSV / Excel authorized exports with data masking.
- [ ] SaaS Platform Super Admin dashboard:
  - Tenant list, provisioning, module entitlement flags, platform audit logs.
- [ ] Comprehensive End-to-End (E2E) testing suite with Playwright.
- [ ] Security audit: IDOR verification, tenant isolation penetration test suite.

---

## Phase 5: Advanced Modules (Recruitment, Performance, L&D & Automation)
- [ ] Recruitment (ATS): Job requisitions, applicant pipeline, candidate scorecards.
- [ ] Performance Management: Review cycles, OKRs, manager reviews.
- [ ] Learning & Development: Course management, training assignments, tracking.
- [ ] Automated workflow rules & notification triggers.

---

## Phase 6: AI HR Copilot & International Expansion
- [ ] AI HR Copilot with strict tenant-scoped retrieval (RAG).
- [ ] International statutory tax packs (GCC, UK, US).
- [ ] Multi-lingual interface (Urdu RTL support).
