import { listSchema, TListSchema } from '@/lib/schema';
import { TUserTodoLists } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { EditIcon } from 'lucide-react';
import { startTransition, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

type Props = {
  initialValues?: TUserTodoLists;
  onFormSubmission: () => void;
};

export default function EditListForm({ initialValues, onFormSubmission }: Props) {
  const [open, setOpen] = useState(false);
  const { handleEditList } = useListsContext();

  const form = useForm<TListSchema>({
    resolver: zodResolver(listSchema),
    defaultValues: {
      title: initialValues?.title,
    },
  });

  async function onSubmit(values: TListSchema) {
    if (!values || !initialValues) return;
    const prevValue = values;
    setOpen(false);
    onFormSubmission();

    startTransition(async () => {
      try {
        await handleEditList(initialValues.id, values);
      } catch (error) {
        const e = error as Error;
        toast.error(e.message || 'Failed to add todo');
        form.setValue('title', prevValue.title);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <EditIcon size={16} aria-hidden="true" />
          Rename list
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="gap-8">
        <DialogHeader>
          <DialogTitle>Rename List</DialogTitle>
          <DialogDescription className="sr-only">Rename List</DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your list title..."
                        className="h-11"
                        maxLength={100}
                        autoFocus={false}
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end gap-2">
                <DialogClose asChild>
                  <Button type="button" variant={'outline'} onClick={() => form.reset()}>
                    Cancel
                  </Button>
                </DialogClose>

                <Button type="submit" className="">
                  Rename
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
