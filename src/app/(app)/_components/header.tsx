import HeaderDropdown from '@/components/header/header-dropdown';
import { User } from 'better-auth';

export default async function Header({ userSession }: { userSession: User }) {
  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b px-5">
      INKBLOC
      <HeaderDropdown userSession={userSession} />
    </header>
  );
}
