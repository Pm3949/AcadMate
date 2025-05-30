import React, { useState, useEffect } from "react";
import axios from "axios";

const branchSubjectMap = {
  "Applied Geology": [
    "Structural Geology",
    "Mineralogy and Petrology",
    "Sedimentology",
    "Paleontology",
    "Economic Geology",
    "Engineering Geology",
    "Hydrogeology",
    "Geomorphology",
    "Remote Sensing and GIS",
    "Geostatistics",
  ],
  "Applied Geophysics": [
    "Seismic Methods",
    "Gravity and Magnetic Methods",
    "Electrical and Electromagnetic Methods",
    "Well Logging",
    "Geophysical Signal Processing",
    "Exploration Seismology",
    "Potential Field Theory",
    "Computational Geophysics",
    "Petroleum Geophysics",
    "Environmental Geophysics",
  ],
  "Chemical Engineering": [
    "Chemical Process Calculations",
    "Chemical Reaction Engineering",
    "Process Equipment Design",
    "Petroleum Refining",
    "Polymer Science",
    "Biochemical Engineering",
    "Process Dynamics and Control",
    "Transport Phenomena",
    "Process Modeling and Simulation",
    "Nanotechnology in Chemical Engineering",
  ],
  Chemistry: [
    "Organic Chemistry",
    "Inorganic Chemistry",
    "Physical Chemistry",
    "Analytical Chemistry",
    "Quantum Chemistry",
    "Spectroscopy",
    "Organometallic Chemistry",
    "Environmental Chemistry",
    "Computational Chemistry",
    "Polymer Chemistry",
  ],
  "Civil Engineering": [
    "Structural Analysis",
    "Concrete Technology",
    "Geotechnical Engineering",
    "Transportation Engineering",
    "Environmental Engineering",
    "Water Resources Engineering",
    "Construction Management",
    "Earthquake Engineering",
    "Finite Element Analysis",
    "Remote Sensing Applications in Civil Engineering",
  ],
  "Computer Science and Engineering": [
    "Data Structures and Algorithms",
    "Computer Networks",
    "Database Management Systems",
    "Operating Systems",
    "Artificial Intelligence",
    "Machine Learning",
    "Cloud Computing",
    "Cyber Security",
    "Internet of Things",
    "Blockchain Technology",
  ],
  "Electrical Engineering": [
    "Power Systems",
    "Electrical Machines",
    "Power Electronics",
    "Control Systems",
    "Renewable Energy Systems",
    "High Voltage Engineering",
    "Smart Grid Technologies",
    "Electric Drives",
    "Power System Protection",
    "Microgrid Systems",
  ],
  "Electronics Engineering": [
    "Analog Electronics",
    "Digital Electronics",
    "VLSI Design",
    "Embedded Systems",
    "Communication Systems",
    "Signal Processing",
    "Microprocessors",
    "Optical Communication",
    "Wireless Communication",
    "Nanoelectronics",
  ],
  "Environmental Science and Engineering": [
    "Environmental Chemistry",
    "Air Pollution Control",
    "Water and Wastewater Treatment",
    "Solid Waste Management",
    "Environmental Impact Assessment",
    "Climate Change Studies",
    "Environmental Biotechnology",
    "Environmental Policy and Law",
    "Industrial Pollution Control",
    "Sustainable Development",
  ],
  "Fuel and Mineral Engineering": [
    "Coal Geology",
    "Mineral Processing",
    "Coal Beneficiation",
    "Mineral Economics",
    "Mine Environmental Engineering",
    "Fuel Technology",
    "Carbon Capture and Storage",
    "Alternative Fuels",
    "Mineral Exploration",
    "Ore Dressing",
  ],
  "Humanities and Social Sciences": [
    "Economics",
    "Psychology",
    "Sociology",
    "Philosophy",
    "English Literature",
    "Technical Communication",
    "Industrial Psychology",
    "Organizational Behavior",
    "Public Administration",
    "Environmental Economics",
  ],
  "Management Studies": [
    "Operations Management",
    "Financial Management",
    "Marketing Management",
    "Human Resource Management",
    "Strategic Management",
    "Supply Chain Management",
    "Business Analytics",
    "Entrepreneurship Development",
    "Project Management",
    "International Business",
  ],
  "Mathematics and Computing": [
    "Linear Algebra",
    "Numerical Analysis",
    "Discrete Mathematics",
    "Operations Research",
    "Probability and Statistics",
    "Complex Analysis",
    "Graph Theory",
    "Cryptography",
    "Computational Fluid Dynamics",
    "Mathematical Modeling",
  ],
  "Mechanical Engineering": [
    "Thermodynamics",
    "Fluid Mechanics",
    "Heat Transfer",
    "Machine Design",
    "Manufacturing Processes",
    "Automobile Engineering",
    "Robotics",
    "Mechatronics",
    "Finite Element Analysis",
    "Computational Fluid Dynamics",
  ],
  "Mining Engineering": [
    "Mine Planning",
    "Rock Mechanics",
    "Mine Ventilation",
    "Surface Mining",
    "Underground Mining",
    "Mine Safety",
    "Mine Economics",
    "Drilling and Blasting",
    "Mine Environmental Engineering",
    "Mine Legislation",
  ],
  "Petroleum Engineering": [
    "Reservoir Engineering",
    "Drilling Engineering",
    "Production Engineering",
    "Well Testing",
    "Enhanced Oil Recovery",
    "Natural Gas Engineering",
    "Petroleum Geology",
    "Formation Evaluation",
    "Offshore Drilling Technology",
    "Unconventional Hydrocarbon Resources",
  ],
  Physics: [
    "Classical Mechanics",
    "Quantum Mechanics",
    "Electrodynamics",
    "Statistical Mechanics",
    "Solid State Physics",
    "Nuclear Physics",
    "Material Science",
    "Computational Physics",
    "Laser Physics",
    "Nanophysics",
  ],
  "Mining Machinery Engineering": [
    "Dynamics of Mining Machinery",
    "Maintenance Engineering",
    "Hydraulics and Pneumatics",
    "Heavy Earth Moving Machinery",
    "Mine Hoisting Systems",
    "Mine Safety Equipment",
    "Condition Monitoring",
    "Robotics in Mining",
    "Automation in Mining",
    "Mine Electrical Systems",
  ],
  "Industrial Engineering and Management": [
    "Work System Design",
    "Quality Engineering",
    "Facility Planning",
    "Reliability Engineering",
    "Ergonomics",
    "Productivity Management",
    "Lean Manufacturing",
    "Six Sigma",
    "Industrial Safety",
    "Logistics Management",
  ],
};

