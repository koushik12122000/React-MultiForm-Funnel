import React from 'react';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

export default function Footer({ onOpenLegal }) {
  return (
    <footer className="w-full bg-slate-100 border-t border-slate-200 mt-auto py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Simple Consumer Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 pb-6 border-b border-slate-200 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>Free Disability Evaluation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-slate-500" />
            <span>Independent Consumer Service</span>
          </div>
        </div>

        {/* Disclaimer Text */}
        <div className="mt-6 text-[11px] text-slate-400 leading-relaxed text-center max-w-2xl mx-auto space-y-2">
          <p>
            <strong>Disclaimer:</strong> DisabilityPath is an independent consumer assistance portal and is not associated with, endorsed by, or affiliated with the Social Security Administration (SSA), the federal government, or any governmental department. We do not provide legal or medical advice.
          </p>
          <p>
            Up to $4,152/month represents the maximum potential monthly benefit for an individual with eligible high earnings under 2026 Social Security cost-of-living adjustments. Your actual benefit calculation depends entirely upon your lifetime covered earnings history and the SSA's official determination.
          </p>
        </div>

        {/* Links & Copyright */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            &copy; {new Date().getFullYear()} DisabilityPath. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-blue-600 underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onOpenLegal('terms')}
              className="hover:text-blue-600 underline cursor-pointer"
            >
              Terms & Disclaimers
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
