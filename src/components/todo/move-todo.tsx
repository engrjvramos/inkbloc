import { Todo } from '@prisma/client';
import { FolderUpIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useListsContext } from '../providers/list-context-provider';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type Props = {
  todo: Todo;
  handleMoveTask: (currentTodoId: string, targetListId: string) => Promise<void>;
  onFormSubmission: () => void;
};

export default function MoveTodo({ todo, handleMoveTask, onFormSubmission }: Props) {
  const { lists } = useListsContext();
  const [open, setOpen] = useState(false);
  const [targetListId, setTargetListId] = useState(todo.listId);

  useEffect(() => {
    setTargetListId(todo.listId);
  }, [todo.listId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <FolderUpIcon size={16} aria-hidden="true" />
          Move To
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="gap-8">
        <DialogHeader>
          <DialogTitle>Move Task</DialogTitle>
          <DialogDescription>Move your task to a different list</DialogDescription>
        </DialogHeader>
        <div>
          <Label className="mb-2">Select Target List</Label>
          <Select value={targetListId} onValueChange={setTargetListId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select List" />
            </SelectTrigger>
            <SelectContent>
              {lists.map(({ id, title }) => (
                <SelectItem key={id} value={id}>
                  {title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="mt-5 flex items-center justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant={'outline'}>
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                type="button"
                className=""
                onClick={() => {
                  onFormSubmission();
                  handleMoveTask(todo.id, targetListId);
                }}
              >
                Move Task
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
