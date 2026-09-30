import React from 'react';
import { X, Shield, FileText } from 'lucide-react';

export default function LegalModal({ isOpen, onClose, modalType }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {modalType === 'privacy' ? (
              <Shield className="w-5 h-5 text-blue-600" />
            ) : (
              <FileText className="w-5 h-5 text-blue-600" />
            )}
            <h3 className="text-lg font-bold text-slate-900">
              {modalType === 'privacy' ? 'Privacy Policy' : 'Terms of Service & Disclosures'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          {modalType === 'privacy' ? (
            <>
              <p className="font-semibold text-slate-800">
                Effective Date: 2026 Guidelines Update
              </p>
              <p>
                DisabilityPath respects your privacy. We collect personal contact information (such as your email) and qualification survey responses strictly for evaluating disability benefit eligibility and providing relevant claim assistance.
              </p>
              <h4 className="font-bold text-slate-800 text-sm mt-3">Data Security & Encryption</h4>
              <p>
                All data transmitted through this evaluation funnel is protected by end-to-end 256-bit SSL encryption. We do not sell your personal data to non-affiliated commercial marketing vendors.
              </p>
              <h4 className="font-bold text-slate-800 text-sm mt-3">Meta & Analytics Tracking</h4>
              <p>
                We use privacy-compliant web analytics and server-to-server conversion protocols (such as Meta Conversions API) to measure marketing campaign efficiency. Personal identifiers such as email addresses are cryptographically hashed using SHA-256 before transmission.
              </p>
              <h4 className="font-bold text-slate-800 text-sm mt-3">Opt-Out & Rights</h4>
              <p>
                You may opt out of future communications at any time by clicking the unsubscribe link at the bottom of any email received from us.
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-slate-800">
                Non-Government Affiliation Disclosure
              </p>
              <p>
                DisabilityPath is a private, independent consumer advocacy and informational service. It is NOT affiliated with, sponsored by, or endorsed by the Social Security Administration (SSA), the federal government, or any state government body.
              </p>
              <h4 className="font-bold text-slate-800 text-sm mt-3">Benefit Calculations</h4>
              <p>
                The stated potential of "up to $4,152 every month" reflects the maximum allowable individual Social Security Disability Insurance (SSDI) payment tier for high-earning individuals under the 2026 cost-of-living adjustments. Your actual benefit amount, if approved, is determined entirely by the Social Security Administration based on your individual average indexed monthly earnings (AIME).
              </p>
              <h4 className="font-bold text-slate-800 text-sm mt-3">No Legal or Medical Advice</h4>
              <p>
                The preliminary qualification tool is an informational screening mechanism and does not guarantee approval of disability claims. Consult an accredited disability attorney or physician for formal legal or medical guidance.
              </p>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 flex justify-end bg-slate-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
