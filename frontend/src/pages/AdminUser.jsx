import React, { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  MagnifyingGlassIcon,
  EyeIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import dayjs from "dayjs";

const API_BASE = "http://192.168.0.200:4000/api/admin";

// Helper to get auth header
const getAuthHeader = () => {
  const authData = localStorage.getItem("authData");
  let token;
  if (authData) {
    try {
      token = JSON.parse(authData).token;
    } catch (e) {
      token = null;
    }
  }
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Fetch users
  const fetchUsers = async (searchTerm = "") => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/users`, {
        params: searchTerm ? { search: searchTerm } : {},
        headers: getAuthHeader(),
        withCredentials: true,
      });
      if (Array.isArray(res.data)) {
        setUsers(res.data);
      } else {
        setUsers([]);
      }
    } catch {
      setUsers([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Real-time search as you type (debounced)
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchUsers(search);
    }, 300); // 300ms debounce
    return () => clearTimeout(handler);
  }, [search]);

  // Open modal and fetch reviews
  const handleOpenModal = async (user) => {
    setSelectedUser(user);
    setModalOpen(true);
    setReviewsLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/users/${user._id}/reviews`, {
        headers: getAuthHeader(),
        withCredentials: true,
      });
      setReviews(res.data);
    } catch {
      setReviews([]);
    }
    setReviewsLoading(false);
  };

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await axios.delete(`${API_BASE}/reviews/${reviewId}`, {
        headers: getAuthHeader(),
        withCredentials: true,
      });
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch {
      // handle error
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-green-700">
        Admin User Management
      </h1>
      {/* Real-time Search Bar */}
      <div className="flex items-center mb-4 gap-2">
        <input
          type="text"
          placeholder="Search by name or email"
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <MagnifyingGlassIcon className="h-5 w-5 text-green-600" />
      </div>
      {/* User Table */}
      <div
        className="overflow-x-auto bg-white rounded-lg shadow"
        style={{ maxHeight: 500, minHeight: 200 }}
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                Email
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">
                # Reviews
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                Joined
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                Last Login
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">
                Delete
              </th>
            </tr>
          </thead>
          <tbody className="overflow-y-auto">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-green-50 transition">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      className="inline-flex items-center text-green-600 hover:text-green-800"
                      onClick={() => handleOpenModal(user)}
                      title="View Reviews"
                    >
                      <EyeIcon className="h-5 w-5 mr-1" />
                      {user.reviewCount}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {dayjs(user.createdAt).format("YYYY-MM-DD")}
                  </td>
                  <td className="px-4 py-3">
                    {user.lastLogin
                      ? dayjs(user.lastLogin).format("YYYY-MM-DD HH:mm")
                      : "Never"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={async () => {
                        if (
                          window.confirm(
                            `Are you sure you want to permanently delete user "${user.name}"?`
                          )
                        ) {
                          try {
                            await axios.delete(
                              `${API_BASE}/users/${user._id}`,
                              {
                                headers: getAuthHeader(),
                                withCredentials: true,
                              }
                            );
                            setUsers((prev) =>
                              prev.filter((u) => u._id !== user._id)
                            );
                          } catch {
                            alert("Failed to delete user.");
                          }
                        }
                      }}
                      title="Delete User"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Reviews Modal */}
      <Transition show={modalOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setModalOpen(false)}
        >
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
          </Transition.Child>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-200"
              enterFrom="scale-95 opacity-0"
              enterTo="scale-100 opacity-100"
              leave="ease-in duration-150"
              leaveFrom="scale-100 opacity-100"
              leaveTo="scale-95 opacity-0"
            >
              <Dialog.Panel className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-6">
                <Dialog.Title className="text-lg font-bold mb-2 text-green-700">
                  Reviews by {selectedUser?.name}
                </Dialog.Title>
                <div className="max-h-96 overflow-y-auto space-y-4">
                  {reviewsLoading ? (
                    <div className="text-center text-gray-500">
                      Loading reviews...
                    </div>
                  ) : reviews.length === 0 ? (
                    <div className="text-center text-gray-500">
                      No reviews found.
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div
                        key={review._id}
                        className="border rounded-md p-3 flex flex-col gap-1 bg-green-50"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">
                            {review.faculty?.name || "Unknown Faculty"}
                          </span>
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDeleteReview(review._id)}
                            title="Delete Review"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                        <div className="text-sm text-gray-700">
                          Rating: {review.rating}
                        </div>
                        <div className="text-sm text-gray-600">
                          {review.comment}
                        </div>
                        <div className="text-xs text-gray-400">
                          {dayjs(review.createdAt).format("YYYY-MM-DD HH:mm")}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                    onClick={() => setModalOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default AdminUser;
