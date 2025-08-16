import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../../../Provider/AuthContext";

const AllTags = () => {
  const [tags, setTags] = useState([]); // Tags array state
  const [searchTerm, setSearchTerm] = useState(""); // Search input
  const [loading, setLoading] = useState(false); // Loading spinner
  const [error, setError] = useState(null); // Error message
  // const debounceTimeout = useRef(null); // For debounce timer
  const {user} = useContext(AuthContext);

  // Fetch tags with optional search term
const fetchTags = async (search = "") => {

  setLoading(true);
  setError(null);

  try {

    // Add timestamp to avoid cached API results
    const res = await axios.get("http://localhost:3000/alltags", {
      headers: { Authorization: `Bearer ${user.accessToken}` },
      params: { search, _ts: Date.now() },
    });

    console.log("Fetched tags:", res.data);

    if (Array.isArray(res.data)) {
      setTags(res.data);
    } else if (Array.isArray(res.data.tags)) {
      setTags(res.data.tags);
    } else {
      setTags([]);
      console.warn("Unexpected data format for tags:", res.data);
    }
  } catch (error) {
    setError("Failed to fetch tags");
    console.error("Error fetching tags:", error);
  } finally {
    setLoading(false);
  }
};


  // Debounce search input and fetch tags on searchTerm change
  useEffect(() => {
    // if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    // debounceTimeout.current = setTimeout(() => {
      
    // }, 400);
    fetchTags(searchTerm);

    // return () => clearTimeout(debounceTimeout.current);
  }, [searchTerm,user]);

  // Handle tag edit with modal input
  const handleEdit = async (id, currentTag) => {
    const { value: newTag } = await Swal.fire({
      title: "Edit Tag",
      input: "text",
      inputLabel: "New Tag",
      inputValue: currentTag,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return "Tag cannot be empty!";
      },
    });

    if (!newTag) return;
    if (!user) return;

    try {
      const token = await user.getIdToken();
      await axios.patch(
        `http://localhost:3000/tags/${id}`,
        { tag: newTag },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Updated!", "Tag has been updated.", "success");
      fetchTags(searchTerm);
    } catch (error) {
      console.error("Error updating tag:", error);
      Swal.fire("Error", "Failed to update tag.", "error");
    }
  };

  // Handle tag delete with confirmation modal
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;
    if (!user) return;

    try {
      const token = await user.getIdToken();
      await axios.delete(`http://localhost:3000/tags/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Deleted!", "Tag has been deleted.", "success");
      fetchTags(searchTerm);
    } catch (error) {
      console.error("Error deleting tag:", error);
      Swal.fire("Error", "Failed to delete tag.", "error");
    }
  };

  // Update searchTerm on input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="p-8 min-h-screen">
      <div className="md:flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-4 text-center md:text-left">All Tags</h2>

        {/* Search Input */}
        <div className="mb-6 flex justify-center md:justify-end w-full max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="🔍 Search tags..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 text-sm rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Loading and Error Messages */}
      {loading && (
        <p className="text-center text-blue-600 font-semibold mb-4">Loading tags...</p>
      )}
      {error && (
        <p className="text-center text-red-600 font-semibold mb-4">{error}</p>
      )}

      {/* Tags Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 shadow-md">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="px-6 py-3 text-left">#</th>
              <th className="px-6 py-3 text-left">Tag</th>
              <th className="px-6 py-3 text-left">Created At</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && tags.length > 0 ? (
              tags.map((tag, index) => (
                <tr key={tag._id} className="border-t">
                  <td className="px-6 py-3">{index + 1}</td>
                  <td className="px-6 py-3">{tag.tag}</td>
                  <td className="px-6 py-3">
                    {new Date(tag.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-3 space-x-2">
                    <button
                      onClick={() => handleEdit(tag._id, tag.tag)}
                      className="px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tag._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              !loading && (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    No tags found.
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllTags;
