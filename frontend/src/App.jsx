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

  if (!rehydrated) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
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
          {/* Other admin routes go here */}
          <Route path="dashboard" element={<AdminDashboard />} />
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
