import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";

// Predefined feedback options
const FEEDBACK_OPTIONS = [
  "Spam or irrelevant content",
  "Offensive or harmful language",
  "Fake or misleading information",
];

const CommentsPage = () => {
  const { postId } = useParams();
  const [comments, setComments] = useState([]);

  // 🔄 Fetch all report records
  const fetchReportedComments = async () => {
    try {
      const res = await axios.get("http://localhost:3000/reportdata");
      return res.data; // Return full report objects
    } catch (error) {
      console.error("Failed to fetch reported data", error);
      return [];
    }
  };

  // 🔄 Fetch comments + merge with report status
  const fetchComments = async () => {
    try {
      const commentsRes = await axios.get(`http://localhost:3000/comments/${postId}`);
      const commentsData = commentsRes.data;

      const reports = await fetchReportedComments(); // Full reports

      // Map comments with report status
      const commentsWithStatus = commentsData.map((comment) => {
        const report = reports.find((r) => r.commentId === comment._id && r.status === "disable");
        return {
          ...comment,
          feedback: "",
          reported: !!report,
        };
      });

      setComments(commentsWithStatus);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  const handleFeedbackChange = (commentId, value) => {
    setComments((prev) =>
      prev.map((c) => (c._id === commentId ? { ...c, feedback: value } : c))
    );
  };

  const handleReport = async (commentId) => {
    const comment = comments.find((c) => c._id === commentId);

    if (!comment?.feedback) {
      Swal.fire("Warning", "Please select a feedback before reporting.", "warning");
      return;
    }

    try {
      const payload = {
        commentId: comment._id,
        feedback: comment.feedback,
      };

      const response = await axios.post("http://localhost:3000/report", payload);

      if (response.data.success) {
        Swal.fire("Reported!", "This comment has been reported successfully.", "success");

        // Mark comment as reported in UI
        setComments((prev) =>
          prev.map((c) => (c._id === commentId ? { ...c, reported: true } : c))
        );
      } else {
        Swal.fire("Error", "Failed to report comment. Please try again.", "error");
      }
    } catch (error) {
      console.error("Report error:", error);
      Swal.fire("Error", "Something went wrong. Please try again later.", "error");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8">
        💬 Comments for Post ID: <span className="text-indigo-600">{postId}</span>
      </h2>

      {comments.length === 0 ? (
        <p className="text-gray-500 italic">No comments available for this post.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-indigo-100 text-indigo-800 font-semibold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Comment</th>
                <th className="px-6 py-4">Feedback</th>
                <th className="px-6 py-4">Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {comments.map((comment) => (
                <tr
                  key={comment._id}
                  className="hover:bg-indigo-50 transition duration-200"
                >
                  <td className="px-6 py-4 font-medium text-blue-600 break-all">
                    {comment.userEmail}
                  </td>
                  <td className="px-6 py-4 text-gray-800">{comment.commentText}</td>
                  <td className="px-6 py-4">
                    <select
                      className={`w-full p-2 border rounded-lg focus:outline-none transition ${
                        comment.feedback
                          ? "bg-green-50 border-green-300"
                          : "bg-gray-50 border-gray-300"
                      }`}
                      value={comment.feedback}
                      onChange={(e) =>
                        handleFeedbackChange(comment._id, e.target.value)
                      }
                      disabled={comment.reported}
                    >
                      <option value="">Select feedback</option>
                      {FEEDBACK_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleReport(comment._id)}
                      disabled={!comment.feedback || comment.reported}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                        comment.reported
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600 text-white"
                      }`}
                    >
                      {comment.reported ? "Reported" : "Report"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CommentsPage;
