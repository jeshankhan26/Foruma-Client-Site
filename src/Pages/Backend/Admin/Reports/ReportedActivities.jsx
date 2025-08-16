import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "react-modal";

Modal.setAppElement("#root");

const ReportedActivities = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [modalComment, setModalComment] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3000/posts")
      .then(res => setPosts(res.data))
      .catch(console.error);
  }, []);

  const fetchComments = async (postId) => {
    try {
      const res = await axios.get(`http://localhost:3000/comments/${postId}`);
      setComments(res.data);
      setSelectedPost(postId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (commentId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to recover this comment!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axios.delete(`http://localhost:3000/comments/${commentId}`);
      if (res.data?.deletedCount > 0) {
        setComments(prev => prev.filter(c => c._id !== commentId));
        Swal.fire("Deleted!", "Comment has been deleted.", "success");
      }
    } catch (error) {
      Swal.fire("Error!", "Failed to delete the comment.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-100 via-pink-50 to-white py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-purple-800 drop-shadow-md flex justify-center items-center gap-3">
            <span className="text-5xl">🛡️</span> Admin Panel - Reported Activities
          </h1>
          <p className="mt-2 text-purple-600 font-medium tracking-wide">
            Manage posts and moderate comments efficiently
          </p>
        </header>

        {/* All Posts Table */}
        <section className="bg-white rounded-3xl shadow-2xl p-8 mb-14 border border-purple-300">
          <h2 className="text-3xl font-semibold mb-6 text-purple-700 border-b-2 border-purple-300 pb-2">
            📚 All Posts
          </h2>
          <div className="overflow-x-auto rounded-lg shadow-inner border border-purple-200">
            <table className="min-w-full divide-y divide-purple-200">
              <thead className="bg-purple-100">
                <tr>
                  <th className="px-8 py-4 text-left text-purple-700 font-semibold uppercase tracking-wider text-lg">
                    Title
                  </th>
                  <th className="px-8 py-4 text-left text-purple-700 font-semibold uppercase tracking-wider text-lg">
                    Author
                  </th>
                  <th className="px-8 py-4 text-center text-purple-700 font-semibold uppercase tracking-wider text-lg">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-purple-100">
                {posts.map((post) => (
                  <tr
                    key={post._id}
                    className="hover:bg-purple-50 transition-colors duration-300 cursor-pointer"
                  >
                    <td className="px-8 py-5 whitespace-normal text-purple-900 font-medium max-w-xl break-words">
                      {post.title}
                    </td>
                    <td className="px-8 py-5 text-purple-800">{post.authorName}</td>
                    <td className="px-8 py-5 text-center">
                      <button
                        onClick={() => fetchComments(post._id)}
                        className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
                        aria-label={`View comments for post titled ${post.title}`}
                      >
                        View Comments
                      </button>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-16 text-gray-400 italic">
                      No posts available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Comments Section */}
        {selectedPost && (
          <section className="bg-white rounded-3xl shadow-2xl p-10 max-w-5xl mx-auto border border-red-300">
            <h2 className="text-4xl font-extrabold mb-8 text-red-700 flex items-center gap-4">
              <span className="text-5xl">💬</span> Comments on Selected Post
            </h2>
            <div className="overflow-x-auto rounded-lg shadow-inner border border-red-200">
              <table className="min-w-full divide-y divide-red-200 rounded-lg">
                <thead className="bg-red-50">
                  <tr>
                    <th className="px-8 py-4 text-left text-red-700 font-semibold uppercase tracking-wide text-lg">
                      Email
                    </th>
                    <th className="px-8 py-4 text-left text-red-700 font-semibold uppercase tracking-wide text-lg">
                      Comment
                    </th>
                    <th className="px-8 py-4 text-center text-red-700 font-semibold uppercase tracking-wide text-lg">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-red-100">
                  {comments.map((c) => (
                    <tr
                      key={c._id}
                      className="hover:bg-red-50 transition-colors duration-300 cursor-pointer"
                    >
                      <td className="px-8 py-6 whitespace-nowrap text-red-900 font-medium max-w-xs truncate">
                        {c.userEmail}
                      </td>
                      <td className="px-8 py-6 max-w-lg text-red-800">
                        {c?.commentText?.length > 60 ? (
                          <>
                            {c.commentText.slice(0, 60)}...
                            <button
                              onClick={() => setModalComment(c.commentText)}
                              className="ml-3 text-blue-600 hover:text-blue-800 underline text-sm font-semibold"
                              aria-label="Read full comment"
                            >
                              Read More
                            </button>
                          </>
                        ) : (
                          c?.commentText || (
                            <span className="italic text-gray-400">No comment</span>
                          )
                        )}
                      </td>
                      <td className="px-8 py-6 text-center">
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full shadow-lg transition duration-200 font-semibold"
                          aria-label={`Delete comment by ${c.userEmail}`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {comments.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="text-center text-gray-400 py-12 italic"
                      >
                        No comments found for this post.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Modal for Full Comment */}
        <Modal
          isOpen={!!modalComment}
          onRequestClose={() => setModalComment(null)}
          className="bg-white p-8 max-w-lg mx-auto mt-24 rounded-3xl shadow-2xl outline-none"
          overlayClassName="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
        >
          <h2 className="text-2xl font-semibold mb-4 text-purple-700 flex items-center gap-2">
            📝 Full Comment
          </h2>
          <p className="text-gray-700 whitespace-pre-wrap">{modalComment}</p>
          <button
            onClick={() => setModalComment(null)}
            className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-semibold hover:scale-105 hover:shadow-lg transition-transform duration-300"
          >
            Close
          </button>
        </Modal>
      </div>
    </div>
  );
};

export default ReportedActivities;
