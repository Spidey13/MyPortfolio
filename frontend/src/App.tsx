import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import PortfolioShell from "./redesign/PortfolioShell";
import { trackPageView } from "./utils/analytics";
import "./redesign/redesign.css";

const DiagnostiqDemo = lazy(() => import("./pages/DiagnostiqDemo"));

function App() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname, "Prathamesh More — AI Engineer");
  }, [location.pathname]);

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
