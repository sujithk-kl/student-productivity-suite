import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const features = [
    {
      id: 1,
      title: '📅 Timetable Management',
      description: 'Organize your class schedule, track attendance, and manage your academic calendar efficiently.',
      link: '/timetable',
      color: '#4CAF50'
    },
    {
      id: 2,
      title: '📝 Assignment Tracker',
      description: 'Keep track of all your assignments, deadlines, and submission status in one place.',
      link: '/assignments',
      color: '#2196F3'
    },
    {
      id: 3,
      title: '🤝 Peer Helper',
      description: 'Connect with classmates, form study groups, and get help with difficult subjects.',
      link: '/peer-helper',
      color: '#FF9800'
    },
    {
      id: 4,
      title: '📊 Progress Analytics',
      description: 'Monitor your academic progress with detailed analytics and performance insights.',
      link: '/analytics',
      color: '#9C27B0'
    },
    {
      id: 5,
      title: '🔔 Smart Notifications',
      description: 'Get timely reminders for assignments, exams, and important academic events.',
      link: '/notifications',
      color: '#F44336'
    },
    {
      id: 6,
      title: '📚 Study Resources',
      description: 'Access study materials, notes, and resources shared by your peers and teachers.',
      link: '/resources',
      color: '#607D8B'
    }
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to Your Academic Command Center
          </h1>
          <p className="hero-subtitle">
            Streamline your student life with our comprehensive productivity suite. 
            Manage timetables, track assignments, connect with peers, and excel academically.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Sign In
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-illustration">
            📚🎓📝
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Everything You Need to Succeed</h2>
          <p className="section-subtitle">
            Our comprehensive suite of tools helps you stay organized, connected, and on top of your academic goals.
          </p>
          
          <div className="features-grid">
            {features.map((feature) => (
              <div key={feature.id} className="feature-card">
                <div 
                  className="feature-icon" 
                  style={{ backgroundColor: feature.color }}
                >
                  {feature.title.split(' ')[0]}
                </div>
                <h3 className="feature-title">
                  {feature.title.split(' ').slice(1).join(' ')}
                </h3>
                <p className="feature-description">
                  {feature.description}
                </p>
                <Link to={feature.link} className="feature-link">
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Active Students</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">Improved Grades</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Universities</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">4.8★</div>
              <div className="stat-label">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your Academic Life?</h2>
            <p className="cta-subtitle">
              Join thousands of students who are already achieving their academic goals with our platform.
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                Start Your Journey
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

