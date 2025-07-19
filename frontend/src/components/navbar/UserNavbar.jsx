import React, { Fragment, useState } from "react";
import { Disclosure, Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import {
  ArrowRightOnRectangleIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

const UserNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false); // modal open/close state

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("authData");
    navigate("/login");
  };

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  return (
    <>
      {/* === Navbar === */}
      <Disclosure as="nav" className="bg-slate-700 text-white">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                {/* === Brand === */}
                <div className="flex-shrink-0 text-lg font-semibold tracking-wide">
                  BRACU FACULTY REVIEW
                </div>

                {/* === Mobile Menu Button === */}
                <div className="flex md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-blue-600 focus:outline-none">
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" />
                    )}
                  </Disclosure.Button>
                </div>

                {/* === Desktop Menu === */}
                <div className="hidden md:flex space-x-6 items-center">
                  {/* === Write Review Button === */}
                  <button
                    onClick={openModal}
                    className="text-sm font-medium bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md"
                  >
                    Write Review
                  </button>

                  {/* === Logout Button === */}
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* === Mobile Menu Panel === */}
            <Disclosure.Panel className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-blue-700">
              <button
                onClick={openModal}
                className="block w-full text-left text-sm font-medium bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded-md text-white"
              >
                Write Review
              </button>
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

      {/* === Modal Dialog === */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {/* === Modal Title & Close Button === */}
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Write a Review
                  </Dialog.Title>
                  <button
                    className="absolute top-3 right-4 text-gray-400 hover:text-gray-600"
                    onClick={closeModal}
                  >
                    ×
                  </button>

                  {/* === Modal Form (Dummy) === */}
                  <div className="mt-4 space-y-4">
                    <input
                      type="text"
                      placeholder="Course Name"
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                    />
                    <textarea
                      placeholder="Your Review"
                      className="w-full border border-gray-300 rounded-md px-4 py-2 h-28 resize-none focus:outline-none focus:ring focus:ring-blue-200"
                    />
                  </div>

                  {/* === Modal Footer Buttons === */}
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md"
                    >
                      Discard
                    </button>
                    <button
                      onClick={() => {
                        // You can handle post logic here later
                        closeModal();
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    >
                      Post
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default UserNavbar;
