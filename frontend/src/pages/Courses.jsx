import React, { useState, useMemo } from "react";
import { Menu, Transition, Dialog } from "@headlessui/react";
import {
  AcademicCapIcon,
  BookOpenIcon,
  ChevronDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  BuildingLibraryIcon,
  UserCircleIcon,
  StarIcon,
  EyeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useGetFacultiesQuery } from "../redux/apiSlice";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

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

const departmentColors = {
  CSE: "bg-blue-100 text-blue-700",
  EEE: "bg-yellow-100 text-yellow-700",
  BBA: "bg-green-100 text-green-700",
  ENH: "bg-pink-100 text-pink-700",
  MNS: "bg-purple-100 text-purple-700",
  Pharmacy: "bg-teal-100 text-teal-700",
  Architecture: "bg-orange-100 text-orange-700",
  Law: "bg-red-100 text-red-700",
  Economics: "bg-indigo-100 text-indigo-700",
  Sociology: "bg-gray-100 text-gray-700",
};

const sortOptions = [
  { label: "A-Z", value: "az", icon: ArrowUpIcon },
  { label: "Z-A", value: "za", icon: ArrowDownIcon },
];

function getDeptColor(dept) {
  return departmentColors[dept] || "bg-gray-100 text-gray-700";
}

export default function Courses() {
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [sortBy, setSortBy] = useState("az");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const { data: faculties = [], isLoading } = useGetFacultiesQuery();
  const navigate = useNavigate();

  // Aggregate unique courses from faculties
  const courses = useMemo(() => {
    const map = new Map();
    faculties.forEach((faculty) => {
      (faculty.courses || []).forEach((course) => {
        if (!map.has(course)) {
          map.set(course, {
            name: course,
            department: faculty.department,
            faculties: [faculty.initial],
          });
        } else {
          const entry = map.get(course);
          if (!entry.department) entry.department = faculty.department;
          if (!entry.faculties.includes(faculty.initial)) {
            entry.faculties.push(faculty.initial);
          }
        }
      });
    });
    return Array.from(map.values());
  }, [faculties]);

  // Map faculty initial to full faculty object for quick lookup
  const facultyMap = useMemo(() => {
    const map = {};
    faculties.forEach((f) => {
      map[f.initial] = f;
    });
    return map;
  }, [faculties]);

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    let list = courses;
    if (search.trim() !== "") {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.department && c.department.toLowerCase().includes(q)) ||
          c.faculties.some((f) => f.toLowerCase().includes(q))
      );
    }
    if (filterDept !== "All") {
      list = list.filter((c) => c.department === filterDept);
    }
    if (sortBy === "az") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "za") {
      list = [...list].sort((a, b) => b.name.localeCompare(a.name));
    }
    return list;
  }, [courses, search, filterDept, sortBy]);

  // Modal open handler
  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-2 sm:px-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-full hover:bg-blue-100 transition"
            aria-label="Back to Home"
          >
            <svg
              className="h-6 w-6 text-blue-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
            <BookOpenIcon className="h-8 w-8 text-blue-400 animate-bounce" />
            Courses
          </h1>
        </div>
        <span className="flex items-center text-xs text-gray-500 bg-gray-100 rounded px-2 py-1 mt-1 sm:mt-0 sm:ml-3">
          <svg
            className="h-4 w-4 mr-1 text-blue-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="8" />
          </svg>
          Courses conducted by faculties might change over time
        </span>
      </div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 items-stretch sm:items-center">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* Department Filter */}
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-blue-100 transition font-medium shadow-sm">
            <AcademicCapIcon className="h-5 w-5 text-blue-500" />
            {filterDept}
            <ChevronDownIcon className="h-4 w-4 ml-1" />
          </Menu.Button>
          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute z-10 mt-2 w-48 origin-top-right bg-white border border-gray-200 rounded-lg shadow-lg focus:outline-none">
              {departments.map((dept) => (
                <Menu.Item key={dept}>
                  {({ active }) => (
                    <button
                      className={clsx(
                        "w-full text-left px-4 py-2 text-sm rounded",
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
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-blue-100 transition font-medium shadow-sm">
            <BuildingLibraryIcon className="h-5 w-5 text-blue-500" />
            Sort: {sortOptions.find((s) => s.value === sortBy)?.label}
            <ChevronDownIcon className="h-4 w-4 ml-1" />
          </Menu.Button>
          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute z-10 mt-2 w-40 origin-top-right bg-white border border-gray-200 rounded-lg shadow-lg focus:outline-none">
              {sortOptions.map((opt) => (
                <Menu.Item key={opt.value}>
                  {({ active }) => (
                    <button
                      className={clsx(
                        "w-full text-left px-4 py-2 text-sm rounded flex items-center gap-2",
                        active ? "bg-blue-100 text-blue-700" : "text-gray-700"
                      )}
                      onClick={() => setSortBy(opt.value)}
                    >
                      <opt.icon className="h-4 w-4" />
                      {opt.label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      {/* Course List */}
      <div className="h-[60vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 pr-1 transition-all">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center py-10">
            <Loading />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="col-span-full text-gray-400 text-center py-10">
            No courses found.
          </div>
        ) : (
          filteredCourses.map((course) => (
            <Transition
              key={course.name}
              appear
              show
              enter="transition-all duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="transition-all duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div
                className={clsx(
                  "bg-white rounded-xl shadow-md p-5 flex flex-col gap-2 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer border-l-4",
                  getDeptColor(course.department)
                )}
                onClick={() => handleCourseClick(course)}
                tabIndex={0}
                role="button"
                aria-label={`View faculties for ${course.name}`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg text-blue-700 flex items-center gap-1">
                    <BookOpenIcon className="h-5 w-5 text-blue-400" />
                    {course.name}
                  </span>
                  <span
                    className={clsx(
                      "ml-auto px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1",
                      getDeptColor(course.department)
                    )}
                  >
                    <AcademicCapIcon className="h-4 w-4" />
                    {course.department}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-gray-600 text-xs font-semibold">
                    Taught by:
                  </span>
                  {course.faculties.map((initial) => (
                    <span
                      key={initial}
                      className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold shadow-sm"
                    >
                      <UserCircleIcon className="h-4 w-4" />
                      {initial}
                    </span>
                  ))}
                </div>
              </div>
            </Transition>
          ))
        )}
      </div>
      {/* Modal for course faculties */}
      <Transition.Root show={modalOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed z-50 inset-0 overflow-y-auto"
          onClose={setModalOpen}
        >
          <div className="flex items-center justify-center min-h-screen px-2 py-8 text-center sm:block sm:p-0 bg-black/30">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="inline-block align-bottom bg-white rounded-lg px-6 py-6 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full max-w-lg">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-bold leading-6 text-blue-700 flex items-center gap-2"
                  >
                    <BookOpenIcon className="h-6 w-6 text-blue-400" />
                    {selectedCourse?.name}
                  </Dialog.Title>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="rounded-full p-2 hover:bg-gray-100 transition"
                    aria-label="Close"
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={clsx(
                      "px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1",
                      getDeptColor(selectedCourse?.department)
                    )}
                  >
                    <AcademicCapIcon className="h-4 w-4" />
                    {selectedCourse?.department}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-700 mb-2">
                    Faculties teaching this course:
                  </div>
                  <div className="flex flex-col gap-3">
                    {selectedCourse?.faculties.map((initial) => {
                      const faculty = facultyMap[initial];
                      return (
                        <div
                          key={initial}
                          className="flex items-center gap-3 bg-blue-50 rounded-lg px-3 py-2"
                        >
                          <UserCircleIcon className="h-6 w-6 text-blue-500" />
                          <span className="font-bold text-blue-800 text-sm">
                            {faculty?.initial}
                          </span>
                          <span className="text-xs text-gray-500">
                            {faculty?.department}
                          </span>
                          <span className="flex items-center gap-1 ml-2 text-yellow-600 font-semibold">
                            <StarIcon className="h-4 w-4" />
                            {faculty?.averageRating !== undefined
                              ? faculty.averageRating.toFixed(2)
                              : "N/A"}
                          </span>
                          <button
                            className="ml-auto flex items-center gap-1 px-3 py-1 rounded bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition"
                            onClick={() => navigate(`/faculty/${faculty?._id}`)}
                          >
                            <EyeIcon className="h-4 w-4" />
                            View Reviews
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
