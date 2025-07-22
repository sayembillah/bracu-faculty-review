import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useUpdateFacultyMutation } from "../redux/apiSlice";
import {
  AcademicCapIcon,
  XMarkIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export default function EditFacultyModal({ open, onClose, faculty }) {
  const [initial, setInitial] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [courseInput, setCourseInput] = useState("");
  const [taughtCourses, setTaughtCourses] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updateFaculty, { isLoading }] = useUpdateFacultyMutation();

  useEffect(() => {
    if (faculty) {
      setInitial(faculty.initial || "");
      setName(faculty.name || "");
      setDepartment(faculty.department || "");
      setTaughtCourses(faculty.courses || faculty.taughtCourses || []);
      setCourseInput("");
      setError("");
      setSuccess("");
    }
  }, [faculty, open]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!initial || !name || !department || taughtCourses.length === 0) {
      setError("All fields are required.");
      return;
    }
    try {
      await updateFaculty({
        id: faculty._id,
        initial,
        name,
        department,
        taughtCourses,
      }).unwrap();
      setSuccess("Faculty updated successfully!");
      setTimeout(() => {
        onClose();
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
