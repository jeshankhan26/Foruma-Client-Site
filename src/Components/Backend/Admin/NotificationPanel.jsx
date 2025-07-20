import React, { useState } from 'react';

const NotificationPanel = () => {
    const [open, setOpen] = useState(false);
    return (
        <>
        <div className="bg-white mt-2 p-4 rounded-xl shadow-md">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm font-semibold text-blue-600"
      >
        🔔 Notifications {open ? '▲' : '▼'}
      </button>
      {open && (
        <ul className="mt-3 space-y-2 text-sm text-gray-700">
          <li>📬 You have 3 new messages</li>
          <li>✅ Backup completed successfully</li>
          <li>⚠️ 5 users reported an issue</li>
        </ul>
      )}
    </div>
            
        </>
    );
};

export default NotificationPanel;