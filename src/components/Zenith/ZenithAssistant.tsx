'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ZenithOrb } from './ZenithOrb';

const loadChat = () => import('./ZenithChat');

const Opening = () => (
  <div className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 pointer-events-none">
    <div className="flex items-center gap-3 rounded-full border border-default bg-bg-1 shadow-float px-4 py-2.5 text-sm font-medium text-primary">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-vivid-blue border-t-transparent" />
      Opening Zenith…
    </div>
  </div>
);

const ZenithChat = dynamic(() => loadChat().then(m => m.ZenithChat), { ssr: false, loading: Opening });

export default function ZenithAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const timer = window.setTimeout(() => {
      if (idle) idle(() => { loadChat(); }, { timeout: 5000 });
      else loadChat();
    }, 4000);
    return () => window.clearTimeout(timer);
  }, []);

  const handleOpen = () => {
    setHasOpened(true);
    setIsOpen(true);
  };

  return (
    <>
      <span onMouseEnter={() => { loadChat(); }} onTouchStart={() => { loadChat(); }}>
        <ZenithOrb isOpen={isOpen} onClick={handleOpen} />
      </span>
      {hasOpened && <ZenithChat isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
}
