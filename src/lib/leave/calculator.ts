import { LeaveBalance, LeaveRequest } from '../db/attendance-types';

export class LeavePolicyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LeavePolicyError';
  }
}

/**
 * Validates whether an employee has sufficient balance and no conflicting overlapping dates.
 */
export function validateLeaveRequest(
  balance: LeaveBalance,
  existingRequests: LeaveRequest[],
  startDate: string,
  endDate: string,
  requestedDays: number
): void {
  // Check available balance
  const availableDays = balance.allocatedDays - (balance.usedDays + balance.pendingDays);
  if (requestedDays > availableDays) {
    throw new LeavePolicyError(
      `Insufficient leave balance. Available: ${availableDays} days, Requested: ${requestedDays} days.`
    );
  }

  // Check date bounds
  if (new Date(startDate) > new Date(endDate)) {
    throw new LeavePolicyError('Leave start date cannot be after end date.');
  }

  // Check overlapping requests
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  for (const req of existingRequests) {
    if (req.status === 'rejected' || req.status === 'cancelled') continue;
    const reqStart = new Date(req.startDate).getTime();
    const reqEnd = new Date(req.endDate).getTime();

    // Overlap occurs if (start <= reqEnd && end >= reqStart)
    if (start <= reqEnd && end >= reqStart) {
      throw new LeavePolicyError(
        `Overlapping leave conflict with an existing ${req.status} request from ${req.startDate} to ${req.endDate}.`
      );
    }
  }
}

/**
 * Calculates new balance state upon request approval.
 */
export function applyLeaveApproval(balance: LeaveBalance, days: number): LeaveBalance {
  return {
    ...balance,
    pendingDays: Math.max(0, balance.pendingDays - days),
    usedDays: balance.usedDays + days,
  };
}
