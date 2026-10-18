import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateAttendanceMetrics } from '../calculator';
import { Shift } from '../../db/attendance-types';

describe('Attendance Calculation Engine', () => {
  const regularShift: Shift = {
    id: 'sh-01',
    tenantId: 't-01',
    name: 'Standard Morning Shift',
    startTime: '09:00',
    endTime: '18:00',
    gracePeriodMinutes: 15, // up to 09:15 is not late
    halfDayThresholdMinutes: 240, // 4 hours
    fullDayThresholdMinutes: 480, // 8 hours
    isOvernight: false,
    createdAt: new Date().toISOString(),
  };

  const overnightShift: Shift = {
    id: 'sh-02',
    tenantId: 't-01',
    name: 'Overnight Production Shift',
    startTime: '21:00',
    endTime: '06:00',
    gracePeriodMinutes: 15,
    halfDayThresholdMinutes: 240,
    fullDayThresholdMinutes: 480,
    isOvernight: true,
    createdAt: new Date().toISOString(),
  };

  it('marks on-time arrival within grace period as present', () => {
    const res = calculateAttendanceMetrics(
      regularShift,
      '2026-04-10',
      '2026-04-10T09:10:00',
      '2026-04-10T18:00:00'
    );
    assert.equal(res.status, 'present');
    assert.equal(res.lateMinutes, 0);
    assert.equal(res.workedMinutes, 530);
  });

  it('detects late arrival past grace period and computes late minutes', () => {
    const res = calculateAttendanceMetrics(
      regularShift,
      '2026-04-10',
      '2026-04-10T09:35:00',
      '2026-04-10T18:00:00'
    );
    assert.equal(res.status, 'late');
    assert.equal(res.lateMinutes, 35);
  });

  it('calculates overtime when leaving after shift end', () => {
    const res = calculateAttendanceMetrics(
      regularShift,
      '2026-04-10',
      '2026-04-10T09:00:00',
      '2026-04-10T20:00:00'
    );
    assert.equal(res.status, 'present');
    assert.equal(res.overtimeMinutes, 120); // 2 hours overtime
  });

  it('correctly handles overnight cross-midnight shifts', () => {
    const res = calculateAttendanceMetrics(
      overnightShift,
      '2026-04-10',
      '2026-04-10T21:00:00',
      '2026-04-11T06:00:00'
    );
    assert.equal(res.status, 'present');
    assert.equal(res.lateMinutes, 0);
    assert.equal(res.workedMinutes, 540);
  });

  it('identifies half-day when worked minutes fall between half and full thresholds', () => {
    const res = calculateAttendanceMetrics(
      regularShift,
      '2026-04-10',
      '2026-04-10T09:00:00',
      '2026-04-10T14:00:00' // 5 hours worked (300 mins)
    );
    assert.equal(res.status, 'half_day');
  });
});
