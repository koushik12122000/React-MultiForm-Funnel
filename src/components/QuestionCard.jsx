import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  Briefcase, 
  HelpCircle, 
  AlertCircle, 
  DollarSign, 
  Calendar, 
  Stethoscope, 
  FileText,
  UserCheck
} from 'lucide-react';

export default function QuestionCard({ 
  question, 
  currentValue, 
  onSelect, 
  isFirstStep = false 
}) {
  const [selectedVal, setSelectedVal] = useState(currentValue || null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Sync state if back button was clicked
  useEffect(() => {
    setSelectedVal(currentValue || null);
  }, [currentValue, question.id]);

  // Handle option selection with subtle tactile feedback before advancing
  const handleOptionClick = (value) => {
    if (isAnimating) return;
    setSelectedVal(value);
    setIsAnimating(true);

    setTimeout(() => {
      onSelect(question.id, value);
      setIsAnimating(false);
    }, 220);
  };

  // Keyboard navigation support: Press '1', '2', '3', etc. to select
  useEffect(() => {
    const handleKeyDown = (e) => {
      const keyNum = parseInt(e.key, 10);
      if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= question.options.length) {
        const option = question.options[keyNum - 1];
        if (option) {
          handleOptionClick(option.value);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [question, isAnimating]);

  // Icon selector based on option characteristics
  const renderOptionIcon = (option, index) => {
    if (option.icon === 'CheckCircle2') {
      return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    }
    if (option.icon === 'XCircle') {
      return <XCircle className="w-5 h-5 text-rose-500" />;
    }
    if (option.badge) {
      return (
        <span className="text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
          {option.badge}
        </span>
      );
    }
    return (
      <span className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-blue-100 text-slate-500 group-hover:text-blue-600 flex items-center justify-center text-xs font-semibold transition-colors">
        {index + 1}
      </span>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">

      {/* Question Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 text-center sm:text-left leading-snug">
          {question.title}
        </h2>
        {question.subtext && (
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 text-center sm:text-left">
            {question.subtext}
          </p>
        )}
      </div>

      {/* Options Selection Grid */}
      <div className={`grid gap-3 ${question.options.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
        {question.options.map((option, idx) => {
          const isSelected = selectedVal === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleOptionClick(option.value)}
              className={`
                group relative flex items-center justify-between p-4 sm:p-4.5 rounded-xl border-2 text-left cursor-pointer
                transition-all duration-200 select-none
                ${isSelected 
                  ? 'border-blue-600 bg-blue-50/70 shadow-md ring-2 ring-blue-500/20 translate-y-[-2px]' 
                  : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-slate-50/80 hover:shadow-md hover:-translate-y-0.5'
                }
              `}
            >
              <div className="flex items-center gap-3.5 pr-2">
                <div className="flex-shrink-0">
                  {renderOptionIcon(option, idx)}
                </div>
                <div>
                  <div className={`text-base font-semibold transition-colors ${isSelected ? 'text-blue-900 font-bold' : 'text-slate-800 group-hover:text-blue-700'}`}>
                    {option.label}
                  </div>
                  {option.description && (
                    <div className="text-xs text-slate-500 mt-0.5">
                      {option.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Right indicators: Keyboard hint or chevron */}
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400 group-hover:text-blue-500 bg-slate-100 group-hover:bg-blue-50 px-1.5 py-0.5 rounded border border-slate-200 group-hover:border-blue-200 transition-colors">
                  {idx + 1}
                </span>
                <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isSelected ? 'text-blue-600 translate-x-1' : 'text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5'}`} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Helpful context helper footnote */}
      <div className="mt-6 flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-400">
        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
        <span>Click an option or press numeric keys 1 - {question.options.length} to proceed</span>
      </div>

    </div>
  );
}
