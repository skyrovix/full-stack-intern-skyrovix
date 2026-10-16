import React from 'react';
import { ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from './BrandIcons';

export const MobileStickyCTA = ({ onOpenApply, whatsappUrl }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-2.5 sm:p-3 bg-white/95 backdrop-blur-[18px] border-t border-[rgba(25,40,55,0.08)] shadow-[0_-8px_30px_rgba(25,40,55,0.08)] md:hidden safe-area-pb">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        {/* WhatsApp Button */}
        <a
          href={whatsappUrl || 'https://chat.whatsapp.com/BIE2gLWrWtb9AGYpL9o2yP'}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 px-3.5 bg-[#ECFFF8] hover:bg-[#d8fced] text-[#123F35] border border-[#35D39A] rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs active:scale-95"
          title="Join WhatsApp Group"
          id="sticky-whatsapp-btn"
        >
          <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
          <span className="text-xs font-bold">Chat</span>
        </a>

        {/* Primary Apply Button */}
        <button
          onClick={onOpenApply}
          className="flex-1 py-2.5 px-4 text-white rounded-full font-extrabold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer min-w-0 transition-transform active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg, #087FC1, #2447B8)',
            boxShadow: '0 6px 18px rgba(8,127,193,0.30)'
          }}
          id="sticky-apply-btn"
        >
          <span className="truncate text-xs font-black tracking-tight">APPLY (₹200)</span>
          <ArrowRight className="w-4 h-4 shrink-0" />
        </button>
      </div>
    </div>
  );
};

