import React from "react";
import { Link } from "react-router-dom";
import { Disclosure } from "@headlessui/react";

const Header = () => {
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
                to="/about"
                className="text-gray-700 hover:text-blue-600 text-sm font-medium transition"
              >
                About
              </Link>
              <Link
                to="/privacy"
                className="text-gray-700 hover:text-blue-600 text-sm font-medium transition"
              >
                Privacy
              </Link>
            </div>
            <div className="flex items-center space-x-4">
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
            </div>
          </div>
        </div>
      )}
    </Disclosure>
  );
};

export default Header;
