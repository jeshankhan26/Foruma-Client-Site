import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-700 border-t border-gray-200 pt-10">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold text-primary mb-2">FormZone</h2>
          <p className="text-sm text-gray-600">
            Explore articles by category. Discover insights, tips, and trends across your favorite topics.
          </p>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-md font-semibold mb-2">FormZone</h3>
          <ul className="space-y-1 text-sm">
            <li><a className="link link-hover">Technology</a></li>
            <li><a className="link link-hover">Health</a></li>
            <li><a className="link link-hover">Lifestyle</a></li>
            <li><a className="link link-hover">Business</a></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-md font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><a className="link link-hover">About Us</a></li>
            <li><a className="link link-hover">Contact</a></li>
            <li><a className="link link-hover">Privacy Policy</a></li>
            <li><a className="link link-hover">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-md font-semibold mb-2">Follow Us</h3>
          <div className="flex gap-4 text-xl text-gray-600 mt-2">
            <a href="#" className="hover:text-blue-500"><FaFacebookF /></a>
            <a href="#" className="hover:text-sky-400"><FaTwitter /></a>
            <a href="#" className="hover:text-pink-500"><FaInstagram /></a>
            <a href="#" className="hover:text-blue-700"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-400 py-4 border-t border-gray-100">
        © {new Date().getFullYear()} FormZone. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
