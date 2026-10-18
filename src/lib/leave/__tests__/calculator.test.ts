import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateLeaveRequest, applyLeaveApproval, LeavePolicyError } from '../calculator';
import { LeaveBalance, LeaveRequest } from '../../db/attendance-types';

describe('Leave Policy & Conflict Engine', () => {
  const balance: LeaveBalance = {
    id: 'lb-01',
    tenantId: 't-01',
    employeeId: 'emp-01',
    leaveTypeId: 'lt-annual',
    year: 2026,
    allocatedDays: 14,
    usedDays: 4,
    pendingDays: 2, // 14 - (4 + 2) = 8 available days
  };

  const existingRequests: LeaveRequest[] = [
    {
      id: 'lr-01',
      tenantId: 't-01',
      employeeId: 'emp-01',
      leaveTypeId: 'lt-annual',
      startDate: '2026-05-10',
      endDate: '2026-05-12',
      totalDays: 3,
      isHalfDay: false,
      reason: 'Family event',
      status: 'approved',
      createdAt: new Date().toISOString(),
    },
  ];

  it('allows valid request within available balance', () => {
    assert.doesNotThrow(() => {
      validateLeaveRequest(balance, existingRequests, '2026-06-01', '2026-06-03', 3);
    });
  });

  it('throws error when requested days exceed available balance', () => {
    assert.throws(
      () => validateLeaveRequest(balance, existingRequests, '2026-06-01', '2026-06-15', 10),
      LeavePolicyError
    );
  });

  it('detects and rejects overlapping leave dates', () => {
    // Conflict with 2026-05-10 to 2026-05-12
    assert.throws(
      () => validateLeaveRequest(balance, existingRequests, '2026-05-11', '2026-05-14', 4),
      LeavePolicyError
    );
  });

  it('updates balance accurately upon approval', () => {
    const updated = applyLeaveApproval(balance, 2);
    assert.equal(updated.pendingDays, 0);
    assert.equal(updated.usedDays, 6);
  });
});
