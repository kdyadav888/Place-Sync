import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { messagesAPI } from '../utils/api';
import Toast from '../components/Toast';
import '../styles/Dashboard.css';
import '../styles/Messages.css';

const TrainerMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = React.useRef(null);
  
  const { token, user } = useAuth();
  
  // Popular emojis for quick access
  const emojis = ['👍', '❤️', '😂', '🎉', '👏', '✨', '🚀', '💼', '📊', '💡', '✅', '👌'];

  // Demo trainer conversations with students (Indian data)
  const demoConversations = [
    {
      _id: 'tconv1',
      user: {
        _id: 'tstudent1',
        name: 'Arjun Mehta',
        email: 'arjun.mehta@student.com',
        role: 'student',
        avatar: '',
        enrolledCourse: 'Full Stack Development with Node.js',
      },
      lastMessage: 'Thank you for the course guidance! My project is progressing well.',
      unread: 1,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'tconv2',
      user: {
        _id: 'tstudent2',
        name: 'Sneha Iyer',
        email: 'sneha.iyer@student.com',
        role: 'student',
        avatar: '',
        enrolledCourse: 'Python Advanced Programming',
      },
      lastMessage: 'Can I submit my project assignment before the deadline?',
      unread: 0,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'tconv3',
      user: {
        _id: 'tstudent3',
        name: 'Rahul Chopra',
        email: 'rahul.chopra@student.com',
        role: 'student',
        avatar: 'student',
        enrolledCourse: 'Data Science Bootcamp',
      },
      lastMessage: 'I have some doubts about the ML algorithms module.',
      unread: 0,
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const demoMessages = {
    'tconv1': [
      { _id: 1, sender: 'tstudent1', content: 'Hello! I just enrolled in your Full Stack Development course.', createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString() },
      { _id: 2, sender: user?._id, content: 'Welcome Arjun! I\'m excited to have you in the course. Have you completed the first module?', createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString() },
      { _id: 3, sender: 'tstudent1', content: 'Yes! I just finished the introductory videos. Starting the first project now.', createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
      { _id: 4, sender: user?._id, content: 'Great! Don\'t hesitate to ask questions if you get stuck on any topics.', createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
      { _id: 5, sender: 'tstudent1', content: 'Thank you for the course guidance! My project is progressing well.', createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
    ],
    'tconv2': [
      { _id: 1, sender: 'tstudent2', content: 'Hi! I have a question about the advanced Python concepts.', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { _id: 2, sender: user?._id, content: 'Hi Sneha! Sure, what would you like to know about?', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { _id: 3, sender: 'tstudent2', content: 'Can I submit my project assignment before the deadline?', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    ],
  };

  useEffect(() => {
    const savedConversations = JSON.parse(localStorage.getItem('demoTrainerConversations') || '[]');
    if (savedConversations.length === 0) {
      setConversations(demoConversations);
      localStorage.setItem('demoTrainerConversations', JSON.stringify(demoConversations));
    } else {
      setConversations(savedConversations);
    }
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages();
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await messagesAPI.getConversations({ Authorization: `Bearer ${token}` });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success && data.conversations) {
        setConversations(data.conversations);
      } else {
        setConversations(demoConversations);
      }
    } catch (error) {
      console.error('Error fetching conversations (using demo data):', error);
      setConversations(demoConversations);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedConversation?.user?._id) return;
    
    try {
      const response = await messagesAPI.getMessages(selectedConversation.user._id, { Authorization: `Bearer ${token}` });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.messages) {
        setMessages(data.messages);
      } else {
        const demoMsgs = demoMessages[selectedConversation._id] || [];
        setMessages(demoMsgs);
      }
    } catch (error) {
      console.error('Error fetching messages (using demo data):', error);
      const demoMsgs = demoMessages[selectedConversation._id] || [];
      setMessages(demoMsgs);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageContent.trim() || !selectedConversation) return;

    const senderId = user?._id || 'demo-trainer';
    const tempMessage = {
      _id: Date.now(),
      sender: senderId,
      content: messageContent,
      createdAt: new Date(),
      isSent: true,
    };

    setMessages([...messages, tempMessage]);
    setMessageContent('');

    try {
      const response = await messagesAPI.sendMessage(
        {
          receiverId: selectedConversation.user._id,
          content: messageContent,
        },
        { Authorization: `Bearer ${token}` }
      );

      const data = await response.json();
      if (data.success) {
        setMessages(msgs => msgs.map(m => m._id === tempMessage._id ? data.message : m));
        setToast({ message: ' Message sent!', type: 'success' });
      } else {
        setMessages(msgs => msgs.filter(m => m._id !== tempMessage._id));
        setToast({ message: 'Failed to send message', type: 'error' });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(msgs => msgs.filter(m => m._id !== tempMessage._id));
      setToast({ message: 'Network error sending message', type: 'error' });
    }
  };

  const handleAttachFile = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileName = file.name;
      const fileSize = (file.size / 1024).toFixed(2); // Convert to KB
      
      // Add file reference to message
      setMessageContent(prev => `${prev} [📎 ${fileName} (${fileSize}KB)]`.trim());
      setToast({ message: `📎 ${fileName} attached!`, type: 'success' });
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleEmojiClick = (emoji) => {
    setMessageContent(prev => `${prev} ${emoji}`.trim());
    setShowEmojiPicker(false);
  };

  const filteredConversations = conversations.filter(conv =>
    (conv.user?.name || conv.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = conversations.filter(conv => conv.unread > 0).length;

  if (loading) {
    return <div className="loading">Loading messages...</div>;
  }

  return (
    <div className="messages-container">
      <div className="messages-wrapper">
        {/* LinkedIn-style Sidebar */}
        <div className="conversations-list linkedin-sidebar">
          <div className="conversations-header linkedin-header">
            <h2>Messages</h2>
            <span className="conversation-count">{conversations.length}</span>
          </div>

          <div className="search-container">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input linkedin-search"
            />
          </div>

          <div className="conversations-scroll">
            {filteredConversations.length === 0 ? (
              <div className="no-conversations-placeholder">
                <p> No conversations yet</p>
              </div>
            ) : (
              <div className="conv-list-wrapper">
                {filteredConversations.map((conv) => (
                  <div
                    key={conv._id}
                    className={`conversation-item linkedin-conversation ${
                      selectedConversation?._id === conv._id ? 'active' : ''
                    }`}
                    onClick={() => setSelectedConversation(conv)}
                  >
                    <div className="conv-avatar-container">
                      <div className="conv-avatar linkedin-avatar">
                        {conv.user?.avatar && conv.user.avatar.startsWith('http') ? (
                          <img src={conv.user.avatar} alt={conv.user?.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                        ) : (
                          conv.user?.name?.charAt(0).toUpperCase() || '?'
                        )}
                      </div>
                      {conv.unread > 0 && <span className="unread-indicator"></span>}
                    </div>
                    <div className="conversation-info">
                      <h4 className="conv-name">{conv.user?.name}</h4>
                      <p className="last-message linkedin-preview">
                        {conv.enrolledCourse && <span style={{ fontWeight: 600 }}>{conv.enrolledCourse}</span>}
                        {conv.enrolledCourse && <br />}
                        {conv.lastMessage?.substring(0, 30)}
                        {conv.lastMessage?.length > 30 ? '...' : ''}
                      </p>
                    </div>
                    {conv.unread > 0 && <span className="unread-badge">{conv.unread}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* LinkedIn-style Chat Area */}
        <div className="messages-view linkedin-chat">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="message-header linkedin-chat-header">
                <div className="recipient-info">
                  <div className="recipient-avatar linkedin-avatar">
                    {selectedConversation.user?.avatar && selectedConversation.user.avatar.startsWith('http') ? (
                      <img src={selectedConversation.user.avatar} alt={selectedConversation.user?.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    ) : (
                      selectedConversation.user?.name?.charAt(0).toUpperCase() || '?'
                    )}
                  </div>
                  <div className="recipient-details">
                    <h3>{selectedConversation.user?.name}</h3>
                    <p className="recipient-role">
                      Student
                      {selectedConversation.user?.enrolledCourse && `  • ${selectedConversation.user?.enrolledCourse}`}
                    </p>
                  </div>
                </div>
                <div className="chat-header-actions">
                  <button className="icon-btn" title="Call">Call</button>
                  <button className="icon-btn" title="More options">More</button>
                </div>
              </div>

              {/* Messages */}
              <div className="messages-list linkedin-messages">
                {messages.length === 0 ? (
                  <div className="no-messages-placeholder">
                    <p> Start a conversation with this student!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`message-group ${msg.sender === (user?._id || 'demo-trainer') ? 'sent' : 'received'}`}
                    >
                      <div className="message linkedin-message">
                        <div className="message-bubble">
                          <p>{msg.content}</p>
                        </div>
                        <span className="message-time">
                          {new Date(msg.createdAt).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="message-input-form linkedin-input-form">
                <div className="input-container">
                  <input
                    type="text"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Write a message to student..."
                    className="message-input linkedin-message-input"
                  />
                  <div className="input-actions">
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="file-input-hidden"
                      onChange={handleAttachFile}
                      accept="*/*"
                    />
                    <button 
                      type="button" 
                      className="icon-btn" 
                      title="Add attachment"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      📎
                    </button>
                    <div style={{ position: 'relative' }}>
                      <button 
                        type="button" 
                        className="icon-btn" 
                        title="Add emoji"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      >
                        😊
                      </button>
                      {showEmojiPicker && (
                        <div style={{
                          position: 'absolute',
                          bottom: '100%',
                          right: 0,
                          background: 'white',
                          border: '1px solid var(--border-light)',
                          borderRadius: '12px',
                          padding: '12px',
                          marginBottom: '8px',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(4, 1fr)',
                          gap: '8px',
                          zIndex: 1000,
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                        }}>
                          {emojis.map((emoji, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleEmojiClick(emoji)}
                              style={{
                                fontSize: '20px',
                                cursor: 'pointer',
                                background: 'transparent',
                                border: 'none',
                                padding: '4px',
                                borderRadius: '6px',
                                transition: 'all 0.2s ease',
                              }}
                              onMouseEnter={(e) => e.target.style.background = 'var(--surface)'}
                              onMouseLeave={(e) => e.target.style.background = 'transparent'}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="btn-send-message linkedin-send-btn" 
                  disabled={!messageContent.trim()}
                  title="Send message"
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="no-selected-message linkedin-empty">
              <div className="empty-state">
                <p className="empty-icon">No messages</p>
                <h3>Select a conversation</h3>
                <p>Choose a student to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default TrainerMessages;
