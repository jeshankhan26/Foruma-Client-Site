import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { FaRegFileAlt, FaComments, FaUsers } from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend);

const AnnouncementBanner = () => {
  const [postsCount, setPostsCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [postsRes, commentsRes, usersRes] = await Promise.all([
          axios.get("http://localhost:3000/posts"),
          axios.get("http://localhost:3000/allcomments"),
          axios.get("http://localhost:3000/adduser"),
        ]);

        setPostsCount(postsRes.data.length || 0);
        setCommentsCount(commentsRes.data.length || 0);
        const users = usersRes.data || [];
        const filteredUsers = users.filter((user) => user.role === "user");
        setUsersCount(filteredUsers.length);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching counts:", error);
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const data = {
    labels: ["Posts", "Comments", "Users"],
    datasets: [
      {
        label: "Counts",
        data: [postsCount, commentsCount, usersCount],
        backgroundColor: ["#8dd3c7", "#ffffb3", "#bebada"], // soft pastel colors
        hoverBackgroundColor: ["#64b9aa", "#e6e679", "#9f8fc4"],
        borderWidth: 1,
        borderColor: "#ddd",
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-6 animate-fadeIn">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-4 border-b-4 border-indigo-400 inline-block pb-1">
        🎉 Dashboard Analytics
      </h2>
      <p className="text-gray-600 mb-8">
        Real-time insights of your site’s activity at a glance.
      </p>

      {loading ? (
        <p className="text-center text-gray-500">Loading data...</p>
      ) : (
        <>
          <div className="flex justify-around mb-10">
            <StatCard
              icon={<FaRegFileAlt className="text-indigo-500 w-8 h-8" />}
              count={postsCount}
              label="Posts"
              color="indigo"
            />
            <StatCard
              icon={<FaComments className="text-yellow-500 w-8 h-8" />}
              count={commentsCount}
              label="Comments"
              color="yellow"
            />
            <StatCard
              icon={<FaUsers className="text-purple-500 w-8 h-8" />}
              count={usersCount}
              label="Users"
              color="purple"
            />
          </div>

          <div className="max-w-xs mx-auto shadow-lg rounded-lg overflow-hidden">
            <Pie data={data} />
          </div>
        </>
      )}
    </div>
  );
};

const StatCard = ({ icon, count, label, color }) => {
  const bgColors = {
    indigo: "bg-indigo-100",
    yellow: "bg-yellow-100",
    purple: "bg-purple-100",
  };

  const textColors = {
    indigo: "text-indigo-700",
    yellow: "text-yellow-700",
    purple: "text-purple-700",
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className={`${bgColors[color]} rounded-full w-20 h-20 flex items-center justify-center shadow-md transform transition-transform hover:scale-110`}
      >
        {icon}
      </div>
      <p
        className={`text-4xl font-extrabold ${textColors[color]} tracking-tight`}
      >
        {count}
      </p>
      <p className="text-gray-500 uppercase tracking-wide font-semibold">
        {label}
      </p>
    </div>
  );
};

export default AnnouncementBanner;
