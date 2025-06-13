import { useState } from 'react';
import { addComment, getComments } from '../../services/commentService';

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

  // Direct Messages state - organized by username
  const [directMessages, setDirectMessages] = useState({
    'karthik': [
      {
        id: 1,
        user: 'You',
        avatar: 'https://via.placeholder.com/40',
        text: 'Hi Karthik, how are you doing today?',
        timestamp: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      },
      {
        id: 2,
        user: 'karthik',
        avatar: 'https://via.placeholder.com/40',
        text: 'Hey there! I\'m doing well, thanks for asking. How about you?',
        timestamp: new Date(Date.now() - 85800000).toISOString() // 23 hours, 50 minutes ago
      },
      {
        id: 3,
        user: 'You',
        avatar: 'https://via.placeholder.com/40',
        text: 'I\'m great! Just working on the new features for our project.',
        timestamp: new Date(Date.now() - 85200000).toISOString() // 23 hours, 40 minutes ago
      },
      {
        id: 4,
        user: 'karthik',
        avatar: 'https://via.placeholder.com/40',
        text: 'Awesome! Let me know if you need any help with that.',
        timestamp: new Date(Date.now() - 84600000).toISOString() // 23 hours, 30 minutes ago
      }
    ],
    'sijin': [
      {
        id: 1,
        user: 'You',
        avatar: 'https://via.placeholder.com/40',
        text: 'Hey Sijin, did you get a chance to look at my pull request?',
        timestamp: new Date(Date.now() - 172800000).toISOString() // 2 days ago
      },
      {
        id: 2,
        user: 'sijin',
        avatar: 'https://via.placeholder.com/40',
        text: 'Yes, I did! Looks good, just left a few comments for minor improvements.',
        timestamp: new Date(Date.now() - 172200000).toISOString() // 2 days ago, 10 minutes later
      }
    ],
    'farhan': [
      {
        id: 1,
        user: 'farhan',
        avatar: 'https://via.placeholder.com/40',
        text: 'Hi there! Just checking in about the meeting tomorrow.',
        timestamp: new Date(Date.now() - 259200000).toISOString() // 3 days ago
      },
      {
        id: 2,
        user: 'You',
        avatar: 'https://via.placeholder.com/40',
        text: 'Hey Farhan! Yes, I\'ll be there. 10 AM, right?', // Fixed the apostrophe here
        timestamp: new Date(Date.now() - 258600000).toISOString() // 3 days ago, 10 minutes later
      },
      {
        id: 3,
        user: 'farhan',
        avatar: 'https://via.placeholder.com/40',
        text: 'That\'s right. Looking forward to it!',
        timestamp: new Date(Date.now() - 258000000).toISOString() // 3 days ago, 20 minutes later
      }
    ]
  });
  
  // Handle sending new messages - NOW CONNECTED TO DJANGO BACKEND
  const handleSendMessage = async (text, attachments, user, workspaceId, currentChannel) => {
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
    
    // First, update local state for immediate UI feedback
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

    // BACKEND INTEGRATION: Send to Django backend
    try {
      const commentData = {
        text: text,
        user: user?.username || user?.name || user?.email?.split('@')[0] || 'User',
        workspace_id: workspaceId,
        channel: currentChannel,
        attachments: attachments || [],
        timestamp: now.toISOString()
      };

      // Call your Django API to save the comment
      const savedComment = await addComment(commentData);
      
      console.log('Comment saved to backend:', savedComment);
      
      // Optionally update the message with the backend ID
      setMessages(prevMessages => {
        const workspaceMessages = {...prevMessages[workspaceId]};
        const channelMessages = [...workspaceMessages[currentChannel]];
        const messageIndex = channelMessages.findIndex(msg => msg.id === newMessage.id);
        
        if (messageIndex !== -1) {
          channelMessages[messageIndex] = {
            ...channelMessages[messageIndex],
            backendId: savedComment.id // Store the backend ID
          };
        }
        
        workspaceMessages[currentChannel] = channelMessages;
        
        return {
          ...prevMessages,
          [workspaceId]: workspaceMessages
        };
      });
      
    } catch (error) {
      console.error('Failed to save comment to backend:', error);
      // You could show an error toast here or retry mechanism
      // For now, the message stays in local state even if backend fails
    }
  };

  // Handle sending direct messages - ALSO CONNECTED TO BACKEND
  const handleSendDirectMessage = async (text, attachments, user, recipientName) => {
    if (!text.trim() && (!attachments || attachments.length === 0)) return;
    
    const now = new Date();
    
    const newMessage = {
      id: Date.now(),
      user: 'You',
      avatar: 'https://via.placeholder.com/40',
      text: text,
      timestamp: now.toISOString(),
      attachments: attachments || []
    };
    
    // First, update local state
    setDirectMessages(prevDMs => {
      const userMessages = [...(prevDMs[recipientName] || [])];
      
      return {
        ...prevDMs,
        [recipientName]: [
          ...userMessages,
          newMessage
        ]
      };
    });

    // BACKEND INTEGRATION: Send direct message to Django
    try {
      const dmData = {
        text: text,
        sender: user?.username || user?.name || user?.email?.split('@')[0] || 'User',
        recipient: recipientName,
        attachments: attachments || [],
        timestamp: now.toISOString(),
        is_direct_message: true
      };

      const savedDM = await addComment(dmData);
      console.log('Direct message saved to backend:', savedDM);
      
    } catch (error) {
      console.error('Failed to save direct message to backend:', error);
    }
  };

  // NEW FUNCTION: Load messages from backend when switching channels
  const loadMessagesFromBackend = async (workspaceId, channelName) => {
    try {
      const pageId = `${workspaceId}_${channelName}`;
      const backendMessages = await getComments(pageId);
      
      // Convert backend messages to your frontend format
      const formattedMessages = backendMessages.map(msg => ({
        id: msg.id,
        user: msg.user,
        avatar: 'https://via.placeholder.com/40',
        text: msg.text,
        timestamp: msg.timestamp,
        attachments: msg.attachments || [],
        backendId: msg.id
      }));

      // Update local state with backend messages
      setMessages(prevMessages => ({
        ...prevMessages,
        [workspaceId]: {
          ...prevMessages[workspaceId],
          [channelName]: formattedMessages
        }
      }));
      
    } catch (error) {
      console.error('Failed to load messages from backend:', error);
    }
  };
  
  return {
    messages,
    directMessages,
    setMessages,
    setDirectMessages,
    handleSendMessage,
    handleSendDirectMessage,
    loadMessagesFromBackend // NEW: Function to load from backend
  };
};

export default useMessagesManagement;
