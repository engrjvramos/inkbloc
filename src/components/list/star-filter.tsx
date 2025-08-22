import { useMemo } from 'react';
import { useTodosContext } from '../providers/note-context-provider';
import { useSearchContext } from '../providers/search-context-provider';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectTrigger, SelectValue } from '../ui/select';

const STATUS_OPTIONS = ['important', 'not_important'] as const;

export default function StarFilter() {
  const { todos } = useTodosContext();
  const { selectedStatuses, handleToggleStatus } = useSearchContext();

  const statusCounts = useMemo(() => {
    return todos.reduce(
      (acc, todo) => {
        if (todo.isImportant) {
          acc.important += 1;
        } else {
          acc.not_important += 1;
        }

        return acc;
      },
      { important: 0, not_important: 0 },
    );
  }, [todos]);

  return (
    <div className="">
      <Label className="sr-only">Select Status</Label>
      <Select>
        <SelectTrigger className="bg-background dark:bg-background dark:hover:bg-background hover:text-foreground dark:hover:text-foreground border-none">
          <SelectValue placeholder="Filter" />
        </SelectTrigger>
        <SelectContent align="end" className="min-w-[12rem]">
          {STATUS_OPTIONS.map((status) => (
            <div
              key={status}
              className="hover:bg-accent flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1"
              onClick={() => handleToggleStatus(status)}
            >
              <Checkbox
                checked={selectedStatuses.includes(status)}
                onCheckedChange={() => handleToggleStatus(status)}
                onClick={(e) => e.stopPropagation()}
              />
              <span className="text-sm capitalize">{status === 'not_important' ? 'Not important' : status}</span>
              <span className="text-muted-foreground ml-auto inline-block font-mono text-sm">
                {statusCounts[status]}
              </span>
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
