import { useTodosContext } from '@/components/providers/note-context-provider';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
      isComplete: initialValues.isComplete,
      isImportant: initialValues.isImportant,
    },
  });

  async function onSubmit(values: TTodoSchema) {
    const prevValue = values;

    startTransition(async () => {
      try {
        await handleEditTodo(initialValues.id, values);
      } catch (error) {
        const e = error as Error;
        toast.error(e.message || 'Failed to add todo');
        form.setValue('todo', prevValue.todo);
        form.setValue('isComplete', prevValue.isComplete);
        form.setValue('isImportant', prevValue.isImportant);
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
              <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr)))] gap-4">
                <FormField
                  control={form.control}
                  name="isComplete"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FormLabel
                          htmlFor="isComplete"
                          className="hover:bg-input flex h-11 w-full items-center space-x-2 rounded-md border px-4 py-2"
                        >
                          <Checkbox
                            id="isComplete"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="rounded-full"
                          />
                          Mark as complete
                        </FormLabel>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isImportant"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <FormLabel
                          htmlFor="isImportant"
                          className="hover:bg-input flex h-11 w-full items-center space-x-2 rounded-md border px-4 py-2"
                        >
                          <Checkbox
                            id="isImportant"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="rounded-full"
                          />
                          Mark as important
                        </FormLabel>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

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
