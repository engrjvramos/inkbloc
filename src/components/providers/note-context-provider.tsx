'use client';

import { TodoEssentials, TUserTodoLists } from '@/lib/types';
import { createTodo, deleteAllTodos, deleteTodo, editTodo, moveTodo } from '@/server/actions';
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
  handleMoveTodo: (todoId: Todo['id'], targetListId: Todo['listId']) => Promise<void>;
  handleDeleteTodo: (id: Todo['id']) => Promise<void>;
  handleDeleteAll: (type: 'completed' | 'active', listId: string) => Promise<void>;
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
      case 'deleteAll': {
        const { type, listId } = payload;

        if (type === 'completed') {
          return state.filter((todo) => !(todo.listId === listId && todo.isComplete));
        }

        if (type === 'active') {
          return state.filter((todo) => !(todo.listId === listId && !todo.isComplete));
        }

        return state;
      }
      case 'rollback':
        return payload;
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
    const prevTodos = optimisticTodos;

    setOptimisticTodos({ action: 'add', payload: newTodo });
    const response = await createTodo({ ...newTodo, listId: selectedList.id });

    if (!response.success) {
      toast.warning(response.message);
      setOptimisticTodos({ action: 'rollback', payload: prevTodos });
    }
  };

  const handleEditTodo = async (todoId: Todo['id'], newTodoData: TodoEssentials) => {
    const prevTodos = optimisticTodos;

    setOptimisticTodos({ action: 'edit', payload: { id: todoId, newTodoData } });
    const response = await editTodo(todoId, newTodoData);

    if (!response.success) {
      toast.warning(response.message);
      setOptimisticTodos({ action: 'rollback', payload: prevTodos });
    }
  };

  const handleMoveTodo = async (todoId: Todo['id'], targetListId: Todo['listId']) => {
    const prevTodos = optimisticTodos;
    setOptimisticTodos({
      action: 'delete',
      payload: todoId,
    });

    const response = await moveTodo(todoId, targetListId);
    if (!response.success) {
      toast.warning(response.message);
      setOptimisticTodos({ action: 'rollback', payload: prevTodos });
    }
  };

  const handleDeleteTodo = async (todoId: Todo['id']) => {
    const prevTodos = optimisticTodos;

    setOptimisticTodos({ action: 'delete', payload: todoId });
    const response = await deleteTodo(todoId);

    if (!response.success) {
      toast.warning(response.message);
      setOptimisticTodos({ action: 'rollback', payload: prevTodos });
    }
    setSelectedTodoId(null);
  };

  const handleDeleteAll = async (type: 'completed' | 'active', listId: string) => {
    const prevTodos = optimisticTodos;

    setOptimisticTodos({ action: 'deleteAll', payload: { type, listId } });

    const response = await deleteAllTodos(type, listId);

    if (!response.success) {
      toast.warning(response.message);

      setOptimisticTodos({ action: 'rollback', payload: prevTodos });
    }
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
        handleMoveTodo,
        handleDeleteTodo,
        handleDeleteAll,
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
