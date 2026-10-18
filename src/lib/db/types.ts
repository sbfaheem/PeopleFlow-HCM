/**
 * Core Data Models matching the Database Schema Specification
 */

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: 'trial' | 'active' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface LegalEntity {
  id: string;
  tenantId: string;
  name: string;
  registrationNumber?: string;
  ntn?: string;
  country: string;
  currency: string;
  createdAt: string;
}

export interface Branch {
  id: string;
  tenantId: string;
  legalEntityId: string;
  name: string;
  city: string;
  address?: string;
  timezone: string;
  createdAt: string;
}

export interface Department {
  id: string;
  tenantId: string;
  name: string;
  parentId?: string;
  createdAt: string;
}

export interface Designation {
  id: string;
  tenantId: string;
  title: string;
  level: number;
  createdAt: string;
}

export type EmploymentType = 'permanent' | 'contract' | 'probation' | 'intern';
export type EmploymentStatus = 'active' | 'on_leave' | 'probation' | 'suspended' | 'terminated' | 'resigned';
export type Gender = 'male' | 'female' | 'other';

export interface Employee {
  id: string;
  tenantId: string;
  userId?: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  workEmail: string;
  personalEmail?: string;
  phone?: string;
  cnic: string; // National ID
  gender: Gender;
  dateOfBirth?: string;
  legalEntityId: string;
  branchId: string;
  departmentId: string;
  designationId: string;
  managerId?: string;
  employmentType: EmploymentType;
  employmentStatus: EmploymentStatus;
  joiningDate: string;
  probationEndDate?: string;
  confirmationDate?: string;
  exitDate?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  actorUserId: string;
  action: string;
  entityType: string;
  entityId: string;
  ipAddress?: string;
  userAgent?: string;
  oldState?: Record<string, unknown>;
  newState?: Record<string, unknown>;
  createdAt: string;
}
