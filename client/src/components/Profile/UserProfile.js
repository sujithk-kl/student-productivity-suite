import React, { useState, useEffect } from 'react';
import './UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    university: '',
    major: '',
    year: '',
    phone: '',
    bio: '',
    avatar: '',
    preferences: {
      notifications: true,
      darkMode: false,
      timezone: 'UTC',
      language: 'en'
    },
    academicStats: {
      totalAssignments: 0,
      completedAssignments: 0,
      averageGrade: 0,
      studyHours: 0
    },
    achievements: [],
    studyStreak: 0,
    lastActive: new Date().toISOString()
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [showEditForm, setShowEditForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'academics', label: '🎓 Academics', icon: '🎓' },
    { id: 'achievements', label: '🏆 Achievements', icon: '🏆' },
    { id: 'settings', label: '⚙️ Settings', icon: '⚙️' }
  ];

  const achievements = [
    { id: 1, name: 'First Assignment', description: 'Completed your first assignment', icon: '🎯', unlocked: true },
    { id: 2, name: 'Study Streak', description: '7 days of consistent study', icon: '🔥', unlocked: true },
    { id: 3, name: 'Perfect Week', description: 'Completed all assignments on time', icon: '⭐', unlocked: false },
    { id: 4, name: 'Helper Hero', description: 'Helped 10 peers', icon: '🦸', unlocked: false },
    { id: 5, name: 'Time Master', description: 'Used timetable for 30 days', icon: '⏰', unlocked: true },
    { id: 6, name: 'Collaboration King', description: 'Joined 5 study groups', icon: '👑', unlocked: false }
  ];

  useEffect(() => {
    // Load user data from localStorage or API
    const savedUser = localStorage.getItem('user_profile');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const saveUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user_profile', JSON.stringify(updatedUser));
  };

  const handleInputChange = (field, value) => {
    setUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (pref, value) => {
    setUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [pref]: value
      }
    }));
  };

  const handleSaveProfile = () => {
    saveUser(user);
    setShowEditForm(false);
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return '#4CAF50';
    if (grade >= 80) return '#8BC34A';
    if (grade >= 70) return '#FFC107';
    if (grade >= 60) return '#FF9800';
    return '#F44336';
  };

  const getStudyStreakColor = (streak) => {
    if (streak >= 30) return '#4CAF50';
    if (streak >= 14) return '#8BC34A';
    if (streak >= 7) return '#FFC107';
    return '#FF9800';
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="header-content">
          <div className="profile-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt="Profile" className="avatar-image" />
            ) : (
              <div className="avatar-placeholder">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
            )}
          </div>
          <div className="profile-info">
            <h1>{user.firstName} {user.lastName}</h1>
            <p className="profile-title">{user.major} • {user.year}</p>
            <p className="profile-university">{user.university}</p>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">{user.studyStreak}</span>
                <span className="stat-label">Day Streak</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{user.academicStats.completedAssignments}</span>
                <span className="stat-label">Completed</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{user.academicStats.averageGrade}%</span>
                <span className="stat-label">Average</span>
              </div>
            </div>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="edit-profile-btn"
            onClick={() => setShowEditForm(true)}
          >
            ✏️ Edit Profile
          </button>
          <button 
            className="settings-btn"
            onClick={() => setShowSettings(true)}
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="overview-grid">
                <div className="overview-card">
                  <h3>📈 Academic Progress</h3>
                  <div className="progress-stats">
                    <div className="progress-item">
                      <div className="progress-label">Assignments Completed</div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${(user.academicStats.completedAssignments / user.academicStats.totalAssignments) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <div className="progress-text">
                        {user.academicStats.completedAssignments} / {user.academicStats.totalAssignments}
                      </div>
                    </div>
                    <div className="progress-item">
                      <div className="progress-label">Study Hours This Week</div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${Math.min((user.academicStats.studyHours / 40) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="progress-text">{user.academicStats.studyHours} hours</div>
                    </div>
                  </div>
                </div>

                <div className="overview-card">
                  <h3>🔥 Study Streak</h3>
                  <div className="streak-display">
                    <div 
                      className="streak-number"
                      style={{ color: getStudyStreakColor(user.studyStreak) }}
                    >
                      {user.studyStreak}
                    </div>
                    <div className="streak-label">Days in a row!</div>
                    <div className="streak-motivation">
                      {user.studyStreak >= 30 ? "🔥 You're on fire!" :
                       user.studyStreak >= 14 ? "💪 Keep it up!" :
                       user.studyStreak >= 7 ? "🎯 Great start!" :
                       "🚀 Start your streak!"}
                    </div>
                  </div>
                </div>

                <div className="overview-card">
                  <h3>📊 Grade Overview</h3>
                  <div className="grade-display">
                    <div 
                      className="grade-number"
                      style={{ color: getGradeColor(user.academicStats.averageGrade) }}
                    >
                      {user.academicStats.averageGrade}%
                    </div>
                    <div className="grade-label">Average Grade</div>
                    <div className="grade-breakdown">
                      <div className="grade-item">
                        <span className="grade-letter">A</span>
                        <span className="grade-count">12</span>
                      </div>
                      <div className="grade-item">
                        <span className="grade-letter">B</span>
                        <span className="grade-count">8</span>
                      </div>
                      <div className="grade-item">
                        <span className="grade-letter">C</span>
                        <span className="grade-count">3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'academics' && (
            <div className="academics-tab">
              <div className="academics-grid">
                <div className="academic-card">
                  <h3>📚 Current Courses</h3>
                  <div className="courses-list">
                    <div className="course-item">
                      <div className="course-name">Mathematics 101</div>
                      <div className="course-grade">A-</div>
                    </div>
                    <div className="course-item">
                      <div className="course-name">Computer Science 201</div>
                      <div className="course-grade">B+</div>
                    </div>
                    <div className="course-item">
                      <div className="course-name">Physics 101</div>
                      <div className="course-grade">A</div>
                    </div>
                  </div>
                </div>

                <div className="academic-card">
                  <h3>📅 Upcoming Deadlines</h3>
                  <div className="deadlines-list">
                    <div className="deadline-item urgent">
                      <div className="deadline-title">Math Problem Set 5</div>
                      <div className="deadline-date">Due in 2 days</div>
                    </div>
                    <div className="deadline-item">
                      <div className="deadline-title">CS Project Presentation</div>
                      <div className="deadline-date">Due in 5 days</div>
                    </div>
                    <div className="deadline-item">
                      <div className="deadline-title">Physics Lab Report</div>
                      <div className="deadline-date">Due in 1 week</div>
                    </div>
                  </div>
                </div>

                <div className="academic-card">
                  <h3>📈 Performance Trends</h3>
                  <div className="trends-chart">
                    <div className="chart-placeholder">
                      📊 Performance chart would go here
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="achievements-tab">
              <div className="achievements-grid">
                {achievements.map(achievement => (
                  <div 
                    key={achievement.id} 
                    className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                  >
                    <div className="achievement-icon">{achievement.icon}</div>
                    <div className="achievement-content">
                      <h4 className="achievement-name">{achievement.name}</h4>
                      <p className="achievement-description">{achievement.description}</p>
                    </div>
                    <div className="achievement-status">
                      {achievement.unlocked ? '✅' : '🔒'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-tab">
              <div className="settings-grid">
                <div className="settings-card">
                  <h3>🔔 Notifications</h3>
                  <div className="setting-item">
                    <label className="setting-label">
                      <input
                        type="checkbox"
                        checked={user.preferences.notifications}
                        onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                      />
                      <span className="checkmark"></span>
                      Enable notifications
                    </label>
                  </div>
                </div>

                <div className="settings-card">
                  <h3>🎨 Appearance</h3>
                  <div className="setting-item">
                    <label className="setting-label">
                      <input
                        type="checkbox"
                        checked={user.preferences.darkMode}
                        onChange={(e) => handlePreferenceChange('darkMode', e.target.checked)}
                      />
                      <span className="checkmark"></span>
                      Dark mode
                    </label>
                  </div>
                </div>

                <div className="settings-card">
                  <h3>🌍 Localization</h3>
                  <div className="setting-item">
                    <label>Language</label>
                    <select
                      value={user.preferences.language}
                      onChange={(e) => handlePreferenceChange('language', e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                  <div className="setting-item">
                    <label>Timezone</label>
                    <select
                      value={user.preferences.timezone}
                      onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time</option>
                      <option value="PST">Pacific Time</option>
                      <option value="GMT">GMT</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Profile</h2>
              <button 
                className="close-btn"
                onClick={() => setShowEditForm(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={user.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={user.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>University</label>
                  <input
                    type="text"
                    value={user.university}
                    onChange={(e) => handleInputChange('university', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Major</label>
                  <input
                    type="text"
                    value={user.major}
                    onChange={(e) => handleInputChange('major', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Academic Year</label>
                  <select
                    value={user.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                  >
                    <option value="Freshman">Freshman</option>
                    <option value="Sophomore">Sophomore</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={user.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={user.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows="4"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowEditForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="save-btn"
                  onClick={handleSaveProfile}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;

