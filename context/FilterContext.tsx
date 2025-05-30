"use client"
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchFilter } from "@/types";

interface FilterContextType {
  searchFilter: SearchFilter;
  setSearchFilter: (filter: SearchFilter) => void;
  updateSearchFilter: (updatedFields: Partial<SearchFilter>) => void;
}

interface FilterProviderProps {
  children: React.ReactNode;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: FilterProviderProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchFilter, setSearchFilter] = useState<SearchFilter>({
    query: searchParams.get('query') || '',
    // TODO
    // sort: searchParams.get('sort') || 'date_desc'
  });

  const updateSearchFilter = (updatedFields: Partial<SearchFilter>) => {
    setSearchFilter((prevState) => {
      const newFilter = { ...prevState, ...updatedFields };
      
      if (JSON.stringify(prevState) === JSON.stringify(newFilter)) {
        return prevState;
      }
      return newFilter;
    });
  };

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(searchFilter).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`?${params.toString()}`);
  }, [searchFilter, router]);

  return (
    <FilterContext.Provider value={{ searchFilter, setSearchFilter, updateSearchFilter }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
};
