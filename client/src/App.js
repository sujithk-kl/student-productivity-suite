import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard/Dashboard';

// Auth Components
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';

// Feature Components
import SmartTimetable from './components/Timetable/SmartTimetable';
import AssignmentTracker from './components/Assignments/AssignmentTracker';
import PeerHelperBoard from './components/PeerHelper/PeerHelperBoard';
import UserProfile from './components/Profile/UserProfile';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/timetable" element={<SmartTimetable />} />
          <Route path="/assignments" element={<AssignmentTracker />} />
          <Route path="/peer-helper" element={<PeerHelperBoard />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
