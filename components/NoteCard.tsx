import { Note } from "@/types";
import Link from "next/link";

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Link
      href={`/notes/${note.id}`}
      className="flex-1 max-w-[1200px] p-6 border border-gray-700 rounded-lg shadow-md bg-gray-800 hover:bg-gray-700 transition-colors cursor-pointer block"
    >
      <div className="flex flex-col">
        <div className="flex flex-wrap justify-between items-start gap-1 mb-2">
          <h2 className="text-2xl font-semibold text-gray-200">{note.title}</h2>
          {note.score ? (
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-700 rounded-full border border-gray-400">
              <span className="text-xs font-semibold text-gray-300">
                Score: {note.score}
              </span>
            </div>
          ) : null}
        </div>
        <div className="text-gray-400 mt-5 max-h-[4.5rem] overflow-hidden text-ellipsis line-clamp-3">
          {note.description}
        </div>

        <div className="mt-4 space-y-2 text-gray-300 font-bold">
          {new Date(note.createdAt).toLocaleString()}
          {/* 2700 - 1100 = 1600 
          (300 * 5) + (100 * 1) = 1600 */}
        </div>
      </div>
    </Link>
  );
}
