'use client';
import Image from 'next/image';

interface ZenithOrbProps {
  onClick: () => void;
  isOpen: boolean;
}

export const ZenithOrb = ({ onClick, isOpen }: ZenithOrbProps) => {
  if (isOpen) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open Zenith AI assistant"
      className="zenith-orb-enter fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 inline-flex h-11 w-11 items-center justify-center gap-2 rounded-full border border-default bg-bg-1 shadow-float transition-[border-color,transform] duration-150 ease-standard hover:border-strong active:scale-[0.98] sm:w-auto sm:justify-start sm:pl-1.5 sm:pr-4"
    >
      <span className="relative h-7 w-7 shrink-0">
        <span className="block h-7 w-7 overflow-hidden rounded-full bg-bg-2">
          <Image src="/zenith-avatar.webp" alt="" width={28} height={28} className="h-full w-full object-cover" />
        </span>
        <span aria-hidden="true" className="absolute -bottom-px -right-px h-2 w-2 rounded-full bg-success ring-2 ring-bg-1" />
      </span>
      <span className="hidden text-small font-medium text-primary sm:inline">Ask Zenith</span>
    </button>
  );
};
