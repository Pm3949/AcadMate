import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import EnhancedBookLoader from '../components/BookLoader';
import { Link } from 'react-router-dom';

const fetchCategories = async () => {
  const res = await axios.get(
    `https://acadmate-backend.onrender.com/api/materials/categories`
      // `http://localhost:5000/api/materials/categories`
  );
  return res.data;
};

const MaterialCategoriesPage = () => {
  const {
    data: categories,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['material-categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 min cache
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <EnhancedBookLoader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p className="font-medium">Error loading categories: {error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Browse through our collection of study materials and previous year question papers
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-xl">No categories available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {categories.map((category, index) => (
              <Link
                key={category._id || `category-${index}`}
                to={`/materials/${encodeURIComponent(category.category)}`}
                className="group"
              >
                <div className="bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex border border-gray-200 dark:border-gray-600 group-hover:border-blue-400">
                  <div className="w-1/3 bg-blue-100 dark:bg-blue-900 flex items-center justify-center p-6">
                    <div className="w-20 h-20 rounded-full bg-blue-300 dark:bg-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-300 group-hover:bg-blue-200 dark:group-hover:bg-blue-700 transition-colors">
                      📘
                    </div>
                  </div>
                  <div className="w-2/3 p-8 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {category.category}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      {category.category.toLowerCase().includes("previous year") ||
                      category.category.toLowerCase().includes("pyq") ? (
                        <>Access all Previous Year Papers for all branches and subjects</>
                      ) : category.category.toLowerCase().includes("study material") ||
                        category.category.toLowerCase().includes("notes") ? (
                        <>Access complete Study Materials for all subjects</>
                      ) : (
                        <>Access all resources including notes and previous year papers</>
                      )}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                        Explore →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialCategoriesPage;
