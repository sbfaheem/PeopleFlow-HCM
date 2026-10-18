import { Permission, SecurityContext } from './types';

export class AuthorizationError extends Error {
  constructor(message: string = 'Forbidden: Insufficient permissions') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class TenantIsolationError extends Error {
  constructor(message: string = 'Access denied: Cross-tenant operation prohibited') {
    super(message);
    this.name = 'TenantIsolationError';
  }
}

/**
 * Checks if a given security context holds a specific permission.
 */
export function hasPermission(context: SecurityContext, permission: Permission): boolean {
  if (context.user.isPlatformAdmin && permission.startsWith('platform.')) {
    return true;
  }
  if (!context.tenant) {
    return false;
  }
  return context.tenant.permissions.includes(permission);
}

/**
 * Asserts permission or throws AuthorizationError.
 */
export function requirePermission(context: SecurityContext, permission: Permission): void {
  if (!hasPermission(context, permission)) {
    throw new AuthorizationError(`Missing required permission: ${permission}`);
  }
}

/**
 * Validates that the resource tenant matches the context tenant.
 */
export function assertTenantScope(context: SecurityContext, targetTenantId: string): void {
  if (!context.tenant || context.tenant.tenantId !== targetTenantId) {
    throw new TenantIsolationError(`Tenant scope mismatch: context ${context.tenant?.tenantId} vs target ${targetTenantId}`);
  }
}

/**
 * Enforces separation of duties for payroll runs.
 * A user who prepared a payroll run cannot approve or finalize it.
 */
export function assertPayrollSeparationOfDuties(preparedByUserId: string, currentUserId: string): void {
  if (preparedByUserId === currentUserId) {
    throw new AuthorizationError('Separation of duties violation: The user who prepared this payroll run cannot approve or finalize it.');
  }
}
