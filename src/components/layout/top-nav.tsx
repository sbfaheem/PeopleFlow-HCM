import { Bell, Search, User } from 'lucide-react';

export function TopNav() {
  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
      <div className="flex items-center gap-3 w-96">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search employees, departments, or requests..."
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative">
          <Bell className="w-5 h-5" />
          <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-2 right-2" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left text-xs">
            <p className="font-semibold text-slate-800">HR Administrator</p>
            <p className="text-slate-500">hr.admin@acmepk.com</p>
          </div>
        </div>
      </div>
    </header>
  );
}
