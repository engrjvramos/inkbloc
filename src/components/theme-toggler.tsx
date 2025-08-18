'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { useEffect, useState } from 'react';
import { Toggle } from './ui/toggle';

export default function ThemeToggler() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (resolvedTheme === 'light') setTheme('light');
    else if (resolvedTheme === 'dark') setTheme('dark');
  }, [resolvedTheme, setTheme]);

  if (!mounted) return null;

  return (
    <div className="relative">
      <Toggle
        variant="outline"
        className="group data-[state=on]:hover:bg-muted dark:bg-input/30 size-9 cursor-pointer data-[state=on]:bg-transparent"
        pressed={theme === 'dark'}
        onPressedChange={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        <MoonIcon
          size={16}
          className="shrink-0 scale-0 opacity-0 transition-all dark:scale-100 dark:opacity-100"
          aria-hidden="true"
        />
        <SunIcon
          size={16}
          className="absolute shrink-0 scale-100 opacity-100 transition-all dark:scale-0 dark:opacity-0"
          aria-hidden="true"
        />
      </Toggle>
    </div>
  );
}
