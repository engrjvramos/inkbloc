'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { ApiResponse } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

export async function getTodoLists() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user.id || '';

  const data = await prisma.list.findMany({
    where: {
      userId,
    },
    include: {
      todos: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      _count: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  return data;
}

export async function createList(title: string): Promise<ApiResponse> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    await prisma.list.create({
      data: {
        title,
        userId: session.user.id,
        isDefault: false,
      },
    });
    revalidatePath('/', 'layout');
    return { success: true, message: 'List created successfully' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to create list' };
  }
}

export async function editList(listId: string, newData: { title?: string }): Promise<ApiResponse> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const existing = await prisma.list.findUnique({
      where: { id: listId },
      select: { userId: true },
    });

    if (!existing || existing.userId !== session.user.id) {
      return { success: false, message: 'Not allowed' };
    }

    await prisma.list.update({
      where: { id: listId },
      data: { ...newData, updatedAt: new Date() },
    });

    revalidatePath('/', 'layout');

    return { success: true, message: 'List updated successfully' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to update list' };
  }
}

export async function deleteList(listId: string): Promise<ApiResponse> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, message: 'Unauthorized' };
  }

  try {
    const existing = await prisma.list.findUnique({
      where: { id: listId },
      select: { userId: true, isDefault: true },
    });

    if (!existing || existing.userId !== session.user.id) {
      return { success: false, message: 'Not allowed' };
    }

    if (existing.isDefault) {
      return {
        success: false,
        message: 'Default list cannot be deleted',
      };
    }

    await prisma.list.delete({
      where: { id: listId },
    });

    revalidatePath('/', 'layout');

    return { success: true, message: 'List deleted successfully' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Failed to delete list' };
  }
}
