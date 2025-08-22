'use client';

import AlertDeleteList from '@/components/alert-delete-list';
import EditListForm from '@/components/list/edit-list-form';
import { useFiltersContext } from '@/components/providers/filters-context-provider';
import { useListsContext } from '@/components/providers/list-context-provider';
import { useTodosContext } from '@/components/providers/note-context-provider';
import { NoTaskDark, NoTaskLight } from '@/components/svg';
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
import { useTheme } from 'next-themes';
import { useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';
import TodoItem from './todo-item';

export default function TodoList() {
  const { theme } = useTheme();
  const { handleIncrementCount, handleDecrementCount, selectedList, handleDeleteList, handleDecrementCountBy } =
    useListsContext();
  const { todos, handleDeleteTodo, handleEditTodo, handleDeleteAllComplete, handleMoveTodo } = useTodosContext();
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
      } catch (error) {
        const e = error as Error;
        toast.error(e.message || 'Failed to delete list');
      }
    });
  }

  async function onDeleteAllCompleted() {
    setOpen(false);

    startTransition(async () => {
      handleDecrementCountBy(completedTodos.length);
      try {
        await handleDeleteAllComplete();
      } catch (error) {
        const e = error as Error;
        toast.error(e.message || 'Failed to delete completed todos');
      }
    });
  }

  async function moveTask(currentTodoId: string, targetListId: string) {
    startTransition(async () => {
      try {
        await handleMoveTodo(currentTodoId, targetListId);
        toast.success('Task moved');
      } catch (error) {
        const e = error as Error;
        toast.error(e.message || 'Failed to move todo');
      }
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-background rounded-xl border">
        <div className="flex items-center justify-between gap-2 border-b p-4">
          <h1 className="truncate px-4 text-lg">
            {selectedList?.title}
            {activeTodos.length > 0 && (
              <span className="text-muted-foreground ml-2 font-mono">({activeTodos.length})</span>
            )}
          </h1>
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
                type="list"
                handleDelete={selectedList ? () => onDeleteList(selectedList.id) : undefined}
                isDisabled={selectedList?.isDefault}
              />
              <AlertDeleteList
                type="completed"
                handleDelete={selectedList ? onDeleteAllCompleted : undefined}
                isDisabled={completedTodos.length === 0}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <ul className="no-scrollbar flex max-h-[calc(100dvh-18rem)] w-full flex-col gap-1.5 overflow-y-auto p-4">
          {activeTodos.length === 0 ? (
            <div className="my-12 flex flex-col items-center gap-5">
              {theme === 'light' ? <NoTaskLight /> : <NoTaskDark />}
              <div className="ext-balance max-w-xs space-y-2 text-center">
                <p className="text-xl">No tasks yet</p>
                <p className="text-muted-foreground">
                  You have no tasks in your list. Add new tasks to stay organized and productive.
                </p>
              </div>
            </div>
          ) : (
            <>
              {activeTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  handleToggleField={handleToggleField}
                  handleDelete={handleDelete}
                  handleMoveTask={moveTask}
                />
              ))}
            </>
          )}
        </ul>
      </div>
      {completedTodos.length > 0 && (
        <Accordion type="single" collapsible className="w-full rounded-xl border">
          <AccordionItem value="item-1" className="bg-background rounded-xl">
            <AccordionTrigger className="rounded-xl px-4">
              <div className="flex w-full items-center justify-between text-base">
                <div>
                  Completed <span className="text-muted-foreground font-mono">({completedTodos.length})</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-1.5 p-4 text-balance">
              {completedTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  handleToggleField={handleToggleField}
                  handleDelete={handleDelete}
                  handleMoveTask={moveTask}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
