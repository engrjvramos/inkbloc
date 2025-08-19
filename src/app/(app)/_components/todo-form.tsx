'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { tryCatch } from '@/hooks/try-catch';
import { todoSchema, TTodoSchema } from '@/lib/schema';
import { createTodo } from '@/server/actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function TodoForm() {
  const [pending, startTransition] = useTransition();

  const form = useForm<TTodoSchema>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      todo: '',
    },
  });

  async function onSubmit(values: TTodoSchema) {
    startTransition(async () => {
      const action = createTodo(values);

      const { data: result, error } = await tryCatch(action);
      if (error) {
        toast.error('An unexpected error occurred. Please try again.');
        return;
      }

      if (result.success) {
        toast.success(result.message);
        form.reset();
      } else if (!result.success) {
        toast.error(result.message);
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

          <div className="flex items-center justify-end gap-2">
            <Button type="submit" className="h-11 text-white" disabled={pending}>
              {pending ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                'Add Todo'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
