
import { useState } from 'react';

const useMessagesManagement = () => {
  // Messages state - organized by workspace and channel
  const [messages, setMessages] = useState({
    1: {
      general: [
        {
          id: 1,
          user: 'PulseVerse Bot',
          avatar: 'https://via.placeholder.com/40',
          text: 'Welcome to the #general channel! This is where the team discusses work matters.',
          timestamp: new Date().toISOString()
        },
        {
          id: 2,
          user: 'karthik',
          avatar: 'https://via.placeholder.com/40',
          text: 'Hey everyone! How are you all doing today?',
          timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
        },
        {
          id: 3,
          user: 'sijin',
          avatar: 'https://via.placeholder.com/40',
          text: "I'm doing great! Working on the new project design.",
          timestamp: new Date(Date.now() - 3000000).toISOString() // 50 minutes ago
        },
        {
          id: 4,
          user: 'farhan',
          avatar: 'https://via.placeholder.com/40',
          text: 'Just finished the backend implementation. Let me know when you want to test it.',
          timestamp: new Date(Date.now() - 1800000).toISOString() // 30 minutes ago
        }
      ],
      random: [
        {
          id: 1,
          user: 'PulseVerse Bot',
          avatar: 'https://via.placeholder.com/40',
          text: 'Welcome to the #random channel! This is where you can chat about non-work topics.',
          timestamp: new Date().toISOString()
        },
        {
          id: 2,
          user: 'karthik',
          avatar: 'https://via.placeholder.com/40',
          text: 'Anyone watched the game last night?',
          timestamp: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
        },
        {
          id: 3,
          user: 'farhan',
          avatar: 'https://via.placeholder.com/40',
          text: 'Yeah! It was amazing! Did you see that last-minute goal?',
          timestamp: new Date(Date.now() - 6900000).toISOString() // 1 hour 55 minutes ago
        }
      ]
    }
  });
  
  // Handle sending new messages
  const handleSendMessage = (text, attachments, user, workspaceId, currentChannel) => {
    if (!text.trim() && (!attachments || attachments.length === 0)) return;
    
    const now = new Date();
    
    const newMessage = {
      id: Date.now(),
      user: user?.username || user?.name || user?.email?.split('@')[0] || 'User',
      avatar: 'https://via.placeholder.com/40',
      text: text,
      timestamp: now.toISOString(),
      attachments: attachments || []
    };
    
    setMessages(prevMessages => {
      const workspaceMessages = {...(prevMessages[workspaceId] || {})};
      
      if (!workspaceMessages[currentChannel]) {
        workspaceMessages[currentChannel] = [];
      }
      
      workspaceMessages[currentChannel] = [
        ...workspaceMessages[currentChannel],
        newMessage
      ];
      
      return {
        ...prevMessages,
        [workspaceId]: workspaceMessages
      };
    });
  };
  
  return {
    messages,
    setMessages,
    handleSendMessage
  };
};

export default useMessagesManagement;
