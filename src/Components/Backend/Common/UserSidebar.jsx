import React, { useContext, useState } from 'react';
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
  User
} from 'lucide-react';
import { AuthContext } from '../../../Provider/AuthContext';
import { NavLink } from 'react-router';

const UserSidebar = ({ setSidebarOpen }) => {
  const { user } = useContext(AuthContext);
   // ✅ Separate states for each dropdown
    const [isTagsOpen, setIsTagsOpen] = useState(false);
    const [isPostOpen, setIsPostOpen] = useState(false);

  const handleLinkClick = () => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  return (
    <aside className="w-64 bg-[#0f172a] text-gray-300 flex flex-col h-full shadow-2xl">
      {/* Header */}
      <div className="px-6 py-8 border-b border-[#1e293b] flex flex-col items-start gap-2">
        <h2 className="text-3xl font-extrabold tracking-wide text-[#f97316] uppercase select-none">
          OptiFlow
        </h2>
        <p className="text-sm">
          Welcome,<br />
          <span className="text-white font-semibold">{user?.displayName || 'User'}</span>
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-2">
        {/* Home */}
        {/* ✅ Dashboard Link */}
        <NavLink
          to="/dashboard"
          onClick={handleLinkClick}
          className="flex items-center gap-3 hover:bg-sky-700/20 px-3 py-2 rounded-md transition-all"
        >
          <Home size={18} />
          Dashboard
        </NavLink>

        {/* ✅ TAGS Dropdown */}
        <div>
          <button
            onClick={() => setIsTagsOpen(!isTagsOpen)}
            className="flex items-center justify-between w-full hover:bg-sky-700/20 px-3 py-2 rounded-md transition-all"
          >
            <span className="flex items-center gap-3">
              <Tags size={18} />
              Tags
            </span>
            {isTagsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {/* ✅ Tags Dropdown Items */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isTagsOpen ? 'max-h-40 mt-2' : 'max-h-0'
            }`}
          >
            <NavLink
              to="addtags"
              onClick={handleLinkClick}
              className="block ml-8 mt-1 px-2 py-1 rounded-md hover:bg-sky-700/30 transition"
            >
              ➕ Add Tags
            </NavLink>
            <NavLink
              to="alltags"
              onClick={handleLinkClick}
              className="block ml-8 mt-1 px-2 py-1 rounded-md hover:bg-sky-700/30 transition"
            >
              🏷️ All Tags
            </NavLink>
          </div>
        </div>

        {/* ✅ POST Dropdown */}
        <div>
          <button
            onClick={() => setIsPostOpen(!isPostOpen)}
            className="flex items-center justify-between w-full hover:bg-sky-700/20 px-3 py-2 rounded-md transition-all"
          >
            <span className="flex items-center gap-3">
              <Newspaper size={18} />
              Post
            </span>
            {isPostOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {/* ✅ Post Dropdown Items */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              isPostOpen ? 'max-h-40 mt-2' : 'max-h-0'
            }`}
          >
            <NavLink
              to="addpost"
              onClick={handleLinkClick}
              className="block ml-8 mt-1 px-2 py-1 rounded-md hover:bg-sky-700/30 transition"
            >
              ➕ Add Post
            </NavLink>
            <NavLink
              to="allpost"
              onClick={handleLinkClick}
              className="block ml-8 mt-1 px-2 py-1 rounded-md hover:bg-sky-700/30 transition"
            >
              📋 My Post
            </NavLink>
          </div>
        </div>

        {/* Other Links */}
        <NavLink to="myprofile"
          onClick={handleLinkClick}
          className="flex items-center gap-4 px-4 py-3 rounded-md hover:bg-[#f97316] hover:text-[#0f172a] transition-colors duration-300 group"
        >
          <User size={20} className="text-[#fde68a] group-hover:text-[#0f172a] transition-colors" />
          <span className="uppercase tracking-wide font-semibold">My Profile</span>
        </NavLink>
        {/* <a
          onClick={handleLinkClick}
          href="#"
          className="flex items-center gap-4 px-4 py-3 rounded-md hover:bg-[#f97316] hover:text-[#0f172a] transition-colors duration-300 group"
        >
          <BarChart2 size={20} className="text-[#fde68a] group-hover:text-[#0f172a] transition-colors" />
          <span className="uppercase tracking-wide font-semibold">Data</span>
        </a>
        <a
          onClick={handleLinkClick}
          href="#"
          className="flex items-center gap-4 px-4 py-3 rounded-md hover:bg-[#f97316] hover:text-[#0f172a] transition-colors duration-300 group"
        >
          <Layers size={20} className="text-[#fde68a] group-hover:text-[#0f172a] transition-colors" />
          <span className="uppercase tracking-wide font-semibold">Layouts</span>
        </a> */}
      </nav>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-[#1e293b] text-center text-gray-400 text-xs font-medium select-none">
        <p>© 2025 OptiFlow Inc.</p>
        <p className="mt-1 font-semibold text-[#f97316]">React & TailwindCSS</p>
      </footer>
    </aside>
  );
};

export default UserSidebar;
