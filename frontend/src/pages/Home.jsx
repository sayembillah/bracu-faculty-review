import React, { useState } from "react";
import Header from "../components/Header";
import { useGetFacultiesQuery } from "../redux/apiSlice";
import { useNavigate } from "react-router-dom";
import {
  BoltIcon,
  ServerStackIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  DevicePhoneMobileIcon,
  PencilSquareIcon,
  HandThumbUpIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const features = [
  {
    title: "Fast and efficient",
    description:
      "Stop looking for faculty reviews in Facebook groups before course selection.",
    icon: BoltIcon,
  },
  {
    title: "Real Data",
    description:
      "Every Data here are gathered from either the user directly, or from public groups. NO MADE UPS.",
    icon: ServerStackIcon,
  },
  {
    title: "Privacy",
    description:
      "We never disclose our users privacy to anyone. Your data is 100% anonymous with us.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Responsive",
    description: "Our platform works well both on Desktop and Mobile.",
    icon: DevicePhoneMobileIcon,
  },
  {
    title: "Edit Ratings",
    description: "Sign up, write reviews, edit and delete them.",
    icon: PencilSquareIcon,
  },
  {
    title: "Like and Dislikes",
    description: "User can like, dislike or report faculty reviews.",
    icon: HandThumbUpIcon,
  },
];

const Home = () => {
  const [search, setSearch] = useState("");
  const { data: faculties = [], isLoading } = useGetFacultiesQuery(undefined, {
    pollingInterval: 10000,
  });
  const navigate = useNavigate();

  // Filter faculties by initials (case-insensitive)
  const filteredFaculties = faculties.filter(
    (faculty) =>
      faculty.initial &&
      faculty.initial.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header />
      {/* HERO BG */}
      <section className="hero-gradient-bg py-12">
        <motion.div
          className="max-w-2xl mx-auto px-4 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 70 }}
        >
          <div className="flex justify-center mb-2">
            {/* AcademicCapIcon from Heroicons */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0 0H6m6 0h6"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            BRACU Faculty Review
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Search Faculty Initials to get started.
          </p>
          <div className="relative mb-4">
            <input
              type="text"
              className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-lg"
              placeholder="Search faculty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
            <AnimatePresence>
              {search && (
                <motion.div
                  className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.25 }}
                >
                  {isLoading ? (
                    <div className="py-2 text-gray-500">Loading...</div>
                  ) : filteredFaculties.length > 0 ? (
                    filteredFaculties.map((faculty, idx) => (
                      <motion.div
                        key={faculty._id}
                        className="px-4 py-2 text-left hover:bg-blue-50 cursor-pointer transition"
                        onClick={() => navigate(`/faculty/${faculty._id}`)}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.18, delay: idx * 0.03 }}
                      >
                        {faculty.initial}
                      </motion.div>
                    ))
                  ) : (
                    <div className="py-2 text-gray-500">No faculty found.</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            please be respectful of your words.
          </p>
        </motion.div>
      </section>

      {/* WHY CHOOSE SECTION */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Why choose this Platform?
            </h2>
            <p className="text-lg text-gray-600">
              Simple yet really useful for the students of BRAC University.
            </p>
          </div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
          >
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                className="bg-gray-50 rounded-xl shadow-sm p-6 flex flex-col items-start hover:shadow-md transition"
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.45,
                  delay: idx * 0.07,
                  type: "spring",
                  stiffness: 90,
                }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 4px 24px rgba(59,130,246,0.08)",
                }}
                layout
              >
                <div className="bg-blue-100 rounded-lg p-2 mb-4">
                  <feature.icon className="h-7 w-7 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
