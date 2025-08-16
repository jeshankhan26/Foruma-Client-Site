import React, { useEffect, useState, useContext } from "react";
import { Users, MessageSquare, FileText, User } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../../Provider/AuthContext"; // Adjust path as needed

const StatCard = () => {
  const { user } = useContext(AuthContext); // Assuming you store admin info here

  const [stats, setStats] = useState({
    postsCount: 0,
    commentsCount: 0,
    usersCount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [postsRes, commentsRes, usersRes] = await Promise.all([
          axios.get("http://localhost:3000/posts"),
          axios.get("http://localhost:3000/allcomments"),
          axios.get("http://localhost:3000/adduser"),
        ]);

        const users = usersRes.data || [];
        const userCount = users.filter((u) => u.role === "user").length;

        setStats({
          postsCount: postsRes.data.length,
          commentsCount: commentsRes.data.length,
          usersCount: userCount,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  const statList = [
    {
      label: "Total Posts",
      value: stats.postsCount,
      icon: <FileText className="w-6 h-6" />,
    },
    {
      label: "Total Comments",
      value: stats.commentsCount,
      icon: <MessageSquare className="w-6 h-6" />,
    },
    {
      label: "Total Users",
      value: stats.usersCount,
      icon: <Users className="w-6 h-6" />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Admin Info */}
      <div className="flex items-center gap-4 bg-white shadow-md rounded-2xl p-6">
        <img
          src={user?.photoURL || "https://via.placeholder.com/150"}
          alt="Admin"
          className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
        />
        <div>
          <h2 className="text-xl font-semibold">{user?.displayName || "Admin Name"}</h2>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statList.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white shadow-md rounded-2xl p-5 flex items-center gap-4 transition hover:scale-105 duration-300"
          >
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatCard;
