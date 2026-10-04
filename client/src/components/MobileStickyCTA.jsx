import React from 'react';
import { ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from './BrandIcons';

export const MobileStickyCTA = ({ onOpenApply, whatsappUrl }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl md:hidden">
      <div className="flex items-center gap-2">
        <a
          href={whatsappUrl || 'https://chat.whatsapp.com/BIE2gLWrWtb9AGYpL9o2yP'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 px-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
        >
          <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
          <span>WhatsApp</span>
        </a>

        <button
          onClick={onOpenApply}
          className="flex-[2] py-3 px-4 bg-gradient-to-r from-sky-600 to-blue-700 text-white rounded-xl font-black text-xs shadow-md flex items-center justify-center gap-1.5"
        >
          <span>APPLY FOR BATCH 1 (₹200)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
