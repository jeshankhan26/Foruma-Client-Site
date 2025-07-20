import React from 'react';

const ActivityTimeline = () => {
    const activities = [
  { title: 'User Signed In', time: '2 mins ago' },
  { title: 'Order #1234 Placed', time: '15 mins ago' },
  { title: 'Product Added', time: '30 mins ago' },
];
    return (
        <>
        <div className="bg-white p-5 rounded-xl shadow-md">
    <h3 className="font-semibold text-lg mb-4">📌 Recent Activities</h3>
    <ul className="space-y-3">
      {activities.map((act, i) => (
        <li key={i} className="flex items-center space-x-3">
          <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
          <div>
            <p className="text-sm font-medium">{act.title}</p>
            <p className="text-xs text-gray-500">{act.time}</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
            
        </>
    );
};

export default ActivityTimeline;