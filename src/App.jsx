import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Registration from "./pages/Registration";
import FAQ from "./pages/FAQ";
import StudentLogin from "./pages/StudentLogin";
import StaffLogin from "./pages/StaffLogin";

function App() {
  return (
    <Router>
      <nav style={{ padding: "10px", display: "flex", gap: "20px", background: "#f5f5f5" }}>
        <Link to="/register">Registration</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/studentogin">Student Login</Link>
        <Link to="/stafflogin">Staff Login</Link>
      </nav>

      <Routes>
        <Route path="/register" element={<Registration />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/studentogin" element={<StudentLogin />} />
        <Route path="/stafflogin" element={<StaffLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
