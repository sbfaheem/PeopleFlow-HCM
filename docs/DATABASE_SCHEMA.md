# PeopleFlow HCM — Database Schema Specification

## 1. Schema Conventions & Standard Practices

- **Primary Keys:** UUID v4 (`gen_random_uuid()` / `cuid()`) for all primary identifiers.
- **Tenant Scoping:** Every operational table MUST include a non-nullable `tenant_id` column with a foreign key pointing to `tenants(id)`.
- **Naming Conventions:** `snake_case` for PostgreSQL tables and columns. Plural table names (e.g., `employees`, `attendance_records`).
- **Timestamps:** Every table contains `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()` and `updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`.
- **Soft Deletion / Archival:** Core business records use `is_archived BOOLEAN NOT NULL DEFAULT FALSE` and `archived_at TIMESTAMPTZ` to preserve historical referential integrity.
- **Monetary Values:** Stored as `DECIMAL(14, 2)` or integer minor units (PKR paisas) — **NEVER** floating-point (`FLOAT`/`REAL`).

---

## 2. Entity Relationship Diagram (Textual Representation)

```
+---------------------------------------------------------------------------------------------------+
|                                       SAAS CORE & TENANCY                                         |
+---------------------------------------------------------------------------------------------------+
[tenants] 1 --- * [tenant_settings]
   |  1
   |---------- * [legal_entities] 1 --- * [branches] 1 --- * [departments]
   |  1
   |---------- * [tenant_memberships] * --- 1 [users]
   |  1
   |---------- * [roles] 1 --- * [role_permissions] * --- 1 [permissions]
   |  1
   |---------- * [user_roles]
   |
+--|------------------------------------------------------------------------------------------------+
|  |                                    CORE HR & EMPLOYEE DIRECTORY                                |
+--|------------------------------------------------------------------------------------------------+
   |  1
   |---------- * [employees] 1 --- * [employee_documents]
   |                |  1
   |                |---------- * [employment_contracts]
   |                |  1
   |                |---------- * [employee_assets]
   |                |  1
   |                |---------- * [designation_history]
   |
+--|------------------------------------------------------------------------------------------------+
|  |                                    TIME & ATTENDANCE MODULE                                    |
+--|------------------------------------------------------------------------------------------------+
   |  1
   |---------- * [shifts] 1 --- * [shift_assignments] * --- 1 [employees]
   |  1
   |---------- * [holidays]
   |  1
   |---------- * [attendance_records] 1 --- * [attendance_corrections]
   |
+--|------------------------------------------------------------------------------------------------+
|  |                                        LEAVE MODULE                                            |
+--|------------------------------------------------------------------------------------------------+
   |  1
   |---------- * [leave_types] 1 --- * [leave_policies]
   |  1
   |---------- * [leave_balances] * --- 1 [employees]
   |  1
   |---------- * [leave_requests] 1 --- * [approval_steps]
   |
+--|------------------------------------------------------------------------------------------------+
|  |                                       PAYROLL ENGINE                                           |
+--|------------------------------------------------------------------------------------------------+
   |  1
   |---------- * [salary_structures] 1 --- * [salary_components]
   |  1
   |---------- * [employee_compensation] * --- 1 [employees]
   |  1
   |---------- * [payroll_runs] 1 --- * [payroll_items] 1 --- * [payroll_item_lines]
   |  1
   |---------- * [audit_logs]
   |  1
   |---------- * [notifications]
+---------------------------------------------------------------------------------------------------+
```

---

## 3. Data Dictionary: Core Tables

