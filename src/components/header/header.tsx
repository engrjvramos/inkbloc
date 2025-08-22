import HeaderDropdown from '@/components/header/header-dropdown';
import { User } from 'better-auth';

export default async function Header({ userSession }: { userSession: User }) {
  return (
    <header className="border-b">
      <div className="mx-auto flex h-20 w-full max-w-[70rem] shrink-0 items-center justify-between px-5">
        <h1 className="font-text text-[clamp(24px,5vw,32px)]">InkBloc.</h1>
        <HeaderDropdown userSession={userSession} />
      </div>
    </header>
  );
}
