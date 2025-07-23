import React, { useEffect, useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import AdminRoute from "./routes/AdminRoute";
import UserRoute from "./routes/UserRoute";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Unauthorized from "./pages/Unauthorized";
import { useDispatch } from "react-redux";
import { setCredentials } from "./redux/authSlice";
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import Home from "./pages/Home";
import FacultyReview from "./pages/FacultyReview";
import AdminUser from "./pages/AdminUser";
import AdminFaculty from "./pages/AdminFaculty";
import AdminReview from "./pages/AdminReview";

const App = () => {
  const dispatch = useDispatch();
  const [rehydrated, setRehydrated] = useState(false);

  useEffect(() => {
    const storedAuth = localStorage.getItem("authData");
    if (storedAuth) {
      const { name, token, role, email, isAuthenticated } =
        JSON.parse(storedAuth);
      dispatch(setCredentials({ name, token, email, role, isAuthenticated }));
    }
    setRehydrated(true);
  }, [dispatch]);

  // Track anonymous visitor
  useEffect(() => {
    let visitorId = localStorage.getItem("visitorId");
    if (!visitorId) {
      if (window.crypto && window.crypto.randomUUID) {
        visitorId = window.crypto.randomUUID();
      } else {
        // Fallback for older browsers
        visitorId =
          Math.random().toString(36).substring(2) + Date.now().toString(36);
      }
      localStorage.setItem("visitorId", visitorId);
    }
    // Send visitor log to backend with correct base URL and optional auth
    const authData = localStorage.getItem("authData");
    let token;
    if (authData) {
      try {
        token = JSON.parse(authData).token;
      } catch (e) {
        token = null;
      }
    }
    fetch("http://192.168.0.200:4000/api/visitor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ visitorId }),
    }).catch(() => {});
  }, []);

  if (!rehydrated) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/faculty/:id" element={<FacultyReview />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Admin-section-only */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="user" element={<AdminUser />} />
          <Route path="faculty" element={<AdminFaculty />} />
          <Route path="review" element={<AdminReview />} />
        </Route>
        {/* User-section-only */}
        <Route
          path="/user/*"
          element={
            <UserRoute>
              <UserLayout />
            </UserRoute>
          }
        >
          {/* Other user routes go here */}
          <Route path="dashboard" element={<UserDashboard />} />
        </Route>
        {/* Unauthorized */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
