import { Candidate } from './types';
import { Employee } from '../db/types';

export class RecruitmentWorkflowError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RecruitmentWorkflowError';
  }
}

/**
 * Transitions candidate through recruitment stages.
 * Prevents unauthorized or invalid state leaps.
 */
export function transitionCandidateStage(
  candidate: Candidate,
  targetStage: Candidate['stage']
): Candidate {
  if (candidate.stage === 'hired') {
    throw new RecruitmentWorkflowError('Cannot transition a candidate that is already hired.');
  }
  if (candidate.stage === 'rejected' && targetStage !== 'screening') {
    throw new RecruitmentWorkflowError('Rejected candidate must be re-opened for screening before transitioning.');
  }

  return {
    ...candidate,
    stage: targetStage,
  };
}

/**
 * Converts a hired candidate into an employee record without duplicating identities.
 */
export function convertCandidateToEmployee(
  candidate: Candidate,
  employeeData: {
    cnic: string;
    departmentId: string;
    designationId: string;
    branchId: string;
    legalEntityId: string;
    joiningDate: string;
  }
): Omit<Employee, 'id' | 'employeeNumber' | 'createdAt' | 'updatedAt' | 'isArchived'> {
  if (candidate.stage !== 'hired' && candidate.stage !== 'offered') {
    throw new RecruitmentWorkflowError('Candidate must be in offered or hired stage before conversion to employee.');
  }

  const nameParts = candidate.fullName.trim().split(' ');
  const firstName = nameParts[0] || 'Unknown';
  const lastName = nameParts.slice(1).join(' ') || 'Employee';

  return {
    tenantId: candidate.tenantId,
    firstName,
    lastName,
    workEmail: candidate.email,
    phone: candidate.phone,
    cnic: employeeData.cnic,
    gender: 'male',
    departmentId: employeeData.departmentId,
    designationId: employeeData.designationId,
    branchId: employeeData.branchId,
    legalEntityId: employeeData.legalEntityId,
    employmentType: 'permanent',
    employmentStatus: 'active',
    joiningDate: employeeData.joiningDate,
  };
}
