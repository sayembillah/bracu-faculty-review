import React from "react";
import AdminNavbar from "../components/navbar/AdminNavbar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <>
      <AdminNavbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default AdminLayout;
