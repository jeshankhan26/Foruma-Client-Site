import React, { useContext, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { AuthContext } from "../../../Provider/AuthContext"; // ✅ Adjust path as needed

const CheckoutForm = () => {
  const { user } = useContext(AuthContext); // 🔐 Get logged-in user
  const stripe = useStripe();               // ⚙️ Stripe instance
  const elements = useElements();           // 💳 Stripe Elements (CardElement)

  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setIsPaying(true);
    setErrorMsg("");

    try {
      // 🔄 1. Create PaymentIntent on server
      const response = await axios.post("https://foruma-server-site.vercel.app/create-payment-intent", {
        amount: 500, // $5.00 in cents
        userEmail: user?.email,
      });

      const clientSecret = response.data.clientSecret;

      // 💳 2. Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setErrorMsg(result.error.message);
        console.error("❌ Stripe error:", result.error);
      } else if (result.paymentIntent.status === "succeeded") {
        setPaymentSuccess(true);
      }
    } catch (error) {
      console.error("❌ Error in handlePayment:", error);
      setErrorMsg("Something went wrong. Try again.");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="bg-white max-w-md mx-auto p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">🔐 Secure Membership Payment</h2>

      <CardElement className="border p-4 rounded mb-4" />

      <button
        onClick={handlePayment}
        disabled={!stripe || !elements || isPaying}
        className="bg-indigo-600 text-white py-2 px-4 w-full rounded hover:bg-indigo-700 transition"
      >
        {isPaying ? "Processing..." : "Pay $5"}
      </button>

      {paymentSuccess && (
        <p className="text-green-600 mt-4 text-center font-medium">
          ✅ Payment successful! Welcome to the membership.
        </p>
      )}

      {errorMsg && (
        <p className="text-red-500 mt-2 text-center">{errorMsg}</p>
      )}
    </div>
  );
};

export default CheckoutForm;
