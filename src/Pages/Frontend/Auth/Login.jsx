import Lottie from "lottie-react";
import animationData from "../../../../public/Animation - 1751774699813.json";
import { Link } from "react-router"; // fixed import to react-router-dom
import { useContext } from "react";
import { AuthContext } from "../../../Provider/AuthContext";
import Swal from "sweetalert2";
import axios from "axios";

import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";

export default function Login() {
  const { login } = useContext(AuthContext);
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const result = await login(email, password);
      const user = result.user;

      const token = await user.getIdToken();

      const roleResponse = await axios.post(
        "http://localhost:3000/check-role",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userRole = roleResponse.data?.role || "user";

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Login Successful",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        localStorage.setItem("role", userRole);
        if (userRole === "admin") {
          window.location.href = "/adminDashboard";
        } else {
          window.location.href = "/dashboard";
        }
      });
    } catch (error) {
      console.error("Login or Role Check Error:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response?.data?.error || error.message || "Something went wrong.",
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const token = await user.getIdToken();

      const roleResponse = await axios.post(
        "http://localhost:3000/check-role",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userRole = roleResponse.data?.role || "user";

      Swal.fire({
        icon: "success",
        title: "Google Login Successful",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        localStorage.setItem("role", userRole);
        if (userRole === "admin") {
          window.location.href = "/adminDashboard";
        } else {
          window.location.href = "/dashboard";
        }
      });
    } catch (error) {
      console.error("Google Login Error:", error);
      Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: error.message || "Something went wrong.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-300 via-pink-200 to-yellow-100 px-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl flex flex-col md:flex-row overflow-hidden">
        {/* Lottie Animation */}
        <div className="md:w-1/2 p-6 flex justify-center items-center">
          <Lottie animationData={animationData} loop={true} className="w-80" />
        </div>

        {/* Login Form */}
        <div className="md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
            Welcome Back ✈️
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                className="w-full p-3 mt-1 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                className="w-full p-3 mt-1 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="********"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition"
            >
              Log In
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-purple-700 underline">
              Sign up
            </Link>
          </p>

          {/* Google Login Button */}
          <div className="mt-6">
            <p className="text-center text-sm text-gray-600 mb-2">Or log in with</p>
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-3 w-full border border-gray-300 py-2 rounded-xl hover:shadow-lg transition"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#fbc02d"
                  d="M43.6 20.6h-4.8v-.1H24v7.8h11.4c-1 5.3-6 9-11.4 9-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 7.9 3.2l5.6-5.6C34 8 29.4 6 24 6 12.9 6 4 14.9 4 26s8.9 20 20 20c11.6 0 20-9.4 20-20 0-1.4-.1-2.7-.4-4z"
                />
                <path
                  fill="#e53935"
                  d="M6.3 14.2l6.4 4.7c1.9-3.6 5.8-6.1 10.3-6.1 3.1 0 5.9 1.2 7.9 3.2l5.6-5.6C34 8 29.4 6 24 6 15.7 6 8.2 10.9 6.3 14.2z"
                />
                <path
                  fill="#4caf50"
                  d="M24 44c5.7 0 10.7-3.7 12.5-9h-12.5v-7.8H24v17.8z"
                />
                <path
                  fill="#1565c0"
                  d="M43.6 20.6H24v7.8h11.4c-.7 3.8-3.8 6.9-7.9 7.8v-7.8z"
                />
              </svg>
              <span className="text-sm font-medium">Continue with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
