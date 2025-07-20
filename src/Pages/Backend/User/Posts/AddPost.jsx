import React, { useContext, useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router"; // ✅ Fixed import
import { AuthContext } from "../../../../Provider/AuthContext";

const AddPost = () => {
  const { user } = useContext(AuthContext);

  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("React");
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [postCount, setPostCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);

  // Fetch tags
  useEffect(() => {
    fetch("https://foruma-server-site.vercel.app/tags")
      .then((res) => res.json())
      .then((data) => {
        setTags(data);
        if (data.length > 0) setTag(data[0].tag);
      })
      .catch((err) => {
        console.error("Tag fetch failed:", err);
      });
  }, []);

  // Fetch membership + post count
  useEffect(() => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [membersRes, postsRes] = await Promise.all([
          fetch("https://foruma-server-site.vercel.app/allmembers"),
          fetch(`https://foruma-server-site.vercel.app/posts/count?authorEmail=${encodeURIComponent(user.email)}`)
        ]);

        const [members, postData] = await Promise.all([membersRes.json(), postsRes.json()]);
        const member = members.find((m) => m.email === user.email);

        setIsMember(member?.status === 1);
        setPostCount(postData.count || 0);
      } catch (err) {
        console.error("Failed to load membership/post count:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTagChange = (e) => {
    setTag(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      authorName: user?.displayName,
      authorEmail: user?.email,
      authorImage: user?.photoURL || "https://i.ibb.co/2FsfXqM/avatar.png",
      title: formData.title.trim(),
      description: formData.description.trim(),
      tag,
      upvotes: 0,
      downvotes: 0,
      time: new Date().toISOString(),
      comments: 0,
      status: 1,
    };

    if (!postData.title || !postData.description || !postData.tag) {
      Swal.fire("Missing fields", "Please fill out all required fields.", "warning");
      return;
    }

    try {
      const response = await fetch("https://foruma-server-site.vercel.app/addpost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (data.insertedId || data.postId) {
        Swal.fire("🎉 Post Added!", "Your post has been successfully added.", "success");
        setTimeout(() => (window.location.href = "/dashboard/allpost"), 1600);
      } else {
        Swal.fire("Error", data.message || "No post inserted. Please try again.", "error");
      }
    } catch (error) {
      Swal.fire("Error", error.message || "Something went wrong!", "error");
    }
  };

  // Show loading while fetching data
  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-600 font-semibold">
        Loading...
      </div>
    );
  }

  // Show limit warning for non-members with 5 posts
  if (!isMember && postCount >= 5) {
    return (
      <div className="max-w-lg mx-auto mt-16 p-8 bg-gradient-to-br from-yellow-50 via-white to-yellow-100 border border-yellow-300 shadow-2xl rounded-3xl text-center">
        <div className="text-5xl text-yellow-500 mb-4 animate-bounce">🚫</div>
        <h2 className="text-xl font-bold text-gray-700 mb-3">Post Limit Reached</h2>
        <p className="text-gray-600 mb-6">
          You've reached your posting limit as a normal user.
          <br />
          Become a <span className="text-yellow-600 font-semibold">Gold Member</span> to post unlimited content!
        </p>
        <Link to="/member">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-full shadow-md transition duration-300">
            ✨ Upgrade to Gold
          </button>
        </Link>
      </div>
    );
  }

  // Render post form
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg border border-gray-200"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Add New Post
      </h2>

      <label className="block mb-2 font-semibold text-gray-700">Author Image</label>
      <div className="flex justify-center mb-6">
        <img
          src={user?.photoURL || "https://i.ibb.co/2FsfXqM/avatar.png"}
          alt="Author"
          className="rounded-full border-4 border-blue-500 shadow-md w-32 h-32 object-cover"
        />
      </div>

      <label className="block mb-2 font-semibold text-gray-700">Author Name</label>
      <input
        value={user?.displayName}
        type="text"
        className="border border-gray-300 px-4 py-2 rounded-lg w-full mb-5"
        readOnly
      />

      <label className="block mb-2 font-semibold text-gray-700">Author Email</label>
      <input
        value={user?.email}
        type="email"
        className="border border-gray-300 px-4 py-2 rounded-lg w-full mb-5"
        readOnly
      />

      <label className="block mb-2 font-semibold text-gray-700">Title</label>
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        type="text"
        placeholder="Post Title"
        className="border border-gray-300 px-4 py-2 rounded-lg w-full mb-5"
        required
      />

      <label className="block mb-2 font-semibold text-gray-700">Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Post Description"
        className="border border-gray-300 px-4 py-2 rounded-lg w-full mb-5 h-32 resize-none"
        required
      />

      <label className="block mb-2 font-semibold text-gray-700">Tag</label>
      <select
        value={tag}
        onChange={handleTagChange}
        className="border border-gray-300 px-4 py-2 rounded-lg w-full mb-7"
        required
      >
        <option value="" disabled>Choose a tag</option>
        {tags.map((tagItem, idx) => (
          <option key={idx} value={tagItem.tag}>
            {tagItem.tag}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 w-full text-white px-6 py-3 rounded-lg shadow-lg font-semibold text-lg transition-all duration-200"
      >
        Submit Post
      </button>
    </form>
  );
};

export default AddPost;
