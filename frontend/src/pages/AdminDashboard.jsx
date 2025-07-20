import React from "react";
import { useGetFacultiesQuery } from "../redux/apiSlice";
import {
  UserGroupIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

const cardData = [
  {
    title: "Total Users",
    value: "N/A", // TODO: Replace with real user count from API
    icon: <UserGroupIcon className="h-8 w-8 text-blue-500" />,
    bg: "bg-blue-50",
  },
  {
    title: "Total Faculties",
    value: null, // Will be set from API
    icon: <AcademicCapIcon className="h-8 w-8 text-green-500" />,
    bg: "bg-green-50",
  },
  {
    title: "Total Reviews",
    value: "N/A", // TODO: Replace with real review count from API
    icon: <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-500" />,
    bg: "bg-purple-50",
  },
  {
    title: "Total Visitors",
    value: "1234", // Placeholder
    icon: <EyeIcon className="h-8 w-8 text-yellow-500" />,
    bg: "bg-yellow-50",
  },
];

const AdminDashboard = () => {
  const { data: faculties, isLoading: facultiesLoading } =
    useGetFacultiesQuery();

  // Set faculty count in cardData
  const metrics = cardData.map((card) =>
    card.title === "Total Faculties"
      ? { ...card, value: facultiesLoading ? "..." : faculties?.length ?? 0 }
      : card
  );

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
          {metrics.map((card) => (
            <div
              key={card.title}
              className={`rounded-xl shadow-md p-6 flex flex-col items-center ${card.bg} transition hover:scale-105 hover:shadow-lg`}
            >
              <div className="mb-2">{card.icon}</div>
              <div className="text-2xl font-semibold">{card.value}</div>
              <div className="text-gray-600 mt-1">{card.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
