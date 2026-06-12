import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import GraphView from "./pages/GraphView";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="flex items-center gap-6 px-6 py-4 bg-surface border-b border-gray-700">
        <span className="text-xl font-bold text-primary">AI Notes</span>
        <Link to="/" className="text-gray-300 hover:text-white transition-colors">
          Notes
        </Link>
        <Link to="/graph" className="text-gray-300 hover:text-white transition-colors">
          Knowledge Graph
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/graph" element={<GraphView />} />
      </Routes>
    </BrowserRouter>
  );
}
