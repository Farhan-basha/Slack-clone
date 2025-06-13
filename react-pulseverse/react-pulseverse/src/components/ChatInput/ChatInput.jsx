
import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Send, X, Share, AtSign, Bold, Italic, Code } from 'lucide-react';
import './ChatInput.css';
import { Textarea } from '@/components/ui/textarea';

const ChatInput = ({ onSendMessage, currentChannel, isDM = false }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [showMentionsList, setShowMentionsList] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [showFormatting, setShowFormatting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);

  // Common emojis for quick selection
  const commonEmojis = ['😊', '👍', '🎉', '❤️', '🔥', '👀', '🙌', '😂', '🤔', '👏'];

  // Mock users for @mentions (in a real app, this would come from an API)
  const users = [
    { id: 1, name: 'karthik' },
    { id: 2, name: 'sijin' },
    { id: 3, name: 'farhan' },
    { id: 4, name: 'David Johnson' },
    { id: 5, name: 'Sarah Williams' },
  ];

  // Mock channels for sharing
  const channels = ['general', 'random', 'development', 'marketing'];

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Setup drag and drop listeners
  useEffect(() => {
    const dropArea = dropAreaRef.current;
    if (!dropArea) return;

    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDraggingOver(true);
    };

    const handleDragLeave = () => {
      setIsDraggingOver(false);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setIsDraggingOver(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(Array.from(e.dataTransfer.files));
      }
    };

    dropArea.addEventListener('dragover', handleDragOver);
    dropArea.addEventListener('dragleave', handleDragLeave);
    dropArea.addEventListener('drop', handleDrop);

    return () => {
      dropArea.removeEventListener('dragover', handleDragOver);
      dropArea.removeEventListener('dragleave', handleDragLeave);
      dropArea.removeEventListener('drop', handleDrop);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((message.trim() || attachments.length > 0)) {
      onSendMessage(message, attachments);
      setMessage('');
      setAttachments([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleFiles = (files) => {
    const validFiles = [];
    
    for (const file of files) {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }
      
      // Create a preview URL for the file
      const preview = URL.createObjectURL(file);
      
      validFiles.push({
        file,
        preview,
        name: file.name,
        type: file.type,
        size: file.size
      });
    }
    
    setAttachments([...attachments, ...validFiles]);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Enter (but not with Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
    
    // Check for formatting shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch(e.key) {
        case 'b':
          e.preventDefault();
          insertFormatting('*');
          break;
        case 'i':
          e.preventDefault();
          insertFormatting('_');
          break;
        case 'k':
          e.preventDefault();
          insertFormatting('`');
          break;
        default:
          break;
      }
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMessage(value);
    
    // Check for emoji trigger
    if (value.match(/:[\w]*$/)) {
      setShowEmojiPicker(true);
    } else {
      setShowEmojiPicker(false);
    }
    
    // Check if the user is trying to mention someone
    const lastWord = value.split(' ').pop();
    if (lastWord.startsWith('@')) {
      setMentionQuery(lastWord.substring(1).toLowerCase());
      setShowMentionsList(true);
    } else {
      setShowMentionsList(false);
    }
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
    textareaRef.current.focus();
  };

  const handleEmojiClick = (emoji) => {
    // Replace the current :query with the selected emoji
    const cursorPosition = textareaRef.current.selectionStart;
    const textBeforeCursor = message.substring(0, cursorPosition);
    const textAfterCursor = message.substring(cursorPosition);
    
    const colonIndex = textBeforeCursor.lastIndexOf(':');
    if (colonIndex !== -1) {
      const newMessage = textBeforeCursor.substring(0, colonIndex) + emoji + textAfterCursor;
      setMessage(newMessage);
    } else {
      setMessage(message + emoji);
    }
    
    setShowEmojiPicker(false);
    textareaRef.current.focus();
  };

  const insertFormatting = (marker) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = message.substring(start, end);
    
    const newMessage = 
      message.substring(0, start) +
      marker + selectedText + marker +
      message.substring(end);
    
    setMessage(newMessage);
    
    // Set cursor position after formatting
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + marker.length, end + marker.length);
    }, 0);
  };

  const openShareModal = (attachment) => {
    setSelectedAttachment(attachment);
    setShowShareModal(true);
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word')) return '📝';
    if (fileType.includes('excel') || fileType.includes('sheet')) return '📊';
    if (fileType.includes('video')) return '🎬';
    if (fileType.includes('audio')) return '🎵';
    if (fileType.includes('zip') || fileType.includes('archive')) return '🗜️';
    return '📁';
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Filter users based on mention query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  return (
    <div className="chat-input">
      <div 
        ref={dropAreaRef} 
        className={`drop-area ${isDraggingOver ? 'dragging-over' : ''}`}
      >
        {isDraggingOver && (
          <div className="drop-overlay">
            <Paperclip size={32} />
            <span>Drop files here</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            {/* Attachments preview */}
            {attachments.length > 0 && (
              <div className="attachments-preview">
                {attachments.map((attachment, index) => (
                  <div key={index} className="attachment">
                    {attachment.type.startsWith('image/') ? (
                      <img src={attachment.preview} alt={attachment.name} />
                    ) : attachment.type.startsWith('video/') ? (
                      <video controls>
                        <source src={attachment.preview} type={attachment.type} />
                        Your browser does not support video playback.
                      </video>
                    ) : (
                      <div className="file-icon">
                        <span>{getFileIcon(attachment.type)}</span>
                        <span className="file-name">{attachment.name}</span>
                        <span className="file-size">{formatFileSize(attachment.size)}</span>
                      </div>
                    )}
                    <button 
                      type="button" 
                      className="remove-attachment"
                      onClick={() => removeAttachment(index)}
                    >
                      <X size={16} />
                    </button>
                    <button 
                      type="button" 
                      className="share-attachment"
                      onClick={() => openShareModal(attachment)}
                    >
                      <Share size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Formatting toolbar */}
            <div className="formatting-toolbar">
              <button 
                type="button" 
                className="format-button" 
                onClick={() => insertFormatting('*')}
                title="Bold (Ctrl+B)"
              >
                <Bold size={16} />
              </button>
              <button 
                type="button" 
                className="format-button" 
                onClick={() => insertFormatting('_')}
                title="Italic (Ctrl+I)"
              >
                <Italic size={16} />
              </button>
              <button 
                type="button" 
                className="format-button" 
                onClick={() => insertFormatting('`')}
                title="Code (Ctrl+K)"
              >
                <Code size={16} />
              </button>
              <button 
                type="button" 
                className="format-button"
                onClick={() => setShowMentionsList(true)}
                title="Mention someone"
              >
                <AtSign size={16} />
              </button>
            </div>
            
            <div className="message-input-wrapper">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={isDM ? `Message ${currentChannel}` : `Message #${currentChannel}`}
                className="message-input"
                rows={1}
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
              
              {/* Emoji picker */}
              {showEmojiPicker && (
                <div className="emoji-picker">
                  {commonEmojis.map((emoji, index) => (
                    <button 
                      key={index}
                      type="button"
                      className="emoji-button"
                      onClick={() => handleEmojiClick(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="input-actions">
              <button 
                type="button" 
                className="attach-button"
                onClick={() => fileInputRef.current.click()}
                title="Attach files"
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
              {(message.trim() || attachments.length > 0) && (
                <button type="submit" className="send-button" title="Send message">
                  <Send size={20} />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Share Modal */}
      {showShareModal && selectedAttachment && (
        <div className="modal-backdrop">
          <div className="modal share-modal">
            <div className="modal-header">
              <div className="modal-title">Share File</div>
              <button className="modal-close" onClick={() => setShowShareModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="selected-file">
                <div className="file-preview">
                  {selectedAttachment.type.startsWith('image/') ? (
                    <img src={selectedAttachment.preview} alt={selectedAttachment.name} />
                  ) : (
                    <div className="file-icon large">
                      <span>{getFileIcon(selectedAttachment.type)}</span>
                    </div>
                  )}
                </div>
                <div className="file-name">{selectedAttachment.name}</div>
              </div>
              
              <div className="share-section">
                <h4>Share with Channels</h4>
                <div className="share-options">
                  {channels.map((channel, index) => (
                    <div key={index} className="share-option">
                      <input type="checkbox" id={`channel-${index}`} />
                      <label htmlFor={`channel-${index}`}>#{channel}</label>
                    </div>
                  ))}
                </div>
                
                <h4>Share with People</h4>
                <div className="share-options">
                  {users.map((user, index) => (
                    <div key={index} className="share-option">
                      <input type="checkbox" id={`user-${index}`} />
                      <label htmlFor={`user-${index}`}>{user.name}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-cancel" onClick={() => setShowShareModal(false)}>Cancel</button>
              <button className="btn btn-submit" onClick={() => setShowShareModal(false)}>Share</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInput;
