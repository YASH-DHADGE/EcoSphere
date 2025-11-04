import React from 'react';
import { Link } from 'react-router-dom';

const ContactModal: React.FC = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eaf4ec] via-[#f7faf8] to-[#e0f0e2] dark:from-[#0f1b14] dark:via-[#14241a] dark:to-[#0a1610] py-12 px-4 sm:px-6 lg:px-8 animate-fadeInUp"
      style={{ animationDuration: '0.4s' }}
    >
      <div className="relative bg-white/80 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-gray-200 dark:border-gray-700">
        
        {/* ✖ Close Button */}
        <Link
          to="/"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>

        {/* 🏷️ Title */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          Contact <span className="text-emerald-700 dark:text-emerald-400">EcoSphere</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
          Have questions, suggestions, or want to collaborate? We'd love to hear from you!
        </p>

        {/* 📬 Contact Form */}
        <form className="space-y-5">
          <div>
            <label
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
              htmlFor="contact-name"
            >
              Full Name
            </label>
            <input
              type="text"
              id="contact-name"
              placeholder="John Doe"
              className="mt-1 block w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
            />
          </div>

          <div>
            <label
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
              htmlFor="contact-email"
            >
              Email
            </label>
            <input
              type="email"
              id="contact-email"
              placeholder="you@example.com"
              className="mt-1 block w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition"
            />
          </div>

          <div>
            <label
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
              htmlFor="message"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              placeholder="Your message..."
              className="mt-1 block w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition resize-none"
            ></textarea>
          </div>

          {/* ✉️ Button */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-lg shadow-md text-white font-medium bg-emerald-700 hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-300 dark:focus:ring-emerald-900 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
