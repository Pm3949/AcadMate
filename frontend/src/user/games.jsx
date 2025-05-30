// src/pages/Games.jsx
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// src/pages/Games.jsx


const Games = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">
        🎮 Play Games
      </h1>

      <div className="grid gap-12 max-w-6xl mx-auto md:grid-cols-2">
        {/* Memory Matching Game */}
        <div className="rounded-2xl shadow-xl dark:shadow-lg p-6 bg-gray-100 dark:bg-gray-800 transition-all duration-300">
          <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-4">
            🧠 Memory Matching Game
          </h2>
          <div className="text-center mb-4">
            <a
              href="https://memory-matching-game-eta.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition duration-300"
            >
              Open in New Tab
            </a>
          </div>
          <iframe
            src="https://memory-matching-game-eta.vercel.app"
            title="Memory Matching Game"
            className="w-full h-[600px] rounded-lg border-2 border-gray-300 dark:border-gray-700"
            allowFullScreen
          ></iframe>
        </div>

        {/* Hectoclash */}
        <div className="rounded-2xl shadow-xl dark:shadow-lg p-6 bg-gray-100 dark:bg-gray-800 transition-all duration-300">
          <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-4">
            ⚔️ Hectoclash
          </h2>
          <div className="text-center mb-4">
            <a
              href="https://hectoclash-cuwf.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition duration-300"
            >
              Open in New Tab
            </a>
          </div>
          <iframe
            src="https://hectoclash-cuwf.onrender.com"
            title="Hectoclash"
            className="w-full h-[600px] rounded-lg border-2 border-gray-300 dark:border-gray-700"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Games;
