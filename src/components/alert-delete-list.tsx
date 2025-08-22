import { CircleAlertIcon, CircleCheckBigIcon, CircleIcon, TrashIcon } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { DropdownMenuItem } from './ui/dropdown-menu';

type Props = {
  type: 'completed' | 'active' | 'list';
  handleDelete?: () => Promise<void>;
  isDisabled?: boolean;
};

export default function AlertDeleteList({ type, handleDelete, isDisabled }: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{renderButton({ type, isDisabled })}</AlertDialogTrigger>
      <AlertDialogContent>
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
            <CircleAlertIcon className="opacity-80" size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {type === 'list' ? 'list?' : type === 'active' ? 'all active tasks?' : 'all completed tasks?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              All your {type === 'completed' ? 'completed' : type === 'active' ? 'active' : undefined} tasks will be
              permanently deleted from this list.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive/60 hover:bg-destructive/80 text-white">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

type renderButtonProps = {
  type: 'completed' | 'active' | 'list';
  isDisabled?: boolean;
};
function renderButton({ isDisabled, type }: renderButtonProps) {
  if (type === 'list') {
    return (
      <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()} disabled={isDisabled}>
        <TrashIcon size={16} aria-hidden="true" />
        Delete list
      </DropdownMenuItem>
    );
  }

  if (type === 'active') {
    return (
      <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()} disabled={isDisabled}>
        <CircleIcon size={16} aria-hidden="true" />
        Active tasks
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()} disabled={isDisabled}>
      <CircleCheckBigIcon size={16} aria-hidden="true" />
      Completed tasks
    </DropdownMenuItem>
  );
}
