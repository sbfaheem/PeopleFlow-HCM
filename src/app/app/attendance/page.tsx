'use client';

import { useState } from 'react';
import { CalendarCheck, Clock, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function AttendancePage() {
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);

  const records = [
    {
      id: 'att-01',
      date: '2026-04-12',
      employee: 'Zainab Ahmed',
      empId: 'EMP-2026-0001',
      shift: 'Morning Shift (09:00 - 18:00)',
      inTime: '08:58 AM',
      outTime: '06:05 PM',
      status: 'present',
      late: '0m',
      overtime: '5m',
    },
    {
      id: 'att-02',
      date: '2026-04-12',
      employee: 'Bilal Faheem',
      empId: 'EMP-2026-0002',
      shift: 'Morning Shift (09:00 - 18:00)',
      inTime: '09:24 AM',
      outTime: '06:00 PM',
      status: 'late',
      late: '24m',
      overtime: '0m',
    },
    {
      id: 'att-03',
      date: '2026-04-11',
      employee: 'Zainab Ahmed',
      empId: 'EMP-2026-0001',
      shift: 'Morning Shift (09:00 - 18:00)',
      inTime: '09:05 AM',
      outTime: '06:15 PM',
      status: 'present',
      late: '0m',
      overtime: '15m',
    },
  ];

  const handlePunch = () => {
    if (!clockedIn) {
      setClockedIn(true);
      setClockInTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } else {
      setClockedIn(false);
      setClockInTime(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-blue-600" /> Attendance & Shifts
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track daily work hours, overnight shifts, punctuality, and attendance metrics with automated grace calculations.
          </p>
        </div>

        {/* Web Punch Widget */}
        <div className="flex items-center gap-3 bg-white border border-slate-200 p-2.5 rounded-xl shadow-sm">
          <div className="text-right text-xs pr-2 border-r border-slate-100">
            <p className="font-semibold text-slate-800">
              {clockedIn ? `In: ${clockInTime}` : 'Not Clocked In'}
            </p>
            <p className="text-slate-400">Shift: 09:00 - 18:00</p>
          </div>
          <button
            onClick={handlePunch}
            className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-all ${
              clockedIn
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            {clockedIn ? 'Clock Out' : 'Clock In'}
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-medium text-slate-500">Present Today</p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900">94.2%</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +1.4%
            </span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-medium text-slate-500">Late Arrivals</p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-600">3</span>
            <span className="text-xs font-semibold text-amber-600 flex items-center">
              <ArrowDownRight className="w-3.5 h-3.5" /> Past Grace
            </span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-medium text-slate-500">On Leave</p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-blue-600">2</span>
            <span className="text-xs text-slate-400">Approved</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-1">
          <p className="text-xs font-medium text-slate-500">Overtime Logged</p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-indigo-600">14.5 hrs</span>
            <span className="text-xs text-slate-400">This Month</span>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800 text-sm">Attendance Logs (Today)</h2>
          <span className="text-xs text-slate-400">Timezone: Asia/Karachi (PKT)</span>
        </div>

        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-3.5">Employee</th>
              <th className="px-6 py-3.5">Shift</th>
              <th className="px-6 py-3.5">Clock In</th>
              <th className="px-6 py-3.5">Clock Out</th>
              <th className="px-6 py-3.5">Punctuality</th>
              <th className="px-6 py-3.5">Overtime</th>
              <th className="px-6 py-3.5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {records.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-900">{r.employee}</p>
                  <p className="text-xs text-slate-400 font-mono">{r.empId}</p>
                </td>
                <td className="px-6 py-4 text-xs text-slate-600">{r.shift}</td>
                <td className="px-6 py-4 font-mono text-xs font-medium text-slate-800">{r.inTime}</td>
                <td className="px-6 py-4 font-mono text-xs font-medium text-slate-800">{r.outTime}</td>
                <td className="px-6 py-4 text-xs">
                  {r.late === '0m' ? (
                    <span className="text-emerald-600 font-medium">On-time</span>
                  ) : (
                    <span className="text-amber-600 font-medium">+{r.late} late</span>
                  )}
                </td>
                <td className="px-6 py-4 text-xs font-mono text-slate-600">{r.overtime}</td>
                <td className="px-6 py-4">
                  {r.status === 'present' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Present
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      <AlertCircle className="w-3 h-3" /> Late
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
