import React, { useState } from "react";
import WelcomeSection from "./WelcomeSection";
import MyReviewsList from "./MyReviewsList";
import NotificationsPanel from "./NotificationsPanel";
import UserNavbar from "../components/navbar/UserNavbar";
import { useGetMyReviewsQuery } from "../redux/apiSlice";

const UserDashboard = () => {
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0);
  const { data: reviews } = useGetMyReviewsQuery(undefined, {
    pollingInterval: 10000,
  });

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
          <NotificationsPanel />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
