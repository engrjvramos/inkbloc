'use client';

import { createContext, useContext, useState } from 'react';

type FiltersContextProvider = {
  children: React.ReactNode;
};

type TFiltersContext = {
  searchQuery: string;
  handleChangeSearchQuery: (newValue: string) => void;
  selectedStatuses: string[];
  handleToggleStatus: (status: string) => void;
};

export const FiltersContext = createContext<TFiltersContext | null>(null);

export default function FiltersContextProvider({ children }: FiltersContextProvider) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const handleChangeSearchQuery = (newValue: string) => {
    setSearchQuery(newValue);
  };

  const handleToggleStatus = (status: string) => {
    setSelectedStatuses((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]));
  };

  return (
    <FiltersContext.Provider
      value={{
        searchQuery,
        handleChangeSearchQuery,
        selectedStatuses,
        handleToggleStatus,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export function useFiltersContext() {
  const context = useContext(FiltersContext);

  if (!context) {
    throw new Error('useFiltersContext must be used within a FiltersContextProvider');
  }

  return context;
}
