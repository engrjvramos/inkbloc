import { listSchema, TListSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon } from 'lucide-react';
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

export default function AddListForm() {
  const [open, setOpen] = useState(false);
  const { handleAddList } = useListsContext();

  const form = useForm<TListSchema>({
    resolver: zodResolver(listSchema),
    defaultValues: {
      title: '',
    },
  });

  async function onSubmit(values: TListSchema) {
    if (!values) return;
    const prevValue = values;
    form.reset();
    setOpen(false);

    startTransition(async () => {
      try {
        await handleAddList(values.title);
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
        <Button variant={'ghost'} className="rounded-none outline-none focus-within:ring-0">
          <PlusIcon size={16} aria-hidden="true" />
          Add List
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-8">
        <DialogHeader>
          <DialogTitle>Add List</DialogTitle>
          <DialogDescription className="sr-only">Add List</DialogDescription>
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
                        autoFocus
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end gap-2">
                <DialogClose asChild>
                  <Button type="button" variant={'outline'} className="" onClick={() => form.reset()}>
                    Cancel
                  </Button>
                </DialogClose>

                <Button type="submit" className="">
                  Add List
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
