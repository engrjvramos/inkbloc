import { useFiltersContext } from '@/components/providers/filters-context-provider';
import { useTodosContext } from '@/components/providers/note-context-provider';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchIcon } from 'lucide-react';
import { useMemo } from 'react';

const STATUS_OPTIONS = ['active', 'completed', 'important'] as const;

export default function TodoFilters() {
  const { todos } = useTodosContext();
  const { searchQuery, handleChangeSearchQuery, handleToggleStatus, selectedStatuses } = useFiltersContext();

  const statusCounts = useMemo(() => {
    return todos.reduce(
      (acc, todo) => {
        if (todo.isComplete) {
          acc.completed += 1;
        } else {
          acc.active += 1;
        }

        if (todo.isImportant) {
          acc.important += 1;
        }

        return acc;
      },
      { active: 0, completed: 0, important: 0 },
    );
  }, [todos]);

  return (
    <div className="flex w-full items-center justify-between">
      <form className="h-full w-full">
        <div className="relative">
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-5 -translate-y-1/2" />
          <Input
            className="h-10 max-w-lg pl-10"
            placeholder="Search todos..."
            type="search"
            value={searchQuery}
            onChange={(e) => handleChangeSearchQuery(e.target.value)}
          />
        </div>
      </form>

      <div className="">
        <Label className="sr-only">Select Status</Label>
        <Select>
          <SelectTrigger className="dark:bg-input/30 h-10 min-w-[10rem] bg-white whitespace-nowrap">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
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
                <span className="text-sm capitalize">{status}</span>
                <span className="text-muted-foreground ml-auto inline-block font-mono text-sm">
                  {statusCounts[status]}
                </span>
              </div>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
