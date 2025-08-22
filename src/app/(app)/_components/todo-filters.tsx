'use client';

import { useSearchContext } from '@/components/providers/search-context-provider';
import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';

export default function TodoFilters() {
  const { searchQuery, handleChangeSearchQuery } = useSearchContext();

  return (
    <div className="order-1 flex w-full items-center sm:order-2 sm:max-w-xs">
      <form className="h-full w-full">
        <div className="relative">
          <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 size-5 -translate-y-1/2" />
          <Input
            className="h-10 pl-10"
            placeholder="Search tasks..."
            type="search"
            value={searchQuery}
            onChange={(e) => handleChangeSearchQuery(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
}
