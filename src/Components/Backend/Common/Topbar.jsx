import React, { useContext } from 'react';
import { Menu, User, Settings, LogOut } from 'lucide-react';
import { AuthContext } from '../../../Provider/AuthContext';
import Swal from 'sweetalert2';
import { signOut } from 'firebase/auth';
import { auth } from '../../../Provider/firebase.init';

const Topbar = ({ setSidebarOpen }) => {
  const { user } = useContext(AuthContext);

 const handleLogout = () => {
    signOut(auth)
      .then(() => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Logout Successful',
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.href = '/';
        });
      })
      .catch((error) => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Logout Failed',
          showConfirmButton: false,
          timer: 1500,
        });
        console.error('Error signing out:', error);
      });
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between shadow-lg sticky top-0 z-50">
      {/* Left: Mobile menu button + Title */}
      <div className="flex items-center space-x-4">
        <button
          className="md:hidden text-white hover:bg-indigo-700 p-2 rounded-md transition"
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label="Toggle Sidebar"
        >
          <Menu size={26} />
        </button>
        <h1 className="hidden md:block text-white text-2xl font-extrabold tracking-wide select-none drop-shadow-lg">
          Admin Dashboard
        </h1>
      </div>

      {/* Right: Welcome & Profile */}
      <div className="flex items-center space-x-6">
        <span
          className="text-white font-semibold text-lg animate-fadeIn opacity-90 select-none"
          style={{ animationDuration: '1.5s' }}
        >
          Welcome, <span className="underline decoration-pink-300">{user?.displayName || 'User'}</span>
        </span>

        {/* Profile Dropdown */}
        <div className="dropdown dropdown-end relative">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar transition-transform hover:scale-110 focus:outline-none"
            aria-label="User Menu"
          >
            <div className="w-10 rounded-full">
              <img
                alt="User Avatar"
                src={user?.photoURL || 'https://i.pravatar.cc/150?img=12'}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-4 p-3 shadow-lg rounded-lg w-56 bg-white ring-1 ring-black ring-opacity-5 z-[999]"
          >
            <li>
              <a className="flex items-center space-x-3 hover:bg-indigo-50 rounded-md px-2 py-2 cursor-pointer select-none">
                <User size={18} />
                <span>Profile</span>
                <span className="ml-auto inline-block bg-pink-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full animate-pulse">
                  New
                </span>
              </a>
            </li>
            <li>
              <a className="flex items-center space-x-3 hover:bg-indigo-50 rounded-md px-2 py-2 cursor-pointer select-none">
                <Settings size={18} />
                <span>Settings</span>
              </a>
            </li>
            <li>
              <a
                onClick={handleLogout}
                className="flex items-center space-x-3 hover:bg-indigo-50 rounded-md px-2 py-2 cursor-pointer select-none text-red-600 font-semibold"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation-name: fadeIn;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }
      `}</style>
    </header>
  );
};

export default Topbar;
