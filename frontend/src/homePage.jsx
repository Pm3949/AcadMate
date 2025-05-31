import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import MouseGlow from "./components/mouseGlow";
import { Sun, Moon } from "lucide-react";

export default function HomePage() {
  const isLoggedIn = localStorage.getItem("token") !== null;
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage first, then system preference
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) return savedMode === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Apply dark mode class to HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-sky-100 rounded-xl dark:bg-[#0d1117] text-gray-900 dark:text-white flex flex-col justify-between px-4 transition-colors duration-300">
      <MouseGlow darkMode={darkMode} />
      
      {/* Dark mode toggle button */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      {/* Hero Section */}
      <div className="text-center py-24 sm:py-32">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold mb-4"
        >
          Welcome to <span className="text-indigo-600 dark:text-indigo-400">AcadMate</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-600 dark:text-gray-300 mb-8"
        >
          Your academic companion for smart learning.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {isLoggedIn ? (
            <>
              <Link to="/materials/categories">
                <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold px-6 py-2 rounded-full transition">
                  Check Resources
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-full transition">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold px-6 py-2 rounded-full transition">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </motion.div>
      </div>

      {/* Feature Highlights */}
      <section className="text-center mt-10 mb-16">
        <h2 className="text-2xl font-semibold mb-6">Why AcadMate?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-9 max-w-5xl mx-auto text-gray-600 dark:text-gray-300 px-4">
          <div className="relative group overflow-hidden bg-gray-100 dark:bg-[#161b22] rounded-xl p-6 transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500/20 to-indigo-700/20 opacity-0 group-hover:opacity-100 transition duration-500 rounded-xl blur-2xl z-0" />
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">📚 Study Smart</h3>
              <p className="text-sm">Access curated notes, PYQs, and guides for every subject and branch.</p>
            </div>
          </div>

          <div className="relative group overflow-hidden bg-gray-100 dark:bg-[#161b22] rounded-xl p-6 transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-500/20 to-pink-700/20 opacity-0 group-hover:opacity-100 transition duration-500 rounded-xl blur-2xl z-0" />
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">🧠 Compete & Learn</h3>
              <p className="text-sm">Join real-time mental math duels to sharpen your speed and logic.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="text-center text-gray-500 dark:text-gray-400 italic mb-10 px-4">
        "AcadMate helped me revise smarter and compete better. Highly recommended!"
      </section>
    </div>
  );
}
