import Link from 'next/link';
import {
  Users,
  ShieldCheck,
  CreditCard,
  ArrowRight,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              PF
            </div>
            <span className="text-lg font-bold tracking-tight text-white">PeopleFlow HCM</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">
              Modules
            </a>
            <a href="#pakistan-compliance" className="hover:text-white transition-colors">
              Pakistan Compliance
            </a>
            <a href="#security" className="hover:text-white transition-colors">
              Security & Isolation
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/app/employees"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium shadow-md transition-all flex items-center gap-2"
            >
              Open Application <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/60 text-blue-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Built for Pakistan Enterprises & Expanding Globally
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            One platform. Every employee. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400">
              Smarter decisions.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A multi-tenant Human Capital Management SaaS engineered for strict tenant isolation, 
            deterministic payroll calculation, Pakistan statutory compliance (FBR, EOBI, SESSI/PESSI), 
            and complete workforce lifecycle governance.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/app/employees"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-base font-semibold shadow-xl shadow-blue-600/25 transition-all flex items-center gap-2"
            >
              Launch Employee Directory <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-base font-semibold border border-slate-800 transition-all"
            >
              Explore Architecture
            </a>
          </div>
        </section>

        {/* Key Pillars */}
        <section id="features" className="py-20 bg-slate-900/50 border-y border-slate-800/60 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                Engineered for Enterprise Depth & Compliance
              </h2>
              <p className="text-slate-400 text-sm md:text-base">
                Architected from the ground up to prevent multi-tenant data leakage and ensure separation of duties.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Multi-Tenant Core HR</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Tenant-scoped unique employee numbers (`EMP-YYYY-XXXX`), organizational hierarchy (legal entities, branches, departments, designations), and masked CNICs.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-sky-600/10 text-sky-400 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Deterministic Payroll Engine</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Zero floating-point arithmetic with strict paisa-level precision. Full FBR progressive tax brackets, mandatory EOBI pension, and provincial social security calculations.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Separation of Duties (SoD)</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Server-enforced role gates. The payroll preparer cannot approve their own run, managers cannot approve their own leaves, and PII is masked by default.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 px-6 text-center text-xs text-slate-500">
        <p>© 2026 PeopleFlow HCM. Built for high-trust enterprise human resource management.</p>
      </footer>
    </div>
  );
}
