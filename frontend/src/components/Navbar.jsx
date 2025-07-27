import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { logoutUser } from "../redux/slices/authSlice";
import { toast } from "react-toastify";
import { Sun, Moon, Menu, X } from "lucide-react";

// Assets
import logoLight from "../components/logo.png";
import logoDark from "../components/logo1.png";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.authUser?.user);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode based on preference or saved state
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedMode === "true" || (!savedMode && prefersDark)) {
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

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src={darkMode ? logoDark : logoLight}
              alt="AcadMate"
              className="h-10 w-auto transition-all duration-300 group-hover:scale-105"
              style={{ height: "70px" }}
            />
            <span className="ml-3 text-xl font-semibold text-gray-800 dark:text-white">
              AcadMate
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/games" label="Play Games" />
            {user && <NavLink to="/profile" label="My Profile" />}

            <DarkModeButton darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

            {user ? (
              <SignOutButton onClick={handleLogout} />
            ) : (
              <AuthLinks />
            )}
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center">
            <DarkModeButton darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-white dark:bg-gray-900">
          <LinkItem to="/games" label="Play Games" onClick={() => setMobileMenuOpen(false)} />
          {user && <LinkItem to="/profile" label="My Profile" onClick={() => setMobileMenuOpen(false)} />}

          {user ? (
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Sign Out
            </button>
          ) : (
            <>
              <LinkItem to="/login" label="Log In" onClick={() => setMobileMenuOpen(false)} />
              <LinkItem to="/signup" label="Sign Up" onClick={() => setMobileMenuOpen(false)} isPrimary />
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

// --- Subcomponents ---

const NavLink = ({ to, label }) => (
  <Link
    to={to}
    className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all relative group"
  >
    {label}
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full" />
  </Link>
);

const DarkModeButton = ({ darkMode, toggleDarkMode }) => (
  <button
    onClick={toggleDarkMode}
    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
    aria-label="Toggle Dark Mode"
  >
    {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
  </button>
);

const SignOutButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="ml-2 px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
  >
    Sign Out
  </button>
);

const AuthLinks = () => (
  <div className="flex items-center space-x-4 ml-2">
    <Link
      to="/login"
      className="px-4 py-2 rounded-md text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800"
    >
      Log In
    </Link>
    <Link
      to="/signup"
      className="px-4 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
    >
      Sign Up
    </Link>
  </div>
);

const LinkItem = ({ to, label, onClick, isPrimary }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block w-full px-3 py-3 rounded-md text-base font-medium text-center ${
      isPrimary
        ? "text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
        : "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800"
    } transition-all duration-300`}
  >
    {label}
  </Link>
);
