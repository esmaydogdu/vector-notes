import { createContext, useContext, useState, useEffect, useRef } from "react";
import { Note, SearchFilter } from "../types";
import { usePathname } from "next/navigation";

interface NoteContextType {
  notes: Note[];
  isLoadingNotes: boolean;
  isLoading: boolean,
  errorNotes: string;
  fetchNotes: () => Promise<void>;
  fetchNoteById: (id: string) => Promise<Note | null>;
  createNote: (noteData: Omit<Note, "id">) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

interface NoteProviderProps {
  children: React.ReactNode;
  searchFilter: SearchFilter;
}

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export const NoteProvider = ({ children, searchFilter }: NoteProviderProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [errorNotes, setErrorNotes] = useState('');
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  // general loader
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const previousPathRef = useRef(pathname);

  const fetchNotes = async () => {
    try {
      setIsLoadingNotes(true);
      const params = new URLSearchParams(searchFilter as Record<string, string>).toString();
      const response = await fetch(`/api/notes?${params}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch notes: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setNotes(data);
      setIsLoadingNotes(false);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setIsLoadingNotes(false);
      setErrorNotes("Failed to fetch notes");
    }
  };

  const fetchNoteById = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/notes?noteId=${id}`);
      if (!response.ok) throw new Error("Failed to fetch note");
      setIsLoading(false);
      return await response.json();
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching note:", error);
    }
  };

  const createNote = async (noteData: Omit<Note, "id">) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteData),
      });
      if (!response.ok) throw new Error("Failed to create note");
      setIsLoading(false);
      await fetchNotes();
    } catch (error) {
      setIsLoading(false);
      console.error("Error creating note:", error);
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error("Failed to update note");
      setIsLoading(false);
      await fetchNotes();
    } catch (error) {
      setIsLoading(false);
      console.error("Error updating note:", error);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete note");
      setIsLoading(false);
      await fetchNotes();
    } catch (error) {
      setIsLoading(false);
      console.error("Error deleting note:", error);
    }
  };

  // Initial labels fetch
  // useEffect(() => {
  //   fetchLabels();
  // }, []);

  // Fetch notes when filters change
  useEffect(() => {
    fetchNotes();
  }, [searchFilter]);

  // Fetch note coming to homepage from another page
  useEffect(() => {
    if (pathname === '/' && previousPathRef.current !== '/') {
      fetchNotes();
    }
    previousPathRef.current = pathname;
  }, [pathname])

  const contextValue: NoteContextType = {
    notes,
    isLoadingNotes,
    isLoading,
    errorNotes,
    fetchNotes,
    fetchNoteById,
    createNote,
    updateNote,
    deleteNote,
  };

  return (
    <NoteContext.Provider value={contextValue}>
      {children}
    </NoteContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error("useNotes must be used within a NoteProvider");
  }
  return context;
};
