import React, { useState, useMemo } from "react";
import {
  useGetFacultiesQuery,
  useDeleteFacultyMutation,
} from "../redux/apiSlice";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  StarIcon,
  BuildingLibraryIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import { Menu, Transition, Dialog } from "@headlessui/react";
import { Fragment } from "react";
import clsx from "clsx";

// Departments for filter
const departments = [
  "All",
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

// Sort options
const sortOptions = [
  { label: "Initials A-Z", value: "initial-asc" },
  { label: "Initials Z-A", value: "initial-desc" },
  { label: "Highest Rated", value: "rating-desc" },
  { label: "Lowest Rated", value: "rating-asc" },
];

function getRatingColor(rating) {
  if (rating >= 4.5) return "text-green-600";
  if (rating >= 3.5) return "text-yellow-500";
  if (rating > 0) return "text-orange-500";
  return "text-gray-400";
}

export default function FacultyList({ onEditFaculty }) {
  const { data: faculties = [], isLoading } = useGetFacultiesQuery();
  const [deleteFaculty] = useDeleteFacultyMutation();
  const [filterDept, setFilterDept] = useState("All");
  const [sortBy, setSortBy] = useState("initial-asc");
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    faculty: null,
  });

  // Filter and sort faculties
  const filteredFaculties = useMemo(() => {
    let list = faculties;
    if (filterDept !== "All") {
      list = list.filter((f) => f.department === filterDept);
    }
    switch (sortBy) {
      case "initial-asc":
        list = [...list].sort((a, b) => a.initial.localeCompare(b.initial));
        break;
      case "initial-desc":
        list = [...list].sort((a, b) => b.initial.localeCompare(a.initial));
        break;
      case "rating-desc":
        list = [...list].sort((a, b) => b.averageRating - a.averageRating);
        break;
      case "rating-asc":
        list = [...list].sort((a, b) => a.averageRating - b.averageRating);
        break;
      default:
        break;
    }
    return list;
  }, [faculties, filterDept, sortBy]);

  // Delete faculty handler
  const handleDelete = async (faculty) => {
    setDeleteDialog({ open: true, faculty });
  };

  const confirmDelete = async () => {
    if (deleteDialog.faculty) {
      await deleteFaculty(deleteDialog.faculty._id);
      setDeleteDialog({ open: false, faculty: null });
    }
  };

  // View faculty reviews
  const handleView = (faculty) => {
    window.open(`/faculty/${faculty._id}`, "_blank");
  };

  // Edit faculty
  const handleEdit = (faculty) => {
    if (onEditFaculty) onEditFaculty(faculty);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Filter & Sort Bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        {/* Filter by Department */}
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="inline-flex justify-center items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md shadow-sm hover:bg-gray-200 transition">
            <AcademicCapIcon className="h-5 w-5 mr-2" />
            {filterDept}
            <ChevronDownIcon className="h-4 w-4 ml-2" />
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
            <Menu.Items className="absolute z-10 mt-2 w-48 origin-top-left bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none">
              {departments.map((dept) => (
                <Menu.Item key={dept}>
                  {({ active }) => (
                    <button
                      className={clsx(
                        "w-full text-left px-4 py-2 text-sm",
                        active ? "bg-blue-100 text-blue-700" : "text-gray-700"
                      )}
                      onClick={() => setFilterDept(dept)}
                    >
                      {dept}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
        {/* Sort By */}
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="inline-flex justify-center items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md shadow-sm hover:bg-gray-200 transition">
            <BuildingLibraryIcon className="h-5 w-5 mr-2" />
            {sortOptions.find((s) => s.value === sortBy)?.label}
            <ChevronDownIcon className="h-4 w-4 ml-2" />
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
            <Menu.Items className="absolute z-10 mt-2 w-56 origin-top-left bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none">
              {sortOptions.map((opt) => (
                <Menu.Item key={opt.value}>
                  {({ active }) => (
                    <button
                      className={clsx(
                        "w-full text-left px-4 py-2 text-sm",
                        active ? "bg-blue-100 text-blue-700" : "text-gray-700"
                      )}
                      onClick={() => setSortBy(opt.value)}
                    >
                      {opt.label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      {/* Faculty List */}
      <div className="flex-1 overflow-y-auto rounded-lg bg-white shadow p-2">
        {isLoading ? (
          <div className="text-gray-500 p-4">Loading faculties...</div>
        ) : filteredFaculties.length === 0 ? (
          <div className="text-gray-400 p-4 italic">No faculties found.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredFaculties.map((faculty) => (
              <li
                key={faculty._id}
                className="flex items-center justify-between gap-2 py-3 px-2 hover:bg-blue-50 rounded transition group"
              >
                {/* Info */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 min-w-0">
                  <span className="font-bold text-blue-700 text-lg min-w-[60px]">
                    {faculty.initial}
                  </span>
                  <span className="font-medium text-gray-900 truncate">
                    {faculty.name}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold ml-2">
                    {faculty.department}
                  </span>
                  {/* Rating */}
                  <span
                    className={clsx(
                      "flex items-center gap-1 font-semibold ml-2",
                      getRatingColor(faculty.averageRating)
                    )}
                  >
                    <StarIcon className="h-5 w-5" />
                    {faculty.totalReviews === 0
                      ? "Not yet rated"
                      : faculty.averageRating.toFixed(2)}
                  </span>
                  {/* Total Reviews */}
                  <span className="ml-2 text-xs text-gray-500">
                    {faculty.totalReviews} reviews
                  </span>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* View */}
                  <button
                    className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition"
                    title="View reviews"
                    onClick={() => handleView(faculty)}
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  {/* Edit */}
                  <button
                    className="p-2 rounded-full hover:bg-yellow-100 text-yellow-600 transition"
                    title="Edit faculty"
                    onClick={() => handleEdit(faculty)}
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                  {/* Delete */}
                  <button
                    className="p-2 rounded-full hover:bg-red-100 text-red-600 transition"
                    title="Delete faculty"
                    onClick={() => handleDelete(faculty)}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Delete Confirmation Dialog */}
      <Transition.Root show={deleteDialog.open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setDeleteDialog({ open: false, faculty: null })}
        >
          <Transition.Child
            as={Fragment}
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
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
                <Dialog.Title className="text-lg font-bold text-gray-900 mb-2">
                  Delete Faculty
                </Dialog.Title>
                <Dialog.Description className="text-gray-700 mb-4">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-red-600">
                    {deleteDialog.faculty?.name}
                  </span>
                  ? This action cannot be undone.
                </Dialog.Description>
                <div className="flex gap-4 justify-end">
                  <button
                    className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                    onClick={() =>
                      setDeleteDialog({ open: false, faculty: null })
                    }
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
                    onClick={confirmDelete}
                  >
                    Delete
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
