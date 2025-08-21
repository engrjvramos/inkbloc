'use server';

import { prisma } from '@/lib/db';
import { todoSchema } from '@/lib/schema';
import { ApiResponse, TodoEssentials } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function createTodo(values: TodoEssentials): Promise<ApiResponse> {
  try {
    const validation = todoSchema.safeParse(values);

    if (!validation.success) {
      return {
        success: false,
        message: 'Invalid Form Data',
      };
    }

    await prisma.todo.create({
      data: {
        ...validation.data,
        list: {
          connect: {
            id: values.listId,
          },
        },
      },
      include: {
        list: {
          include: {
            _count: true,
          },
        },
      },
    });

    revalidatePath('/', 'layout');
    return {
      success: true,
      message: 'Todo created successfully',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Failed to create todo',
    };
  }
}

export async function deleteTodo(id: string): Promise<ApiResponse> {
  try {
    const note = await prisma.todo.findUnique({
      where: { id },
    });

    if (!note) {
      return {
        success: false,
        message: 'Note not found',
      };
    }

    await prisma.todo.delete({
      where: { id },
    });

    revalidatePath('/', 'layout');

    return {
      success: true,
      message: 'Todo deleted successfully',
    };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message || 'Failed to delete todo',
    };
  }
}

export async function editTodo(todoId: string, values: TodoEssentials): Promise<ApiResponse> {
  try {
    const validation = todoSchema.safeParse(values);
    if (!validation.success) {
      return { success: false, message: 'Invalid form data' };
    }

    const { todo, isComplete, isImportant } = validation.data;

    await prisma.todo.update({
      where: { id: todoId },
      data: {
        todo,
        isComplete,
        isImportant,
      },
    });

    revalidatePath('/', 'layout');

    return { success: true, message: 'Todo updated successfully' };
  } catch (error) {
    console.error('Error updating todo:', error);
    return { success: false, message: error instanceof Error ? error.message : 'Failed to update todo' };
  }
}
