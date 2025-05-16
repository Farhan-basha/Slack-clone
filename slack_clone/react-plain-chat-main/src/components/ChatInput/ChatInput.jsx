
import React, { useState, useRef } from 'react';
import { Paperclip, Send, X } from 'lucide-react';
import './ChatInput.css';

const ChatInput = ({ onSendMessage, currentChannel }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [showMentionsList, setShowMentionsList] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const fileInputRef = useRef(null);

  // Mock users for @mentions (in a real app, this would come from an API)
  const users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'David Johnson' },
    { id: 4, name: 'Sarah Williams' },
    { id: 5, name: 'Michael Brown' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((message.trim() || attachments.length > 0)) {
      onSendMessage(message, attachments);
      setMessage('');
      setAttachments([]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);
    
    // Check if the user is trying to mention someone
    const lastWord = value.split(' ').pop();
    if (lastWord.startsWith('@')) {
      setMentionQuery(lastWord.substring(1).toLowerCase());
      setShowMentionsList(true);
    } else {
      setShowMentionsList(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Convert files to attachments with preview URLs
    const newAttachments = files.map(file => {
      return {
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        type: file.type
      };
    });
    
    setAttachments([...attachments, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    const newAttachments = [...attachments];
    URL.revokeObjectURL(newAttachments[index].preview);
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };

  const handleMentionClick = (user) => {
    // Replace the current @query with the selected username
    const words = message.split(' ');
    words[words.length - 1] = `@${user.name} `;
    setMessage(words.join(' '));
    setShowMentionsList(false);
  };

  // Filter users based on mention query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  return (
    <div className="chat-input">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          {/* Attachments preview */}
          {attachments.length > 0 && (
            <div className="attachments-preview">
              {attachments.map((attachment, index) => (
                <div key={index} className="attachment">
                  {attachment.type.startsWith('image/') ? (
                    <img src={attachment.preview} alt={attachment.name} />
                  ) : (
                    <div className="file-icon">
                      <span>{attachment.name.split('.').pop().toUpperCase()}</span>
                    </div>
                  )}
                  <button 
                    type="button" 
                    className="remove-attachment"
                    onClick={() => removeAttachment(index)}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="message-input-wrapper">
            <input
              type="text"
              value={message}
              onChange={handleInputChange}
              placeholder={`Message #${currentChannel}`}
              className="message-input"
            />

            {/* Mentions dropdown */}
            {showMentionsList && filteredUsers.length > 0 && (
              <div className="mentions-list">
                {filteredUsers.map(user => (
                  <div 
                    key={user.id}
                    className="mention-item"
                    onClick={() => handleMentionClick(user)}
                  >
                    <div className="mention-avatar">
                      {user.name.charAt(0)}
                    </div>
                    <div className="mention-name">{user.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="input-actions">
            <button 
              type="button" 
              className="attach-button"
              onClick={() => fileInputRef.current.click()}
            >
              <Paperclip size={20} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <button type="submit" className="send-button">
              <Send size={20} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
