"use client"
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Note } from "@/types";
// import { NoteCard } from "@/components";


export default function NoteAddPage() {
  const [note, setNote] = useState<Partial<Note>>({});
  // const [similarNotes, setSimilarNotes] = useState([] as Note[]);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNote(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
      });
      
      const data = await response.json()
      console.log('>>> data after create', data)
      // setSimilarNotes(data.similarNotes)
      if (!response.ok) throw new Error("Failed to create note??");
      router.push(`/notes/${data.note.id}`);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const handleBack = () => {
    router.push('/');
  };


  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-gray-400 hover:text-white"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to notes
        </button>
        <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
          <div className="flex flex-col mb-6">
            <h4 className="text-lg font-bold">Title:</h4>
            <div className="flex-1 mr-4">
              <input
                type="text"
                name="title"
                value={note.title || ''}
                onChange={handleChange}
                className="text-lg font-bold bg-gray-700 border border-gray-600 rounded px-2 py-1 w-full"
              />
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description:</h3>
            <textarea
              name="description"
              value={note.description || ''}
              onChange={handleChange}
              className="w-full h-48 bg-gray-700 border border-gray-600 rounded p-2"
            />
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <div>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-teal-800 hover:bg-teal-700 rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* { similarNotes.length ? (
        <div key="container" className="max-w-4xl mx-auto">
          <h1 key="header">Similar Notes</h1>
          {
            similarNotes.map((note) => (
              <NoteCard note={note} key={note.id} />
            ))
          }
        </div>
      ) : null
      } */}
    </div>
  );
}
