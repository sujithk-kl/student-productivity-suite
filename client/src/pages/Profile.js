import React from 'react';
import './PageTemplate.css';

const Profile = () => {
  return (
    <div className="page-template">
      <div className="container">
        <h1>👤 Profile</h1>
        <p>Manage your account settings and preferences.</p>
        <div className="coming-soon">
          <h2>Coming Soon!</h2>
          <p>User profile management is under development. Check back soon for updates.</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;

