'use client';

import { XIcon } from 'lucide-react';
import { Toaster as Sonner, toast, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={'light'}
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

const CloseToast = (
  <button className="absolute top-2 right-2 h-5 w-5 cursor-pointer rounded-full" onClick={() => toast.dismiss()}>
    <XIcon className="size-4" />
  </button>
);

export { CloseToast, Toaster };
