import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SecurityContext, ROLE_PERMISSIONS } from '../types';
import {
  hasPermission,
  requirePermission,
  assertTenantScope,
  assertPayrollSeparationOfDuties,
  AuthorizationError,
  TenantIsolationError,
} from '../guards';

describe('RBAC & Multi-Tenant Authorization Guards', () => {
  const tenant1Id = 'tenant-1111-uuid';
  const tenant2Id = 'tenant-2222-uuid';

  const payrollManagerContext: SecurityContext = {
    user: { id: 'user-pm-1', email: 'pm@tenant1.com' },
    tenant: {
      tenantId: tenant1Id,
      tenantSlug: 'acme-corp',
      membershipId: 'mem-1',
      role: 'PAYROLL_MANAGER',
      permissions: ROLE_PERMISSIONS['PAYROLL_MANAGER'],
    },
  };

  const payrollApproverContext: SecurityContext = {
    user: { id: 'user-pa-2', email: 'director@tenant1.com' },
    tenant: {
      tenantId: tenant1Id,
      tenantSlug: 'acme-corp',
      membershipId: 'mem-2',
      role: 'PAYROLL_APPROVER',
      permissions: ROLE_PERMISSIONS['PAYROLL_APPROVER'],
    },
  };

  const employeeContext: SecurityContext = {
    user: { id: 'user-emp-3', email: 'emp@tenant1.com' },
    tenant: {
      tenantId: tenant1Id,
      tenantSlug: 'acme-corp',
      membershipId: 'mem-3',
      role: 'EMPLOYEE',
      permissions: ROLE_PERMISSIONS['EMPLOYEE'],
    },
  };

  it('allows payroll manager to prepare payroll, but denies approval', () => {
    assert.equal(hasPermission(payrollManagerContext, 'payroll.prepare'), true);
    assert.equal(hasPermission(payrollManagerContext, 'payroll.approve'), false);
    assert.throws(
      () => requirePermission(payrollManagerContext, 'payroll.approve'),
      AuthorizationError
    );
  });

  it('allows payroll approver to approve, but denies prepare', () => {
    assert.equal(hasPermission(payrollApproverContext, 'payroll.approve'), true);
    assert.equal(hasPermission(payrollApproverContext, 'payroll.prepare'), false);
  });

  it('prohibits employees from viewing or preparing payroll', () => {
    assert.equal(hasPermission(employeeContext, 'payroll.prepare'), false);
    assert.equal(hasPermission(employeeContext, 'payroll.read'), false);
    assert.throws(
      () => requirePermission(employeeContext, 'payroll.read'),
      AuthorizationError
    );
  });

  it('strictly enforces tenant isolation: rejects cross-tenant resource access', () => {
    assert.doesNotThrow(() => assertTenantScope(payrollManagerContext, tenant1Id));
    assert.throws(
      () => assertTenantScope(payrollManagerContext, tenant2Id),
      TenantIsolationError
    );
  });

  it('enforces separation of duties: preparer cannot approve their own payroll run', () => {
    const preparerId = 'user-pm-1';
    const differentApproverId = 'user-pa-2';

    // Different user approving -> succeeds
    assert.doesNotThrow(() => assertPayrollSeparationOfDuties(preparerId, differentApproverId));

    // Same user attempting to approve their own run -> throws AuthorizationError
    assert.throws(
      () => assertPayrollSeparationOfDuties(preparerId, preparerId),
      AuthorizationError
    );
  });
});
