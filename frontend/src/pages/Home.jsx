import { useState } from "react";
import NoteList from "../components/NoteList";
import NoteEditor from "../components/NoteEditor";
import VoiceInput from "../components/VoiceInput";
import DebateMode from "../components/DebateMode";

const TABS = ["Editor", "Voice Input", "Debate Mode"];

export default function Home() {
  const [selectedNote, setSelectedNote] = useState(null);
  const [activeTab, setActiveTab] = useState("Editor");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleNoteReady = (noteData) => {
    setSelectedNote({ id: null, ...noteData });
    setActiveTab("Editor");
  };

  const handleSaved = () => {
    setSelectedNote(null);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <aside className="w-72 border-r border-gray-700 p-4 flex flex-col gap-4 bg-base overflow-hidden">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-gray-300">Notes</h2>
          <button
            onClick={() => { setSelectedNote(null); setActiveTab("Editor"); }}
            className="text-sm px-3 py-1 bg-primary/20 hover:bg-primary/40 text-primary rounded-lg transition-colors"
          >
            + New
          </button>
        </div>
        <NoteList onSelect={setSelectedNote} refreshKey={refreshKey} />
      </aside>

      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="flex gap-1 mb-6 bg-surface rounded-lg p-1 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-primary text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === "Editor" && (
            <NoteEditor note={selectedNote} onSaved={handleSaved} />
          )}
          {activeTab === "Voice Input" && (
            <VoiceInput onNoteReady={handleNoteReady} />
          )}
          {activeTab === "Debate Mode" && (
            <DebateMode note={selectedNote} />
          )}
        </div>
      </main>
    </div>
  );
}
