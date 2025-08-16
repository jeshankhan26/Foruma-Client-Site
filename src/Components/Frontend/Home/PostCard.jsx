import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Provider/AuthContext";
import Swal from "sweetalert2";

const PostCard = () => {
  const [posts, setPosts] = useState([]);
  const [sortPopular, setSortPopular] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useContext(AuthContext);
  const postsPerPage = 5;

  const [commentsMap, setCommentsMap] = useState({});
  const [newComments, setNewComments] = useState({});
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingComments, setLoadingComments] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoadingPosts(true);
    fetch("http://localhost:3000/posts")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch posts");
        return res.json();
      })
      .then((data) => {
        const sorted = data.sort((a, b) => new Date(b.time) - new Date(a.time));
        setPosts(sorted);
        sorted.forEach((post) => fetchComments(post.title));
        setLoadingPosts(false);
      })
      .catch((err) => {
        console.error("Failed to fetch posts:", err);
        setError("Failed to load posts.");
        setPosts([]);
        setLoadingPosts(false);
      });
  }, []);

  const fetchComments = (postTitle) => {
    setLoadingComments((prev) => ({ ...prev, [postTitle]: true }));
    fetch(`http://localhost:3000/comments?postTitle=${encodeURIComponent(postTitle)}`)
      .then((res) => res.json())
      .then((data) => {
        setCommentsMap((prev) => ({ ...prev, [postTitle]: data }));
        setLoadingComments((prev) => ({ ...prev, [postTitle]: false }));
      })
      .catch(() => {
        setCommentsMap((prev) => ({ ...prev, [postTitle]: [] }));
        setLoadingComments((prev) => ({ ...prev, [postTitle]: false }));
      });
  };

  const handleNewCommentChange = (postTitle, e) => {
    setNewComments((prev) => ({ ...prev, [postTitle]: e.target.value }));
  };

  const handleSubmitComment = (postTitle, postId) => {
    if (!user) {
      Swal.fire({
        title: "Please Login First!",
        text: "You need to be logged in to submit a comment.",
        icon: "warning",
        confirmButtonText: "Login",
      });
      return;
    }

    const commentText = newComments[postTitle];
    if (!commentText || commentText.trim() === "") {
      alert("Comment cannot be empty");
      return;
    }

    const userName = user.displayName;
    const userEmail = user.email;

    fetch("http://localhost:3000/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, postTitle, userName, userEmail, commentText }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.insertedId) {
          fetchComments(postTitle);
          setNewComments((prev) => ({ ...prev, [postTitle]: "" }));
        } else {
          alert("Failed to add comment");
        }
      })
      .catch(() => alert("Error adding comment"));
  };

  const handleUpvote = async (postId) => {
    try {
      const res = await fetch(`http://localhost:3000/posts/${postId}/upvote`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (data.success && data.updatedPost) {
        setPosts((prev) =>
          prev.map((p) => (p._id === postId ? data.updatedPost : p))
        );
        Swal.fire({
          title: "Upvoted!",
          text: "Your upvote has been registered.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownvote = async (postId) => {
    try {
      const res = await fetch(`http://localhost:3000/posts/${postId}/downvote`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (data.success && data.updatedPost) {
        setPosts((prev) =>
          prev.map((p) => (p._id === postId ? data.updatedPost : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getSortedPosts = () => {
    let sorted = [...posts];
    if (sortPopular) {
      sorted.sort((a, b) => {
        const aScore = (a.upvotes || 0) - (a.downvotes || 0);
        const bScore = (b.upvotes || 0) - (b.downvotes || 0);
        return bScore - aScore;
      });
    } else {
      sorted.sort((a, b) => new Date(b.time) - new Date(a.time));
    }
    return sorted;
  };

  const paginatedPosts = () => {
    const sorted = getSortedPosts();
    return sorted.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);
  };

  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div className="py-12 px-4 lg:px-20 bg-gradient-to-br from-white via-slate-50 to-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-indigo-700 shadow-sm">
          📰 Latest Forum Discussions
        </h1>

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-500">
            {sortPopular ? "Sorted by popularity" : "Sorted by newest"}
          </p>
          <button
            className="px-5 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition"
            onClick={() => {
              setSortPopular(!sortPopular);
              setCurrentPage(1);
            }}
          >
            {sortPopular ? "Sort by Newest" : "Sort by Popularity"}
          </button>
        </div>

        {loadingPosts ? (
          <p className="text-center">Loading posts...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          paginatedPosts().map((post) => {
            const voteCount = (post.upvotes || 0) - (post.downvotes || 0);
            const comments = commentsMap[post.title] || [];
            const commentInput = newComments[post.title] || "";

            return (
              <div key={post._id} className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
                <div className="flex items-center gap-4 mb-3">
                  <img
                    src={post.authorImage || "https://i.ibb.co/2FsfXqM/avatar.png"}
                    className="w-12 h-12 rounded-full border"
                    alt="Author"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{post.title}</h2>
                    <p className="text-gray-500">{post.description}</p>
                    <p className="text-xs text-gray-400">{new Date(post.time).toLocaleString()}</p>
                  </div>
                </div>

                <div className="mb-2">
                  {post.tags?.map((tag, i) => (
                    <span key={i} className="text-sm bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full mr-2">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between text-sm text-gray-500 mb-3">
                  <span>💬 {comments.length} Comments</span>
                  <span>🔥 Popularity: {voteCount}</span>
                </div>

                <div className="flex gap-4 mb-4">
                  <button
                    onClick={() => handleUpvote(post._id)}
                    className="bg-green-500 hover:bg-green-600 px-4 py-2 text-white rounded"
                  >
                    👍 {post.upvotes || 0}
                  </button>
                  <button
                    onClick={() => handleDownvote(post._id)}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 text-white rounded"
                  >
                    👎 {post.downvotes || 0}
                  </button>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2 text-gray-800">Comments</h4>
                  {loadingComments[post.title] ? (
                    <p>Loading comments...</p>
                  ) : comments.length > 0 ? (
                    <ul className="space-y-2 mb-3">
                      {comments.map((c) => (
                        <li key={c._id} className="bg-gray-50 p-3 rounded-md">
                          <p className="font-semibold">{c.userName}</p>
                          <p>{c.commentText}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(c.time).toLocaleString()}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400">No comments yet.</p>
                  )}

                  <textarea
                    rows={3}
                    placeholder="Write a comment..."
                    className="w-full border border-gray-300 rounded p-2 mb-2"
                    value={commentInput}
                    onChange={(e) => handleNewCommentChange(post.title, e)}
                  />
                  <button
                    onClick={() => handleSubmitComment(post.title, post._id)}
                    disabled={!commentInput.trim()}
                    className={`w-full py-2 rounded-md text-white font-semibold transition ${
                      commentInput.trim()
                        ? "bg-indigo-600 hover:bg-indigo-700"
                        : "bg-indigo-300 cursor-not-allowed"
                    }`}
                  >
                    Submit Comment
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-full ${
                  currentPage === i + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-indigo-500 hover:text-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
