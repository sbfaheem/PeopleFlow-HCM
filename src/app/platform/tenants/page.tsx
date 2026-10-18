'use client';

import { useState } from 'react';
import { Plus, CheckCircle2, Building } from 'lucide-react';

export default function PlatformTenantsPage() {
  const [tenants, setTenants] = useState([
    {
      id: 't-acme-pk-01',
      name: 'Acme Technologies Pakistan',
      slug: 'acme-pk',
      plan: 'Enterprise',
      employees: 2,
      maxEmployees: 100,
      status: 'active',
      modules: ['Core HR', 'Attendance', 'Leave', 'Payroll (PKR)', 'Analytics'],
      createdAt: '2026-01-15',
    },
    {
      id: 't-crescent-02',
      name: 'Crescent Textile Mills',
      slug: 'crescent-textiles',
      plan: 'Professional',
      employees: 48,
      maxEmployees: 50,
      status: 'active',
      modules: ['Core HR', 'Attendance', 'Leave'],
      createdAt: '2026-02-10',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTenant, setNewTenant] = useState({ name: '', slug: '', plan: 'Professional' });

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenant.name || !newTenant.slug) return;

    setTenants([
      ...tenants,
      {
        id: `t-${Date.now()}`,
        name: newTenant.name,
        slug: newTenant.slug,
        plan: newTenant.plan,
        employees: 0,
        maxEmployees: 50,
        status: 'active',
        modules: ['Core HR', 'Attendance', 'Leave', 'Payroll (PKR)'],
        createdAt: new Date().toISOString().split('T')[0],
      },
    ]);
    setIsModalOpen(false);
    setNewTenant({ name: '', slug: '', plan: 'Professional' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Platform Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
            PF
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-white">PeopleFlow Platform Super Admin</span>
            <span className="text-xs text-slate-400 block">SaaS Multi-Tenant Management Hub</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> System Healthy
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="p-8 max-w-7xl mx-auto w-full space-y-8 flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Building className="w-6 h-6 text-blue-500" /> Tenant Management
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Provision customer organizations, manage plan tiers, and inspect module entitlement quotas.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Provision New Tenant
          </button>
        </div>

        {/* Tenant Table */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="font-semibold text-slate-200 text-sm">Active Customer Tenants</h2>
            <span className="text-xs text-slate-500">Row Level Security (RLS) Enforced</span>
          </div>

          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-950 text-slate-300 text-xs uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="px-6 py-3.5">Tenant Organization</th>
                <th className="px-6 py-3.5">Slug</th>
                <th className="px-6 py-3.5">Plan</th>
                <th className="px-6 py-3.5">Seat Usage</th>
                <th className="px-6 py-3.5">Active Modules</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {tenants.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-slate-500 font-mono">{t.id}</p>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-300">{t.slug}</td>
                  <td className="px-6 py-4 text-xs">
                    <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 font-medium">
                      {t.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-300">
                    {t.employees} / {t.maxEmployees} seats
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <div className="flex flex-wrap gap-1">
                      {t.modules.map((m) => (
                        <span key={m} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                          {m}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950 text-emerald-400 border border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Provisioning Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Provision New Tenant</h3>
            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Company Name</label>
                <input
                  required
                  type="text"
                  value={newTenant.name}
                  onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
                  placeholder="e.g. Sapphire Retail"
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Tenant Slug</label>
                <input
                  required
                  type="text"
                  value={newTenant.slug}
                  onChange={(e) => setNewTenant({ ...newTenant, slug: e.target.value })}
                  placeholder="sapphire-retail"
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subscription Plan</label>
                <select
                  value={newTenant.plan}
                  onChange={(e) => setNewTenant({ ...newTenant, plan: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-white"
                >
                  <option value="Starter">Starter (Up to 15 seats)</option>
                  <option value="Professional">Professional (Up to 50 seats)</option>
                  <option value="Enterprise">Enterprise (Unlimited)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold"
                >
                  Provision Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
