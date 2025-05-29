'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TouchScrollIndicatorProps {
  show?: boolean;
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

export default function TouchScrollIndicator({ 
  show = true, 
  direction = 'horizontal',
  className = '' 
}: TouchScrollIndicatorProps) {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (show) {
      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 sm:hidden ${className}`}
      role="tooltip"
      aria-label="راهنمای اسکرول"
    >
      <div className="bg-green-800/90 backdrop-blur-sm border border-green-600/50 rounded-full px-4 py-2 shadow-lg">
        <div className="flex items-center gap-2 text-green-100">
          {direction === 'horizontal' ? (
            <>
              <ChevronRight className="h-4 w-4 animate-pulse" />
              <span className="text-sm font-medium">برای مشاهده بیشتر کشیده کنید</span>
              <ChevronLeft className="h-4 w-4 animate-pulse" />
            </>
          ) : (
            <>
              <span className="text-sm font-medium">برای مشاهده بیشتر اسکرول کنید</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 