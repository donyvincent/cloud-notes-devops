import { useEffect, useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { getGraph } from "../services/api";

const EDGE_COLORS = {
  supports: "#22c55e",
  contradicts: "#ef4444",
  extends: "#6366f1",
  references: "#f59e0b",
};

export default function KnowledgeGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const buildGraph = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getGraph();

      const flowNodes = data.nodes.map((note, i) => ({
        id: String(note.id),
        data: { label: note.title },
        position: {
          x: 150 + (i % 4) * 240,
          y: 100 + Math.floor(i / 4) * 160,
        },
        style: {
          background: "#1e1e2e",
          border: "1px solid #6366f1",
          color: "#e2e8f0",
          borderRadius: "8px",
          padding: "10px 16px",
          fontSize: "13px",
          maxWidth: "180px",
        },
      }));

      const flowEdges = data.edges.map((edge, i) => ({
        id: `e${i}`,
        source: String(edge.source_id),
        target: String(edge.target_id),
        label: edge.relationship,
        style: { stroke: EDGE_COLORS[edge.relationship] || "#6366f1" },
        labelStyle: { fill: "#94a3b8", fontSize: 10 },
        animated: edge.relationship === "contradicts",
      }));

      setNodes(flowNodes);
      setEdges(flowEdges);
    } catch {
      setError("Failed to build knowledge graph.");
    } finally {
      setLoading(false);
    }
  }, [setNodes, setEdges]);

  useEffect(() => {
    buildGraph();
  }, [buildGraph]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Building knowledge graph with AI...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-red-400">{error}</p>
        <button onClick={buildGraph} className="px-4 py-2 bg-primary rounded-lg text-white">
          Retry
        </button>
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Add at least 2 notes to generate a knowledge graph.
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background color="#374151" gap={20} />
        <Controls />
        <MiniMap nodeColor="#6366f1" maskColor="rgba(19,19,31,0.8)" />
      </ReactFlow>
      <div className="absolute bottom-6 right-6 flex gap-3 bg-surface/90 p-3 rounded-lg border border-gray-700 text-xs">
        {Object.entries(EDGE_COLORS).map(([rel, color]) => (
          <span key={rel} className="flex items-center gap-1">
            <span className="w-3 h-0.5 inline-block" style={{ background: color }} />
            {rel}
          </span>
        ))}
      </div>
    </div>
  );
}
