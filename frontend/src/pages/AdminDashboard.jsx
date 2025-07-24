import React from "react";
import {
  useGetFacultiesQuery,
  useGetAdminMetricsQuery,
} from "../redux/apiSlice";
import NotificationsPanel from "./NotificationsPanel";
import {
  UserGroupIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { Tab } from "@headlessui/react";
import { useGetRecentActivitiesQuery } from "../redux/apiSlice";
import { ClockIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const cardData = (metrics, loading) => [
  {
    title: "Total Users",
    value: loading ? "..." : metrics?.userCount ?? "N/A",
    icon: <UserGroupIcon className="h-8 w-8 text-blue-500" />,
    bg: "bg-blue-50",
  },
  {
    title: "Total Faculties",
    value: loading ? "..." : metrics?.facultyCount ?? "N/A",
    icon: <AcademicCapIcon className="h-8 w-8 text-green-500" />,
    bg: "bg-green-50",
  },
  {
    title: "Total Reviews",
    value: loading ? "..." : metrics?.reviewCount ?? "N/A",
    icon: <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-500" />,
    bg: "bg-purple-50",
  },
  {
    title: "Total Visitors",
    value: loading ? "..." : metrics?.visitorCount ?? "N/A",
    icon: <EyeIcon className="h-8 w-8 text-yellow-500" />,
    bg: "bg-yellow-50",
  },
];

const AdminDashboard = () => {
  const { data: metricsData, isLoading: metricsLoading } =
    useGetAdminMetricsQuery();

  return (
    <div className="p-8">
      <h1
        className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-800 to-blue-600 text-transparent bg-clip-text"
        style={{ letterSpacing: "-0.02em" }}
      >
        Welcome, Admin!
      </h1>
      <div className="flex items-center mb-8">
        <span className="inline-block w-1 h-6 bg-blue-500 rounded-full mr-3"></span>
        <span className="text-lg text-gray-500 font-medium tracking-wide">
          Here are your latest metrics:
        </span>
      </div>
      <div className="border border-gray-200 rounded-2xl bg-white/50 shadow-sm p-6 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {cardData(metricsData, metricsLoading).map((card, idx) => (
              <motion.div
                key={card.title}
                className={`rounded-xl shadow-md p-6 flex flex-col items-center ${card.bg} transition hover:scale-105 hover:shadow-lg`}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.08,
                  type: "spring",
                  stiffness: 80,
                }}
                layout
              >
                <div className="mb-2">{card.icon}</div>
                <div className="text-2xl font-semibold">{card.value}</div>
                <div className="text-gray-600 mt-1">{card.title}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      {/* Tabs Section */}
      <div className="mt-8">
        <Tab.Group>
          <Tab.List className="flex space-x-2 rounded-xl bg-gray-100 p-1 w-full max-w-xl mx-auto">
            {["Activities", "Notification", "Requests"].map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  `w-full py-2.5 text-sm leading-5 font-semibold rounded-lg
                  ${
                    selected
                      ? "bg-white shadow text-blue-700"
                      : "text-gray-500 hover:bg-white/[0.6]"
                  }`
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-4">
            <AnimatePresence mode="wait">
              {/* Activities Tab */}
              <Tab.Panel key="activities">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30 }}
                  transition={{ duration: 0.35, type: "tween" }}
                >
                  <ActivitiesTab />
                </motion.div>
              </Tab.Panel>
              {/* Notification Tab */}
              <Tab.Panel key="notifications">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35, type: "tween" }}
                >
                  <NotificationsPanel />
                </motion.div>
              </Tab.Panel>
              {/* Requests Tab */}
              <Tab.Panel key="requests">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.35, type: "tween" }}
                >
                  <div className="text-center text-gray-400 py-8">
                    No requests at this time.
                  </div>
                </motion.div>
              </Tab.Panel>
            </AnimatePresence>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

// ActivitiesTab component
function ActivitiesTab() {
  const { data, isLoading, error } = useGetRecentActivitiesQuery(20);

  if (isLoading) {
    return (
      <div className="text-center text-gray-400 py-8">
        Loading activities...
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center text-red-400 py-8">
        Failed to load activities.
      </div>
    );
  }
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No recent activities.
      </div>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 rounded-lg border border-gray-100 bg-white/70 shadow-sm">
      {data.map((activity, idx) => (
        <div key={activity._id || idx} className="flex items-center px-4 py-3">
          <ClockIcon className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-sm text-gray-700">
              <span className="font-medium text-blue-700">
                {activity.user?.name || "Unknown User"}
              </span>
              {" — "}
              {activity.description}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {new Date(activity.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
