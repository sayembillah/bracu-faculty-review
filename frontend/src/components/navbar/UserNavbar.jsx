import React, { Fragment, useState } from "react";
import { Disclosure, Dialog, Transition, Switch } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  PencilSquareIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import {
  useGetFacultiesQuery,
  useAddReviewMutation,
  useGetMyReviewsQuery,
} from "../../redux/apiSlice";

const UserNavbar = ({ onReviewAdded }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  } = useGetFacultiesQuery();

  // Add review mutation
  const [addReview, { isLoading: isSubmitting }] = useAddReviewMutation();

  // Get user's reviews
  const { data: myReviews } = useGetMyReviewsQuery();

  // Filter faculties by initial or name
  const suggestions =
    faculties && search
      ? faculties.filter(
          (f) =>
            f.initial.toLowerCase().startsWith(search.toLowerCase()) ||
            f.name.toLowerCase().includes(search.toLowerCase())
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
                    className="text-sm font-medium bg-white border hover:shadow-md px-4 py-2 rounded-md flex items-center gap-2"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                    Write Review
                  </button>

                  {/* === Logout Button === */}
                  <button
                    onClick={handleLogout}
                    className="text-sm text-white font-medium bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md flex items-center gap-2"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* === Mobile Menu Panel === */}
            <Disclosure.Panel className="md:hidden px-4 pt-2 pb-4 space-y-2 bg-white shadow-md">
              <button
                onClick={openModal}
                className="block w-full text-left text-sm font-medium bg-white hover:shadow-md px-3 py-2 rounded-md text-gray-700 flex items-center gap-2"
              >
                <PencilSquareIcon className="h-5 w-5" />
                Write Review
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left text-sm font-medium bg-white hover:shadow-sm px-3 py-2 rounded-md text-red-500 flex items-center gap-2"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
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
                        Faculty Initial or Name
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
                        placeholder="E.g., AAC or Alice"
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
                              {item.initial} - {item.name}
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
                            No faculty found with that initial or name.
                          </div>
                        )}
                      {selectedFaculty && (
                        <div className="mt-2 text-xs text-green-600">
                          Selected: {selectedFaculty.initial} -{" "}
                          {selectedFaculty.name}
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
