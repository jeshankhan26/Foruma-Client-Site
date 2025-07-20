import React, { useContext } from 'react';
import {
  Home,
  FileText,
  Table,
  BarChart2,
  Layers,
  ChevronDown,
  ChevronUp,
  Tags,
  Newspaper,
  User,
} from 'lucide-react';
import { AuthContext } from '../../../Provider/AuthContext';
import { NavLink } from 'react-router'; 

const Sidebar = ({ setSidebarOpen }) => {
  const { user } = useContext(AuthContext);

  const handleLinkClick = () => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white p-5 h-full overflow-y-auto shadow-lg">
      
      {/* === Sidebar Header === */}
      <div className="mb-6 border-b border-slate-700 pb-4">
        <h2 className="text-2xl font-bold text-sky-400">Foruma Zone!</h2>
        <p className="text-sm mt-1 text-gray-300">
          Welcome,<br />
          <span className="font-semibold text-white">{user.displayName}</span>
        </p>
      </div>

      {/* === Sidebar Navigation === */}
      <nav className="space-y-3 text-sm">

        {/* ✅ Dashboard Link */}
        <NavLink
          to="/admindashboard"
          onClick={handleLinkClick}
          className="flex items-center gap-3 hover:bg-sky-700/20 px-3 py-2 rounded-md transition-all"
        >
          <Home size={18} />
          Dashboard
        </NavLink>


        {/* ✅ Static Links */}
        <NavLink
          to="manageuser"
          onClick={handleLinkClick}
          className="flex items-center gap-3 hover:bg-sky-700/20 px-3 py-2 rounded-md transition-all"
        >
          <User size={18} />
          Manage User
        </NavLink>
        <NavLink
          to="announcement"
          onClick={handleLinkClick}
          className="flex items-center gap-3 hover:bg-sky-700/20 px-3 py-2 rounded-md transition-all"
        >
          <Newspaper size={18} />
          Announcement
        </NavLink>
        <NavLink
          to="activities"
          onClick={handleLinkClick}
          className="flex items-center gap-3 hover:bg-sky-700/20 px-3 py-2 rounded-md transition-all"
        >
          <FileText size={18} />
          Announcement Activities
        </NavLink>
        <NavLink
          to="report"
          onClick={handleLinkClick}
          className="flex items-center gap-3 hover:bg-sky-700/20 px-3 py-2 rounded-md transition-all"
        >
          <Layers size={18} />
          Reported Activities
        </NavLink>
      </nav>

      {/* === Footer === */}
      <div className="mt-6 pt-4 border-t border-slate-700 text-xs text-slate-400">
        <p>© 2025 OptiFlow Inc.</p>
        <p>
          Powered by <span className="text-sky-400 font-medium">React & DaisyUI</span>
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
