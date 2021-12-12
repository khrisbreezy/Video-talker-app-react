import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { connectWithWebSocket } from './utils/wssConnection/wssConnection';
import Dashboard from './Dashboard/Dashboard';
import Login from './Login/Login';

import './App.css';


function App() {

  useEffect(() => {
    connectWithWebSocket();
  },[]);

  return (
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
  );
}

export default App;
