import React from 'react';

const StatCard = () => {
  return (
    <div className="bg-white rounded-xl p-5 mt-2 shadow-lg border-l-4 border-green-500 hover:shadow-2xl transition">
      <div className="text-sm text-gray-500">Profile Views</div>
      <div className="text-2xl font-bold text-gray-800">1,204</div>
    </div>
  );
};

export default StatCard;
