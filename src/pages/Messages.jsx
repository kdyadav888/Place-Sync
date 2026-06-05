import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { messagesAPI } from '../utils/api';
import Toast from '../components/Toast';
import '../styles/Dashboard.css';
import '../styles/Messages.css';

const Messages = () => {
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

  // Demo Indian conversation data
  const demoConversations = [
    {
      _id: 'conv1',
      user: {
        _id: 'user1',
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@infosys.com',
        role: 'recruiter',
        avatar: '',
      },
      lastMessage: 'Are you interested in this Senior Developer role at Infosys?',
      unread: 2,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'conv2',
      user: {
        _id: 'user2',
        name: 'Priya Singh',
        email: 'priya.singh@tcs.com',
        role: 'recruiter',
        avatar: '',
      },
      lastMessage: 'Thank you for applying! We would like to schedule an interview.',
      unread: 0,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'conv3',
      user: {
        _id: 'user3',
        name: 'Arjun Patel',
        email: 'arjun.patel@example.com',
        role: 'student',
        avatar: 'student',
      },
      lastMessage: 'Hey, did you attend the tech meetup yesterday in Bangalore?',
      unread: 1,
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    },
    {
      _id: 'conv4',
      user: {
        _id: 'user4',
        name: 'Neha Gupta',
        email: 'neha.gupta@hcl.com',
        role: 'recruiter',
        avatar: '',
      },
      lastMessage: 'Your profile looks great! Let\'s discuss the internship opportunity.',
      unread: 0,
      createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const demoMessages = {
    'conv1': [
      { _id: 1, sender: 'user1', content: 'Hi! I saw your profile on our recruitment portal.', createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString() },
      { _id: 2, sender: 'user1', content: 'Are you interested in this Senior Developer role at Infosys?', createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString() },
      { _id: 3, sender: 'demo-user', content: 'Hello! Yes, I am very interested. Can you tell me more about the role?', createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
      { _id: 4, sender: 'user1', content: 'Sure! The role involves working on our cloud infrastructure using Node.js and AWS. Salary: 18-24 LPA.', createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
    ],
    'conv2': [
      { _id: 1, sender: 'user2', content: 'Thank you for applying to TCS!', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { _id: 2, sender: 'user2', content: 'Your resume was shortlisted. We would like to schedule an interview.', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
      { _id: 3, sender: 'user2', content: 'Interview will be on May 20 at 3 PM IST. Please confirm.', createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
    ],
    'conv3': [
      { _id: 1, sender: 'user3', content: 'Hi! How are you doing?', createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() },
      { _id: 2, sender: 'demo-user', content: 'Good! Just finished a project on React.', createdAt: new Date(Date.now() - 47 * 60 * 60 * 1000).toISOString() },
      { _id: 3, sender: 'user3', content: 'Nice! Did you attend the tech meetup yesterday in Bangalore?', createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString() },
    ],
  };

  useEffect(() => {
    const savedConversations = JSON.parse(localStorage.getItem('demoConversations') || '[]');
    if (savedConversations.length === 0) {
      setConversations(demoConversations);
      localStorage.setItem('demoConversations', JSON.stringify(demoConversations));
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
      
      if (data.success) {
        setConversations(data.conversations || []);
        if (data.conversations?.length > 0 && !selectedConversation) {
          setSelectedConversation(data.conversations[0]);
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching conversations (using demo data):', error);
      // Use demo data on error
      setConversations(demoConversations);
      if (demoConversations.length > 0) {
        setSelectedConversation(demoConversations[0]);
      }
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
      
      if (data.success) {
        setMessages(data.messages || []);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching messages (using demo data):', error);
      // Use demo data on error
      const demoMsgs = demoMessages[selectedConversation._id] || [];
      setMessages(demoMsgs);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageContent.trim() || !selectedConversation) return;

    const senderId = user?._id || 'demo-user';
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
      } else {
        setMessages(msgs => msgs.filter(m => m._id !== tempMessage._id));
        alert('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(msgs => msgs.filter(m => m._id !== tempMessage._id));
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
              placeholder="Search conversations..."
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
                        {conv.user?.avatar || ''}
                      </div>
                      {conv.unread > 0 && <span className="unread-indicator"></span>}
                    </div>
                    <div className="conversation-info">
                      <h4 className="conv-name">{conv.user?.name}</h4>
                      <p className="last-message linkedin-preview">
                        {conv.lastMessage?.substring(0, 35)}
                        {conv.lastMessage?.length > 35 ? '...' : ''}
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
                    {selectedConversation.user?.avatar || ''}
                  </div>
                  <div className="recipient-details">
                    <h3>{selectedConversation.user?.name}</h3>
                    <p className="recipient-role">
                      {selectedConversation.user?.role === 'recruiter' ? 'Recruiter' : 'Student'}
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
                    <p> Start a conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`message-group ${msg.sender === (user?._id || 'demo-user') ? 'sent' : 'received'}`}
                    >
                      <div className="message linkedin-message">
                        <div className="message-bubble">
                          <p>{msg.content}</p>
                        </div>
                        <span className="message-time">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
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
                    placeholder="Write a message..."
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
                <p>Choose a contact to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default Messages;


