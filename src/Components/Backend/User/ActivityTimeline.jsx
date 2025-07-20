import React from 'react';

const ActivityTimeline = () => {
  return (
    <div className="bg-white rounded-xl mt-2 shadow-md p-6">
      <h3 className="text-lg font-bold mb-4">Recent Activities</h3>
      <ul className="space-y-4">
        <li className="flex items-start gap-3">
          <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
          <div>
            <p className="text-sm text-gray-700">Logged in from new device</p>
            <span className="text-xs text-gray-400">2 hours ago</span>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <div className="w-2 h-2 mt-2 rounded-full bg-green-500" />
          <div>
            <p className="text-sm text-gray-700">Completed profile setup</p>
            <span className="text-xs text-gray-400">Yesterday</span>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <div className="w-2 h-2 mt-2 rounded-full bg-purple-500" />
          <div>
            <p className="text-sm text-gray-700">Joined premium membership</p>
            <span className="text-xs text-gray-400">3 days ago</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default ActivityTimeline;
