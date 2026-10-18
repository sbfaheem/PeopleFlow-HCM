'use client';

import { useState } from 'react';
import { Building2, MapPin, Plus, CheckCircle2 } from 'lucide-react';

export default function OrganizationPage() {
  const [activeTab, setActiveTab] = useState<'entities' | 'branches' | 'departments' | 'designations'>('departments');

  const legalEntities = [
    {
      id: 'le-01',
      name: 'Acme Tech (Pvt) Limited',
      registrationNumber: 'CUIN-0192837',
      ntn: '7482910-4',
      country: 'Pakistan',
      currency: 'PKR',
      branchesCount: 2,
    },
  ];

  const branches = [
    {
      id: 'br-01',
      name: 'Karachi Head Office (Clifton)',
      city: 'Karachi',
      address: 'Suite 401, Executive Tower, Clifton Block 5',
      timezone: 'Asia/Karachi',
      employeesCount: 2,
    },
    {
      id: 'br-02',
      name: 'Lahore Tech Center (Gulberg)',
      city: 'Lahore',
      address: 'Plaza 14, Main Boulevard, Gulberg III',
      timezone: 'Asia/Karachi',
      employeesCount: 0,
    },
  ];

  const departments = [
    { id: 'dept-01', name: 'Engineering & Technology', head: 'Bilal Faheem', employeesCount: 1 },
    { id: 'dept-02', name: 'People & Culture (HR)', head: 'Zainab Ahmed', employeesCount: 1 },
    { id: 'dept-03', name: 'Finance & Accounts', head: 'Unassigned', employeesCount: 0 },
  ];

  const designations = [
    { id: 'des-01', title: 'Lead Software Architect', level: 5, dept: 'Engineering & Technology' },
    { id: 'des-02', title: 'Senior Full Stack Engineer', level: 3, dept: 'Engineering & Technology' },
    { id: 'des-03', title: 'HR Manager', level: 4, dept: 'People & Culture (HR)' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" /> Organization Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure legal entities, operating branches, departmental hierarchy, and job designations.
          </p>
        </div>

        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-2xs transition-colors">
          <Plus className="w-4 h-4" /> Add Unit
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('departments')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'departments'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Departments ({departments.length})
        </button>
        <button
          onClick={() => setActiveTab('branches')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'branches'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Branches ({branches.length})
        </button>
        <button
          onClick={() => setActiveTab('entities')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'entities'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Legal Entities ({legalEntities.length})
        </button>
        <button
          onClick={() => setActiveTab('designations')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'designations'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Designations ({designations.length})
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'departments' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800 text-sm">Company Departments</h2>
            <span className="text-xs text-slate-400">Total: {departments.length}</span>
          </div>
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Department Name</th>
                <th className="px-6 py-3.5">Department Lead</th>
                <th className="px-6 py-3.5">Staff Count</th>
                <th className="px-6 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {departments.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">{d.name}</td>
                  <td className="px-6 py-4 text-xs text-slate-600">{d.head}</td>
                  <td className="px-6 py-4 text-xs font-mono font-medium text-slate-800">{d.employeesCount} Employees</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'branches' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {branches.map((b) => (
            <div key={b.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" /> {b.name}
                </h3>
                <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700 font-medium">
                  {b.city}
                </span>
              </div>
              <p className="text-xs text-slate-500">{b.address}</p>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Timezone: {b.timezone}</span>
                <span className="font-semibold text-slate-900 font-mono">{b.employeesCount} Employees Assigned</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'entities' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
          {legalEntities.map((le) => (
            <div key={le.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base">{le.name}</h3>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-semibold">
                  Primary Legal Entity
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs pt-2">
                <div>
                  <span className="text-slate-400 block">Registration CUIN</span>
                  <span className="font-mono font-semibold text-slate-800">{le.registrationNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">National Tax Number (NTN)</span>
                  <span className="font-mono font-semibold text-slate-800">{le.ntn}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Jurisdiction</span>
                  <span className="font-semibold text-slate-800">{le.country}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Base Operating Currency</span>
                  <span className="font-semibold text-slate-800">{le.currency} (PKR)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'designations' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Job Designation</th>
                <th className="px-6 py-3.5">Department</th>
                <th className="px-6 py-3.5">Grade Level</th>
                <th className="px-6 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {designations.map((des) => (
                <tr key={des.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">{des.title}</td>
                  <td className="px-6 py-4 text-xs text-slate-600">{des.dept}</td>
                  <td className="px-6 py-4 text-xs font-mono font-semibold text-blue-600">Level {des.level}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
