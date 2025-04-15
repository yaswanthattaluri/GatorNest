import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Registration from "./pages/registration";
import FAQ from "./pages/FAQ";
import StudentLogin from "./pages/StudentLogin";
import StaffLogin from "./pages/StaffLogin";
import StaffHomePage from "./pages/StaffHomePage"; // Import the new component
import RoomFinder from "./pages/RoomFinder";
import ProfilePage from "./pages/ProfilePage";
import "./App.css";
import FloatingWidget from "./pages/FloatingWidget";
import FindRoommate from "./pages/FindRoommate";
import ManageRooms from "./pages/ManageRooms";
import SearchStudent from "./pages/SearchStudent";
import Maintenance from "./pages/Maintenance";


// Fixed App component - removed Router since it's already in main.jsx
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/studentlogin" element={<StudentLogin />} />
      <Route path="/stafflogin" element={<StaffLogin />} />
      <Route path="/staffhome" element={<StaffHomePage />} />
      <Route path="/roomfinder" element={<RoomFinder />} />
      <Route path="/floatingwidget" element={<FloatingWidget />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/findroommate" element={<FindRoommate />} />
      <Route path="/managerooms" element={<ManageRooms />} />
      <Route path="/managestudents" element={<SearchStudent />} />
      <Route path="/maintenancerequest" element={<Maintenance />} />
      
    </Routes>
  );
};

export default App;