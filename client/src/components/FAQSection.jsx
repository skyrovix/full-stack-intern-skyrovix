import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ShieldCheck, 
  AlertTriangle, 
  Info,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { faqList } from '../data/faqs';

export const FAQSection = ({ onOpenApply }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider border border-sky-200">
            <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
            <span>CLARIFICATIONS &amp; POLICIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Everything you need to know about Skyrovix Batch 1, fees, project evaluations, and certifications.
          </p>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-3 text-left mb-14">
          {faqList.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 bg-white ${
                  isOpen
                    ? 'border-sky-300 shadow-md ring-2 ring-sky-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base focus:outline-none"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-sky-600 font-mono text-xs">Q{idx + 1}.</span>
                    <span>{faq.question}</span>
                  </span>
                  <div className={`p-1.5 rounded-lg border transition-transform duration-200 shrink-0 ${
                    isOpen ? 'bg-sky-50 text-sky-600 border-sky-200 rotate-180' : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Important Official Notices Box */}
        <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200 shadow-soft text-left space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Info className="w-5 h-5 text-sky-600" />
            <span>Important Program Notices &amp; Ethical Standards</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block mb-1">Batch Schedule:</strong>
              <p className="text-slate-600">
                "Batch 1 starts within the next 10 days. Exact start date and schedule will be announced through the official WhatsApp group."
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <strong className="text-slate-900 block mb-1">Transparent Pricing:</strong>
              <p className="text-slate-600">
                "₹0 Internship Fee — ₹200 Registration Fee Only. No hidden tuition or course fees."
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Realistic Career Disclaimer:</span>
            </div>
            <p className="leading-relaxed">
              Skyrovix operates an intensive educational engineering internship. We believe in genuine skills and transparent metrics. We do <strong>not</strong> make false claims of guaranteed jobs, guaranteed placements, or guaranteed starting salaries. Your career outcomes depend on your code portfolio, interview performance, and mastery of development concepts.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
