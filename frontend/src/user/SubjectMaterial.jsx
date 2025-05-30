import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  BookOpenIcon,
  ArrowLeftIcon,
  DownloadIcon,
  ExternalLinkIcon,
  SearchIcon,
} from "lucide-react";
import EnhancedBookLoader from "../components/BookLoader";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

function SubjectMaterialPage() {
  const { category, branchName, subjectName } = useParams();
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await fetch(
          `https://acadmate-backend.onrender.com/api/materials/${category}/${branchName}/${subjectName}/files`
        );
        if (!res.ok) throw new Error("Failed to fetch materials");
        const data = await res.json();
        setMaterials(data);
        setFilteredMaterials(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [branchName, subjectName]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = materials.filter(
      (material) =>
        material.fileName?.toLowerCase().includes(term) ||
        material.description?.toLowerCase().includes(term)
    );
    setFilteredMaterials(filtered);
  }, [searchTerm, materials]);

  const token = useSelector((state) => state.auth.authUser?.token);
  const handleSave = async (fileId) => {
    try {
      const res = await fetch("https://acadmate-backend.onrender.com/api/materials/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fileId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save");
      }

      toast.success("Material saved successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to save material");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <EnhancedBookLoader />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Error Loading Materials
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen rounded-lg bg-gradient-to-b from-sky-100 to-blue-100 dark:from-gray-900 dark:to-gray-950 p-6 pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <motion.button
          onClick={() => navigate(-1)}
          whileHover={{ x: -4 }}
          className="flex items-center gap-2 text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 transition mb-8 group"
        >
          <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Subjects</span>
        </motion.button>

        {/* Subject Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <BookOpenIcon className="w-8 h-8 text-blue-600 dark:text-blue-300" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-blue-800 dark:text-blue-200">
              {subjectName} Materials
            </h1>
          </div>
          <p className="text-lg text-blue-600 dark:text-blue-400">
            Study resources for {subjectName} in {branchName}
          </p>
        </motion.div>

        {/* 🔍 Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 pl-12 pr-4 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Materials List */}
        <div className="flex flex-col gap-6 w-full">
          <AnimatePresence>
            {filteredMaterials.length > 0 ? (
              filteredMaterials.map((material, index) => (
                <motion.div
                  key={material._id}
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
                  className="bg-white dark:bg-sky-100  rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300 origin-center"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {material.fileName?.split(".").slice(0, -1).join(".") ||
                          "Untitled"}
                      </h3>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {material.fileName?.split(".").pop().toUpperCase() ||
                          "FILE"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {material.description}
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <a
                        href={`${material.webUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 px-3 rounded-full font-medium transition-colors duration-300"
                      >
                        <ExternalLinkIcon className="w-4 h-4" />
                        View & Download Material
                      </a>

                      {material.downloadUrl && (
                        <a
                          href={`https://acadmate-backend.onrender.com/api/materials/download/${material.fileSlug}`}
                          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-full transition-colors duration-300"
                        >
                          <DownloadIcon className="w-4 h-4" />
                          Download
                        </a>
                      )}
                      {material._id && (
                        <button
                          onClick={() => handleSave(material._id)}
                          disabled={savedIds.includes(material._id)}
                          className={`flex items-center gap-2 ${
                            savedIds.includes(material._id)
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-600 hover:bg-green-800"
                          } text-white font-medium py-2 px-4 rounded-full transition-colors duration-300`}
                        >
                          💾{" "}
                          {savedIds.includes(material._id) ? "Saved" : "Save"}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-16"
              >
                <div className="text-gray-400 mb-4">
                  <BookOpenIcon className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">
                  No Materials Found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  We couldn't find any materials matching your search.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default SubjectMaterialPage;
