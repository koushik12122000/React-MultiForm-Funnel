import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle, 
  Sparkles, 
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function LeadCaptureStep({ onSubmit, isSubmitting = false }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Format phone number into (XXX) XXX-XXXX
  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneDigits = value.replace(/[^\d]/g, '');
    const phoneLength = phoneDigits.length;
    if (phoneLength < 4) return phoneDigits;
    if (phoneLength < 7) {
      return `(${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(3)}`;
    }
    return `(${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(3, 6)}-${phoneDigits.slice(6, 10)}`;
  };

  const validateField = (name, value) => {
    const trimmed = (value || '').trim();

    if (name === 'fullName') {
      if (!trimmed) return 'Please enter your full name.';
      if (trimmed.length < 2) return 'Name must be at least 2 characters.';
      return '';
    }

    if (name === 'phone') {
      const digits = trimmed.replace(/\D/g, '');
      if (!digits) return 'Please enter your phone number.';
      if (digits.length < 10) return 'Please enter a valid 10-digit phone number.';
      return '';
    }

    if (name === 'email') {
      if (!trimmed) return 'Please enter your email address.';
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
      if (!emailRegex.test(trimmed)) return 'Please enter a valid email address.';
      return '';
    }

    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === 'phone') {
      finalValue = formatPhoneNumber(value);
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));

    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, finalValue) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      fullName: validateField('fullName', formData.fullName),
      phone: validateField('phone', formData.phone),
      email: validateField('email', formData.email)
    };

    setErrors(newErrors);
    setTouched({ fullName: true, phone: true, email: true });

    if (Object.values(newErrors).some((err) => Boolean(err))) {
      return;
    }

    onSubmit({
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim()
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8">
      
      {/* Pre-Qualified Congratulatory Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-4 animate-bounce-subtle">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Great News — Evaluation Complete!</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
          You're Pre-Qualified for Up to{' '}
          <span className="text-emerald-600 underline decoration-emerald-300 underline-offset-4">
            $4,152/Month!
          </span>
        </h1>

        <p className="mt-2.5 text-base sm:text-lg text-slate-600 font-medium">
          Enter your details below to receive your official results packet.
        </p>
      </div>

      {/* Pre-Qualification Summary Cards */}
      <div className="grid grid-cols-3 gap-2.5 mb-8 bg-slate-50 p-3.5 rounded-xl border border-slate-200/90 text-center">
        <div className="bg-white p-2.5 rounded-lg border border-slate-100 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</div>
          <div className="text-xs sm:text-sm font-bold text-emerald-600 mt-0.5 flex items-center justify-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Pre-Qualified
          </div>
        </div>
        <div className="bg-white p-2.5 rounded-lg border border-slate-100 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Estimated Max</div>
          <div className="text-xs sm:text-sm font-bold text-blue-700 mt-0.5">
            $4,152 / mo
          </div>
        </div>
        <div className="bg-white p-2.5 rounded-lg border border-slate-100 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Review Time</div>
          <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">
            Immediate
          </div>
        </div>
      </div>

      {/* Lead Capture Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-5 h-5" />
            </div>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. John Doe"
              autoFocus
              className={`
                w-full pl-11 pr-4 py-3.5 rounded-xl text-base text-slate-900 bg-white border-2
                placeholder-slate-400 shadow-xs transition-all duration-200 focus:outline-hidden
                ${errors.fullName 
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' 
                  : 'border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10'
                }
              `}
            />
          </div>
          {errors.fullName && (
            <div className="flex items-center gap-1.5 mt-1.5 text-xs font-semibold text-rose-600 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errors.fullName}</span>
            </div>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Phone className="w-5 h-5" />
            </div>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="(555) 000-0000"
              maxLength={14}
              className={`
                w-full pl-11 pr-4 py-3.5 rounded-xl text-base text-slate-900 bg-white border-2
                placeholder-slate-400 shadow-xs transition-all duration-200 focus:outline-hidden
                ${errors.phone 
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' 
                  : 'border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10'
                }
              `}
            />
          </div>
          {errors.phone && (
            <div className="flex items-center gap-1.5 mt-1.5 text-xs font-semibold text-rose-600 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errors.phone}</span>
            </div>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-5 h-5" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="name@example.com"
              className={`
                w-full pl-11 pr-4 py-3.5 rounded-xl text-base text-slate-900 bg-white border-2
                placeholder-slate-400 shadow-xs transition-all duration-200 focus:outline-hidden
                ${errors.email 
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' 
                  : 'border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10'
                }
              `}
            />
          </div>
          {errors.email && (
            <div className="flex items-center gap-1.5 mt-1.5 text-xs font-semibold text-rose-600 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errors.email}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="
            w-full relative group overflow-hidden py-4 px-6 rounded-xl font-bold text-white text-base sm:text-lg
            bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700
            hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800
            shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35
            hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]
            transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed
            flex items-center justify-center gap-2 mt-2
          "
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating Claim Report & Dispatching...</span>
            </>
          ) : (
            <>
              <span>Send My Results</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        {/* Consumer Privacy Signals */}
        <div className="pt-2 text-center space-y-2">
          <div className="flex items-center justify-center gap-3 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> 100% Free & Confidential
            </span>
            <span>•</span>
            <span>No Spam Ever</span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed max-w-md mx-auto">
            By clicking "Send My Results", you agree to receive your estimated disability benefits qualification packet at the email and phone number provided. You may unsubscribe at any time.
          </p>
        </div>
      </form>

    </div>
  );
}
