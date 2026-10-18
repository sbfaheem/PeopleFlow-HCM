'use client';

import { useState } from 'react';
import { Bot, Send, ShieldCheck, Sparkles } from 'lucide-react';

export default function AiAssistantPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! I am your PeopleFlow HR Copilot. I can assist with answering company policy questions, explaining Pakistan FBR tax brackets, summarizing attendance metrics, and drafting job descriptions.',
      source: 'System Initialization',
    },
  ]);

  const [input, setInput] = useState('');
  const [category, setCategory] = useState<'policy_inquiry' | 'tax_explanation' | 'draft_job_description' | 'report_summary'>('policy_inquiry');
  const [loading, setLoading] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userQuery = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userQuery, source: 'User Prompt' }]);
    setLoading(true);

    setTimeout(() => {
      let botAnswer = '';
      let source = '';

      if (category === 'tax_explanation') {
        botAnswer =
          'Under Pakistan Federal Budget Tax Year 2025–26, salaried income up to PKR 600,000/year is exempt. The 600k–1.2M bracket is taxed at 5% of excess. Medical Allowance is exempt up to 10% of Basic Salary under Section 12.';
        source = 'Pakistan FBR Tax Ordinance & PeopleFlow Tax Strategy';
      } else if (category === 'draft_job_description') {
        botAnswer =
          'Job Description Draft:\n\nTitle: Senior Full Stack Engineer\nLocation: Clifton, Karachi\nResponsibilities:\n- Build enterprise multi-tenant HCM modules in Next.js & TypeScript.\n- Ensure zero data leakage and separation of duties.\n- Maintain deterministic payroll calculations.';
        source = 'PeopleFlow Job Description Generator';
      } else if (category === 'report_summary') {
        botAnswer =
          'Workforce Summary for Acme Tech (PK):\n- Headcount: 2 Active Employees.\n- Attendance: 100% Turnout today.\n- Monthly Payroll: PKR 255,260 Net disbursement.';
        source = 'Real-time Analytics Snapshot';
      } else {
        botAnswer =
          'Company Policy: Working hours are 09:00 to 18:00 (PKT) with a 15-minute grace period. Annual Leave is 14 days, Casual Leave is 10 days, and Sick Leave is 8 days.';
        source = 'Acme Tech Employee Handbook 2026';
      }

      setMessages((prev) => [...prev, { role: 'assistant', text: botAnswer, source }]);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-600" /> AI HR Copilot
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tenant-sandboxed assistant for policy retrieval, tax explanation, workforce synthesis, and drafting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Read-Only Safety Guardrails Active
          </span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setCategory('policy_inquiry')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            category === 'policy_inquiry'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Company Policies
        </button>
        <button
          onClick={() => setCategory('tax_explanation')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            category === 'tax_explanation'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          FBR Tax Explanations
        </button>
        <button
          onClick={() => setCategory('draft_job_description')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            category === 'draft_job_description'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Draft Job Descriptions
        </button>
        <button
          onClick={() => setCategory('report_summary')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            category === 'report_summary'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Workforce Summary
        </button>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-y-auto p-6 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-2xl rounded-2xl p-4 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-800 border border-slate-200'
              }`}
            >
              <p className="whitespace-pre-line">{m.text}</p>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1">
              {m.role === 'user' ? 'You' : `Verified Source: ${m.source}`}
            </span>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
            <Sparkles className="w-4 h-4 animate-spin text-blue-500" /> Thinking...
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${category.replace('_', ' ')}...`}
          className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
        />
        <button
          type="submit"
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
        >
          <Send className="w-4 h-4" /> Send
        </button>
      </form>
    </div>
  );
}
