'use client';

import { TUserTodoLists } from '@/lib/types';
import { createList, deleteList, editList } from '@/server/list-actions';
import { createContext, useContext, useEffect, useOptimistic, useState } from 'react';
import { toast } from 'sonner';

type TListsContext = {
  lists: TUserTodoLists[];
  selectedListId: string | null;
  selectedList: TUserTodoLists | undefined;
  listsCount: number;

  handleAddList: (title: string) => Promise<void>;
  handleEditList: (listId: string, newListData: Partial<TUserTodoLists>) => Promise<void>;
  handleDeleteList: (listId: string) => Promise<void>;
  handleChangeSelectedListId: (id: string) => void;
  handleIncrementCount: () => Promise<void>;
  handleDecrementCount: () => Promise<void>;
  handleDecrementCountBy: (amount: number) => void;
};

const ListsContext = createContext<TListsContext | null>(null);

type ListsProviderProps = {
  data: TUserTodoLists[];
  children: React.ReactNode;
};

export function ListsContextProvider({ children, data }: ListsProviderProps) {
  const [optimisticLists, setOptimisticLists] = useOptimistic(data, (state, { action, payload }) => {
    switch (action) {
      case 'add':
        return [
          ...state,
          {
            ...payload,
            id: Math.random().toString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            todos: [],
            _count: { todos: 0 },
          },
        ];
      case 'edit':
        return state.map((list) =>
          list.id === payload.id ? { ...list, ...payload.newListData, updatedAt: new Date().toISOString() } : list,
        );
      case 'delete':
        return state.filter((list) => list.id !== payload);
      case 'incrementCount':
        return state.map((list) =>
          list.id === payload.listId
            ? {
                ...list,
                _count: {
                  ...list._count,
                  todos: list._count.todos + 1,
                },
              }
            : list,
        );
      case 'decrementCount':
        return state.map((list) =>
          list.id === payload.listId
            ? {
                ...list,
                _count: {
                  ...list._count,
                  todos: Math.max(0, list._count.todos - 1),
                },
              }
            : list,
        );
      case 'decrementCountBy':
        return state.map((list) =>
          list.id === payload.listId
            ? {
                ...list,
                _count: {
                  ...list._count,
                  todos: Math.max(0, list._count.todos - payload.amount),
                },
              }
            : list,
        );
      case 'replaceId':
        return state.map((list) => (list.id === payload.tempId ? { ...list, id: payload.realId } : list));
      default:
        return state;
    }
  });

  const [selectedListId, setSelectedListId] = useState<string | null>(
    () => optimisticLists.find((list) => list.isDefault)?.id ?? null,
  );

  // derived state
  const selectedList = optimisticLists.find((list) => list.id === selectedListId);
  const listsCount = optimisticLists.length;

  const handleAddList = async (title: string) => {
    const tempId = crypto.randomUUID();

    setOptimisticLists({
      action: 'add',
      payload: { id: tempId, title },
    });
    setSelectedListId(tempId);

    const response = await createList(title);

    if (!response.success || !response.data) {
      setOptimisticLists({ action: 'delete', payload: { id: tempId } });
      toast.warning(response.message);
      return;
    }

    setOptimisticLists({
      action: 'replaceId',
      payload: { tempId, realId: response.data.id },
    });
    setSelectedListId(response.data.id);
  };

  const handleEditList = async (listId: string, newListData: Partial<TUserTodoLists>) => {
    setOptimisticLists({ action: 'edit', payload: { id: listId, newListData } });
    const response = await editList(listId, newListData);

    if (!response.success) {
      toast.warning(response.message);
      return;
    }
  };

  const handleDeleteList = async (listId: string) => {
    const defaultList = data.find((list) => list.isDefault);
    if (listId === defaultList?.id) {
      toast.error('Default list cannot be deleted');
      return;
    }
    setOptimisticLists({ action: 'delete', payload: listId });
    const response = await deleteList(listId);

    if (!response.success) {
      toast.warning(response.message);
      return;
    }

    if (selectedListId === listId) {
      setSelectedListId(null);
    }

    toast.success('List deleted');
  };

  const handleIncrementCount = async () => {
    setOptimisticLists({ action: 'incrementCount', payload: { listId: selectedListId } });
  };

  const handleDecrementCount = async () => {
    setOptimisticLists({ action: 'decrementCount', payload: { listId: selectedListId } });
  };

  const handleDecrementCountBy = (amount: number) => {
    setOptimisticLists({
      action: 'decrementCountBy',
      payload: { listId: selectedListId, amount },
    });
  };

  const handleChangeSelectedListId = (id: string) => {
    setSelectedListId(id);
  };

  useEffect(() => {
    if (!selectedListId && data.length > 0) {
      const defaultList = data.find((list) => list.isDefault);
      if (defaultList) {
        setSelectedListId(defaultList.id);
      }
    }
  }, [selectedListId, data]);

  return (
    <ListsContext.Provider
      value={{
        lists: optimisticLists,
        selectedListId,
        selectedList,
        listsCount,
        handleAddList,
        handleEditList,
        handleDeleteList,
        handleChangeSelectedListId,
        handleIncrementCount,
        handleDecrementCount,
        handleDecrementCountBy,
      }}
    >
      {children}
    </ListsContext.Provider>
  );
}

export function useListsContext() {
  const context = useContext(ListsContext);
  if (!context) {
    throw new Error('useListsContext must be used within a ListsProvider');
  }
  return context;
}
