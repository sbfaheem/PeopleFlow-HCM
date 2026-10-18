import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mockDb } from '../mock-repository';
import { SecurityContext, ROLE_PERMISSIONS } from '../../auth/types';
import { TenantIsolationError } from '../../auth/guards';

describe('Multi-Tenant Repository Isolation & Employee Management', () => {
  const tenant1Context: SecurityContext = {
    user: { id: 'user-hr-1', email: 'hr@acmepk.com' },
    tenant: {
      tenantId: 't-acme-pk-01',
      tenantSlug: 'acme-pk',
      membershipId: 'mem-01',
      role: 'HR_MANAGER',
      permissions: ROLE_PERMISSIONS['HR_MANAGER'],
    },
  };

  const rogueTenantContext: SecurityContext = {
    user: { id: 'user-rogue-2', email: 'intruder@othercorp.com' },
    tenant: {
      tenantId: 't-other-corp-99',
      tenantSlug: 'other-corp',
      membershipId: 'mem-99',
      role: 'HR_MANAGER',
      permissions: ROLE_PERMISSIONS['HR_MANAGER'],
    },
  };

  it('allows tenant HR to query their own seeded employees', () => {
    const employees = mockDb.getEmployees(tenant1Context);
    assert.equal(employees.length >= 2, true);
    assert.equal(employees[0].tenantId, 't-acme-pk-01');
  });

  it('prohibits rogue tenant from viewing tenant 1 employees (returns empty list)', () => {
    const rogueEmployees = mockDb.getEmployees(rogueTenantContext);
    assert.equal(rogueEmployees.length, 0);
  });

  it('prohibits rogue tenant from direct IDOR lookup of tenant 1 employee', () => {
    const existingEmpId = 'emp-01';
    assert.throws(
      () => mockDb.getEmployeeById(rogueTenantContext, existingEmpId),
      TenantIsolationError
    );
  });

  it('creates an employee with auto-generated tenant-scoped employee number', () => {
    const newEmp = mockDb.createEmployee(tenant1Context, {
      firstName: 'Tariq',
      lastName: 'Mehmood',
      workEmail: 'tariq.mehmood@acmepk.com',
      cnic: '35201-9876543-1',
      gender: 'male',
      legalEntityId: 'le-01',
      branchId: 'br-01',
      departmentId: 'dept-01',
      designationId: 'des-02',
      employmentType: 'permanent',
      employmentStatus: 'active',
      joiningDate: '2026-04-01',
    });

    assert.equal(newEmp.tenantId, 't-acme-pk-01');
    assert.match(newEmp.employeeNumber, /^EMP-\d{4}-\d{4}$/);
    assert.equal(newEmp.firstName, 'Tariq');

    // Confirm it is retrievable by tenant 1
    const fetched = mockDb.getEmployeeById(tenant1Context, newEmp.id);
    assert.equal(fetched?.id, newEmp.id);
  });
});
