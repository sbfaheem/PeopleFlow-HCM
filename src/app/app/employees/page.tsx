'use client';

import { useEffect, useState, useCallback } from 'react';
import { Users, Plus, Search, Building2, MapPin, Mail, CheckCircle2 } from 'lucide-react';
import { Employee, Department, Branch, Designation } from '@/lib/db/types';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    workEmail: '',
    cnic: '',
    gender: 'male',
    departmentId: '',
    designationId: '',
    branchId: '',
    legalEntityId: 'le-01',
    employmentType: 'permanent',
    employmentStatus: 'active',
    joiningDate: new Date().toISOString().split('T')[0],
  });

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedDept) params.append('departmentId', selectedDept);

      const res = await fetch(`/api/employees?${params.toString()}`);
      const json = await res.json();
      if (json.data) {
        setEmployees(json.data);
        if (json.lookups) {
          setDepartments(json.lookups.departments);
          setBranches(json.lookups.branches);
          setDesignations(json.lookups.designations);
          // Set defaults for form if empty
          if (!formData.departmentId && json.lookups.departments.length) {
            setFormData((prev) => ({
              ...prev,
              departmentId: json.lookups.departments[0].id,
              branchId: json.lookups.branches[0]?.id || '',
              designationId: json.lookups.designations[0]?.id || '',
            }));
          }
        }
      }
    } catch (err) {
      console.error('Failed to load employees:', err);
    } finally {
      setLoading(false);
    }
  }, [search, selectedDept, formData.departmentId]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({
          firstName: '',
          lastName: '',
          workEmail: '',
          cnic: '',
          gender: 'male',
          departmentId: departments[0]?.id || '',
          designationId: designations[0]?.id || '',
          branchId: branches[0]?.id || '',
          legalEntityId: 'le-01',
          employmentType: 'permanent',
          employmentStatus: 'active',
          joiningDate: new Date().toISOString().split('T')[0],
        });
        fetchEmployees();
      }
    } catch (err) {
      console.error('Failed to create employee:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" /> Employee Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your company workforce, departments, and employee records with multi-tenant isolation.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, employee ID, or email..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">Loading employees...</div>
        ) : employees.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-slate-700 font-medium text-sm">No employees found</p>
            <p className="text-slate-400 text-xs">Try adjusting your search filters or add a new employee.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Employee</th>
                <th className="px-6 py-3.5">Employee ID</th>
                <th className="px-6 py-3.5">Department & Title</th>
                <th className="px-6 py-3.5">Branch</th>
                <th className="px-6 py-3.5">CNIC (Masked)</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {employees.map((emp) => {
                const dept = departments.find((d) => d.id === emp.departmentId)?.name || 'General';
                const des = designations.find((d) => d.id === emp.designationId)?.title || 'Staff';
                const branch = branches.find((b) => b.id === emp.branchId)?.city || 'Head Office';
                const maskedCnic = emp.cnic ? `${emp.cnic.slice(0, 5)}-*******-${emp.cnic.slice(-1)}` : 'N/A';

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                          {emp.firstName[0]}
                          {emp.lastName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {emp.workEmail}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-700 font-medium">
                      {emp.employeeNumber}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" /> {dept}
                      </p>
                      <p className="text-xs text-slate-500">{des}</p>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <span className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {branch}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{maskedCnic}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-xl w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" /> Add New Employee
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">First Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Last Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Work Email *</label>
                  <input
                    required
                    type="email"
                    value={formData.workEmail}
                    onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">CNIC (Pakistan) *</label>
                  <input
                    required
                    type="text"
                    placeholder="42101-1234567-1"
                    value={formData.cnic}
                    onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Department</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Designation</label>
                  <select
                    value={formData.designationId}
                    onChange={(e) => setFormData({ ...formData, designationId: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                  >
                    {designations.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Branch</label>
                  <select
                    value={formData.branchId}
                    onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
