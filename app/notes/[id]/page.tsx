"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Note } from '@/types';
import { use } from 'react';
import { Loader, Modal, NoteCard } from '@/components';

const GROUP_OPTIONS = [
  { value: "random", label: "Random" },
  { value: "language", label: "Language" },
];

export default function NoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unpackedParams = use(params);
  const id = unpackedParams.id;
  const [note, setNote] = useState<Note | null>(null);
  const [group, setGroup]= useState('random');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState<Partial<Note>>({});
  const [similarNotes, setSimilarNotes] = useState([] as Note[]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [hash, setHash] = useState(false);
  const [symmetricColor, setSymmetricColor] = useState(false);
  const router = useRouter();

  useEffect(() => {

    const fetchNote = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/notes?noteId=${id}`);
        if (!response.ok) throw new Error('Error fetching note');
        const data = await response.json();
        setGroup(data.note.group)
        setHash(data.note.hash)
        setSymmetricColor(data.note.symmetricColor)
        setNote(data.note);
        setEditedNote(data.note);
        setSimilarNotes(data.similarNotes);
      } catch (error) {
        console.error('Error fetching note:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleBack = () => {
    router.push('/');
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditedNote(note || {});
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedNote(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/notes?noteId=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedNote),
      });

      if (!response.ok) throw new Error('Failed to update note');

      // const updatedNote = await response.json();
      if (note) {
        setNote({ ...note, ...editedNote });
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/notes?noteId=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete note');
      router.push('/');
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  if (isLoading) {
    return (
      <Loader isLinear={true} />
    );
  }

  return (
    <div
      className="min-h-screen text-gray-200 p-6"
      style={note?.hash ? { backgroundColor: `#${note.hash.slice(0, 6)}` } : {}}
    >
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

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete this note"
          footer={
            <>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  handleDelete();
                }}
                className="px-4 py-2 bg-red-800 hover:bg-red-700 rounded-md mr-2"
              >
                Delete
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md"
              >
                Cancel
              </button>
            </>
          }
        >
          <p className="text-white">Are you sure you want to delete this note?</p>
        </Modal>

        {!note ?
          <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
            <h1 className="text-2xl font-bold text-red-400">Note not found</h1>
            <p className="mt-4">The note you are looking for does not exist or has been deleted.</p>
          </div>
          :
          //  note exists
          <div>
            <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1 mr-4">
                  {isEditing ? (
                    <input
                      type="text"
                      name="title"
                      value={editedNote.title || ''}
                      onChange={handleChange}
                      className="text-lg font-bold font-bold bg-gray-700 border border-gray-600 rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <h1 className="text-xl font-bold">{note.title}</h1>
                  )}
                  <p className="text-gray-400 text-sm mt-2">Created: {new Date(note.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <button
                    onClick={toggleEditMode}
                    className={` ${isEditing ? 'bg-red-800 hover:bg-red-700' : 'bg-emerald-800 hover:bg-emerald-700'} px-4 py-2 rounded-md mr-2`}
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                  {!isEditing && <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="bg-red-800 hover:bg-red-700 px-4 py-2 rounded-md mr-2"
                  >
                    Delete
                  </button>}

                  {isEditing && (
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-teal-800 hover:bg-teal-700 rounded-md"
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
              <div className="mb-6 flex items-baseline">
                <h3 className="text-lg font-semibold">From:</h3>
                <span className="text-gray-300 pl-1">{note.customer}</span>
              </div>
              <div className="text-white">{group}</div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                {isEditing ? (
                  <textarea
                    name="description"
                    value={editedNote.description || ''}
                    onChange={handleChange}
                    className="w-full h-48 bg-gray-700 border border-gray-600 rounded p-2"
                  />
                ) : (
                  <p className="text-gray-300">{note.description || 'No description provided.'}</p>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="group" className="block text-sm font-medium text-gray-300 mb-1">
                  Group
                </label>
                <select
                  id="group"
                  value={editedNote.group || "random"}
                  onChange={e => setEditedNote({ ...editedNote, group: e.target.value })}
                  className="bg-gray-800 border border-gray-600 text-white rounded px-3 py-2"
                  disabled={!isEditing}
                >
                  {GROUP_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            { similarNotes.length > 0 && (
              <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-3 mt-10">Similar Notes</h1>
                <div className="flex flex-wrap flex-row gap-4">
                  {
                    similarNotes.map((note) => (
                      <NoteCard note={note} key={note.id} />
                    ))
                  }
                </div>
              </div>
              ) 
            }
          </div>
        }
      </div>
    </div>
  );
}