### 3.1 Tenancy & IAM
- **`tenants`**: `id (UUID PK)`, `slug (VARCHAR UNIQUE)`, `name (VARCHAR)`, `status (ENUM: trial, active, suspended)`, `created_at`, `updated_at`.
- **`tenant_settings`**: `id (UUID PK)`, `tenant_id (UUID FK)`, `fiscal_year_start_month (INT)`, `default_currency (VARCHAR, e.g. 'PKR')`, `timezone (VARCHAR, 'Asia/Karachi')`, `date_format (VARCHAR)`.
- **`users`**: `id (UUID PK)`, `email (VARCHAR UNIQUE)`, `phone (VARCHAR)`, `is_platform_admin (BOOLEAN)`, `created_at`.
- **`tenant_memberships`**: `id (UUID PK)`, `tenant_id (UUID FK)`, `user_id (UUID FK)`, `status (ENUM: active, invited, suspended)`, `joined_at`.
- **`roles`**: `id (UUID PK)`, `tenant_id (UUID FK)`, `name (VARCHAR)`, `description (TEXT)`, `is_system_role (BOOLEAN)`.
- **`permissions`**: `id (UUID PK)`, `code (VARCHAR UNIQUE, e.g. 'employees.read')`, `category (VARCHAR)`, `description (TEXT)`.
- **`role_permissions`**: `role_id (UUID FK)`, `permission_id (UUID FK)`.
- **`user_roles`**: `membership_id (UUID FK)`, `role_id (UUID FK)`.

### 3.2 Organization & Core HR
- **`legal_entities`**: `id (UUID PK)`, `tenant_id (UUID FK)`, `name (VARCHAR)`, `registration_number (VARCHAR)`, `ntn (VARCHAR)`.
- **`branches`**: `id (UUID PK)`, `tenant_id (UUID FK)`, `legal_entity_id (UUID FK)`, `name (VARCHAR)`, `city (VARCHAR)`, `address (TEXT)`.
- **`departments`**: `id (UUID PK)`, `tenant_id (UUID FK)`, `name (VARCHAR)`, `parent_id (UUID FK NULLABLE)`.
- **`designations`**: `id (UUID PK)`, `tenant_id (UUID FK)`, `title (VARCHAR)`, `level (INT)`.
- **`employees`**:
  - `id (UUID PK)`, `tenant_id (UUID FK)`, `user_id (UUID FK NULLABLE)`, `employee_number (VARCHAR)`.
  - `first_name (VARCHAR)`, `last_name (VARCHAR)`, `work_email (VARCHAR)`, `personal_email (VARCHAR)`.
  - `cnic (VARCHAR)`, `gender (ENUM: male, female, other)`, `date_of_birth (DATE)`.
  - `department_id (UUID FK)`, `designation_id (UUID FK)`, `branch_id (UUID FK)`, `manager_id (UUID FK NULLABLE)`.
  - `employment_type (ENUM: permanent, contract, probation, intern)`.
  - `employment_status (ENUM: active, on_leave, probation, suspended, terminated, resigned)`.
  - `joining_date (DATE)`, `probation_end_date (DATE)`, `confirmation_date (DATE)`, `exit_date (DATE)`.
  - `is_archived (BOOLEAN DEFAULT FALSE)`.

### 3.3 Attendance & Work Schedules
- **`shifts`**: `id (UUID PK)`, `tenant_id (UUID FK)`, `name (VARCHAR)`, `start_time (TIME)`, `end_time (TIME)`, `grace_period_mins (INT)`, `is_overnight (BOOLEAN)`.
- **`shift_assignments`**: `id (UUID PK)`, `tenant_id (UUID FK)`, `employee_id (UUID FK)`, `shift_id (UUID FK)`, `start_date (DATE)`, `end_date (DATE NULLABLE)`.
- **`attendance_records`**:
  - `id (UUID PK)`, `tenant_id (UUID FK)`, `employee_id (UUID FK)`, `date (DATE)`.
  - `first_in (TIMESTAMPTZ)`, `last_out (TIMESTAMPTZ)`.
  - `status (ENUM: present, late, half_day, absent, holiday, rest_day, on_leave)`.
  - `late_minutes (INT)`, `early_departure_minutes (INT)`, `overtime_minutes (INT)`.
  - `source (ENUM: web, mobile_gps, biometric, manual_import)`.
