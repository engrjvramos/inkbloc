import { StarButton } from '@/components/star-button';
import MoveTodo from '@/components/todo/move-todo';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Todo } from '@prisma/client';
import { MoreVerticalIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import EditForm from './edit-form';

type Props = {
  todo: Todo;
  handleToggleField: (id: string, todo: Todo, field: 'isComplete' | 'isImportant') => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
  handleMoveTask: (currentTodoId: string, targetListId: string) => Promise<void>;
};

export default function TodoItem({ todo, handleDelete, handleToggleField, handleMoveTask }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <li className="bg-background flex w-full items-center justify-between gap-5 rounded-md border px-4 py-2 text-sm sm:text-base">
      <div className="flex w-full items-center gap-4">
        <Checkbox
          className="size-5 rounded-full checked:bg-sky-500"
          checked={todo.isComplete}
          onCheckedChange={() => handleToggleField(todo.id, todo, 'isComplete')}
        />
        <div className="flex flex-col">
          <span className={cn('line-clamp-3 w-full', todo.isComplete && 'line-through opacity-50')}>{todo.todo}</span>
          {todo.isComplete && (
            <span className="text-muted-foreground text-sm">
              Completed:{' '}
              {new Date(todo.updatedAt).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StarButton
          initialStarred={todo.isImportant}
          onStarClick={() => handleToggleField(todo.id, todo, 'isImportant')}
        />

        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="blank" className="hover:bg-input/30 size-8">
              <MoreVerticalIcon className="opacity-60" size={16} aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <EditForm initialValues={todo} setDropdownOpen={setOpen} />
              <MoveTodo todo={todo} handleMoveTask={handleMoveTask} onFormSubmission={() => setOpen(false)} />
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => handleDelete(todo.id)}>
              <TrashIcon size={16} aria-hidden="true" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </li>
  );
}
