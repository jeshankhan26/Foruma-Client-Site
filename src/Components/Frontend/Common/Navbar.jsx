// Import necessary components and hooks
import { Bell, Menu } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { AuthContext } from "../../../Provider/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../../Provider/firebase.init";
import axios from "axios";

const Navbar = () => {
  // Local state for mobile menu toggle
  const [menuOpen, setMenuOpen] = useState(false);

    const [announcementCount, setAnnouncementCount] = useState(0);

  useEffect(() => {
    const fetchAnnouncementCount = async () => {
      try {
        const response = await axios.get("https://foruma-server-site.vercel.app/announcements/count");
        setAnnouncementCount(response.data.count);
      } catch (error) {
        console.error("Failed to fetch announcement count", error);
      }
    };

    fetchAnnouncementCount();
  }, []);

  // Get user from authentication context
  const { user } = useContext(AuthContext);

  // Navigation hook
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("role");
        window.location.href = "/"; // Redirect to home after logout
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  // Redirect based on user role
  const handleDashboardRedirect = () => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      navigate("/adminDashboard");
    } else {
      navigate("/dashboard");
    }
  };

  // Fallback avatar image
  const fallbackPhoto =
    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

  return (
    <div className="navbar border border-blue-300 shadow-md px-4 top-0 z-50 md:px-20 bg-white">
      
      {/* Left: Logo and Brand Name */}
      <div className="flex-1">
        <a className="flex items-center gap-2 text-2xl font-bold text-primary">
          <img
            src="https://i.ibb.co/RGDtcR00/Financial-Business-Logo.png"
            alt="Logo"
            className="w-8 h-8 lg:w-20 lg:h-20"
          />
          ForumZone
        </a>
      </div>

      {/* Center: Navigation Links for Desktop */}
      <div className="hidden md:flex md:items-center md:gap-6">
        <ul className="menu menu-horizontal px-1">
          <li>
            <NavLink to="/" className="font-medium hover:text-primary">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/member" className="font-medium hover:text-primary">
              Membership
            </NavLink>
          </li>
        </ul>

        {/* Notification Bell (Static UI) */}
       <div className="relative">
      <button className="btn btn-ghost btn-circle">
        <Bell size={22} />
        {announcementCount > 0 && (
          <span className="badge badge-xs badge-error absolute top-2 right-2">
            {announcementCount}
          </span>
        )}
      </button>
    </div>

        {/* Right: User Avatar and Dropdown for Authenticated User */}
        {user ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User Avatar"
                  src={user.photoURL || fallbackPhoto}
                />
              </div>
            </div>
            {/* Dropdown Menu for Auth User */}
            <ul className="menu menu-sm dropdown-content bg-white rounded-box mt-3 w-52 p-2 shadow z-10">
              <li>
                <p className="justify-between">{user.displayName}</p>
              </li>
              <li>
                <button onClick={handleDashboardRedirect}>Dashboard</button>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          // Join Us Button for Unauthenticated Users
          <NavLink to="/login" className="btn btn-primary btn-sm">
            Join Us
          </NavLink>
        )}
      </div>

      {/* Mobile: Menu Icon */}
      <div className="md:hidden flex items-center gap-2">
        <button
          className="btn btn-ghost btn-circle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile: Dropdown Menu (Visible if menuOpen is true) */}
      {menuOpen && (
        <div className="absolute top-15 left-0 w-full shadow-lg md:hidden z-40 bg-white">
          <ul className="menu p-4 space-y-2">
            <li>
              <NavLink to="/" className="font-medium hover:text-primary">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/member" className="font-medium hover:text-primary">
                Membership
              </NavLink>
            </li>

            {/* Notification Bell on Mobile */}
            <li className="relative flex items-center justify-between">
              <span className="font-medium">Notifications</span>
              <div className="relative">
                <button className="btn btn-ghost btn-circle">
                  <Bell size={20} />
                  <span className="badge badge-xs badge-error absolute top-1 right-1"></span>
                </button>
              </div>
            </li>

            {/* Mobile: User Dropdown */}
            <li>
              {user ? (
                <details className="bg-white rounded-box">
                  <summary className="cursor-pointer font-medium">
                    Account
                  </summary>
                  <ul className="p-2 space-y-1">
                    <li>
                      <button onClick={handleDashboardRedirect}>Dashboard</button>
                    </li>
                    <li>
                      <button onClick={handleLogout}>Logout</button>
                    </li>
                  </ul>
                </details>
              ) : (
                <NavLink to="/login" className="btn btn-primary btn-sm w-full">
                  Join Us
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
