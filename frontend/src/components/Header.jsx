import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Disclosure } from "@headlessui/react";
import { useGetMeQuery } from "../redux/apiSlice";
import {
  ArrowRightOnRectangleIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

const Header = () => {
  const { data: me, isLoading } = useGetMeQuery(undefined, {
    pollingInterval: 10000,
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authData");
    navigate("/login");
    window.location.reload();
  };

  return (
    <Disclosure as="nav" className="bg-white">
      {() => (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 text-sm font-medium transition"
              >
                Reviews
              </Link>
              <Link
                to="/courses"
                className="text-gray-700 hover:text-blue-600 text-sm font-medium transition"
              >
                Courses
              </Link>
              <Link
                to="/privacy"
                className="text-gray-700 hover:text-blue-600 text-sm font-medium transition"
              >
                Privacy
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {!me ? (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/user/dashboard"
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition"
                    title="Dashboard"
                  >
                    <Squares2X2Icon className="h-5 w-5" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition"
                    title="Logout"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </Disclosure>
  );
};

export default Header;
