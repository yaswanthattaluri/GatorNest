import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Registration from "./pages/Registration";
import FAQ from "./pages/FAQ";

function App() {
  return (
    <Router>
      <nav style={{ padding: "10px", display: "flex", gap: "20px", background: "#f5f5f5" }}>
        <Link to="/register">Registration</Link>
        <Link to="/faq">FAQ</Link>
      </nav>

      <Routes>
        <Route path="/register" element={<Registration />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
    </Router>
  );
}

export default App;
