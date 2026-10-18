# PeopleFlow HCM

> **One platform. Every employee. Smarter decisions.**

PeopleFlow HCM is a multi-tenant, cloud-native Human Capital Management (HCM) SaaS platform designed with strict tenant isolation, role-based access control (RBAC), and localized compliance, built first for the Pakistan market (FBR, EOBI, SESSI/PESSI) with an architecture ready for international expansion.

---

## 🚀 Key Modules & Capabilities

- **Multi-Tenant Core HR**: Tenant-isolated organizational hierarchy (legal entities, branches, departments, designations), unique tenant-scoped employee numbering (`EMP-YYYY-XXXX`), directory filters, and masked PII (CNIC masking).
- **Attendance & Shift Management**: Work schedule configurations, grace periods, overnight cross-midnight shifts, web punch clock-in/out, and overtime calculations.
- **Leave Management**: Leave policies (Annual, Casual, Sick, Unpaid LWP), conflict & overlap detection, balance tracking, and multi-tier manager approvals.
- **Deterministic Pakistan Payroll Engine**: Exact decimal precision (no floating-point drift), progressive FBR income tax withholding (Tax Year 2025–26), EOBI statutory benchmarks, SESSI/PESSI ceilings, mid-month proration, and digital payslips.
- **Separation of Duties (SoD)**: Enforced server-side checks ensuring the preparer of a payroll run cannot approve or finalize the same run.
- **Workforce Analytics**: Executive dashboard with headcount metrics, departmental distribution, punctuality rates, and compliance health.
- **CSV Bulk Import/Export**: Data validation, duplicate email detection, and permission-gated data export.
- **Recruitment (ATS)**: Pipeline Kanban board (Screening, Interviewing, Offered, Hired) and 1-click candidate-to-employee conversion.
- **AI HR Copilot**: Sandboxed natural-language policy assistant with mutation guardrails preventing unauthorized state changes.
- **Platform Super Admin**: Tenant provisioning, subscription plan tiers, and module entitlement management.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, React 19)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS & Lucide Icons
- **Testing**: Node.js test runner & `tsx` (36 automated unit & domain tests)
- **Validation**: Zod schema validation

---

## 📂 Project Structure

```
peopleflow/
├── docs/                        # Complete Architectural Specifications
│   ├── PRODUCT_REQUIREMENTS.md  # PRD & Functional Scope
│   ├── ARCHITECTURE.md          # Multi-Tenant System Architecture
│   ├── DATABASE_SCHEMA.md       # PostgreSQL Relational Schema
│   ├── SECURITY_MODEL.md        # STRIDE Threat Model & RBAC Matrix
│   ├── IMPLEMENTATION_ROADMAP.md# Phased Implementation Plan
│   └── TEST_PLAN.md             # Test Strategy & Quality Gates
├── src/
│   ├── app/                     # Next.js App Router (14 Production Routes)
│   │   ├── app/                 # Authenticated Company Application Shell
│   │   │   ├── dashboard/       # Executive Workforce Analytics
│   │   │   ├── employees/       # Core HR Directory & Employee Profiles
│   │   │   ├── organization/    # Legal Entities, Branches, Departments, Designations
│   │   │   ├── attendance/      # Work Shifts & Clock Punch Logs
│   │   │   ├── leave/           # Leave Balances & Approval Requests
│   │   │   ├── payroll/         # Pakistan Payroll Engine & Digital Payslips
│   │   │   ├── recruitment/     # ATS Candidate Pipeline Kanban
│   │   │   ├── ai-assistant/    # Sandboxed AI HR Copilot
│   │   │   └── settings/        # Company & Compliance Configuration
│   │   ├── platform/tenants/    # SaaS Platform Super Admin
│   │   └── page.tsx             # Marketing & Product Landing Page
│   ├── components/layout/       # Sidebar & TopNav Navigation
│   └── lib/
│       ├── auth/                # RBAC Types, Permissions & Server Guards
│       ├── db/                  # In-Memory Multi-Tenant Repository
│       ├── attendance/          # Shift & Punch Calculator Engine
│       ├── leave/               # Leave Accrual & Conflict Engine
│       ├── payroll/             # FBR Tax Slabs, EOBI & Payslip Calculator
│       ├── csv/                 # CSV Import/Export Service
│       ├── advanced/            # ATS Recruitment & OKR Progress Services
│       └── copilot/             # AI HR Copilot Engine & Guardrails
```

---

## 🧪 Running Tests

The test suite covers RBAC guards, tenant isolation, separation of duties, attendance metrics, leave policies, deterministic payroll calculations, CSV validation, and AI Copilot guardrails:

```bash
npm test
```

Result:
```
✔ Advanced Modules: Recruitment ATS & Performance OKRs (5 tests)
✔ Attendance Calculation Engine (5 tests)
✔ RBAC & Multi-Tenant Authorization Guards (5 tests)
✔ AI HR Copilot & Security Guardrails (3 tests)
✔ CSV Bulk Importer & Data Masked Exporter (3 tests)
✔ Multi-Tenant Repository Isolation & Employee Management (4 tests)
✔ Leave Policy & Conflict Engine (4 tests)
✔ Deterministic Pakistan Payroll Engine (7 tests)
ℹ tests 36 | suites 8 | pass 36 | fail 0
```

---

## 🏃 Getting Started Locally

1. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

4. Build for production:
   ```bash
   npm run build
   ```
