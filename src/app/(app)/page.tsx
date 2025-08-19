import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import TodoForm from './_components/todo-form';
import TodoList from './_components/todo-list';

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect('/login');

  return (
    <div className="mx-auto max-w-[90rem]">
      <TodoForm />
      <Suspense fallback={<p>Loading...</p>}>
        <TodoList />
      </Suspense>
    </div>
  );
}
