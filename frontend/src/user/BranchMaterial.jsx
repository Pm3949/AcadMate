import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BookOpenIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from "lucide-react";
import EnhancedBookLoader from "../components/BookLoader";
import { motion, AnimatePresence } from "framer-motion";

function BranchMaterialPage() {
  const { branchName } = useParams();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredSubject, setHoveredSubject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);


  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/materials/${branchName}`
        );
        if (!res.ok) throw new Error("Failed to fetch subjects");
        const data = await res.json();
        const subjectsArray = data.map((item) => item.subject);
        setSubjects(subjectsArray);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [branchName]);

  const filteredSubjects = subjects.filter((subject) =>
    subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
        <EnhancedBookLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg max-w-md text-center">
          <div className="text-red-500 dark:text-red-400 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            Error Loading Subjects
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen rounded-lg bg-gradient-to-b from-sky-100 to-blue-100 dark:from-gray-800 dark:to-gray-900 p-6 pb-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <motion.button
          onClick={() => navigate(-1)}
          whileHover={{ x: -4 }}
          className="flex items-center gap-2 text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition mb-8 group"
        >
          <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Branches</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 dark:text-sky-100 mb-3">
            {branchName} Subjects
          </h1>
          <p className="text-lg text-blue-600 dark:text-sky-100 max-w-2xl mx-auto">
            Explore study materials for each subject in {branchName} engineering
          </p>
        </motion.div>
        <div className="w-full max-w-2xl mx-auto mb-10 relative">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects..."
            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <AnimatePresence>
            {filteredSubjects.map((subject, index) => (
              <motion.div
                key={subject}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale:
                      hoveredIndex === index
                        ? 1.1
                        : hoveredIndex === null
                        ? 1
                        : 0.95,
                    zIndex: hoveredIndex === index ? 10 : 1,
                  }}
                  transition={{ duration: 0.1 }}
                className="relative overflow-hidden"
              >
                <div
                  className={`bg-white dark:bg-sky-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border-l-4 ${
                    hoveredSubject === subject
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                  onClick={() =>
                    navigate(
                      `/materials/branch/${branchName}/subject/${subject}`
                    )
                  }
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-lg ${
                          hoveredSubject === subject
                            ? "bg-blue-200 dark:bg-blue-900"
                            : "bg-sky-100 dark:bg-gray-700"
                        }`}
                      >
                        <BookOpenIcon
                          className={`w-6 h-6 ${
                            hoveredSubject === subject
                              ? "text-blue-600 dark:text-blue-300"
                              : "text-sky-600 dark:text-sky-300"
                          }`}
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-800">
                        {subject}
                      </h3>
                    </div>
                    <ChevronRightIcon
                      className={`w-5 h-5 mt-1 ${
                        hoveredSubject === subject
                          ? "text-blue-500 dark:text-blue-300 translate-x-1"
                          : "text-gray-400 dark:text-gray-500"
                      } transition-transform duration-300`}
                    />
                  </div>
                  {hoveredSubject === subject && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"
                      layoutId="underline"
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredSubjects.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <BookOpenIcon className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">
              {searchQuery ? "No matching subjects" : "No Subjects Available"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery
                ? `No subjects matched "${searchQuery}"`
                : `We couldn't find any subjects for ${branchName} at this time.`}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default BranchMaterialPage;
