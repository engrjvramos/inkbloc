import FiltersContextProvider from '@/components/providers/filters-context-provider';
import { ListsContextProvider } from '@/components/providers/list-context-provider';
import { TodosContextProvider } from '@/components/providers/note-context-provider';
import { checkAuth } from '@/lib/server-utils';
import { getTodoLists } from '@/server/list-actions';
import { ReactNode } from 'react';
import Header from './_components/header';

export default async function PageLayout({ children }: { children: ReactNode }) {
  const session = await checkAuth();
  const lists = await getTodoLists();

  return (
    <div className="mx-auto flex h-dvh max-w-[80rem] flex-col overflow-hidden">
      <Header userSession={session.user} />
      <main className="flex-1 px-5 py-10">
        <FiltersContextProvider>
          <ListsContextProvider data={lists}>
            <TodosContextProvider>{children}</TodosContextProvider>
          </ListsContextProvider>
        </FiltersContextProvider>
      </main>
    </div>
  );
}
