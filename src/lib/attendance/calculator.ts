import { Shift, AttendanceStatus } from '../db/attendance-types';

export interface PunchCalculationResult {
  status: AttendanceStatus;
  lateMinutes: number;
  earlyDepartureMinutes: number;
  workedMinutes: number;
  overtimeMinutes: number;
}

/**
 * Pure function: Calculates attendance metrics given shift parameters, date, and punch times.
 * Handles normal shifts, overnight shifts, grace periods, half days, and overtime.
 */
export function calculateAttendanceMetrics(
  shift: Shift,
  dateStr: string, // 'YYYY-MM-DD'
  firstInIso?: string,
  lastOutIso?: string
): PunchCalculationResult {
  if (!firstInIso) {
    return {
      status: 'absent',
      lateMinutes: 0,
      earlyDepartureMinutes: 0,
      workedMinutes: 0,
      overtimeMinutes: 0,
    };
  }

  const inDate = new Date(firstInIso);
  // Scheduled start datetime
  const scheduledStart = new Date(`${dateStr}T${shift.startTime}:00`);
  // Grace threshold
  const graceThreshold = new Date(scheduledStart.getTime() + shift.gracePeriodMinutes * 60 * 1000);

  // Scheduled end datetime
  let scheduledEnd = new Date(`${dateStr}T${shift.endTime}:00`);
  if (shift.isOvernight) {
    // Add 1 day if overnight cross-midnight shift
    scheduledEnd = new Date(scheduledEnd.getTime() + 24 * 60 * 60 * 1000);
  }

  // Late minutes calculation
  let lateMinutes = 0;
  if (inDate > graceThreshold) {
    lateMinutes = Math.floor((inDate.getTime() - scheduledStart.getTime()) / (60 * 1000));
  }

  // Early departure & worked minutes calculation
  let earlyDepartureMinutes = 0;
  let workedMinutes = 0;
  let overtimeMinutes = 0;

  if (lastOutIso) {
    const outDate = new Date(lastOutIso);
    workedMinutes = Math.max(0, Math.floor((outDate.getTime() - inDate.getTime()) / (60 * 1000)));

    if (outDate < scheduledEnd) {
      earlyDepartureMinutes = Math.floor((scheduledEnd.getTime() - outDate.getTime()) / (60 * 1000));
    } else {
      overtimeMinutes = Math.floor((outDate.getTime() - scheduledEnd.getTime()) / (60 * 1000));
    }
  }

  // Status evaluation based on worked thresholds
  let status: AttendanceStatus = 'present';
  if (workedMinutes < shift.halfDayThresholdMinutes) {
    status = lateMinutes > 0 ? 'absent' : 'half_day';
  } else if (workedMinutes < shift.fullDayThresholdMinutes) {
    status = 'half_day';
  } else if (lateMinutes > 0) {
    status = 'late';
  }

  return {
    status,
    lateMinutes,
    earlyDepartureMinutes,
    workedMinutes,
    overtimeMinutes,
  };
}
