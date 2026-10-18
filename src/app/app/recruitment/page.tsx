'use client';

import { useState } from 'react';
import { Briefcase, Plus, ChevronRight, UserPlus } from 'lucide-react';

export default function RecruitmentPage() {
  const [candidates] = useState([
    {
      id: 'cand-01',
      name: 'Hamza Tariq',
      email: 'hamza.tariq@example.com',
      role: 'Senior Full Stack Engineer',
      stage: 'interview',
      rating: 4.5,
      appliedDate: '2026-04-05',
    },
    {
      id: 'cand-02',
      name: 'Ayesha Siddiqui',
      email: 'ayesha.s@example.com',
      role: 'HR Specialist',
      stage: 'offered',
      rating: 4.8,
      appliedDate: '2026-04-02',
    },
    {
      id: 'cand-03',
      name: 'Usman Farooq',
      email: 'usman.f@example.com',
      role: 'DevOps & Cloud Engineer',
      stage: 'screening',
      rating: 4.0,
      appliedDate: '2026-04-08',
    },
  ]);

  const stages = [
    { id: 'screening', title: 'Screening', color: 'bg-blue-500' },
    { id: 'interview', title: 'Interviewing', color: 'bg-amber-500' },
    { id: 'offered', title: 'Offered', color: 'bg-indigo-500' },
    { id: 'hired', title: 'Hired', color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-600" /> Recruitment & Talent Acquisition
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Job requisitions, applicant pipelines, interview scorecards, and seamless 1-click candidate to employee conversion.
          </p>
        </div>

        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-xs flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" /> Post New Job Opening
        </button>
      </div>

      {/* Recruitment Pipeline Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stages.map((stg) => {
          const list = candidates.filter((c) => c.stage === stg.id);
          return (
            <div key={stg.id} className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${stg.color}`} />
                  {stg.title}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-white border border-slate-200 text-slate-600">
                  {list.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {list.map((c) => (
                  <div
                    key={c.id}
                    className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs space-y-2 hover:border-blue-400 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <p className="font-semibold text-slate-900 text-sm leading-snug">{c.name}</p>
                      <span className="text-[11px] font-mono font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        ★ {c.rating}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{c.role}</p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{c.appliedDate}</span>
                      {c.stage === 'offered' ? (
                        <button className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium flex items-center gap-1 shadow-2xs text-[10px]">
                          <UserPlus className="w-3 h-3" /> Convert to Emp
                        </button>
                      ) : (
                        <button className="text-blue-600 font-semibold hover:text-blue-800 flex items-center">
                          Move <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
