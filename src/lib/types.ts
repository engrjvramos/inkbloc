import { Todo } from '@prisma/client';

export type ApiResponse = {
  success: boolean;
  message: string;
};

export type TodoEssentials = Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;
