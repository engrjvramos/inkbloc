import 'server-only';

import { Todo, User } from '@prisma/client';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from './auth';
import { prisma } from './db';

export async function checkAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  return session;
}

export async function getTodoById(todoId: Todo['id']) {
  const pet = await prisma.todo.findUnique({
    where: {
      id: todoId,
    },
  });
  return pet;
}

export async function getTodosByUserId(userId: User['id']) {
  const pets = await prisma.todo.findMany({
    where: {
      userId,
    },
  });
  return pets;
}
