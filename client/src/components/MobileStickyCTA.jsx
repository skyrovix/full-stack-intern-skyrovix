import React from 'react';
import { ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from './BrandIcons';

export const MobileStickyCTA = ({ onOpenApply, whatsappUrl }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/95 backdrop-blur-[18px] border-t border-[rgba(25,40,55,0.08)] shadow-[0_-8px_30px_rgba(25,40,55,0.08)] md:hidden">
      <div className="flex items-center gap-2 max-w-sm mx-auto">
        <a
          href={whatsappUrl || 'https://chat.whatsapp.com/BIE2gLWrWtb9AGYpL9o2yP'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 px-3 bg-[#ECFFF8] text-[#123F35] border border-[#35D39A] rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
          <span>WhatsApp</span>
        </a>

        <button
          onClick={onOpenApply}
          className="flex-[2] py-3 px-4 text-white rounded-full font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #087FC1, #2447B8)',
            boxShadow: '0 8px 20px rgba(8,127,193,0.30)'
          }}
        >
          <span>APPLY FOR BATCH 1 (₹200)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
