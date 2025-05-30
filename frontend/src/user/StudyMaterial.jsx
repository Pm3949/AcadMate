import { useState, useEffect } from "react";
import { Link, useLocation, useParams,useNavigate } from "react-router-dom";
import EnhancedBookLoader from "../components/BookLoader";
import { ArrowLeftIcon } from "lucide-react";
import { motion } from "framer-motion";

function StudyMaterial() {
  const { category } = useParams();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const decodedCategory = decodeURIComponent(category);
  const navigate = useNavigate();

  // Debug: Log current location
  useEffect(() => {
    console.log("StudyMaterial - Current location:", location.pathname);
  }, [location]);
  // Sample branch images
  const branchImages = {
    ComputerScience:
      "https://source.unsplash.com/random/300x200/?computer,science",
    Electrical:
      "https://source.unsplash.com/random/300x200/?electrical,engineering",
    Electronics:
      "https://source.unsplash.com/random/300x200/?electronics,circuit",
    Mechanical: "https://source.unsplash.com/random/300x200/?mechanical,engine",
    Civil: "https://source.unsplash.com/random/300x200/?civil,construction",
    Mining: "https://source.unsplash.com/random/300x200/?mining,industry",
    Petroleum: "https://source.unsplash.com/random/300x200/?petroleum,oil",
    Mineral: "https://source.unsplash.com/random/300x200/?mineral,geology",
  };

  useEffect(() => {
    console.log("StudyMaterial - Current location:", location.pathname);

    let isMounted = true;

    const fetchBranches = async () => {
      try {
        console.log("Fetching branches from API...");
        const response = await fetch(
          `https://acadmate-backend.onrender.com/api/materials/${encodeURIComponent(
            decodedCategory
          )}/branches`
        );

        if (!response.ok)
          throw new Error(`Failed to fetch branches: ${response.status}`);

        const data = await response.json();
        console.log("Fetched branches data:", data);

        if (isMounted) {
          setBranches(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching branches:", err);
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchBranches();

    return () => {
      isMounted = false;
    };
  }, [decodedCategory]);

  if (loading) {
    return (
      <div>
        <EnhancedBookLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p>Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
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
            Select a branch to explore study materials
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {branches.map((branch, index) => (
            <div
              key={branch._id || `branch-${index}`}
              className="bg-white dark:bg-sky-100 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col relative"
            >
              {/* Branch Image */}
              <div className="w-full h-48 overflow-hidden flex items-center justify-center bg-gray-00">
                <img
                  src={
                    branchImages[branch.branch] ||
                    "https://source.unsplash.com/random/300x200/?engineering"
                  }
                  alt={branch.branch}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-169994-674010.jpg&fm=jpg";
                  }}
                />
              </div>

              {/* Bottom Section */}
              <div className="p-4 flex items-center justify-between  mt-auto border-t border-gray-100"> 
                {/* Use Link instead of button with navigate */}
                <Link
                  to={`/materials/${encodeURIComponent(
                    decodedCategory
                  )}/${encodeURIComponent(branch.branch)}`}
                  className="p-2 rounded-full bg-blue-200 text-blue-600 hover:bg-blue-200 transition-colors duration-200 flex items-center justify-center"
                  aria-label={`View ${branch.branch} materials`}
                  onClick={() =>
                    console.log("Link clicked for:", branch.branch)
                  }
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

                {/* Branch Name */}
                <span className="text-lg font-semibold text-gray-800 ml-2">
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
