import React from 'react';
import { ArrowLeft, Clock } from 'lucide-react';

export default function ProgressBar({ currentStep = 0, onBack, canGoBack }) {
  // Smoothly advances with each question answered, capped at 92% so it never exceeds or overflows
  const visualWidth = Math.min(92, Math.round(15 + currentStep * 5));

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pt-6 pb-2">
      {/* Top row: Back button on the left, estimated time on the right */}
      <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-2.5 h-7">
        <div className="flex items-center">
          {canGoBack ? (
            <button
              onClick={onBack}
              type="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <span className="text-slate-400 font-medium">Quick Eligibility Check</span>
          )}
        </div>

        <div className="flex items-center gap-1 text-slate-500">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Takes ~60 sec</span>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden shadow-inner relative">
        <div
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out relative progress-bar-shimmer"
          style={{ width: `${visualWidth}%` }}
        />
      </div>
    </div>
  );
}
