import { MoreVerticalIcon, TrashIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Todo } from '@prisma/client';
import { useState } from 'react';
import EditForm from './edit-form';

type Props = {
  todo: Todo;
  onDelete: () => Promise<void>;
};

export default function DropdownActions({ todo, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="blank" className="hover:bg-input/30 size-8">
          <MoreVerticalIcon className="opacity-60" size={16} aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <EditForm initialValues={todo} setDropdownOpen={setOpen} />
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onDelete}>
          <TrashIcon size={16} aria-hidden="true" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
