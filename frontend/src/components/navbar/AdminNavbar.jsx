import React from "react";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("authData");
    navigate("/login");
  };

  return (
    <Disclosure as="nav" className="bg-gray-600 text-white">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              {/* Left: Brand */}
              <div className="flex-shrink-0 text-lg font-semibold tracking-wide">
                BRACU FACULTY REVIEW
              </div>

              {/* Mobile Hamburger */}
              <div className="flex md:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-blue-600 focus:outline-none">
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" />
                  )}
                </Disclosure.Button>
              </div>

              {/* Right (Desktop) */}
              <div className="hidden md:flex space-x-6 items-center">
                {/* Dropdown */}
                <Menu as="div" className="relative">
                  <div>
                    <Menu.Button className="text-sm font-medium hover:bg-blue-600 px-3 py-2 rounded-md">
                      Manage
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-gray-800 z-50">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/user"
                              className={`${
                                active ? "bg-gray-100" : ""
                              } block px-4 py-2 text-sm`}
                            >
                              User
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/faculty"
                              className={`${
                                active ? "bg-gray-100" : ""
                              } block px-4 py-2 text-sm`}
                            >
                              Faculty
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/review"
                              className={`${
                                active ? "bg-gray-100" : ""
                              } block px-4 py-2 text-sm`}
                            >
                              Review
                            </Link>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <Disclosure.Panel className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-blue-700">
            <Menu as="div" className="relative">
              <Menu.Button className="text-sm font-medium hover:bg-blue-600 px-3 py-2 rounded-md w-full text-left">
                Manage
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="bg-white text-gray-800 rounded-md shadow-md mt-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/user"
                          className={`${
                            active ? "bg-gray-100" : ""
                          } block px-4 py-2 text-sm`}
                        >
                          User
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/faculty"
                          className={`${
                            active ? "bg-gray-100" : ""
                          } block px-4 py-2 text-sm`}
                        >
                          Faculty
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/review"
                          className={`${
                            active ? "bg-gray-100" : ""
                          } block px-4 py-2 text-sm`}
                        >
                          Review
                        </Link>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>

            {/* Logout (mobile) */}
            <button
              onClick={handleLogout}
              className="block w-full text-left text-sm font-medium bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-white"
            >
              Logout
            </button>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default AdminNavbar;
