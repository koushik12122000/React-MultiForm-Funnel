import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  CheckCircle2,
  DollarSign
} from 'lucide-react';

export default function LaunchScreen({ onStart }) {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center text-center animate-fadeIn">
      
      {/* 2026 Updated Notice Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs sm:text-sm font-semibold mb-6 shadow-xs animate-pulse-subtle">
        <Sparkles className="w-4 h-4 text-blue-600" />
        <span>Official 2026 SSA Benefit Guidelines Updated</span>
      </div>

      {/* Main High-Impact Headline */}
      <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] max-w-2xl">
        Over 50 and <span className="text-blue-600">Unemployed?</span>
      </h1>

      {/* Benefit Highlight Sub-headline */}
      <p className="mt-4 text-lg sm:text-2xl text-slate-700 font-medium max-w-xl leading-snug">
        You may be eligible for up to{' '}
        <span className="font-extrabold text-emerald-600 underline decoration-emerald-300 decoration-2 underline-offset-4">
          $4,152 every month
        </span>{' '}
        in disability benefits.
      </p>

      <p className="mt-2 text-sm sm:text-base text-slate-500 max-w-lg">
        Complete our confidential 60-second questionnaire to check your preliminary qualification and estimated monthly payout.
      </p>

      {/* 3 Key Trust & Value Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-8 w-full max-w-2xl">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Takes ~60 Seconds</div>
            <div className="text-[11px] text-slate-500">Quick & simple questions</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Up to $4,152 / mo</div>
            <div className="text-[11px] text-slate-500">Maximum 2026 payout</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">100% Confidential</div>
            <div className="text-[11px] text-slate-500">No impact on credit</div>
          </div>
        </div>
      </div>

      {/* Primary CTA Start Button */}
      <div className="w-full max-w-md">
        <button
          onClick={onStart}
          type="button"
          className="
            w-full group relative overflow-hidden py-4 sm:py-4.5 px-8 rounded-2xl font-extrabold text-white text-lg sm:text-xl
            bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700
            hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800
            shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:shadow-blue-600/40
            hover:-translate-y-1 active:translate-y-0 active:scale-[0.99]
            transition-all duration-200 cursor-pointer
            flex items-center justify-center gap-3
          "
        >
          <span>Start Free Evaluation</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform duration-200" />
        </button>

        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>No obligation • Free preliminary assessment</span>
        </div>
      </div>

    </div>
  );
}
