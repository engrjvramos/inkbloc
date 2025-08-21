'use client';

import { TodoEssentials, TUserTodoLists } from '@/lib/types';
import { createTodo, deleteTodo, editTodo } from '@/server/actions';
import { Todo } from '@prisma/client';
import { createContext, ReactNode, useContext, useOptimistic, useState } from 'react';
import { toast } from 'sonner';
import { useListsContext } from './list-context-provider';

type TTodosContext = {
  todos: TUserTodoLists['todos'];
  selectedTodoId: Todo['id'] | null;
  selectedTodo: Todo | undefined;
  todosCount: number;
  handleAddTodo: (newTodo: TodoEssentials) => Promise<void>;
  handleEditTodo: (todoId: Todo['id'], newTodoData: TodoEssentials) => Promise<void>;
  handleDeleteTodo: (id: Todo['id']) => Promise<void>;
  handleChangeSelectedTodoId: (id: Todo['id']) => void;
};

const TodosContext = createContext<TTodosContext | null>(null);

export function TodosContextProvider({ children }: { children: ReactNode }) {
  const { selectedList } = useListsContext();

  const initialTodos = selectedList ? selectedList.todos : [];

  const [optimisticTodos, setOptimisticTodos] = useOptimistic(initialTodos, (state, { action, payload }) => {
    switch (action) {
      case 'add':
        return [{ ...payload, id: Math.random().toString() }, ...state];
      case 'edit':
        return state.map((todo) => (todo.id === payload.id ? { ...todo, ...payload.newTodoData } : todo));
      case 'delete':
        return state.filter((todo) => todo.id !== payload);
      default:
        return state;
    }
  });

  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);

  // derived state
  const selectedTodo = optimisticTodos.find((todo) => todo.id === selectedTodoId);
  const todosCount = optimisticTodos.length;

  const handleAddTodo = async (newTodo: TodoEssentials) => {
    if (!selectedList) return;

    setOptimisticTodos({ action: 'add', payload: newTodo });
    const response = await createTodo({ ...newTodo, listId: selectedList.id });

    if (!response.success) {
      toast.warning(response.message);
    }
  };

  const handleEditTodo = async (todoId: Todo['id'], newTodoData: TodoEssentials) => {
    setOptimisticTodos({ action: 'edit', payload: { id: todoId, newTodoData } });
    const response = await editTodo(todoId, newTodoData);

    if (!response.success) {
      toast.warning(response.message);
    }
  };

  const handleDeleteTodo = async (todoId: Todo['id']) => {
    setOptimisticTodos({ action: 'delete', payload: todoId });
    const response = await deleteTodo(todoId);

    if (!response.success) {
      toast.warning(response.message);
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
        handleEditTodo,
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
