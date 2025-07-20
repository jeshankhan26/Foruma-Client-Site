// CreateAnnouncement.jsx
import { useContext, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { AuthContext } from "../../../../Provider/AuthContext";

const CreateAnnouncement = () => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const announcement = {
      authorName: user?.displayName,
      authorImage: user?.photoURL,
      title,
      description,
      status: 1,
      createdAt: new Date().toISOString(),
    };

    try {
      const token = await user.getIdToken();
      await axios.post("https://foruma-server-site.vercel.app/api/announcements", announcement, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire("Success", "Announcement created!", "success");
      setTitle("");
      setDescription("");
    } catch (error) {
      Swal.fire("Error", "Something went wrong", "error");
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-r from-purple-200 to-pink-200 rounded-xl shadow-xl mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-800">📢 Create Announcement</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-4">
          <img
            src={user?.photoURL}
            alt="Author"
            className="w-14 h-14 rounded-full shadow-md border border-white"
          />
          <span className="text-lg font-medium text-gray-700">{user?.displayName}</span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            rows="5"
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition"
        >
          Post Announcement
        </button>
      </form>
    </div>
  );
};

export default CreateAnnouncement;
