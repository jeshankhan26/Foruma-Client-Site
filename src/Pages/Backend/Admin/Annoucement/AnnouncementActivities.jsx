import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AnnouncementActivities = () => {
  const [announcements, setAnnouncements] = useState([]);

  // Fetch announcements from the server
  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get("http://localhost:3000/announcements");
      setAnnouncements(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load announcements", "error");
    }
  };

  // Handle status update (toggle between Active and Inactive)
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:3000/api/announcements/${id}`, {
        status: newStatus,
      });
      Swal.fire("Updated", "Status updated successfully", "success");
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
        📢 Announcement Activities
      </h2>

      <div className="bg-white shadow-lg rounded-lg p-4 overflow-x-auto border border-gray-200">
        <table className="w-full table-auto text-sm">
          <thead className="bg-indigo-100 text-indigo-800 font-semibold">
            <tr>
              <th className="p-3 text-left">Author</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((a) => (
              <tr key={a._id} className="border-t hover:bg-gray-50 transition">
                <td className="p-3 flex items-center gap-2">
                  <img
                    src={a.authorImage}
                    alt="Author"
                    className="w-10 h-10 rounded-full border border-gray-300"
                  />
                  <span className="font-medium">{a.authorName}</span>
                </td>
                <td className="p-3 font-semibold">{a.title}</td>
                <td className="p-3 text-gray-600 max-w-xs truncate">
                  {a.description}
                </td>
                <td className="p-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      a.status === 1
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {a.status === 1 ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <button
                    className={`px-4 py-1 rounded-md text-white transition ${
                      a.status === 1
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                    onClick={() => handleStatusUpdate(a._id, a.status === 1 ? 0 : 1)}
                  >
                    Set {a.status === 1 ? "Inactive" : "Active"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnnouncementActivities;
