import React, { useContext } from 'react';
import { Menu, User, Settings, LogOut } from 'lucide-react';
import { AuthContext } from '../../../Provider/AuthContext';
import Swal from 'sweetalert2';
import { signOut } from 'firebase/auth';
import { auth } from '../../../Provider/firebase.init';
import { NavLink } from 'react-router';

const UserTopbar = ({ setSidebarOpen }) => {
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
    <header className="bg-gradient-to-r from-[#1e1e2f] to-[#2b2b42] px-6 py-4 flex items-center justify-between shadow-lg sticky top-0 z-50">
      {/* Left: Mobile menu button + Title */}
      <div className="flex items-center space-x-4">
        <button
          className="md:hidden text-cyan-400 hover:text-cyan-500 p-2 rounded-md transition"
          onClick={() => setSidebarOpen((prev) => !prev)}
          aria-label="Toggle Sidebar"
        >
          <Menu size={28} />
        </button>
        <h1 className="hidden md:block text-cyan-400 text-2xl font-extrabold tracking-wider select-none drop-shadow-lg">
          User Dashboard
        </h1>
      </div>

      {/* Right: Welcome & Profile */}
      <div className="flex items-center space-x-8">
        <span className="relative text-cyan-300 font-semibold text-lg select-none group cursor-default">
          Welcome,{' '}
          <span className="underline decoration-cyan-500 decoration-2 underline-offset-4 animate-pulse">
            {user?.displayName}
          </span>
          <span
            className="absolute left-0 bottom-0 w-full h-1 bg-cyan-500 rounded-full opacity-20 blur-sm animate-wave"
            style={{ animationDuration: '2.5s' }}
          />
        </span>

        {/* Profile Dropdown */}
        <div className="dropdown dropdown-end relative">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar transition-transform hover:scale-110 focus:outline-none ring-2 ring-cyan-500 ring-offset-2 rounded-full shadow-lg"
            aria-label="User Menu"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img
                alt="User Avatar"
                src={user?.photoURL}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-4 p-4 shadow-xl rounded-lg w-60 bg-[#222236] ring-1 ring-cyan-600 ring-opacity-40 text-cyan-300 z-[999]"
          >
            <li>
              <a className="flex items-center space-x-3 hover:bg-cyan-700 rounded-md px-3 py-2 cursor-pointer select-none transition-colors duration-200">
                <User size={20} />
                <NavLink to={"myprofile"}>Profile</NavLink>
                <span className="ml-auto inline-block bg-cyan-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full animate-pulse">
                  New
                </span>
              </a>
            </li>
            <li>
              <a className="flex items-center space-x-3 hover:bg-cyan-700 rounded-md px-3 py-2 cursor-pointer select-none transition-colors duration-200">
                <Settings size={20} />
                <span>Settings</span>
              </a>
            </li>
            <li>
              <a
                onClick={handleLogout}
                className="flex items-center space-x-3 hover:bg-red-600 rounded-md px-3 py-2 cursor-pointer select-none text-red-400 font-semibold transition-colors duration-200"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes wave {
          0%,
          100% {
            transform: translateX(-10%);
            opacity: 0.25;
          }
          50% {
            transform: translateX(110%);
            opacity: 1;
          }
        }
        .animate-wave {
          animation-name: wave;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-fill-mode: forwards;
        }
      `}</style>
    </header>
  );
};

export default UserTopbar;
