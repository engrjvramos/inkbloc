import Link from 'next/link';
import { ReactNode } from 'react';
import Header from './_components/header';

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden">
      <aside className="min-w-72 border-r">
        <div className="flex h-20 items-center justify-center text-2xl font-bold">InkBloc</div>
        <div>
          <Link href={'/'} className="hover:bg-accent inline-flex w-full items-center gap-2 rounded px-4 py-2">
            My List
          </Link>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-10">{children}</main>
      </div>
    </div>
  );
}
