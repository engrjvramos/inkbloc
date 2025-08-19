'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { todoIdSchema, todoSchema, TTodoSchema } from '@/lib/schema';
import { checkAuth, getTodoById } from '@/lib/server-utils';
import { ApiResponse } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

export const signInUser = async (email: string, password: string): Promise<ApiResponse> => {
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return {
      success: true,
      message: 'Login successful!',
    };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message,
    };
  }
};

export const signUpUser = async (email: string, password: string, name: string) => {
  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    return {
      success: true,
      message: 'Please check your email for verification',
    };
  } catch (error) {
    const e = error as Error;
    return {
      success: false,
      message: e.message,
    };
  }
};

export async function getTodos() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user.id || '';

  const data = await prisma.todo.findMany({
    where: {
      userId,
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      todo: true,
      updatedAt: true,
    },
  });

  return data;
}

export async function createTodo(values: TTodoSchema): Promise<ApiResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user.id || '';
    const validation = todoSchema.safeParse(values);

    if (!validation.success) {
      return {
        success: false,
        message: 'Invalid Form Data',
      };
    }

    // Extract tags from validated form data
    const { todo } = validation.data;

    await prisma.todo.create({
      data: {
        todo,
        userId,
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

export type TUserTodos = Awaited<ReturnType<typeof getTodos>>[0];

export async function deleteTodo(id: string): Promise<ApiResponse> {
  const session = await checkAuth();

  const validatedTodoId = todoIdSchema.safeParse(id);
  if (!validatedTodoId.success) {
    return {
      success: false,
      message: 'Invalid todo data.',
    };
  }

  const todo = await getTodoById(validatedTodoId.data);
  if (!todo) {
    return {
      success: false,
      message: 'Todo not found',
    };
  }
  if (todo.userId !== session.user.id) {
    return {
      success: false,
      message: 'Not authorized.',
    };
  }

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
