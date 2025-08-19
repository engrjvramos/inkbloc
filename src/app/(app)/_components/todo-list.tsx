import { TUserTodos } from '@/server/actions';
import { use } from 'react';

export default function TodoList({ todosPromise }: { todosPromise: Promise<TUserTodos[]> }) {
  const todos = use(todosPromise);
  return (
    <ul className="flex w-full flex-col gap-2">
      {todos.length > 0 &&
        todos.map(({ id, todo }) => (
          <li key={id} className="w-full">
            {todo}
          </li>
        ))}
    </ul>
  );
}
