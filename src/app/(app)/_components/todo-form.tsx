'use client';

import { useListsContext } from '@/components/providers/list-context-provider';
import { useTodosContext } from '@/components/providers/note-context-provider';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { todoSchema, TTodoSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function TodoForm() {
  const { selectedListId, handleIncrementCount, handleDecrementCount } = useListsContext();
  const { handleAddTodo } = useTodosContext();
  const [, startTransition] = useTransition();

  const form = useForm<TTodoSchema>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      todo: '',
    },
  });

  async function onSubmit(values: TTodoSchema) {
    if (!values.todo || !selectedListId) return;
    const prevValue = values.todo;
    form.reset();

    startTransition(async () => {
      handleIncrementCount();

      try {
        await handleAddTodo({
          ...values,
          isComplete: false,
          isImportant: false,
          listId: selectedListId,
        });
      } catch (error) {
        handleDecrementCount();
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
                  <Input placeholder="Type a todo..." className="h-11" maxLength={250} autoFocus {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
