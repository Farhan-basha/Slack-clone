
import React from 'react';
import './ChatBody.css';

const ChatBody = ({ messages = [], onUserAvatarClick }) => {
  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.timestamp);
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    
    groups[dateKey].push(message);
    return groups;
  }, {});
  
  // Format date for display
  const formatDateHeader = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      // Format: Monday, January 1
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };
  
  // Format time from timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  
  // Get user initials for avatar
  const getUserInitials = (name) => {
    return name.charAt(0).toUpperCase();
  };

  // Handle avatar click
  const handleAvatarClick = (username) => {
    if (onUserAvatarClick) {
      onUserAvatarClick(username);
    }
  };
  
  return (
    <div className="chat-body">
      {messages.length === 0 ? (
        <div className="no-messages">
          No messages in this channel yet. Start a conversation!
        </div>
      ) : (
        Object.keys(groupedMessages).sort().map(dateKey => (
          <div key={dateKey} className="message-group">
            <div className="date-divider">
              <hr />
              <span>{formatDateHeader(dateKey)}</span>
              <hr />
            </div>
            
            {groupedMessages[dateKey].map((message) => (
              <div key={message.id} className="message">
                <div 
                  className="message-avatar" 
                  onClick={() => handleAvatarClick(message.user)}
                >
                  {message.avatar.includes('placeholder') ? (
                    <div className="avatar-initial">
                      {getUserInitials(message.user)}
                    </div>
                  ) : (
                    <img src={message.avatar} alt={message.user} />
                  )}
                </div>
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-user">{message.user}</span>
                    <span className="message-timestamp">{formatTime(message.timestamp)}</span>
                  </div>
                  <div className="message-text">
                    {message.text}
                  </div>
                  
                  {/* Display attachments if any */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="message-attachments">
                      {message.attachments.map((attachment, index) => (
                        <div key={index} className="message-attachment">
                          {attachment.type?.startsWith('image/') ? (
                            <img src={attachment.preview} alt="attachment" />
                          ) : (
                            <div className="file-attachment">
                              <div className="file-type">
                                {attachment.name?.split('.').pop().toUpperCase()}
                              </div>
                              <div className="file-name">{attachment.name}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default ChatBody;
