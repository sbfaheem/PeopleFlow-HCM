import Link from 'next/link';
import {
  Users,
  Building2,
  CalendarCheck,
  CreditCard,
  Briefcase,
  Settings,
  ShieldCheck,
  BarChart3,
  UserCheck,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/app/dashboard', icon: BarChart3 },
  { name: 'Employees', href: '/app/employees', icon: Users, current: true },
  { name: 'Organization', href: '/app/organization', icon: Building2 },
  { name: 'Attendance', href: '/app/attendance', icon: CalendarCheck },
  { name: 'Leave', href: '/app/leave', icon: UserCheck },
  { name: 'Payroll (PKR)', href: '/app/payroll', icon: CreditCard },
  { name: 'Recruitment', href: '/app/recruitment', icon: Briefcase },
  { name: 'Settings', href: '/app/settings', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen text-slate-200">
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
          PF
        </div>
        <div>
          <span className="font-semibold tracking-tight text-white block text-sm">PeopleFlow HCM</span>
          <span className="text-xs text-blue-400 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Acme Tech (PK)
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              item.current
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
        <p className="font-medium text-slate-400">PeopleFlow v1.0.0</p>
        <p>Enterprise Edition (PK)</p>
      </div>
    </aside>
  );
}
