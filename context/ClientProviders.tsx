"use client"
import { FilterProvider } from '@/context/FilterContext';
import { NoteProvider } from '@/context/NoteContext';
import { useFilters } from '@/context/FilterContext';

export default function ClientProviders({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <FilterProvider>
      <NoteProviderWithFilters>
        {children}
      </NoteProviderWithFilters>
    </FilterProvider>
  );
}

function NoteProviderWithFilters({ children }: { children: React.ReactNode }) {
  const { searchFilter } = useFilters();
  
  return (
    <NoteProvider searchFilter={searchFilter}>
      {children}
    </NoteProvider>
  );
}