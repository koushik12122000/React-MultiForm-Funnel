import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';

export default function CalculatingStep({ onComplete }) {
  const [currentCheck, setCurrentCheck] = useState(0);

  const checks = [
    'Analyzing work history and insured Social Security credits...',
    'Reviewing medical condition duration and physician care criteria...',
    'Cross-referencing 2026 SSA maximum monthly benefit threshold ($4,152)...',
    'Pre-qualification match confirmed!'
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentCheck(1), 700);
    const timer2 = setTimeout(() => setCurrentCheck(2), 1400);
    const timer3 = setTimeout(() => setCurrentCheck(3), 2100);
    const timer4 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-12 text-center">
      
      {/* Animated Circular Loader / Badge */}
      <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-ping opacity-25"></div>
        <div className="w-24 h-24 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-blue-600">
          <TrendingUp className="w-10 h-10 stroke-[2.2]" />
        </div>
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-3">
        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
        <span>Algorithm Processing Answers</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        Calculating Your Eligibility...
      </h2>
      <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
        Please wait a moment while our verification engine matches your answers against Social Security Disability parameters.
      </p>

      {/* Progress Checklist */}
      <div className="mt-8 space-y-3.5 max-w-md mx-auto text-left bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        {checks.map((text, idx) => {
          const isDone = currentCheck > idx || currentCheck === 3;
          const isCurrent = currentCheck === idx && currentCheck !== 3;

          return (
            <div key={idx} className="flex items-center gap-3">
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 animate-scale-in" />
              ) : isCurrent ? (
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-slate-200 flex-shrink-0" />
              )}
              <span className={`text-xs sm:text-sm font-medium transition-colors ${isDone ? 'text-slate-800 font-semibold' : isCurrent ? 'text-blue-700 font-medium' : 'text-slate-400'}`}>
                {text}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <button
          onClick={onComplete}
          className="text-xs text-slate-400 hover:text-slate-600 underline cursor-pointer"
        >
          Skip animation
        </button>
      </div>

    </div>
  );
}
