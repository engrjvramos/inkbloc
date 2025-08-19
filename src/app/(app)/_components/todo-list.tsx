'use client';

import { useTodosContext } from '@/components/providers/note-context-provider';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Todo } from '@prisma/client';
import { StarIcon } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';
import DropdownActions from './dropdown-actions';

export default function TodoList() {
  const { todos, handleDeleteTodo, handleEditTodo } = useTodosContext();
  const [, startTransition] = useTransition();

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
    <ul className="no-scrollbar my-10 flex h-[80dvh] w-full flex-col gap-2 overflow-y-auto">
      {todos.length > 0 &&
        todos.map((todo) => (
          <li key={todo.id} className="flex w-full items-center justify-between gap-5 rounded-md border px-4 py-2">
            <div className="flex w-full items-center gap-4">
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
  );
}
