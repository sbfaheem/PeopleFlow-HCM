/**
 * PeopleFlow HCM - Core Types and Permission Registry
 * Multi-tenant enterprise RBAC model
 */

export type RoleName =
  | 'PLATFORM_SUPER_ADMIN'
  | 'TENANT_OWNER'
  | 'COMPANY_ADMIN'
  | 'HR_MANAGER'
  | 'PAYROLL_MANAGER'
  | 'PAYROLL_APPROVER'
  | 'DEPARTMENT_MANAGER'
  | 'RECRUITER'
  | 'EMPLOYEE'
  | 'AUDITOR'
  | 'EXTERNAL_ACCOUNTANT';

export const PERMISSIONS = [
  // Platform Super Admin
  'platform.tenants.manage',
  'platform.plans.manage',
  'platform.audit.read',

  // Tenant Administration
  'tenant.settings.manage',
  'users.manage',
  'roles.manage',

  // Organization Hierarchy
  'org.structure.read',
  'org.structure.manage',

  // Core HR & Employees
  'employees.read',
  'employees.create',
  'employees.update',
  'employees.archive',
  'employees.compensation.read',
  'employees.documents.read',
  'employees.documents.upload',

  // Attendance & Shifts
  'attendance.read',
  'attendance.punch',
  'attendance.manage',
  'attendance.correct.request',
  'attendance.correct.approve',
  'shifts.manage',

  // Leaves
  'leave.read',
  'leave.request',
  'leave.approve',
  'leave.policies.manage',

  // Payroll
  'payroll.read',
  'payroll.prepare',
  'payroll.approve',
  'payroll.finalize',

  // Audit Logs
  'audit_logs.read',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export interface SessionUser {
  id: string;
  email: string;
  isPlatformAdmin?: boolean;
}

export interface TenantContext {
  tenantId: string;
  tenantSlug: string;
  membershipId: string;
  role: RoleName;
  permissions: Permission[];
}

export interface SecurityContext {
  user: SessionUser;
  tenant?: TenantContext;
  employeeId?: string;
}

export const ROLE_PERMISSIONS: Record<RoleName, Permission[]> = {
  PLATFORM_SUPER_ADMIN: [
    'platform.tenants.manage',
    'platform.plans.manage',
    'platform.audit.read',
  ],
  TENANT_OWNER: [
    'tenant.settings.manage',
    'users.manage',
    'roles.manage',
    'org.structure.read',
    'org.structure.manage',
    'employees.read',
    'employees.create',
    'employees.update',
    'employees.archive',
    'employees.compensation.read',
    'employees.documents.read',
    'employees.documents.upload',
    'attendance.read',
    'attendance.punch',
    'attendance.manage',
    'attendance.correct.approve',
    'shifts.manage',
    'leave.read',
    'leave.approve',
    'leave.policies.manage',
    'payroll.read',
    'payroll.approve',
    'payroll.finalize',
    'audit_logs.read',
  ],
  COMPANY_ADMIN: [
    'tenant.settings.manage',
    'users.manage',
    'roles.manage',
    'org.structure.read',
    'org.structure.manage',
    'employees.read',
    'employees.create',
    'employees.update',
    'employees.archive',
    'employees.compensation.read',
    'employees.documents.read',
    'employees.documents.upload',
    'attendance.read',
    'attendance.punch',
    'attendance.manage',
    'attendance.correct.approve',
    'shifts.manage',
    'leave.read',
    'leave.approve',
    'leave.policies.manage',
    'payroll.read',
    'payroll.approve',
    'payroll.finalize',
    'audit_logs.read',
  ],
  HR_MANAGER: [
    'org.structure.read',
    'org.structure.manage',
    'employees.read',
    'employees.create',
    'employees.update',
    'employees.archive',
    'employees.documents.read',
    'employees.documents.upload',
    'attendance.read',
    'attendance.punch',
    'attendance.manage',
    'attendance.correct.approve',
    'shifts.manage',
    'leave.read',
    'leave.approve',
    'leave.policies.manage',
    'audit_logs.read',
  ],
  PAYROLL_MANAGER: [
    'employees.read',
    'employees.compensation.read',
    'attendance.read',
    'leave.read',
    'payroll.read',
    'payroll.prepare', // Separation of Duties: Prepare only
  ],
  PAYROLL_APPROVER: [
    'employees.read',
    'employees.compensation.read',
    'payroll.read',
    'payroll.approve', // Separation of Duties: Approve/finalize only
    'payroll.finalize',
  ],
  DEPARTMENT_MANAGER: [
    'org.structure.read',
    'employees.read',
    'attendance.read',
    'attendance.correct.approve',
    'leave.read',
    'leave.approve',
  ],
  RECRUITER: [
    'org.structure.read',
    'employees.read',
  ],
  EMPLOYEE: [
    'employees.read',
    'attendance.punch',
    'attendance.correct.request',
    'leave.read',
    'leave.request',
  ],
  AUDITOR: [
    'org.structure.read',
    'employees.read',
    'employees.compensation.read',
    'attendance.read',
    'leave.read',
    'payroll.read',
    'audit_logs.read',
  ],
  EXTERNAL_ACCOUNTANT: [
    'employees.compensation.read',
    'payroll.read',
    'audit_logs.read',
  ],
};
