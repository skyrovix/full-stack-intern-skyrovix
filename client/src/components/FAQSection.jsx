import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  HelpCircle, 
  ChevronDown, 
  AlertTriangle, 
  Info
} from 'lucide-react';
import { faqList } from '../data/faqs';

export const FAQSection = ({ onOpenApply }) => {
  const [openIndex, setOpenIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const easeOutQuart = [0.16, 1, 0.3, 1];

  const toggleFAQ = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 md:py-24 bg-white border-t border-[rgba(25,40,55,0.08)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading with scroll reveal */}
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: easeOutQuart }}
          className="text-center max-w-2xl mx-auto mb-14 space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#087FC1]/10 text-[#087FC1] text-xs font-bold uppercase tracking-wider border border-[#087FC1]/20">
            <HelpCircle className="w-3.5 h-3.5 text-[#087FC1]" />
            <span>CLARIFICATIONS &amp; POLICIES</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-black text-[#192837] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-[#4C5B6D] text-sm sm:text-base leading-relaxed">
            Everything you need to know about Skyrovix Batch 1, fees, project evaluations, and certifications.
          </p>
        </motion.div>

        {/* FAQs Accordion with Framer Motion AnimatePresence */}
        <div className="space-y-3.5 text-left mb-14">
          {faqList.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: idx * 0.05, ease: easeOutQuart }}
                className={`rounded-[20px] border transition-all duration-200 bg-white overflow-hidden ${
                  isOpen
                    ? 'border-[#087FC1] shadow-md ring-2 ring-[#087FC1]/10'
                    : 'border-[rgba(25,40,55,0.08)] hover:border-[rgba(25,40,55,0.18)] shadow-2xs'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-[#192837] text-sm sm:text-base focus:outline-none cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-[#087FC1] font-mono text-xs font-black">Q{idx + 1}.</span>
                    <span className="font-heading">{faq.question}</span>
                  </span>
                  <div className={`p-1.5 rounded-xl border transition-transform duration-200 shrink-0 ${
                    isOpen ? 'bg-[#087FC1]/10 text-[#087FC1] border-[#087FC1]/20 rotate-180' : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: easeOutQuart }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6 sm:px-6 pt-1 text-xs sm:text-sm text-[#4C5B6D] leading-relaxed border-t border-slate-100 font-normal">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Important Official Notices Box */}
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: easeOutQuart }}
          className="p-6 md:p-8 rounded-[24px] bg-[#F7F9FC] border border-[rgba(25,40,55,0.08)] shadow-[0_10px_35px_rgba(25,40,55,0.03)] text-left space-y-4"
        >
          <div className="flex items-center gap-2 text-[#192837] font-bold text-sm">
            <Info className="w-5 h-5 text-[#087FC1]" />
            <span className="font-heading">Important Program Notices &amp; Ethical Standards</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-[16px] bg-white border border-[rgba(25,40,55,0.08)]">
              <strong className="font-heading text-[#192837] block mb-1">Batch Schedule:</strong>
              <p className="text-[#4C5B6D] leading-relaxed">
                "Batch 1 starts within the next 10 days. Exact start date and schedule will be announced through the official WhatsApp group."
              </p>
            </div>

            <div className="p-4 rounded-[16px] bg-white border border-[rgba(25,40,55,0.08)]">
              <strong className="font-heading text-[#192837] block mb-1">Transparent Pricing:</strong>
              <p className="text-[#4C5B6D] leading-relaxed">
                "₹0 Internship Fee — ₹200 Registration Fee Only. No hidden tuition or course fees."
              </p>
            </div>
          </div>

          <div className="p-4 rounded-[16px] bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Realistic Career Disclaimer:</span>
            </div>
            <p className="leading-relaxed">
              Skyrovix operates an intensive educational engineering internship. We believe in genuine skills and transparent metrics. We do <strong>not</strong> make false claims of guaranteed jobs, guaranteed placements, or guaranteed starting salaries. Your career outcomes depend on your code portfolio, interview performance, and mastery of development concepts.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
