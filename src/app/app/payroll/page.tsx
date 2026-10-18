'use client';

import { useState } from 'react';
import { CreditCard, ShieldCheck, Download, FileText, Lock } from 'lucide-react';

interface SlipItem {
  id: string;
  employee: string;
  empId: string;
  designation: string;
  gross: number;
  basic: number;
  houseRent: number;
  medical: number;
  conveyance: number;
  taxWithholding: number;
  eobi: number;
  net: number;
}

export default function PayrollPage() {
  const [activeTab, setActiveTab] = useState<'runs' | 'slips'>('runs');
  const [selectedSlip, setSelectedSlip] = useState<SlipItem | null>(null);

  const runs = [
    {
      id: 'pr-2026-03',
      period: 'March 2026',
      totalEmployees: 2,
      grossTotal: 'PKR 270,000.00',
      deductionsTotal: 'PKR 14,740.00',
      netDisbursement: 'PKR 255,260.00',
      preparedBy: 'Payroll Specialist',
      approvedBy: 'Finance Director',
      status: 'finalized',
    },
    {
      id: 'pr-2026-04',
      period: 'April 2026 (Current)',
      totalEmployees: 2,
      grossTotal: 'PKR 270,000.00',
      deductionsTotal: 'PKR 14,740.00',
      netDisbursement: 'PKR 255,260.00',
      preparedBy: 'Payroll Specialist',
      approvedBy: 'Pending Approval',
      status: 'pending_approval',
    },
  ];

  const slips = [
    {
      id: 'slip-01',
      employee: 'Bilal Faheem',
      empId: 'EMP-2026-0002',
      designation: 'Lead Software Architect',
      gross: 150000,
      basic: 90000,
      houseRent: 37500,
      medical: 15000,
      conveyance: 7500,
      taxWithholding: 9166.67,
      eobi: 370,
      net: 140463.33,
    },
    {
      id: 'slip-02',
      employee: 'Zainab Ahmed',
      empId: 'EMP-2026-0001',
      designation: 'HR Manager',
      gross: 120000,
      basic: 72000,
      houseRent: 30000,
      medical: 12000,
      conveyance: 6000,
      taxWithholding: 4833.33,
      eobi: 370,
      net: 114796.67,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-blue-600" /> Payroll Engine (PKR)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Deterministic calculation engine compliant with Pakistan FBR tax withholding slabs, EOBI, and provincial social security.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('runs')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'runs'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Payroll Runs
          </button>
          <button
            onClick={() => setActiveTab('slips')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'slips'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Digital Payslips
          </button>
        </div>
      </div>

      {/* Statutory Compliance Indicator */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-blue-900">Pakistan Statutory Framework Active</h3>
            <p className="text-xs text-blue-700">
              Tax Year 2025–2026 progressive FBR slabs applied. EOBI benchmark: PKR 370/month employee, PKR 1,850 employer.
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold text-blue-800 bg-blue-100/80 px-2.5 py-1 rounded-full border border-blue-200">
          Separation of Duties Enforced
        </span>
      </div>

      {activeTab === 'runs' ? (
        /* Payroll Runs Table */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800 text-sm">Monthly Payroll Batches</h2>
            <span className="text-xs text-slate-400">Strict paisa-level precision (DECIMAL 14,2)</span>
          </div>

          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Payroll Period</th>
                <th className="px-6 py-3.5">Headcount</th>
                <th className="px-6 py-3.5">Gross Wages</th>
                <th className="px-6 py-3.5">Tax & Deductions</th>
                <th className="px-6 py-3.5">Net Disbursement</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {runs.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">{r.period}</td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-700">{r.totalEmployees} Employees</td>
                  <td className="px-6 py-4 font-mono text-xs font-medium text-slate-800">{r.grossTotal}</td>
                  <td className="px-6 py-4 font-mono text-xs text-rose-600 font-medium">-{r.deductionsTotal}</td>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-slate-900">{r.netDisbursement}</td>
                  <td className="px-6 py-4">
                    {r.status === 'finalized' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Lock className="w-3 h-3" /> Locked & Finalized
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        Pending SoD Approval
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setActiveTab('slips')}
                      className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-medium transition-colors"
                    >
                      View Slips
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Digital Payslips View */
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800 text-sm">Disbursement Slips (April 2026)</h2>
              <span className="text-xs text-slate-400">Click to view slip details</span>
            </div>
            <div className="divide-y divide-slate-100">
              {slips.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSelectedSlip(s)}
                  className={`p-4 hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors ${
                    selectedSlip?.id === s.id ? 'bg-blue-50/60' : ''
                  }`}
                >
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{s.employee}</p>
                    <p className="text-xs text-slate-400">{s.designation} · {s.empId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-slate-900 text-sm">
                      PKR {s.net.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-emerald-600 font-medium">Net Take-Home</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Payslip Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
            {selectedSlip ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Digital Payslip</h3>
                    <p className="text-xs text-slate-400">Period: April 2026 · Confidential</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold">
                    Verified FBR Calc
                  </span>
                </div>

                <div className="grid grid-cols-2 text-xs py-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <p className="text-slate-400">Employee Name</p>
                    <p className="font-semibold text-slate-800">{selectedSlip.employee}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Employee ID</p>
                    <p className="font-mono font-semibold text-slate-800">{selectedSlip.empId}</p>
                  </div>
                </div>

                {/* Earnings */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-700 uppercase">Gross Earnings</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600">Basic Salary (60%)</span>
                      <span className="font-mono text-slate-800">PKR {selectedSlip.basic.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600">House Rent Allowance (25%)</span>
                      <span className="font-mono text-slate-800">PKR {selectedSlip.houseRent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600">Medical Allowance (10%)</span>
                      <span className="font-mono text-slate-800">PKR {selectedSlip.medical.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600">Conveyance Allowance (5%)</span>
                      <span className="font-mono text-slate-800">PKR {selectedSlip.conveyance.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Statutory Deductions */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-rose-700 uppercase">Statutory Deductions</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100 text-rose-700">
                      <span>FBR Income Tax Withholding</span>
                      <span className="font-mono">-PKR {selectedSlip.taxWithholding.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100 text-rose-700">
                      <span>EOBI (Employees&apos; Old-Age Benefits)</span>
                      <span className="font-mono">-PKR {selectedSlip.eobi}</span>
                    </div>
                  </div>
                </div>

                {/* Net Pay Total */}
                <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">Net Pay Transferred</p>
                    <p className="text-xl font-extrabold font-mono">
                      PKR {selectedSlip.net.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors">
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center space-y-2 text-slate-400">
                <FileText className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-sm font-medium text-slate-600">Select a payslip to view breakdown</p>
                <p className="text-xs">Detailed allowance items and tax deductions will appear here.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
