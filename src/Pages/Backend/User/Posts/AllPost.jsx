// AllPost.jsx
import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router";
import { AuthContext } from "../../../../Provider/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const AllPost = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await axios.get("http://localhost:3000/mypost", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch (error) {
      setError("⚠️ Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    const token = await user.getIdToken();
    await axios.delete(`http://localhost:3000/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchPosts();
    Swal.fire("Deleted!", "Your post has been deleted.", "success");
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.h2
        className="text-3xl font-bold text-center text-blue-700 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        📝 My Posted Articles
      </motion.h2>

      {loading ? (
        <div className="text-center text-blue-500 animate-pulse">Loading posts...</div>
      ) : error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-500">No posts found.</div>
      ) : (
        <div className="overflow-x-auto shadow rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-100 bg-white rounded-xl">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Title</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Votes(Rating)</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Comments</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Delete</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, i) => (
                <motion.tr
                  key={post._id}
                  className="hover:bg-gray-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <td className="px-6 py-4 font-medium">{post.title}</td>
             <td className="px-6 py-4 text-center">
  {(Number(post.upvotes) || 0) - (Number(post.downvotes) || 0)}
</td>

                  <td className="px-6 py-4 text-center">
                    <NavLink
                      to={`/dashboard/comments/${post._id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md"
                    >
                      View
                    </NavLink>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllPost;
