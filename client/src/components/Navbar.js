import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          📚 Student Suite
        </Link>
        
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-links">
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/dashboard" className="navbar-links">
              Dashboard
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/timetable" className="navbar-links">
              Timetable
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/assignments" className="navbar-links">
              Assignments
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/peer-helper" className="navbar-links">
              Peer Helper
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/profile" className="navbar-links">
              Profile
            </Link>
          </li>
        </ul>
        
        <div className="navbar-auth">
          <Link to="/login" className="navbar-login">
            Login
          </Link>
          <Link to="/register" className="navbar-register">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
