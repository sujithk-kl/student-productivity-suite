import React, { useState, useEffect } from 'react';
import './AssignmentTracker.css';

const AssignmentTracker = () => {
  const [assignments, setAssignments] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [newAssignment, setNewAssignment] = useState({
    title: '',
    subject: '',
    description: '',
    dueDate: '',
    dueTime: '',
    priority: 'medium',
    status: 'pending',
    type: 'assignment',
    estimatedHours: '',
    notes: '',
    attachments: []
  });

  const priorityColors = {
    low: '#4CAF50',
    medium: '#FF9800',
    high: '#F44336',
    urgent: '#9C27B0'
  };

  const statusColors = {
    pending: '#FF9800',
    in_progress: '#2196F3',
    completed: '#4CAF50',
    overdue: '#F44336'
  };

  const assignmentTypes = [
    { value: 'assignment', label: '📝 Assignment', icon: '📝' },
    { value: 'exam', label: '📚 Exam', icon: '📚' },
    { value: 'project', label: '🎯 Project', icon: '🎯' },
    { value: 'quiz', label: '❓ Quiz', icon: '❓' },
    { value: 'presentation', label: '🎤 Presentation', icon: '🎤' },
    { value: 'lab', label: '🔬 Lab Report', icon: '🔬' }
  ];

  useEffect(() => {
    const savedAssignments = localStorage.getItem('assignments');
    if (savedAssignments) {
      setAssignments(JSON.parse(savedAssignments));
    }
  }, []);

  const saveAssignments = (updatedAssignments) => {
    setAssignments(updatedAssignments);
    localStorage.setItem('assignments', JSON.stringify(updatedAssignments));
  };

  const calculateTimeLeft = (dueDate, dueTime) => {
    const due = new Date(`${dueDate}T${dueTime}`);
    const now = new Date();
    const diff = due - now;
    
    if (diff < 0) return { overdue: true, text: 'Overdue' };
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return { overdue: false, text: `${days}d ${hours}h` };
    if (hours > 0) return { overdue: false, text: `${hours}h ${minutes}m` };
    return { overdue: false, text: `${minutes}m` };
  };

  const getPriorityLevel = (dueDate, dueTime) => {
    const timeLeft = calculateTimeLeft(dueDate, dueTime);
    if (timeLeft.overdue) return 'urgent';
    
    const due = new Date(`${dueDate}T${dueTime}`);
    const now = new Date();
    const diffHours = (due - now) / (1000 * 60 * 60);
    
    if (diffHours < 24) return 'urgent';
    if (diffHours < 72) return 'high';
    if (diffHours < 168) return 'medium';
    return 'low';
  };

  const handleAddAssignment = (e) => {
    e.preventDefault();
    if (editingAssignment !== null) {
      const updatedAssignments = assignments.map((assignment, index) => 
        index === editingAssignment ? { ...newAssignment, id: assignments[editingAssignment].id } : assignment
      );
      saveAssignments(updatedAssignments);
      setEditingAssignment(null);
    } else {
      const assignmentWithId = { 
        ...newAssignment, 
        id: Date.now(),
        createdAt: new Date().toISOString(),
        priority: getPriorityLevel(newAssignment.dueDate, newAssignment.dueTime)
      };
      saveAssignments([...assignments, assignmentWithId]);
    }
    setNewAssignment({
      title: '',
      subject: '',
      description: '',
      dueDate: '',
      dueTime: '',
      priority: 'medium',
      status: 'pending',
      type: 'assignment',
      estimatedHours: '',
      notes: '',
      attachments: []
    });
    setShowAddForm(false);
  };

  const handleEditAssignment = (index) => {
    setEditingAssignment(index);
    setNewAssignment(assignments[index]);
    setShowAddForm(true);
  };

  const handleDeleteAssignment = (index) => {
    const updatedAssignments = assignments.filter((_, i) => i !== index);
    saveAssignments(updatedAssignments);
  };

  const handleStatusChange = (index, newStatus) => {
    const updatedAssignments = assignments.map((assignment, i) => 
      i === index ? { ...assignment, status: newStatus } : assignment
    );
    saveAssignments(updatedAssignments);
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || assignment.priority === filterPriority;
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  const getStats = () => {
    const total = assignments.length;
    const completed = assignments.filter(a => a.status === 'completed').length;
    const pending = assignments.filter(a => a.status === 'pending').length;
    const overdue = assignments.filter(a => {
      const timeLeft = calculateTimeLeft(a.dueDate, a.dueTime);
      return timeLeft.overdue;
    }).length;
    
    return { total, completed, pending, overdue };
  };

  const stats = getStats();

  return (
    <div className="assignment-tracker">
      <div className="tracker-header">
        <div className="header-content">
          <h1>📝 Assignment & Exam Tracker</h1>
          <p>Stay on top of your deadlines with smart tracking</p>
        </div>
        <div className="header-actions">
          <button 
            className="add-assignment-btn"
            onClick={() => setShowAddForm(true)}
          >
            + Add Assignment
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="stats-dashboard">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-number">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-number">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card urgent">
          <div className="stat-icon">🚨</div>
          <div className="stat-number">{stats.overdue}</div>
          <div className="stat-label">Overdue</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-controls">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
          <select 
            value={filterPriority} 
            onChange={(e) => setFilterPriority(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Assignments List */}
      <div className="assignments-grid">
        {filteredAssignments.map((assignment, index) => {
          const timeLeft = calculateTimeLeft(assignment.dueDate, assignment.dueTime);
          const assignmentType = assignmentTypes.find(t => t.value === assignment.type);
          
          return (
            <div key={assignment.id} className="assignment-card">
              <div className="assignment-header">
                <div className="assignment-type">
                  <span className="type-icon">{assignmentType?.icon}</span>
                  <span className="type-label">{assignmentType?.label}</span>
                </div>
                <div className="assignment-actions">
                  <button 
                    className="action-btn edit"
                    onClick={() => handleEditAssignment(index)}
                  >
                    ✏️
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDeleteAssignment(index)}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="assignment-content">
                <h3 className="assignment-title">{assignment.title}</h3>
                <p className="assignment-subject">{assignment.subject}</p>
                <p className="assignment-description">{assignment.description}</p>
              </div>

              <div className="assignment-meta">
                <div className="meta-item">
                  <span className="meta-label">Due:</span>
                  <span className="meta-value">
                    {new Date(assignment.dueDate).toLocaleDateString()} at {assignment.dueTime}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Priority:</span>
                  <span 
                    className="priority-badge"
                    style={{ backgroundColor: priorityColors[assignment.priority] }}
                  >
                    {assignment.priority.toUpperCase()}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Time Left:</span>
                  <span 
                    className={`time-left ${timeLeft.overdue ? 'overdue' : ''}`}
                  >
                    {timeLeft.text}
                  </span>
                </div>
              </div>

              <div className="assignment-footer">
                <div className="status-controls">
                  <select 
                    value={assignment.status}
                    onChange={(e) => handleStatusChange(index, e.target.value)}
                    className="status-select"
                    style={{ borderColor: statusColors[assignment.status] }}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="progress-indicator">
                  <div 
                    className="progress-bar"
                    style={{ 
                      width: assignment.status === 'completed' ? '100%' : 
                             assignment.status === 'in_progress' ? '50%' : '0%',
                      backgroundColor: statusColors[assignment.status]
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Assignment Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingAssignment !== null ? 'Edit Assignment' : 'Add New Assignment'}</h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingAssignment(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddAssignment} className="assignment-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Assignment Title</label>
                  <input
                    type="text"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment({...newAssignment, title: e.target.value})}
                    required
                    placeholder="e.g., Math Problem Set 3"
                  />
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    value={newAssignment.subject}
                    onChange={(e) => setNewAssignment({...newAssignment, subject: e.target.value})}
                    required
                    placeholder="e.g., Mathematics"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                  placeholder="Describe the assignment requirements..."
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Due Time</label>
                  <input
                    type="time"
                    value={newAssignment.dueTime}
                    onChange={(e) => setNewAssignment({...newAssignment, dueTime: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={newAssignment.type}
                    onChange={(e) => setNewAssignment({...newAssignment, type: e.target.value})}
                  >
                    {assignmentTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Estimated Hours</label>
                  <input
                    type="number"
                    value={newAssignment.estimatedHours}
                    onChange={(e) => setNewAssignment({...newAssignment, estimatedHours: e.target.value})}
                    placeholder="e.g., 5"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={newAssignment.notes}
                  onChange={(e) => setNewAssignment({...newAssignment, notes: e.target.value})}
                  placeholder="Additional notes..."
                  rows="2"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {editingAssignment !== null ? 'Update Assignment' : 'Add Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentTracker;

