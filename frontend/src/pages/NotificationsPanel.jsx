import React from "react";
import { useGetMyNotificationsQuery } from "../redux/apiSlice";
import { BellIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

const NotificationsPanel = () => {
  const {
    data: notifications,
    isLoading,
    error,
  } = useGetMyNotificationsQuery();

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
            <div>
              <div className="text-gray-700">{n.message}</div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationsPanel;
