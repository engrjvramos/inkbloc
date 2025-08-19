'use client';

import ThemeToggler from '@/components/theme-toggler';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function Header() {
  const router = useRouter();

  async function handleLogout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login');
        },
        onError: () => {
          toast.error('Logout failed');
        },
      },
    });
  }

  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b px-5">
      Header
      <div className="flex items-center gap-2">
        <ThemeToggler />
        <Button onClick={handleLogout} className="">
          Logout
        </Button>
      </div>
    </header>
  );
}
