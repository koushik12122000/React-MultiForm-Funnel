import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm ring-1 ring-blue-100">
            <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                Disability<span className="text-blue-600">Path</span>
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-400 tracking-wide">
              Disability Benefits Evaluation
            </span>
          </div>
        </div>

        {/* Simple Trust Indicator */}
        <div className="text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60">
          Official 2026 Guidelines
        </div>

      </div>
    </header>
  );
}
