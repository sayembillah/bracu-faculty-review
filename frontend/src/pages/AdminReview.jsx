import React, { useEffect, useState } from "react";
import { TrashIcon, EyeIcon, FlagIcon } from "@heroicons/react/24/outline";

const API_BASE = "http://192.168.0.200:4000/api/admin";

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

const AdminReview = () => {
  const [flagged, setFlagged] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFlagged = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/flagged-reviews`, {
        headers: getAuthHeader(),
        credentials: "include",
      });
      const data = await res.json();
      setFlagged(Array.isArray(data) ? data : []);
    } catch {
      setFlagged([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFlagged();
    // Optionally, poll every 30s
    // const interval = setInterval(fetchFlagged, 30000);
    // return () => clearInterval(interval);
  }, []);

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      const res = await fetch(`${API_BASE}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: getAuthHeader(),
        credentials: "include",
      });
      if (res.ok) {
        setFlagged((prev) => prev.filter((r) => r._id !== reviewId));
      } else {
        alert("Failed to delete review.");
      }
    } catch {
      alert("Failed to delete review.");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Review Management</h1>
      <div className="mb-6 text-gray-600">
        Below are reviews flagged by users. You can review and delete them.
      </div>
      {loading ? (
        <div className="text-gray-500">Loading flagged reviews...</div>
      ) : flagged.length === 0 ? (
        <div className="text-gray-400 italic">No flagged reviews.</div>
      ) : (
        <div
          className="overflow-x-auto bg-white rounded-lg shadow"
          style={{ maxHeight: 500 }}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-yellow-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                  Faculty
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                  Reviewer
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                  Review
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">
                  Flags
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {flagged.map((review) => (
                <tr key={review._id} className="hover:bg-yellow-50 transition">
                  <td className="px-4 py-3">
                    {review.faculty?.name || "Unknown"}
                  </td>
                  <td className="px-4 py-3">
                    {review.user?.name || "Anonymous"}
                  </td>
                  <td className="px-4 py-3">{review.text}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 text-yellow-700 font-semibold">
                      <FlagIcon className="h-5 w-5" />
                      {review.flags?.length || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(review._id)}
                      title="Delete Review"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminReview;
