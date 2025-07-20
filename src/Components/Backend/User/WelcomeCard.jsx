import React, { useContext } from 'react';
import { AuthContext } from '../../../Provider/AuthContext';

const WelcomeCard = () => {
  const {user}=useContext(AuthContext)
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-1">Welcome back, {user.d} 👋</h2>
      <p className="text-sm opacity-90">Glad to see you again! Here's what’s happening today.</p>
    </div>
  );
};

export default WelcomeCard;
