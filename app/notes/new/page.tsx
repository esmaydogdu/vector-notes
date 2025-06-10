"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const GROUP_OPTIONS = [
  { value: "random", label: "Random" },
  { value: "language", label: "Language" },
];

export default function NoteAddPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [group, setGroup] = useState("random");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, group }),
      });
      if (!response.ok) throw new Error("Failed to create note");
      router.push("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-6">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8 shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Create New Note</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full h-32 bg-gray-700 border border-gray-600 rounded p-2 text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="group" className="block text-sm font-medium text-gray-300 mb-1">
              Group
            </label>
            <select
              id="group"
              value={group}
              onChange={e => setGroup(e.target.value)}
              className="bg-gray-800 border border-gray-600 text-white rounded px-3 py-2"
            >
              {GROUP_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Create Note"}
          </button>
        </form>
      </div>
    </div>
  );
}
