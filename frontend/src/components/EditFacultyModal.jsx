import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  AcademicCapIcon,
  XMarkIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  StarIcon,
  PencilIcon,
  TrashIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import {
  useUpdateFacultyMutation,
  useGetFacultyReviewsQuery,
} from "../redux/apiSlice";

export default function EditFacultyModal({ open, onClose, faculty }) {
  const [initial, setInitial] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [courseInput, setCourseInput] = useState("");
  const [taughtCourses, setTaughtCourses] = useState([]);
  const [adminReviews, setAdminReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [editingReviewIdx, setEditingReviewIdx] = useState(null);
  const [deletedAdminReviewIds, setDeletedAdminReviewIds] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updateFaculty, { isLoading }] = useUpdateFacultyMutation();

  // Fetch all reviews for this faculty
  const { data: allReviews, refetch: refetchReviews } =
    useGetFacultyReviewsQuery(faculty?._id, { skip: !faculty });

  // On open/faculty change, set form fields and admin reviews
  useEffect(() => {
    if (faculty) {
      setInitial(faculty.initial || "");
      setName(faculty.name || "");
      setDepartment(faculty.department || "");
      setTaughtCourses(faculty.courses || faculty.taughtCourses || []);
      setCourseInput("");
      setError("");
      setSuccess("");
      setReviewText("");
      setReviewRating(5);
      setEditingReviewIdx(null);
      setDeletedAdminReviewIds([]);
      // Set admin reviews from fetched reviews
      if (allReviews && Array.isArray(allReviews)) {
        setAdminReviews(
          allReviews
            .filter((r) => r.isAdmin)
            .map((r) => ({
              _id: r._id,
              text: r.text,
              rating: r.rating,
            }))
        );
      } else {
        setAdminReviews([]);
      }
    }
    // eslint-disable-next-line
  }, [faculty, open, allReviews]);

  const handleCourseInput = (e) => {
    setCourseInput(e.target.value);
    setError("");
  };

  const handleCourseKeyDown = (e) => {
    if (
      (e.key === "Enter" || e.key === "," || e.key === "Tab") &&
      courseInput.trim()
    ) {
      e.preventDefault();
      addCourse(courseInput.trim());
    }
  };

  const addCourse = (course) => {
    if (
      course &&
      !taughtCourses.includes(course) &&
      taughtCourses.length < 20
    ) {
      setTaughtCourses([...taughtCourses, course]);
      setCourseInput("");
    }
  };

  const removeCourse = (course) => {
    setTaughtCourses(taughtCourses.filter((c) => c !== course));
  };

  // Admin Reviews logic
  const handleAddOrEditReview = (e) => {
    e.preventDefault();
    if (!reviewText.trim() || !reviewRating) {
      setError("Review text and rating are required.");
      return;
    }
    if (editingReviewIdx !== null) {
      // Edit existing
      const updated = [...adminReviews];
      updated[editingReviewIdx] = {
        ...updated[editingReviewIdx],
        text: reviewText,
        rating: reviewRating,
      };
      setAdminReviews(updated);
      setEditingReviewIdx(null);
    } else {
      // Add new
      setAdminReviews([
        ...adminReviews,
        { text: reviewText, rating: reviewRating },
      ]);
    }
    setReviewText("");
    setReviewRating(5);
    setError("");
  };

  const handleEditReview = (idx) => {
    setEditingReviewIdx(idx);
    setReviewText(adminReviews[idx].text);
    setReviewRating(adminReviews[idx].rating);
  };

  const handleDeleteReview = (idx) => {
    const review = adminReviews[idx];
    if (review._id) {
      setDeletedAdminReviewIds([...deletedAdminReviewIds, review._id]);
    }
    setAdminReviews(adminReviews.filter((_, i) => i !== idx));
    if (editingReviewIdx === idx) {
      setEditingReviewIdx(null);
      setReviewText("");
      setReviewRating(5);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!initial || !name || !department || taughtCourses.length === 0) {
      setError("All fields are required.");
      return;
    }
    // Prepare adminReviews payload: include _delete for deleted, _id for existing
    const adminReviewsPayload = [
      ...adminReviews.map((r) =>
        r._id
          ? { _id: r._id, text: r.text, rating: r.rating }
          : { text: r.text, rating: r.rating }
      ),
      ...deletedAdminReviewIds.map((id) => ({ _id: id, _delete: true })),
    ];
    try {
      await updateFaculty({
        id: faculty._id,
        initial,
        name,
        department,
        taughtCourses,
        adminReviews: adminReviewsPayload,
      }).unwrap();
      setSuccess("Faculty updated successfully!");
      setTimeout(() => {
        onClose();
        refetchReviews();
      }, 800);
    } catch (err) {
      setError(
        err?.data?.message ||
          "Failed to update faculty. Please check your input and try again."
      );
    }
  };

  if (!faculty) return null;

  return (
    <Transition.Root show={open} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-40 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <Dialog.Title className="text-lg font-bold flex items-center gap-2 mb-2">
                <AcademicCapIcon className="h-6 w-6 text-blue-500" />
                Edit Faculty
              </Dialog.Title>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {/* Initial */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Initial
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={initial}
                    onChange={(e) => setInitial(e.target.value.toUpperCase())}
                    maxLength={10}
                    required
                  />
                </div>
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                    required
                  />
                </div>
                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    maxLength={50}
                    required
                  />
                </div>
                {/* Taught Courses */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Taught Courses
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {taughtCourses.map((course) => (
                      <span
                        key={course}
                        className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {course}
                        <button
                          type="button"
                          className="ml-1 focus:outline-none"
                          onClick={() => removeCourse(course)}
                          tabIndex={-1}
                          aria-label={`Remove ${course}`}
                        >
                          <XMarkIcon className="h-4 w-4 text-blue-400 hover:text-red-500" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    value={courseInput}
                    onChange={handleCourseInput}
                    onKeyDown={handleCourseKeyDown}
                    placeholder="Type a course and press Enter"
                    maxLength={20}
                  />
                </div>
                {/* Admin Reviews Section */}
                <div className="border-t pt-4 mt-2">
                  <label className="block text-md font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <StarIcon className="h-5 w-5 text-yellow-500" />
                    Admin Reviews & Ratings
                  </label>
                  <form
                    className="flex flex-col gap-2"
                    onSubmit={handleAddOrEditReview}
                  >
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={reviewRating}
                        onChange={(e) =>
                          setReviewRating(Number(e.target.value))
                        }
                        className="w-16 rounded border-gray-300"
                        required
                      />
                      <textarea
                        className="flex-1 rounded border-gray-300 p-2"
                        placeholder="Write a review..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows={2}
                        maxLength={300}
                        required
                      />
                      <button
                        type="submit"
                        className="flex items-center gap-1 px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                      >
                        {editingReviewIdx !== null ? (
                          <>
                            <PencilIcon className="h-4 w-4" />
                            Update
                          </>
                        ) : (
                          <>
                            <PlusCircleIcon className="h-4 w-4" />
                            Add
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                  {/* List of admin reviews */}
                  {adminReviews.length > 0 && (
                    <ul className="mt-2 space-y-2">
                      {adminReviews.map((review, idx) => (
                        <li
                          key={review._id || idx}
                          className="flex items-start gap-2 bg-gray-50 rounded p-2"
                        >
                          <span className="flex items-center gap-1 text-yellow-600 font-bold">
                            {Array.from({ length: review.rating }).map(
                              (_, i) => (
                                <StarIcon key={i} className="h-4 w-4 inline" />
                              )
                            )}
                          </span>
                          <span className="flex-1 text-gray-800">
                            {review.text}
                          </span>
                          <button
                            type="button"
                            className="ml-2 text-blue-500 hover:text-blue-700"
                            onClick={() => handleEditReview(idx)}
                            aria-label="Edit review"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="ml-1 text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteReview(idx)}
                            aria-label="Delete review"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {/* Error/Success */}
                {error && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <XMarkIcon className="h-5 w-5" />
                    {error}
                  </div>
                )}
                {success && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircleIcon className="h-5 w-5" />
                    {success}
                  </div>
                )}
                {/* Buttons */}
                <div className="flex gap-4 mt-2 justify-end">
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                    onClick={onClose}
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
                    disabled={isLoading}
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
