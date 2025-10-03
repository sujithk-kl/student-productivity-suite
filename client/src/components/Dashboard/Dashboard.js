import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState({
    firstName: 'John',
    lastName: 'Doe',
    studyStreak: 7,
    totalAssignments: 15,
    completedAssignments: 8,
    averageGrade: 87
  });

  const [upcomingClasses, setUpcomingClasses] = useState([
    { subject: 'Mathematics 101', time: '09:00', room: 'Room 201', type: 'lecture' },
    { subject: 'Computer Science 201', time: '11:00', room: 'Lab 301', type: 'lab' },
    { subject: 'Physics 101', time: '14:00', room: 'Room 105', type: 'lecture' }
  ]);

  const [recentAssignments, setRecentAssignments] = useState([
    { title: 'Math Problem Set 5', subject: 'Mathematics', dueDate: '2024-01-15', priority: 'high', status: 'pending' },
    { title: 'CS Project Presentation', subject: 'Computer Science', dueDate: '2024-01-18', priority: 'medium', status: 'in_progress' },
    { title: 'Physics Lab Report', subject: 'Physics', dueDate: '2024-01-20', priority: 'low', status: 'pending' }
  ]);

  const [peerPosts, setPeerPosts] = useState([
    { title: 'Need help with Calculus', type: 'help_request', author: 'Sarah M.', time: '2 hours ago', likes: 5 },
    { title: 'Study group for CS 201', type: 'study_group', author: 'Mike R.', time: '4 hours ago', likes: 8 },
    { title: 'Shared: Math notes', type: 'resource_share', author: 'Emma L.', time: '1 day ago', likes: 12 }
  ]);

  const [quickStats, setQuickStats] = useState({
    todayClasses: 3,
    pendingAssignments: 7,
    studyHours: 4.5,
    peerInteractions: 12
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#5a6c7d';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in_progress': return '#2196F3';
      case 'pending': return '#FF9800';
      default: return '#5a6c7d';
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>{getGreeting()}, {user.firstName}! 👋</h1>
          <p>Here's what's happening with your academic life today</p>
        </div>
        <div className="date-info">
          <div className="current-date">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <div className="study-streak">
            🔥 {user.studyStreak} day streak
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <div className="stat-number">{quickStats.todayClasses}</div>
            <div className="stat-label">Classes Today</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <div className="stat-number">{quickStats.pendingAssignments}</div>
            <div className="stat-label">Pending Tasks</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <div className="stat-number">{quickStats.studyHours}h</div>
            <div className="stat-label">Study Time</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🤝</div>
          <div className="stat-content">
            <div className="stat-number">{quickStats.peerInteractions}</div>
            <div className="stat-label">Peer Interactions</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Upcoming Classes */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>📅 Today's Classes</h3>
            <Link to="/timetable" className="view-all-link">View All</Link>
          </div>
          <div className="classes-list">
            {upcomingClasses.map((cls, index) => (
              <div key={index} className="class-item">
                <div className="class-time">{cls.time}</div>
                <div className="class-details">
                  <div className="class-subject">{cls.subject}</div>
                  <div className="class-room">{cls.room}</div>
                </div>
                <div className="class-type">{cls.type}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Assignments */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>📝 Recent Assignments</h3>
            <Link to="/assignments" className="view-all-link">View All</Link>
          </div>
          <div className="assignments-list">
            {recentAssignments.map((assignment, index) => (
              <div key={index} className="assignment-item">
                <div className="assignment-info">
                  <div className="assignment-title">{assignment.title}</div>
                  <div className="assignment-subject">{assignment.subject}</div>
                </div>
                <div className="assignment-meta">
                  <div 
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(assignment.priority) }}
                  >
                    {assignment.priority}
                  </div>
                  <div className="due-date">
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peer Helper Activity */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>🤝 Peer Helper Activity</h3>
            <Link to="/peer-helper" className="view-all-link">View All</Link>
          </div>
          <div className="peer-posts-list">
            {peerPosts.map((post, index) => (
              <div key={index} className="peer-post-item">
                <div className="post-content">
                  <div className="post-title">{post.title}</div>
                  <div className="post-meta">
                    <span className="post-type">{post.type}</span>
                    <span className="post-author">by {post.author}</span>
                    <span className="post-time">{post.time}</span>
                  </div>
                </div>
                <div className="post-likes">
                  👍 {post.likes}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>⚡ Quick Actions</h3>
          </div>
          <div className="quick-actions">
            <Link to="/timetable" className="action-btn">
              <span className="action-icon">📅</span>
              <span className="action-label">Add Class</span>
            </Link>
            <Link to="/assignments" className="action-btn">
              <span className="action-icon">📝</span>
              <span className="action-label">New Assignment</span>
            </Link>
            <Link to="/peer-helper" className="action-btn">
              <span className="action-icon">🤝</span>
              <span className="action-label">Ask for Help</span>
            </Link>
            <Link to="/profile" className="action-btn">
              <span className="action-icon">👤</span>
              <span className="action-label">View Profile</span>
            </Link>
          </div>
        </div>

        {/* Study Progress */}
        <div className="dashboard-card progress-card">
          <div className="card-header">
            <h3>📊 Study Progress</h3>
          </div>
          <div className="progress-content">
            <div className="progress-item">
              <div className="progress-label">Assignments Completed</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(user.completedAssignments / user.totalAssignments) * 100}%` }}
                ></div>
              </div>
              <div className="progress-text">
                {user.completedAssignments} / {user.totalAssignments}
              </div>
            </div>
            <div className="progress-item">
              <div className="progress-label">Average Grade</div>
              <div className="grade-display">
                <span className="grade-number">{user.averageGrade}%</span>
                <span className="grade-letter">B+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="dashboard-card quote-card">
          <div className="quote-content">
            <div className="quote-text">
              "The future belongs to those who believe in the beauty of their dreams."
            </div>
            <div className="quote-author">— Eleanor Roosevelt</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

