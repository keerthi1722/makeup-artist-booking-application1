import { useState } from "react";

import "./App.css";
import Home from "./pages/Home";
import { Routes, BrowserRouter, Route } from "react-router-dom";
import BookAppoinment from "./pages/BookAppoinment";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminArtistRegister from "./pages/AdminArtistRegister";
import AdminBookings from "./pages/AdminBookings";

import User from "./pages/User";
import UserDashboard from "./pages/UserDashboard";
import UserLogin from "./pages/UserLogin";
import AdminLogin from "./pages/AdminLogin";
import Login from "./pages/Login";
import UserAppoinment from "./pages/UserAppoinment";
import AdminWages from "./pages/AdminWages";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/userlogin" element={<UserLogin/>} />
          <Route path="/adminlogin" element={<AdminLogin/>}/>
          <Route path="/user" element={<UserDashboard />} />

          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/artists/register" element={<AdminArtistRegister />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/wages" element={<AdminWages/>} />
          <Route path="/appoinment" element={<BookAppoinment />} />
          <Route path="/userappoinment" element={<UserAppoinment/>} />
          
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
