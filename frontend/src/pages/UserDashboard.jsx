import React, { useState } from "react";
import WelcomeSection from "./WelcomeSection";
import MyReviewsList from "./MyReviewsList";
import NotificationsPanel from "./NotificationsPanel";
import UserNavbar from "../components/navbar/UserNavbar";
import {
  useGetMyReviewsQuery,
  useGetFavoriteFacultiesQuery,
  useRemoveFavoriteFacultyMutation,
  useGetMeQuery,
} from "../redux/apiSlice";
import { EyeIcon, HeartIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

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
    <div>
      <div className="flex flex-col md:flex-row gap-8 items-start w-full max-w-6xl mx-auto px-4 py-8">
        <div className="flex-1 min-w-0">
          <WelcomeSection totalReviews={reviews ? reviews.length : 0} />
          <MyReviewsList key={reviewRefreshKey} />
        </div>
        <div className="w-full md:w-96">
          {/* Favorite Faculties Section */}
          {me && favoriteFaculties.length > 0 && (
            <div className="mb-6 bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <HeartIcon className="h-6 w-6 text-red-400" />
                Favorite Faculties
              </h3>
              <ul className="space-y-2">
                {favoriteFaculties.map((faculty) => (
                  <li
                    key={faculty._id}
                    className="flex items-center justify-between bg-gray-50 rounded px-3 py-2"
                  >
                    <span className="font-medium text-gray-800">
                      {faculty.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        title="View Faculty"
                        className="p-1 rounded hover:bg-blue-100"
                        onClick={() => handleViewFaculty(faculty._id)}
                      >
                        <EyeIcon className="h-5 w-5 text-blue-500" />
                      </button>
                      <button
                        title="Remove from favorites"
                        className="p-1 rounded hover:bg-red-100"
                        onClick={() => handleUnfavorite(faculty._id)}
                        disabled={favoritesLoading}
                      >
                        <HeartIcon className="h-5 w-5 text-red-400" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <NotificationsPanel />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
