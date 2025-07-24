import React, { Fragment, useState } from "react";
import { Disclosure, Dialog, Transition, Switch } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  PencilSquareIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import {
  useGetFacultiesQuery,
  useAddReviewMutation,
  useGetMyReviewsQuery,
  useGetMeQuery,
} from "../../redux/apiSlice";

const UserNavbar = ({ onReviewAdded }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: me } = useGetMeQuery(undefined, { pollingInterval: 10000 });

  // Modal States
  const [isOpen, setIsOpen] = useState(false); // modal open/close state
  const [search, setSearch] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [rating, setRating] = useState(3);
  const [showReview, setShowReview] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch faculties from backend
  const {
    data: faculties,
    isLoading: facultiesLoading,
    error: facultiesError,
  } = useGetFacultiesQuery(undefined, { pollingInterval: 10000 });

  // Add review mutation
  const [addReview, { isLoading: isSubmitting }] = useAddReviewMutation();

  // Get user's reviews
  const { data: myReviews } = useGetMyReviewsQuery(undefined, {
    pollingInterval: 10000,
  });

  // Filter faculties by initial
  const suggestions =
    faculties && search
      ? faculties.filter((f) =>
          f.initial.toLowerCase().startsWith(search.toLowerCase())
        )
      : [];

  // Check for duplicate review
  const duplicateReview =
    selectedFaculty &&
    myReviews &&
    myReviews.some((r) => r.faculty?._id === selectedFaculty._id);

  // LOGOUT button functionalities
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("authData");
    navigate("/login");
    window.location.reload();
  };

  const closeModal = () => {
    setIsOpen(false);
    setSearch("");
    setSelectedFaculty(null);
    setRating(3);
    setShowReview(false);
    setReviewText("");
    setShowSuggestions(false);
    setSuccessMsg("");
    setErrorMsg("");
  };
  const openModal = () => setIsOpen(true);

  // Handle faculty selection from suggestions
  const handleSelectFaculty = (faculty) => {
    setSelectedFaculty(faculty);
    setSearch(faculty.initial);
    setShowSuggestions(false);
  };

  // Handle review submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    if (!selectedFaculty || !rating) {
      setErrorMsg("Faculty and rating are required.");
      return;
    }
    try {
      await addReview({
        faculty: selectedFaculty._id,
        rating,
        text: showReview ? reviewText : "",
      }).unwrap();
      setSuccessMsg("Review submitted successfully!");
      setSelectedFaculty(null);
      setSearch("");
      if (onReviewAdded) onReviewAdded();
      setTimeout(() => {
        setSuccessMsg("");
        closeModal();
      }, 2000);
    } catch (err) {
      setErrorMsg(
        err?.data?.message || "Failed to submit review. Please try again."
      );
    }
  };

  // Determine current path
  const isDashboardHome = location.pathname === "/user";
  const isDashboardPage = location.pathname === "/user/dashboard";

  return (
    <>
      {/* === Navbar === */}
      <Disclosure as="nav" className="bg-white shadow-sm text-gray-800">
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
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 bg-white border border-gray-300 shadow text-black hover:bg-gray-100 focus:outline-none transition">
                    <motion.span
                      key={open ? "open" : "closed"}
                      initial={{ rotate: 0, scale: 1 }}
                      animate={
                        open
                          ? { rotate: 90, scale: 1.2 }
                          : { rotate: 0, scale: 1 }
                      }
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      style={{ display: "flex" }}
                    >
                      {open ? (
                        <XMarkIcon className="block h-6 w-6 text-black" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6 text-black" />
                      )}
                    </motion.span>
                  </Disclosure.Button>
                </div>

                {/* === Desktop Menu === */}
                <div className="hidden md:flex space-x-4 items-center">
                  {/* Only show Write Review button on /user/dashboard */}
                  {me && isDashboardPage && (
                    <>
                      <button
                        onClick={openModal}
                        className="text-sm font-medium bg-white border hover:shadow-md px-4 py-2 rounded-md flex items-center gap-2"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                        Write Review
                      </button>
                      <Link
                        to="/"
                        className="text-sm font-medium bg-white border hover:shadow-md px-4 py-2 rounded-md flex items-center gap-2"
                      >
                        <HomeIcon className="h-5 w-5" />
                        See Review
                      </Link>
                    </>
                  )}
                  {/* Show See Reviews button only on /user */}
                  {me && isDashboardHome && (
                    <Link
                      to="/"
                      className="text-sm font-medium bg-white border hover:shadow-md px-4 py-2 rounded-md flex items-center gap-2"
                    >
                      <HomeIcon className="h-5 w-5" />
                      See Reviews
                    </Link>
                  )}
                  {/* Show Dashboard button with icon on all pages except /user/dashboard */}
                  {me && !isDashboardPage && (
                    <Link
                      to="/user/dashboard"
                      className="text-sm font-medium bg-white border hover:shadow-md px-4 py-2 rounded-md flex items-center gap-2"
                    >
                      <Squares2X2Icon className="h-5 w-5" />
                      Dashboard
                    </Link>
                  )}
                  {/* === Auth Buttons === */}
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
                    <button
                      onClick={handleLogout}
                      className="text-sm text-white font-medium bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md flex items-center gap-2"
                      title="Logout"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      Logout
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* === Mobile Menu Panel === */}
            <AnimatePresence>
              {open && (
                <motion.div
                  className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-white shadow-md"
                  key="mobile-menu"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, transition: { duration: 0.22 } }}
                  transition={{
                    duration: 0.25,
                    type: "spring",
                    stiffness: 120,
                  }}
                >
                  {/* Only show Write Review button on /user/dashboard */}
                  {me && isDashboardPage && (
                    <>
                      <button
                        onClick={openModal}
                        className="block w-full text-left text-sm font-medium bg-white hover:shadow-md px-3 py-2 rounded-md text-gray-700 flex items-center gap-2"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                        Write Review
                      </button>
                      <Link
                        to="/"
                        className="block w-full text-left text-sm font-medium bg-white hover:shadow-md px-3 py-2 rounded-md text-gray-700 flex items-center gap-2"
                      >
                        <HomeIcon className="h-5 w-5" />
                        See Review
                      </Link>
                    </>
                  )}
                  {/* Show See Reviews button only on /user */}
                  {me && isDashboardHome && (
                    <Link
                      to="/"
                      className="block w-full text-left text-sm font-medium bg-white hover:shadow-md px-3 py-2 rounded-md text-gray-700 flex items-center gap-2"
                    >
                      <HomeIcon className="h-5 w-5" />
                      See Reviews
                    </Link>
                  )}
                  {/* Show Dashboard button with icon on all pages except /user/dashboard */}
                  {me && !isDashboardPage && (
                    <Link
                      to="/user/dashboard"
                      className="block w-full text-left text-sm font-medium bg-white hover:shadow-md px-3 py-2 rounded-md text-gray-700 flex items-center gap-2"
                    >
                      <Squares2X2Icon className="h-5 w-5" />
                      Dashboard
                    </Link>
                  )}
                  {/* === Auth Buttons (mobile) === */}
                  {!me ? (
                    <>
                      <Link
                        to="/login"
                        className="block w-full text-left px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/signup"
                        className="block w-full text-left px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
                      >
                        Sign Up
                      </Link>
                    </>
                  ) : (
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left text-sm font-medium bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-white"
                      title="Logout"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      Logout
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
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
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {/* === Modal Title === */}
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold text-gray-900 mb-4"
                  >
                    Write a Review
                  </Dialog.Title>

                  {/* === Faculty Search and Select === */}
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Faculty Initial
                      </label>
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value.toUpperCase());
                          setShowSuggestions(true);
                          setSelectedFaculty(null);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        className="w-full border border-blue-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-150"
                        placeholder="E.g., AAC"
                        autoComplete="off"
                      />
                      <span className="text-xs text-gray-500 mt-1 block">
                        Start typing to see suggestions. Only existing faculties
                        are allowed.
                      </span>
                      {facultiesLoading && (
                        <div className="text-xs text-gray-400 mt-1">
                          Loading faculties...
                        </div>
                      )}
                      {facultiesError && (
                        <div className="text-xs text-red-500 mt-1">
                          Failed to load faculties.
                        </div>
                      )}
                      {search && suggestions.length > 0 && showSuggestions && (
                        <ul className="mt-2 bg-white border border-gray-200 rounded-md max-h-28 overflow-y-auto text-sm shadow transition-all duration-150 z-10">
                          {suggestions.map((item) => (
                            <li
                              key={item._id}
                              onClick={() => handleSelectFaculty(item)}
                              className={`px-4 py-2 hover:bg-blue-100 cursor-pointer transition-colors duration-100 rounded ${
                                selectedFaculty &&
                                selectedFaculty._id === item._id
                                  ? "bg-blue-50 font-semibold"
                                  : ""
                              }`}
                            >
                              {item.initial}
                              {item.department && (
                                <span className="text-xs text-gray-400 ml-2">
                                  ({item.department})
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                      {search &&
                        suggestions.length === 0 &&
                        !facultiesLoading && (
                          <div className="text-xs text-gray-400 mt-2">
                            No faculty found with that initial.
                          </div>
                        )}
                      {selectedFaculty && (
                        <div className="mt-2 text-xs text-green-600">
                          Selected: {selectedFaculty.initial}
                        </div>
                      )}
                    </div>

                    {/* === Rating Slider === */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rating: {rating}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    {/* === Toggle Switch for Review Textarea === */}
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Add written review?
                      </span>
                      <Switch
                        checked={showReview}
                        onChange={setShowReview}
                        className={`${
                          showReview ? "bg-blue-600" : "bg-gray-300"
                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                      >
                        <span
                          className={`${
                            showReview ? "translate-x-6" : "translate-x-1"
                          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                        />
                      </Switch>
                    </div>

                    {/* === Review Textarea === */}
                    {showReview && (
                      <textarea
                        placeholder="Write your review here..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 h-24 resize-none focus:outline-none focus:ring focus:ring-blue-200 mb-4"
                      />
                    )}

                    {/* === Action Buttons === */}
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 rounded-md"
                        disabled={isSubmitting}
                      >
                        Discard
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-gray-400 text-gray-700 hover:bg-gray-50 rounded-md"
                        disabled={
                          isSubmitting ||
                          facultiesLoading ||
                          !selectedFaculty ||
                          !rating ||
                          duplicateReview
                        }
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </button>
                    </div>
                    {duplicateReview && (
                      <div className="text-yellow-600 text-sm mt-3">
                        Your review on that faculty already exists. Kindly
                        delete or edit that review.
                      </div>
                    )}
                    {errorMsg && (
                      <div className="text-red-500 text-sm mt-3">
                        {errorMsg}
                      </div>
                    )}
                    {successMsg && (
                      <div className="text-green-600 text-sm mt-3">
                        {successMsg}
                      </div>
                    )}
                  </form>
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

<environment_details>
  # VSCode Visible Files frontend/src/components/navbar/UserNavbar.jsx # VSCode
  Open Tabs frontend/src/index.css frontend/src/App.jsx
  frontend/src/pages/Home.jsx backend/routes/facultyRoutes.js
  backend/controllers/reviewController.js backend/routes/reviewRoutes.js
  frontend/src/redux/apiSlice.js frontend/src/pages/FacultyReview.jsx
  frontend/src/components/Header.jsx
  frontend/src/components/navbar/AdminNavbar.jsx
  frontend/src/components/navbar/UserNavbar.jsx # Current Time 7/20/2025,
  10:18:01 PM (Asia/Dhaka, UTC+6:00) # Context Window Usage 97,964 / 128K tokens
  used (76%) # Current Mode ACT MODE
</environment_details>;
