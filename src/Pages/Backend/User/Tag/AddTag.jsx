// AddTag.jsx
import React, { useContext, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../../../Provider/AuthContext";

const AddTag = () => {
  const [tag, setTag] = useState("");
  const {user}=useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tag.trim()) {
      Swal.fire("Error", "Tag field cannot be empty!", "error");
      return;
    }

    const newTag = {
      tag: tag.trim(),
      email:user.email,
    };

    try {
      const response = await axios.post("http://localhost:3000/tags", newTag);

if (response.status === 200 || response.status === 201) {
  Swal.fire("Success", "Tag added successfully!", "success").then(() => {
    window.location.href = "/dashboard/alltags";
  });
  setTag(""); // clear input
}

    } catch (error) {
      console.error("Error saving tag:", error);
      Swal.fire("Error", "Failed to save tag!", "error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Add New Tag
        </h2>

        <input
          type="text"
          placeholder="Enter a tag"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Add Tag
        </button>
      </form>
    </div>
  );
};

export default AddTag;
