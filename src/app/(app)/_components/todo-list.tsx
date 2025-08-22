'use client';

import AlertDeleteList from '@/components/alert-delete-list';
import EditListForm from '@/components/list/edit-list-form';
import { useFiltersContext } from '@/components/providers/filters-context-provider';
import { useListsContext } from '@/components/providers/list-context-provider';
import { useTodosContext } from '@/components/providers/note-context-provider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Todo } from '@prisma/client';
import { MoreVerticalIcon } from 'lucide-react';
import { useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';
import TodoItem from './todo-item';

export default function TodoList() {
  const { handleIncrementCount, handleDecrementCount, selectedList, handleDeleteList } = useListsContext();
  const { todos, handleDeleteTodo, handleEditTodo } = useTodosContext();
  const { searchQuery, selectedStatuses } = useFiltersContext();
  const [, startTransition] = useTransition();

  const [open, setOpen] = useState(false);

  const { activeTodos, completedTodos } = useMemo(() => {
    const active: Todo[] = [];
    const completed: Todo[] = [];

    todos.forEach((todo) => {
      const matchesQuery = todo.todo.toLowerCase().includes(searchQuery.toLowerCase().trim());

      const todoStatuses: string[] = [];
      if (todo.isComplete) {
        todoStatuses.push('completed');
      } else {
        todoStatuses.push('active');
      }
      if (todo.isImportant) {
        todoStatuses.push('important');
      }

      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.some((status) => todoStatuses.includes(status));

      if (matchesQuery && matchesStatus) {
        if (todo.isComplete) {
          completed.push(todo);
        } else {
          active.push(todo);
        }
      }
    });

    return { activeTodos: active, completedTodos: completed };
  }, [todos, searchQuery, selectedStatuses]);

  async function handleToggleField(id: string, todo: Todo, field: 'isComplete' | 'isImportant') {
    startTransition(async () => {
      try {
        const updatedValue = !todo[field];
        await handleEditTodo(id, { ...todo, [field]: updatedValue });
        if (field === 'isComplete') {
          toast.success(todo.isComplete ? 'Task marked uncompleted' : 'Task completed', {
            action: {
              label: 'Undo',

              onClick: () => {
                startTransition(async () => {
                  await handleEditTodo(id, { ...todo, [field]: !updatedValue });
                  toast.dismiss();
                });
              },
            },
            classNames: {
              actionButton: '!bg-transparent !text-blue-500',
            },
          });
        }
      } catch (error) {
        const e = error as Error;
        toast.error(e.message || 'Failed to edit todo');
      }
    });
  }

  async function handleDelete(id: string) {
    startTransition(async () => {
      handleDecrementCount();
      try {
        await handleDeleteTodo(id);
        toast.success('Task deleted');
      } catch (error) {
        handleIncrementCount();
        const e = error as Error;
        toast.error(e.message || 'Failed to delete todo');
      }
    });
  }

  async function onDeleteList(id: string) {
    setOpen(false);
    startTransition(async () => {
      try {
        await handleDeleteList(id);
        toast.success('List deleted');
      } catch (error) {
        const e = error as Error;
        toast.error(e.message || 'Failed to delete list');
      }
    });
  }

  return (
    <div className="bg-input/50 flex flex-col gap-5 rounded-xl p-5 sm:p-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">{selectedList?.title}</h1>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="blank" className="hover:bg-input/30 size-8">
              <MoreVerticalIcon className="opacity-60" size={16} aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <EditListForm initialValues={selectedList} onFormSubmission={() => setOpen(false)} />
            <DropdownMenuSeparator />
            <AlertDeleteList
              handleDelete={selectedList ? () => onDeleteList(selectedList.id) : undefined}
              isDisabled={selectedList?.isDefault}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ul className="no-scrollbar flex max-h-[calc(100dvh-18rem)] w-full flex-col gap-2 overflow-y-auto">
        {activeTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} handleToggleField={handleToggleField} handleDelete={handleDelete} />
        ))}
      </ul>
      {completedTodos.length > 0 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="bg-background rounded-xl px-4">
            <AccordionTrigger className="">
              <div className="text-base">
                Completed <span className="text-muted-foreground font-mono">({completedTodos.length})</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              {completedTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} handleToggleField={handleToggleField} handleDelete={handleDelete} />
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
