# PeopleFlow HCM — System Architecture Document

## 1. Architectural Philosophy

PeopleFlow HCM is designed as a **Multi-Tenant, Security-First, Modular Monolith**, optimized for predictable performance, airtight tenant isolation, rapid developer iteration, and strict audit compliance.

```
                              +---------------------------------------+
                              |         Edge Network / CDN / WAF       |
                              +---------------------------------------+
                                                  |
                                                  v
                              +---------------------------------------+
                              |         Next.js 15+ App Router        |
                              |   (React 19, Server Components &      |
                              |    Server Actions / Route Handlers)   |
                              +---------------------------------------+
                                    |                           |
                                    v                           v
              +-------------------------------+   +-------------------------------+
              |   Authentication & Session    |   |    Tenant Context Middleware  |
              |   (Supabase Auth / JWT)       |   |    (Resolves tenant & claims) |
              +-------------------------------+   +-------------------------------+
                                    \                           /
                                     \                         /
                                      v                       v
                              +---------------------------------------+
                              |       Domain Services Layer           |
                              | - Tenant & RBAC Service               |
                              | - Employee Core Service               |
                              | - Attendance Calculation Engine       |
                              | - Leave Accrual & Approval Engine     |
                              | - Deterministic Payroll Engine        |
                              | - Audit Logging Service               |
                              +---------------------------------------+
                                                  |
                                                  v
                              +---------------------------------------+
                              |        Database Access Layer          |
                              |   (Prisma ORM / Supabase Client)      |
                              +---------------------------------------+
                                                  |
                                                  v
                              +---------------------------------------+
                              |         PostgreSQL Database           |
                              |  - Multi-tenant schemas / tables      |
                              |  - Row Level Security (RLS) policies  |
                              |  - UUID PKs, strict foreign keys      |
                              |  - Audit Log triggers & constraints   |
                              +---------------------------------------+
```

---

## 2. Technology Stack & Decision Rationale

| Layer | Selected Technology | Rationale & Trade-offs |
|---|---|---|
| **Framework** | Next.js 15 (App Router, Node.js 24) | Modern full-stack framework with React Server Components (RSC) to minimize client-side bundle size, server-enforced security, and built-in API route handlers. |
| **Language** | TypeScript (Strict mode) | Complete end-to-end type safety between database models, domain engines, and UI components. Eliminates null pointer exceptions and type mismatch regressions. |
| **Styling & UI** | Tailwind CSS + shadcn/ui + Lucide Icons | Accessible, high-density enterprise UI components adhering to WCAG 2.1 AA standards; consistent navy/slate corporate design token system. |
| **Database** | PostgreSQL 16+ | Industry standard relational database featuring rich transactional integrity, JSONB support for flexible allowance configurations, and Row Level Security. |
| **ORM / Querying** | Prisma ORM & Raw SQL for complex financial reports | Type-safe schema definition, automated schema migrations, relation safety, and seamless support for PostgreSQL features. |
| **Authentication** | Supabase Auth / Managed JWT with Server-Side Sessions | Secure session cookies (`HttpOnly`, `SameSite=Lax`, `Secure`), MFA support, password reset workflows, and decoupled auth identity. |
| **Schema Validation** | Zod | Runtime schema validation on every API request and form payload to prevent injection, malformed inputs, and data corruption. |
| **Document Storage** | S3-Compatible Storage (e.g. Supabase Storage / AWS S3) | Files stored securely with random UUID storage keys. Never exposed directly; served exclusively via short-lived signed URLs (15-minute validity). |
| **Unit & E2E Testing** | Vitest + Playwright | Ultra-fast unit testing for business logic (payroll engine, leave accrual, attendance calculations) and end-to-end browser integration tests. |

---

## 3. Multi-Tenancy Architecture

### 3.1 Tenant Identification Strategy
Multi-tenancy uses a **Discriminator Column (`tenant_id`) with Row Level Security (RLS)** in a shared database schema:
1. Every business entity table includes a non-nullable `tenant_id UUID REFERENCES tenants(id) ON DELETE RESTRICT`.
2. Composite indexes are placed on `(tenant_id, id)` and frequently queried filter keys (e.g., `(tenant_id, employee_id, date)`).
3. The server resolves the active `tenant_id` from the authenticated session context (or verified request header in multi-tenant memberships).
4. Application-level domain services automatically inject `tenant_id` into all queries and mutations.

### 3.2 Tenant Isolation Defense-in-Depth
- **Layer 1 (Middleware):** Validates authenticated user token and ensures user holds an active membership for the requested tenant.
- **Layer 2 (Domain Service):** Enforces tenant scoping programmatically (`where: { tenantId, ... }`).
- **Layer 3 (Database RLS):** Database session parameters (`app.current_tenant_id`) verify that even in the event of an application logic bug, cross-tenant data retrieval returns empty sets.

---

## 4. Separation of Concerns & Layers

1. **Presentation Layer (`src/app/`):**
   - Server Components for authenticated data pre-fetching.
   - Client Components for interactive UI (drawers, data tables, filters, modals).
   - Form state management with `react-hook-form` + `zodResolver`.
2. **API & Server Action Layer (`src/app/api/` & `src/actions/`):**
   - Authentication checkpoint.
   - Input sanitization & Zod schema validation.
   - Invocation of business domain services.
   - Structured error handling.
3. **Domain Services Layer (`src/lib/services/`):**
   - Pure business logic decoupled from HTTP frameworks.
   - `TenantService`, `EmployeeService`, `AttendanceService`, `LeaveService`, `PayrollService`.
   - Separation of duty guards (e.g. verifying `creator_id !== approver_id`).
4. **Data Access Layer (`src/lib/db/`):**
   - Prisma client instance configured with connection pooling.
   - Database transactions (`prisma.$transaction`) for all multi-step financial and leave deductions.
5. **Audit Logging Subsystem (`src/lib/audit/`):**
   - Asynchronous and synchronous write-through recording of mutations into `audit_logs`.

---

## 5. Extensibility & Internationalization (i18n)

- **Localization Ready:** UI strings structured to support `next-intl` dictionary lookups (`en.json`, `ur.json`).
- **Country Pack Architecture:** Payroll tax and social security calculations are isolated in country-specific strategy modules:
  - `src/lib/payroll/calculators/pakistan/` (FBR, EOBI, SESSI/PESSI)
  - `src/lib/payroll/calculators/international/` (Configurable bracket tax model)
