import { CircleAlertIcon, TrashIcon } from 'lucide-react';

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
  type: 'completed' | 'list';
  handleDelete?: () => Promise<void>;
  isDisabled?: boolean;
};

export default function AlertDeleteList({ type, handleDelete, isDisabled }: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()} disabled={isDisabled}>
          <TrashIcon size={16} aria-hidden="true" />
          Delete {type === 'list' ? 'list' : 'all completed tasks'}
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
            <CircleAlertIcon className="opacity-80" size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {type === 'list' ? 'list?' : 'all completed tasks?'}</AlertDialogTitle>
            <AlertDialogDescription>
              All your {type === 'completed' && 'completed'} tasks will be permanently deleted from this list.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