- **`attendance_corrections`**: `id (UUID PK)`, `tenant_id (UUID FK)`, `attendance_id (UUID FK)`, `employee_id (UUID FK)`, `requested_in (TIMESTAMPTZ)`, `requested_out (TIMESTAMPTZ)`, `reason (TEXT)`, `status (ENUM: pending, approved, rejected)`, `approved_by (UUID FK NULLABLE)`.

### 3.4 Leave Management
- **`leave_types`**: `id (UUID PK)`, `tenant_id (UUID FK)`, `name (VARCHAR)`, `code (VARCHAR)`, `is_paid (BOOLEAN)`, `color_code (VARCHAR)`.
- **`leave_policies`**: `id (UUID PK)`, `tenant_id (UUID FK)`, `leave_type_id (UUID FK)`, `annual_allowance (DECIMAL(5,2))`, `accrual_frequency (ENUM: annual_upfront, monthly_prorata)`, `max_carry_forward (DECIMAL(5,2))`.
- **`leave_balances`**: `id (UUID PK)`, `tenant_id (UUID FK)`, `employee_id (UUID FK)`, `leave_type_id (UUID FK)`, `year (INT)`, `allocated_days (DECIMAL(5,2))`, `used_days (DECIMAL(5,2))`, `pending_days (DECIMAL(5,2))`.
- **`leave_requests`**: `id (UUID PK)`, `tenant_id (UUID FK)`, `employee_id (UUID FK)`, `leave_type_id (UUID FK)`, `start_date (DATE)`, `end_date (DATE)`, `total_days (DECIMAL(5,2))`, `is_half_day (BOOLEAN)`, `status (ENUM: pending, approved, rejected, cancelled)`.

### 3.5 Payroll Engine
- **`salary_structures`**: `id (UUID PK)`, `tenant_id (UUID FK)`, `name (VARCHAR)`, `currency (VARCHAR DEFAULT 'PKR')`.
- **`salary_components`**: `id (UUID PK)`, `tenant_id (UUID FK)`, `structure_id (UUID FK)`, `name (VARCHAR)`, `type (ENUM: earning, deduction, employer_cost)`, `calculation_type (ENUM: fixed_amount, percentage_of_basic)`, `percentage_value (DECIMAL(5,2))`, `is_taxable (BOOLEAN)`.
- **`employee_compensation`**: `id (UUID PK)`, `tenant_id (UUID FK)`, `employee_id (UUID FK)`, `structure_id (UUID FK)`, `gross_salary (DECIMAL(14,2))`, `basic_salary (DECIMAL(14,2))`, `effective_date (DATE)`.
- **`payroll_runs`**: `id (UUID PK)`, `tenant_id (UUID FK)`, `period_month (INT)`, `period_year (INT)`, `status (ENUM: draft, calculated, pending_approval, approved, finalized, cancelled)`, `total_gross (DECIMAL(14,2))`, `total_deductions (DECIMAL(14,2))`, `total_net (DECIMAL(14,2))`, `prepared_by (UUID FK)`, `approved_by (UUID FK NULLABLE)`, `finalized_at (TIMESTAMPTZ NULLABLE)`.
- **`payroll_items`**: `id (UUID PK)`, `tenant_id (UUID FK)`, `payroll_run_id (UUID FK)`, `employee_id (UUID FK)`, `gross_pay (DECIMAL(14,2))`, `total_deductions (DECIMAL(14,2))`, `net_pay (DECIMAL(14,2))`.
- **`payroll_item_lines`**: `id (UUID PK)`, `payroll_item_id (UUID FK)`, `component_name (VARCHAR)`, `component_type (ENUM: earning, deduction, tax, statutory)`, `amount (DECIMAL(14,2))`.

### 3.6 Auditing & System Logs
- **`audit_logs`**: `id (UUID PK)`, `tenant_id (UUID FK)`, `actor_user_id (UUID FK)`, `action (VARCHAR)`, `entity_type (VARCHAR)`, `entity_id (VARCHAR)`, `ip_address (VARCHAR)`, `user_agent (TEXT)`, `old_state (JSONB)`, `new_state (JSONB)`, `created_at (TIMESTAMPTZ)`.
