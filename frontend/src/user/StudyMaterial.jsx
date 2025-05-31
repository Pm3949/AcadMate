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
  "Applied Geology": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-vector%2Fgeomorphology-abstract-concept-vector-illustration-geomorphology-type-geomorphic-process-earth-science-university-discipline-graduate-study-geology-course-applied-study-abstract-metaphor_11668288.htm&psig=AOvVaw2lJ_2vBak7gAhtS6JRRv_S&ust=1748758403708000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNDEmu-GzY0DFQAAAAAdAAAAABAE",
  "Applied Geophysics": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.dreamstime.com%2Fgeophysics-abstract-concept-vector-illustration-geo-physical-survey-earth-science-applied-geophysics-university-course-geoscience-image192478222&psig=AOvVaw3EXjurqOaNgigAC0JXKo85&ust=1748758459196000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKiRloqHzY0DFQAAAAAdAAAAABAE",
  "Chemical Engineering": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Fvectors%2Fchemical-engineering&psig=AOvVaw3tRzN9a7xEyAMQJs_NyWjI&ust=1748758513111000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKjlqaSHzY0DFQAAAAAdAAAAABAE",
  "Civil Engineering": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Fvectors%2Fcivil-construction&psig=AOvVaw19EppH-BHJSJIfmbrHXKXh&ust=1748758565689000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMjC7r6HzY0DFQAAAAAdAAAAABAL",
  "Computer Science and Engineering": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Fvectors%2Fcomputer-science&psig=AOvVaw14IMYd0NYl5fK14Lbd5Y-y&ust=1748758624946000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMDXhtqHzY0DFQAAAAAdAAAAABAE",
  "Electrical Engineering": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Fvectors%2Felectrical-engineer&psig=AOvVaw1Bb2KdB_6uanGsCTQpjDy8&ust=1748758666121000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMisgPOHzY0DFQAAAAAdAAAAABAE",
  "Electronics Engineering": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fillustrations%2Felectrical-engineering-lab&psig=AOvVaw1xWgClj_1j4oBchAZAlky9&ust=1748758736905000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMC27I-IzY0DFQAAAAAdAAAAABAV",
  "Environmental Science and Engineering": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Fvectors%2Fenvironmental-engineering&psig=AOvVaw1qzd9Kty40lywRlXwcwZ0j&ust=1748758806509000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPDW8LKIzY0DFQAAAAAdAAAAABAE",
  "Fuel and Mineral Engineering": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Fvector-art%2F9783345-oil-rig-extraction-of-minerals-fuel-production-heavy-industry-tower-to-pump-black-liquid-middle-east-mountains-and-desert-oil-tank-natural-scenery-engineer-s-place-of-work-flat-cartoon&psig=AOvVaw0_xfjpFIWw0Raq5zzcM1gv&ust=1748759116344000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKDb4MCJzY0DFQAAAAAdAAAAABAE",
  "Humanities and Social Sciences": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.dreamstime.com%2Fillustration%2Fhumanities-vector.html&psig=AOvVaw2QGZBCOnn4u9CjCwMNDQuL&ust=1748759144852000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMjG5taJzY0DFQAAAAAdAAAAABAE",
  "Management Studies": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Fvectors%2Fbusiness-studies&psig=AOvVaw3m3Ir1VaU6AG9gLkh9HPqi&ust=1748759196954000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCLDJi-eJzY0DFQAAAAAdAAAAABAE",
  "Mathematics and Computing": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.123rf.com%2Fphoto_60319695_vector-illustration-of-book-of-knowledge-for-mathematics.html&psig=AOvVaw1tmyVwgsaHJhm4TrGPDu0_&ust=1748759223308000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNiZpvmJzY0DFQAAAAAdAAAAABAE",
  "Mechanical Engineering": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fmechanical-engineering&psig=AOvVaw1QqObRYBHLHVR5MX_kT-cY&ust=1748759331810000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCPD09aeKzY0DFQAAAAAdAAAAABAE",
  "Mining Engineering": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Fpremium-vector%2Fmining-engineering-icon-mine-industry_44233437.htm&psig=AOvVaw3C_jyniPYmQiIWY8UCEJCE&ust=1748758968058000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCKjd6_uIzY0DFQAAAAAdAAAAABAW",
  "Petroleum Engineering": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Fvectors%2Fpetroleum-engineer%2F4&psig=AOvVaw3yjG0FtOWQfBn3LNBKF32r&ust=1748758909573000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMi_9-KIzY0DFQAAAAAdAAAAABAE",
  "Physics": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.dreamstime.com%2Fillustration%2Fengineering-physics.html&psig=AOvVaw0_MTaVo7SufF2ZjWMUKZxw&ust=1748759387420000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCIjT98WKzY0DFQAAAAAdAAAAABAE",
  "Mining Machinery Engineering": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Fvectors%2Fmining-machinery&psig=AOvVaw16SitqdQjLpvlCE1zxa3yL&ust=1748759077416000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMjm-rCJzY0DFQAAAAAdAAAAABAE",
  "Industrial Engineering and Management": "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.123rf.com%2Fphoto_118472128_automation-and-industrial-engineering-management-icons.html&psig=AOvVaw0UTeWnUEsacvfAxBEWqJT3&ust=1748759431508000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCID8oOeKzY0DFQAAAAAdAAAAABAE"
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
             All study materials(CORE, OE, DE, ESO) are organized under their respective departments for easy navigation.
      Please select your department below to access relevant files.
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
