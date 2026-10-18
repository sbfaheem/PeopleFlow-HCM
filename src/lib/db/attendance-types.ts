/**
 * Data models for Phase 2: Shifts, Attendance, and Leave Management
 */

export interface Shift {
  id: string;
  tenantId: string;
  name: string;
  startTime: string; // '09:00' (HH:mm)
  endTime: string;   // '18:00' (HH:mm)
  gracePeriodMinutes: number; // e.g. 15 mins
  halfDayThresholdMinutes: number; // min worked minutes to qualify for half day (e.g. 240)
  fullDayThresholdMinutes: number; // min worked minutes to qualify for full day (e.g. 480)
  isOvernight: boolean; // true if end time < start time (cross-midnight)
  createdAt: string;
}

export type AttendanceStatus =
  | 'present'
  | 'late'
  | 'half_day'
  | 'absent'
  | 'holiday'
  | 'rest_day'
  | 'on_leave';

export type AttendancePunchSource = 'web' | 'mobile_gps' | 'biometric' | 'manual_import';

export interface AttendanceRecord {
  id: string;
  tenantId: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  firstIn?: string; // ISO datetime
  lastOut?: string; // ISO datetime
  shiftId: string;
  status: AttendanceStatus;
  lateMinutes: number;
  earlyDepartureMinutes: number;
  workedMinutes: number;
  overtimeMinutes: number;
  source: AttendancePunchSource;
  createdAt: string;
  updatedAt: string;
}

export type LeaveTypeCode = 'ANNUAL' | 'CASUAL' | 'SICK' | 'MATERNITY' | 'UNPAID';

export interface LeaveType {
  id: string;
  tenantId: string;
  code: LeaveTypeCode;
  name: string;
  isPaid: boolean;
  colorCode: string;
  annualAllowance: number;
  maxConsecutiveDays?: number;
}

export interface LeaveBalance {
  id: string;
  tenantId: string;
  employeeId: string;
  leaveTypeId: string;
  year: number;
  allocatedDays: number;
  usedDays: number;
  pendingDays: number;
}

export type LeaveRequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveRequest {
  id: string;
  tenantId: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  totalDays: number;
  isHalfDay: boolean;
  reason: string;
  status: LeaveRequestStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}
