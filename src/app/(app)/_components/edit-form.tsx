import { useTodosContext } from '@/components/providers/note-context-provider';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { todoSchema, TTodoSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Todo } from '@prisma/client';
import { EditIcon } from 'lucide-react';
import { Dispatch, SetStateAction, startTransition, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type EditFormProps = {
  initialValues: Todo;
  setDropdownOpen: Dispatch<SetStateAction<boolean>>;
};

export default function EditForm({ initialValues, setDropdownOpen }: EditFormProps) {
  const { handleEditTodo } = useTodosContext();

  const form = useForm<TTodoSchema>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      todo: initialValues.todo,
    },
  });

  async function onSubmit(values: TTodoSchema) {
    const prevValue = values;

    startTransition(async () => {
      try {
        await handleEditTodo(initialValues.id, {
          ...values,
          listId: initialValues.listId,
          isComplete: initialValues.isComplete,
          isImportant: initialValues.isImportant,
        });
      } catch (error) {
        const e = error as Error;
        toast.error(e.message || 'Failed to add todo');
        form.setValue('todo', prevValue.todo);
      }
    });

    setDropdownOpen(false);
  }

  useEffect(() => {
    form.reset(initialValues);
  }, [initialValues, form]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <EditIcon size={16} aria-hidden="true" />
          Edit
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="gap-8">
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
          <DialogDescription className="sr-only">Edit todo</DialogDescription>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="todo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your title..." className="h-11" maxLength={100} autoFocus {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end gap-2">
                <DialogClose asChild>
                  <Button type="button" variant={'outline'} className="">
                    Cancel
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="submit" className="">
                    Edit Todo
                  </Button>
                </DialogClose>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
