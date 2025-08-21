import { getTodoLists } from '@/server/list-actions';
import { List, Todo } from '@prisma/client';

export type ApiResponse = {
  success: boolean;
  message: string;
};

export type TodoEssentials = Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;

export type TListEssentials = Omit<List, 'id' | 'createdAt' | 'updatedAt' | '_count' | 'todos'>;

export type TUserTodoLists = Awaited<ReturnType<typeof getTodoLists>>[0];
