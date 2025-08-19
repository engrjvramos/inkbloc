'use client';

import { useFiltersContext } from '@/components/providers/filters-context-provider';
import { useTodosContext } from '@/components/providers/note-context-provider';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Todo } from '@prisma/client';
import { GripVerticalIcon, StarIcon } from 'lucide-react';
import { useMemo, useTransition } from 'react';
import { toast } from 'sonner';
import DropdownActions from './dropdown-actions';
import TodoFilters from './todo-filters';

export default function TodoList() {
  const { todos, handleDeleteTodo, handleEditTodo } = useTodosContext();
  const { searchQuery, selectedStatuses } = useFiltersContext();
  const [, startTransition] = useTransition();

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchesQuery = todo.todo.toLowerCase().includes(searchQuery.toLowerCase().trim());

      const todoStatuses: string[] = [];
      if (todo.isComplete) {
        todoStatuses.push('completed');
      } else {
        todoStatuses.push('active');
      }
      if (todo.isImportant) {
        todoStatuses.push('important');
      }
      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.some((status) => todoStatuses.includes(status));

      return matchesQuery && matchesStatus;
    });
  }, [todos, searchQuery, selectedStatuses]);

  async function handleToggleField(id: string, todo: Todo, field: 'isComplete' | 'isImportant') {
    startTransition(async () => {
      try {
        await handleEditTodo(id, { ...todo, [field]: !todo[field] });
      } catch (error) {
        const e = error as Error;
        toast.error(e.message || 'Failed to edit todo');
      }
    });
  }

  async function handleDelete(id: string) {
    startTransition(async () => {
      try {
        await handleDeleteTodo(id);
      } catch (error) {
        const e = error as Error;
        toast.error(e.message || 'Failed to add todo');
      }
    });
  }

  return (
    <div className="flex flex-col gap-10">
      <TodoFilters />
      <ul className="no-scrollbar flex max-h-[calc(100dvh-18rem)] w-full flex-col gap-2 overflow-y-auto">
        {filteredTodos.map((todo) => (
          <li key={todo.id} className="flex w-full items-center justify-between gap-5 rounded-md border px-4 py-2">
            <div className="flex w-full items-center gap-4">
              <GripVerticalIcon className="text-muted-foreground" />
              <Checkbox
                className="size-5 rounded-full"
                checked={todo.isComplete}
                onCheckedChange={() => handleToggleField(todo.id, todo, 'isComplete')}
              />
              <span className={cn(todo.isComplete && 'line-through opacity-50')}>{todo.todo}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                title="Mark as important"
                variant={'ghost'}
                className="size-8"
                onClick={() => handleToggleField(todo.id, todo, 'isImportant')}
              >
                <StarIcon className={cn('size-5 opacity-60', todo.isImportant && 'fill-primary opacity-100')} />
              </Button>
              <DropdownActions todo={todo} onDelete={() => handleDelete(todo.id)} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
