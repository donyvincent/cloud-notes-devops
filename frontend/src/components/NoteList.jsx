import { useState, useEffect } from "react";
import { getNotes, deleteNote } from "../services/api";

export default function NoteList({ onSelect, refreshKey }) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    getNotes().then(setNotes).catch(console.error);
  }, [refreshKey]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    await deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="flex flex-col gap-2 overflow-y-auto">
      {notes.map((note) => (
        <div
          key={note.id}
          onClick={() => onSelect(note)}
          className="p-4 bg-surface rounded-lg cursor-pointer hover:border hover:border-primary transition-all group"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-white truncate">{note.title}</h3>
              <p className="text-gray-400 text-sm mt-1 line-clamp-2">{note.content}</p>
              {note.tags && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {note.tags.split(",").map((t) => (
                    <span key={t} className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                      {t.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={(e) => handleDelete(e, note.id)}
              className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-lg leading-none"
            >
              ×
            </button>
          </div>
        </div>
      ))}
      {notes.length === 0 && (
        <p className="text-gray-500 text-center py-8">No notes yet. Create one!</p>
      )}
    </div>
  );
}
