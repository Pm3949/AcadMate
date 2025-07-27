import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sun, Moon } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    collegeName: '',
    branch: '',
    program: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedMode === "true" || (!savedMode && systemPrefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setLoading(true);
      const response = await axios.post(
        'https://acadmate-backend.onrender.com/api/users/register', 
        // 'http://localhost:5000/api/users/register',
        formData);
      if (response.data.success) {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">

      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
        </div>
        {error && (
          <div className="bg-red-100 dark:bg-red-200 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {[
  { name: "name", type: "text", placeholder: "Full Name" },
  { name: "email", type: "email", placeholder: "Email address" },
  { name: "password", type: "password", placeholder: "Password" },
  { name: "confirmPassword", type: "password", placeholder: "Confirm Password" },
  { name: "collegeName", type: "text", placeholder: "College Name" }
].map(({ name, type, placeholder }) => (
  <div key={name}>
    <input
      name={name}
      type={type}
      required
      disabled={name === "collegeName"}
      value={name === "collegeName" ? "IIT (ISM) Dhanbad" : formData[name]}
      onChange={handleChange}
      className={`appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${
        name === "collegeName" ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : ""
      }`}
      placeholder={placeholder}
    />
  </div>
))}


            <div>
  <select
    name="branch"
    required
    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
    value={formData.branch}
    onChange={handleChange}
  >
    <option value="">Select Branch</option>
    <option value="Chemical Engineering">Chemical Engineering</option>
    <option value="Civil Engineering">Civil Engineering</option>
    <option value="Computer Science and Engineering">Computer Science and Engineering</option>
    <option value="Electrical Engineering">Electrical Engineering</option>
    <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
    <option value="Engineering Physics">Engineering Physics</option>
    <option value="Environmental Engineering">Environmental Engineering</option>
    <option value="Mechanical Engineering">Mechanical Engineering</option>
    <option value="Mining Engineering">Mining Engineering</option>
    <option value="Mining Machinery Engineering">Mining Machinery Engineering</option>
    <option value="Mineral and Metallurgical Engineering">Mineral and Metallurgical Engineering</option>
    <option value="Mathematics and Computing">Mathematics and Computing</option>
    <option value="Petroleum Engineering">Petroleum Engineering</option>
    <option value="Applied Geology">Applied Geology</option>
    <option value="Applied Geophysics">Applied Geophysics</option>
    <option value="Chemical Science">Chemical Science</option>
    <option value="Physical Science">Physical Science</option>
  </select>
</div>

            <div>
              <select
                name="program"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={formData.program}
                onChange={handleChange}
              >
                <option value="">Select Program</option>
                <option value="BTech">B.Tech</option>
                <option value="MTech">M.Tech</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </form>
        <div className="text-center text-gray-600 dark:text-gray-300">
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
