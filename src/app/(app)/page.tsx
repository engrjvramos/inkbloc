'use client';

import AddListForm from '@/components/list/add-list-form';
import { useListsContext } from '@/components/providers/list-context-provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Suspense } from 'react';
import TodoFilters from './_components/todo-filters';
import TodoForm from './_components/todo-form';
import TodoList from './_components/todo-list';

export default function Home() {
  const { selectedListId, lists, handleChangeSelectedListId } = useListsContext();

  return (
    <div className="mx-auto flex max-w-[90rem] flex-col gap-5">
      <TodoFilters />

      <div className="no-scrollbar flex gap-px overflow-x-auto border-b">
        {lists.map(({ id, title, _count }) => (
          <Button
            variant="ghost"
            key={id}
            onClick={() => handleChangeSelectedListId(id)}
            className={cn(
              'text-muted-foreground relative h-auto max-w-[10rem] rounded-t-md rounded-b-none border-0 px-4 py-3',
              id === selectedListId &&
                'dark:bg-accent/50 text-foreground after:absolute after:right-0 after:bottom-0 after:left-0 after:h-[2px] after:bg-red-500 after:content-[""]',
            )}
          >
            <span className="truncate">{title}</span>

            {_count.todos > 0 && (
              <span className="text-muted-foreground bg-input inline-flex size-5 shrink-0 items-center justify-center rounded-full font-mono text-xs">
                {_count.todos}
              </span>
            )}
          </Button>
        ))}
        <AddListForm />
      </div>

      <Suspense fallback={<p>Loading...</p>}>
        <TodoForm />
        <TodoList />
      </Suspense>
    </div>
  );
}
