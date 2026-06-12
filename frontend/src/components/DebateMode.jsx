import { useState } from "react";
import { debateNote } from "../services/api";
import ReactMarkdown from "react-markdown";

export default function DebateMode({ note }) {
  const [position, setPosition] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDebate = async () => {
    if (!position.trim() || !note) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await debateNote(note.id, position);
      setResult(data);
    } catch {
      setError("Failed to generate debate. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!note) {
    return (
      <div className="text-gray-500 text-center py-12">
        Select a note to use Debate Mode
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="bg-surface border border-gray-700 rounded-xl p-5">
        <h2 className="text-lg font-semibold text-white mb-3">AI Debate Mode</h2>
        <p className="text-gray-400 text-sm mb-4">
          State your position and Claude will argue the opposing side to stress-test your thinking.
        </p>
        <div className="flex gap-3">
          <input
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleDebate()}
            placeholder="Your position (e.g. 'Remote work increases productivity')"
            className="flex-1 bg-base border border-gray-700 rounded-lg px-3 py-2 text-gray-200 text-sm focus:outline-none focus:border-primary"
          />
          <button
            onClick={handleDebate}
            disabled={loading || !position.trim()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg text-white font-medium transition-colors"
          >
            {loading ? "Thinking..." : "Debate Me"}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>

      {result && (
        <div className="space-y-4">
          <div className="bg-surface border border-red-800/50 rounded-xl p-5">
            <h3 className="text-red-400 font-semibold mb-3">Counter-Argument</h3>
            <ReactMarkdown className="text-gray-300 text-sm leading-relaxed">
              {result.counter_argument}
            </ReactMarkdown>
          </div>

          <div className="bg-surface border border-yellow-800/50 rounded-xl p-5">
            <h3 className="text-yellow-400 font-semibold mb-3">Key Weaknesses in Your Position</h3>
            <ul className="space-y-2">
              {result.key_weaknesses.map((w, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-300">
                  <span className="text-yellow-500 font-bold">{i + 1}.</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-surface border border-green-800/50 rounded-xl p-5">
            <h3 className="text-green-400 font-semibold mb-3">Steelman (Best Version of Your Argument)</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{result.steelman}</p>
          </div>
        </div>
      )}
    </div>
  );
}
