import Link from 'next/link';
import {
  Users,
  CreditCard,
  UserCheck,
  CalendarCheck,
  Building2,
  ArrowUpRight,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-8 rounded-2xl shadow-sm border border-slate-800 flex items-center justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/20">
            <ShieldCheck className="w-3.5 h-3.5" /> Multi-Tenant Active · Acme Tech (PK)
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Executive Workforce Dashboard</h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Real-time insights across headcount, attendance punctuality, leave liabilities, and Pakistan statutory payroll.
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/app/employees"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center gap-2"
          >
            Manage Directory <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase">Total Headcount</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">2</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +100% YoY
            </span>
          </div>
          <p className="text-xs text-slate-400">100% active status · 0 probation</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase">Monthly Payroll (PKR)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">270,000</span>
            <span className="text-xs font-semibold text-slate-500">PKR Gross</span>
          </div>
          <p className="text-xs text-slate-400">PKR 255,260 net disbursed</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase">Today&apos;s Attendance</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">100%</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> Full Turnout
            </span>
          </div>
          <p className="text-xs text-slate-400">1 on-time · 1 late arrival</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase">Active Leaves</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">1</span>
            <span className="text-xs font-semibold text-amber-600">Pending Review</span>
          </div>
          <p className="text-xs text-slate-400">1 approved earlier this month</p>
        </div>
      </div>

      {/* Department Breakdown & Quick Compliance Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" /> Departmental Distribution
            </h2>
            <span className="text-xs text-slate-400">2 Operating Branches</span>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                <span>Engineering & Technology</span>
                <span className="font-mono">1 Employee (50%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full w-1/2" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                <span>People & Culture (HR)</span>
                <span className="font-mono">1 Employee (50%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full w-1/2" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                <span>Finance & Accounts</span>
                <span className="font-mono text-slate-400">0 Employees (0%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-300 rounded-full w-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Pakistan Compliance Summary */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Compliance Status
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
              <p className="font-semibold text-slate-800">FBR Withholding (Salaried)</p>
              <p className="text-slate-500">Tax Year 2025–26 progressive rates verified</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
              <p className="font-semibold text-slate-800">EOBI Statutory Pension</p>
              <p className="text-slate-500">PKR 370 employee / PKR 1,850 employer</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
              <p className="font-semibold text-slate-800">PESSI / SESSI Social Security</p>
              <p className="text-slate-500">Capped at PKR 1,500/month per covered worker</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
