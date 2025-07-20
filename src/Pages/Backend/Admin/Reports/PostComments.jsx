import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import Swal from "sweetalert2";

Modal.setAppElement("#root");

const FEEDBACKS = [
  "Spam or misleading",
  "Hateful or abusive content",
  "Violates community rules"
];

const PostComments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState({});
  const [reported, setReported] = useState({});
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    axios.get(`https://foruma-server-site.vercel.app/posts/${postId}/comments`)
      .then(res => setComments(res.data))
      .catch(console.error);
  }, [postId]);

  const handleFeedback = (commentId, feedback) => {
    setSelectedFeedback(prev => ({ ...prev, [commentId]: feedback }));
  };

  const handleReport = (commentId) => {
    const feedback = selectedFeedback[commentId];
    if (!feedback) return;

    axios.post(`https://foruma-server-site.vercel.app/api/reports`, {
      commentId,
      feedback
    }).then(() => {
      Swal.fire("Reported", "Your report has been submitted", "success");
      setReported(prev => ({ ...prev, [commentId]: true }));
    }).catch(() => {
      Swal.fire("Error", "Something went wrong", "error");
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">💬 Comments on Post</h2>

      <table className="w-full table-auto border border-gray-300">
        <thead className="bg-purple-100 text-purple-800">
          <tr>
            <th className="p-2">Email</th>
            <th className="p-2">Comment</th>
            <th className="p-2">Feedback</th>
            <th className="p-2">Report</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((c) => (
            <tr key={c._id} className="border-t">
              <td className="p-2">{c.email}</td>
              <td className="p-2">
                {c.text.length > 20 ? (
                  <>
                    {c.text.slice(0, 20)}...
                    <button
                      className="text-blue-500 ml-1 underline"
                      onClick={() => setModalData(c.text)}
                    >
                      Read More
                    </button>
                  </>
                ) : (
                  c.text
                )}
              </td>
              <td className="p-2">
                <select
                  className="border rounded p-1"
                  onChange={(e) => handleFeedback(c._id, e.target.value)}
                  defaultValue=""
                >
                  <option disabled value="">Select Feedback</option>
                  {FEEDBACKS.map((fb, idx) => (
                    <option key={idx} value={fb}>{fb}</option>
                  ))}
                </select>
              </td>
              <td className="p-2">
                <button
                  className={`px-3 py-1 rounded text-white ${
                    reported[c._id]
                      ? "bg-gray-400 cursor-not-allowed"
                      : selectedFeedback[c._id]
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                  onClick={() => handleReport(c._id)}
                  disabled={!selectedFeedback[c._id] || reported[c._id]}
                >
                  Report
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for full comment */}
      <Modal
        isOpen={!!modalData}
        onRequestClose={() => setModalData(null)}
        className="bg-white p-6 max-w-lg mx-auto mt-20 rounded shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-semibold mb-2">Full Comment</h2>
        <p>{modalData}</p>
        <button
          onClick={() => setModalData(null)}
          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

export default PostComments;
