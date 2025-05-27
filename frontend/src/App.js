import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import AdminUpload from './admin/adminUpload.js';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/admin/upload" element={<AdminUpload />} />
        {/* Add more routes as needed */}
      </Routes>
    </div>
  );
}

export default App;