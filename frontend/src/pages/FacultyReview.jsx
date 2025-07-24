import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetFacultiesQuery,
  useGetFacultyReviewsQuery,
  useGetMeQuery,
  useLikeReviewMutation,
  useDislikeReviewMutation,
  useGetFavoriteFacultiesQuery,
  useAddFavoriteFacultyMutation,
  useRemoveFavoriteFacultyMutation,
} from "../redux/apiSlice";
import Header from "../components/Header";
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
  FlagIcon,
  UserCircleIcon,
  StarIcon,
  HeartIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { Menu } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// Animated count component
function LikeCount({ value }) {
  const [animate, setAnimate] = useState(false);
  const prevValue = useRef(value);

  React.useEffect(() => {
    if (prevValue.current !== value) {
      setAnimate(true);
      prevValue.current = value;
      const timeout = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [value]);

  return (
    <span
      className={`inline-block transition-transform duration-200 ${
        animate ? "scale-125 animate-bounce" : ""
      }`}
      style={{
        willChange: "transform",
      }}
    >
      {value}
    </span>
  );
}

const FacultyReview = () => {
  const { id } = useParams();
  const { data: faculties = [] } = useGetFacultiesQuery(undefined, {
    pollingInterval: 10000,
  });
  const {
    data: reviews = [],
    isLoading: reviewsLoading,
    refetch,
  } = useGetFacultyReviewsQuery(id, { pollingInterval: 10000 });
  const { data: me } = useGetMeQuery(undefined, { pollingInterval: 10000 });
  const [likeReview, { isLoading: liking }] = useLikeReviewMutation();
  const [dislikeReview, { isLoading: disliking }] = useDislikeReviewMutation();

  // Favorite faculty logic
  const {
    data: favoriteFaculties = [],
    refetch: refetchFavorites,
    isLoading: favoritesLoading,
  } = useGetFavoriteFacultiesQuery(undefined, { skip: !me });
  const [addFavorite] = useAddFavoriteFacultyMutation();
  const [removeFavorite] = useRemoveFavoriteFacultyMutation();

  const faculty = faculties.find((f) => f._id === id);
  const userId = me?._id;

  // Check if this faculty is a favorite
  const isFavorite =
    !!me &&
    favoriteFaculties.some &&
    favoriteFaculties.some((f) => f._id === id);

  // Handle favorite button click
  const handleFavoriteClick = async () => {
    if (!me) {
      alert("Please log in first to favorite a faculty.");
      window.location.href = "/login";
      return;
    }
    if (isFavorite) {
      await removeFavorite(id);
    } else {
      await addFavorite(id);
    }
    refetchFavorites();
  };

  const handleLike = async (reviewId) => {
    if (!userId) return;
    await likeReview(reviewId);
    refetch();
  };

  const handleDislike = async (reviewId) => {
    if (!userId) return;
    await dislikeReview(reviewId);
    refetch();
  };

  return (
    <>
      <Header />
      <motion.div
        className="min-h-screen bg-gray-50 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
      >
        <div className="max-w-3xl mx-auto px-4">
          {/* Faculty Info */}
          <AnimatePresence>
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, scale: 0.97, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 20 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 90 }}
              layout
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Name and tags */}
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                      {faculty ? faculty.name : "Faculty Name"}
                    </h1>
                    {/* Favorite Button */}
                    <motion.button
                      className={`ml-2 p-2 rounded-full border transition ${
                        isFavorite
                          ? "bg-red-100 text-red-500 border-red-200"
                          : "bg-gray-100 text-gray-400 border-gray-200 hover:bg-red-50 hover:text-red-500"
                      }`}
                      title={
                        me
                          ? isFavorite
                            ? "Remove from favorites"
                            : "Save as favorite"
                          : "Please log in to favorite"
                      }
                      onClick={handleFavoriteClick}
                      disabled={favoritesLoading}
                      style={{ outline: "none" }}
                      whileTap={{ scale: 1.2 }}
                      animate={
                        isFavorite ? { scale: [1, 1.3, 1] } : { scale: 1 }
                      }
                      transition={{
                        duration: 0.35,
                        type: "spring",
                        stiffness: 300,
                      }}
                    >
                      <HeartIcon
                        className={`h-6 w-6 ${
                          isFavorite ? "fill-red-500" : "fill-none"
                        }`}
                      />
                    </motion.button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                      {faculty ? faculty.initial : "Initial"}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                      {faculty && faculty.department
                        ? faculty.department
                        : "CSE"}
                    </span>
                    {(faculty && faculty.taughtCourses
                      ? faculty.taughtCourses
                      : ["CSE110", "CSE220", "CSE230"]
                    ).map((course) => (
                      <span
                        key={course}
                        className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Average Rating */}
                <div className="flex flex-col items-center">
                  <span className="text-gray-500 text-sm mb-1">
                    Average Rating
                  </span>
                  <div className="rounded-full bg-yellow-100 flex items-center justify-center w-24 h-24 shadow-inner">
                    <span className="text-4xl font-bold text-yellow-500">
                      {faculty && faculty.averageRating
                        ? faculty.averageRating.toFixed(2)
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          {/* Reviews Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Reviews
            </h2>
            {reviewsLoading ? (
              <div className="text-gray-500">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="text-gray-400 italic">No reviews yet.</div>
            ) : (
              <motion.div
                className="space-y-4 max-h-[400px] overflow-y-auto"
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
                <AnimatePresence>
                  {reviews.map((review, idx) => {
                    const liked = userId
                      ? review.likes?.some((id) => id === userId)
                      : false;
                    const disliked = userId
                      ? review.dislikes?.some((id) => id === userId)
                      : false;
                    return (
                      <motion.div
                        key={review._id}
                        className="bg-white rounded-lg shadow p-4 flex flex-col gap-2"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 30 }}
                        transition={{ duration: 0.35, delay: idx * 0.05 }}
                        layout
                      >
                        {/* Top row: rating, user, date */}
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-14 h-14 bg-yellow-100 rounded-lg flex items-center justify-center text-2xl font-bold text-yellow-500 shadow-inner">
                              {review.rating}
                              <StarIcon className="h-5 w-5 text-yellow-400 ml-1" />
                            </div>
                            <div className="ml-2 flex items-center gap-1 text-gray-700 font-medium">
                              <UserCircleIcon className="h-5 w-5 text-gray-400" />
                              {review.isAdmin
                                ? "Posted by Admin, from Public groups"
                                : review.user?.name || "Anonymous"}
                            </div>
                          </div>
                          <div className="text-gray-400 text-sm font-mono">
                            {formatDate(review.createdAt)}
                          </div>
                        </div>
                        {/* Review text */}
                        <div className="text-gray-800 font-medium mt-2">
                          {review.text}
                        </div>
                        {/* Like/Dislike/Flag buttons */}
                        <div className="flex items-center gap-6 mt-2">
                          {/* Like Button */}
                          <button
                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition ${
                              liked
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-500 hover:bg-blue-50"
                            }`}
                            disabled={!userId || liking}
                            onClick={() => handleLike(review._id)}
                            title={
                              !userId
                                ? "Login to like"
                                : liked
                                ? "Unlike"
                                : "Like"
                            }
                          >
                            <HandThumbUpIcon className="h-5 w-5" />
                            <LikeCount value={review.likes?.length || 0} />
                          </button>
                          {/* Dislike Button */}
                          <button
                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition ${
                              disliked
                                ? "bg-red-100 text-red-600"
                                : "bg-gray-100 text-gray-500 hover:bg-red-50"
                            }`}
                            disabled={!userId || disliking}
                            onClick={() => handleDislike(review._id)}
                            title={
                              !userId
                                ? "Login to dislike"
                                : disliked
                                ? "Remove dislike"
                                : "Dislike"
                            }
                          >
                            <HandThumbDownIcon className="h-5 w-5" />
                            <LikeCount value={review.dislikes?.length || 0} />
                          </button>
                          {/* Flag Button */}
                          <button
                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition ${
                              review.flags?.some?.((f) => f.user === userId)
                                ? "bg-yellow-100 text-yellow-600 cursor-not-allowed opacity-60"
                                : "bg-gray-100 text-gray-500 hover:bg-yellow-50"
                            }`}
                            disabled={
                              !userId ||
                              review.flags?.some?.((f) => f.user === userId)
                            }
                            onClick={async () => {
                              if (!userId) {
                                alert("Please log in to flag a review.");
                                window.location.href = "/login";
                                return;
                              }
                              if (
                                review.flags?.some?.((f) => f.user === userId)
                              ) {
                                alert("You have already flagged this review.");
                                return;
                              }
                              try {
                                const res = await fetch(
                                  `http://192.168.0.200:4000/api/reviews/${review._id}/flag`,
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                      Authorization: `Bearer ${
                                        JSON.parse(
                                          localStorage.getItem("authData") ||
                                            "{}"
                                        ).token || ""
                                      }`,
                                    },
                                  }
                                );
                                const data = await res.json();
                                if (res.ok) {
                                  alert("Review flagged for admin review.");
                                  refetch();
                                } else {
                                  alert(
                                    data?.message ||
                                      "Failed to flag review. Try again."
                                  );
                                }
                              } catch {
                                alert("Failed to flag review. Try again.");
                              }
                            }}
                            title={
                              review.flags?.some?.((f) => f.user === userId)
                                ? "You have already flagged this review"
                                : !userId
                                ? "Login to flag"
                                : "Flag as inappropriate"
                            }
                          >
                            <FlagIcon className="h-5 w-5" />
                            <span>
                              {review.flags?.length > 0
                                ? `Flag${review.flags.length > 1 ? "s" : ""} (${
                                    review.flags.length
                                  })`
                                : "Flag"}
                            </span>
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default FacultyReview;
