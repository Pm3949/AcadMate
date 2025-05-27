import React, { useState } from 'react';
import axios from 'axios';

const branchSubjectMap = {
    ComputerScience: ['OperatingSystems', 'DBMS', 'ComputerNetworks', 'DataStructures', 'Algorithms', 'ComputerArchitecture', 'SoftwareEngineering', 'ArtificialIntelligence'],
    Electronics: ['AnalogCircuits', 'DigitalSystems', 'ControlSystems', 'Microprocessors', 'SignalsAndSystems', 'VLSIDesign', 'CommunicationSystems', 'EmbeddedSystems'],
    Electrical: ['PowerSystems', 'ElectricalMachines', 'PowerElectronics', 'ControlSystems', 'RenewableEnergy', 'HighVoltageEngineering', 'SmartGridTechnologies'],
    Mechanical: ['Thermodynamics', 'FluidMechanics', 'ManufacturingProcesses', 'HeatTransfer', 'MachineDesign', 'Mechatronics', 'AutomobileEngineering'],
    Civil: ['StructuralAnalysis', 'Surveying', 'GeotechnicalEngineering', 'TransportationEngineering', 'EnvironmentalEngineering', 'ConstructionTechnology', 'Hydraulics'],
    Mining: ['RockMechanics', 'MinePlanning', 'MineralProcessing', 'MineVentilation', 'SurfaceMining', 'UndergroundMining', 'MineSafety'],
    Petroleum: ['ReservoirEngineering', 'DrillingEngineering', 'ProductionEngineering', 'PetroleumGeology', 'WellLogging', 'EnhancedOilRecovery'],
    Mineral: ['MineralProcessing', 'ExtractiveMetallurgy', 'ProcessControl', 'MineralEconomics', 'OreDressing', 'Pyrometallurgy']
  };

const AdminUpload = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [branch, setBranch] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setPdfFiles([...e.target.files]);
  };

  const handleBranchChange = (e) => {
    setBranch(e.target.value);
    setSubject('');
  };
const handleUpload = async (e) => {
  e.preventDefault();

  if (pdfFiles.length === 0 || !branch || !subject) {
    setMessage('❌ Please select one or more files, branch, and subject');
    return;
  }

  const formData = new FormData();
  pdfFiles.forEach((file) => {
    formData.append('files', file); // Backend expects 'files' as an array
  });
  formData.append('branch', branch.trim());
  formData.append('subject', subject.trim());

  try {
    setLoading(true);
    setMessage('');

    const response = await axios.post('http://localhost:5000/api/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });

    if (response.data.success && response.data.files) {
  const links = response.data.files.map(f => `${f.fileName}: ${f.webUrl}`);
  let msg = `✅ Files uploaded successfully!\n\n${links.join('\n')}`;

  if (response.data.failed && response.data.failed.length > 0) {
    const failures = response.data.failed.map(f => `❌ ${f.fileName}: ${f.error}`);
    msg += `\n\nFailed uploads:\n${failures.join('\n')}`;
  }

  setMessage(msg);
}

  } catch (error) {
    console.error(error);
    setMessage('❌ Error uploading files');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          📤 Upload PDFs to OneDrive
        </h2>
        <form onSubmit={handleUpload} className="flex flex-col space-y-4">
          <select
            value={branch}
            onChange={handleBranchChange}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            accept="application/pdf"
            multiple
            onChange={handleFileChange}
            className="border border-gray-300 px-4 py-2 rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-semibold text-white transition duration-200 ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Uploading...' : 'Upload'}
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
              message.startsWith('✅') ? 'text-green-600' : 'text-red-600'
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
