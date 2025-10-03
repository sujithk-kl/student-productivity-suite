import React, { useState, useEffect } from 'react';
import './SmartTimetable.css';

const SmartTimetable = () => {
  const [classes, setClasses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // week, day, month
  const [filterSubject, setFilterSubject] = useState('');

  const [newClass, setNewClass] = useState({
    subject: '',
    instructor: '',
    room: '',
    day: '',
    startTime: '',
    endTime: '',
    color: '#667eea',
    type: 'lecture',
    recurring: true,
    notes: ''
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const classTypes = [
    { value: 'lecture', label: '📚 Lecture', color: '#667eea' },
    { value: 'lab', label: '🔬 Lab', color: '#4CAF50' },
    { value: 'tutorial', label: '💡 Tutorial', color: '#FF9800' },
    { value: 'seminar', label: '🎓 Seminar', color: '#9C27B0' },
    { value: 'exam', label: '📝 Exam', color: '#F44336' },
    { value: 'meeting', label: '🤝 Meeting', color: '#607D8B' }
  ];

  useEffect(() => {
    // Load classes from localStorage or API
    const savedClasses = localStorage.getItem('timetable_classes');
    if (savedClasses) {
      setClasses(JSON.parse(savedClasses));
    }
  }, []);

  const saveClasses = (updatedClasses) => {
    setClasses(updatedClasses);
    localStorage.setItem('timetable_classes', JSON.stringify(updatedClasses));
  };

  const handleAddClass = (e) => {
    e.preventDefault();
    if (editingClass !== null) {
      // Edit existing class
      const updatedClasses = classes.map((cls, index) => 
        index === editingClass ? { ...newClass, id: classes[editingClass].id } : cls
      );
      saveClasses(updatedClasses);
      setEditingClass(null);
    } else {
      // Add new class
      const classWithId = { ...newClass, id: Date.now() };
      saveClasses([...classes, classWithId]);
    }
    setNewClass({
      subject: '',
      instructor: '',
      room: '',
      day: '',
      startTime: '',
      endTime: '',
      color: '#667eea',
      type: 'lecture',
      recurring: true,
      notes: ''
    });
    setShowAddForm(false);
  };

  const handleEditClass = (index) => {
    setEditingClass(index);
    setNewClass(classes[index]);
    setShowAddForm(true);
  };

  const handleDeleteClass = (index) => {
    const updatedClasses = classes.filter((_, i) => i !== index);
    saveClasses(updatedClasses);
  };

  const getClassesForDay = (day) => {
    return classes.filter(cls => cls.day === day);
  };

  const getTimePosition = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return (hours * 60 + minutes) / 15; // 15-minute intervals
  };

  const getClassHeight = (startTime, endTime) => {
    const start = getTimePosition(startTime);
    const end = getTimePosition(endTime);
    return (end - start) * 4; // 4px per 15-minute interval
  };

  const getUpcomingClasses = () => {
    const now = new Date();
    const currentDay = days[now.getDay() === 0 ? 6 : now.getDay() - 1];
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    return classes.filter(cls => {
      if (cls.day !== currentDay) return false;
      return cls.startTime > currentTime;
    }).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const upcomingClasses = getUpcomingClasses();

  return (
    <div className="smart-timetable">
      <div className="timetable-header">
        <div className="header-content">
          <h1>📅 Smart Timetable</h1>
          <p>Organize your classes with intelligent scheduling</p>
        </div>
        <div className="header-actions">
          <div className="view-controls">
            <button 
              className={`view-btn ${viewMode === 'day' ? 'active' : ''}`}
              onClick={() => setViewMode('day')}
            >
              Day
            </button>
            <button 
              className={`view-btn ${viewMode === 'week' ? 'active' : ''}`}
              onClick={() => setViewMode('week')}
            >
              Week
            </button>
            <button 
              className={`view-btn ${viewMode === 'month' ? 'active' : ''}`}
              onClick={() => setViewMode('month')}
            >
              Month
            </button>
          </div>
          <button 
            className="add-class-btn"
            onClick={() => setShowAddForm(true)}
          >
            + Add Class
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="timetable-stats">
        <div className="stat-card">
          <div className="stat-number">{classes.length}</div>
          <div className="stat-label">Total Classes</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{upcomingClasses.length}</div>
          <div className="stat-label">Upcoming Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {classes.filter(cls => cls.type === 'exam').length}
          </div>
          <div className="stat-label">Exams</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {new Set(classes.map(cls => cls.subject)).size}
          </div>
          <div className="stat-label">Subjects</div>
        </div>
      </div>

      {/* Upcoming Classes Alert */}
      {upcomingClasses.length > 0 && (
        <div className="upcoming-alert">
          <h3>⏰ Upcoming Classes Today</h3>
          <div className="upcoming-list">
            {upcomingClasses.slice(0, 3).map((cls, index) => (
              <div key={index} className="upcoming-item">
                <div className="upcoming-time">{cls.startTime}</div>
                <div className="upcoming-details">
                  <div className="upcoming-subject">{cls.subject}</div>
                  <div className="upcoming-room">{cls.room}</div>
                </div>
                <div className="upcoming-type" style={{ backgroundColor: cls.color }}>
                  {classTypes.find(t => t.value === cls.type)?.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timetable Grid */}
      <div className="timetable-grid">
        {viewMode === 'week' && (
          <div className="week-view">
            <div className="time-column">
              <div className="time-header">Time</div>
              {timeSlots.map(time => (
                <div key={time} className="time-slot">{time}</div>
              ))}
            </div>
            {days.map(day => (
              <div key={day} className="day-column">
                <div className="day-header">{day}</div>
                <div className="day-content">
                  {getClassesForDay(day).map((cls, index) => (
                    <div
                      key={index}
                      className="class-block"
                      style={{
                        backgroundColor: cls.color,
                        top: `${getTimePosition(cls.startTime) * 4}px`,
                        height: `${getClassHeight(cls.startTime, cls.endTime)}px`
                      }}
                      onClick={() => handleEditClass(classes.indexOf(cls))}
                    >
                      <div className="class-subject">{cls.subject}</div>
                      <div className="class-time">{cls.startTime} - {cls.endTime}</div>
                      <div className="class-room">{cls.room}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'day' && (
          <div className="day-view">
            <div className="day-selector">
              <select value={currentWeek} onChange={(e) => setCurrentWeek(new Date(e.target.value))}>
                {days.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            <div className="day-timetable">
              <div className="time-column">
                {timeSlots.map(time => (
                  <div key={time} className="time-slot">{time}</div>
                ))}
              </div>
              <div className="day-content">
                {getClassesForDay(days[0]).map((cls, index) => (
                  <div
                    key={index}
                    className="class-block"
                    style={{
                      backgroundColor: cls.color,
                      top: `${getTimePosition(cls.startTime) * 4}px`,
                      height: `${getClassHeight(cls.startTime, cls.endTime)}px`
                    }}
                  >
                    <div className="class-subject">{cls.subject}</div>
                    <div className="class-time">{cls.startTime} - {cls.endTime}</div>
                    <div className="class-room">{cls.room}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Class Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingClass !== null ? 'Edit Class' : 'Add New Class'}</h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingClass(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddClass} className="class-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    value={newClass.subject}
                    onChange={(e) => setNewClass({...newClass, subject: e.target.value})}
                    required
                    placeholder="e.g., Computer Science 101"
                  />
                </div>
                <div className="form-group">
                  <label>Instructor</label>
                  <input
                    type="text"
                    value={newClass.instructor}
                    onChange={(e) => setNewClass({...newClass, instructor: e.target.value})}
                    placeholder="Professor Name"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Room</label>
                  <input
                    type="text"
                    value={newClass.room}
                    onChange={(e) => setNewClass({...newClass, room: e.target.value})}
                    placeholder="e.g., Room 101"
                  />
                </div>
                <div className="form-group">
                  <label>Class Type</label>
                  <select
                    value={newClass.type}
                    onChange={(e) => setNewClass({...newClass, type: e.target.value})}
                  >
                    {classTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Day</label>
                  <select
                    value={newClass.day}
                    onChange={(e) => setNewClass({...newClass, day: e.target.value})}
                    required
                  >
                    <option value="">Select Day</option>
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Color</label>
                  <input
                    type="color"
                    value={newClass.color}
                    onChange={(e) => setNewClass({...newClass, color: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="time"
                    value={newClass.startTime}
                    onChange={(e) => setNewClass({...newClass, startTime: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="time"
                    value={newClass.endTime}
                    onChange={(e) => setNewClass({...newClass, endTime: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={newClass.notes}
                  onChange={(e) => setNewClass({...newClass, notes: e.target.value})}
                  placeholder="Additional notes about this class..."
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {editingClass !== null ? 'Update Class' : 'Add Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartTimetable;

