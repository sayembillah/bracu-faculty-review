import React from "react";
import { useGetMyNotificationsQuery } from "../redux/apiSlice";
import {
  BellIcon,
  CheckCircleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

const NotificationsPanel = () => {
  const {
    data: notifications,
    isLoading,
    error,
  } = useGetMyNotificationsQuery(undefined, { pollingInterval: 10000 });

  const [deleting, setDeleting] = React.useState({});

  if (isLoading)
    return (
      <div className="p-6 rounded-xl bg-white shadow mb-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32 mb-4" />
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  if (error)
    return (
      <div className="p-6 rounded-xl bg-red-50 text-red-700 shadow mb-6">
        Error loading notifications.
      </div>
    );

  if (!notifications || notifications.length === 0)
    return (
      <div className="p-6 rounded-xl bg-white shadow mb-6 text-gray-500">
        <BellIcon className="h-6 w-6 inline-block mr-2 text-gray-400" />
        No notifications.
      </div>
    );

  const handleDelete = async (id) => {
    if (!window.confirm("Mark this notification as done?")) return;
    setDeleting((prev) => ({ ...prev, [id]: true }));
    try {
      const authData = localStorage.getItem("authData");
      let token;
      if (authData) {
        try {
          token = JSON.parse(authData).token;
        } catch {
          token = null;
        }
      }
      await fetch(`http://192.168.0.200:4000/api/user/notifications/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      // Remove from UI
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch {
      alert("Failed to delete notification.");
    }
    setDeleting((prev) => ({ ...prev, [id]: false }));
  };

  return (
    <div className="p-6 rounded-xl bg-white shadow mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <BellIcon className="h-6 w-6 text-blue-500" />
        Notifications
      </h3>
      <ul className="space-y-3">
        {notifications.map((n) => (
          <li
            key={n._id}
            className={`flex items-start gap-3 border rounded-lg p-3 ${
              n.read
                ? "bg-gray-50 border-gray-200"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            {n.read ? (
              <CheckCircleIcon className="h-5 w-5 text-green-400 mt-1" />
            ) : (
              <BellIcon className="h-5 w-5 text-blue-400 mt-1" />
            )}
            <div className="flex-1">
              <div className="text-gray-700 flex items-center gap-2">
                {n.message}
                {n.type === "flag" && (
                  <a
                    href="/admin/review"
                    className="ml-2 text-blue-600 hover:text-blue-800"
                    title="View flagged reviews"
                  >
                    <EyeIcon className="h-5 w-5 inline" />
                  </a>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </div>
            <button
              className="ml-2 text-green-600 hover:text-green-800"
              title="Mark as done"
              onClick={() => handleDelete(n._id)}
              disabled={deleting[n._id]}
            >
              <CheckCircleIcon className="h-5 w-5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPanel;
