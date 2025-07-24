import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  UserCircleIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  PlusCircleIcon,
  XCircleIcon,
  XMarkIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  StarIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useAddFacultyMutation } from "../redux/apiSlice";
import toast from "react-hot-toast";

const departments = [
  "CSE",
  "EEE",
  "BBA",
  "ENH",
  "MNS",
  "Pharmacy",
  "Architecture",
  "Law",
  "Economics",
  "Sociology",
];

export default function AddFacultyForm({ onFacultyAdded }) {
  const [initial, setInitial] = useState("");
  const [department, setDepartment] = useState("");
  const [courseInput, setCourseInput] = useState("");
  const [taughtCourses, setTaughtCourses] = useState([]);
  const [adminReviews, setAdminReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [editingReviewIdx, setEditingReviewIdx] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addFaculty, { isLoading }] = useAddFacultyMutation();

  // Add course as chip/tag
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
    setAdminReviews(adminReviews.filter((_, i) => i !== idx));
    if (editingReviewIdx === idx) {
      setEditingReviewIdx(null);
      setReviewText("");
      setReviewRating(5);
    }
  };

  const clearForm = () => {
    setInitial("");
    setDepartment("");
    setCourseInput("");
    setTaughtCourses([]);
    setAdminReviews([]);
    setReviewText("");
    setReviewRating(5);
    setEditingReviewIdx(null);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!initial || !department || taughtCourses.length === 0) {
      setError("All fields are required.");
      return;
    }
    try {
      const res = await addFaculty({
        initial,
        department,
        taughtCourses,
        adminReviews,
      }).unwrap();
      toast.success("Faculty added!");
      setSuccess("Faculty added successfully!");
      clearForm();
      if (onFacultyAdded) onFacultyAdded(res);
    } catch (err) {
      setError(
        err?.data?.message ||
          "Failed to add faculty. Please check your input and try again."
      );
    }
  };

  return (
    <form
      className="bg-white rounded-lg shadow p-6 flex flex-col gap-4 w-full max-w-md"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-bold flex items-center gap-2 mb-2">
        <AcademicCapIcon className="h-6 w-6 text-blue-500" />
        Add New Faculty
      </h2>
      {/* Initial */}
      <div>
        <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
          <UserCircleIcon className="h-5 w-5 text-gray-400" />
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
      {/* Name field removed */}
      {/* Department */}
      <div>
        <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
          <AcademicCapIcon className="h-5 w-5 text-gray-400" />
          Department
        </label>
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>
      {/* Taught Courses */}
      <div>
        <label className="block text-sm font-medium text-gray-700 flex items-center gap-1">
          <PlusCircleIcon className="h-5 w-5 text-gray-400" />
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
          Optional: Add Admin Reviews & Ratings
        </label>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min={1}
              max={5}
              value={reviewRating}
              onChange={(e) => setReviewRating(Number(e.target.value))}
              className="w-16 rounded border-gray-300"
            />
            <textarea
              className="flex-1 rounded border-gray-300 p-2"
              placeholder="Write a review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={2}
              maxLength={300}
            />
            <button
              type="button"
              onClick={handleAddOrEditReview}
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
        </div>
        {/* List of admin reviews */}
        {adminReviews.length > 0 && (
          <ul className="mt-2 space-y-2">
            {adminReviews.map((review, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 bg-gray-50 rounded p-2"
              >
                <span className="flex items-center gap-1 text-yellow-600 font-bold">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <StarIcon key={i} className="h-4 w-4 inline" />
                  ))}
                </span>
                <span className="flex-1 text-gray-800">{review.text}</span>
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
          <XCircleIcon className="h-5 w-5" />
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
      <div className="flex gap-4 mt-2">
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          onClick={clearForm}
        >
          <ArrowPathIcon className="h-5 w-5" />
          Clear Form
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
          disabled={isLoading}
        >
          <PlusCircleIcon className="h-5 w-5" />
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
