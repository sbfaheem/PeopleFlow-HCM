import { Tenant, LegalEntity, Branch, Department, Designation, Employee, AuditLog } from './types';
import { assertTenantScope, TenantIsolationError } from '../auth/guards';
import { SecurityContext } from '../auth/types';

/**
 * In-memory Mock Repository for Multi-Tenant Testing & Development.
 * Enforces tenant-isolation on every query and mutation.
 */
class MockDatabase {
  public tenants: Tenant[] = [];
  public legalEntities: LegalEntity[] = [];
  public branches: Branch[] = [];
  public departments: Department[] = [];
  public designations: Designation[] = [];
  public employees: Employee[] = [];
  public auditLogs: AuditLog[] = [];

  constructor() {
    this.seedDefaultTenant();
  }

  private seedDefaultTenant() {
    const tenantId = 't-acme-pk-01';
    this.tenants.push({
      id: tenantId,
      name: 'Acme Technologies Pakistan',
      slug: 'acme-pk',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const legalEntityId = 'le-01';
    this.legalEntities.push({
      id: legalEntityId,
      tenantId,
      name: 'Acme Tech (Pvt) Limited',
      registrationNumber: 'CUIN-0192837',
      ntn: '7482910-4',
      country: 'Pakistan',
      currency: 'PKR',
      createdAt: new Date().toISOString(),
    });

    const branchIdKarachi = 'br-01';
    const branchIdLahore = 'br-02';
    this.branches.push(
      {
        id: branchIdKarachi,
        tenantId,
        legalEntityId,
        name: 'Karachi Head Office (Clifton)',
        city: 'Karachi',
        address: 'Suite 401, Executive Tower, Clifton Block 5',
        timezone: 'Asia/Karachi',
        createdAt: new Date().toISOString(),
      },
      {
        id: branchIdLahore,
        tenantId,
        legalEntityId,
        name: 'Lahore Tech Center (Gulberg)',
        city: 'Lahore',
        address: 'Plaza 14, Main Boulevard, Gulberg III',
        timezone: 'Asia/Karachi',
        createdAt: new Date().toISOString(),
      }
    );

    const deptEng = 'dept-01';
    const deptHR = 'dept-02';
    const deptFin = 'dept-03';
    this.departments.push(
      { id: deptEng, tenantId, name: 'Engineering', createdAt: new Date().toISOString() },
      { id: deptHR, tenantId, name: 'People & Culture', createdAt: new Date().toISOString() },
      { id: deptFin, tenantId, name: 'Finance & Accounts', createdAt: new Date().toISOString() }
    );

    const desLead = 'des-01';
    const desDev = 'des-02';
    const desHR = 'des-03';
    this.designations.push(
      { id: desLead, tenantId, title: 'Lead Software Architect', level: 5, createdAt: new Date().toISOString() },
      { id: desDev, tenantId, title: 'Senior Full Stack Engineer', level: 3, createdAt: new Date().toISOString() },
      { id: desHR, tenantId, title: 'HR Manager', level: 4, createdAt: new Date().toISOString() }
    );

    // Seed initial employees
    this.employees.push(
      {
        id: 'emp-01',
        tenantId,
        employeeNumber: 'EMP-2026-0001',
        firstName: 'Zainab',
        lastName: 'Ahmed',
        workEmail: 'zainab.ahmed@acmepk.com',
        cnic: '42201-1234567-2',
        gender: 'female',
        legalEntityId,
        branchId: branchIdKarachi,
        departmentId: deptHR,
        designationId: desHR,
        employmentType: 'permanent',
        employmentStatus: 'active',
        joiningDate: '2024-01-15',
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'emp-02',
        tenantId,
        employeeNumber: 'EMP-2026-0002',
        firstName: 'Bilal',
        lastName: 'Faheem',
        workEmail: 'bilal.faheem@acmepk.com',
        cnic: '42101-7654321-1',
        gender: 'male',
        legalEntityId,
        branchId: branchIdKarachi,
        departmentId: deptEng,
        designationId: desLead,
        employmentType: 'permanent',
        employmentStatus: 'active',
        joiningDate: '2024-03-01',
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );
  }

  // --- Multi-Tenant Repository Methods ---

  public getEmployees(context: SecurityContext, filters?: { departmentId?: string; status?: string; search?: string }): Employee[] {
    if (!context.tenant) throw new TenantIsolationError('Missing tenant context');
    const tenantId = context.tenant.tenantId;

    return this.employees.filter((emp) => {
      if (emp.tenantId !== tenantId) return false;
      if (emp.isArchived) return false;
      if (filters?.departmentId && emp.departmentId !== filters.departmentId) return false;
      if (filters?.status && emp.employmentStatus !== filters.status) return false;
      if (filters?.search) {
        const query = filters.search.toLowerCase();
        const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
        return fullName.includes(query) || emp.employeeNumber.toLowerCase().includes(query) || emp.workEmail.toLowerCase().includes(query);
      }
      return true;
    });
  }

  public getEmployeeById(context: SecurityContext, id: string): Employee | null {
    if (!context.tenant) throw new TenantIsolationError('Missing tenant context');
    const emp = this.employees.find((e) => e.id === id);
    if (!emp) return null;
    assertTenantScope(context, emp.tenantId);
    return emp;
  }

  public createEmployee(context: SecurityContext, data: Omit<Employee, 'id' | 'tenantId' | 'employeeNumber' | 'createdAt' | 'updatedAt' | 'isArchived'>): Employee {
    if (!context.tenant) throw new TenantIsolationError('Missing tenant context');
    const tenantId = context.tenant.tenantId;

    // Generate unique employee number within tenant
    const existingCount = this.employees.filter((e) => e.tenantId === tenantId).length;
    const year = new Date().getFullYear();
    const seq = String(existingCount + 1).padStart(4, '0');
    const employeeNumber = `EMP-${year}-${seq}`;

    const newEmployee: Employee = {
      ...data,
      id: `emp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      tenantId,
      employeeNumber,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.employees.push(newEmployee);

    // Write audit log
    this.auditLogs.push({
      id: `audit-${Date.now()}`,
      tenantId,
      actorUserId: context.user.id,
      action: 'EMPLOYEE_CREATED',
      entityType: 'Employee',
      entityId: newEmployee.id,
      newState: newEmployee as unknown as Record<string, unknown>,
      createdAt: new Date().toISOString(),
    });

    return newEmployee;
  }

  public getDepartments(context: SecurityContext): Department[] {
    if (!context.tenant) throw new TenantIsolationError('Missing tenant context');
    return this.departments.filter((d) => d.tenantId === context.tenant?.tenantId);
  }

  public getBranches(context: SecurityContext): Branch[] {
    if (!context.tenant) throw new TenantIsolationError('Missing tenant context');
    return this.branches.filter((b) => b.tenantId === context.tenant?.tenantId);
  }

  public getDesignations(context: SecurityContext): Designation[] {
    if (!context.tenant) throw new TenantIsolationError('Missing tenant context');
    return this.designations.filter((d) => d.tenantId === context.tenant?.tenantId);
  }
}

export const mockDb = new MockDatabase();
