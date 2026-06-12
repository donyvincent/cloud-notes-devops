import { useState, useEffect } from "react";
import { createNote, updateNote } from "../services/api";

export default function NoteEditor({ note, onSaved }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
    } else {
      setTitle("");
      setContent("");
      setTags("");
    }
  }, [note]);

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      if (note) {
        await updateNote(note.id, { title, content, tags });
      } else {
        await createNote({ title, content, tags });
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title..."
        className="bg-surface border border-gray-700 rounded-lg px-4 py-2 text-white text-lg font-semibold focus:outline-none focus:border-primary"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your note here... (Markdown supported)"
        className="flex-1 bg-surface border border-gray-700 rounded-lg px-4 py-3 text-gray-200 resize-none focus:outline-none focus:border-primary font-mono text-sm"
      />
      <div className="flex gap-3 items-center">
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma-separated)"
          className="flex-1 bg-surface border border-gray-700 rounded-lg px-3 py-2 text-gray-300 text-sm focus:outline-none focus:border-primary"
        />
        <button
          onClick={handleSave}
          disabled={saving || !title.trim()}
          className="px-5 py-2 bg-primary hover:bg-primary/80 disabled:opacity-50 rounded-lg text-white font-medium transition-colors"
        >
          {saving ? "Saving..." : note ? "Update" : "Create"}
        </button>
      </div>
    </div>
  );
}
