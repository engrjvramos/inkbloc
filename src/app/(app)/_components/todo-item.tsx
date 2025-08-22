import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Todo } from '@prisma/client';
import { GripVerticalIcon, MoreVerticalIcon, StarIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import EditForm from './edit-form';

type Props = {
  todo: Todo;
  handleToggleField: (id: string, todo: Todo, field: 'isComplete' | 'isImportant') => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
};

export default function TodoItem({ todo, handleDelete, handleToggleField }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <li className="bg-background flex w-full items-center justify-between gap-5 rounded-md border px-4 py-2">
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

        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="blank" className="hover:bg-input/30 size-8">
              <MoreVerticalIcon className="opacity-60" size={16} aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <EditForm initialValues={todo} setDropdownOpen={setOpen} />
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
