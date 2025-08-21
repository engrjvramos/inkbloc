'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { useEffect, useId, useState } from 'react';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';

export default function ThemeToggler() {
  const id = useId();
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
    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
      <div className="relative flex w-full items-center gap-2">
        <Label htmlFor={id}>
          <span className="sr-only">Toggle switch</span>
          {theme === 'dark' ? (
            <MoonIcon size={16} className="opacity-60" aria-hidden="true" />
          ) : (
            <SunIcon size={16} className="opacity-60" aria-hidden="true" />
          )}
        </Label>
        <span>Theme</span>
        <div className="ml-auto inline-flex items-center gap-2">
          <Switch
            id={id}
            checked={theme === 'dark'}
            onCheckedChange={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            aria-label="Toggle switch"
          />
        </div>
      </div>
    </DropdownMenuItem>
  );
}
