import React, { useState, useEffect } from 'react';
import './PeerHelperBoard.css';

const PeerHelperBoard = () => {
  const [posts, setPosts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    type: 'help_request',
    subject: '',
    priority: 'medium',
    tags: [],
    location: '',
    maxParticipants: '',
    deadline: '',
    contactInfo: ''
  });

  const postTypes = [
    { value: 'help_request', label: '🆘 Help Request', icon: '🆘', color: '#F44336' },
    { value: 'study_group', label: '👥 Study Group', icon: '👥', color: '#4CAF50' },
    { value: 'resource_share', label: '📚 Resource Share', icon: '📚', color: '#2196F3' },
    { value: 'tutor_offer', label: '🎓 Tutor Offer', icon: '🎓', color: '#FF9800' },
    { value: 'collaboration', label: '🤝 Collaboration', icon: '🤝', color: '#9C27B0' },
    { value: 'event', label: '📅 Event', icon: '📅', color: '#607D8B' }
  ];

  const subjects = [
    'Mathematics', 'Computer Science', 'Physics', 'Chemistry', 'Biology',
    'Engineering', 'Business', 'Psychology', 'Literature', 'History',
    'Art', 'Music', 'Other'
  ];

  const priorityColors = {
    low: '#4CAF50',
    medium: '#FF9800',
    high: '#F44336',
    urgent: '#9C27B0'
  };

  useEffect(() => {
    const savedPosts = localStorage.getItem('peer_helper_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  const savePosts = (updatedPosts) => {
    setPosts(updatedPosts);
    localStorage.setItem('peer_helper_posts', JSON.stringify(updatedPosts));
  };

  const handleAddPost = (e) => {
    e.preventDefault();
    if (editingPost !== null) {
      const updatedPosts = posts.map((post, index) => 
        index === editingPost ? { ...newPost, id: posts[editingPost].id } : post
      );
      savePosts(updatedPosts);
      setEditingPost(null);
    } else {
      const postWithId = { 
        ...newPost, 
        id: Date.now(),
        createdAt: new Date().toISOString(),
        author: 'Current User', // In real app, get from auth context
        likes: 0,
        comments: [],
        participants: []
      };
      savePosts([...posts, postWithId]);
    }
    setNewPost({
      title: '',
      description: '',
      type: 'help_request',
      subject: '',
      priority: 'medium',
      tags: [],
      location: '',
      maxParticipants: '',
      deadline: '',
      contactInfo: ''
    });
    setShowAddForm(false);
  };

  const handleEditPost = (index) => {
    setEditingPost(index);
    setNewPost(posts[index]);
    setShowAddForm(true);
  };

  const handleDeletePost = (index) => {
    const updatedPosts = posts.filter((_, i) => i !== index);
    savePosts(updatedPosts);
  };

  const handleLikePost = (index) => {
    const updatedPosts = posts.map((post, i) => 
      i === index ? { ...post, likes: post.likes + 1 } : post
    );
    savePosts(updatedPosts);
  };

  const handleJoinPost = (index) => {
    const post = posts[index];
    if (post.participants.length < (post.maxParticipants || Infinity)) {
      const updatedPosts = posts.map((p, i) => 
        i === index ? { ...p, participants: [...p.participants, 'Current User'] } : p
      );
      savePosts(updatedPosts);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesType = filterType === 'all' || post.type === filterType;
    const matchesSubject = filterSubject === 'all' || post.subject === filterSubject;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSubject && matchesSearch;
  });

  const getStats = () => {
    const total = posts.length;
    const helpRequests = posts.filter(p => p.type === 'help_request').length;
    const studyGroups = posts.filter(p => p.type === 'study_group').length;
    const activeParticipants = posts.reduce((sum, post) => sum + post.participants.length, 0);
    
    return { total, helpRequests, studyGroups, activeParticipants };
  };

  const stats = getStats();

  return (
    <div className="peer-helper-board">
      <div className="board-header">
        <div className="header-content">
          <h1>🤝 Peer Helper Board</h1>
          <p>Connect, collaborate, and support your academic community</p>
        </div>
        <div className="header-actions">
          <button 
            className="add-post-btn"
            onClick={() => setShowAddForm(true)}
          >
            + Create Post
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="stats-dashboard">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Posts</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🆘</div>
          <div className="stat-number">{stats.helpRequests}</div>
          <div className="stat-label">Help Requests</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-number">{stats.studyGroups}</div>
          <div className="stat-label">Study Groups</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🤝</div>
          <div className="stat-number">{stats.activeParticipants}</div>
          <div className="stat-label">Active Members</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search posts, subjects, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-controls">
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            {postTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <select 
            value={filterSubject} 
            onChange={(e) => setFilterSubject(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="posts-grid">
        {filteredPosts.map((post, index) => {
          const postType = postTypes.find(t => t.value === post.type);
          const isFull = post.maxParticipants && post.participants.length >= post.maxParticipants;
          
          return (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="post-type">
                  <span className="type-icon">{postType?.icon}</span>
                  <span className="type-label">{postType?.label}</span>
                </div>
                <div className="post-actions">
                  <button 
                    className="action-btn edit"
                    onClick={() => handleEditPost(index)}
                  >
                    ✏️
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDeletePost(index)}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="post-content">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-description">{post.description}</p>
                <div className="post-meta">
                  <div className="meta-item">
                    <span className="meta-label">Subject:</span>
                    <span className="meta-value">{post.subject}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Priority:</span>
                    <span 
                      className="priority-badge"
                      style={{ backgroundColor: priorityColors[post.priority] }}
                    >
                      {post.priority.toUpperCase()}
                    </span>
                  </div>
                  {post.location && (
                    <div className="meta-item">
                      <span className="meta-label">📍</span>
                      <span className="meta-value">{post.location}</span>
                    </div>
                  )}
                  {post.deadline && (
                    <div className="meta-item">
                      <span className="meta-label">⏰</span>
                      <span className="meta-value">
                        {new Date(post.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="post-tags">
                    {post.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="post-footer">
                <div className="post-stats">
                  <div className="stat-item">
                    <span className="stat-icon">👍</span>
                    <span className="stat-value">{post.likes}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">💬</span>
                    <span className="stat-value">{post.comments.length}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">👥</span>
                    <span className="stat-value">
                      {post.participants.length}
                      {post.maxParticipants && `/${post.maxParticipants}`}
                    </span>
                  </div>
                </div>
                <div className="post-actions-footer">
                  <button 
                    className="action-btn like"
                    onClick={() => handleLikePost(index)}
                  >
                    👍 Like
                  </button>
                  <button 
                    className="action-btn join"
                    onClick={() => handleJoinPost(index)}
                    disabled={isFull}
                  >
                    {isFull ? 'Full' : 'Join'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Post Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingPost !== null ? 'Edit Post' : 'Create New Post'}</h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingPost(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddPost} className="post-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Post Title</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    required
                    placeholder="e.g., Need help with Calculus"
                  />
                </div>
                <div className="form-group">
                  <label>Post Type</label>
                  <select
                    value={newPost.type}
                    onChange={(e) => setNewPost({...newPost, type: e.target.value})}
                  >
                    {postTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newPost.description}
                  onChange={(e) => setNewPost({...newPost, description: e.target.value})}
                  required
                  placeholder="Describe what you need help with or what you're offering..."
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Subject</label>
                  <select
                    value={newPost.subject}
                    onChange={(e) => setNewPost({...newPost, subject: e.target.value})}
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={newPost.priority}
                    onChange={(e) => setNewPost({...newPost, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Location (Optional)</label>
                  <input
                    type="text"
                    value={newPost.location}
                    onChange={(e) => setNewPost({...newPost, location: e.target.value})}
                    placeholder="e.g., Library, Room 101"
                  />
                </div>
                <div className="form-group">
                  <label>Max Participants (Optional)</label>
                  <input
                    type="number"
                    value={newPost.maxParticipants}
                    onChange={(e) => setNewPost({...newPost, maxParticipants: e.target.value})}
                    placeholder="e.g., 5"
                    min="1"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Deadline (Optional)</label>
                  <input
                    type="date"
                    value={newPost.deadline}
                    onChange={(e) => setNewPost({...newPost, deadline: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Contact Info (Optional)</label>
                  <input
                    type="text"
                    value={newPost.contactInfo}
                    onChange={(e) => setNewPost({...newPost, contactInfo: e.target.value})}
                    placeholder="Email or phone number"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Tags (comma-separated)</label>
                <input
                  type="text"
                  value={newPost.tags.join(', ')}
                  onChange={(e) => setNewPost({...newPost, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)})}
                  placeholder="e.g., calculus, homework, urgent"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {editingPost !== null ? 'Update Post' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeerHelperBoard;

