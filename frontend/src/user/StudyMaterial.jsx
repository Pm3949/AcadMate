import { useParams, useNavigate, Link } from "react-router-dom";
import EnhancedBookLoader from "../components/BookLoader";
import { ArrowLeftIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

function StudyMaterial() {
  const { category } = useParams();
  const decodedCategory = decodeURIComponent(category);
  const navigate = useNavigate();

  const fetchBranches = async () => {
    const cachedData = sessionStorage.getItem(`branches-${decodedCategory}`);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const response = await fetch(
      `https://acadmate-backend.onrender.com/api/materials/${encodeURIComponent(decodedCategory)}/branches`
      // `http://localhost:5000/api/materials/${encodeURIComponent(decodedCategory)}/branches`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch branches");
    }

    const data = await response.json();
    sessionStorage.setItem(`branches-${decodedCategory}`, JSON.stringify(data));
    return data;
  };

  const {
    data: branches = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["branches", decodedCategory],
    queryFn: fetchBranches,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
        <EnhancedBookLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p>Error: {error.message}</p>
          <button
            onClick={() => refetch()}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen rounded-lg bg-sky-50 dark:bg-gray-800 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ x: -4 }}
            className="flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 transition mb-8 group"
          >
            <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Categories</span>
          </motion.button>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Engineering Branches
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            All study materials (CORE, OE, DE, ESO) are organized under their
            respective departments for easy navigation. Please select your
            department below to access relevant files.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {branches.map((branch, index) => (
            <div
              key={branch._id || `branch-${index}`}
              className="bg-white dark:bg-sky-200 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col relative"
            >
              <div className="w-full h-48 overflow-hidden flex items-center justify-center bg-gray-100">
                <img
                  src={`/images/${branch.branch}.jpg`}
                  alt={branch.branch}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/default.jpg";
                  }}
                />
              </div>

              <div className="p-4 flex items-center justify-between mt-auto">
                <Link
                  to={`/materials/${encodeURIComponent(decodedCategory)}/${encodeURIComponent(branch.branch)}`}
                  className="p-2 rounded-full bg-blue-300 text-blue-600 hover:bg-blue-300 transition-colors duration-200 flex items-center justify-center"
                  aria-label={`View ${branch.branch} materials`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
                <span className="text-lg font-semibold text-gray-900 ml-2">
                  {branch.branch}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StudyMaterial;
