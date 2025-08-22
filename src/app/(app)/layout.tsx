import Footer from '@/components/footer';
import Header from '@/components/header/header';
import { ListsContextProvider } from '@/components/providers/list-context-provider';
import { TodosContextProvider } from '@/components/providers/note-context-provider';
import SearchContextProvider from '@/components/providers/search-context-provider';
import { checkAuth } from '@/lib/server-utils';
import { getTodoLists } from '@/server/list-actions';
import { ReactNode } from 'react';

export default async function PageLayout({ children }: { children: ReactNode }) {
  const session = await checkAuth();
  const lists = await getTodoLists();

  return (
    <div className="flex h-dvh flex-col overflow-x-hidden">
      <Header userSession={session.user} />
      <div className="mx-auto w-full max-w-[70rem] flex-1">
        <main className="flex-1 px-5 py-5 sm:py-10">
          <SearchContextProvider>
            <ListsContextProvider data={lists}>
              <TodosContextProvider>{children}</TodosContextProvider>
            </ListsContextProvider>
          </SearchContextProvider>
        </main>
      </div>
      <Footer />
    </div>
  );
}
