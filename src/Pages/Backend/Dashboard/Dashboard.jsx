import React, { useState } from 'react';
import UserSidebar from '../../../Components/Backend/Common/UserSidebar';
import UserTopbar from '../../../Components/Backend/Common/UserTopbar';
import { Outlet } from 'react-router';

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <>
         <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar with toggle support */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-slate-800 text-white transition-transform duration-300 ease-in-out 
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-0`}>
        <UserSidebar setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content wrapper */}
      <div className="flex flex-col flex-1 min-h-screen w-full">
        <UserTopbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
            
        </>
    );
};

export default Dashboard;