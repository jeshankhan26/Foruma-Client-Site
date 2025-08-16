import { useContext, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import animationData from "../../../../public/Animation - 1751774699813.json";
import Lottie from "lottie-react";
import { Link } from "react-router";  // fixed import here
import Swal from "sweetalert2";
import { GoogleAuthProvider, updateProfile, getAuth, signInWithPopup } from "firebase/auth";
import { AuthContext } from "../../../Provider/AuthContext";
import axios from "axios";

const Register = () => {
  const { createUser } = useContext(AuthContext);
  const googleProvider = new GoogleAuthProvider();
  const auth = getAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    photoURL: "",
    role: "",
    thumbnail: null,
  });

  const [preview, setPreview] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "thumbnail" && files.length > 0) {
      const file = files[0];
      setForm((prev) => ({ ...prev, thumbnail: file }));
      setPreview((prev) => ({
        ...prev,
        thumbnail: URL.createObjectURL(file),
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append("image", image);
    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_UPLOAD_KEY}`;
    const response = await axios.post(imageUploadUrl, formData);
    return response.data.data.url;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Full name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";

    const passwordErrors = [];
    if (form.password.length < 8) passwordErrors.push("At least 8 characters.");
    if (!/[A-Z]/.test(form.password)) passwordErrors.push("Include an uppercase letter.");
    if (!/[a-z]/.test(form.password)) passwordErrors.push("Include a lowercase letter.");
    if (!/[0-9]/.test(form.password)) passwordErrors.push("Include a number.");
    if (!/[!@#$%^&*]/.test(form.password)) passwordErrors.push("Include a special character.");
    if (passwordErrors.length > 0) newErrors.password = passwordErrors.join(" ");

    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const result = await createUser(form.email, form.password);
      const user = result.user;

      let uploadedImageUrl = "https://i.ibb.co/2M4C3BJ/default-avatar.png";
      if (form.thumbnail) {
        uploadedImageUrl = await uploadImage(form.thumbnail);
      }

      await updateProfile(user, {
        displayName: form.name,
        photoURL: uploadedImageUrl,
      });

      const response = await fetch("http://localhost:3000/adduser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          photoURL: uploadedImageUrl,
          role: "user",
        }),
      });

      const data = await response.json();

      if (data.insertedId) {
        const token = await user.getIdToken();
        await axios.post(
          "http://localhost:3000/api/membership",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Registration & Membership Successful!",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          window.location.href = "/";
        });
      } else {
        throw new Error("User data not saved to server");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message || "Something went wrong!",
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const saveRes = await fetch("http://localhost:3000/adduser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          role: "user",
        }),
      });

      const data = await saveRes.json();

      const token = await user.getIdToken();
      await axios.post(
        "http://localhost:3000/api/membership",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Welcome!",
        text: "Signed in with Google successfully!",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        window.location.href = "/";
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Google Sign-In Failed",
        text: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 to-indigo-300 px-4">
      <div className="bg-white shadow-2xl rounded-2xl flex flex-col md:flex-row max-w-5xl w-full overflow-hidden">
        <div className="md:w-1/2 p-6 flex justify-center items-center">
          <Lottie animationData={animationData} loop={true} className="w-80" />
        </div>

        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
            Create Your Account
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Profile Picture</label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <label
                  htmlFor="thumbnail"
                  className="cursor-pointer w-32 h-32 flex items-center justify-center border-2 border-dashed border-purple-400 rounded-full overflow-hidden hover:shadow-lg transition"
                >
                  {preview.thumbnail ? (
                    <img src={preview.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm text-purple-400 text-center p-2">Click to Upload</span>
                  )}
                  <input
                    type="file"
                    id="thumbnail"
                    name="thumbnail"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
                {form.thumbnail && (
                  <p className="text-sm text-gray-500">{form.thumbnail.name}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="accent-purple-600" required />
              <label>I agree to the Terms & Conditions</label>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition duration-300"
            >
              Register
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account? <Link to="/login" className="text-purple-700 underline">Sign in</Link>
          </p>

          <div className="mt-6">
            <p className="text-center text-sm text-gray-600 mb-2">Or sign up with</p>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-3 w-full border border-gray-300 py-2 rounded-lg hover:shadow-lg transition"
            >
              <FcGoogle size={22} />
              <span className="text-sm font-medium">Continue with Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
