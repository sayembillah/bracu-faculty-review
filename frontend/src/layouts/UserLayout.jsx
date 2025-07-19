import React from "react";
import UserNavbar from "../components/navbar/UserNavbar";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <>
      <UserNavbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default UserLayout;
