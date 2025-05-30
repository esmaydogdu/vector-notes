"use client"
import { useNotes } from "../context/NoteContext";
import { NoteCard } from "./NoteCard";
import { Loader } from "@/components/atoms/Loader";

export function NoteList() {
  const { notes, isLoadingNotes, errorNotes } = useNotes();

  return (
    <div className="h-[calc(100vh-138px)] md:h-[calc(100vh-138px)] lg:h-[calc(100vh-92px)] overflow-hidden flex flex-col">
      <div className="overflow-y-auto flex-1 px-4 py-4 sm:px-6 md:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-4 pb-6">
          {
            errorNotes ? (<p key="error" className="text-red-500">{errorNotes}</p>) 
            : isLoadingNotes ? (<div key="loading" className="flex justify-center py-10"><Loader isLinear={true}/></div>)
            : notes.length ? notes.map((note) => (
              <NoteCard key={note.id} note={note} />
            )) : (<p key="no-notes" className="text-gray-400 text-center py-10">No notes found</p>)
          }
        </div>
      </div>
    </div>
  );
}
