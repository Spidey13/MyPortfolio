import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PortfolioShell from "./redesign/PortfolioShell";
import "./redesign/redesign.css";

const DiagnostiqDemo = lazy(() => import("./pages/DiagnostiqDemo"));

function App() {
  return (
    <Suspense fallback={<div className="rp-route-loading">Loading the work…</div>}>
      <Routes>
        <Route path="/" element={<PortfolioShell />} />
        <Route path="/project/:id" element={<PortfolioShell />} />
        <Route path="/projects" element={<Navigate to="/" replace />} />
        <Route path="/experience/:id" element={<Navigate to="/#experience" replace />} />
        <Route path="/demo/diagnostiq" element={<DiagnostiqDemo />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
