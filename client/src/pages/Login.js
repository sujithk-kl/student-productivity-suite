import React from 'react';
import './PageTemplate.css';

const Login = () => {
  return (
    <div className="page-template">
      <div className="container">
        <h1>🔐 Login</h1>
        <p>Sign in to your Student Productivity Suite account.</p>
        <div className="coming-soon">
          <h2>Coming Soon!</h2>
          <p>Authentication system is under development. Check back soon for updates.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

