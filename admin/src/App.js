import logo from './logo.svg';
import './App.css';
import {Route,Routes} from 'react-router-dom';
import AdminUpload from './adminUpload';

function App() {
  return (
    <div className="App">
      <Routes>
     <Route path="/" element={<AdminUpload />} />
     </Routes>
    </div>
  );
}

export default App;
