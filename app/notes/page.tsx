"use client"
import { NoteList, HeaderFilters } from '@/components';

export default function NotesPage() {
  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-200">
      <div className="flex">
        <HeaderFilters /> 

      </div>
      <div className="flex relative">
        <div className="flex-1 bg-gray-800 p-4 border-t-2 border-gray-400">
          <NoteList />
        </div>
      </div>
    </div>
  );
}
