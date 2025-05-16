
import React, { useRef, useEffect } from 'react';
import Header from '../Header/Header';
import ChatBody from '../ChatBody/ChatBody';
import ChatInput from '../ChatInput/ChatInput';

const MainContent = ({ 
  currentChannel, 
  currentMessages, 
  currentWorkspace, 
  onHeaderMenuAction, 
  onUserAvatarClick, 
  onSendMessage 
}) => {
  const chatBodyRef = useRef(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatBodyRef.current) {
      const scrollTimeout = setTimeout(() => {
        chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
      }, 100); // Small delay to ensure content is rendered
      
      return () => clearTimeout(scrollTimeout);
    }
  }, [currentMessages]);
  
  return (
    <div className="main-content">
      <Header 
        channelName={currentChannel} 
        workspaceName={currentWorkspace.name} 
        onMenuClick={onHeaderMenuAction}
      />
      
      <div className="chat-body-wrapper" ref={chatBodyRef}>
        <ChatBody 
          messages={currentMessages} 
          onUserAvatarClick={onUserAvatarClick}
        />
      </div>
      
      <ChatInput 
        onSendMessage={onSendMessage} 
        currentChannel={currentChannel} 
      />
    </div>
  );
};

export default MainContent;
