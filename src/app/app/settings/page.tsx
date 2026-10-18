'use client';

import { useState } from 'react';
import { Settings, Save, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'statutory' | 'security'>('general');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" /> Company Settings & Compliance
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure tenant regional localization, Pakistan statutory rates, security rules, and audit retention.
          </p>
        </div>

        {saved && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" /> Settings Saved
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'general' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          General & Localization
        </button>
        <button
          onClick={() => setActiveTab('statutory')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'statutory' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Pakistan Statutory Framework
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'security' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Security & Access Control
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {activeTab === 'general' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Tenant Regional Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  defaultValue="Acme Technologies Pakistan"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tenant Identifier (Slug)</label>
                <input
                  type="text"
                  defaultValue="acme-pk"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 font-mono"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Primary Timezone</label>
                <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white">
                  <option>Asia/Karachi (PKT - UTC+05:00)</option>
                  <option>Asia/Dubai (GST - UTC+04:00)</option>
                  <option>Europe/London (GMT/BST)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Default Currency</label>
                <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white">
                  <option>PKR (Pakistani Rupee)</option>
                  <option>USD (US Dollar)</option>
                  <option>AED (UAE Dirham)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'statutory' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Pakistan Labor & Tax Policy Rules</h2>
                <p className="text-xs text-slate-500">Configured according to current FBR and EOBI federal statutes.</p>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                Tax Year 2025–26
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-900">FBR Progressive Salary Withholding</p>
                  <p className="text-slate-500">Apply standard progressive tax brackets on all salaried compensation.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-900">EOBI Statutory Pension Deductions</p>
                  <p className="text-slate-500">PKR 370/month employee, PKR 1,850/month employer matching.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-900">Medical Allowance Tax Exemption</p>
                  <p className="text-slate-500">Exempt up to 10% of basic pay under Section 12.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Access Control & Governance</h2>
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-900">Enforce Separation of Duties (SoD)</p>
                  <p className="text-slate-500">Prevent payroll preparers from approving or finalizing the same run.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div>
                  <p className="font-semibold text-slate-900">Mask National ID (CNIC) Numbers</p>
                  <p className="text-slate-500">Hide CNIC digits in general list views (e.g. 42201-*******-2).</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-2xs transition-colors"
          >
            <Save className="w-4 h-4" /> Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
