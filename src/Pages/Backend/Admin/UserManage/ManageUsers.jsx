import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch all users
  useEffect(() => {
    axios.get("http://localhost:3000/adduser")
      .then(res => setUsers(res.data))
      .catch(err => console.error("Error fetching users:", err));
  }, []);

  // Fetch all memberships
  useEffect(() => {
    axios.get("http://localhost:3000/allmembers")
      .then(res => setMemberships(res.data))
      .catch(err => console.error("Error fetching memberships:", err));
  }, []);

  // Get membership status for each user
 const getMembershipStatus = (email) => {
  const member = memberships.find(m => m.email === email);

  if (!member) return "None";       // no member found
  if (member.status === 0) return "None";  // member found but inactive

  return "Active";                  // member found and active
};


  // Handle make admin button click
  const handleMakeAdmin = async (userId) => {
    try {
      const response = await axios.patch(`http://localhost:3000/adduser/${userId}`, {
        role: "admin"
      });

      if (response.data.modifiedCount > 0) {
        Swal.fire("Success", "User promoted to admin!", "success");
        // Update local user role immediately
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user._id === userId ? { ...user, role: "admin" } : user
          )
        );
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      Swal.fire("Error", "Failed to update role", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold text-center text-indigo-600 mb-10">
        Manage Users
      </h2>

      {/* Search bar */}
      <div className="flex justify-end mb-6">
        <input
          type="text"
          placeholder="🔍 Search users by name..."
          className="w-full md:w-1/3 px-4 py-2 border rounded-full shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* User Table */}
      <div className="overflow-x-auto bg-white shadow-xl rounded-2xl border border-gray-100">
        <table className="min-w-full text-left text-sm text-gray-700">
          <thead className="bg-indigo-600 text-white uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Membership</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users
              .filter(user =>
                user.name.toLowerCase().includes(search.toLowerCase())
              )
              .map(user => (
                <tr key={user._id} className="hover:bg-indigo-50 transition">
                  <td className="px-6 py-4 font-medium">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td
                    className={`px-6 py-4 font-semibold ${
                      user.role === "admin" ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {user.role}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`${
                        getMembershipStatus(user.email) === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                      } px-3 py-1 rounded-full text-xs font-medium`}
                    >
                      {getMembershipStatus(user.email)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {user.role !== "admin" && (
                      <button
                        onClick={() => handleMakeAdmin(user._id)}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition duration-200"
                      >
                        Make Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
