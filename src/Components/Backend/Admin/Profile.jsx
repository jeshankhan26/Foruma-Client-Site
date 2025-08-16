import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Profile = () => {
  const [profile, setProfile] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/adduser')
      .then(res => {
        setProfile(res.data); // Assuming res.data is an array
      })
      .catch(err => {
        console.error('Error fetching profile:', err);
      });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6 justify-items-center">
      {profile.map((user, index) => (
        <div
          key={index}
          className="w-80 bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 ease-in-out border border-blue-100"
        >
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-400 to-indigo-500 w-24 h-24 rounded-full mx-auto p-1">
              <img
                src={user.photoURL || "https://i.pravatar.cc/100"}
                alt={user.name || "User"}
                className="w-full h-full rounded-full object-cover border-4 border-white"
              />
            </div>
          </div>

          <h2 className="mt-4 text-xl font-bold text-center text-gray-800">{user.name || "Unnamed User"}</h2>
          <p className="text-sm text-center text-gray-500">{user.role || "Role Unknown"}</p>
        </div>
      ))}
    </div>
  );
};

export default Profile;
