import React from "react";
import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import StudyMaterial from "./user/StudyMaterial.jsx";
import Navbar from "./components/Navbar.jsx";
import BranchMaterialPage from "./user/BranchMaterial.jsx";
import SubjectMaterialPage from "./user/SubjectMaterial.jsx";

function App() {
  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/materials" element={<StudyMaterial />} />
          <Route
            path="/materials/branch/:branchName"
            element={<BranchMaterialPage />}
          />
          <Route
            path="/materials/branch/:branchName/subject/:subjectName"
            element={<SubjectMaterialPage />}
          />
          <Route path="*" element={<Navigate to="/materials" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
