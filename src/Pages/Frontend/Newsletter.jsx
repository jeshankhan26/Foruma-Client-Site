import React, { useState } from "react";
import Swal from "sweetalert2";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Email Required",
        text: "Please enter a valid email address.",
      });
      return;
    }

    // Here you can connect with your backend (POST to /newsletter)
    console.log("Subscribed:", email);

    Swal.fire({
      icon: "success",
      title: "Subscribed!",
      text: "You have successfully subscribed to our newsletter.",
    });

    setEmail("");
  };

  return (
    <div className="bg-white py-16 px-6 flex justify-center">
      <div className="max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Subscribe to our Newsletter
        </h2>
        <p className="text-gray-600 mb-8">
          Stay updated with the latest news, announcements, and discussions.
          Enter your email below to subscribe.
        </p>

        <form
          onSubmit={handleSubscribe}
          className="flex flex-col md:flex-row items-center gap-4"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full md:w-2/3 bg-gray-100"
            required
          />
          <button
            type="submit"
            className="btn btn-primary w-full md:w-auto bg-blue-500 hover:bg-blue-600 border-none"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;
