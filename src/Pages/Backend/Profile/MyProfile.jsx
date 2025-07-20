import React, { useContext, useEffect, useState } from "react";
import { FaMedal } from "react-icons/fa";
import { AuthContext } from "../../../Provider/AuthContext";
import axios from "axios";
import { getAuth } from "firebase/auth";

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [membershipStatus, setMembershipStatus] = useState(0);

  // Fetch membership status
  const fetchMembershipStatus = async () => {
    try {
      const currentUser = getAuth().currentUser;
      if (!currentUser) {
        setMembershipStatus(0);
        return;
      }

      const token = await currentUser.getIdToken();

      const res = await axios.get("https://foruma-server-site.vercel.app/api/membership-status", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMembershipStatus(res.data.status ?? 0);
    } catch (err) {
      console.error("Failed to fetch membership status", err);
      setMembershipStatus(0);
    }
  };

  // Fetch posts
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const currentUser = getAuth().currentUser;
      if (!currentUser) {
        setPosts([]);
        setLoading(false);
        return;
      }

      const token = await currentUser.getIdToken();

      const res = await axios.get("https://foruma-server-site.vercel.app/mypost", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts(res.data);
    } catch (err) {
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchMembershipStatus();
      fetchPosts();
    }
  }, [user]);

  const badgeText = membershipStatus === 1 ? "Gold" : "Bronze";
  const badgeColor =
    membershipStatus === 1 ? "bg-yellow-400 text-black" : "bg-orange-400 text-white";

  const recentPosts = posts.slice(0, 3);

  return (
    <div className="p-6 md:p-10 min-h-screen bg-white text-gray-900">
      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-8">
        <img
          src={user?.photoURL}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-orange-400 shadow-md"
        />
        <div>
          <h2 className="text-3xl font-bold">{user?.displayName || "User"}</h2>
          <p className="text-gray-600">{user?.email}</p>
          <div
            className={`mt-3 inline-flex items-center px-4 py-1 rounded-full font-semibold shadow ${badgeColor}`}
          >
            <FaMedal className="mr-2" />
            {badgeText} Member
          </div>
        </div>
      </div>

      <hr className="my-6 border-gray-300" />

      {/* Recent Posts */}
      <h3 className="text-2xl font-semibold text-orange-500 mb-4">📝 Recent Posts</h3>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : recentPosts.length === 0 ? (
        <p className="text-gray-400">No posts found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <div
              key={post._id}
              className="bg-gray-50 border border-gray-200 rounded-lg p-5 shadow hover:shadow-md transition duration-200"
            >
              <h4 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h4>
              <p className="text-gray-600">{post.description.slice(0, 100)}...</p>
              <p className="text-sm text-gray-500 mt-3">
                🗓️ {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProfile;
