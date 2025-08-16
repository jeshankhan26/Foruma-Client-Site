import React, { useEffect, useState } from "react";
import axios from "axios";

const Discussion = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get("http://localhost:3000/allcomments");
        setComments(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch comments.");
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-xl">Loading comments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Discussion</h1>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-gray-50 p-5 rounded-lg shadow hover:shadow-lg transition"
          >
            <p className="text-gray-800 font-semibold">{comment.userName}</p>
            <p className="text-gray-700 mt-1">{comment.postTitle}</p>
            <p className="text-gray-700 mt-1">{comment.commentText}</p>
            <p className="text-gray-400 text-sm mt-2">
              Posted on: {new Date(comment.time).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discussion;