const AdminUpload = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("accessToken");

    if (token) {
      localStorage.setItem("accessToken", token);
      // Optional: clean up URL
      window.history.replaceState({}, document.title, "/");
    }
  }, []);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [branch, setBranch] = useState("");
  const [subject, setSubject] = useState("");
  const [materialType, setMaterialType] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setPdfFiles([...e.target.files]);
  };

  const handleBranchChange = (e) => {
    setBranch(e.target.value);
    setSubject("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (pdfFiles.length === 0 || !branch || !subject) {
      setMessage("❌ Please select one or more files, branch, and subject");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
     formData.append("category", materialType);
    formData.append("branch", branch);
    formData.append("subject", subject);
    pdfFiles.forEach((file) => formData.append("files", file));

    try {
        const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        "https://acadmate-backend.onrender.com/api/admin/upload",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success && response.data.files) {
        const links = response.data.files.map(
          (f) => `${f.fileName}: ${f.webUrl}`
        );
        let msg = `✅ Files uploaded successfully!\n\n${links.join("\n")}`;

        if (response.data.failed && response.data.failed.length > 0) {
          const failures = response.data.failed.map(
            (f) => `❌ ${f.fileName}: ${f.error}`
          );
          msg += `\n\nFailed uploads:\n${failures.join("\n")}`;
        }

        setMessage(msg);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error uploading files");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          📤 Upload PDFs to StudyMine
        </h2>
        <form onSubmit={handleUpload} className="flex flex-col space-y-4">
          <select
            value={materialType}
            onChange={(e) => setMaterialType(e.target.value)}
            className={`border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">Select Type of Material</option>
            <option>Study Material</option>
            <option>Previous Year Paper</option>
          </select>

          <select
            value={branch}
            onChange={handleBranchChange}
            disabled={!materialType}
            className={`border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              !materialType ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          >
            <option value="">Select Branch</option>
            {Object.keys(branchSubjectMap).map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={!branch}
            className={`border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
              ${!materialType ? "bg-gray-100 cursor-not-allowed" : ""}`}
          >
            <option value="">Select Subject</option>
            {branch &&
              branchSubjectMap[branch].map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
          </select>
          <input
            type="file"
            accept=".pdf,.ppt,.pptx,.doc,.docx,.jpg,.png,.jpeg"
            multiple
            onChange={handleFileChange}
            className="border border-gray-300 px-4 py-2 rounded-lg"
          />
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-semibold text-white transition duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>

        {loading && (
          <div className="flex justify-center items-center mt-4">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {message && (
          <p
            className={`mt-6 text-center text-sm whitespace-pre-line ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminUpload;
