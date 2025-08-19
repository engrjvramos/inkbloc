'use client';

import { TodoEssentials } from '@/lib/types';
import { createTodo, deleteTodo } from '@/server/actions';
import { Todo } from '@prisma/client';
import { createContext, useContext, useOptimistic, useState } from 'react';
import { toast } from 'sonner';

type TTodosContext = {
  todos: Todo[];
  selectedTodoId: Todo['id'] | null;
  selectedTodo: Todo | undefined;
  todosCount: number;
  handleAddTodo: (newTodo: TodoEssentials) => Promise<void>;
  handleDeleteTodo: (id: Todo['id']) => Promise<void>;
  handleChangeSelectedTodoId: (id: Todo['id']) => void;
};

const TodosContext = createContext<TTodosContext | null>(null);

type TodosProviderProps = {
  data: Todo[];
  children: React.ReactNode;
};

export function TodosContextProvider({ children, data }: TodosProviderProps) {
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(data, (state, { action, payload }) => {
    switch (action) {
      case 'add':
        return [...state, { ...payload, id: Math.random().toString() }];
      case 'delete':
        return state.filter((todo) => todo.id !== payload);
      default:
        return state;
    }
  });

  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);

  // derived state
  const selectedTodo = optimisticTodos.find((todo: Todo) => todo.id === selectedTodoId);
  const todosCount = optimisticTodos.length;

  const handleAddTodo = async (newTodo: TodoEssentials) => {
    setOptimisticTodos({ action: 'add', payload: newTodo });
    const response = await createTodo(newTodo);

    if (!response.success) {
      toast.warning(response.message);
      return;
    }
  };

  const handleDeleteTodo = async (todoId: Todo['id']) => {
    setOptimisticTodos({ action: 'delete', payload: todoId });
    const error = await deleteTodo(todoId);
    if (error) {
      toast.warning(error.message);
      return;
    }
    setSelectedTodoId(null);
  };

  const handleChangeSelectedTodoId = (id: Todo['id']) => {
    setSelectedTodoId(id);
  };

  return (
    <TodosContext.Provider
      value={{
        todos: optimisticTodos,
        selectedTodoId,
        selectedTodo,
        todosCount,
        handleAddTodo,
        handleDeleteTodo,
        handleChangeSelectedTodoId,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
}

export function useTodosContext() {
  const context = useContext(TodosContext);
  if (!context) {
    throw new Error('useTodosContext must be used within a TodosProvider');
  }
  return context;
}
