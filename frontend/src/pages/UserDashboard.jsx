import React, { useState } from "react";
import WelcomeSection from "./WelcomeSection";
import MyReviewsList from "./MyReviewsList";
import UserNavbar from "../components/navbar/UserNavbar";
import Loading from "../components/Loading";
import {
  useGetMyReviewsQuery,
  useGetFavoriteFacultiesQuery,
  useRemoveFavoriteFacultyMutation,
  useGetMeQuery,
} from "../redux/apiSlice";
import { EyeIcon, HeartIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const UserDashboard = () => {
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0);
  const { data: reviews } = useGetMyReviewsQuery(undefined, {
    pollingInterval: 10000,
  });

  // Favorite faculties logic
  const { data: me } = useGetMeQuery();
  const {
    data: favoriteFaculties = [],
    refetch: refetchFavorites,
    isLoading: favoritesLoading,
  } = useGetFavoriteFacultiesQuery(undefined, { skip: !me });
  const [removeFavorite] = useRemoveFavoriteFacultyMutation();
  const navigate = useNavigate();

  const handleUnfavorite = async (facultyId) => {
    await removeFavorite(facultyId);
    refetchFavorites();
  };

  const handleViewFaculty = (facultyId) => {
    navigate(`/faculty/${facultyId}`);
  };

  const handleReviewAdded = () => {
    setReviewRefreshKey((k) => k + 1);
  };

  // Responsive two-column layout with Tailwind
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 80 }}
    >
      <div className="flex flex-col md:flex-row gap-8 items-start w-full max-w-6xl mx-auto px-4 py-8">
        <div className="flex-1 min-w-0">
          <WelcomeSection totalReviews={reviews ? reviews.length : 0} />
          <MyReviewsList key={reviewRefreshKey} />
        </div>
        <div className="w-full md:w-96">
          {/* Favorite Faculties Section */}
          <AnimatePresence>
            {favoritesLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loading className="py-8" />
              </div>
            ) : me && favoriteFaculties.length > 0 ? (
              <motion.div
                className="mb-6 bg-white rounded-lg shadow p-4"
                initial={{ opacity: 0, scale: 0.97, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 20 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 90 }}
                layout
              >
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <HeartIcon className="h-6 w-6 text-red-400" />
                  Favorite Faculties
                </h3>
                <ul className="space-y-2">
                  <AnimatePresence>
                    {favoriteFaculties.map((faculty, idx) => (
                      <motion.li
                        key={faculty._id}
                        className="flex items-center justify-between bg-gray-50 rounded px-3 py-2"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        layout
                      >
                        <span className="font-medium text-gray-800">
                          {faculty.initial}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            title="View Faculty"
                            className="p-1 rounded hover:bg-blue-100 transition"
                            onClick={() => handleViewFaculty(faculty._id)}
                          >
                            <EyeIcon className="h-5 w-5 text-blue-500" />
                          </button>
                          <motion.button
                            title="Remove from favorites"
                            className="p-1 rounded hover:bg-red-100 transition"
                            onClick={() => handleUnfavorite(faculty._id)}
                            disabled={favoritesLoading}
                            whileTap={{ scale: 1.2 }}
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{
                              duration: 0.35,
                              type: "spring",
                              stiffness: 300,
                            }}
                          >
                            <HeartIcon className="h-5 w-5 text-red-400" />
                          </motion.button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default UserDashboard;
