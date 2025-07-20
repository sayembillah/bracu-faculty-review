import React, { useState } from "react";
import {
  useGetMyReviewsQuery,
  useDeleteReviewMutation,
  useUpdateReviewMutation,
} from "../redux/apiSlice";
import {
  PencilSquareIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";

const EditReviewModal = ({ open, onClose, review, onSave, isLoading }) => {
  const [text, setText] = useState(review?.text || "");
  const [rating, setRating] = useState(review?.rating || 1);

  // Reset form when review changes
  React.useEffect(() => {
    setText(review?.text || "");
    setRating(review?.rating || 1);
  }, [review]);

  return (
    <Transition show={open} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
              <Dialog.Title className="text-lg font-semibold mb-2">
                Edit Review
              </Dialog.Title>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSave({ text, rating });
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Review Text
                  </label>
                  <textarea
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-400"
                    rows={3}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <select
                    className="w-24 border rounded-md p-2 focus:ring-2 focus:ring-blue-400"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    className="px-4 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-md bg-blue-600 text-white hover:bg-blue-700 font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

const MyReviewsList = ({ onReviewChange }) => {
  const { data: reviews, isLoading, error, refetch } = useGetMyReviewsQuery();
  const [deleteReview] = useDeleteReviewMutation();
  const [deletingId, setDeletingId] = useState(null);
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // Quick search state
  const [search, setSearch] = useState("");

  // Filter reviews by faculty name or initial
  const filteredReviews =
    reviews && search
      ? reviews.filter(
          (review) =>
            review.faculty?.name.toLowerCase().includes(search.toLowerCase()) ||
            review.faculty?.initial.toLowerCase().includes(search.toLowerCase())
        )
      : reviews;

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      setDeletingId(id);
      await deleteReview(id);
      setDeletingId(null);
      refetch();
      if (onReviewChange) onReviewChange();
    }
  };

  const handleEdit = (review) => {
    setSelectedReview(review);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedFields) => {
    await updateReview({ id: selectedReview._id, ...updatedFields });
    setEditModalOpen(false);
    setSelectedReview(null);
    refetch();
    if (onReviewChange) onReviewChange();
  };

  if (isLoading)
    return (
      <div className="p-6 rounded-xl bg-white shadow mb-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-40 mb-4" />
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  if (error)
    return (
      <div className="p-6 rounded-xl bg-red-50 text-red-700 shadow mb-6">
        Error loading reviews.
      </div>
    );

  if (!reviews || reviews.length === 0)
    return (
      <div className="p-6 rounded-xl bg-white shadow mb-6 text-gray-500">
        You have not submitted any reviews yet.
      </div>
    );

  return (
    <div className="p-6 rounded-xl bg-white shadow mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h3 className="text-xl font-semibold text-gray-800">My Reviews</h3>
        {/* Quick Search Bar */}
        <div className="w-full md:w-72">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Search by faculty name or initial"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search reviews"
            />
          </div>
        </div>
      </div>
      <ul
        className="space-y-4 overflow-y-auto scroll-smooth max-h-96 md:max-h-[32rem] sm:max-h-80 pr-1 custom-scrollbar"
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        {filteredReviews && filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <li
              key={review._id}
              className="border border-gray-200 rounded-lg p-4 flex flex-col gap-2 hover:shadow transition"
            >
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-medium">Faculty:</span>
                <span>
                  {review.faculty?.name} ({review.faculty?.initial})
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-medium">Rating:</span>
                <span>{review.rating} / 5</span>
              </div>
              <div className="text-gray-700">
                <span className="font-medium">Review:</span> {review.text}
              </div>
              <div className="text-gray-500 text-sm">
                <span className="font-medium">Date:</span>{" "}
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
              {/* Like/Dislike counts */}
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1 text-green-600">
                  <HandThumbUpIcon className="h-5 w-5" />
                  {review.likes ? review.likes.length : 0}
                </span>
                <span className="flex items-center gap-1 text-red-600">
                  <HandThumbDownIcon className="h-5 w-5" />
                  {review.dislikes ? review.dislikes.length : 0}
                </span>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium transition"
                  onClick={() => handleEdit(review)}
                  disabled={deletingId === review._id}
                  type="button"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                  Edit
                </button>
                <button
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-50 text-red-700 hover:bg-red-100 font-medium transition"
                  onClick={() => handleDelete(review._id)}
                  disabled={deletingId === review._id}
                  type="button"
                >
                  <TrashIcon className="h-5 w-5" />
                  {deletingId === review._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="text-gray-500 text-center py-8">
            No reviews found for your search.
          </li>
        )}
      </ul>
      <EditReviewModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        review={selectedReview}
        onSave={handleSaveEdit}
        isLoading={isUpdating}
      />
    </div>
  );
};

export default MyReviewsList;
