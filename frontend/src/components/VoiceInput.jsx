import { useState, useRef } from "react";
import { voiceToNote } from "../services/api";

export default function VoiceInput({ onNoteReady }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (e) => {
      const text = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join(" ");
      setTranscript(text);
    };
    recognition.onerror = () => setError("Microphone error. Check permissions.");
    recognition.onend = () => setListening(false);

    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
    setError("");
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const processWithAI = async () => {
    if (!transcript.trim()) return;
    setProcessing(true);
    try {
      const result = await voiceToNote(transcript);
      onNoteReady(result);
      setTranscript("");
    } catch {
      setError("Failed to process with AI.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-surface border border-gray-700 rounded-xl p-5 space-y-4">
      <h2 className="text-lg font-semibold text-white">Voice to Structured Note</h2>

      <div className="flex gap-3">
        <button
          onClick={listening ? stopListening : startListening}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            listening
              ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
              : "bg-primary hover:bg-primary/80 text-white"
          }`}
        >
          {listening ? "Stop Recording" : "Start Recording"}
        </button>
        {transcript && (
          <button
            onClick={processWithAI}
            disabled={processing}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg text-white font-medium transition-colors"
          >
            {processing ? "Processing..." : "Structure with AI"}
          </button>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-xs text-gray-500">Or type your brain dump below:</p>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Type your messy thoughts here and click Structure with AI..."
          rows={4}
          className="w-full bg-base border border-gray-700 rounded-lg p-3 text-gray-300 text-sm resize-none focus:outline-none focus:border-primary"
        />
        {transcript && (
          <button
            onClick={processWithAI}
            disabled={processing}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-lg text-white font-medium transition-colors"
          >
            {processing ? "Processing..." : "Structure with AI"}
          </button>
        )}
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}
