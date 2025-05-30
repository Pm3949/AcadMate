import React from "react";
import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import StudyMaterial from "./user/StudyMaterial.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/footer.jsx";
import BranchMaterialPage from "./user/BranchMaterial.jsx";
import SubjectMaterialPage from "./user/SubjectMaterial.jsx";
import MaterialCategoriesPage from "./user/categoryMaterial.jsx";
import ProtectedRoute from "./components/protectRoute.jsx";
import Profile from "./user/profile.jsx";
import Games from "./user/games.jsx";

function App() {
  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/games" element={<Games />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/materials/categories"
              element={<MaterialCategoriesPage />}
            />
            <Route path="/materials/:category" element={<StudyMaterial />} />
            <Route
              path="/materials/:category/:branchName"
              element={<BranchMaterialPage />}
            />
            <Route
              path="/materials/:category/:branchName/:subjectName"
              element={<SubjectMaterialPage />}
            />
            <Route path="*" element={<Navigate to="/materials" replace />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
