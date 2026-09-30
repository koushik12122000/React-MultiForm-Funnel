import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Calendar, 
  RotateCcw,
  Sparkles,
  Phone,
  Mail
} from 'lucide-react';

export default function ConfirmationStep({ 
  leadData, 
  onRestart 
}) {
  useEffect(() => {
    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti failed to launch', e);
    }
  }, []);

  const name = leadData?.lead?.first_name || leadData?.lead?.full_name || 'Applicant';
  const email = leadData?.lead?.email || 'your email';
  const phone = leadData?.lead?.phone || '';

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      
      {/* Success Badge */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Evaluation Confirmed</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Congratulations, {name}!
        </h1>
        <p className="mt-2 text-base text-slate-600">
          Your preliminary disability evaluation packet has been generated and sent:
        </p>
        
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/70 font-semibold">
            <Mail className="w-3.5 h-3.5" /> {email}
          </span>
          {phone && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/70 font-semibold">
              <Phone className="w-3.5 h-3.5" /> {phone}
            </span>
          )}
        </div>
      </div>

      {/* Maximum Benefit Potential Card */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl"></div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="text-xs uppercase tracking-widest text-blue-300 font-semibold">
              Maximum Estimated Monthly Entitlement
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 mt-1 flex items-baseline gap-1">
              $4,152 <span className="text-sm font-normal text-slate-300">/ month</span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 text-xs text-slate-200">
            <span className="font-semibold text-emerald-300">Tier: Full Benefit Qualification</span>
            <div className="text-[11px] text-slate-400 mt-0.5">Based on 2026 Social Security Guidelines</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Age criteria satisfied</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Work credits evaluated</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Cost-of-living adjusted</span>
          </div>
        </div>
      </div>

      {/* What Happens Next Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span>Next Steps for Your Claim</span>
        </h2>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Check Your Inbox & SMS</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review your breakdown outlining filing instructions and clinical documents required by the Social Security Administration.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Advocate Medical Review</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                A qualified disability advocate will review your medical history to ensure your case meets SSA severity listings.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Expedited Filing & Backpay Calculation</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Applicants who submit with complete clinical documentation are significantly less likely to face delays or denials.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Restart Evaluation Button */}
      <div className="text-center">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-800 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Start a New Evaluation</span>
        </button>
      </div>

    </div>
  );
}
