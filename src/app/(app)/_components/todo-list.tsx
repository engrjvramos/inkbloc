'use client';

import { useTodosContext } from '@/components/providers/note-context-provider';

export default function TodoList() {
  const { todos } = useTodosContext();

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
