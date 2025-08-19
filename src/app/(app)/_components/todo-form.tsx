'use client';

import { useTodosContext } from '@/components/providers/note-context-provider';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { todoSchema, TTodoSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function TodoForm() {
  const { handleAddTodo } = useTodosContext();
  const [, startTransition] = useTransition();

  const form = useForm<TTodoSchema>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      todo: '',
    },
  });

  async function onSubmit(values: TTodoSchema) {
    const prevValue = values.todo;
    form.reset();

    startTransition(async () => {
      try {
        await handleAddTodo(values);
      } catch (error) {
        const e = error as Error;
        toast.error(e.message || 'Failed to add todo');
        form.setValue('todo', prevValue);
      }
    });
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="todo"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Enter your title..." className="h-11" maxLength={100} autoFocus {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* <div className="flex items-center justify-end gap-2">
            <Button type="submit" className="h-11 text-white" disabled={pending}>
              Add Todo
            </Button>
          </div> */}
        </form>
      </Form>
    </div>
  );
}
