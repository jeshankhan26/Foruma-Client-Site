import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Provider/AuthContext";
import { FaCrown } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

const Membership = () => {
  const { user } = useContext(AuthContext);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  // Check membership on load
  useEffect(() => {
    const checkMembership = async () => {
      try {
        const res = await axios.get("http://localhost:3000/allmembers");
        const found = res.data.find((member) => member.email === user?.email);
        if (found && found.status === 1) {
          setIsMember(true);
        }
      } catch (error) {
        console.error("Failed to check membership:", error);
      }
    };

    if (user) checkMembership();
  }, [user]);

  // Handle demo form submit
  const handleDemoPayment = async (e) => {
    e.preventDefault();
    if (!user) return Swal.fire("Error", "Please login first.", "error");

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 1. Update member status
      await axios.patch("http://localhost:3000/members/update", {
        email: user.email,
        status: 1,
      });

      // 2. Save to history
      await axios.post("http://localhost:3000/payment-history", {
        email: user.email,
        name: user.displayName,
        amount: 500,
        cardNumber: cardInfo.cardNumber,
        status: "success",
        date: new Date(),
      });

      Swal.fire("Success", "Your membership is activated!", "success");
      setIsMember(true);
      setOpenModal(false);
    } catch (error) {
      console.error("Demo Payment Failed:", error);
      Swal.fire("Error", "Something went wrong. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-yellow-100 via-white to-yellow-50 px-4 py-12">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-2xl border border-yellow-300 p-10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 animate-pulse"></div>

        <div className="text-yellow-500 text-6xl animate-bounce mb-4">
          <FaCrown />
        </div>

        <h2 className="text-4xl font-extrabold text-gray-800 mb-3">
          {isMember ? "You're a Gold Member ✨" : "Become a Gold Member"}
        </h2>

        <p className="text-gray-600 text-lg mb-6">
          {isMember ? (
            <span className="text-yellow-600 font-bold">Enjoy your premium benefits!</span>
          ) : (
            <>
              Unlock premium features for just{" "}
              <span className="text-yellow-600 font-bold">500 Taka / $5</span>
            </>
          )}
        </p>

        <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 shadow-inner mb-6">
          <ul className="text-left text-gray-700 text-md list-disc list-inside space-y-2">
            <li>🌟 Gold badge next to your name</li>
            <li>📝 Post more than 5 times</li>
            <li>🚀 Boosted visibility in the community</li>
            <li>🤝 Access to exclusive forums</li>
          </ul>
        </div>

        {!isMember && (
          <button
            onClick={() => setOpenModal(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-8 rounded-full text-lg transition-all duration-300 shadow-lg"
          >
            Become a Member
          </button>
        )}

        {/* Modal */}

{openModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-4">
    <form
      onSubmit={handleDemoPayment}
      className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl text-center relative animate-fade-in"
    >
      <h3 className="text-2xl font-bold text-gray-800 mb-1">Secure Payment</h3>
      <p className="text-gray-600 text-sm mb-6">
        Paying as <span className="font-semibold text-yellow-600">{user?.email}</span>
      </p>

      {/* Card Number (auto format xxxx-xxxx-xxxx-xxxx) */}
      <input
        type="text"
        inputMode="numeric"
        placeholder="Card Number (xxxx-xxxx-xxxx-xxxx)"
        maxLength={19}
        value={cardInfo.cardNumber}
        onChange={(e) => {
          let rawValue = e.target.value.replace(/\D/g, ""); // Remove non-digits
          let formatted = rawValue.match(/.{1,4}/g)?.join("-") || "";
          setCardInfo({ ...cardInfo, cardNumber: formatted });
        }}
        className="w-full px-5 py-3 mb-4 border-2 border-gray-200 rounded-xl shadow-sm text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
        required
      />

      {/* Expiry & CVC */}
      <div className="flex gap-4">
        <input
          type="text"
          inputMode="numeric"
          placeholder="MM/YY"
          maxLength={5}
          value={cardInfo.expiry}
          onChange={(e) => {
            let value = e.target.value.replace(/\D/g, "");
            if (value.length >= 3) value = value.slice(0, 2) + "/" + value.slice(2, 4);
            setCardInfo({ ...cardInfo, expiry: value });
          }}
          className="w-1/2 px-5 py-3 mb-4 border-2 border-gray-200 rounded-xl shadow-sm text-center text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
          required
        />
        <input
          type="text"
          inputMode="numeric"
          placeholder="CVC"
          maxLength={3}
          value={cardInfo.cvc}
          onChange={(e) => {
            let value = e.target.value.replace(/\D/g, "");
            setCardInfo({ ...cardInfo, cvc: value.slice(0, 3) });
          }}
          className="w-1/2 px-5 py-3 mb-4 border-2 border-gray-200 rounded-xl shadow-sm text-center text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
          required
        />
      </div>

      {/* Pay Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 mt-2 rounded-xl font-semibold text-white transition-all duration-300 shadow-md ${
          loading
            ? "bg-yellow-300 cursor-not-allowed"
            : "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600"
        }`}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

      {/* Cancel */}
      <button
        type="button"
        onClick={() => setOpenModal(false)}
        className="mt-4 w-full text-sm text-gray-500 hover:text-red-500 transition duration-200"
      >
        Cancel
      </button>
    </form>
  </div>
)}

      </div>
    </div>
  );
};

export default Membership;
