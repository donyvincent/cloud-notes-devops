import KnowledgeGraph from "../components/KnowledgeGraph";

export default function GraphView() {
  return (
    <div className="relative h-[calc(100vh-64px)]">
      <div className="absolute top-4 left-4 z-10 bg-surface/90 border border-gray-700 rounded-xl p-4">
        <h1 className="text-lg font-bold text-white">Knowledge Graph</h1>
        <p className="text-gray-400 text-sm mt-1">AI-generated connections between your notes</p>
      </div>
      <KnowledgeGraph />
    </div>
  );
}
