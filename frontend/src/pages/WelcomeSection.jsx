import React from "react";
import { useGetMeQuery } from "../redux/apiSlice";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const WelcomeSection = ({ totalReviews }) => {
  const {
    data: user,
    isLoading,
    error,
  } = useGetMeQuery(undefined, { pollingInterval: 10000 });

  if (isLoading)
    return (
      <div className="mb-8 p-6 rounded-xl bg-white shadow flex items-center gap-4">
        <div className="animate-pulse h-12 w-12 bg-gray-200 rounded-full" />
        <div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-24" />
        </div>
      </div>
    );
  if (error)
    return (
      <div className="mb-8 p-6 rounded-xl bg-red-50 text-red-700 shadow">
        Error loading user info.
      </div>
    );

  return (
    <div className="mb-8 p-6 rounded-xl bg-white shadow flex items-center gap-4">
      <UserCircleIcon className="h-12 w-12 text-blue-500" />
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome, {user?.name ? user.name : "User"}!
        </h2>
        <p className="text-gray-600 mt-1">
          You have submitted{" "}
          <span className="font-semibold text-blue-600">{totalReviews}</span>{" "}
          review{totalReviews === 1 ? "" : "s"}.
        </p>
      </div>
    </div>
  );
};

export default WelcomeSection;
