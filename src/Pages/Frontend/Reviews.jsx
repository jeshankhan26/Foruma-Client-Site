import React from "react";
import { FaStar } from "react-icons/fa";

const reviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Traveler",
    review:
      "Amazing experience! The booking process was smooth, and the trip was unforgettable. Highly recommend!",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: 2,
    name: "Michael Smith",
    role: "Businessman",
    review:
      "Great service and very professional. The team helped me arrange everything hassle-free.",
    rating: 4,
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 3,
    name: "Emily Davis",
    role: "Student",
    review:
      "I loved how organized everything was. Customer support was quick to respond to my questions.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];

const Reviews = () => {
  return (
    <div className="bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          What Our Customers Say
        </h2>
        <p className="text-gray-600 mb-10">
          Here are some of the amazing experiences our clients shared with us.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              {/* Reviewer Image */}
              <div className="flex justify-center mb-4">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
                />
              </div>

              {/* Reviewer Name + Role */}
              <h3 className="text-lg font-semibold text-gray-800">
                {review.name}
              </h3>
              <p className="text-gray-500 text-sm">{review.role}</p>

              {/* Review Text */}
              <p className="text-gray-700 mt-4 italic">"{review.review}"</p>

              {/* Rating */}
              <div className="flex justify-center mt-4 text-yellow-500">
                {Array.from({ length: review.rating }, (_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
