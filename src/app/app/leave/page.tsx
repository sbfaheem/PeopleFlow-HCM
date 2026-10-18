'use client';

import { useState } from 'react';
import { UserCheck, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

export default function LeavePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const balances = [
    { type: 'Annual Leave', code: 'ANNUAL', total: 14, used: 4, pending: 1, available: 9, color: 'bg-blue-600' },
    { type: 'Casual Leave', code: 'CASUAL', total: 10, used: 2, pending: 0, available: 8, color: 'bg-emerald-600' },
    { type: 'Sick Leave', code: 'SICK', total: 8, used: 1, pending: 0, available: 7, color: 'bg-amber-600' },
    { type: 'Unpaid Leave (LWP)', code: 'UNPAID', total: 0, used: 0, pending: 0, available: 0, color: 'bg-slate-500' },
  ];

  const requests = [
    {
      id: 'lr-01',
      employee: 'Bilal Faheem',
      empId: 'EMP-2026-0002',
      type: 'Annual Leave',
      startDate: '2026-05-02',
      endDate: '2026-05-04',
      days: 3,
      reason: 'Family wedding event in Lahore',
      status: 'pending',
      appliedAt: '2026-04-10',
    },
    {
      id: 'lr-02',
      employee: 'Zainab Ahmed',
      empId: 'EMP-2026-0001',
      type: 'Casual Leave',
      startDate: '2026-04-05',
      endDate: '2026-04-05',
      days: 1,
      reason: 'Personal urgent errand',
      status: 'approved',
      appliedAt: '2026-04-03',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-blue-600" /> Leave Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure leave policies, review employee applications, manage approvals, and automate payroll handoffs.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Apply for Leave
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-4 gap-5">
        {balances.map((b) => (
          <div key={b.code} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 text-sm">{b.type}</span>
              <span className={`w-2.5 h-2.5 rounded-full ${b.color}`} />
            </div>
            <div>
              <span className="text-3xl font-extrabold text-slate-900">{b.available}</span>
              <span className="text-xs text-slate-400 ml-1.5">days left</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Total: {b.total}d</span>
              <span>Used: {b.used}d</span>
              <span>Pending: {b.pending}d</span>
            </div>
          </div>
        ))}
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800 text-sm">Recent Leave Applications</h2>
          <span className="text-xs text-slate-400">Multi-tier manager approvals</span>
        </div>

        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
            <tr>
              <th className="px-6 py-3.5">Employee</th>
              <th className="px-6 py-3.5">Leave Type</th>
              <th className="px-6 py-3.5">Dates</th>
              <th className="px-6 py-3.5">Duration</th>
              <th className="px-6 py-3.5">Reason</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-slate-900">{r.employee}</p>
                  <p className="text-xs text-slate-400 font-mono">{r.empId}</p>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-slate-800">{r.type}</td>
                <td className="px-6 py-4 text-xs font-mono text-slate-600">
                  {r.startDate} <span className="text-slate-400">→</span> {r.endDate}
                </td>
                <td className="px-6 py-4 text-xs font-medium text-slate-800">{r.days} days</td>
                <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate">{r.reason}</td>
                <td className="px-6 py-4">
                  {r.status === 'approved' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      <AlertCircle className="w-3 h-3" /> Pending Review
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {r.status === 'pending' ? (
                    <div className="flex items-center justify-end gap-2">
                      <button className="px-2.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium shadow-xs">
                        Approve
                      </button>
                      <button className="px-2.5 py-1 text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded font-medium">
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Apply for Leave</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Leave Type</label>
                <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white">
                  <option>Annual Leave (9 days remaining)</option>
                  <option>Casual Leave (8 days remaining)</option>
                  <option>Sick Leave (7 days remaining)</option>
                  <option>Unpaid Leave (LWP)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Start Date</label>
                  <input type="date" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">End Date</label>
                  <input type="date" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Reason</label>
                <textarea rows={3} placeholder="Please provide details for the approval manager..." className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
